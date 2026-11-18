import { isAxiosError } from "axios";

/**
 * 409 from card writes: the workflow rejected the status change, or the card
 * changed concurrently. Either way the cached rules/cards are stale.
 */
export const isConflictError = (error: unknown): boolean =>
  isAxiosError(error) && error.response?.status === 409;

/**
 * 400/409 from card writes: besides plain validation errors, the backend
 * answers 400 for a status outside the workflow or not mapped to the column,
 * which also means the cached rules or mappings are stale.
 */
export const isRejectionError = (error: unknown): boolean =>
  isAxiosError(error) &&
  (error.response?.status === 400 || error.response?.status === 409);

export const getErrorMessage =(error: unknown, fallback: string): string => {
  if (isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (message) {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};
