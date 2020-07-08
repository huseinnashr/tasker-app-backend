import { Injectable } from '@nestjs/common';
import { AppService } from '../core/app.service';

@Injectable()
export class TaskService extends AppService {}
