import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateExpanseDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  category: string;

  @ApiProperty({ required: false })
  note: string;

  @ApiProperty()
  user: Prisma.UserCreateNestedOneWithoutExpansesInput;
}

export class UpdateExpanseDto extends PartialType(CreateExpanseDto) {}
