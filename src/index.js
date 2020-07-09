require("dotenv").config()

const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require("path")
const cors = require("cors")

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-icvxh.mongodb.net/upload?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))
app.use('/files', express.static(path.resolve(__dirname, "..", "temp", "uploads")))


app.use(require('./routes'))

app.listen(3000)