import { Resend } from "resend";

const API_KEY = process.env?.RESEND_API_KEY ?? "";

export const resend = new Resend(API_KEY);
