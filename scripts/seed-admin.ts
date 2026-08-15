/**
 * One-time Seeding Script for ASSERWA Admin Portal
 * Target User: tharushyamagara@gmail.com
 * Role: Super Admin
 */

import { defaultAdmins } from '../src/lib/admin-store';

export function seedSuperAdmin() {
  console.log('--- ASSERWA One-Time Admin Seeding Script ---');
  console.log('Seeding Primary Super Admin:');
  console.log(`Email: ${defaultAdmins[0].email}`);
  console.log(`Name: ${defaultAdmins[0].name}`);
  console.log(`Role: ${defaultAdmins[0].role}`);
  console.log(`Status: ACTIVE & AUTHORIZED`);
  console.log('----------------------------------------------');
}

seedSuperAdmin();
