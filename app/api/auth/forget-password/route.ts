// app/api/auth/forgot-password/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/lib/models/User";
import { randomInt } from "crypto";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ message: "Missing email" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // always return success to avoid account enumeration
      return NextResponse.json({ message: "If account exists, OTP sent" });
    }

    const otp = String(randomInt(100000, 999999));
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    // await sendMail({
    //   to: user.email,
    //   subject: "Password reset OTP",
    //   text: `Your OTP is ${otp} (expires in 10 minutes).`,
    // });

    // const devOtp = process.env.NODE_ENV === "production" ? undefined : otp;
    return NextResponse.json({
      message: "If account exists, OTP sent",
      otp: otp,
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
