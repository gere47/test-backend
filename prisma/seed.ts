import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // =============================================
  // 1. CREATE ROLES
  // =============================================
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Full system access' },
    { name: 'ADMIN', description: 'School administrator' },
    { name: 'PRINCIPAL', description: 'School principal' },
    { name: 'TEACHER', description: 'Teaching staff' },
    { name: 'ACCOUNTANT', description: 'Finance department' },
    { name: 'LIBRARIAN', description: 'Library management' },
    { name: 'STUDENT', description: 'Student account' },
    { name: 'PARENT', description: 'Parent/Guardian account' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }
  console.log('✅ Roles seeded');

  // =============================================
  // 2. CREATE PERMISSIONS
  // =============================================
  const permissions = [
    // User Management
    { name: 'user:create', module: 'USER', description: 'Create users' },
    { name: 'user:read', module: 'USER', description: 'View users' },
    { name: 'user:update', module: 'USER', description: 'Update users' },
    { name: 'user:delete', module: 'USER', description: 'Delete users' },
    
    // Student Management
    { name: 'student:create', module: 'STUDENT', description: 'Create students' },
    { name: 'student:read', module: 'STUDENT', description: 'View students' },
    { name: 'student:update', module: 'STUDENT', description: 'Update students' },
    { name: 'student:delete', module: 'STUDENT', description: 'Delete students' },
    { name: 'student:promote', module: 'STUDENT', description: 'Promote students' },
    
    // Teacher Management
    { name: 'teacher:create', module: 'TEACHER', description: 'Create teachers' },
    { name: 'teacher:read', module: 'TEACHER', description: 'View teachers' },
    { name: 'teacher:update', module: 'TEACHER', description: 'Update teachers' },
    { name: 'teacher:delete', module: 'TEACHER', description: 'Delete teachers' },
    
    // Class Management
    { name: 'class:create', module: 'CLASS', description: 'Create classes' },
    { name: 'class:read', module: 'CLASS', description: 'View classes' },
    { name: 'class:update', module: 'CLASS', description: 'Update classes' },
    { name: 'class:delete', module: 'CLASS', description: 'Delete classes' },
    
    // Attendance
    { name: 'attendance:mark', module: 'ATTENDANCE', description: 'Mark attendance' },
    { name: 'attendance:read', module: 'ATTENDANCE', description: 'View attendance' },
    { name: 'attendance:update', module: 'ATTENDANCE', description: 'Update attendance' },
    
    // Grades/Exams
    { name: 'grade:create', module: 'GRADE', description: 'Create grades' },
    { name: 'grade:read', module: 'GRADE', description: 'View grades' },
    { name: 'grade:update', module: 'GRADE', description: 'Update grades' },
    { name: 'grade:delete', module: 'GRADE', description: 'Delete grades' },
    
    // Finance
    { name: 'fee:create', module: 'FEE', description: 'Create fee structures' },
    { name: 'fee:read', module: 'FEE', description: 'View fees' },
    { name: 'fee:update', module: 'FEE', description: 'Update fees' },
    { name: 'fee:delete', module: 'FEE', description: 'Delete fees' },
    { name: 'payment:collect', module: 'FEE', description: 'Collect payments' },
    { name: 'payment:read', module: 'FEE', description: 'View payments' },
    
    // Library
    { name: 'book:create', module: 'LIBRARY', description: 'Add books' },
    { name: 'book:read', module: 'LIBRARY', description: 'View books' },
    { name: 'book:update', module: 'LIBRARY', description: 'Update books' },
    { name: 'book:delete', module: 'LIBRARY', description: 'Delete books' },
    { name: 'book:issue', module: 'LIBRARY', description: 'Issue books' },
    { name: 'book:return', module: 'LIBRARY', description: 'Return books' },
    
    // System
    { name: 'system:settings', module: 'SYSTEM', description: 'Manage system settings' },
    { name: 'audit:read', module: 'SYSTEM', description: 'View audit logs' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { name: perm.name },
      update: {},
      create: perm,
    });
  }
  console.log('✅ Permissions seeded');

  // =============================================
  // 3. ASSIGN PERMISSIONS TO ROLES
  // =============================================
  const assignPermissions = async (roleName: string, permissionNames: string[]) => {
    const role = await prisma.role.findUnique({ where: { name: roleName } });
    if (!role) {
      console.log(`❌ Role ${roleName} not found`);
      return;
    }

    for (const permName of permissionNames) {
      const perm = await prisma.permission.findUnique({
        where: { name: permName },
      });
      if (perm) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: { roleId: role.id, permissionId: perm.id },
          },
          update: {},
          create: { roleId: role.id, permissionId: perm.id },
        });
      }
    }
  };

  // SUPER_ADMIN - All permissions
  await assignPermissions('SUPER_ADMIN', permissions.map(p => p.name));

  // ADMIN - Most administrative permissions
  await assignPermissions('ADMIN', [
    'user:create', 'user:read', 'user:update',
    'student:create', 'student:read', 'student:update', 'student:delete', 'student:promote',
    'teacher:create', 'teacher:read', 'teacher:update', 'teacher:delete',
    'class:create', 'class:read', 'class:update', 'class:delete',
    'attendance:read',
    'grade:read',
    'fee:create', 'fee:read', 'fee:update', 'fee:delete',
    'payment:collect', 'payment:read',
    'book:create', 'book:read', 'book:update', 'book:delete',
    'audit:read',
  ]);

  // PRINCIPAL - Academic oversight
  await assignPermissions('PRINCIPAL', [
    'student:read', 'student:update',
    'teacher:read', 'teacher:update',
    'class:read',
    'attendance:read',
    'grade:read', 'grade:create', 'grade:update',
    'fee:read',
    'book:read',
  ]);

  // TEACHER - Teaching activities
  await assignPermissions('TEACHER', [
    'student:read',
    'attendance:mark', 'attendance:read', 'attendance:update',
    'grade:create', 'grade:read', 'grade:update',
    'class:read',
  ]);

  // ACCOUNTANT - Financial permissions
  await assignPermissions('ACCOUNTANT', [
    'student:read',
    'fee:read',
    'payment:collect', 'payment:read',
  ]);

  // LIBRARIAN - Library management
  await assignPermissions('LIBRARIAN', [
    'student:read',
    'book:create', 'book:read', 'book:update', 'book:delete',
    'book:issue', 'book:return',
  ]);

  // STUDENT - Basic student permissions
  await assignPermissions('STUDENT', [
    'attendance:read',
    'grade:read',
    'fee:read',
    'book:read',
  ]);

  // PARENT - Parent permissions
  await assignPermissions('PARENT', [
    'attendance:read',
    'grade:read',
    'fee:read',
  ]);

  console.log('✅ Role permissions assigned');

  // =============================================
  // 4. CREATE SUPER ADMIN USER
  // =============================================
  const superAdminEmail = 'superadmin@school.com';
  const superAdminPassword = 'Admin123!'; // Change in production!
  
  const passwordHash = await bcrypt.hash(superAdminPassword, 12);

  const superAdminUser = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {},
    create: {
      email: superAdminEmail,
      passwordHash,
      fullName: 'Super Administrator',
      phone: '+1234567890',
      isEmailVerified: true,
      status: 'ACTIVE',
    },
  });

  // Assign SUPER_ADMIN role
  const superAdminRole = await prisma.role.findUnique({ where: { name: 'SUPER_ADMIN' } });
  if (superAdminRole) {
    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: superAdminUser.id,
          roleId: superAdminRole.id,
        },
      },
      update: {},
      create: {
        userId: superAdminUser.id,
        roleId: superAdminRole.id,
      },
    });
  }

  console.log('✅ Super admin user created');

  // =============================================
  // 5. CREATE SAMPLE CLASSES
  // =============================================
  const classes = [
    { name: 'Grade 1A', section: 'A', capacity: 30, roomNo: '101' },
    { name: 'Grade 1B', section: 'B', capacity: 30, roomNo: '102' },
    { name: 'Grade 2A', section: 'A', capacity: 30, roomNo: '201' },
    { name: 'Grade 2B', section: 'B', capacity: 30, roomNo: '202' },
  ];

  for (const classData of classes) {
    await prisma.class.upsert({
      where: { name: classData.name },
      update: {},
      create: {
        ...classData,
        teacherId: superAdminUser.id, // Temporary assignment
      },
    });
  }
  console.log('✅ Sample classes created');

  // =============================================
  // 6. CREATE SAMPLE SUBJECTS
  // =============================================
  const subjects = [
    { name: 'Mathematics', code: 'MATH', description: 'Basic mathematics', credits: 4 },
    { name: 'English', code: 'ENG', description: 'English language', credits: 4 },
    { name: 'Science', code: 'SCI', description: 'General science', credits: 4 },
    { name: 'Social Studies', code: 'SOC', description: 'Social sciences', credits: 3 },
    { name: 'Computer Science', code: 'COMP', description: 'Computer basics', credits: 3 },
  ];

  for (const subject of subjects) {
    await prisma.subject.upsert({
      where: { code: subject.code },
      update: {},
      create: subject,
    });
  }
  console.log('✅ Sample subjects created');

  // =============================================
  // 7. CREATE SAMPLE FEE STRUCTURES
  // =============================================
  const feeStructures = [
    { name: 'Grade 1 Monthly Fee', description: 'Monthly tuition fee for Grade 1', amount: 2000, frequency: 'MONTHLY' },
    { name: 'Grade 2 Monthly Fee', description: 'Monthly tuition fee for Grade 2', amount: 2200, frequency: 'MONTHLY' },
    { name: 'Annual Admission Fee', description: 'One-time admission fee', amount: 5000, frequency: 'ONE_TIME' },
    { name: 'Transport Fee', description: 'Monthly transport charges', amount: 1000, frequency: 'MONTHLY' },
  ];

  for (const fee of feeStructures) {
    await prisma.feeStructure.upsert({
      where: { name: fee.name },
      update: {},
      create: fee,
    });
  }
  console.log('✅ Sample fee structures created');

  // =============================================
  // 8. CREATE SAMPLE BOOKS
  // =============================================
  const books = [
    { isbn: '978-0123456789', title: 'Mathematics for Beginners', author: 'John Smith', publisher: 'Education Press', totalCopies: 10, availableCopies: 10 },
    { isbn: '978-0987654321', title: 'English Grammar', author: 'Sarah Johnson', publisher: 'Language House', totalCopies: 8, availableCopies: 8 },
    { isbn: '978-1122334455', title: 'Science Experiments', author: 'Dr. Robert Brown', publisher: 'Science World', totalCopies: 5, availableCopies: 5 },
    { isbn: '978-5566778899', title: 'Computer Basics', author: 'Mike Davis', publisher: 'Tech Publications', totalCopies: 7, availableCopies: 7 },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    });
  }
  console.log('✅ Sample books added to library');

  console.log('🎉 Database seeding completed successfully!');
  console.log('📧 Super Admin Login: superadmin@school.com');
  console.log('🔑 Password: Admin123!');
  console.log('⚠️  Remember to change the default password in production!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });