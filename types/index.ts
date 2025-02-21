export interface Product {
  id: string;
  category: Category;
  name: string;
  price: string;
  isFeatured: boolean;
  size: Size;
  color: Color;
  images: Image[];
  stock: number;
  selectedSize?: Size;
  selectedColor?: Color;
  quantity?: number;
};

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

export const OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface Order {
  id: string;
  storeId: string;
  status: OrderStatus;
  customerName: string;
  customerEmail?: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: Product;
  quantity: number;
  price: string;
  sizeId?: string;
  size?: Size;
  colorId?: string;
  color?: Color;
}
