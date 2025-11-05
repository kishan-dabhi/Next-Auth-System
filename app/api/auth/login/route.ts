// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // if (!user.verified) {
    //   return NextResponse.json({ message: "Account not verified" }, { status: 403 });
    // }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET not set in .env");

    // ✅ Properly typed JWT sign (TypeScript-safe)
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      secret as jwt.Secret,
      { expiresIn: "7d" } // valid format
    );

    const res = NextResponse.json({
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });

    // ✅ Set secure, HTTP-only cookie
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err: any) {
    console.error("Login Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
