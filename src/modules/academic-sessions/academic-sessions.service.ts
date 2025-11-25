
// // // // // import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
// // // // // import { PrismaService } from '../../database/prisma.service';
// // // // // import { CreateAcademicSessionDto, UpdateAcademicSessionDto } from './dto/create-academic-session.dto';

// // // // // @Injectable()
// // // // // export class AcademicSessionsService {
// // // // //   constructor(private prisma: PrismaService) {}

// // // // //   async create(createAcademicSessionDto: CreateAcademicSessionDto) {
// // // // //     // Check if session with same name already exists
// // // // //     const existingSession = await this.prisma.academicSession.findFirst({
// // // // //       where: { 
// // // // //         name: createAcademicSessionDto.name
// // // // //       },
// // // // //     });

// // // // //     if (existingSession) {
// // // // //       throw new ConflictException('Academic session with this name already exists');
// // // // //     }

// // // // //     // Validate date range
// // // // //     if (createAcademicSessionDto.startDate >= createAcademicSessionDto.endDate) {
// // // // //       throw new BadRequestException('Start date must be before end date');
// // // // //     }

// // // // //     // If setting as active, deactivate all other sessions
// // // // //     if (createAcademicSessionDto.isActive) {
// // // // //       await this.deactivateAllSessions();
// // // // //     }

// // // // //     return this.prisma.academicSession.create({
// // // // //       data: createAcademicSessionDto,
// // // // //     });
// // // // //   }

// // // // //   async findAll() {
// // // // //     return this.prisma.academicSession.findMany({
// // // // //       orderBy: { startDate: 'desc' },
// // // // //     });
// // // // //   }

// // // // //   async findActive() {
// // // // //     const activeSession = await this.prisma.academicSession.findFirst({
// // // // //       where: { isActive: true },
// // // // //     });

// // // // //     if (!activeSession) {
// // // // //       throw new NotFoundException('No active academic session found');
// // // // //     }

// // // // //     return activeSession;
// // // // //   }

// // // // //   async findOne(id: number) {
// // // // //     const session = await this.prisma.academicSession.findUnique({
// // // // //       where: { id },
// // // // //     });

// // // // //     if (!session) {
// // // // //       throw new NotFoundException(`Academic session with ID ${id} not found`);
// // // // //     }

// // // // //     return session;
// // // // //   }

// // // // //   async update(id: number, updateAcademicSessionDto: UpdateAcademicSessionDto) {
// // // // //     await this.findOne(id); // Check if exists

// // // // //     // If activating this session, deactivate all others
// // // // //     if (updateAcademicSessionDto.isActive) {
// // // // //       await this.deactivateAllSessions();
// // // // //     }

// // // // //     return this.prisma.academicSession.update({
// // // // //       where: { id },
// // // // //       data: updateAcademicSessionDto,
// // // // //     });
// // // // //   }

// // // // //   async activate(id: number) {
// // // // //     await this.findOne(id); // Check if exists
    
// // // // //     // Deactivate all other sessions first
// // // // //     await this.deactivateAllSessions();

// // // // //     return this.prisma.academicSession.update({
// // // // //       where: { id },
// // // // //       data: { isActive: true },
// // // // //     });
// // // // //   }

// // // // //   private async deactivateAllSessions() {
// // // // //     await this.prisma.academicSession.updateMany({
// // // // //       data: { isActive: false },
// // // // //     });
// // // // //   }

// // // // //   async remove(id: number) {
// // // // //     await this.findOne(id); // Check if exists

// // // // //     return this.prisma.academicSession.delete({
// // // // //       where: { id },
// // // // //     });
// // // // //   }
// // // // // }

// // // // import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// // // // import { PrismaService } from '../../database/prisma.service';
// // // // import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';
// // // // import { UpdateAcademicSessionDto } from './dto/update-academic-session.dto';

// // // // @Injectable()
// // // // export class AcademicSessionsService {
// // // //   constructor(private prisma: PrismaService) {}

// // // //   async create(createAcademicSessionDto: CreateAcademicSessionDto) {
// // // //     const { isCurrent, ...sessionData } = createAcademicSessionDto;

