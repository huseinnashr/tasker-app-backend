import { ApiProperty } from '@nestjs/swagger';

export class ForbiddenResponseDTO {
  @ApiProperty({ example: 403 })
  statusCode: number;

  @ApiProperty({ example: 'Forbidden' })
  message: string;
}
