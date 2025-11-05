import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const newPassword = body.newPassword?.trim();

    if (!email || !newPassword)
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email });

    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    console.log("[change-password] password changed for:", email);
    return NextResponse.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("[change-password] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


