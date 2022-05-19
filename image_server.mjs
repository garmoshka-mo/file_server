import express from 'express'
import timeout from 'connect-timeout'
import sharp from 'sharp'
import fetch from "node-fetch"

const app = express()
const port = 3000

app.use(express.static('image_server'))
app.use(timeout(20 * 60 * 1000)) // 20 minutes

app.get('/thumbnail/:file', async (req, res) => {

  const fileRes = await fetch(`http://sand.zaloop.us/${req.params.file}`);
  const resBuffer = await fileRes.buffer();

  sharp(resBuffer)
    .resize(150)
    .jpeg({ mozjpeg: true })
    .toBuffer()
    .then(data => res.type('jpeg').send(data))

  }
)

app.listen(port, () => console.log(`📡 Upload server listening on port ${port}`))
