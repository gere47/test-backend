// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { join } from 'path';

// async function bootstrap() {
//   const app = await NestFactory.create<NestExpressApplication>(AppModule);

//   // Enable CORS
//   app.enableCors({
//     origin: true,
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
//     credentials: true,
//   });

//   // Global validation pipe
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     transform: true,
//     forbidNonWhitelisted: true,
//   }));

//   // Static files serving
//   app.useStaticAssets(join(__dirname, '..', 'public'));
//   app.setBaseViewsDir(join(__dirname, '..', 'views'));
//   app.setViewEngine('hbs');

//   // Comprehensive Swagger Configuration
//   const config = new DocumentBuilder()
//     .setTitle('Sophor ERP - School Management System')
//     .setDescription(`
// # Complete School Management System API Documentation

// ##  System Overview
// Comprehensive ERP system for school management including student administration, attendance, fees, academics, and more.

// ## API Modules

// ### 1. **Authentication & Authorization** (\`/auth\`)
// - User login with username/password, JWT token management
// - Password management and session control
// - Role-based access control

// ### 2. **User Management** (\`/users\`)
// - User CRUD operations
// - Profile management
// - User role assignments

// ### 3. **Module & Permission System** (\`/modules\`)
// - Dynamic module management
// - Role-based permissions
// - System module configuration

// ### 4. **Academic Sessions** (\`/academic-sessions\`)
// - Academic year/session management
// - Active session configuration
// - Session-based student enrollment

// ### 5. **Student Management** (\`/students\`) - **COMPLETE MODULE**
// ####  Core Features:
// - **Student Admission & Registration** - Complete workflow
// - **Document Management** - Upload and manage student documents
// - **Automatic ID Generation** - Unique student and admission numbers
// - **Academic Integration** - Class and session management
// - **Guardian Information** - Complete guardian details management

// ####  Admission Workflow:
// 1. **Pre-Admission Validation** - Data validation and duplicate checks
// 2. **Automatic ID Generation** - STU240001 format student IDs
// 3. **User Account Creation** - Automatic student portal accounts
// 4. **Document Management** - Upload photos, certificates, proofs
// 5. **Admission Confirmation** - PDF forms and receipts
// 6. **Audit Trail** - Complete admission history tracking

// ####  Key Endpoints:
// - \`POST /students\` - Create new student admission
// - \`GET /students\` - Get all students with filtering
// - \`GET /students/stats/admissions\` - Admission statistics
// - \`GET /students/:id\` - Get student with full details
// - \`GET /students/student-id/:studentId\` - Find by student ID
// - \`PATCH /students/:id\` - Update student information
// - \`PATCH /students/:id/status\` - Change student status
// - \`GET /students/:id/admission-confirmation\` - Generate admission confirmation
// - \`GET /students/search/quick\` - Search students
// - \`DELETE /students/:id\` - Soft delete student

// ### 6. **Attendance Management** (\`/attendance\`) - **COMPLETE MODULE**
// ####  Core Features:
// - **Daily Attendance Tracking** - Mark student attendance
// - **Bulk Upload** - CSV import for multiple students
// - **Holiday Management** - Automatic weekend/holiday detection
// - **Real-time Dashboards** - Live attendance statistics
// - **Absentee Notifications** - Automatic alerts for parents

// ####  Key Endpoints:
// - \`POST /attendance/mark\` - Mark daily attendance
// - \`POST /attendance/bulk-upload\` - Bulk upload via CSV
// - \`GET /attendance/dashboard\` - Real-time attendance dashboard
// - \`GET /attendance/reports/monthly\` - Monthly attendance reports
// - \`GET /attendance/class/:classId\` - Get class attendance
// - \`GET /attendance/student/:studentId\` - Get student attendance history

// ####  Features:
// - **Validation**: Prevents future dates, weekends, holidays
// - **Bulk Operations**: CSV import for quick entry
// - **Analytics**: Class-wise and student-wise statistics
// - **Notifications**: Automatic absentee alerts
// - **Integration**: Links with Student and Grading modules

// ### 7. **Grading & Examination** (\`/grading\`) - **COMPLETE MODULE**
// ####  Core Features:
// - **Exam Management** - Create and manage exams
// - **Marks Entry** - Enter and calculate grades
// - **Automatic Grading** - Configurable grading scales
// - **Report Cards** - Generate comprehensive report cards
// - **Performance Analytics** - Class and subject performance

