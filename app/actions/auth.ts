"use server";

import prisma from "@/libs/prisma";
import { hashPassword } from "@/libs/auth";

export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, error: "Missing required fields" };
  }

  if (password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        profile: {
          create: {
            educationLevel: "Not specified",
          },
        },
      },
    });

    return { success: true, data: user };
  } catch (error: any) {
    console.error("Signup error:", error);
    return { success: false, error: error.message || "Failed to create user" };
  }
}

export async function loginRedirect(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) return { success: false, error: "User not found" };

    return {
      success: true,
      data: {
        isComplete: user.profile?.isComplete || false,
      },
    };
  } catch (error) {
    return { success: false, error: "Failed to fetch user data" };
  }
}
