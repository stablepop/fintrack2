import mongoose, { Schema, Document } from 'mongoose';

export interface IInvestment extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  description?: string;
  amount: number;
  type: 'oneTime' | 'recurring';
  date: Date;
  startDate: Date;
  expectedReturnRate: number; // annual expected %
  expectedEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const InvestmentSchema = new Schema<IInvestment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Stocks", "Mutual Funds", "Gold", "Real Estate", "Crypto", "Other"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    type: {
      type: String,
      enum: ["oneTime", "recurring"],
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
      index: true,
    },

    startDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    expectedReturnRate: {
      type: Number,
      default: 0, // if user enters nothing, we can auto-fill based on category
    },

    expectedEndDate: {
      type: Date,
    },

  },
  { timestamps: true }
);

export const Investment =
  mongoose.models.Investment ||
  mongoose.model<IInvestment>('Investment', InvestmentSchema);

export default Investment;
