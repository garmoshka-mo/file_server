const fs = require('fs')
const express = require('express')
const timeout = require('connect-timeout')
require('dotenv').config()
var execFile = require("child_process").execFile

const app = express()
const port = process.env.PORT
const processingCmd = process.env.POST_PROCESSING_CMD
const errorsLogPath = process.env.ERRORS_LOG || './errors.log'
var errorsLog = fs.createWriteStream(errorsLogPath, {flags:'a'})

if (!port) throw("Please check that .env configuration is correct")

app.use(express.static('uploads'))
app.use(timeout(20 * 60 * 1000)) // 20 minutes

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
    } catch(e) { receivingFailed(e) }
    console.log("💾 File saved", filename)
    res.send({success: true})

      var s = processingCmd.split(' ')
      var cmd = s.shift()
      var args = s.concat([filePath, metaJson,
        request.headers['content-type'],
        request.headers['x-auth-token']
      ])
      execFile(cmd, args, {}, function (error, stdout, stderr) {
        if (error)
          postProcessingError("⛔️ PHP post-processing error", cmd, args, error)
        else if (stdout == 'OK') {
          console.log("✅ File post-processed", filename)
        } else
          postProcessingError("⛔️ PHP post-processor responded not with OK", cmd, args, stderr, stdout)
      })
  }

  function postProcessingError() {
    var now = new Date().toISOString()
    console.error(now, arguments)
    var content = `${now} ${JSON.stringify(arguments)}\n`
    errorsLog.write(content, function(err) {
      if(err) console.error("⛔️ Can't write to errors log", errorsLogPath, err, content)
    })
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
