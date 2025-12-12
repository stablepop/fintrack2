import { connectDB } from '@/lib/mongodb/db';
import { getCurrentUser } from '@/lib/auth/session';
import { Investment } from '@/lib/mongodb/models/Investment';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const investment = await Investment.findOne({
      _id: params.id,
      userId: currentUser.userId,
    });

    if (!investment) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json(investment);
  } catch (error) {
    console.error('Get investment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const {
      category,
      description,
      amount,
      type,
      date,
      startDate,
      expectedReturnRate,
      targetYears
    } = await request.json();

    const investment = await Investment.findOneAndUpdate(
      {
        _id: params.id,
        userId: currentUser.userId,
      },
      {
        ...(category && { category }),
        ...(description && { description }),
        ...(amount !== undefined && { amount }),
        ...(type && { type }),
        ...(date && { date: new Date(date) }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(expectedReturnRate !== undefined && { expectedReturnRate }),
        ...(targetYears !== undefined && { targetYears }),
      },
      { new: true }
    );

    if (!investment) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json(investment);
  } catch (error) {
    console.error('Update investment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const investment = await Investment.findOneAndDelete({
      _id: params.id,
      userId: currentUser.userId,
    });

    if (!investment) {
      return NextResponse.json({ error: 'Investment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Investment deleted' });
  } catch (error) {
    console.error('Delete investment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
