const multer = require("multer")
const path = require("path")
const crypto = require("crypto")
const aws = require("aws-sdk")
const multerS3 = require("multer-s3")


const storageType = {
    // Salvando os arquivos local
    local: multer.diskStorage({

        destination: (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'temp', 'uploads'))
        },

        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                // definindo o nome do arquivo
                file.key = `${hash.toString('hex')}-${file.originalname}`

                cb(null, file.key)
            })
        },

    }),

    // Salvando no aws
    S3: multerS3({
        s3: new aws.S3(),
        bucket: 'uploadphotosexample/photos',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)

                // definindo o nome do arquivo
                const fileName = `${hash.toString("hex")}-${file.originalname}`

                cb(null, fileName)
            })
        }
    })
}

module.exports = {
    dest: path.resolve(__dirname, '..', '..', 'temp', 'uploads'),
    // Usa no [ ] local para salvar no disco e S3 para salvar no aws
    storage: storageType[process.env.STORAGE_TYPE],
    limits: {
        fileSize: 5 * 1024 * 1024
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