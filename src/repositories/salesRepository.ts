import { MongoClient, Collection } from 'mongodb';

export interface Sale {
  _id: string;
  vendorId: string;
  amount: number;
  date: Date;
}

export class SalesRepository {
  private sales: Collection;

  constructor(private client: MongoClient) {
    this.sales = client.db('nimage').collection('sales');
  }

  async findByVendorId(vendorId: string): Promise<Sale[]> {
    return this.sales.find({ vendorId }).toArray();
  }
}