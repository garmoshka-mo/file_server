# Simple upload server

### Prerequisites

* node (tested on node v12)
* yarn

### Setup

```
yarn

echo '
PORT=8080
UPLOADS_PATH=uploads/
POST_PROCESSING_CMD=php ./post_processor_example.php
' > .env
```

### Launch server

`node server.js`

To keep alive forever:
```
yarn global add forever forever-service
sudo forever-service install upload_server -s server.js
sudo service upload_server start
```
