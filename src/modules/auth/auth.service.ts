// // import { 
// //   Injectable, 
// //   UnauthorizedException, 
// //   ConflictException, 
// //   NotFoundException,
// //   BadRequestException,
// //   InternalServerErrorException
// // } from '@nestjs/common';
// // import { JwtService } from '@nestjs/jwt';
// // import { PrismaService } from '../../database/prisma.service';
// // import { LoginDto } from './dto/login.dto';
// // import { RegisterDto } from './dto/register.dto';
// // import { UpdateProfileDto } from './dto/update-profile.dto';
// // import { ChangePasswordDto } from './dto/change-password.dto';
// // import * as bcrypt from 'bcryptjs';
// // import { ConfigService } from '@nestjs/config';
// // import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

// // @Injectable()
// // export class AuthService {
  
// //   constructor(
// //     private prisma: PrismaService,
// //     private jwtService: JwtService,
// //     private configService: ConfigService,
// //   ) {}

// //   async validateUser(username: string, password: string): Promise<any> {
// //     try {
// //       const user = await this.prisma.user.findFirst({
// //         where: {
// //           OR: [{ username }, { email: username }],
// //           isActive: true,
// //         },
// //         include: {
// //           role: {
// //             include: {
// //               modulePermissions: {
// //                 include: {
// //                   module: true,
// //                 },
// //                 where: {
// //                   canView: true,
// //                   module: {
// //                     isActive: true,
// //                   },
// //                 },
// //               },
// //             },
// //           },
// //         },
// //       });

// //       if (user && (await bcrypt.compare(password, user.passwordHash))) {
// //         const { passwordHash, ...result } = user;
        
// //         // Format accessible modules
// //         const accessibleModules = user.role.modulePermissions.map((permission) => ({
// //           id: permission.module.id,
// //           name: permission.module.name,
// //           description: permission.module.description,
// //           path: permission.module.path,
// //           icon: permission.module.icon,
// //           order: permission.module.order,
// //           permissions: {
// //             canView: permission.canView,
// //             canCreate: permission.canCreate,
// //             canEdit: permission.canEdit,
// //             canDelete: permission.canDelete,
// //           },
// //         })).sort((a, b) => a.order - b.order);

// //         return {
// //           ...result,
// //           accessibleModules,
// //         };
// //       }
// //       return null;
// //     } catch (error) {
// //       throw new InternalServerErrorException('Authentication service error');
// //     }
// //   }

// //   async validateUserById(userId: number): Promise<any> {
// //     try {
// //       const user = await this.prisma.user.findUnique({
// //         where: { id: Number(userId), isActive: true },
// //         include: {
// //           role: {
// //             include: {
// //               modulePermissions: {
// //                 include: {
// //                   module: true,
// //                 },
// //                 where: {
// //                   canView: true,
// //                   module: {
// //                     isActive: true,
// //                   },
// //                 },
// //               },
// //             },
// //           },
// //         },
// //       });

// //       if (user) {
// //         const { passwordHash, ...result } = user;
        
// //         // Format accessible modules
// //         const accessibleModules = user.role.modulePermissions.map((permission) => ({
// //           id: permission.module.id,
// //           name: permission.module.name,
// //           description: permission.module.description,
// //           path: permission.module.path,
// //           icon: permission.module.icon,
// //           order: permission.module.order,
// //           permissions: {
// //             canView: permission.canView,
// //             canCreate: permission.canCreate,
// //             canEdit: permission.canEdit,
// //             canDelete: permission.canDelete,
// //           },
// //         })).sort((a, b) => a.order - b.order);

// //         return {
// //           ...result,
// //           accessibleModules,
// //         };
// //       }
// //       return null;
// //     } catch (error) {
// //       throw new InternalServerErrorException('User validation error');
// //     }
// //   }

// //   async login(loginDto: LoginDto) {
// //   try {
// //     // Find user with role information
// //     const user = await this.prisma.user.findFirst({
// //       where: { email: loginDto.email },
// //       include: {
// //         role: true // Include role details
// //       }
// //     });

// //     if (!user) {
// //       throw new UnauthorizedException('Invalid credentials');
// //     }

// //     // 🚨 DEMO: Bypass password check for now
// //     console.log('🔐 Login for role:', user.role?.name);

// //     // Generate token with role information
// //     const payload = { 
// //       sub: user.id, 
// //       email: user.email,
// //       role: user.role?.name || 'STUDENT',
// //       roleId: user.roleId
// //     };

// //     const accessToken = await this.jwtService.signAsync(payload);

// //     return {
// //       message: 'Login successful',
// //       access_token: accessToken,
// //       user: {
// //         id: user.id,
// //         email: user.email,
// //         firstName: user.firstName,
// //         lastName: user.lastName,
// //         role: user.role?.name || 'STUDENT',
// //         roleId: user.roleId,
// //         permissions: user.role?.permissions || {}
// //       }
// //     };

// //   } catch (error) {
// //     console.error('Login error:', error);
// //     throw new UnauthorizedException('Invalid credentials');
// //   }
// // }
// //  async register(registerDto: RegisterDto) {
// //   try {
// //     console.log('🚀 Starting registration for:', registerDto.email);
// //     console.log('📋 Requested roleId:', registerDto.roleId);

// //     // Check if user exists
// //     const existingUser = await this.prisma.user.findFirst({
// //       where: { email: registerDto.email },
// //     });

// //     if (existingUser) {
// //       throw new ConflictException('Email already exists');
// //     }

