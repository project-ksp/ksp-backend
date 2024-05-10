import crypto from "crypto";
import { env } from "./env";

/*
 * Utility for encrypting password.
 * Password is encrypted instead of hashed because the password
 * is needed to be decrypted for the business logic.
 * This is not secure at all, but it is what it is.
 */

async function encrypt(data: string) {
  const iv = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(env.APP_ENCRYPTION_KEY, iv, 2000, 32, "sha256");

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = cipher.update(data, "utf8", "base64") + cipher.final("base64");

  return Buffer.from(iv.toString("base64") + "." + encrypted).toString("base64");
}

async function decrypt(data: string) {
  const buffer = Buffer.from(data, "base64");
  const [ivBase64, encrypted] = buffer.toString("utf8").split(".");
  if (!ivBase64 || !encrypted) {
    throw new Error("Invalid data");
  }

  const iv = Buffer.from(ivBase64, "base64");
  const key = crypto.pbkdf2Sync(env.APP_ENCRYPTION_KEY, iv, 2000, 32, "sha256");

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = decipher.update(encrypted, "base64", "utf8") + decipher.final("utf8");

  return decrypted;
}

const cipher = { encrypt, decrypt };
export default cipher;
