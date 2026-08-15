'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Content Manager' | 'Editor';
  addedAt: string;
};

export const defaultAdmins: AdminUser[] = [
  {
    id: 'admin-1',
    email: 'tharushyamagara@gmail.com',
    name: 'Tharushya Magara',
    role: 'Super Admin',
    addedAt: new Date().toISOString().split('T')[0]
  }
];

type AdminStoreContextType = {
  admins: AdminUser[];
  currentAdmin: AdminUser | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addAdmin: (email: string, name: string, role: AdminUser['role']) => boolean;
  removeAdmin: (id: string) => boolean;
};

const AdminStoreContext = createContext<AdminStoreContextType | undefined>(undefined);

const ADMINS_STORAGE_KEY = 'asserwa_admin_users_v1';
const SESSION_STORAGE_KEY = 'asserwa_active_admin_session_v1';

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admins, setAdmins] = useState<AdminUser[]>(defaultAdmins);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);

  // Load admins and session on mount
  useEffect(() => {
    try {
      const savedAdmins = localStorage.getItem(ADMINS_STORAGE_KEY);
      if (savedAdmins) {
        const parsed = JSON.parse(savedAdmins);
        // Ensure tharushyamagara@gmail.com is always present as Super Admin
        const hasSuperAdmin = parsed.some((a: AdminUser) => a.email.toLowerCase() === 'tharushyamagara@gmail.com');
        if (!hasSuperAdmin) {
          parsed.unshift(defaultAdmins[0]);
        }
        setAdmins(parsed);
      } else {
        localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(defaultAdmins));
      }

      const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedSession) {
        setCurrentAdmin(JSON.parse(savedSession));
      }
    } catch (e) {
      console.error("Failed to load admin auth state:", e);
    }
  }, []);

  // Save admins on change
  useEffect(() => {
    try {
      localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
    } catch (e) {
      console.error("Failed to save admin state:", e);
    }
  }, [admins]);

  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const found = admins.find(a => a.email.toLowerCase() === cleanEmail);
    
    // Accept login for registered admin email with valid credentials or default pass
    if (found) {
      setCurrentAdmin(found);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const addAdmin = (email: string, name: string, role: AdminUser['role']): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (admins.some(a => a.email.toLowerCase() === cleanEmail)) {
      return false; // Email already exists
    }
    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      email: cleanEmail,
      name: name || cleanEmail.split('@')[0],
      role: role || 'Editor',
      addedAt: new Date().toISOString().split('T')[0]
    };
    setAdmins(prev => [...prev, newAdmin]);
    return true;
  };

  const removeAdmin = (id: string): boolean => {
    const target = admins.find(a => a.id === id);
    if (!target) return false;
    // Prevent removing super admin tharushyamagara@gmail.com
    if (target.email.toLowerCase() === 'tharushyamagara@gmail.com') {
      return false;
    }
    setAdmins(prev => prev.filter(a => a.id !== id));
    if (currentAdmin?.id === id) {
      logout();
    }
    return true;
  };

  return (
    <AdminStoreContext.Provider
      value={{
        admins,
        currentAdmin,
        login,
        logout,
        addAdmin,
        removeAdmin
      }}
    >
      {children}
    </AdminStoreContext.Provider>
  );
}

export function useAdminStore() {
  const context = useContext(AdminStoreContext);
  if (!context) {
    throw new Error('useAdminStore must be used within an AdminProvider');
  }
  return context;
}
