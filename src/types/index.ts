export interface Review {
  id: string;
  author: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  image: string;
  galleryImages: string[];
  shortDescription: string;
  description: string;
  keyFeatures: string[];
  ingredients?: string;
  dosageUsage?: string;
  warnings?: string;
  deliveryInfo?: string;
  packSizes?: string[];
  dietaryTags?: string[];
  reviews?: Review[];
}

export interface CartItem {
  id: string; // unique item key e.g. `${productId}-${packSize}`
  product: Product;
  quantity: number;
  selectedPackSize?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
  subcategories: string[];
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name-asc';

export interface FilterState {
  category?: string;
  subcategory?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  dietary?: string[];
  sort: SortOption;
}

export interface CustomerDetails {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  county?: string;
  postcode: string;
  country: string;
  deliveryOptionId: string;
  paymentMethod: 'card' | 'paypal' | 'apple_pay' | 'google_pay';
}

export interface OrderConfirmationData {
  orderNumber: string;
  orderDate: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  customer: CustomerDetails;
  deliveryMethodName: string;
  estimatedDelivery: string;
  paymentIntentId?: string;
  paymentStatus?: string;
}
