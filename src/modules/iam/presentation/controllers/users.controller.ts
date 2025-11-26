import { 
  Controller, 
  Get, 
  Param, 
  UseGuards,
  Query,
  Delete 
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../../presentation/guards/roles-guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../../domain/enums/user-role.enum';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userRepository: UserRepository) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  async findAll(@Query('role') role?: UserRole) {
    if (role) {
      return this.userRepository.findByRole(role);
    }
    return this.userRepository.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get user by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.userRepository.findById(id as any);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete user (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string) {
    await this.userRepository.delete(id as any);
    return { message: 'User deleted successfully' };
  }
}