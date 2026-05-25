import bcrypt from "bcryptjs";

import { Context } from "hono";

import {
  loginSchema,
  signupSchema,
} from "../lib/validators";

import { generateToken } from "../lib/jwt";


export const signup = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parsed =
      signupSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        400
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        parsed.data.password,
        10
      );

    // TODO:
    // Save user in DB

    return c.json({
      success: true,
      message:
        "User created successfully",
      hashedPassword,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Signup failed",
      },
      500
    );
  }
};


export const login = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parsed =
      loginSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        {
          success: false,
          errors: parsed.error.flatten(),
        },
        400
      );
    }

    // TODO:
    // fetch user from DB

const token = await generateToken(
  "example-user-id",
  c.env.JWT_SECRET
);

    return c.json({
      success: true,
      token,
    });
  } catch (error) {
    return c.json(
      {
        success: false,
        message: "Login failed",
      },
      500
    );
  }
};