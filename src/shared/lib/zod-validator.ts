import type { ZodSchema, ZodError } from 'zod';

/**
 * Custom Zod validator for Mantine useForm
 * Converts Zod errors to Mantine form errors format
 */
export const createZodValidator = <T extends Record<string, unknown>>(
  schema: ZodSchema
) => {
  return (values: T): Record<string, string> => {
    try {
      schema.parse(values);
      return {};
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as ZodError;
        const errors: Record<string, string> = {};
        
        if (Array.isArray(zodError.issues)) {
          zodError.issues.forEach((issue) => {
            const path = Array.isArray(issue.path)
              ? issue.path.join('.')
              : String(issue.path);
            if (path) {
              errors[path] = issue.message;
            }
          });
        }
        
        return errors;
      }
      return {};
    }
  };
};
