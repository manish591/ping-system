"use server";

import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { authOptions } from "@/auth";

const JWT_SECRET = process.env.JWT_SECRET ?? "jwt secret";

export async function generateWebsocketAuthToken() {
  try {
    const session = await getServerSession(authOptions);

    if(!session?.user) {
      return {
        status: "error",
        message: "unauthorized",
        data: null
      }
    }

    const payload = {
      id: session.userId,
      user: session.user
    }

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "1m",
    });

    return {
      status: "success",
      message: "succesfully generated token",
      data: {
        token
      }
    }
  } catch(err) {
    console.log("Internal server error occured", err);
    return {
      status: "error",
      message: "internal server error",
      data: null
    }
  }
}