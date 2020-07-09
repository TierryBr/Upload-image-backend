const mongoose = require('mongoose')
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const S3 = new aws.S3()

const PostSchema = new mongoose.Schema({
    name: String,
    size: Number,
    key: String,
    url: String,
    CreatedAt: {
        type: Date,
        default: Date.now
    }
});
// Quando não for enviado para o S3, é pq esta salvando no disco, logo substitui a url pelo caminho local
PostSchema.pre('save', function () {
    if (!this.url) {
        this.url = `${process.env.APP_URL}/files/${this.key}`
    }
})


// Removendo o arquivo do S3 ou do arquivo local
PostSchema.pre('remove', function () {
    if (process.env.STORAGE_TYPE === 'S3') {
        return S3.deleteObject({
            Bucket: 'uploadphotosexample/photos',
            Key: this.key,
        }).promise()
    } else {
        return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'temp', 'uploads', this.key))
    }
})

module.exports = mongoose.model("Post", PostSchema)