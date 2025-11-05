import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomInt } from "crypto";

type User = {
  id: string;
  fullName: string;
  email: string;
  passwordHash: string;
  phoneNumber?: string;
  verified?: boolean;
  otp?: string;
};

const USERS = new Map<string, User>();

export const createUser = async ({
  fullName,
  email,
  password,
  phoneNumber,
}: any) => {
  if (Array.from(USERS.values()).find((u) => u.email === email))
    throw new Error("User exists");
  const salt = await bcrypt.genSalt(8);
  const hash = await bcrypt.hash(password, salt);
  const id = String(Date.now());
  const otp = String(randomInt(100000, 999999));
  const user: User = {
    id,
    fullName,
    email,
    passwordHash: hash,
    phoneNumber,
    verified: false,
    otp,
  };
  USERS.set(id, user);
  return user;
};

export const findUserByEmail = (email: string) =>
  Array.from(USERS.values()).find((u) => u.email === email);
export const findUserById = (id: string) => USERS.get(id);
export const setUserVerified = (user: User) => {
  user.verified = true;
  user.otp = undefined;
  USERS.set(user.id, user);
};
export const setOtpForUser = (user: User, otp: string) => {
  user.otp = otp;
  USERS.set(user.id, user);
};
export const verifyPassword = (user: User, password: string) =>
  bcrypt.compare(password, user.passwordHash);
export const issueToken = (user: User) => {
  const secret = process.env.JWT_SECRET || "secret_demo";
  return jwt.sign({ id: user.id, email: user.email }, secret, {
    expiresIn: "7d",
  });
};
export const verifyToken = (token: string) => {
  const secret = process.env.JWT_SECRET || "secret_demo";
  try {
    return jwt.verify(token, secret);
  } catch {
    return null;
  }
};