// //     // 🚨 FIX: PROPER ROLE HANDLING
// //     let finalRoleId = registerDto.roleId;
    
// //     // If roleId provided, verify it exists
// //     if (finalRoleId) {
// //       const requestedRole = await this.prisma.role.findUnique({
// //         where: { id: finalRoleId }
// //       });
      
// //       if (!requestedRole) {
// //         console.log('❌ Requested role not found, using default STUDENT');
// //         finalRoleId = null;
// //       } else {
// //         console.log('✅ Using requested role:', requestedRole.name);
// //       }
// //     }

// //     // If no valid roleId, use STUDENT as default
// //     if (!finalRoleId) {
// //       const studentRole = await this.prisma.role.findFirst({
// //         where: { name: 'STUDENT' }
// //       });
// //       finalRoleId = studentRole?.id || 1;
// //       console.log('📝 Using default STUDENT role');
// //     }

// //     console.log('🎯 Final role ID:', finalRoleId);

// //     // Hash password
// //     const passwordHash = await bcrypt.hash(registerDto.password, 12);

// //     // Create user
// //     const user = await this.prisma.user.create({
// //       data: {
// //         email: registerDto.email,
// //         passwordHash: passwordHash,
// //         firstName: registerDto.firstName,
// //         lastName: registerDto.lastName,
// //         username: registerDto.username || registerDto.email,
// //         phone: registerDto.phone || '',
// //         roleId: finalRoleId
// //       },
// //       include: {
// //         role: true // Include role information
// //       }
// //     });

// //     console.log('🎉 User created with role:', user.role?.name);

// //     return {
// //       message: 'User registered successfully',
// //       user: {
// //         id: user.id,
// //         email: user.email,
// //         firstName: user.firstName,
// //         lastName: user.lastName,
// //         username: user.username,
// //         roleId: user.roleId,
// //         role: user.role?.name // Include role name in response
// //       }
// //     };

// //   } catch (error) {
// //     console.error('💥 Registration error:', error);
// //     throw new InternalServerErrorException('Registration failed');
// //   }
// // } 
// //   async getProfile(userId: number) {
// //     try {
// //       const user = await this.prisma.user.findUnique({
// //         where: { id: Number(userId), isActive: true },
// //         include: {
// //           role: {
// //             include: {
// //               modulePermissions: {
// //                 include: {
// //                   module: true,
// //                 },
// //                 where: {
// //                   canView: true,
// //                   module: {
// //                     isActive: true,
// //                   },
// //                 },
// //               },
// //             },
// //           },
// //         },
// //       });

// //       if (!user) {
// //         throw new NotFoundException('User not found');
// //       }

// //       const { passwordHash, ...result } = user;

// //       // Format accessible modules
// //       const accessibleModules = user.role.modulePermissions.map((permission) => ({
// //         id: permission.module.id,
// //         name: permission.module.name,
// //         description: permission.module.description,
// //         path: permission.module.path,
// //         icon: permission.module.icon,
// //         order: permission.module.order,
// //         permissions: {
// //           canView: permission.canView,
// //           canCreate: permission.canCreate,
// //           canEdit: permission.canEdit,
// //           canDelete: permission.canDelete,
// //         },
// //       })).sort((a, b) => a.order - b.order);

// //       return {
// //         ...result,
// //         accessibleModules,
// //       };
// //     } catch (error) {
// //       throw new InternalServerErrorException('Profile retrieval failed');
// //     }
// //   }


// //   // In auth.service.ts
// // async createDefaultRoles() {
// //   const defaultRoles = [
// //     { name: 'SUPER_ADMIN', description: 'Full system access', isSystem: true, permissions: { all: true } },
// //     { name: 'ADMIN', description: 'Administrator', isSystem: true, permissions: { manage_users: true, manage_content: true } },
// //     { name: 'TEACHER', description: 'Teacher', isSystem: false, permissions: { manage_students: true, manage_grades: true } },
// //     { name: 'STUDENT', description: 'Student', isSystem: false, permissions: { view_grades: true, view_courses: true } },
// //     { name: 'PARENT', description: 'Parent', isSystem: false, permissions: { view_student_info: true } }
// //   ];

// //   for (const roleData of defaultRoles) {
// //     await this.prisma.role.upsert({
// //       where: { name: roleData.name },
// //       update: {},
// //       create: roleData
// //     });
// //   }

// //   console.log('✅ Default roles created');
// //   return { message: 'Default roles setup complete' };
// // }

// //   async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
// //     // Check if email is taken by another user
// //     if (updateProfileDto.email) {
// //       const existingUser = await this.prisma.user.findFirst({
// //         where: {
// //           email: updateProfileDto.email,
// //           id: { not: Number(userId) },
// //         },
// //       });

// //       if (existingUser) {
// //         throw new ConflictException('Email already taken by another user');
// //       }
// //     }

// //     try {
// //       const user = await this.prisma.user.update({
// //         where: { id: Number(userId) },
// //         data: updateProfileDto,
// //         include: {
// //           role: {
// //             include: {
// //               modulePermissions: {
// //                 include: {
// //                   module: true,
// //                 },
// //                 where: {
// //                   canView: true,
// //                   module: {
// //                     isActive: true,
// //                   },
// //                 },
// //               },
// //             },
// //           },
// //         },
// //       });

// //       const { passwordHash, ...result } = user;

