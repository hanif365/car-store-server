import { z } from 'zod';

const updateStatusValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean({
      required_error: 'Status is required',
    }),
  }),
});

const changePasswordValidationSchema = z.object({
  body: z.object({
    currentPassword: z.string({
      required_error: 'Current password is required',
    }),
    newPassword: z.string({
      required_error: 'New password is required',
    }),
  }),
});

const updateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
  }),
});

export const UserValidation = {
  updateStatusValidationSchema,
  changePasswordValidationSchema,
  updateProfileValidationSchema,
};
