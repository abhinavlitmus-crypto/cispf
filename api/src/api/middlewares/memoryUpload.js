const multer = require('multer');

// Multer instance using memoryStorage for serverless environments like Vercel
// This keeps the uploaded file in memory as Buffer (req.file.buffer)
// so we don't depend on writing to disk.
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // You can add type checks here if needed
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

module.exports = upload;
