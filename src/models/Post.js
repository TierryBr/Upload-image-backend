const mongoose = require('mongoose')
const aws = require('aws-sdk');
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const s3 = new aws.S3();

const PostSchema = new mongoose.Schema({
  name: String,
  size: Number,
  key: String,
  url: String,
  favorite: Boolean,
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

PostSchema.pre('remove', function () {
  if (process.env.STORAGE_TYPE === 's3') {
    return s3.deleteObject({
      Bucket: process.env.AWS_BUCKET,
      Key: this.key,
    }).promise()
  } else {
    return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'temp', 'uploads', this.key))
  }
})

module.exports = mongoose.model("Post", PostSchema)