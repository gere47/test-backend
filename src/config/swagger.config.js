"use strict";
exports.__esModule = true;
exports.setupSwagger = void 0;
var swagger_1 = require("@nestjs/swagger");
function setupSwagger(app) {
    var config = new swagger_1.DocumentBuilder()
        .setTitle('ERP School Management System API')
        .setDescription("\n# \uD83C\uDF93 Sophor Technologies ERP - Complete School Management System\n\n## \uD83D\uDCDA API Documentation\n\nWelcome to the ERP School Management System API documentation. This API provides comprehensive endpoints for managing all aspects of a school's operations, from student admission to financial management.\n\n### \uD83D\uDD10 Authentication & Authorization\n- **JWT Token-based** authentication system\n- **Role-Based Access Control (RBAC)** with fine-grained permissions\n- **Module-level permissions** for each user role\n- **Session management** with device tracking\n\n### \uD83D\uDC65 User Management & Roles\n- **7 Predefined Roles**: super_admin, admin, teacher, student, parent, accountant, librarian\n- **User registration** with role assignment\n- **Profile management** and password security\n- **Active session tracking** and management\n\n### \uD83D\uDCE6 System Modules\nThe system is organized into 12 core modules based on the SRS:\n\n| Module | Description | Key Features |\n|--------|-------------|--------------|\n| **Dashboard** | System overview and analytics | Real-time metrics, quick actions |\n| **User Management** | Authentication & user management | User CRUD, role assignment, permissions |\n| **Student Admission** | Student enrollment system | Online registration, document management |\n| **Attendance Management** | Student & staff tracking | Daily attendance, reports, notifications |\n| **Grade Management** | Examination & grading system | Mark entry, report cards, analytics |\n| **HR & Payroll** | Staff management & payroll | Employee records, salary processing |\n| **Fee Management** | Financial operations | Fee collection, invoices, accounting |\n| **Library Management** | Library resources management | Book catalog, issue/return, fines |\n| **Timetable Management** | Class scheduling | Automatic scheduling, conflict detection |\n| **Communication Portal** | Messaging system | Notifications, announcements, chats |\n| **Inventory Management** | Asset tracking | Stock management, depreciation |\n| **Reports & Analytics** | Data analysis | Custom reports, dashboards, exports |\n\n### \uD83D\uDE80 Quick Start Guide\n\n1. **Authentication**\n   - Register a new user or use default credentials\n   - Login to get JWT token\n   - Use token in Authorization header: `Bearer <your-token>`\n\n2. **Default Credentials**\n   - **Super Admin**: superadmin / Admin123!\n   - **Admin**: admin / Admin123!\n   - **Teacher**: teacher1 / Teacher123!\n\n3. **API Usage**\n   - All endpoints are protected except `/auth/login`, `/auth/register`, and `/auth/health`\n   - Include JWT token in Authorization header for all requests\n   - Check user permissions before accessing module-specific endpoints\n\n### \uD83D\uDD12 Security Features\n- **JWT tokens** with 24-hour expiration\n- **Password hashing** using bcrypt with 12 rounds\n- **Rate limiting** to prevent abuse\n- **CORS protection** for cross-origin requests\n- **Input validation** using class-validator\n- **Audit logging** for all user actions\n\n### \uD83D\uDCCA Response Format\nAll API responses follow a consistent format:\n```json\n{\n  \"data\": { ... },        // Response data\n  \"message\": \"Success\",   // Human-readable message\n  \"meta\": { ... }         // Pagination metadata (if applicable)\n}\n```\n\n### \uD83D\uDEE0\uFE0F Error Handling\nThe API uses standard HTTP status codes:\n\n| Code | Description |\n|------|-------------|\n| 200 | Success |\n| 201 | Created |\n| 400 | Bad Request - Validation error |\n| 401 | Unauthorized - Invalid token |\n| 403 | Forbidden - Insufficient permissions |\n| 404 | Not Found - Resource not found |\n| 409 | Conflict - Resource already exists |\n| 429 | Too Many Requests - Rate limit exceeded |\n| 500 | Internal Server Error |\n\n### \uD83C\uDF10 Deployment\n- **Production URL**: https://your-app.onrender.com\n- **API Base**: `/api/v1`\n- **Documentation**: `/api/docs`\n- **Health Check**: `/api/v1/auth/health`\n\n---\n\n*For more details about the system requirements and specifications, refer to the complete Software Requirements Specification (SRS) document.*\n    ")
        .setVersion('1.0.0')
        .setContact('Sophor Technologies', 'https://sophor-tech.com', 'support@sophor-tech.com')
        .setLicense('Sophor', 'https://opensource.org/licenses/Sophor')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token obtained from login endpoint',
        "in": 'header'
    }, 'JWT-auth')
        .addServer('http://localhost:5000', 'Development Server')
        .addServer('https://your-app.onrender.com', 'Production Server')
        .addTag('Authentication', 'User authentication, registration, and session management')
        .addTag('Users Management', 'User management, role assignment, and user statistics')
        .addTag('Modules Management', 'System modules and permission management')
        .addTag('Students', 'Student admission and management')
        .addTag('Attendance', 'Attendance tracking and management')
        .addTag('Grades', 'Examination and grade management')
        .addTag('HR & Payroll', 'Human resources and payroll management')
        .addTag('Fees', 'Fee collection and accounting ')
        .addTag('Library', 'Library books and resources management ')
        .addTag('Timetable', 'Class and teacher scheduling ')
        .addTag('Communication', 'Messaging and notification system ')
        .addTag('Inventory', 'School assets and inventory tracking ')
        .addTag('Reports', 'Data analysis and reporting dashboard ')
        .build();
    var document = swagger_1.SwaggerModule.createDocument(app, config, {
        operationIdFactory: function (controllerKey, methodKey) {
            return "".concat(controllerKey.replace('Controller', ''), "_").concat(methodKey);
        },
        extraModels: []
    });
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'ERP School Management API Documentation',
        customfavIcon: 'https://sophor-tech.com/favicon.ico',
        customCss: "\n      .swagger-ui .topbar { display: none; }\n      .swagger-ui .info hgroup.main h2 { \n        color: #2563eb; \n        font-size: 1.5rem;\n        font-weight: 600;\n        margin-bottom: 1rem;\n      }\n      .swagger-ui .info .title { color: #1e293b; }\n      .swagger-ui .btn.authorize { \n        background-color: #10b981; \n        border-color: #10b981;\n        color: white;\n      }\n      .swagger-ui .btn.authorize:hover { \n        background-color: #059669; \n        border-color: #059669;\n      }\n      .swagger-ui .scheme-container { \n        background-color: #f8fafc; \n        border-color: #e2e8f0;\n      }\n      .swagger-ui .opblock-tag { \n        font-size: 1.2rem; \n        border-bottom: 2px solid #e2e8f0;\n        padding-bottom: 0.5rem;\n      }\n      .swagger-ui .opblock { \n        border: 1px solid #e2e8f0; \n        border-radius: 0.5rem;\n        margin-bottom: 1rem;\n      }\n      .swagger-ui .opblock-summary { \n        background-color: #f8fafc; \n        border-radius: 0.5rem 0.5rem 0 0;\n      }\n      .swagger-ui .opblock-summary:hover { \n        background-color: #f1f5f9; \n      }\n      .swagger-ui .opblock.opblock-get { \n        border-color: #60a5fa; \n      }\n      .swagger-ui .opblock.opblock-get .opblock-summary { \n        border-color: #60a5fa; \n      }\n      .swagger-ui .opblock.opblock-post { \n        border-color: #34d399; \n      }\n      .swagger-ui .opblock.opblock-post .opblock-summary { \n        border-color: #34d399; \n      }\n      .swagger-ui .opblock.opblock-put { \n        border-color: #fbbf24; \n      }\n      .swagger-ui .opblock.opblock-put .opblock-summary { \n        border-color: #fbbf24; \n      }\n      .swagger-ui .opblock.opblock-delete { \n        border-color: #f87171; \n      }\n      .swagger-ui .opblock.opblock-delete .opblock-summary { \n        border-color: #f87171; \n      }\n      .download-url-button { display: none; }\n      .swagger-ui .loading-container { display: none; }\n    ",
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
            validatorUrl: null
        }
    });
}
exports.setupSwagger = setupSwagger;
