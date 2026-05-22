const express = require('express');
const router = express.Router();
const { getChatHistory, sendMessage } = require('./chat.controller');
const { protect } = require('../../../middleware/auth');
const { validate } = require('../../../middleware/validate');
const { chatParamsSchema, chatSendSchema } = require('../../../validators/chatSchemas');

router
  .route('/:clanId')
  .get(protect, validate(chatParamsSchema), getChatHistory)
  .post(protect, validate(chatSendSchema), sendMessage);

module.exports = router;
