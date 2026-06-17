const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  getResources,
  createResource,
  uploadResource,
  getResourceFile,
  deleteResource,
} = require('./resource.controller');
const { protect, admin } = require('../../../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB (stays under MongoDB's 16MB doc limit once base64-encoded)
  fileFilter(_req, file, cb) {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}. Only PDF files are accepted.`));
    }
  },
});

router.route('/')
  .get(protect, getResources)
  .post(protect, admin, createResource);

router.post('/upload', protect, admin, upload.single('file'), uploadResource);

// Public so any user can open the file from a plain <a href> (no auth header).
router.get('/:id/file', getResourceFile);

router.route('/:id')
  .delete(protect, admin, deleteResource);

module.exports = router;
