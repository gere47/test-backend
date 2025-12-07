// src/utils/validators/student.validator.ts
import { 
  registerDecorator, 
  ValidationOptions, 
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ name: 'isValidDateOfBirth', async: false })
export class IsValidDateOfBirthConstraint implements ValidatorConstraintInterface {
  validate(dateOfBirth: Date, args: ValidationArguments) {
    return dateOfBirth < new Date();
  }

  defaultMessage(args: ValidationArguments) {
    return 'Date of birth must be earlier than current date';
  }
}

export function IsValidDateOfBirth(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDateOfBirthConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isValidFileSize', async: false })
export class IsValidFileSizeConstraint implements ValidatorConstraintInterface {
  validate(fileSize: number, args: ValidationArguments) {
    return fileSize <= 5 * 1024 * 1024; // 5MB in bytes
  }

  defaultMessage(args: ValidationArguments) {
    return 'File size must be less than or equal to 5MB';
  }
}

export function IsValidFileSize(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidFileSizeConstraint,
    });
  };
}