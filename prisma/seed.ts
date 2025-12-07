import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  try {
    // Check if roles already exist
    const existingRoles = await prisma.role.findMany();
    console.log('Found existing roles:', existingRoles.length);

    // Create system roles only if they don't exist
    console.log('Creating system roles...');
    const rolesToCreate = [
      {
        name: 'SUPER_ADMIN',
        description: 'Super Administrator with full access',
        isSystem: true,
        permissions: {
          '*': ['create', 'read', 'update', 'delete', 'manage'],
          users: ['create', 'read', 'update', 'delete', 'manage'],
          students: ['create', 'read', 'update', 'delete', 'manage'],
          teachers: ['create', 'read', 'update', 'delete', 'manage'],
          courses: ['create', 'read', 'update', 'delete', 'manage'],
          grades: ['create', 'read', 'update', 'delete', 'manage'],
          attendance: ['create', 'read', 'update', 'delete', 'manage'],
          classes: ['create', 'read', 'update', 'delete','manage'],

        }
      },
      {
        name: 'ADMIN', 
        description: 'Administrator',
        isSystem: true,
        permissions: {
          users: ['create', 'read', 'update', 'delete'],
          students: ['create', 'read', 'update', 'delete'],
          teachers: ['create', 'read', 'update', 'delete'],
          courses: ['create', 'read', 'update', 'delete'],
          grades: ['read', 'update'],
          attendance: ['create', 'read', 'update', 'delete'],
          classes: ['create', 'read', 'update', 'delete'],

        }
      },
      {
        name: 'TEACHER',
        description: 'Teacher',
        isSystem: true,
        permissions: {
          students: ['read'],
          courses: ['read'],
          grades: ['create', 'read', 'update'],
          attendance: ['create', 'read', 'update']
        }
      }
    ];

    const roles = [];
    for (const roleData of rolesToCreate) {
      const existingRole = await prisma.role.findUnique({
        where: { name: roleData.name }
      });
      
      if (existingRole) {
        console.log(`Role ${roleData.name} already exists, updating permissions...`);
        // Update existing role with permissions
        const updatedRole = await prisma.role.update({
          where: { name: roleData.name },
          data: { permissions: roleData.permissions }
        });
        roles.push(updatedRole);
      } else {
        const role = await prisma.role.create({
          data: roleData
        });
        console.log(`Created role: ${role.name}`);
        roles.push(role);
      }
    }
    // Hash password
    const hashedPassword = await bcrypt.hash('Admin123!', 12);
    
    // Create super admin user if doesn't exist
    console.log('Checking/Creating super admin user...');
    const existingSuperAdmin = await prisma.user.findUnique({
      where: { email: 'superadmin@school.com' }
    });

    if (existingSuperAdmin) {
      console.log('Super admin already exists:', existingSuperAdmin.email);
    } else {
      const superAdmin = await prisma.user.create({
        data: {
          username: 'superadmin',
          email: 'superadmin@school.com',
          passwordHash: hashedPassword,
          firstName: 'Super',
          lastName: 'Admin',
          roleId: roles.find(r => r.name === 'SUPER_ADMIN')!.id,
          isActive: true
        }
      });
      console.log('Created super admin:', superAdmin.email);
    }

    // Create admin user if doesn't exist
    console.log('Checking/Creating admin user...');
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@school.com' }
    });

    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
    } else {
      const admin = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@school.com',
          passwordHash: hashedPassword,
          firstName: 'System',
          lastName: 'Admin',
          roleId: roles.find(r => r.name === 'ADMIN')!.id,
          isActive: true
        }
      });
      console.log('Created admin:', admin.email);
    }

    console.log('Database seeding completed successfully!');
    console.log('Default credentials:');
    console.log('Super Admin: superadmin@school.com / Admin123!');
    console.log('Admin: admin@school.com / Admin123!');

  } catch (error) {
    console.error('Seeding error:', error);
    throw error;
  }
}



main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });