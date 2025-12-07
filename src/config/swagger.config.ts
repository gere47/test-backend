import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('ERP School Management System API')
    .setDescription(`
# 🎓 Sophor Technologies ERP - Complete School Management System

##  API Documentation

Welcome to the ERP School Management System API documentation. This API provides comprehensive endpoints for managing all aspects of a school's operations, from student admission to financial management.

// ###  Authentication & Authorization
// - **JWT Token-based** authentication system
// - **Role-Based Access Control (RBAC)** with fine-grained permissions
// - **Module-level permissions** for each user role
// - **Session management** with device tracking

// ### User Management & Roles
// - **7 Predefined Roles**: super_admin, admin, teacher, student, parent, accountant, librarian
// - **User registration** with role assignment
// - **Profile management** and password security
// - **Active session tracking** and management

// ###  System Modules
// The system is organized into 12 core modules based on the SRS:

// | Module | Description | Key Features |
// |--------|-------------|--------------|
// | **Dashboard** | System overview and analytics | Real-time metrics, quick actions |
// | **User Management** | Authentication & user management | User CRUD, role assignment, permissions |
// | **Student Admission** | Student enrollment system | Online registration, document management |
// | **Attendance Management** | Student & staff tracking | Daily attendance, reports, notifications |
// | **Grade Management** | Examination & grading system | Mark entry, report cards, analytics |
// | **HR & Payroll** | Staff management & payroll | Employee records, salary processing |
// | **Fee Management** | Financial operations | Fee collection, invoices, accounting |
// | **Library Management** | Library resources management | Book catalog, issue/return, fines |
// | **Timetable Management** | Class scheduling | Automatic scheduling, conflict detection |
// | **Communication Portal** | Messaging system | Notifications, announcements, chats |
// | **Inventory Management** | Asset tracking | Stock management, depreciation |
// | **Reports & Analytics** | Data analysis | Custom reports, dashboards, exports |

// ###  Quick Start Guide

// 1. **Authentication**
//    - Register a new user or use default credentials
//    - Login to get JWT token
//    - Use token in Authorization header: \`Bearer <your-token>\`

// 2. **Default Credentials**
//    - **Super Admin**: superadmin / Admin123!
//    - **Admin**: admin / Admin123!
//    - **Teacher**: teacher1 / Teacher123!

// 3. **API Usage**
//    - All endpoints are protected except \`/auth/login\`, \`/auth/register\`, and \`/auth/health\`
//    - Include JWT token in Authorization header for all requests
//    - Check user permissions before accessing module-specific endpoints

// ###  Security Features
// - **JWT tokens** with 24-hour expiration
// - **Password hashing** using bcrypt with 12 rounds
// - **Rate limiting** to prevent abuse
// - **CORS protection** for cross-origin requests
// - **Input validation** using class-validator
// - **Audit logging** for all user actions

// ###  Response Format
// All API responses follow a consistent format:
// \`\`\`json
// {
//   "data": { ... },        // Response data
//   "message": "Success",   // Human-readable message
//   "meta": { ... }         // Pagination metadata (if applicable)
// }
// \`\`\`

// ###  Error Handling
// The API uses standard HTTP status codes:

// | Code | Description |
// |------|-------------|
// | 200 | Success |
// | 201 | Created |
// | 400 | Bad Request - Validation error |
// | 401 | Unauthorized - Invalid token |
// | 403 | Forbidden - Insufficient permissions |
// | 404 | Not Found - Resource not found |
// | 409 | Conflict - Resource already exists |
// | 429 | Too Many Requests - Rate limit exceeded |
// | 500 | Internal Server Error |

// ###  Deployment
// - **Production URL**: https://your-app.onrender.com
// - **API Base**: \`/api/v1\`
// - **Documentation**: \`/api/docs\`
// - **Health Check**: \`/api/v1/auth/health\`

// ---

*For more details about the system requirements and specifications, refer to the complete Software Requirements Specification (SRS) document.*
    `)
    .setVersion('1.0.0')
    .setContact(
      'Sophor Technologies', 
      'https://sophor-tech.com', 
      'support@sophor-tech.com'
    )
    .setLicense('Sophor', 'https://opensource.org/licenses/Sophor')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token obtained from login endpoint',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:5000', 'Development Server')
    .addServer('https://your-app.onrender.com', 'Production Server')
    .addTag('Authentication', 'User authentication, registration, and session management')
    .addTag('Users Management', 'User management, role assignment, and user statistics')
    .addTag('Modules Management', 'System modules and permission management')
    .addTag('Students', 'Student admission and management ')
    .addTag('Attendance', 'Attendance tracking and management ')
    .addTag('Grades', 'Examination and grade management ')
    .addTag('HR & Payroll', 'Human resources and payroll management (Coming Soon)')
    .addTag('Fees', 'Fee collection and accounting (Coming Soon)')
    .addTag('Library', 'Library books and resources management (Coming Soon)')
    .addTag('Timetable', 'Class and teacher scheduling (Coming Soon)')
    .addTag('Communication', 'Messaging and notification system (Coming Soon)')
    .addTag('Inventory', 'School assets and inventory tracking (Coming Soon)')
    .addTag('Reports', 'Data analysis and reporting dashboard (Coming Soon)')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey.replace('Controller', '')}_${methodKey}`,
    extraModels: [],
  });

  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'ERP School Management API Documentation',
    customfavIcon: 'https://sophor-tech.com/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info hgroup.main h2 { 
        color: #2563eb; 
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
      }
      .swagger-ui .info .title { color: #1e293b; }
      .swagger-ui .btn.authorize { 
        background-color: #10b981; 
        border-color: #10b981;
        color: white;
      }
      .swagger-ui .btn.authorize:hover { 
        background-color: #059669; 
        border-color: #059669;
      }
      .swagger-ui .scheme-container { 
        background-color: #f8fafc; 
        border-color: #e2e8f0;
      }
      .swagger-ui .opblock-tag { 
        font-size: 1.2rem; 
        border-bottom: 2px solid #e2e8f0;
        padding-bottom: 0.5rem;
      }
      .swagger-ui .opblock { 
        border: 1px solid #e2e8f0; 
        border-radius: 0.5rem;
        margin-bottom: 1rem;
      }
      .swagger-ui .opblock-summary { 
        background-color: #f8fafc; 
        border-radius: 0.5rem 0.5rem 0 0;
      }
      .swagger-ui .opblock-summary:hover { 
        background-color: #f1f5f9; 
      }
      .swagger-ui .opblock.opblock-get { 
        border-color: #60a5fa; 
      }
      .swagger-ui .opblock.opblock-get .opblock-summary { 
        border-color: #60a5fa; 
      }
      .swagger-ui .opblock.opblock-post { 
        border-color: #34d399; 
      }
      .swagger-ui .opblock.opblock-post .opblock-summary { 
        border-color: #34d399; 
      }
      .swagger-ui .opblock.opblock-put { 
        border-color: #fbbf24; 
      }
      .swagger-ui .opblock.opblock-put .opblock-summary { 
        border-color: #fbbf24; 
      }
      .swagger-ui .opblock.opblock-delete { 
        border-color: #f87171; 
      }
      .swagger-ui .opblock.opblock-delete .opblock-summary { 
        border-color: #f87171; 
      }
      .download-url-button { display: none; }
      .swagger-ui .loading-container { display: none; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      docExpansion: 'none',
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      tryItOutEnabled: true,
      validatorUrl: null,
    },
  });
}
