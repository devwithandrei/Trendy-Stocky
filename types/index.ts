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
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  brandId: string;
  brand: Brand;
  descriptionId?: string;
  description?: Description;
  images: Image[];
  stock?: number;
  productSizes?: ProductSize[];
  productColors?: ProductColor[];
  selectedSize?: Size;
  selectedColor?: Color;
  quantity?: number;
}

export interface Image {
  id: string;
  url: string;
}

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
}

export interface Category {
  id: string;
  name: string;
  billboard: Billboard;
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
}

export interface Description {
  id: string;
  name: string;
  value: string;
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
  createdAt: Date;
  updatedAt: Date;
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
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  orders: Order[];
  wishlistProducts: Product[];
  createdAt: Date;
  updatedAt: Date;
}
