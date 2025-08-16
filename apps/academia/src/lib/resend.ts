import { Resend } from "resend";

const API_KEY =
  process.env?.RESEND_API_KEY ?? "re_SjDH6ok1_HPtiDLWySobj2Uz7dZ68hFZT";

export const resend = new Resend(API_KEY);
