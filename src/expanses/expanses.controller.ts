import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Expanse, Prisma } from '@prisma/client';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { NotFoundInterceptor } from 'src/NotFoundInterceptor';
import { CreateExpanseDto, UpdateExpanseDto } from './create-expanse.dto';
import { ExpansesService } from './expanses.service';

@Controller('/expanses')
@ApiTags('expanses')
export class ExpansesController {
  constructor(private readonly expansesService: ExpansesService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async getAllExpanses(): Promise<Expanse[]> {
    return this.expansesService.getAllExpanses();
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  @UseInterceptors(NotFoundInterceptor)
  async getExpanseById(
    @Param('id') id: Prisma.ExpanseWhereUniqueInput,
  ): Promise<Expanse> {
    return this.expansesService.getExpanse(id);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createExpanse(@Body() expanse: CreateExpanseDto): Promise<Expanse> {
    return this.expansesService.createExpanse(expanse);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  @UseInterceptors(NotFoundInterceptor)
  async updateExpanse(
    @Param('id') id: number,
    @Body() expanse: UpdateExpanseDto,
  ): Promise<Expanse> {
    return this.expansesService.updateExpanse({
      where: {
        id: Number(id),
      },
      data: expanse,
    });
  }

  @UseGuards(JwtAuthenticationGuard)
  @Delete(':id')
  @UseInterceptors(NotFoundInterceptor)
  async deleteExpanse(
    @Param('id') id: Prisma.ExpanseWhereUniqueInput,
  ): Promise<Expanse> {
    return this.expansesService.deleteExpanse(id);
  }
}
