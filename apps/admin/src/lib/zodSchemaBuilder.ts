import type { FormField } from '@/types/form';
import { z } from 'zod';

export const buildFormSchema = (fields: FormField[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let schema: z.ZodTypeAny;

    switch (field.validationRule) {
      case 'string': {
        // Create a ZodString and store it in a stringSchema variable
        let stringSchema = z.string({
          message: `${field.label} is required`,
        });
        if (field.required) {
          // Here we can safely call .min() because TS knows it’s a ZodString
          stringSchema = stringSchema.min(1, `${field.label} cannot be empty`);
        }
        schema = stringSchema;
        break;
      }

      case 'email': {
        // Similarly for email
        schema = z
          .string({
            message: `${field.label} is required`,
          })
          .email(`${field.label} must be a valid email`);
        break;
      }

      case 'number': {
        // For numbers, you might do numeric checks
        // or transform a string to a number
        const numberSchema = z.number({
          message: `${field.label} is required`,
        });
        // e.g. if (field.required) { numberSchema = numberSchema.min(1, ...); }
        schema = numberSchema.or(
          z
            .string()
            .regex(/^\d+$/, `${field.label} must be a valid number`)
            .transform((val) => parseInt(val, 10))
        );
        break;
      }

      default: {
        // If no special validation, just allow anything
        schema = z.any();
        // If field is required, refine that it's not empty
        if (field.required) {
          schema = schema.refine(
            (val) => val !== null && val !== undefined && val !== '',
            `${field.label} is required`
          );
        }
      }
    }

    shape[field.name] = schema;
  });

  return z.object(shape);
};
