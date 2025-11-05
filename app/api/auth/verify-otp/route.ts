// app/api/auth/verify-otp/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email || "").toLowerCase().trim();
    const otpFromClient = String(body.otp || "").trim();

    if (!email || !otpFromClient)
      return NextResponse.json({ message: "Missing email or otp" }, { status: 400 });

    await dbConnect();

    const user = await User.findOne({ email });
    console.log("[verify-otp] looked up user:", { email, found: !!user });

    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });
    if (user.verified) return NextResponse.json({ message: "Already verified" });

    // Defensive: possible schema differences
    const otpStored = user.otp ? String(user.otp).trim() : null;
    const expiresAt: Date | undefined = (user.otpExpiresAt || user.otpExpires || null) as any;

    console.log("[verify-otp] otpStored, otpFromClient, expiresAt:", { otpStored, otpFromClient, expiresAt });

    if (!otpStored || !expiresAt)
      return NextResponse.json({ message: "OTP not set", status: 400 }, { status: 400 });

    if (new Date() > new Date(expiresAt))
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });

    if (otpStored !== otpFromClient)
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });

    user.verified = true;
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.otpExpires = undefined; // remove both names if present
    await user.save();

    console.log("[verify-otp] user verified:", user._id);
    return NextResponse.json({ message: "Verified" });
  } catch (err: any) {
    console.error("[verify-otp] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