// //       // Format accessible modules
// //       const accessibleModules = user.role.modulePermissions.map((permission) => ({
// //         id: permission.module.id,
// //         name: permission.module.name,
// //         description: permission.module.description,
// //         path: permission.module.path,
// //         icon: permission.module.icon,
// //         order: permission.module.order,
// //         permissions: {
// //           canView: permission.canView,
// //           canCreate: permission.canCreate,
// //           canEdit: permission.canEdit,
// //           canDelete: permission.canDelete,
// //         },
// //       })).sort((a, b) => a.order - b.order);

// //       // Audit log
// //       await this.prisma.auditLog.create({
// //         data: {
// //           userId: Number(userId),
// //           action: 'UPDATE',
// //           entityType: 'PROFILE',
// //     entityId: Number(userId), // ✅ USE entityId INSTEAD
// //           details: { updatedFields: Object.keys(updateProfileDto) },
// //         },
// //       });

// //       return {
// //         message: 'Profile updated successfully',
// //         user: {
// //           ...result,
// //           accessibleModules,
// //         },
// //       };
// //     } catch (error) {
// //       throw new InternalServerErrorException('Profile update failed');
// //     }
// //   }

// //   async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
// //     const user = await this.prisma.user.findUnique({
// //       where: { id: Number(userId) },
// //     });

// //     if (!user) {
// //       throw new NotFoundException('User not found');
// //     }

// //     // Verify current password
// //     const isCurrentPasswordValid = await bcrypt.compare(
// //       changePasswordDto.currentPassword,
// //       user.passwordHash,
// //     );

// //     if (!isCurrentPasswordValid) {
// //       throw new UnauthorizedException('Current password is incorrect');
// //     }

// //     try {
// //       // Hash new password
// //       const newPasswordHash = await bcrypt.hash(
// //         changePasswordDto.newPassword,
// //         this.configService.get('bcrypt.rounds') || 12,
// //       );

// //       // Update password
// //       await this.prisma.user.update({
// //         where: { id: Number(userId) },
// //         data: { passwordHash: newPasswordHash },
// //       });

// //       // Invalidate all sessions except current
// //       await this.prisma.userSession.updateMany({
// //         where: {
// //           userId: Number(userId),
// //           isActive: true,
// //         },
// //         data: { isActive: false },
// //       });

// //       // Audit log
// //       await this.prisma.auditLog.create({
// //         data: {
// //           userId: Number(userId),
// //           action: 'UPDATE',
// //           entityType: 'PASSWORD',
// //           resourceId: Number(userId),
// //         },
// //       });

// //       return { message: 'Password changed successfully' };
// //     } catch (error) {
// //       throw new InternalServerErrorException('Password change failed');
// //     }
// //   }

// //   async logout(token: string) {
// //     try {
// //       await this.prisma.userSession.updateMany({
// // where: { sessionToken: token }, // ✅ USE sessionToken INSTEAD
// //         data: { isActive: false },
// //       });

// //       return { message: 'Logged out successfully' };
// //     } catch (error) {
// //       throw new InternalServerErrorException('Logout failed');
// //     }
// //   }

// //   async logoutAll(userId: number) {
// //     try {
// //       await this.prisma.userSession.updateMany({
// //         where: { userId: Number(userId), isActive: true },
// //         data: { isActive: false },
// //       });

// //       // Audit log
// //       await this.prisma.auditLog.create({
// //         data: {
// //           userId: Number(userId),
// //           action: 'LOGOUT',
// // entityType: 'SESSION', // ✅ USE entityType INSTEAD
// //           resourceId: Number(userId),
// //         },
// //       });

// //       return { message: 'Logged out from all devices' };
// //     } catch (error) {
// //       throw new InternalServerErrorException('Logout all failed');
// //     }
// //   }

// //   async deleteUser(userId: number, currentUserId: number) {
// //     if (userId === currentUserId) {
// //       throw new BadRequestException('You cannot delete your own account');
// //     }

// //     const user = await this.prisma.user.findUnique({
// //       where: { id: Number(userId) },
// //       include: { role: true },
// //     });

// //     if (!user) {
// //       throw new NotFoundException('User not found');
// //     }

// //     // Prevent deletion of system admin users
// //     if (user.role.isSystem && ['super_admin', 'admin'].includes(user.role.name)) {
// //       throw new BadRequestException('Cannot delete system administrator accounts');
// //     }

// //     try {
// //       // Soft delete user
// //       await this.prisma.user.update({
// //         where: { id: Number(userId) },
// //         data: { isActive: false },
// //       });

// //       // Invalidate all sessions
// //       await this.prisma.userSession.updateMany({
// //         where: { userId: Number(userId) },
// //         data: { isActive: false },
// //       });

// //       // Audit log
// //       await this.prisma.auditLog.create({
// //         data: {
// //           userId: Number(currentUserId),
// //           action: 'DELETE',
// // entityType: 'USER', // ✅ USE entityType INSTEAD
// //           resourceId: Number(userId),
// //           details: { deletedBy: currentUserId },
// //         },
// //       });

// //       return { message: 'User deleted successfully' };
// //     } catch (error) {
// //       throw new InternalServerErrorException('User deletion failed');
// //     }
// //   }

// //   async getActiveSessions(userId: number) {
// //     try {
// //       const sessions = await this.prisma.userSession.findMany({
// //         where: {
// //           userId: Number(userId),
// //           isActive: true,
// //           expiresAt: { gt: new Date() },
// //         },
// //         orderBy: { createdAt: 'desc' },
// //       });

