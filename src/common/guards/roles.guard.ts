
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // DEBUG: Log the user object to see what's available
    console.log('=== ROLES GUARD DEBUG ===');
    console.log('User object:', user);
    console.log('User role:', user.role);
    console.log('User role name:', user.role?.name);
    console.log('Required roles:', requiredRoles);
    console.log('=========================');

    // FIX: Handle both string role and role object with name property
    let userRoleName: string;
    
    if (typeof user.role === 'string') {
      // Role is a string (e.g., 'ADMIN')
      userRoleName = user.role;
    } else if (user.role && typeof user.role === 'object' && user.role.name) {
      // Role is an object with name property (e.g., { name: 'ADMIN' })
      userRoleName = user.role.name;
    } else {
      throw new ForbiddenException('User role not found or invalid');
    }

    const hasRole = requiredRoles.some(role => userRoleName === role);
    
    if (!hasRole) {
      throw new ForbiddenException(`Required roles: ${requiredRoles.join(', ')}. Your role: ${userRoleName}`);
    }

    console.log(` Access granted for role: ${userRoleName}`);
    return true;
  }
}