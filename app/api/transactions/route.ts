import { connectDB } from '@/lib/mongodb/db';
import { getCurrentUser } from '@/lib/auth/session';
import { Transaction } from '@/lib/mongodb/models/Transaction';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const transactions = await Transaction.find({ userId: currentUser.userId })
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { category, description, amount, type, date } = await request.json();

    if (!category || !amount || !type) {
      return NextResponse.json(
        { error: 'Category, amount, and type are required' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.create({
      userId: currentUser.userId,
      category,
      description,
      amount,
      type,
      date: date ? new Date(date) : new Date(),
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch (error) {
    console.error('Create transaction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
