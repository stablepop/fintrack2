import { connectDB } from '@/lib/mongodb/db';
import { getCurrentUser, isUserAdmin } from '@/lib/auth/session';
import { Transaction } from '@/lib/mongodb/models/Transaction';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAdmin = await isUserAdmin(currentUser.id);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectDB();

    const transactions = await Transaction.find()
      .populate('userId', 'email fullName')
      .sort({ date: -1 })
      .lean();

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Get admin transactions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
