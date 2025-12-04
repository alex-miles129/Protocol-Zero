import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  GOOGLE_CONTACT_SHEET_ID,
  GOOGLE_WHITELIST_SHEET_ID,
  GOOGLE_EMS_SHEET_ID,
  GOOGLE_POLICE_SHEET_ID,
  GOOGLE_DOJ_SHEET_ID,
  GOOGLE_DOC_SHEET_ID,
} from "@/config/googleConfig"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSheetId(type: string): string | null {
  switch (type) {
    case 'whitelist':
      return GOOGLE_WHITELIST_SHEET_ID;
    case 'ems':
      return GOOGLE_EMS_SHEET_ID;
    case 'police':
      return GOOGLE_POLICE_SHEET_ID;
    case 'doj':
      return GOOGLE_DOJ_SHEET_ID;
    case 'doc':
      return GOOGLE_DOC_SHEET_ID;
    default:
      return null;
  }
}
