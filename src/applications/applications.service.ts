import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument } from './schemas/application.schema';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  async create(applicationData: Partial<Application>): Promise<Application> {
    const application = new this.applicationModel(applicationData);
    return application.save();
  }

  async findByUserId(userId: string): Promise<Application[]> {
    return this.applicationModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async findAll(): Promise<Application[]> {
    return this.applicationModel.find().populate('userId', 'email').exec();
  }

  async findById(id: string): Promise<Application | null> {
    return this.applicationModel
      .findById(id)
      .populate('userId', 'email')
      .exec();
  }

  async updateStatus(
    id: string,
    status: string,
    adminNotes?: string,
  ): Promise<Application | null> {
    return this.applicationModel
      .findByIdAndUpdate(id, { status, adminNotes }, { new: true })
      .populate('userId', 'email')
      .exec();
  }
}