// // // //     // If setting as current, deactivate other current sessions
// // // //     if (isCurrent) {
// // // //       await this.prisma.academicSession.updateMany({
// // // //         where: { isCurrent: true },
// // // //         data: { isCurrent: false },
// // // //       });
// // // //     }

// // // //     return this.prisma.academicSession.create({
// // // //       data: {
// // // //         ...sessionData,
// // // //         isCurrent: isCurrent || false,
// // // //       },
// // // //     });
// // // //   }

// // // //   async findAll() {
// // // //     return this.prisma.academicSession.findMany({
// // // //       orderBy: {
// // // //         startDate: 'desc',
// // // //       },
// // // //     });
// // // //   }

// // // //   async findCurrent() {
// // // //     return this.prisma.academicSession.findFirst({
// // // //       where: { isCurrent: true },
// // // //     });
// // // //   }

// // // //   async findOne(id: string) {
// // // //     const session = await this.prisma.academicSession.findUnique({
// // // //       where: { id },
// // // //     });

// // // //     if (!session) {
// // // //       throw new NotFoundException('Academic session not found');
// // // //     }

// // // //     return session;
// // // //   }

// // // //   async update(id: string, updateAcademicSessionDto: UpdateAcademicSessionDto) {
// // // //     await this.findOne(id); // Check if exists

// // // //     const { isCurrent, ...updateData } = updateAcademicSessionDto;

// // // //     // If setting as current, deactivate other current sessions
// // // //     if (isCurrent) {
// // // //       await this.prisma.academicSession.updateMany({
// // // //         where: { 
// // // //           isCurrent: true,
// // // //           id: { not: id }
// // // //         },
// // // //         data: { isCurrent: false },
// // // //       });
// // // //     }

// // // //     return this.prisma.academicSession.update({
// // // //       where: { id },
// // // //       data: {
// // // //         ...updateData,
// // // //         ...(isCurrent !== undefined ? { isCurrent } : {}),
// // // //       },
// // // //     });
// // // //   }

// // // //   async remove(id: string) {
// // // //     await this.findOne(id); // Check if exists

// // // //     // Check if session has associated data
// // // //     const hasStudents = await this.prisma.student.count({
// // // //       where: {
// // // //         admissionDate: {
// // // //           gte: await this.getSessionStartDate(id),
// // // //           lte: await this.getSessionEndDate(id),
// // // //         },
// // // //       },
// // // //     });

// // // //     if (hasStudents > 0) {
// // // //       throw new ConflictException('Cannot delete academic session with associated students');
// // // //     }

// // // //     return this.prisma.academicSession.delete({
// // // //       where: { id },
// // // //     });
// // // //   }

// // // //   async setCurrent(id: string) {
// // // //     await this.findOne(id); // Check if exists

// // // //     // Deactivate other current sessions
// // // //     await this.prisma.academicSession.updateMany({
// // // //       where: { 
// // // //         isCurrent: true,
// // // //         id: { not: id }
// // // //       },
// // // //       data: { isCurrent: false },
// // // //     });

// // // //     // Set this session as current
// // // //     return this.prisma.academicSession.update({
// // // //       where: { id },
// // // //       data: { isCurrent: true },
// // // //     });
// // // //   }

// // // //   private async getSessionStartDate(id: string): Promise<Date> {
// // // //     const session = await this.prisma.academicSession.findUnique({
// // // //       where: { id },
// // // //       select: { startDate: true },
// // // //     });
// // // //     return session?.startDate || new Date();
// // // //   }

// // // //   private async getSessionEndDate(id: string): Promise<Date> {
// // // //     const session = await this.prisma.academicSession.findUnique({
// // // //       where: { id },
// // // //       select: { endDate: true },
// // // //     });
// // // //     return session?.endDate || new Date();
// // // //   }
// // // // }

// // // import { Injectable, NotFoundException } from '@nestjs/common';
// // // import { PrismaService } from '../../database/prisma.service';
// // // import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';
// // // import { UpdateAcademicSessionDto } from './dto/update-academic-session.dto';

// // // @Injectable()
// // // export class AcademicSessionsService {
// // //   constructor(private prisma: PrismaService) {}

// // //   async create(createAcademicSessionDto: CreateAcademicSessionDto) {
// // //     const { isCurrent, ...sessionData } = createAcademicSessionDto;

