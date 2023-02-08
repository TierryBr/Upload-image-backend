require("dotenv").config()

const express = require('express')
const mongoose = require('mongoose')
const path = require("path")
const cors = require("cors")

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/files', express.static(path.resolve(__dirname, "..", "temp", "uploads")))

app.get('/favicon.ico', (req, res) => res.status(204));

app.use(require('./routes'))

app.listen(process.env.PORT || 3002)