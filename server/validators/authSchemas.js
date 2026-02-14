const { z } = require('zod');

const registerSchema = {
  body: z.object({
    username: z.string().trim().min(3).max(50),
    email: z.string().trim().email(),
    password: z.string().min(6).max(128),
  }),
};

const loginSchema = {
  body: z.object({
    email: z.string().trim().email(),
    password: z.string().min(1),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
};

