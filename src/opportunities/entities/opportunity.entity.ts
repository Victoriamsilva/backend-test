import { Product } from 'src/types/product';

export class Opportunity {
  id: number;
  creator: {
    id: number;
    name?: string;
    email?: string;
  };
  contact: {
    id: number;
    name?: string;
    email?: string;
    phone?: string;
  };
  organization?: {
    id: number;
    name?: string;
  };
  title?: string;
  products?: Product[];
}
