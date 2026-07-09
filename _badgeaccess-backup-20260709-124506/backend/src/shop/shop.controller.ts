import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ShopService } from './shop.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { CreateShopProductDto, UpdateShopProductDto } from './dto/shop-product.dto';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  // Каталог индикаторов. С авторизацией — с флагом owned и доступом к ссылке только владельцу.
  @Get('indicators')
  @UseGuards(AuthGuard('jwt'))
  getIndicators(@CurrentUser() user: any) {
    return this.shopService.getIndicatorsGated(user.id);
  }

  @Get('channels')
  @UseGuards(AuthGuard('jwt'))
  getChannels(@CurrentUser() user: any) {
    return this.shopService.getChannelsGated(user.id);
  }

  // Обучение — витрина
  @Get('education')
  @UseGuards(AuthGuard('jwt'))
  getEducation(@CurrentUser() user: any) {
    return this.shopService.getEducationGated(user.id);
  }

  // Заявка на обучение «Записаться»
  @Post('education/:id/enroll')
  @UseGuards(AuthGuard('jwt'))
  enroll(@CurrentUser() user: any, @Param('id') id: string, @Body() body: { note?: string }) {
    return this.shopService.enrollEducation(user, id, body?.note);
  }

  // Купленные пользователем продукты (мои доступы)
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  getMy(@CurrentUser() user: any) {
    return this.shopService.getMyProducts(user.id);
  }

  // ─── Админ ─────────────────────────────────────────────────────────────────

  // Полный каталог (включая деактивированные) — для админ-витрины
  @Get('admin/all')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  getAll() {
    return this.shopService.getAll();
  }

  @Post('products')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  createProduct(@Body() dto: CreateShopProductDto) {
    return this.shopService.createProduct(dto);
  }

  @Put('products/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  updateProduct(@Param('id') id: string, @Body() dto: UpdateShopProductDto) {
    return this.shopService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.OWNER)
  removeProduct(@Param('id') id: string) {
    return this.shopService.softDeleteProduct(id);
  }
}