// ####  Key Endpoints:
// - \`POST /grading/exams\` - Create exam definition
// - \`POST /grading/exams/:examId/results\` - Enter exam results
// - \`GET /grading/report-cards/:studentId\` - Generate report card
// - \`PATCH /grading/results/:resultId/moderate\` - Moderate marks
// - \`GET /grading/analytics/:classId\` - Performance analytics
// - \`POST /grading/exams/:examId/publish\` - Publish results

// ####  Features:
// - **Grade Calculation**: Automatic grade assignment
// - **Validation**: Marks validation against maximum
// - **Moderation**: Teacher and admin mark moderation
// - **Analytics**: Top performers, weak areas analysis
// - **Export**: PDF and Excel report generation

// ### 8. **Fee Management** (Upcoming)
// - Fee structure setup
// - Payment processing
// - Receipt generation

// ### 9. **Library Management** (Upcoming)
// - Book catalog management
// - Issue/return tracking
// - Fine calculation

// ### 10. **Inventory Management** (Upcoming)
// - School assets tracking
// - Resource allocation
// - Maintenance tracking

// ### 11. **Reporting & Analytics** (Upcoming)
// - Comprehensive reports
// - Dashboard analytics
// - Statistical data

// ##  Authentication
// This API uses JWT Bearer token authentication. Include the token in the Authorization header:
// \`\`\`
// Authorization: Bearer <your-jwt-token>
// \`\`\`

// **Required Roles:**
// - **ADMIN**: Full access to all operations
// - **REGISTRAR**: Student admission and management
// - **TEACHER**: Attendance marking, grade entry, student view
// - **STUDENT**: Access to own profile, grades, attendance

// ##  Module Integration Flow

// ### Complete Student Lifecycle:
// 1. **Admission** (\`/students\`) → Student enters system
// 2. **Attendance** (\`/attendance\`) → Daily presence tracking
// 3. **Grading** (\`/grading\`) → Academic performance assessment
// 4. **Reports** → Comprehensive student progress

// ### Data Flow:
// - Student data flows from Admission → Attendance → Grading
// - All modules maintain audit trails
// - Real-time data synchronization
// - Role-based access control throughout

// ##  Quick Start Guide

// ### Phase 1: Student Admission
// \`\`\`bash
// # 1. Configure academic session
// POST /academic-sessions
// {
//   "name": "2024-2025",
//   "startDate": "2024-09-01",
//   "endDate": "2025-06-30",
//   "isActive": true
// }

// # 2. Admit student
// POST /students
// {
//   "firstName": "John",
//   "lastName": "Doe",
//   "dateOfBirth": "2015-03-15",
//   "gender": "Male",
//   "guardianName": "Jane Doe",
//   "guardianRelation": "Mother", 
//   "guardianPhone": "+1234567890",
//   "classId": "class-uuid",
//   "sessionId": "session-uuid"
// }
// \`\`\`

// ### Phase 2: Attendance Management
// \`\`\`bash
// # 3. Mark attendance
// POST /attendance/mark
// {
//   "classId": "class-uuid",
//   "date": "2024-01-15",
//   "entries": [
//     {
//       "studentId": "student-uuid",
//       "status": "Present"
//     }
//   ]
// }

// # 4. View attendance dashboard
// GET /attendance/dashboard?classId=class-uuid&startDate=2024-01-01&endDate=2024-01-31
// \`\`\`

// ### Phase 3: Grading & Examination
// \`\`\`bash
// # 5. Create exam
// POST /grading/exams
// {
//   "name": "First Term Exam",
//   "examTypeId": "type-uuid",
//   "classId": "class-uuid",
//   "term": "First Term",
//   "startDate": "2024-03-01",
//   "endDate": "2024-03-05"
// }

// # 6. Enter results
// POST /grading/exams/exam-uuid/results
// {
//   "results": [
//     {
//       "studentId": "student-uuid",
//       "subjectId": "subject-uuid", 
//       "theoryMarks": 85,
//       "practicalMarks": 18
//     }
//   ]
// }

// # 7. Generate report card
// GET /grading/report-cards/student-uuid?examId=exam-uuid
// \`\`\`

// ##  Response Examples

// ### Student Admission:
// \`\`\`json
// {
//   "id": "student-uuid",
//   "studentId": "STU240001",
//   "admissionNumber": "ADM20240001",
//   "firstName": "John",
//   "lastName": "Doe",
//   "status": "Active",
//   "admissionDate": "2024-01-15T10:30:00.000Z"
// }
// \`\`\`

