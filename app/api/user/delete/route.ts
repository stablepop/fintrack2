import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth } from "@/lib/auth/jwt";
import { connectDB } from "@/lib/mongodb/db";
import User from "@/lib/mongodb/models/User";
import { Transaction } from "@/lib/mongodb/models/Transaction";

export async function DELETE(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyAuth(token);

    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    await connectDB();

    // Delete all user's transactions first
    await Transaction.deleteMany({ userId: payload.userId });

    // Delete the user account
    const result = await User.findByIdAndDelete(payload.userId);

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Clear the token cookie
    const cookieStore = await cookies();
    cookieStore.delete("token");

    return NextResponse.json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error(" Delete account error:", error);
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    );
  }
}
