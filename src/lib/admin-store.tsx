'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: 'Super Admin' | 'Content Manager' | 'Editor';
  addedAt: string;
  password?: string;
};

export const DEFAULT_ADMIN_PASSWORD = 'AsserwaAdmin2026!';

export const defaultAdmins: AdminUser[] = [
  {
    id: 'admin-1',
    email: 'tharushyamagara@gmail.com',
    name: 'Tharushya Magara',
    role: 'Super Admin',
    addedAt: new Date().toISOString().split('T')[0],
    password: DEFAULT_ADMIN_PASSWORD
  }
];

type AdminStoreContextType = {
  admins: AdminUser[];
  currentAdmin: AdminUser | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  addAdmin: (email: string, name: string, role: AdminUser['role'], password?: string) => boolean;
  removeAdmin: (id: string) => boolean;
  changePassword: (adminEmail: string, oldPass: string, newPass: string) => { success: boolean; message: string };
  resetAdminPassword: (adminId: string, newPass: string) => { success: boolean; message: string };
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
        let parsed: AdminUser[] = JSON.parse(savedAdmins);
        
        // Ensure all admins have password property (backwards compatibility / migration)
        parsed = parsed.map(admin => {
          if (!admin.password) {
            return { ...admin, password: DEFAULT_ADMIN_PASSWORD };
          }
          return admin;
        });

        // Ensure tharushyamagara@gmail.com is always present as Super Admin
        const superAdminIdx = parsed.findIndex((a: AdminUser) => a.email.toLowerCase() === 'tharushyamagara@gmail.com');
        if (superAdminIdx === -1) {
          parsed.unshift(defaultAdmins[0]);
        } else {
          // Guarantee super admin has a valid password
          if (!parsed[superAdminIdx].password) {
            parsed[superAdminIdx].password = DEFAULT_ADMIN_PASSWORD;
          }
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
    const cleanPass = (pass || '').trim();

    // Reject immediately if either email or password is empty
    if (!cleanEmail || !cleanPass) {
      return false;
    }

    const found = admins.find(a => a.email.toLowerCase() === cleanEmail);
    if (!found) {
      return false;
    }

    // Verify password against stored password or default fallback
    const expectedPassword = found.password || DEFAULT_ADMIN_PASSWORD;
    if (cleanPass !== expectedPassword) {
      return false;
    }

    // Safe session representation (do not expose password in session store)
    const sessionUser: AdminUser = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      addedAt: found.addedAt
    };

    setCurrentAdmin(sessionUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser));
    return true;
  };

  const logout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const addAdmin = (
    email: string, 
    name: string, 
    role: AdminUser['role'], 
    password?: string
  ): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (admins.some(a => a.email.toLowerCase() === cleanEmail)) {
      return false; // Email already exists
    }
    const cleanPass = (password && password.trim()) ? password.trim() : DEFAULT_ADMIN_PASSWORD;
    const newAdmin: AdminUser = {
      id: `admin-${Date.now()}`,
      email: cleanEmail,
      name: name.trim() || cleanEmail.split('@')[0],
      role: role || 'Editor',
      addedAt: new Date().toISOString().split('T')[0],
      password: cleanPass
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

  const changePassword = (
    adminEmail: string, 
    oldPass: string, 
    newPass: string
  ): { success: boolean; message: string } => {
    const cleanEmail = adminEmail.trim().toLowerCase();
    const cleanOld = (oldPass || '').trim();
    const cleanNew = (newPass || '').trim();

    const targetAdmin = admins.find(a => a.email.toLowerCase() === cleanEmail);
    if (!targetAdmin) {
      return { success: false, message: 'Administrator account not found.' };
    }

    const currentExpectedPass = targetAdmin.password || DEFAULT_ADMIN_PASSWORD;
    if (cleanOld !== currentExpectedPass) {
      return { success: false, message: 'Current password is incorrect.' };
    }

    if (!cleanNew || cleanNew.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long.' };
    }

    setAdmins(prev => prev.map(a => 
      a.id === targetAdmin.id ? { ...a, password: cleanNew } : a
    ));
    return { success: true, message: 'Password has been updated successfully.' };
  };

  const resetAdminPassword = (
    adminId: string, 
    newPass: string
  ): { success: boolean; message: string } => {
    const cleanNew = (newPass || '').trim();
    const targetAdmin = admins.find(a => a.id === adminId);
    if (!targetAdmin) {
      return { success: false, message: 'Administrator account not found.' };
    }

    if (!cleanNew || cleanNew.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    setAdmins(prev => prev.map(a => 
      a.id === adminId ? { ...a, password: cleanNew } : a
    ));
    return { success: true, message: `Password for ${targetAdmin.name || targetAdmin.email} has been reset.` };
  };

  return (
    <AdminStoreContext.Provider
      value={{
        admins,
        currentAdmin,
        login,
        logout,
        addAdmin,
        removeAdmin,
        changePassword,
        resetAdminPassword
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
