import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
  Patch,
  Param,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Request as ExpressRequest } from 'express';
import { Types } from 'mongoose';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  async getUserApplications(
    @Request() req: ExpressRequest & { user?: { userId?: string } },
  ) {
    if (!req.user || typeof req.user.userId !== 'string') {
      throw new Error('Invalid user in request');
    }
    return this.applicationsService.findByUserId(req.user.userId);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async createApplication(
    @Body() createApplicationDto: CreateApplicationDto,
    @Request() req: ExpressRequest & { user?: { userId?: string } },
  ) {
    if (!req.user || typeof req.user.userId !== 'string') {
      throw new Error('Invalid user in request');
    }
    const userId = req.user.userId;
    const { personalInfo, travelInfo, ...rest } = createApplicationDto;
    const personalInfoWithDates = {
      ...personalInfo,
      passportExpirationDate: new Date(personalInfo.passportExpirationDate),
      dateOfBirth: new Date(personalInfo.dateOfBirth),
    };
    const travelInfoWithDates = {
      ...travelInfo,
      date: new Date(travelInfo.date),
      intendedArrivalDate: new Date(travelInfo.intendedArrivalDate),
      intendedDepartureDate: new Date(travelInfo.intendedDepartureDate),
    };
    const applicationData = {
      ...rest,
      personalInfo: personalInfoWithDates,
      travelInfo: travelInfoWithDates,
      userId: new Types.ObjectId(userId),
    };
    return this.applicationsService.create(applicationData);
  }
}

@Controller('admin/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminApplicationsController {
  constructor(private applicationsService: ApplicationsService) {}

  @Get()
  @Roles('admin')
  async getAllApplications() {
    return this.applicationsService.findAll();
  }

  @Patch(':id/status')
  @Roles('admin')
  async updateApplicationStatus(
    @Param('id') id: string,
    @Body() body: { status: string; adminNotes?: string },
  ) {
    return this.applicationsService.updateStatus(
      id,
      body.status,
      body.adminNotes,
    );
  }
}
