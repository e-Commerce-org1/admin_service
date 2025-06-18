export interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  imageUrl: string;
  description: string;
  price: number;
  totalStock: number;
  variants: any[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}
