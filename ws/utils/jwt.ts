import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";

export function verifyJWT(token: string) {
  try {
    const data = jwt.verify(token, JWT_SECRET);
    return data;
  } catch(err) {
    return null;
  }
}