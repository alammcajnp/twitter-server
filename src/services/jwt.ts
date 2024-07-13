import JWT from "jsonwebtoken";
import { prismaClient } from "../client/db";
import { User } from "@prisma/client";
class JWTservice {
  public static generateTOkenForUser() {
    const payload = {
      id: 1,
      email: "alamjnp12@gmail.com"
    };
    const JWT_SECRET = "$uper@1234.";
    const token = JWT.sign(payload, JWT_SECRET);
    return token;
  }
}
export default JWTservice;
