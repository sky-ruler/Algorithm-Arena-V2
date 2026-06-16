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

const refreshSchema = {
  body: z.object({}).optional(),
};

const url = z.string().trim().url().max(512).optional().or(z.literal(''));

const updateMeSchema = {
  body: z.object({
    bio:            z.string().trim().max(500).optional(),
    branch:         z.string().trim().max(100).optional(),
    year:           z.string().trim().max(50).optional().or(z.literal('')),
    section:        z.string().trim().max(10).optional(),
    location:       z.string().trim().max(100).optional(),
    github:         z.string().trim().max(100).optional().or(z.literal('')),
    twitter:        z.string().trim().max(100).optional().or(z.literal('')),
    linkedin:       z.string().trim().max(100).optional().or(z.literal('')),
    website:        url,
    profilePicture: z.string().trim().max(4 * 1024 * 1024).optional().or(z.literal('')),
  }).strict(),
};

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  updateMeSchema,
};
