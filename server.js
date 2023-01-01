const http = require('http');
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5500;

const server = http.createServer(app);

// Node server start
function serverStart() {
  server.listen(PORT, () => console.log(`Server started on port ${PORT}...`));
}

serverStart();
