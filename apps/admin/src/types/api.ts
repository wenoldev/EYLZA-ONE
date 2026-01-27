export interface Query {
  id: string;
  store_id: string;
  customer_id: string;
  name: string;
  email: string;
  phone_number?: string;
  status: 'seen' | 'unseen'
  message: string;
}
export interface Order {
  id: string;
  store_id: string;
  customer_id: string;
  payment_id?: string;
  payment_status: string;
  status: string;
  total_price: number;
}