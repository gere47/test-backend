// src/modules/users/users.controller.ts
import { Controller, Get, Put, Delete, Post, Param, Body, Query, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users (Paginated)',
    description: 'Get paginated list of all active users with search and filter capabilities. Requires admin privileges.'
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
    @Query('roleId') roleId?: number
  ) {
    const pageSize = Math.min(limit, 100);
    return this.usersService.findAll(page, pageSize, search, roleId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get detailed information about a specific user including role and module permissions'
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user information. Email must be unique. Role changes are restricted based on permissions.'
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @Req() req: any
  ) {
    return this.usersService.update(+id, updateUserDto, req.user.id);
  }

  @Delete(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate user',
    description: 'Deactivate user account (soft delete). User cannot login after deactivation.'
  })
  async deactivate(
    @Param('id') id: string,
    @Query('reason') reason: string = 'No reason provided',
    @Req() req: any
  ) {
    return this.usersService.deactivate(+id, reason, req.user.id);
  }

  @Post(':id/activate')
  @ApiOperation({
    summary: 'Activate user',
    description: 'Activate a previously deactivated user account.'
  })
  async activate(@Param('id') id: string, @Req() req: any) {
    return this.usersService.activate(+id, req.user.id);
  }

  @Get('roles')
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Get list of all available roles in the system'
  })
  async getRoles() {
    return this.usersService.getRoles();
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get user statistics',
    description: 'Get user statistics including total users, distribution by role, and recent registrations'
  })
  async getUserStats() {
    return this.usersService.getUserStats();
  }
}