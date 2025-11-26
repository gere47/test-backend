// src/modules/iam/infrastructure/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: any): Promise<any> {
    return this.prisma.user.create({
      data: {
        ...data,
        name: `${data.firstName} ${data.lastName}`, // Add name field for Prisma
      },
    });
  }

  async update(id: string, data: any): Promise<any> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

// Fix the role filter and ensure proper imports
async findByRole(role: string) {
  return this.prisma.user.findMany({
    where: { 
      role: role // Use the field name from your schema
    },
  });
}

// For auditLog - make sure the method signature matches
async createAuditLog(data: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  return this.prisma.auditLog.create({
    data: {
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      resourceId: data.resourceId,
      details: data.details,
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
    },
  });
}

async findAll(): Promise<any[]> {
  return this.prisma.user.findMany();
}

async delete(id: string): Promise<any> {
  return this.prisma.user.delete({
    where: { id },
  });
}

}