// // //     // If setting as current, deactivate other current sessions
// // //     if (isCurrent) {
// // //       await this.prisma.academicSession.updateMany({
// // //         where: { isCurrent: true },
// // //         data: { isCurrent: false },
// // //       });
// // //     }

// // //     return this.prisma.academicSession.create({
// // //       data: {
// // //         ...sessionData,
// // //         isCurrent: isCurrent || false,
// // //       },
// // //     });
// // //   }

// // //   async findAll() {
// // //     return this.prisma.academicSession.findMany({
// // //       orderBy: {
// // //         startDate: 'desc',
// // //       },
// // //     });
// // //   }

// // //   async findCurrent() {
// // //     return this.prisma.academicSession.findFirst({
// // //       where: { isCurrent: true },
// // //     });
// // //   }

// // //   async findOne(id: string) {
// // //     const session = await this.prisma.academicSession.findUnique({
// // //       where: { id },
// // //     });

// // //     if (!session) {
// // //       throw new NotFoundException('Academic session not found');
// // //     }

// // //     return session;
// // //   }

// // //   async update(id: string, updateAcademicSessionDto: UpdateAcademicSessionDto) {
// // //     await this.findOne(id); // Check if exists

// // //     const { isCurrent, ...updateData } = updateAcademicSessionDto;

// // //     // If setting as current, deactivate other current sessions
// // //     if (isCurrent) {
// // //       await this.prisma.academicSession.updateMany({
// // //         where: { 
// // //           isCurrent: true,
// // //           id: { not: id }
// // //         },
// // //         data: { isCurrent: false },
// // //       });
// // //     }

// // //     return this.prisma.academicSession.update({
// // //       where: { id },
// // //       data: {
// // //         ...updateData,
// // //         ...(isCurrent !== undefined ? { isCurrent } : {}),
// // //       },
// // //     });
// // //   }

// // //   async remove(id: string) {
// // //     await this.findOne(id); // Check if exists
// // //     return this.prisma.academicSession.delete({
// // //       where: { id },
// // //     });
// // //   }
// // // }

// // import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
// // import { PrismaService } from '../../database/prisma.service';
// // import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';
// // import { UpdateAcademicSessionDto } from './dto/update-academic-session.dto';

// // @Injectable()
// // export class AcademicSessionsService {
// //   constructor(private prisma: PrismaService) {}

// //   async create(createAcademicSessionDto: CreateAcademicSessionDto) {
// //     const { isCurrent, ...sessionData } = createAcademicSessionDto;

// //     // If setting as current, deactivate other current sessions
// //     if (isCurrent) {
// //       await this.prisma.academicSession.updateMany({
// //         where: { isCurrent: true },
// //         data: { isCurrent: false },
// //       });
// //     }

// //     return this.prisma.academicSession.create({
// //       data: {
// //         ...sessionData,
// //         isCurrent: isCurrent || false,
// //       },
// //     });
// //   }

// //   async findAll() {
// //     return this.prisma.academicSession.findMany({
// //       orderBy: {
// //         startDate: 'desc',
// //       },
// //     });
// //   }

// //   async findCurrent() {
// //     return this.prisma.academicSession.findFirst({
// //       where: { isCurrent: true },
// //     });
// //   }

// //   async findOne(id: string) {
// //     const session = await this.prisma.academicSession.findUnique({
// //       where: { id },
// //     });

// //     if (!session) {
// //       throw new NotFoundException('Academic session not found');
// //     }

// //     return session;
// //   }

// //   async update(id: string, updateAcademicSessionDto: UpdateAcademicSessionDto) {
// //     await this.findOne(id); // Check if exists

// //     const { isCurrent, ...updateData } = updateAcademicSessionDto;

// //     // If setting as current, deactivate other current sessions
// //     if (isCurrent) {
// //       await this.prisma.academicSession.updateMany({
// //         where: { 
// //           isCurrent: true,
// //           id: { not: id }
// //         },
// //         data: { isCurrent: false },
// //       });
// //     }

// //     return this.prisma.academicSession.update({
// //       where: { id },
// //       data: {
// //         ...updateData,
// //         ...(isCurrent !== undefined ? { isCurrent } : {}),
// //       },
// //     });
// //   }