// //       return sessions;
// //     } catch (error) {
// //       throw new InternalServerErrorException('Sessions retrieval failed');
// //     }
// //   }

// //   async refreshToken(userId: number) {
// //     try {
// //       const user = await this.validateUserById(userId);
// //       if (!user) {
// //         throw new UnauthorizedException('User not found');
// //       }

// //       const payload: JwtPayload = { 
// //         sub: user.id, 
// //         username: user.username,
// //         role: user.role.name,
// //       };

// //       const token = this.jwtService.sign(payload, {
// //         secret: this.configService.get('jwt.secret'),
// //         expiresIn: this.configService.get('jwt.expiresIn'),
// //       });

// //       // Update session
// //       const expiresAt = new Date();
// //       expiresAt.setHours(expiresAt.getHours() + 24);

// //       await this.prisma.userSession.updateMany({
// //         where: { userId: Number(userId), isActive: true },
// // // CHANGE TO:
// // data: { expiresAt }, // ✅ ONLY KEEP expiresAt
// //       });

// //       return {
// //         access_token: token,
// //         token_type: 'Bearer',
// //         expires_in: this.configService.get('jwt.expiresIn'),
// //       };
// //     } catch (error) {
// //       throw new InternalServerErrorException('Token refresh failed');
// //     }
// //   }

// //   async healthCheck() {
// //     let dbStatus = 'disconnected';
// //     try {
// //       await this.prisma.$queryRaw`SELECT 1`;
// //       dbStatus = 'connected';
// //     } catch (error) {
// //       dbStatus = 'error';
// //     }

// //     return {
// //       status: 'ok',
// //       timestamp: new Date().toISOString(),
// //       uptime: process.uptime(),
// //       database: dbStatus,
// //       environment: process.env.NODE_ENV || 'development',
// //       version: process.env.npm_package_version || '1.0.0',
// //     };
// //   }
// // }

// import { 
//   Injectable, 
//   UnauthorizedException, 
//   ConflictException, 
//   NotFoundException,
//   BadRequestException,
//   InternalServerErrorException
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { PrismaService } from '../../database/prisma.service';
// import { LoginDto } from './dto/login.dto';
// import { RegisterDto } from './dto/register.dto';
// import { UpdateProfileDto } from './dto/update-profile.dto';
// import { ChangePasswordDto } from './dto/change-password.dto';
// import * as bcrypt from 'bcryptjs';
// import { ConfigService } from '@nestjs/config';
// import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

// @Injectable()
// export class AuthService {
  
//   constructor(
//     private prisma: PrismaService,
//     private jwtService: JwtService,
//     private configService: ConfigService,
//   ) {}

//   async validateUser(username: string, password: string): Promise<any> {
//     try {
//       const user = await this.prisma.user.findFirst({
//         where: {
//           OR: [{ username }, { email: username }],
//           isActive: true,
//         },
//         include: {
//           role: {
//             include: {
//               modulePermissions: {
//                 include: {
//                   module: true,
//                 },
//                 where: {
//                   canView: true,
//                   module: {
//                     isActive: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });

//       if (user && (await bcrypt.compare(password, user.passwordHash))) {
//         const { passwordHash, ...result } = user;
        
//         const accessibleModules = this.formatAccessibleModules(user.role.modulePermissions);
//         return {
//           ...result,
//           accessibleModules,
//         };
//       }
//       return null;
//     } catch (error) {
//       throw new InternalServerErrorException('Authentication service error');
//     }
//   }

//   async validateUserById(userId: number): Promise<any> {
//     try {
//       const user = await this.prisma.user.findUnique({
//         where: { id: Number(userId), isActive: true },
//         include: {
//           role: {
//             include: {
//               modulePermissions: {
//                 include: {
//                   module: true,
//                 },
//                 where: {
//                   canView: true,
//                   module: {
//                     isActive: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });

//       if (user) {
//         const { passwordHash, ...result } = user;
//         const accessibleModules = this.formatAccessibleModules(user.role.modulePermissions);
//         return {
//           ...result,
//           accessibleModules,
//         };
//       }
//       return null;
//     } catch (error) {
//       throw new InternalServerErrorException('User validation error');
//     }
//   }

//   async login(loginDto: LoginDto) {
//     try {
//       const user = await this.prisma.user.findFirst({
//         where: { email: loginDto.email, isActive: true },
//         include: {
//           role: true
//         }
//       });

//       if (!user) {
//         throw new UnauthorizedException('Invalid credentials');
//       }

//       // Validate password
//       const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
//       if (!isPasswordValid) {
//         throw new UnauthorizedException('Invalid credentials');
//       }

//       const payload = { 
//         sub: user.id, 
//         email: user.email,
//         role: user.role?.name || 'STUDENT',
//         roleId: user.roleId
//       };

//       const accessToken = await this.jwtService.signAsync(payload);

//       // Create session
//       await this.prisma.userSession.create({
//         data: {
//           userId: user.id,
//           sessionToken: accessToken,
//           expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
//           isActive: true,
//         },
//       });

//       return {
//         message: 'Login successful',
//         access_token: accessToken,
//         user: {
//           id: user.id,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           role: user.role?.name || 'STUDENT',
//           roleId: user.roleId,
//           permissions: user.role?.permissions || {}
//         }
//       };

//     } catch (error) {
//       console.error('Login error:', error);
//       if (error instanceof UnauthorizedException) {
//         throw error;
//       }
//       throw new UnauthorizedException('Invalid credentials');
//     }
//   }

