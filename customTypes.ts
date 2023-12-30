export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  sizeId: string;
  descriptionId: string;
  description: {
    id: string;
    name: string;
    value: string;
    createdAt: string;
    updatedAt: string;
    // Add other properties if needed
  };
  brandId: string;
  colorId: string;
  createdAt: string;
  updatedAt: string;
  images: Image[];
}
  export interface Category {
    id: string;
    storeId: string;
    billboardId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    // Add other properties if needed
  }

  export interface Image {
    id: string;
    url: string;
    // Add other properties if needed
  }

  export interface Billboard {
    id: string;
    label: string;
    imageUrl: string;
  };
  
  
  export interface Size {
    id: string;
    name: string;
    value: string;
  };
  
  export interface Description {
    id: string;
    name: string;
    value: string;
  };
  
  export interface Color {
    id: string;
    name: string;
    value: string;
  };
  
  export interface Brand {
    id: string;
    name: string;
    value: string;
  };