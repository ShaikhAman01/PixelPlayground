import bcrypt from "bcryptjs";
import { Context } from "hono";

import {
  loginSchema,
  signupSchema,
} from "../lib/validators";

import { generateToken } from "../lib/jwt";

import {
  successResponse,
  errorResponse,
} from "../utils/helpers";


// TEMP in-memory DB
const users: {
  id: string;
  username: string;
  password: string;
}[] = [];


export const signup = async (c: Context) => {
  try {
    const body = await c.req.json();

    const parsed =
      signupSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        errorResponse(
          "Invalid inputs",
          parsed.error.flatten()
        ),
        400
      );
    }

    const existingUser = users.find(
      (u) =>
        u.username ===
        parsed.data.username
    );

    if (existingUser) {
      return c.json(
        errorResponse(
          "Username already exists"
        ),
        409
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        parsed.data.password,
        10
      );

    const newUser = {
      id: crypto.randomUUID(),
      username: parsed.data.username,
      password: hashedPassword,
    };

    users.push(newUser);

    return c.json(
      successResponse(
        {
          id: newUser.id,
          username: newUser.username,
        },
        "User created successfully"
      ),
      201
    );
  } catch (error) {
    console.error(error);

    return c.json(
      errorResponse("Signup failed"),
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
        errorResponse(
          "Invalid inputs",
          parsed.error.flatten()
        ),
        400
      );
    }

    const user = users.find(
      (u) =>
        u.username ===
        parsed.data.username
    );

    if (!user) {
      return c.json(
        errorResponse(
          "Invalid credentials"
        ),
        401
      );
    }

    const isPasswordCorrect =
      await bcrypt.compare(
        parsed.data.password,
        user.password
      );

    if (!isPasswordCorrect) {
      return c.json(
        errorResponse(
          "Invalid credentials"
        ),
        401
      );
    }
console.log(c.env.JWT_SECRET);
    const token =
      await generateToken(
        user.id,
        c.env.JWT_SECRET
      );

    return c.json(
      successResponse(
        {
          token,
        },
        "Login successful"
      )
    );
  } catch (error) {
    console.error(error);

    return c.json(
      errorResponse("Login failed"),
      500
    );
  }
};