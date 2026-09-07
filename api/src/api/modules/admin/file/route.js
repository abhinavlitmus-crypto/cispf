const { Router } = require('express');
const controller = require('./controller');

const multerUpload = require('../../../../utilities/multer')();
const { uploadtoClaudinary } = require('../../../middlewares/uploadToAWS');

const router = Router({ mergeParams: true });

router.post('/save', multerUpload?.single('file'), uploadtoClaudinary, controller.save);
// router.post('/save-base64', validation.fileBase64, formValidation, uploadFileBase64, controller.save);
// router.post('/remove', deleteFromS3Bucket, controller.remove);

module.exports = router;

