const express = require('express');
const router = express.Router();
const { getQuestionSets, getQuestionSetById, createQuestionSet, updateQuestionSet, deleteQuestionSet } = require('./questionSet.controller');
const { protect, admin } = require('../../../middleware/auth');

router.route('/')
  .get(protect, getQuestionSets)
  .post(protect, admin, createQuestionSet);

router.route('/:id')
  .get(protect, getQuestionSetById)
  .put(protect, admin, updateQuestionSet)
  .delete(protect, admin, deleteQuestionSet);

module.exports = router;
