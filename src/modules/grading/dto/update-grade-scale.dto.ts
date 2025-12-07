import { PartialType } from '@nestjs/mapped-types';
import { CreateGradeScaleDto } from './create-grade-scale.dto';

export class UpdateGradeScaleDto extends PartialType(CreateGradeScaleDto) {}