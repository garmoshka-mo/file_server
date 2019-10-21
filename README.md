# Simple upload server

### Configuration

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
