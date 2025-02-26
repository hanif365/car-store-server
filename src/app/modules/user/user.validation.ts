import { z } from 'zod';



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
    profileImage: z.string().optional(),
  }),
});


const updateStatusValidationSchema = z.object({
  body: z.object({
    isActive: z.boolean({
      required_error: 'Status is required',
    }),
  }),
});

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const UserValidation = {
  updateStatusValidationSchema,
  changePasswordValidationSchema,
  updateProfileValidationSchema,
  updateUserValidationSchema,
};
