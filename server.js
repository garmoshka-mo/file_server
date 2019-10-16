const fs = require('fs')
const express = require('express')
const app = express()
const port = 8765

app.use(express.static('uploads'))

app.post('/upload', function(request, res) {

  console.log('Upload started', request.headers.metadata)

  try {

    var meta = JSON.parse(request.headers.metadata)
    var filename = meta['ccmImageName'] || `${+ new Date()}.mp4`

    var stream = fs.createWriteStream(`uploads/${filename}`)

    request.on('data', function (data) {
      stream.write(data)
    })

    request.on('end', function () {
      stream.end()
      res.send({success: true, filename: filename})
      console.log('File saved:', filename)
    })

  } catch(e) {
    res.status(500).send({success: false, message: e})
  }

})

app.get('/', (req, res) => res.send('Primitive upload server'))

app.listen(port, () => console.log(`Primitive upload server listening on port ${port}`))