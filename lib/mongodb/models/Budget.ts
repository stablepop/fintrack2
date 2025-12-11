import mongoose, { Schema, Document } from 'mongoose';

export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  limitAmount: number;
  period: 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    limitAmount: {
      type: Number,
      required: [true, 'Limit amount is required'],
      min: [0, 'Limit cannot be negative'],
    },
    period: {
      type: String,
      enum: ['monthly', 'yearly'],
      default: 'monthly',
    },
  },
  {
    timestamps: true,
  }
);

export const Budget = mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);