//   async register(registerDto: RegisterDto) {
//     try {
//       console.log('🚀 Starting registration for:', registerDto.email);

//       // Check if user exists
//       const existingUser = await this.prisma.user.findFirst({
//         where: { email: registerDto.email },
//       });

//       if (existingUser) {
//         throw new ConflictException('Email already exists');
//       }

//       // Handle role assignment
//       let finalRoleId = registerDto.roleId;
      
//       if (finalRoleId) {
//         const requestedRole = await this.prisma.role.findUnique({
//           where: { id: finalRoleId }
//         });
        
//         if (!requestedRole) {
//           console.log('❌ Requested role not found, using default STUDENT');
//           finalRoleId = null;
//         }
//       }

//       // Use STUDENT as default role
//       if (!finalRoleId) {
//         const studentRole = await this.prisma.role.findFirst({
//           where: { name: 'STUDENT' }
//         });
//         finalRoleId = studentRole?.id || 1;
//       }

//       // Hash password
//       const passwordHash = await bcrypt.hash(registerDto.password, 12);

//       // Create user
//       const user = await this.prisma.user.create({
//         data: {
//           email: registerDto.email,
//           passwordHash: passwordHash,
//           firstName: registerDto.firstName,
//           lastName: registerDto.lastName,
//           username: registerDto.username || registerDto.email,
//           phone: registerDto.phone || '',
//           roleId: finalRoleId
//         },
//         include: {
//           role: true
//         }
//       });

//       console.log('🎉 User created with role:', user.role?.name);

//       return {
//         message: 'User registered successfully',
//         user: {
//           id: user.id,
//           email: user.email,
//           firstName: user.firstName,
//           lastName: user.lastName,
//           username: user.username,
//           roleId: user.roleId,
//           role: user.role?.name
//         }
//       };

//     } catch (error) {
//       console.error('💥 Registration error:', error);
//       if (error instanceof ConflictException) {
//         throw error;
//       }
//       throw new InternalServerErrorException('Registration failed');
//     }
//   }

//   async getProfile(userId: number) {
//     try {
//       const user = await this.prisma.user.findUnique({
//         where: { id: Number(userId), isActive: true },
//         include: {
//           role: {
//             include: {
//               modulePermissions: {
//                 include: {
//                   module: true,
//                 },
//                 where: {
//                   canView: true,
//                   module: {
//                     isActive: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });

//       if (!user) {
//         throw new NotFoundException('User not found');
//       }

//       const { passwordHash, ...result } = user;
//       const accessibleModules = this.formatAccessibleModules(user.role.modulePermissions);

//       return {
//         ...result,
//         accessibleModules,
//       };
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       throw new InternalServerErrorException('Profile retrieval failed');
//     }
//   }

//   async createDefaultRoles() {
//     const defaultRoles = [
//       { name: 'SUPER_ADMIN', description: 'Full system access', isSystem: true, permissions: { all: true } },
//       { name: 'ADMIN', description: 'Administrator', isSystem: true, permissions: { manage_users: true, manage_content: true } },
//       { name: 'TEACHER', description: 'Teacher', isSystem: false, permissions: { manage_students: true, manage_grades: true } },
//       { name: 'STUDENT', description: 'Student', isSystem: false, permissions: { view_grades: true, view_courses: true } },
//       { name: 'PARENT', description: 'Parent', isSystem: false, permissions: { view_student_info: true } }
//     ];

//     for (const roleData of defaultRoles) {
//       await this.prisma.role.upsert({
//         where: { name: roleData.name },
//         update: {},
//         create: roleData
//       });
//     }

//     console.log('✅ Default roles created');
//     return { message: 'Default roles setup complete' };
//   }

//   async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
//     // Check if email is taken by another user
//     if (updateProfileDto.email) {
//       const existingUser = await this.prisma.user.findFirst({
//         where: {
//           email: updateProfileDto.email,
//           id: { not: Number(userId) },
//         },
//       });

//       if (existingUser) {
//         throw new ConflictException('Email already taken by another user');
//       }
//     }

//     try {
//       const user = await this.prisma.user.update({
//         where: { id: Number(userId) },
//         data: updateProfileDto,
//         include: {
//           role: {
//             include: {
//               modulePermissions: {
//                 include: {
//                   module: true,
//                 },
//                 where: {
//                   canView: true,
//                   module: {
//                     isActive: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });

//       const { passwordHash, ...result } = user;
//       const accessibleModules = this.formatAccessibleModules(user.role.modulePermissions);

//       // Audit log
//       await this.prisma.auditLog.create({
//         data: {
//           userId: Number(userId),
//           action: 'UPDATE',
//           entityType: 'PROFILE',
//           entityId: Number(userId),
//           details: { updatedFields: Object.keys(updateProfileDto) },
//         },
//       });

//       return {
//         message: 'Profile updated successfully',
//         user: {
//           ...result,
//           accessibleModules,
//         },
//       };
//     } catch (error) {
//       throw new InternalServerErrorException('Profile update failed');
//     }
//   }

//   async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
//     const user = await this.prisma.user.findUnique({
//       where: { id: Number(userId) },
//     });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Verify current password
//     const isCurrentPasswordValid = await bcrypt.compare(
//       changePasswordDto.currentPassword,
//       user.passwordHash,
//     );

//     if (!isCurrentPasswordValid) {
//       throw new UnauthorizedException('Current password is incorrect');
//     }

