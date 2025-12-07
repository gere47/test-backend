

import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class HolidaysService {
  private holidays: any[] = [
    {
      id: 1,
      name: 'New Year',
      date: new Date('2024-01-01'),
      description: 'New Year Celebration',
      type: 'NATIONAL',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ];

  async findAll() {
    return this.holidays;
  }

  async findOne(id: number) {
    const holiday = this.holidays.find(h => h.id === id);
    if (!holiday) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    return holiday;
  }

  async create(createHolidayDto: any) {
    const holiday = {
      id: this.holidays.length + 1,
      ...createHolidayDto,
      date: new Date(createHolidayDto.date),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.holidays.push(holiday);
    return holiday;
  }

  async update(id: number, updateHolidayDto: any) {
    const index = this.holidays.findIndex(h => h.id === id);
    if (index === -1) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    
    this.holidays[index] = {
      ...this.holidays[index],
      ...updateHolidayDto,
      date: updateHolidayDto.date ? new Date(updateHolidayDto.date) : this.holidays[index].date,
      updatedAt: new Date(),
    };
    
    return this.holidays[index];
  }

  async remove(id: number) {
    const index = this.holidays.findIndex(h => h.id === id);
    if (index === -1) {
      throw new NotFoundException(`Holiday with ID ${id} not found`);
    }
    
    const deleted = this.holidays.splice(index, 1)[0];
    return deleted;
  }
}