// ### Attendance Summary:
// \`\`\`json
// {
//   "classId": "class-uuid",
//   "period": "January 2024",
//   "totalStudents": 45,
//   "presentCount": 42,
//   "absentCount": 3,
//   "attendancePercentage": 93.3,
//   "topAttendees": [...],
//   "frequentAbsentees": [...]
// }
// \`\`\`

// ### Report Card:
// \`\`\`json
// {
//   "student": {
//     "name": "John Doe",
//     "class": "Grade 5A",
//     "rollNumber": "25"
//   },
//   "subjects": [
//     {
//       "subject": "Mathematics",
//       "marks": 92,
//       "grade": "A+",
//       "percentage": 92.0
//     }
//   ],
//   "summary": {
//     "totalMarks": 460,
//     "percentage": 92.0,
//     "overallGrade": "A+",
//     "rank": 1
//   }
// }
// \`\`\`

// ##  Module Status

// ### ✅ COMPLETED MODULES:
// - **Student Admission & Registration** - 100%
// - **Attendance Management** - 100% 
// - **Grading & Examination** - 100%

// ### 🔄 UPCOMING MODULES:
// - Fee Management
// - Library Management  
// - Inventory Management
// - Communication Portal
// - HR & Payroll

// ##  Testing Endpoints

// ### Health Checks:
// - \`GET /auth/health\` - Authentication service status
// - \`GET /status\` - Overall API status
// - \`GET /students/stats/admissions\` - Student module status
// - \`GET /attendance/dashboard\` - Attendance module status
// - \`GET /grading/analytics\` - Grading module status

// ##  Best Practices

// 1. **Configure academic sessions before student admission**
// 2. **Use bulk operations for multiple entries**
// 3. **Validate data before submission**
// 4. **Generate confirmations and receipts**
// 5. **Monitor system through dashboards**
// 6. **Maintain audit trails for all operations**

// ---
// *Phase 2 Modules (Student, Attendance, Grading): 100% Complete & Production Ready*
// *Last Updated: ${new Date().toISOString().split('T')[0]}*
//     `)
//     .setVersion('2.2.0')
//     .setContact(
//       'Sophor Technologies',
//       'https://sophortechnologies.com/',
//       'support@sophortechnologies.com'
//     )
//     .setLicense('Sophor License', 'https://opensource.org/licenses/Sophor')
//     .addBearerAuth(
//       {
//         type: 'http',
//         scheme: 'bearer',
//         bearerFormat: 'JWT',
//         name: 'JWT',
//         description: 'Enter JWT token obtained from /auth/login',
//         in: 'header',
//       },
//       'JWT-auth',
//     )
//     .addTag('Authentication', 'User login with username/password and token management')
//     .addTag('Users', 'User management and profile operations')
//     .addTag('Modules', 'System modules and permission management')
//     .addTag('Academic Sessions', 'Academic year and session management')
//     .addTag('Students', 'Complete student admission and management system')
//     .addTag('Attendance', 'Student and staff attendance tracking')
//     .addTag('Grading', 'Examination and grading management')
//     .addTag('Fees', 'Fee management and payment processing')
//     .addTag('Library', 'Library management system')
//     .addTag('Inventory', 'School assets and resource management')
//     .addTag('Reports', 'Analytics and reporting system')
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
  
//   // Enhanced Swagger UI setup
//   SwaggerModule.setup('api', app, document, {
//     customSiteTitle: 'Sophor ERP - API Documentation',
//     customfavIcon: 'https://sophortechnologies.com/favicon.ico',
//     customCss: `
//       .swagger-ui .topbar { display: none; }
//       .swagger-ui .info hgroup.main h2 { color: #2563eb; }
//       .swagger-ui .btn.authorize { background-color: #2563eb; }
//       .description pre { background: #f8fafc; padding: 15px; border-radius: 5px; }
//       .swagger-ui .tag { margin: 0 5px 5px 0; }
//       .swagger-ui .opblock-tag { font-size: 18px; font-weight: 600; }
//       .completed-module { border-left: 4px solid #10b981; padding-left: 15px; background: #f0fdf4; margin: 10px 0; }
//       .upcoming-module { border-left: 4px solid #f59e0b; padding-left: 15px; background: #fffbeb; margin: 10px 0; }
//     `,
//     swaggerOptions: {
//       persistAuthorization: true,
//       docExpansion: 'none',
//       filter: true,
//       showRequestDuration: true,
//       operationsSorter: 'alpha',
//       tagsSorter: 'alpha',
//       validatorUrl: null,
//       apisSorter: 'alpha',
//       defaultModelsExpandDepth: 2,
//       defaultModelExpandDepth: 2,
//     },
//   });

