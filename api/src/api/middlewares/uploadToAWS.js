
const fs = require('fs');
const cloudinary = require('cloudinary')
const path = require('path');
const config = require('../../config');


cloudinary.v2.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.key,
  api_secret: config.cloudinary.secret,
})

// const s3 = new S3Client({
//     credentials: {
//         accessKeyId: config.awss3.accessKey,
//         secretAccessKey: config.awss3.secretKey
//     },
//     region: config.awss3.region
// });
// async function uploadToAWS(req, res, next) {
//     try {
//         const file = fs.readFileSync(path.join(config.TempFileDir, req.file.filename));
//         const form = new FormData();
//         form.append('file', file, req.file.filename);
//         const data = await axios.post(config.uploadServerIp + '/upload', form);
//         req.file.url = data?.data?.url;
//         fs.unlinkSync(path.join(config.TempFileDir, req.file.filename));
//     } catch (err) {
//     } finally {
//         next();
//     }
// }

// async function deleteFromAWS(req, res, next) {
//     try {
//         const name = req.body.url.split('/').pop();
//         await axios.post(config.uploadServerIp + '/remove', { fileName: name });
//     } catch (err) {
//     } finally {
//         next();
//     }
// }


// async function uploadToS3Bucket(req, res, next) {
//     try {
//         const {mimetype} = req.file;
//         const file = fs.readFileSync(path.join(config.TempFileDir, req.file.filename));
//         const params = {
//             Bucket: config.awss3.bucketName,
//             Key: config.awss3.uploadDirName ? config.awss3.uploadDirName + "/" + req.file.filename : req.file.filename,
//             Body: file,
//             ContentType: mimetype
//         };
//         console.log(req.file)

//         console.log(params,"upload-img")
//         const upload = new Upload({ client: s3, params });
//         const uploadedData = await upload.done();
//         fs.unlinkSync(path.join(config.TempFileDir, req.file.filename));
//         req.file.url = uploadedData?.Location;
//     } catch (err) {
//     } finally {
//         next();
//     }
// }

async function uploadtoClaudinary(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    // console.log("req data",req.file,config.cloudinary.name,config.cloudinary.key,config.cloudinary.secret)

    const filePath = path.join(config.TempFileDir, req.file.filename);

    // Upload file to Cloudinary
    const result = await cloudinary.v2.uploader.upload(filePath, {
      resource_type: 'auto',
      folder: 'uploads',
      // format: 'webp',
      quality: 'auto:eco',  // automatic optimization
      ...(req.file.mimetype.startsWith("image/") && {
        quality: 'auto:eco',
      }),
    });

    // Remove the local temp file
    fs.unlinkSync(filePath);
    //  console.log("uploaded data",result)
    // Send back Cloudinary URL
    req.upload = result;


  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    return res.status(500).json({ error: 'File upload failed' });
  } finally {
    next && next();
  }
}

async function deleteFromS3Bucket(req, res, next) {
  try {
    const name = config.awss3.uploadDirName ? + "/" + req.body.url.split('/').pop() : req.body.url.split('/').pop();
    await s3.send(new DeleteObjectCommand({
      Bucket: config.awss3.bucketName,
      Key: name
    }));
  } catch (err) {
  } finally {
    next();
  }
}

module.exports = { uploadtoClaudinary, deleteFromS3Bucket };