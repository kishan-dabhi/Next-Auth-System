// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/mailer";
import { randomInt } from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, password, confirmPassword, phoneNumber } = body;

    if (!fullName || !email || !password || !confirmPassword) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }
    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords must match" },
        { status: 400 }
      );
    }
    await dbConnect();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);


    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      passwordHash,
      phoneNumber,
      verified: false,
    });

  
    return NextResponse.json(
      { message: "User created, OTP sent", email: user.email },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