//     try {
//       // Hash new password
//       const newPasswordHash = await bcrypt.hash(
//         changePasswordDto.newPassword,
//         this.configService.get('bcrypt.rounds') || 12,
//       );

//       // Update password
//       await this.prisma.user.update({
//         where: { id: Number(userId) },
//         data: { passwordHash: newPasswordHash },
//       });

//       // Invalidate all sessions except current
//       await this.prisma.userSession.updateMany({
//         where: {
//           userId: Number(userId),
//           isActive: true,
//         },
//         data: { isActive: false },
//       });

//       // Audit log
//       await this.prisma.auditLog.create({
//         data: {
//           userId: Number(userId),
//           action: 'UPDATE',
//           entityType: 'PASSWORD',
//           entityId: Number(userId),
//         },
//       });

//       return { message: 'Password changed successfully' };
//     } catch (error) {
//       throw new InternalServerErrorException('Password change failed');
//     }
//   }

//   async logout(token: string) {
//     try {
//       await this.prisma.userSession.updateMany({
//         where: { sessionToken: token },
//         data: { isActive: false },
//       });

//       return { message: 'Logged out successfully' };
//     } catch (error) {
//       throw new InternalServerErrorException('Logout failed');
//     }
//   }

//   async logoutAll(userId: number) {
//     try {
//       await this.prisma.userSession.updateMany({
//         where: { userId: Number(userId), isActive: true },
//         data: { isActive: false },
//       });

//       // Audit log
//       await this.prisma.auditLog.create({
//         data: {
//           userId: Number(userId),
//           action: 'LOGOUT',
//           entityType: 'SESSION',
//           entityId: Number(userId),
//         },
//       });

//       return { message: 'Logged out from all devices' };
//     } catch (error) {
//       throw new InternalServerErrorException('Logout all failed');
//     }
//   }

//   async deleteUser(userId: number, currentUserId: number) {
//     if (userId === currentUserId) {
//       throw new BadRequestException('You cannot delete your own account');
//     }

//     const user = await this.prisma.user.findUnique({
//       where: { id: Number(userId) },
//       include: { role: true },
//     });

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     // Prevent deletion of system admin users
//     if (user.role.isSystem && ['SUPER_ADMIN', 'ADMIN'].includes(user.role.name.toUpperCase())) {
//       throw new BadRequestException('Cannot delete system administrator accounts');
//     }

//     try {
//       // Soft delete user
//       await this.prisma.user.update({
//         where: { id: Number(userId) },
//         data: { isActive: false },
//       });

//       // Invalidate all sessions
//       await this.prisma.userSession.updateMany({
//         where: { userId: Number(userId) },
//         data: { isActive: false },
//       });

//       // Audit log
//       await this.prisma.auditLog.create({
//         data: {
//           userId: Number(currentUserId),
//           action: 'DELETE',
//           entityType: 'USER',
//           entityId: Number(userId),
//           details: { deletedBy: currentUserId },
//         },
//       });

//       return { message: 'User deleted successfully' };
//     } catch (error) {
//       throw new InternalServerErrorException('User deletion failed');
//     }
//   }

//   async getActiveSessions(userId: number) {
//     try {
//       const sessions = await this.prisma.userSession.findMany({
//         where: {
//           userId: Number(userId),
//           isActive: true,
//           expiresAt: { gt: new Date() },
//         },
//         orderBy: { createdAt: 'desc' },
//       });

//       return sessions;
//     } catch (error) {
//       throw new InternalServerErrorException('Sessions retrieval failed');
//     }
//   }

//   async refreshToken(userId: number) {
//     try {
//       const user = await this.validateUserById(userId);
//       if (!user) {
//         throw new UnauthorizedException('User not found');
//       }

//       const payload: JwtPayload = { 
//         sub: user.id, 
//         username: user.username,
//         role: user.role.name,
//       };

//       const token = this.jwtService.sign(payload, {
//         secret: this.configService.get('jwt.secret'),
//         expiresIn: this.configService.get('jwt.expiresIn'),
//       });

//       // Update session
//       const expiresAt = new Date();
//       expiresAt.setHours(expiresAt.getHours() + 24);

//       await this.prisma.userSession.updateMany({
//         where: { userId: Number(userId), isActive: true },
//         data: { expiresAt },
//       });

//       return {
//         access_token: token,
//         token_type: 'Bearer',
//         expires_in: this.configService.get('jwt.expiresIn'),
//       };
//     } catch (error) {
//       throw new InternalServerErrorException('Token refresh failed');
//     }
//   }

//   async healthCheck() {
//     let dbStatus = 'disconnected';
//     try {
//       await this.prisma.$queryRaw`SELECT 1`;
//       dbStatus = 'connected';
//     } catch (error) {
//       dbStatus = 'error';
//     }

//     return {
//       status: 'ok',
//       timestamp: new Date().toISOString(),
//       uptime: process.uptime(),
//       database: dbStatus,
//       environment: process.env.NODE_ENV || 'development',
//       version: process.env.npm_package_version || '1.0.0',
//     };
//   }

//   // Helper method to format accessible modules
//   private formatAccessibleModules(modulePermissions: any[]) {
//     return modulePermissions.map((permission) => ({
//       id: permission.module.id,
//       name: permission.module.name,
//       description: permission.module.description,
//       path: permission.module.path,
//       icon: permission.module.icon,
//       order: permission.module.order,
//       permissions: {
//         canView: permission.canView,
//         canCreate: permission.canCreate,
//         canEdit: permission.canEdit,
//         canDelete: permission.canDelete,
//       },
//     })).sort((a, b) => a.order - b.order);
//   }
// }

