export const OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface Product {
  id: string;
  category: Category;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  brand: Brand;
  description: Description | null;
  images: Image[];
  stock: number;
  sizes: Size[];
  colors: Color[];
  selectedSize?: Size;
  selectedColor?: Color;
  quantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Image {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboardId: string;
  billboard: Billboard;  // Billboard is required as per dashboard types
  createdAt: string;
  updatedAt: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
}

export interface Color {
  id: string;
  name: string;
  value: string;
}

export interface ProductSize {
  id: string;
  productId: string;
  sizeId: string;
  size: Size;
  stock: number;
}

export interface ProductColor {
  id: string;
  productId: string;
  colorId: string;
  color: Color;
  stock: number;
}

export interface Brand {
  id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface Description {
  id: string;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  storeId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  amount: number;
  trackingNumber?: string;
  shippingMethod?: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  userId: string;
  paymentIntentId?: string;
  isPaid: boolean;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  sizeId?: string;
  colorId?: string;
  price: number;
}

export interface StockHistory {
  id: string;
  productId: string;
  quantity: number;
  type: 'IN' | 'OUT';
  reason?: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  orders: Order[];
  wishlistProducts: Product[];
  createdAt: string;
  updatedAt: string;
}
