import crypto from "crypto";

export function generateEsewaSignature(
  message: string,
  secret: string
): string {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  return hmac.digest("base64");
}
