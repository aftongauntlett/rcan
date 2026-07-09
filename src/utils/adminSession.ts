import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

const ONE_DAY_SECONDS = 60 * 60 * 24;
const SIGNATURE_ALGORITHM = "sha256";

const sign = (payload: string, secret: string): string =>
  createHmac(SIGNATURE_ALGORITHM, secret).update(payload).digest("base64url");

const signaturesMatch = (received: string, expected: string): boolean => {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
};

export const createAdminSessionToken = (secret: string): string => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const nonce = randomBytes(24).toString("base64url");
  const payload = `${issuedAt}.${nonce}`;

  return `${payload}.${sign(payload, secret)}`;
};

export const isValidAdminSessionToken = (token: string | undefined, secret: string): boolean => {
  if (!token || !secret) return false;

  const [issuedAtValue, nonce, receivedSignature] = token.split(".");
  if (!issuedAtValue || !nonce || !receivedSignature) return false;

  const issuedAt = Number(issuedAtValue);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isInteger(issuedAt) || issuedAt > now || now - issuedAt > ONE_DAY_SECONDS) {
    return false;
  }

  const payload = `${issuedAtValue}.${nonce}`;
  const expectedSignature = sign(payload, secret);

  return signaturesMatch(receivedSignature, expectedSignature);
};
