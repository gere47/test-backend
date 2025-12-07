import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async createClass(dto: CreateClassDto) {
    return this.prisma.class.create({
      data: {
        name: dto.name,
        grade: dto.grade,
        section: dto.section,
        capacity: dto.capacity,
      },
    });
  }

  async findAll() {
    return this.prisma.class.findMany();
  }

  async findOne(id: number) {
    return this.prisma.class.findUnique({
      where: { id },
    });
  }

  async update(id: number, dto: any) {
    return this.prisma.class.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    return this.prisma.class.delete({
      where: { id },
    });
  }
}
