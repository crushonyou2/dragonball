import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  currentPrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceHistory: {
    price: number;
    date: Date;
  }[];
  url: string;
  lastUpdated: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  currentPrice: { type: Number, required: true },
  lowestPrice: { type: Number, required: true },
  highestPrice: { type: Number, required: true },
  priceHistory: [{
    price: { type: Number, required: true },
    date: { type: Date, required: true }
  }],
  url: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IProduct>('Product', ProductSchema); 