import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/updateproduct.dto';
import {
  CreateProductRequest,
  Response,
  UpdateInventoryRequest,
  ProductFilter,
} from '../../interfaces/productinterface';
import { ProductServiceGrpc } from '../../interfaces/productinterface';
import { GrpcClientService } from '../../grpc/authgrpc/auth.grpc-client';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);
  private productService: ProductServiceGrpc;

  constructor(
    @Inject('PRODUCT_PACKAGE') private client: ClientGrpc,
    private readonly grpcClientService: GrpcClientService,
  ) {}

  onModuleInit() {
    this.productService =
      this.client.getService<ProductServiceGrpc>('ProductService');
    this.logger.log('ProductService gRPC client initialized');
  }

  async createProduct(dto: CreateProductDto): Promise<Response> {
    this.logger.log(`Creating product: ${dto.name}`);
    try {
      const totalStock = dto.variants.reduce(
        (sum, variant) => sum + variant.stock,
        0,
      );

      const payload: CreateProductRequest = {
        name: dto.name,
        category: dto.category,
        subCategory: dto.subCategory || undefined,
        gender: dto.gender || undefined,
        brand: dto.brand,
        imageUrl: dto.imageUrl,
        description: dto.description,
        price: dto.price,
        totalStock: totalStock,
        variants: dto.variants.map((variant) => ({
          size: variant.size,
          color: variant.color,
          stock: variant.stock,
        })),
      };

      this.logger.debug(`Product creation payload: ${JSON.stringify(payload)}`);

      const grpcResponse = await lastValueFrom(
        this.productService.CreateProduct(payload).pipe(
          map((response) => {
            let parsedData;
            try {
              parsedData =
                typeof response.data === 'string'
                  ? JSON.parse(response.data)
                  : response.data;
            } catch (parseError) {
              this.logger.error('Failed to parse response data', parseError);
              parsedData = response.data;
            }

            return {
              ...response,
              data: parsedData,
            };
          }),
        ),
      );

      if (!grpcResponse) {
        this.logger.error('Empty response from product service');
        throw new InternalServerErrorException(
          'Empty response from product service',
        );
      }

      this.logger.log(`Product created successfully: ${dto.name}`);
      return grpcResponse as Response;
    } catch (error) {
      this.logger.error(`Failed to create product: ${error}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  async updateProduct(id: string, dto: UpdateProductDto): Promise<Response> {
    this.logger.log(`Updating product ID: ${id}`);
    try {
      const totalStock =
        dto.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
      const payload = { id, ...dto, totalStock };

      this.logger.debug(`Product update payload: ${JSON.stringify(payload)}`);

      const result = await lastValueFrom(
        this.productService.UpdateProduct(payload).pipe(
          map((response) => {
            let parsedData;
            try {
              parsedData =
                typeof response.data === 'string'
                  ? JSON.parse(response.data)
                  : response.data;
            } catch (parseError) {
              this.logger.error('Failed to parse response data', parseError);
              parsedData = response.data;
            }

            return {
              ...response,
              data: parsedData,
            };
          }),
        ),
      );

      this.logger.log(`Product updated successfully: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to update product ${id}: ${error}`);
      throw new InternalServerErrorException('Failed to update product');
    }
  }

  async getProduct(id: string): Promise<Response> {
    this.logger.log(`Fetching product ID: ${id}`);
    try {
      const result = await lastValueFrom(
        this.productService.GetProduct({ id }).pipe(
          map((response) => {
            let parsedData;
            try {
              parsedData =
                typeof response.data === 'string'
                  ? JSON.parse(response.data)
                  : response.data;
            } catch (parseError) {
              this.logger.error('Failed to parse response data', parseError);
              parsedData = response.data;
            }

            return {
              ...response,
              data: parsedData,
            };
          }),
        ),
      );

      if (!result) {
        this.logger.warn(`Product not found: ${id}`);
        throw new NotFoundException('Product not found');
      }

      this.logger.debug(`Product fetched successfully: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to get product ${id}: ${error}`);
      throw new InternalServerErrorException('Failed to get product');
    }
  }

  async listProducts(filter: ProductFilter): Promise<Response> {
    this.logger.log('Listing products with filter', filter);
    try {
      const result = await lastValueFrom(
        this.productService.ListProducts(filter).pipe(
          map((response) => {
            let parsedData;
            try {
              parsedData =
                typeof response.data === 'string'
                  ? JSON.parse(response.data)
                  : response.data;
            } catch (parseError) {
              this.logger.error('Failed to parse response data', parseError);
              parsedData = response.data;
            }

            return {
              ...response,
              data: parsedData,
            };
          }),
        ),
      );
      this.logger.debug(`Found ${result.data?.pageSize} products`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to list products: ${error}`);
      throw new InternalServerErrorException('Failed to list products');
    }
  }

  async deleteProduct(id: string): Promise<Response> {
    this.logger.log(`Deleting product ID: ${id}`);
    try {
      const result = await lastValueFrom(
        this.productService.DeleteProduct({ id }).pipe(
          map((response) => {
            let parsedData;
            try {
              parsedData =
                typeof response.data === 'string'
                  ? JSON.parse(response.data)
                  : response.data;
            } catch (parseError) {
              this.logger.error('Failed to parse response data', parseError);
              parsedData = response.data;
            }

            return {
              ...response,
              data: parsedData,
            };
          }),
        ),
      );

      this.logger.log(`Product deleted successfully: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete product ${id}: ${error}`);
      throw new InternalServerErrorException('Failed to delete product');
    }
  }

  async updateInventory(request: UpdateInventoryRequest): Promise<Response> {
    this.logger.log(`Updating inventory for product: ${request.productId}`);
    try {
      const result = await lastValueFrom(
        this.productService.UpdateInventory(request),
      );

      this.logger.log(
        `Inventory updated successfully for product: ${request.productId}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update inventory for product ${request.productId}: ${error}`,
      );
      throw new InternalServerErrorException('Failed to update inventory');
    }
  }

  async validateToken(accessToken: string) {
    this.logger.log('Validating token');
    try {
      const result = await this.grpcClientService.validateToken({
        accessToken,
      });

      this.logger.debug(`Token validation result: ${JSON.stringify(result)}`);
      return {
        isValid: result.isValid,
        admin: result.entityId,
      };
    } catch (error) {
      this.logger.error(`Token validation failed: ${error}`);
      throw new InternalServerErrorException('Token validation failed');
    }
  }
}
