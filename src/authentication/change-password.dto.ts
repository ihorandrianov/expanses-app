import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  oldPassword: string;

  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  confirmationPassword: string;
}
