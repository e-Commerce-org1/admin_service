import { Observable } from 'rxjs';


export interface ProductImage {
  url: string;
  isPrimary: boolean;
}

export interface Variant {
  size: string;
  color: string;
  stock: number;
}

export interface CreateProductRequest {
  name: string;
  category: string;
  subCategory?: string;
  gender?: string;
  brand: string;
  images: ProductImage[];
  description: string;
  price: number;
  totalStock: number;
  variants: Variant[];
}

export interface UpdateProductRequest {
  id: string;
  name?: string;
  category?: string;
  subCategory?: string;
  gender?: string;
  brand?: string;
  images: string;
  description?: string;
  price?: number;
  variants?: Variant[];
}

export interface ProductID {
  id: string;
}

export interface ProductFilter {
  page?: number;
  pageSize?: number;
  category?: string;
  brand?: string;
  subCategory?: string;
  name?: string;
  gender?: string;
}

export interface UpdateInventoryRequest {
  productId: string;
  variants: Variant[];
}

export interface Response {
  code: number;
  status: string;
  timestamp: string;
  data: string;
  error: string;
}

export interface ProductServiceGrpc {
  CreateProduct(request: CreateProductRequest): Observable<Response>;
  UpdateProduct(request: UpdateProductRequest): Observable<Response>;
  GetProduct(request: ProductID): Observable<Response>;
  ListProducts(request: ProductFilter): Observable<Response>;
  DeleteProduct(request: ProductID): Observable<Response>;
  UpdateInventory(request: UpdateInventoryRequest): Observable<Response>;
}




// interface CreateProductRequest {
//   name: string;
//   category: string;
//   subCategory?: string;
//   gender?: string;
//   brand: string;
//   images: ProductImage[];
//   description: string;
//   price: number;
//   totalStock: number;
//   variants: Variant[];
// }

// interface UpdateProductRequest {
//   id: string;
//   name?: string;
//   category?: string;
//   subCategory?: string;
//   gender?: string;
//   brand?: string;
//   images: ProductImage[];
//   description?: string;
//   price?: number;
//   variants: Variant[];
// }

// interface ProductID {
//   id: string;
// }

// interface ProductFilter {
//   page?: number;
//   pageSize?: number;
//   category?: string;
//   brand?: string;
//   subCategory?: string;
//   name?: string;
//   gender?: string;
// }

// interface UpdateInventoryRequest {
//   productId: string;
//   variants: Variant[];
// }

// interface InventoryChange {
//   productId: string;
//   size: string;
//   color: string;
//   quantity: number;
//   increase: boolean;
// }

// interface UpdateInventoryByOrderRequest {
//   items: InventoryChange[];
// }

// interface Response {
//   code: number;
//   status: string;
//   timestamp: string;
//   data: string;
//   error: string;
// }

// interface ProductServiceClient {
//   createProduct(request: CreateProductRequest): Promise<Response>;
//   updateProduct(request: UpdateProductRequest): Promise<Response>;
//   getProduct(request: ProductID): Promise<Response>;
//   listProducts(request: ProductFilter): Promise<Response>;
//   deleteProduct(request: ProductID): Promise<Response>;
//   updateInventory(request: UpdateInventoryRequest): Promise<Response>;
//   updateInventoryByOrder(request: UpdateInventoryByOrderRequest): Promise<Response>;
// }