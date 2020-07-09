import { Controller } from '@nestjs/common';
import { TaskUpdateService } from './task-update.service';

@Controller('progress')
export class TaskUpdateController {
  constructor(private taskUpdService: TaskUpdateService) {}
}
