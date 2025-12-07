import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  /** Remove sensitive fields before sending to client */
  private toResponse(user: any) {
    if (!user) return null;
    const { passwordHash, ...clean } = user;
    return clean;
  }

  // GET ALL USERS (WITH PROJECT MANAGER'S RESPONSE STANDARD)
  async findAll(query: any) {
    const page = Number(query.page) || 1;
    const page_size = Number(query.page_size) || Number(query.limit) || 10;
    const search = query.search || '';
    const role = query.role || '';
    const status = query.status || '';

    const skip = (page - 1) * page_size;

    const where: any = {};

    // Search filtering
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by role
    if (role) where.roleId = Number(role);

    // Filter by status
    if (status) where.isActive = status === 'active';

    const [list, count] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: page_size,
        orderBy: { id: 'desc' },
        include: { role: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    const total_pages = Math.ceil(count / page_size);

    // ✔ FIXED: Proper BASE_URL handling
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';

    return {
      count,
      total_pages,
      current_page: page,
      next:
        page < total_pages
          ? `${baseUrl}/users?page=${page + 1}&page_size=${page_size}`
          : null,
      previous:
        page > 1
          ? `${baseUrl}/users?page=${page - 1}&page_size=${page_size}`
          : null,
      page_size,
      data: list.map((u) => this.toResponse(u)),
    };
  }

  // GET ONE USER
  async findOne(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });

    if (!user) throw new NotFoundException('User not found');

    return this.toResponse(user);
  }

  // CREATE USER
  async create(dto: CreateUserDto) {
    const emailExists = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (emailExists) throw new ConflictException('Email already exists');

    const user = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        username: dto.username,
        phone: dto.phone,
        passwordHash: dto.passwordHash, // Already hashed
        role: {
          connect: { id: dto.roleId },
        },
      },
      include: { role: true },
    });

    return this.toResponse(user);
  }

  // UPDATE USER
  async update(id: number, dto: UpdateUserDto, currentUserId: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    if (id === currentUserId) {
      throw new BadRequestException('You cannot update your own account');
    }

    // Check duplicate email
    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });
      if (emailExists) throw new ConflictException('Email already exists');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        roleId: dto.roleId,
      },
      include: { role: true },
    });

    return this.toResponse(updated);
  }

  // DEACTIVATE USER
  async deactivate(id: number, reason: string, currentUserId: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    if (id === currentUserId) {
      throw new BadRequestException('You cannot deactivate yourself');
    }

    if (user.roleId === 1) {
      throw new BadRequestException('Super Admin cannot be deactivated');
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
      include: { role: true },
    });

    return this.toResponse(updated);
  }

  // ACTIVATE USER
  async activate(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
      include: { role: true },
    });

    return this.toResponse(updated);
  }

  // LIST ROLES
  async getRoles() {
    return this.prisma.role.findMany({
      orderBy: { id: 'asc' },
    });
  }

  // USER STATS
  async getUserStats() {
    const totalUsers = await this.prisma.user.count();

    const grouped = await this.prisma.user.groupBy({
      by: ['roleId'],
      _count: { _all: true },
    });

    const roleStats = await Promise.all(
      grouped.map(async (group) => {
        const role = await this.prisma.role.findUnique({
          where: { id: group.roleId },
        });

        return {
          roleId: group.roleId,
          roleName: role?.name || 'Unknown',
          count: group._count._all,
        };
      }),
    );

    const recentUsers = await this.prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { role: true },
    });

    return {
      totalUsers,
      roleStats,
      recentUsers: recentUsers.map((u) => this.toResponse(u)),
    };
  }
}
