// src/modules/users/users.service.ts - COMPLETELY FIXED VERSION
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number, search: string, roleId?: number) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (search) {
        where.OR = [
          { username: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (roleId) {
        where.roleId = roleId;
      }

      const [users, total] = await Promise.all([
        this.prisma.user.findMany({
          where,
          include: {
            role: true,
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.user.count({ where }),
      ]);

      return {
        data: users,
        meta: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new Error('Failed to fetch users');
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        include: {
          role: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to fetch user');
    }
  }

  async update(id: number, updateUserDto: any, currentUserId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Prevent users from modifying their own account
      if (id === currentUserId) {
        throw new BadRequestException('Cannot modify your own account');
      }

      // Check for duplicate email if email is being updated
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingUser = await this.prisma.user.findFirst({
          where: { email: updateUserDto.email },
        });

        if (existingUser) {
          throw new ConflictException('Email already exists');
        }
      }

      return await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
        include: {
          role: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || 
          error instanceof ConflictException || 
          error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to update user');
    }
  }

  async deactivate(id: number, reason: string, currentUserId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Prevent users from deactivating their own account
      if (id === currentUserId) {
        throw new BadRequestException('Cannot deactivate your own account');
      }

      // Prevent deactivating system admin accounts
      if (user.roleId === 1) { // Assuming 1 is super_admin role ID
        throw new BadRequestException('Cannot deactivate system administrator accounts');
      }

      // FIXED: Only update isActive field (remove all other unsupported fields)
      return await this.prisma.user.update({
        where: { id },
        data: {
          isActive: false,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new Error('Failed to deactivate user');
    }
  }

  async activate(id: number, currentUserId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // FIXED: Only update isActive field (remove all other unsupported fields)
      return await this.prisma.user.update({
        where: { id },
        data: {
          isActive: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to activate user');
    }
  }

  async getRoles() {
    try {
      const roles = await this.prisma.role.findMany({
        orderBy: { id: 'asc' },
      });

      return {
        data: roles,
        total: roles.length,
      };
    } catch (error) {
      throw new Error('Failed to fetch roles');
    }
  }

  async getUserStats() {
    try {
      const totalUsers = await this.prisma.user.count();
      
      const roleStats = await this.prisma.user.groupBy({
        by: ['roleId'],
        _count: {
          _all: true,
        },
      });

      // Enhance role stats with role names
      const enhancedRoleStats = await Promise.all(
        roleStats.map(async (stat) => {
          const role = await this.prisma.role.findUnique({
            where: { id: stat.roleId },
            select: { name: true },
          });
          return {
            roleId: stat.roleId,
            roleName: role?.name || 'Unknown',
            count: stat._count._all,
          };
        })
      );

      const recentUsers = await this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          role: {
            select: { name: true },
          },
        },
      });

      return {
        totalUsers,
        roleStats: enhancedRoleStats,
        recentUsers,
      };
    } catch (error) {
      throw new Error('Failed to fetch user statistics');
    }
  }
}