// //   async remove(id: string) {
// //     await this.findOne(id); // Check if exists
// //     return this.prisma.academicSession.delete({
// //       where: { id },
// //     });
// //   }

// //   async setCurrent(id: string) {
// //     await this.findOne(id); // Check if exists

// //     // Deactivate other current sessions
// //     await this.prisma.academicSession.updateMany({
// //       where: { 
// //         isCurrent: true,
// //         id: { not: id }
// //       },
// //       data: { isCurrent: false },
// //     });

// //     // Set this session as current
// //     return this.prisma.academicSession.update({
// //       where: { id },
// //       data: { isCurrent: true },
// //     });
// //   }
// // }

// import { Injectable, NotFoundException } from '@nestjs/common';
// import { PrismaService } from '../../database/prisma.service';
// import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';
// import { UpdateAcademicSessionDto } from './dto/update-academic-session.dto';

// @Injectable()
// export class AcademicSessionsService {
//   constructor(private prisma: PrismaService) {}

//   async create(createAcademicSessionDto: CreateAcademicSessionDto) {
//     const { isCurrent, ...sessionData } = createAcademicSessionDto;

//     // If setting as current, deactivate other current sessions
//     if (isCurrent) {
//       await this.prisma.academicSession.updateMany({
//         where: { isActive: true },
//         data: { isActive: false },
//       });
//     }

//     return this.prisma.academicSession.create({
//       data: {
//         ...sessionData,
//         isActive: isCurrent || false,
//       },
//     });
//   }

//   async findAll() {
//     return this.prisma.academicSession.findMany({
//       orderBy: {
//         startDate: 'desc',
//       },
//     });
//   }

//   async findCurrent() {
//     return this.prisma.academicSession.findFirst({
//       where: { isActive: true },
//     });
//   }

//   async findOne(id: string) {
//     const session = await this.prisma.academicSession.findUnique({
//       where: { id: Number(id) },
//     });

//     if (!session) {
//       throw new NotFoundException('Academic session not found');
//     }

//     return session;
//   }

//   async update(id: string, updateAcademicSessionDto: UpdateAcademicSessionDto) {
//     await this.findOne(id); // Check if exists

//     const { isCurrent, ...updateData } = updateAcademicSessionDto;

//     // If setting as current, deactivate other current sessions
//     if (isCurrent) {
//       await this.prisma.academicSession.updateMany({
//         where: { 
//           isActive: true,
//           id: { not:  Number(id) }
//         },
//         data: { isActive: false },
//       });
//     }

//     return this.prisma.academicSession.update({
//       where: { id: Number(id) },
//       data: {
//         ...updateData,
//         ...(isCurrent !== undefined ? { isCurrent } : {}),
//       },
//     });
//   }

//   async remove(id: string) {
//     await this.findOne(id); // Check if exists
//     return this.prisma.academicSession.delete({
//       where: { id: Number(id) },
//     });
//   }

//   async setCurrent(id: string) {
//     await this.findOne(id); // Check if exists

//     // Deactivate other current sessions
//     await this.prisma.academicSession.updateMany({
//       where: { 
//         isActive: true,
//         id: { not:  Number(id) }
//       },
//       data: { isActive: false },
//     });

//     // Set this session as current
//     return this.prisma.academicSession.update({
//       where: { id: Number(id) },
//       data: { isActive: true },
//     });
//   }
// }


import { Injectable, NotFoundException, ConflictException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAcademicSessionDto } from './dto/create-academic-session.dto';
import { UpdateAcademicSessionDto } from './dto/update-academic-session.dto';

