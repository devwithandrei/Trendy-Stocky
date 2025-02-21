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
  storeId: string;
  store: Store;
  label: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
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

export interface CartProduct extends Product {
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

export interface Order {
  id: string;
  storeId: string;
  isPaid: boolean;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
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
  product: Product;
  size?: Size;
  color?: Color;
}
