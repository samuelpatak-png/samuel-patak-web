import { timingSafeEqual } from "node:crypto";

export function inviteMatches(code: string): boolean {
  const expected = process.env.REVIEW_INVITE;
  if (!expected) return false;
  const left = Buffer.from(code);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}
