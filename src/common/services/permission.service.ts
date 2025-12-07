// // src/common/services/permission.service.ts
// import { Injectable, Logger } from '@nestjs/common';
// import { PrismaService } from '../../database/prisma.service';

// export interface UserPermissionSummary {
//   general: string[];
//   extra: string[];
//   denied: string[];
//   final: string[];
// }

// export interface PermissionComparison {
//   sameRole: boolean;
//   generalSame: string[];
//   generalDifferent: {
//     user1Only: string[];
//     user2Only: string[];
//   };
//   extraSame: string[];
//   extraDifferent: {
//     user1Extra: string[];
//     user2Extra: string[];
//   };
//   deniedDifferent: {
//     user1Denied: string[];
//     user2Denied: string[];
//   };
//   finalSame: string[];
//   finalDifferent: {
//     user1Only: string[];
//     user2Only: string[];
//   };
// }

// @Injectable()
// export class PermissionService {
//   private readonly logger = new Logger(PermissionService.name);
  
//   constructor(private prisma: PrismaService) {}

//   /**
//    * ✅ Get user's complete permission summary
//    */
//   async getUserPermissionSummary(userId: number): Promise<UserPermissionSummary> {
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         role: {
//           include: {
//             rolePermissions: {
//               include: { permission: true }
//             }
//           }
//         },
//         userPermissions: {
//           include: { permission: true }
//         }
//       }
//     });

//     if (!user || !user.role) {
//       return {
//         general: [],
//         extra: [],
//         denied: [],
//         final: []
//       };
//     }
    
//     // General permissions from role
//     const general = user.role.rolePermissions.map(rp => rp.permission.code);
    
//     // User-specific permissions
//     const extra: string[] = [];
//     const denied: string[] = [];
    
//     user.userPermissions.forEach(up => {
//       if (up.type === 'GRANT') {
//         extra.push(up.permission.code);
//       } else if (up.type === 'DENY') {
//         denied.push(up.permission.code);
//       }
//     });
    
//     // Final permissions (General - Denied + Extra)
//     const generalSet = new Set(general);
//     denied.forEach(p => generalSet.delete(p));
//     extra.forEach(p => generalSet.add(p));
//     const final = Array.from(generalSet);
    
//     return {
//       general,
//       extra,
//       denied,
//       final
//     };
//   }

//   /**
//    * ✅ Get user's effective permissions (final)
//    */
//   async getUserPermissions(userId: number): Promise<string[]> {
//     const summary = await this.getUserPermissionSummary(userId);
//     return summary.final;
//   }

//   /**
//    * ✅ Check if user has specific permission
//    */
//   async hasPermission(userId: number, permissionCode: string): Promise<boolean> {
//     const permissions = await this.getUserPermissions(userId);
//     return permissions.includes(permissionCode);
//   }

//   /**
//    * ✅ Check if user has ANY of the given permissions
//    */
//   async hasAnyPermission(userId: number, permissionCodes: string[]): Promise<boolean> {
//     const permissions = await this.getUserPermissions(userId);
//     return permissionCodes.some(code => permissions.includes(code));
//   }

//   /**
//    * ✅ Check if user has ALL of the given permissions
//    */
//   async hasAllPermissions(userId: number, permissionCodes: string[]): Promise<boolean> {
//     const permissions = await this.getUserPermissions(userId);
//     return permissionCodes.every(code => permissions.includes(code));
//   }

//   /**
//    * ✅ Grant extra permission to user (specific)
//    */
//   async grantExtraPermission(
//     userId: number, 
//     permissionCode: string, 
//     grantedBy: number,
//     reason?: string
//   ): Promise<{ success: boolean; message: string }> {
//     try {
//       const permission = await this.prisma.permission.findUnique({
//         where: { code: permissionCode }
//       });
      
//       if (!permission) {
//         throw new Error(`Permission ${permissionCode} not found`);
//       }
      
//       // Check if user already has this permission
//       const existing = await this.prisma.userPermission.findUnique({
//         where: {
//           userId_permissionId: {
//             userId,
//             permissionId: permission.id
//           }
//         }
//       });
      
//       if (existing && existing.type === 'GRANT') {
//         return {
//           success: false,
//           message: `User already has ${permissionCode} granted`
//         };
//       }
      
//       await this.prisma.userPermission.upsert({
//         where: {
//           userId_permissionId: {
//             userId,
//             permissionId: permission.id
//           }
//         },
//         update: {
//           type: 'GRANT',
//           reason,
//           grantedBy,
//           grantedAt: new Date()
//         },
//         create: {
//           userId,
//           permissionId: permission.id,
//           type: 'GRANT',
//           reason,
//           grantedBy
//         }
//       });
      
//       // Log the action
//       await this.logPermissionChange(userId, permissionCode, 'GRANT', grantedBy);
      
//       return {
//         success: true,
//         message: `Granted ${permissionCode} as extra permission to user ${userId}`
//       };
//     } catch (error) {
//       this.logger.error(`Failed to grant permission: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * ✅ Deny permission for user (remove from general)
//    */
//   async denyPermission(
//     userId: number, 
//     permissionCode: string, 
//     deniedBy: number,
//     reason?: string
//   ): Promise<{ success: boolean; message: string }> {
//     try {
//       const permission = await this.prisma.permission.findUnique({
//         where: { code: permissionCode }
//       });
      
//       if (!permission) {
//         throw new Error(`Permission ${permissionCode} not found`);
//       }
      
//       // Check if user already has this denied
//       const existing = await this.prisma.userPermission.findUnique({
//         where: {
//           userId_permissionId: {
//             userId,
//             permissionId: permission.id
//           }
//         }
//       });
      
//       if (existing && existing.type === 'DENY') {
//         return {
//           success: false,
//           message: `User already has ${permissionCode} denied`
//         };
//       }
      
//       await this.prisma.userPermission.upsert({
//         where: {
//           userId_permissionId: {
//             userId,
//             permissionId: permission.id
//           }
//         },
//         update: {
//           type: 'DENY',
//           reason,
//           grantedBy: deniedBy,
//           grantedAt: new Date()
//         },
//         create: {
//           userId,
//           permissionId: permission.id,
//           type: 'DENY',
//           reason,
//           grantedBy: deniedBy
//         }
//       });
      
//       // Log the action
//       await this.logPermissionChange(userId, permissionCode, 'DENY', deniedBy);
      
//       return {
//         success: true,
//         message: `Denied ${permissionCode} for user ${userId}`
//       };
//     } catch (error) {
//       this.logger.error(`Failed to deny permission: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * ✅ Remove user-specific permission exception
//    */
//   async removeUserPermission(
//     userId: number, 
//     permissionCode: string
//   ): Promise<{ success: boolean; message: string }> {
//     try {
//       const permission = await this.prisma.permission.findUnique({
//         where: { code: permissionCode }
//       });
      
//       if (!permission) {
//         return {
//           success: false,
//           message: `Permission ${permissionCode} not found`
//         };
//       }
      
//       const deleted = await this.prisma.userPermission.deleteMany({
//         where: {
//           userId,
//           permissionId: permission.id
//         }
//       });
      
//       if (deleted.count === 0) {
//         return {
//           success: false,
//           message: `No user-specific permission found for ${permissionCode}`
//         };
//       }
      
//       return {
//         success: true,
//         message: `Removed user-specific exception for ${permissionCode}`
//       };
//     } catch (error) {
//       this.logger.error(`Failed to remove permission: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * ✅ Compare permissions between two users
//    */
//   async compareUsers(
//     userId1: number, 
//     userId2: number
//   ): Promise<{
//     user1: { id: number; name: string; email: string; role: any } & UserPermissionSummary;
//     user2: { id: number; name: string; email: string; role: any } & UserPermissionSummary;
//     comparison: PermissionComparison;
//   }> {
//     try {
//       // Get both users with their details
//       const [user1, user2] = await Promise.all([
//         this.prisma.user.findUnique({
//           where: { id: userId1 },
//           include: { role: true }
//         }),
//         this.prisma.user.findUnique({
//           where: { id: userId2 },
//           include: { role: true }
//         })
//       ]);
      
//       if (!user1 || !user2) {
//         throw new Error('One or both users not found');
//       }
      
//       // Get permission summaries for both users
//       const [summary1, summary2] = await Promise.all([
//         this.getUserPermissionSummary(userId1),
//         this.getUserPermissionSummary(userId2)
//       ]);
      
//       // Prepare comparison
//       const sameRole = user1.roleId === user2.roleId;
      
//       const generalSame = summary1.general.filter(p => summary2.general.includes(p));
//       const generalDifferent = {
//         user1Only: summary1.general.filter(p => !summary2.general.includes(p)),
//         user2Only: summary2.general.filter(p => !summary1.general.includes(p))
//       };
      
//       const extraSame = summary1.extra.filter(p => summary2.extra.includes(p));
//       const extraDifferent = {
//         user1Extra: summary1.extra.filter(p => !summary2.extra.includes(p)),
//         user2Extra: summary2.extra.filter(p => !summary1.extra.includes(p))
//       };
      
//       const deniedDifferent = {
//         user1Denied: summary1.denied,
//         user2Denied: summary2.denied
//       };
      
//       const finalSame = summary1.final.filter(p => summary2.final.includes(p));
//       const finalDifferent = {
//         user1Only: summary1.final.filter(p => !summary2.final.includes(p)),
//         user2Only: summary2.final.filter(p => !summary1.final.includes(p))
//       };
      
//       return {
//         user1: {
//           id: user1.id,
//           name: `${user1.firstName} ${user1.lastName}`,
//           email: user1.email,
//           role: user1.role,
//           ...summary1
//         },
//         user2: {
//           id: user2.id,
//           name: `${user2.firstName} ${user2.lastName}`,
//           email: user2.email,
//           role: user2.role,
//           ...summary2
//         },
//         comparison: {
//           sameRole,
//           generalSame,
//           generalDifferent,
//           extraSame,
//           extraDifferent,
//           deniedDifferent,
//           finalSame,
//           finalDifferent
//         }
//       };
//     } catch (error) {
//       this.logger.error(`Failed to compare users: ${error.message}`);
//       throw error;
//     }
//   }

//   /**
//    * ✅ Get all system permissions (for admin UI)
//    */
//   async getAllPermissions() {
//     return this.prisma.permission.findMany({
//       where: { isActive: true },
//       orderBy: [{ module: 'asc' }, { action: 'asc' }]
//     });
//   }

//   /**
//    * ✅ Get permissions by module
//    */
//   async getPermissionsByModule() {
//     const permissions = await this.prisma.permission.findMany({
//       where: { isActive: true },
//       orderBy: [{ module: 'asc' }, { action: 'asc' }]
//     });
    
//     return permissions.reduce((acc, perm) => {
//       if (!acc[perm.module]) {
//         acc[perm.module] = [];
//       }
//       acc[perm.module].push(perm);
//       return acc;
//     }, {});
//   }

//   /**
//    * Get users who have a specific permission
//    */
//   async getUsersWithPermission(permissionCode: string) {
//     const permission = await this.prisma.permission.findUnique({
//       where: { code: permissionCode }
//     });
    
//     if (!permission) {
//       return [];
//     }
    
//     // Find users with this permission in their final permissions
//     const allUsers = await this.prisma.user.findMany({
//       where: { isActive: true },
//       include: {
//         role: true,
//         userPermissions: {
//           include: { permission: true }
//         }
//       }
//     });
    
//     const usersWithPermission = [];
    
//     for (const user of allUsers) {
//       const summary = await this.getUserPermissionSummary(user.id);
//       if (summary.final.includes(permissionCode)) {
//         usersWithPermission.push({
//           id: user.id,
//           name: `${user.firstName} ${user.lastName}`,
//           email: user.email,
//           role: user.role?.name
//         });
//       }
//     }
    
//     return usersWithPermission;
//   }

//   /**
//    * ✅ Check if user can perform action on entity
//    * With optional ownership check
//    */
//   async canUserPerformAction(
//     userId: number,
//     permissionCode: string,
//     entityOwnerId?: number
//   ): Promise<{ can: boolean; reason?: string }> {
//     try {
//       // Check basic permission
//       const hasPermission = await this.hasPermission(userId, permissionCode);
      
//       if (!hasPermission) {
//         return {
//           can: false,
//           reason: `Missing required permission: ${permissionCode}`
//         };
//       }
      
//       // If entityOwnerId is provided, check if user is the owner
//       if (entityOwnerId !== undefined && entityOwnerId !== userId) {
//         // Check if user has "manage_all" permission for this module
//         const module = permissionCode.split('_')[0].toLowerCase();
//         const manageAllPermission = `${module.toUpperCase()}_MANAGE_ALL`;
        
//         const hasManageAll = await this.hasPermission(userId, manageAllPermission);
//         if (!hasManageAll) {
//           return {
//             can: false,
//             reason: 'You can only perform this action on your own resources'
//           };
//         }
//       }
      
//       return { can: true };
//     } catch (error) {
//       this.logger.error(`Permission check failed: ${error.message}`);
//       return { can: false, reason: 'Permission check failed' };
//     }
//   }

//   /**
//    * ✅ Get user's role with permissions
//    */
//   async getUserRoleWithPermissions(userId: number) {
//     const user = await this.prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         role: {
//           include: {
//             rolePermissions: {
//               include: { permission: true }
//             }
//           }
//         }
//       }
//     });
    
//     if (!user?.role) {
//       return null;
//     }
    
//     return {
//       id: user.role.id,
//       name: user.role.name,
//       code: user.role.code,
//       permissions: user.role.rolePermissions.map(rp => rp.permission.code)
//     };
//   }

//   /**
//    * ✅ Create a new permission (admin only)
//    */
//   async createPermission(data: {
//     code: string;
//     name: string;
//     module: string;
//     action: string;
//     description?: string;
//     category?: string;
//   }) {
//     return this.prisma.permission.create({
//       data: {
//         code: data.code,
//         name: data.name,
//         module: data.module,
//         action: data.action,
//         description: data.description,
//         category: data.category,
//         isActive: true
//       }
//     });
//   }

//   /**
//    * ✅ Log permission changes for audit
//    */
//   private async logPermissionChange(
//     userId: number,
//     permissionCode: string,
//     action: 'GRANT' | 'DENY' | 'REMOVE',
//     performedBy: number
//   ) {
//     try {
//       await this.prisma.auditLog.create({
//         data: {
//           userId: performedBy,
//           action,
//           entityType: 'USER_PERMISSION',
//           entityId: userId,
//           description: `${action} permission ${permissionCode} for user ${userId}`,
//           timestamp: new Date()
//         }
//       });
//     } catch (error) {
//       this.logger.warn(`Failed to log permission change: ${error.message}`);
//     }
//   }

//   /**
//    * ✅ Initialize system permissions (run on first setup)
//    */
//   async initializeSystemPermissions() {
//     const systemPermissions = [
//       // Student Management
//       { code: 'STUDENT_CREATE', name: 'Create Student', module: 'students', action: 'create', category: 'general' },
//       { code: 'STUDENT_READ', name: 'View Students', module: 'students', action: 'read', category: 'general' },
//       { code: 'STUDENT_UPDATE', name: 'Edit Student', module: 'students', action: 'update', category: 'general' },
//       { code: 'STUDENT_DELETE', name: 'Delete Student', module: 'students', action: 'delete', category: 'admin' },
//       { code: 'STUDENT_MANAGE_ALL', name: 'Manage All Students', module: 'students', action: 'manage_all', category: 'admin' },
      
//       // Teacher Management
//       { code: 'TEACHER_CREATE', name: 'Create Teacher', module: 'teachers', action: 'create', category: 'admin' },
//       { code: 'TEACHER_READ', name: 'View Teachers', module: 'teachers', action: 'read', category: 'general' },
//       { code: 'TEACHER_UPDATE', name: 'Edit Teacher', module: 'teachers', action: 'update', category: 'admin' },
//       { code: 'TEACHER_DELETE', name: 'Delete Teacher', module: 'teachers', action: 'delete', category: 'admin' },
      
//       // Attendance
//       { code: 'ATTENDANCE_CREATE', name: 'Create Attendance', module: 'attendance', action: 'create', category: 'teacher' },
//       { code: 'ATTENDANCE_READ', name: 'View Attendance', module: 'attendance', action: 'read', category: 'general' },
//       { code: 'ATTENDANCE_UPDATE', name: 'Edit Attendance', module: 'attendance', action: 'update', category: 'teacher' },
//       { code: 'ATTENDANCE_DELETE', name: 'Delete Attendance', module: 'attendance', action: 'delete', category: 'admin' },
      
//       // Grades
//       { code: 'GRADE_CREATE', name: 'Create Grade', module: 'grades', action: 'create', category: 'teacher' },
//       { code: 'GRADE_READ', name: 'View Grades', module: 'grades', action: 'read', category: 'general' },
//       { code: 'GRADE_UPDATE', name: 'Edit Grade', module: 'grades', action: 'update', category: 'teacher' },
//       { code: 'GRADE_DELETE', name: 'Delete Grade', module: 'grades', action: 'delete', category: 'admin' },
      
//       // Users
//       { code: 'USER_CREATE', name: 'Create User', module: 'users', action: 'create', category: 'admin' },
//       { code: 'USER_READ', name: 'View Users', module: 'users', action: 'read', category: 'admin' },
//       { code: 'USER_UPDATE', name: 'Edit User', module: 'users', action: 'update', category: 'admin' },
//       { code: 'USER_DELETE', name: 'Delete User', module: 'users', action: 'delete', category: 'admin' },
//       { code: 'USER_MANAGE_PERMISSIONS', name: 'Manage User Permissions', module: 'users', action: 'manage_permissions', category: 'admin' },
      
//       // Classes
//       { code: 'CLASS_CREATE', name: 'Create Class', module: 'classes', action: 'create', category: 'admin' },
//       { code: 'CLASS_READ', name: 'View Classes', module: 'classes', action: 'read', category: 'general' },
//       { code: 'CLASS_UPDATE', name: 'Edit Class', module: 'classes', action: 'update', category: 'admin' },
//       { code: 'CLASS_DELETE', name: 'Delete Class', module: 'classes', action: 'delete', category: 'admin' },
      
//       // System
//       { code: 'SYSTEM_ALL', name: 'All System Permissions', module: 'system', action: 'all', category: 'super_admin' },
//       { code: 'SETTINGS_MANAGE', name: 'Manage Settings', module: 'system', action: 'manage', category: 'admin' },
//       { code: 'AUDIT_VIEW', name: 'View Audit Logs', module: 'system', action: 'view', category: 'admin' },
//       { code: 'ROLE_MANAGE', name: 'Manage Roles', module: 'system', action: 'manage', category: 'admin' },
//     ];
    
//     for (const perm of systemPermissions) {
//       await this.prisma.permission.upsert({
//         where: { code: perm.code },
//         update: perm,
//         create: perm
//       });
//     }
    
//     this.logger.log(`Initialized ${systemPermissions.length} system permissions`);
//   }
// }