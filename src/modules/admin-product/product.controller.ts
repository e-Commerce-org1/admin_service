import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/updateproduct.dto';
import { ProductFilterDto } from './dto/product.filter.dto';
import { AuthGuard } from '../../guards/auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InventoryUpdateAdminDto } from './dto/inventoryupdate.dto';

@ApiBearerAuth()
@ApiTags('Admin - Products Management')
@Controller('admin/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product successfully created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiBody({ type: CreateProductDto })
  async create(@Body() dto: CreateProductDto) {
    return await this.productService.createProduct(dto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiParam({ name: 'id', description: 'Product ID', type: String })
  @ApiBody({ type: UpdateProductDto })
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return await this.productService.updateProduct(id, dto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product found',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiParam({ name: 'id', description: 'Product ID', type: String })
  async findOne(@Param('id') id: string) {
    return await this.productService.getProduct(id);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({ summary: 'List all products with optional filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Products retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'brand', required: false, type: String })
  @ApiQuery({ name: 'subCategory', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'gender', required: false, type: String })
  async findAll(@Query() filter: ProductFilterDto) {
    const result = await this.productService.listProducts(filter);
    return {
      data: result,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiParam({ name: 'id', description: 'Product ID', type: String })
  async remove(@Param('id') id: string) {
    return await this.productService.deleteProduct(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id/inventory')
  @ApiOperation({ summary: 'Update product inventory' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inventory updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found',
  })
  @ApiParam({ name: 'id', description: 'Product ID', type: String })
  @ApiBody({ type: InventoryUpdateAdminDto })
  async updateInventory(
    @Param('id') id: string,
    @Body() request: InventoryUpdateAdminDto,
  ) {
    const result = await this.productService.updateInventory({
      productId: id,
      variants: request.variants.map((variant) => ({
        stock: variant.stock,
        size: variant.size ?? '',
        color: variant.color ?? '',
      })),
    });

    return {
      success: true,
      message: 'Inventory updated successfully',
      data: result,
    };
  }
}