//   const port = process.env.PORT || 5000;
//   await app.listen(port);

//   console.log(`\n🚀 Sophor ERP Application is running on: http://localhost:${port}`);
//   console.log(`   📚 Swagger API Documentation: http://localhost:${port}/api`);
//   console.log(`   🩺 Health Check: http://localhost:${port}/status`);
//   console.log(`   🔐 Auth Health: http://localhost:${port}/auth/health`);
  
//   console.log(`\n✅ COMPLETED MODULES:`);
//   console.log(`   📋 Student Management: http://localhost:${port}/students`);
//   console.log(`   📊 Attendance System: http://localhost:${port}/attendance`);
//   console.log(`   🎓 Grading & Exams: http://localhost:${port}/grading`);
  
//   console.log(`\n🔧 Available API Endpoints:`);
//   console.log(`   • Authentication: http://localhost:${port}/auth`);
//   console.log(`   • User Management: http://localhost:${port}/users`);
//   console.log(`   • Module System: http://localhost:${port}/modules`);
//   console.log(`   • Academic Sessions: http://localhost:${port}/academic-sessions`);
//   console.log(`   • Student Admission: http://localhost:${port}/students`);
//   console.log(`   • Attendance Tracking: http://localhost:${port}/attendance`);
//   console.log(`   • Grading System: http://localhost:${port}/grading`);
  
//   console.log(`\n🎯 KEY FEATURES IMPLEMENTED:`);
  
//   console.log(`\n📋 STUDENT MODULE:`);
//   console.log(`   ✓ Complete admission workflow`);
//   console.log(`   ✓ Document upload & management`);
//   console.log(`   ✓ PDF form generation`);
//   console.log(`   ✓ Automatic ID generation (STU240001)`);
//   console.log(`   ✓ Bulk student admission`);
//   console.log(`   ✓ Admission statistics & analytics`);
//   console.log(`   ✓ Role-based access control`);
//   console.log(`   ✓ Audit trail & history tracking`);
  
//   console.log(`\n📊 ATTENDANCE MODULE:`);
//   console.log(`   ✓ Daily attendance marking`);
//   console.log(`   ✓ Bulk CSV upload support`);
//   console.log(`   ✓ Holiday/weekend validation`);
//   console.log(`   ✓ Real-time dashboards`);
//   console.log(`   ✓ Absentee notifications`);
//   console.log(`   ✓ Monthly/annual reports`);
//   console.log(`   ✓ Class-wise analytics`);
  
//   console.log(`\n🎓 GRADING MODULE:`);
//   console.log(`   ✓ Exam management & scheduling`);
//   console.log(`   ✓ Marks entry & validation`);
//   console.log(`   ✓ Automatic grade calculation`);
//   console.log(`   ✓ Report card generation`);
//   console.log(`   ✓ Performance analytics`);
//   console.log(`   ✓ Mark moderation system`);
//   console.log(`   ✓ PDF/Excel export`);
  
//   console.log(`\n🔐 Login with username/password at: http://localhost:${port}/auth/login`);
//   console.log(`📖 Use Swagger UI to test all endpoints interactively`);
  
//   console.log(`\n🚀 QUICK START WORKFLOW:`);
//   console.log(`   1. Configure academic session first`);
//   console.log(`   2. Admit students through student module`);
//   console.log(`   3. Mark daily attendance for classes`);
//   console.log(`   4. Create exams and enter grades`);
//   console.log(`   5. Generate report cards and analytics`);
  
//   console.log(`\n📈 TESTING ENDPOINTS:`);
//   console.log(`   POST /students - Create student admission`);
//   console.log(`   POST /attendance/mark - Mark attendance`);
//   console.log(`   POST /grading/exams - Create exam`);
//   console.log(`   GET /students/stats/admissions - View statistics`);
//   console.log(`   GET /attendance/dashboard - View attendance dashboard`);
//   console.log(`   GET /grading/analytics - View performance analytics`);
  
//   console.log(`\n🎉 Phase 2 Development Complete!`);
//   console.log(`   Student → Attendance → Grading workflow fully implemented`);
//   console.log(`   Ready for production deployment and testing`);
// }

// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Static files serving
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // Comprehensive Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('School ERP - Complete Management System')
    .setDescription(`
# Complete School Management System API Documentation

## System Overview
Comprehensive ERP system for school management including student admission, attendance, grading, and more.

## API Modules

### 1. **Student Admission & Registration** (\`/student-admission\`) - **COMPLETE MODULE**

#### Core Features:
- **Academic Session Management** - Create and manage academic years
- **Student Registration** - Complete admission workflow
- **Document Management** - Upload and manage student documents
- **Automatic ID Generation** - Unique student ID generation (2024GRD1001 format)
- **Comprehensive Validation** - Data validation and duplicate checks
- **Admission History** - Complete audit trail and history tracking

#### Key Endpoints:
- \`POST /student-admission/academic-sessions\` - Create academic session
- \`GET /student-admission/academic-sessions\` - Get all sessions
- \`POST /student-admission/students\` - Create new student admission
- \`GET /student-admission/students\` - Get all students with filtering
- \`GET /student-admission/students/:id\` - Get student by ID
- \`PUT /student-admission/students/:id\` - Update student details
- \`GET /student-admission/students/:studentId/admission-confirmation\` - Generate admission confirmation
- \`POST /student-admission/students/:id/documents\` - Upload student documents
- \`GET /student-admission/statistics\` - Get admission statistics

### 2. **Attendance Management** (\`/attendance\`) - **IN PROGRESS**
- Daily attendance tracking
- Bulk upload capabilities
- Real-time dashboards
- Absentee notifications

### 3. **Grading & Examination** (\`/grading\`) - **IN PROGRESS**
- Exam management
- Marks entry and calculation
- Report card generation
- Performance analytics

### 4. **Authentication & Authorization** (Upcoming)
- User login and JWT management
- Role-based access control
- Password management

### 5. **Fee Management** (Upcoming)
- Fee structure setup
- Payment processing
- Receipt generation

## Authentication
*Note: Authentication system is upcoming. Currently endpoints are open for testing.*

## Module Integration Flow

### Student Lifecycle:
1. **Admission** (\`/student-admission\`) → Student enters system
2. **Attendance** (\`/attendance\`) → Daily presence tracking
3. **Grading** (\`/grading\`) → Academic performance assessment
4. **Reports** → Comprehensive student progress

## Quick Start Guide

### Phase 1: Student Admission Setup

\`\`\`bash
# 1. Create academic session
POST /student-admission/academic-sessions
{
  "name": "2024-2025",
  "startDate": "2024-04-01",
  "endDate": "2025-03-31",
  "admissionOpen": true,
  "isActive": true
}

# 2. Admit new student
POST /student-admission/students
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "2010-05-15",
  "gender": "male",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main Street",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "guardianName": "Robert Doe",
  "guardianRelationship": "Father",
  "guardianEmail": "robert.doe@example.com",
  "guardianPhone": "+1234567891",
  "guardianOccupation": "Engineer",
  "academicSession": "2024-2025",
  "class": "Grade 10",
  "section": "A",
  "admissionTestScore": 85,
  "nationalId": "A123456789",
  "educationalBackground": [
    {
      "institution": "ABC High School",
      "qualification": "Secondary Education",
      "yearCompleted": 2023,
      "percentage": 88.5,
      "board": "State Board"
    }
  ]
}

# 3. Generate admission confirmation
GET /student-admission/students/{studentId}/admission-confirmation

# 4. View admission statistics
GET /student-admission/statistics?academicSession=2024-2025
\`\`\`

## Response Examples

### Student Admission Success:
\`\`\`json
{
  "id": "student-uuid",
  "studentId": "2024GRD1001",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "class": "Grade 10",
  "section": "A",
  "academicSession": "2024-2025",
  "admissionDate": "2024-01-15T10:30:00.000Z",
  "status": "active"
}
\`\`\`

### Admission Confirmation:
\`\`\`json
{
  "confirmationId": "CONF-2024GRD1001-1705318200000",
  "student": {
    "name": "John Doe",
    "studentId": "2024GRD1001",
    "class": "Grade 10",
    "section": "A",
    "academicSession": "2024-2025",
    "admissionDate": "January 15, 2024"
  },
  "guardian": {
    "name": "Robert Doe",
    "relationship": "Father",
    "phone": "+1234567891",
    "email": "robert.doe@example.com"
  },
  "generatedAt": "January 15, 2024, 10:30:00 AM"
}
\`\`\`

## Module Status

### ✅ COMPLETED MODULES:
- **Student Admission & Registration** - 100%

### 🚧 IN PROGRESS MODULES:
- Attendance Management
- Grading & Examination

### 📅 UPCOMING MODULES:
- Authentication & Authorization
- Fee Management
- Library Management
- Inventory Management

## Testing Endpoints

### Student Admission Health Checks:
- \`GET /student-admission/academic-sessions\` - Academic sessions status
- \`GET /student-admission/statistics\` - Admission statistics
- \`POST /student-admission/students\` - Test student creation

## Validation Rules

### Student Admission:
- Date of Birth must be earlier than current date
- Email must follow valid format
- Phone number must be valid
- File uploads ≤ 5MB
- Age must be between 3-25 years
- National ID must be 8-20 alphanumeric characters

## Best Practices

1. **Configure academic sessions** before student admission
2. **Validate all mandatory fields** before submission
3. **Use the student ID** for all future references
4. **Generate admission confirmations** for record keeping
5. **Monitor admission statistics** through dashboard

---
*Student Admission Module: 100% Complete & Ready for Testing*
*Last Updated: ${new Date().toISOString().split('T')[0]}*
    `)
    .setVersion('1.0.0')
    .setContact(
      'School ERP Team',
      'https://your-school.com/',
      'support@your-school.com'
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Student Admission', 'Complete student admission and registration system')
    .addTag('Academic Sessions', 'Academic year and session management')
    .addTag('Attendance', 'Student attendance tracking (In Progress)')
    .addTag('Grading', 'Examination and grading management (In Progress)')
    .addTag('Authentication', 'User authentication and authorization (Upcoming)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Enhanced Swagger UI setup
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'School ERP - API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none; }
      .swagger-ui .info hgroup.main h2 { color: #2563eb; }
      .swagger-ui .btn.authorize { background-color: #2563eb; }
      .description pre { background: #f8fafc; padding: 15px; border-radius: 5px; }
      .swagger-ui .tag { margin: 0 5px 5px 0; }
      .swagger-ui .opblock-tag { font-size: 18px; font-weight: 600; }
      .completed-module { border-left: 4px solid #10b981; padding-left: 15px; background: #f0fdf4; margin: 10px 0; }
      .inprogress-module { border-left: 4px solid #f59e0b; padding-left: 15px; background: #fffbeb; margin: 10px 0; }
      .upcoming-module { border-left: 4px solid #6b7280; padding-left: 15px; background: #f9fafb; margin: 10px 0; }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
      validatorUrl: null,
    },
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`\n🚀 School ERP Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger API Documentation: http://localhost:${port}/api`);
  
  console.log(`\n✅ COMPLETED MODULES:`);
  console.log(`   📋 Student Admission: http://localhost:${port}/student-admission`);
  
  console.log(`\n🚧 IN PROGRESS MODULES:`);
  console.log(`   📊 Attendance System: http://localhost:${port}/attendance`);
  console.log(`   🎓 Grading & Exams: http://localhost:${port}/grading`);
  
  console.log(`\n🔧 Available API Endpoints:`);
  console.log(`   • Student Admission: http://localhost:${port}/student-admission`);
  console.log(`   • Academic Sessions: http://localhost:${port}/student-admission/academic-sessions`);
  console.log(`   • Student Management: http://localhost:${port}/student-admission/students`);
  
  console.log(`\n🎯 STUDENT ADMISSION FEATURES:`);
  console.log(`   ✓ Complete admission workflow`);
  console.log(`   ✓ Academic session management`);
  console.log(`   ✓ Document upload & management`);
  console.log(`   ✓ Automatic student ID generation`);
  console.log(`   ✓ Comprehensive data validation`);
  console.log(`   ✓ Admission confirmation generation`);
  console.log(`   ✓ Statistics and analytics`);
  console.log(`   ✓ Educational background tracking`);
  console.log(`   ✓ Guardian information management`);
  
  console.log(`\n🚀 QUICK START WORKFLOW:`);
  console.log(`   1. Create academic session first`);
  console.log(`   2. Admit students through student-admission module`);
  console.log(`   3. Generate admission confirmations`);
  console.log(`   4. Monitor through statistics dashboard`);
  
  console.log(`\n📈 TESTING ENDPOINTS:`);
  console.log(`   POST /student-admission/academic-sessions - Create academic session`);
  console.log(`   POST /student-admission/students - Create student admission`);
  console.log(`   GET /student-admission/students - List all students`);
  console.log(`   GET /student-admission/statistics - View admission statistics`);
  console.log(`   GET /student-admission/students/{id}/admission-confirmation - Generate confirmation`);
  
  console.log(`\n🎉 Student Admission Module Complete!`);
  console.log(`   Ready for testing and integration with other modules`);
}

bootstrap();
