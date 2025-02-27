"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const changePasswordValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        currentPassword: zod_1.z.string({
            required_error: 'Current password is required',
        }),
        newPassword: zod_1.z.string({
            required_error: 'New password is required',
        }),
    }),
});
const updateProfileValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        profileImage: zod_1.z.string().optional(),
    }),
});
const updateStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        isActive: zod_1.z.boolean({
            required_error: 'Status is required',
        }),
    }),
});
const updateUserValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().optional(),
        isActive: zod_1.z.boolean().optional(),
    }),
});
exports.UserValidation = {
    updateStatusValidationSchema,
    changePasswordValidationSchema,
    updateProfileValidationSchema,
    updateUserValidationSchema,
};
