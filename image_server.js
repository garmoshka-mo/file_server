const fs = require('fs')
const express = require('express')
const timeout = require('connect-timeout')
require('dotenv').config()
var execFile = require("child_process").execFile

const app = express()
const port = 8080

app.use(express.static('image_server'))
app.use(timeout(20 * 60 * 1000)) // 20 minutes

app.get('/thumbnail/:file', (req, res) => {
    res.sendFile(`image_server/${req.params.file}`, {root: __dirname});
  }
)

app.listen(port, () => console.log(`📡 Upload server listening on port ${port}`))