import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException, 
  NotFoundException,
  BadRequestException,
  InternalServerErrorException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          OR: [{ username }, { email: username }],
          isActive: true,
        },
        include: {
          role: {
            include: {
              modulePermissions: {
                include: {
                  module: true,
                },
                where: {
                  canView: true,
                  module: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      });

      if (user && (await bcrypt.compare(password, user.passwordHash))) {
        const { passwordHash, ...result } = user;
        
        const accessibleModules = this.formatAccessibleModules(user.role.modulePermissions);
        return {
          ...result,
          accessibleModules,
        };
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException('Authentication service error');
    }
  }

  async validateUserById(userId: number): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId), isActive: true },
        include: {
          role: {
            include: {
              modulePermissions: {
                include: {
                  module: true,
                },
                where: {
                  canView: true,
                  module: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      });

      if (user) {
        const { passwordHash, ...result } = user;
        const accessibleModules = this.formatAccessibleModules(user.role.modulePermissions);
        return {
          ...result,
          accessibleModules,
        };
      }
      return null;
    } catch (error) {
      throw new InternalServerErrorException('User validation error');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { email: loginDto.email, isActive: true },
        include: {
          role: true
        }
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Validate password
      const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { 
        sub: user.id, 
        email: user.email,
        role: user.role?.name || 'STUDENT',
        roleId: user.roleId
      };

      const accessToken = await this.jwtService.signAsync(payload);

      // Create session
      await this.prisma.userSession.create({
        data: {
          userId: user.id,
          sessionToken: accessToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
          isActive: true,
        },
      });

      // Create login audit log
      await this.createAuditLog({
        userId: user.id,
        action: 'LOGIN',
        entityType: 'USER',
        entityId: user.id,
        description: `User logged in successfully`
      });

      return {
        message: 'Login successful',
        access_token: accessToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role?.name || 'STUDENT',
          roleId: user.roleId,
          permissions: user.role?.permissions || {}
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      console.log('🚀 Starting registration for:', registerDto.email);

      // Check if user exists
      const existingUser = await this.prisma.user.findFirst({
        where: { email: registerDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Handle role assignment
      let finalRoleId = registerDto.roleId;
      
      if (finalRoleId) {
        const requestedRole = await this.prisma.role.findUnique({
          where: { id: finalRoleId }
        });
        
        if (!requestedRole) {
          console.log('❌ Requested role not found, using default STUDENT');
          finalRoleId = null;
        }
      }

      // Use STUDENT as default role
      if (!finalRoleId) {
        const studentRole = await this.prisma.role.findFirst({
          where: { name: 'STUDENT' }
        });
        finalRoleId = studentRole?.id || 1;
      }

      // Hash password
      const passwordHash = await bcrypt.hash(registerDto.password, 12);

      // Create user
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          passwordHash: passwordHash,
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
          username: registerDto.username || registerDto.email,
          phone: registerDto.phone || '',
          roleId: finalRoleId
        },
        include: {
          role: true
        }
      });

      // Create registration audit log
      await this.createAuditLog({
        userId: user.id,
        action: 'CREATE',
        entityType: 'USER',
        entityId: user.id,
        description: `User registered with role: ${user.role?.name || 'STUDENT'}`
      });

      console.log('🎉 User created with role:', user.role?.name);

      return {
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          username: user.username,
          roleId: user.roleId,
          role: user.role?.name
        }
      };

    } catch (error) {
      console.error('💥 Registration error:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Registration failed');
    }
  }

  async getProfile(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId), isActive: true },
        include: {
          role: {
            include: {
              modulePermissions: {
                include: {
                  module: true,
                },
                where: {
                  canView: true,
                  module: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const { passwordHash, ...result } = user;
      const accessibleModules = this.formatAccessibleModules(user.role.modulePermissions);

      return {
        ...result,
        accessibleModules,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Profile retrieval failed');
    }
  }

  async createDefaultRoles() {
    const defaultRoles = [
      { name: 'SUPER_ADMIN', description: 'Full system access', isSystem: true, permissions: { all: true } },
      { name: 'ADMIN', description: 'Administrator', isSystem: true, permissions: { manage_users: true, manage_content: true } },
      { name: 'TEACHER', description: 'Teacher', isSystem: false, permissions: { manage_students: true, manage_grades: true } },
      { name: 'STUDENT', description: 'Student', isSystem: false, permissions: { view_grades: true, view_courses: true } },
      { name: 'PARENT', description: 'Parent', isSystem: false, permissions: { view_student_info: true } }
    ];

    for (const roleData of defaultRoles) {
      await this.prisma.role.upsert({
        where: { name: roleData.name },
        update: {},
        create: roleData
      });
    }

    console.log('✅ Default roles created');
    return { message: 'Default roles setup complete' };
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    // Check if email is taken by another user
    if (updateProfileDto.email) {
      const existingUser = await this.prisma.user.findFirst({
        where: {
          email: updateProfileDto.email,
          id: { not: Number(userId) },
        },
      });

      if (existingUser) {
        throw new ConflictException('Email already taken by another user');
      }
    }

    try {
      const user = await this.prisma.user.update({
        where: { id: Number(userId) },
        data: updateProfileDto,
        include: {
          role: {
            include: {
              modulePermissions: {
                include: {
                  module: true,
                },
                where: {
                  canView: true,
                  module: {
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      });

      const { passwordHash, ...result } = user;
      const accessibleModules = this.formatAccessibleModules(user.role.modulePermissions);

      // Audit log - FIXED: Use correct fields based on your Prisma schema
      await this.createAuditLog({
        userId: Number(userId),
        action: 'UPDATE',
        entityType: 'PROFILE',
        entityId: Number(userId),
        description: `Profile updated - Fields: ${Object.keys(updateProfileDto).join(', ')}`
      });

      return {
        message: 'Profile updated successfully',
        user: {
          ...result,
          accessibleModules,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Profile update failed');
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.passwordHash,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    try {
      // Hash new password
      const newPasswordHash = await bcrypt.hash(
        changePasswordDto.newPassword,
        this.configService.get('bcrypt.rounds') || 12,
      );

      // Update password
      await this.prisma.user.update({
        where: { id: Number(userId) },
        data: { passwordHash: newPasswordHash },
      });

      // Invalidate all sessions except current
      await this.prisma.userSession.updateMany({
        where: {
          userId: Number(userId),
          isActive: true,
        },
        data: { isActive: false },
      });

      // Audit log
      await this.createAuditLog({
        userId: Number(userId),
        action: 'UPDATE',
        entityType: 'PASSWORD',
        entityId: Number(userId),
        description: 'Password changed successfully'
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Password change failed');
    }
  }

  async logout(token: string) {
    try {
      await this.prisma.userSession.updateMany({
        where: { sessionToken: token },
        data: { isActive: false },
      });

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new InternalServerErrorException('Logout failed');
    }
  }

  async logoutAll(userId: number) {
    try {
      await this.prisma.userSession.updateMany({
        where: { userId: Number(userId), isActive: true },
        data: { isActive: false },
      });

      // Audit log
      await this.createAuditLog({
        userId: Number(userId),
        action: 'LOGOUT_ALL',
        entityType: 'SESSION',
        entityId: Number(userId),
        description: 'Logged out from all devices'
      });

      return { message: 'Logged out from all devices' };
    } catch (error) {
      throw new InternalServerErrorException('Logout all failed');
    }
  }

  async deleteUser(userId: number, currentUserId: number) {
    if (userId === currentUserId) {
      throw new BadRequestException('You cannot delete your own account');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent deletion of system admin users
    if (user.role.isSystem && ['SUPER_ADMIN', 'ADMIN'].includes(user.role.name.toUpperCase())) {
      throw new BadRequestException('Cannot delete system administrator accounts');
    }

    try {
      // Soft delete user
      await this.prisma.user.update({
        where: { id: Number(userId) },
        data: { isActive: false },
      });

      // Invalidate all sessions
      await this.prisma.userSession.updateMany({
        where: { userId: Number(userId) },
        data: { isActive: false },
      });

      // Audit log - FIXED: Use correct fields
      await this.createAuditLog({
        userId: Number(currentUserId),
        action: 'DELETE',
        entityType: 'USER',
        entityId: Number(userId),
        description: `User deleted by admin (ID: ${currentUserId})`
      });

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException('User deletion failed');
    }
  }

  async getActiveSessions(userId: number) {
    try {
      const sessions = await this.prisma.userSession.findMany({
        where: {
          userId: Number(userId),
          isActive: true,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
      });

      return sessions;
    } catch (error) {
      throw new InternalServerErrorException('Sessions retrieval failed');
    }
  }

  async refreshToken(userId: number) {
    try {
      const user = await this.validateUserById(userId);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const payload: JwtPayload = { 
        sub: user.id, 
        username: user.username,
        role: user.role.name,
      };

      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.expiresIn'),
      });

      // Update session
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await this.prisma.userSession.updateMany({
        where: { userId: Number(userId), isActive: true },
        data: { expiresAt },
      });

      return {
        access_token: token,
        token_type: 'Bearer',
        expires_in: this.configService.get('jwt.expiresIn'),
      };
    } catch (error) {
      throw new InternalServerErrorException('Token refresh failed');
    }
  }

  async healthCheck() {
    let dbStatus = 'disconnected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'connected';
    } catch (error) {
      dbStatus = 'error';
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbStatus,
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  // Helper method to format accessible modules
  private formatAccessibleModules(modulePermissions: any[]) {
    return modulePermissions.map((permission) => ({
      id: permission.module.id,
      name: permission.module.name,
      description: permission.module.description,
      path: permission.module.path,
      icon: permission.module.icon,
      order: permission.module.order,
      permissions: {
        canView: permission.canView,
        canCreate: permission.canCreate,
        canEdit: permission.canEdit,
        canDelete: permission.canDelete,
      },
    })).sort((a, b) => a.order - b.order);
  }

  // Helper method to create audit logs with proper field mapping
  private async createAuditLog(auditData: {
    userId: number;
    action: string;
    entityType: string;
    entityId: number;
    description?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId: auditData.userId,
          action: auditData.action,
          entityType: auditData.entityType,
          entityId: auditData.entityId,
          description: auditData.description,
          ipAddress: auditData.ipAddress || 'Unknown',
          userAgent: auditData.userAgent || 'Unknown',
          timestamp: new Date(),
        },
      });
    } catch (error) {
      console.error('Failed to create audit log:', error);
      // Don't throw error here as audit log failure shouldn't break main operations
    }
  }
}