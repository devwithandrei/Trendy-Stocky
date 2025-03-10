export interface Image {
  id: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
  id: string;
  name: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Billboard {
  id: string;
  label: string;
  imageUrl: string;
  storeId?: string;  // Optional since we might get it from API_URL
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

export interface Category {
  id: string;
  name: string;
  billboardId: string;
  billboard: Billboard;
  createdAt: string;
  updatedAt: string;
}

export interface Size {
  id: string;
  name: string;
  value: string;
  stock: number;
}

export interface Color {
  id: string;
  name: string;
  value: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  category: Category;
  brand: Brand;
  description: Description | null;
  images: Image[];
  sizes: Size[];
  colors: Color[];
  stock: number;  // Total product stock
  createdAt: string;
  updatedAt: string;
}

export interface CartProduct {
  id: string;
  name: string;
  price: string;
  images: Image[];
  stock: number;
  quantity: number;
  selectedColor?: Color;
  selectedSize?: Size;
}

export interface ProductQuery {
  categoryId?: string;
  brandId?: string;
  sizeId?: string;
  colorId?: string;
  isFeatured?: boolean;
  limit?: number;
  search?: string;
  storeId?: string;
}

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

export interface PaymentMethod {
  type: string;
  card?: {
    brand?: string;
    last4?: string;
  };
  wallet?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export const OrderStatusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  processing: 'bg-blue-500/10 text-blue-500',
  shipped: 'bg-purple-500/10 text-purple-500',
  delivered: 'bg-green-500/10 text-green-500',
  cancelled: 'bg-red-500/10 text-red-500',
};

export interface Order {
  id: string;
  storeId: string;
  isPaid: boolean;
  status: OrderStatus;
  amount: number;
  currency: string;
  paymentIntentId: string;
  paymentMethod: PaymentMethod;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    address: Address;
  };
  shippingDetails?: {
    name: string;
    phone: string;
    address: Address;
  };
  phone: string;
  address: string;
  userId: string;
  total: number;
  formattedTotal: string;
  orderItems: OrderItem[];
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  sizeId?: string;
  colorId?: string;
  quantity: number;
  price: string;
  product: {
    id: string;
    name: string;
    price: string;
    images: Image[];
    category?: {
      id: string;
      name: string;
    };
    size?: {
      id: string;
      name: string;
    };
    color?: {
      id: string;
      name: string;
    };
    selectedSize?: Size;
    selectedColor?: Color;
  };
  size?: Size;
  color?: Color;
}
