import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Application')
@Controller()
export class AppController {
  @Public()
  @Get()
  @ApiOperation({ 
    summary: 'API Root', 
    description: 'Root endpoint returning API information and status' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API information',
    schema: {
      example: {
        message: 'ERP School Management System API',
        version: '1.0.0',
        status: 'operational',
        timestamp: '2023-10-01T12:00:00.000Z',
        documentation: '/api/docs'
      }
    }
  })
  getRoot() {
    return {
      message: 'ERP School Management System API',
      version: process.env.npm_package_version || '1.0.0',
      status: 'operational',
      timestamp: new Date().toISOString(),
      documentation: '/api/docs',
      support: 'support@sophor-tech.com',
    };
  }

  @Public()
  @Get('status')
  @ApiOperation({ 
    summary: 'API Status', 
    description: 'Detailed API status and health information' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'API status details',
    schema: {
      example: {
        status: 'ok',
        environment: 'production',
        version: '1.0.0',
        uptime: 3600.25,
        timestamp: '2023-10-01T12:00:00.000Z',
        memory: {
          used: '45.2 MB',
          total: '512 MB',
          usage: '8.8%'
        },
        node: 'v18.17.1'
      }
    }
  })
  getStatus() {
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'ok',
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: {
        used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`,
        total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
        usage: `${Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)}%`
      },
      node: process.version,
    };
  }
}