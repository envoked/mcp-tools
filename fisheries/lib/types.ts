// FisheriesClient types

export interface FisheriesCredentials {
  email: string;
  password: string;
}

export interface FisheriesOrder {
  orderNumber: string;
  poNumber: string;
  orderedOn: string;
  orderTotal: number;
  orderStatus: string;
  lines: any; // null or potentially an array of line items
}

// Product specification
export interface Specification {
  id: number;
  key: string;
  value: string;
  sortOrder: number;
}

// UnitOfMeasure
export interface UnitOfMeasure {
  displayName: string;
  unitName: string;
  unitSize: number;
  isDefaultUnit: boolean;
}

// Attribute value
export interface AttributeValue {
  attributeId: number;
  value: string;
  sortOrder: number;
}

// Brand
export interface Brand {
  text: string;
  linkUrl: string;
}

// SKU
export interface SKU {
  id: number;
  itemId: string;
  invMastUid: number;
  metaTitle: string | null;
  metaDescription: string | null;
  name: string;
  shortCode: string;
  url: string;
  fullUrl: string;
  supplierPartNumber: string;
  productId: string | null;
  productName: string | null;
  images: any | null;
  specifications: Specification[] | null;
  dimensions: any | null;
  unitsOfMeasure: UnitOfMeasure[];
  availability: any | null;
  attributeValues: AttributeValue[];
  discontinued: boolean;
  whatsInTheBox: any[];
  imageUrl: string;
  imageAltTag: string | null;
  brandName: string;
  brand: Brand;
  categories: any | null;
  prop65Message: string | null;
  prohibitedStates: any | null;
}

// Item in order
export interface OrderItem {
  invMastUid: number;
  itemId: string;
  itemDescription: string;
  sku: SKU;
}

// Address
export interface Address {
  name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string | null;
}

// Invoice line item
export interface InvoiceLineItem {
  lineUid: number;
  invMastUid: number;
  quantity: number;
  quantityRemaining: number;
  unitPrice: number;
  extendedPrice: number;
}

// Invoice
export interface Invoice {
  invoiceNumber: number;
  totalAmount: number;
  taxAmount: number;
  carrierName: string;
  trackingNumber: string;
  pickupDate: string;
  shipDate: string;
  estimatedDeliveryDate: string;
  shippingAmount: number;
  shipToAddress: Address;
  items: InvoiceLineItem[];
}

// Order line item
export interface OrderLineItem {
  lineUid: number;
  quantity: number;
  quantityRemaining: number;
  invMastUid: number;
  unitPrice: number;
  extendedPrice: number;
}

// Order detail
export interface OrderDetail {
  orderNumber: number;
  webReferenceNumber: string | null;
  orderDate: string;
  total: number;
  carrierName: string;
  taxAmount: number;
  estimatedDeliveryDate: string | null;
  shippingAmount: number;
  placedBy: string;
  shipToAddress: Address;
  items: OrderLineItem[];
  invoices: Invoice[];
}

// Purchase order
export interface PurchaseOrder {
  purchaseOrder: string;
  orders: OrderDetail[];
}

// Order value
export interface OrderValue {
  id: string;
  name: string;
  items: OrderItem[];
  purchaseOrders: PurchaseOrder[];
}

// Response type
export interface FisheriesOrderDetails {
  success: boolean;
  message: string;
  errors: any[];
  value: OrderValue[];
  expectations: any;
  completedTransactions: any;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  errors: any[];
  value: FisheriesOrder[];
  expectations: any;
  completedTransactions: any;
}
