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
import { Expanse, Prisma } from '@prisma/client';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { NotFoundInterceptor } from 'src/NotFoundInterceptor';
import { ExpansesService } from './expanses.service';

@Controller('/expanses')
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
  async createExpanse(
    @Body() expanse: Prisma.ExpanseCreateInput,
  ): Promise<Expanse> {
    return this.expansesService.createExpanse(expanse);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Patch(':id')
  @UseInterceptors(NotFoundInterceptor)
  async updateExpanse(
    @Param('id') id: Prisma.ExpanseWhereUniqueInput,
    @Body() expanse: Prisma.ExpanseUpdateInput,
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

  @UseGuards(JwtAuthenticationGuard)
  @Post('user-expanses')
  async getExpansesByUserId(@Body() id: { id: number }) {
    return this.expansesService.getExpansesByUserId(id.id);
  }
}
