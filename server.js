const fs = require('fs')
const express = require('express')
require('dotenv').config()
var execFile = require("child_process").execFile

const app = express()
const port = process.env.PORT
const processingCmd = process.env.POST_PROCESSING_CMD

app.use(express.static('uploads'))

app.post('/upload', function(request, res) {

  console.log('Receiving file', request.headers.metadata)

  try {

    var metaJson = request.headers.metadata
    var meta = JSON.parse(metaJson)
    var filename = meta['ccmImageName'] || `${+ new Date()}.mp4`

    var filePath = `${process.env.UPLOADS_PATH}${filename}`
    var stream = fs.createWriteStream(filePath)

    request.on('data', function (data) {
      try {
        stream.write(data)
      } catch(e) { receivingFailed(e) }
    })

    request.on('end', finalizeUpload)

  } catch(e) { receivingFailed(e) }

  function finalizeUpload() {
    try {
      stream.end()
        console.log("💾 File saved", filename)

      var s = processingCmd.split(' ')
      var cmd = s.shift()
      var args = s.concat([filePath, metaJson,
        request.headers['content-type'],
        request.headers['x-auth-token']
      ])
      execFile(cmd, args, {}, function (error, stdout, stderr) {
        if (error)
          receivingFailed(`PHP post-processing error: ${error}`)
        else if (stdout == 'OK') {
          res.send({success: true})
          console.log("✅ File post-processed", filename)
        } else
          receivingFailed(`PHP post-processor responded not with OK: ${stderr} ${stdout}`)
      })
    } catch(e) { receivingFailed(e) }
  }

  function receivingFailed(e) {
    try {
      res.status(500).send({success: false, message: e})
      console.error("⛔️ Receiving failed", e)
    } catch(e2) {
      console.error("⛔️ Can't process error", e2, e)
    }
  }

})

app.get('/', (req, res) => res.send('Upload server is up'))

app.listen(port, () => console.log(`📡 Upload server listening on port ${port}`))
