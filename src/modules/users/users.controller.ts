import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { FilterUserDto } from './dto/filter-user.dto';
import { UserResponseDto } from './dto/user.response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeactivateUserDto } from './dto/deactivate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';  

@UseGuards(JwtAuthGuard, RolesGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** Create user */
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  /** Get all users */
  @Get()
  async findAll(@Query() query: FilterUserDto) {
    return this.usersService.findAll(query);
  }

  /** Get roles */
  @Get('roles')
  async getRoles() {
    return this.usersService.getRoles();
  }

  /** Get stats */
  @Get('stats')
  async getUserStats() {
    return this.usersService.getUserStats();
  }

  /** Get user by ID — MUST BE AT THE END */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req: any) {
    return this.usersService.update(+id, dto, req.user.id);
  }

  @Delete(':id/deactivate')
  async deactivate(@Param('id') id: string, @Query() dto: DeactivateUserDto, @Req() req: any) {
    return this.usersService.deactivate(+id, dto.reason, req.user.id);
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string) {
    return this.usersService.activate(+id);
  }
}
