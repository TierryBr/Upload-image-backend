const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const aws = require("aws-sdk")
const multerS3 = require("multer-s3")
const { S3Client } = require('@aws-sdk/client-s3');

let S3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});


const storageType = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'temp', 'uploads'))
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(8, (err, hash) => {
        if (err) cb(err)

        file.key = `${hash.toString('hex')}-${file.originalname}`

        cb(null, file.key)
      })
    },

  }),

  s3: multerS3({
    s3: S3,
    bucket: process.env.AWS_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(8, (err, hash) => {
        if (err) cb(err)

        file.key = `${hash.toString("hex")}-${file.originalname}`

        cb(null, file.key)
      })
    }
  })
}

module.exports = {
  dest: path.resolve(__dirname, '..', '..', 'temp', 'uploads'),
  storage: storageType[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 30 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/dng',
      'image/gif'
    ]
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type."))
    }
  }

}