@Injectable()
export class AcademicSessionsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new academic session
   */
  async create(createAcademicSessionDto: CreateAcademicSessionDto) {
    try {
      // Check if session with same name already exists
      const existingSession = await this.prisma.academicSession.findFirst({
        where: { name: createAcademicSessionDto.name }
      });

      if (existingSession) {
        throw new ConflictException(`Academic session '${createAcademicSessionDto.name}' already exists`);
      }

      // Validate date range
      if (createAcademicSessionDto.startDate >= createAcademicSessionDto.endDate) {
        throw new BadRequestException('Start date must be before end date');
      }

      // Create the academic session
      return await this.prisma.academicSession.create({
        data: createAcademicSessionDto
      });
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create academic session');
    }
  }

  /**
   * Get all academic sessions with optional filtering
   */
  async findAll(filters?: { isActive?: boolean }): Promise<any[]> {
    try {
      const where: any = {};
      
      if (filters?.isActive !== undefined) {
        where.isActive = filters.isActive;
      }

      return await this.prisma.academicSession.findMany({
        where,
        orderBy: { startDate: 'desc' }
      });
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch academic sessions');
    }
  }

  /**
   * Get current active academic session
   */
  async findCurrent(): Promise<any> {
    try {
      const currentDate = new Date();
      
      const currentSession = await this.prisma.academicSession.findFirst({
        where: {
          isActive: true,
          startDate: { lte: currentDate },
          endDate: { gte: currentDate }
        }
      });

      if (!currentSession) {
        throw new NotFoundException('No active academic session found for current date');
      }

      return currentSession;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch current academic session');
    }
  }

  /**
   * Get academic session by ID
   */
  async findOne(id: number): Promise<any> {
    try {
      const session = await this.prisma.academicSession.findUnique({
        where: { id }
      });

      if (!session) {
        throw new NotFoundException('Academic session not found');
      }

      return session;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch academic session');
    }
  }

  /**
   * Update academic session
   */
  async update(id: number, updateAcademicSessionDto: UpdateAcademicSessionDto): Promise<any> {
    try {
      const session = await this.prisma.academicSession.findUnique({ 
        where: { id } 
      });
      
      if (!session) {
        throw new NotFoundException('Academic session not found');
      }

      // Validate date range if both dates are being updated
      if (updateAcademicSessionDto.startDate && updateAcademicSessionDto.endDate) {
        if (updateAcademicSessionDto.startDate >= updateAcademicSessionDto.endDate) {
          throw new BadRequestException('Start date must be before end date');
        }
      }

      // Check for duplicate name if name is being updated
      if (updateAcademicSessionDto.name && updateAcademicSessionDto.name !== session.name) {
        const existingSession = await this.prisma.academicSession.findFirst({
          where: { name: updateAcademicSessionDto.name }
        });

        if (existingSession) {
          throw new ConflictException(`Academic session '${updateAcademicSessionDto.name}' already exists`);
        }
      }

      return await this.prisma.academicSession.update({
        where: { id },
        data: updateAcademicSessionDto
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException || error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update academic session');
    }
  }

  /**
   * Delete academic session
   */
  async remove(id: number): Promise<void> {
    try {
      const session = await this.prisma.academicSession.findUnique({
        where: { id }
      });

      if (!session) {
        throw new NotFoundException('Academic session not found');
      }

      // Check if session has students
      const studentsCount = await this.prisma.student.count({
        where: { sessionId: id }
      });

      if (studentsCount > 0) {
        throw new BadRequestException('Cannot delete academic session with associated students');
      }

      await this.prisma.academicSession.delete({
        where: { id }
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete academic session');
    }
  }

  /**
   * Set an academic session as current
   */
  async setCurrent(id: number): Promise<any> {
    try {
      const session = await this.prisma.academicSession.findUnique({
        where: { id }
      });

      if (!session) {
        throw new NotFoundException('Academic session not found');
      }

      // First, set all sessions as not current (if you have such a field)
      // If you don't have an isCurrent field, you might want to add it to your schema
      // For now, we'll just activate the session
      
      return await this.prisma.academicSession.update({
        where: { id },
        data: { 
          isActive: true 
        }
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to set academic session as current');
    }
  }

  /**
   * Get academic session statistics
   */
  async getStatistics(): Promise<any> {
  try {
    const totalSessions = await this.prisma.academicSession.count();
    const activeSessions = await this.prisma.academicSession.count({
      where: { isActive: true }
    });
    
    // Remove or comment out this line if admissionOpen field doesn't exist
    // const sessionsWithAdmissionOpen = await this.prisma.academicSession.count({
    //   where: { admissionOpen: true }
    // });

    const recentSessions = await this.prisma.academicSession.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });

    return {
      totalSessions,
      activeSessions,
      // sessionsWithAdmissionOpen, // Remove this if field doesn't exist
      recentSessions
    };
  } catch (error) {
    throw new InternalServerErrorException('Failed to fetch academic session statistics');
  }
}
}