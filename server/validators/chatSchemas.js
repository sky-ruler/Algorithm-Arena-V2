const { z } = require('zod');

const chatParamsSchema = {
  params: z.object({
    clanId: z.string().length(24, 'clanId must be a 24-character MongoDB ObjectId'),
  }),
};

const chatSendSchema = {
  params: z.object({
    clanId: z.string().length(24),
  }),
  body: z.object({
    content: z.string().trim().min(1, 'Message cannot be empty').max(2000, 'Message too long (max 2000 chars)'),
    isDoubt: z.boolean().optional().default(false),
  }),
};

module.exports = { chatParamsSchema, chatSendSchema };
