const fs = require('fs')
const express = require('express')
const timeout = require('connect-timeout')
require('dotenv').config()
var execFile = require("child_process").execFile
const sharp = require('sharp');

const app = express()
const port = 8080

app.use(express.static('image_server'))
app.use(timeout(20 * 60 * 1000)) // 20 minutes

app.get('/thumbnail/:file', (req, res) => {

  sharp(`image_server/${req.params.file}`)
    .resize(150)
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then(data => res.type('jpeg').send(data))

  }
)

app.listen(port, () => console.log(`📡 Upload server listening on port ${port}`))
