const qrcode = require('qrcode-terminal');
const express = require('express');
const PORT = process.env.PORT || 8080
const { Client } = require('whatsapp-web.js');

const options = [ '--disable-gpu', '--disable-setuid-sandbox', '--no-zygote' ]
const client = new Client({
  puppeteer: {
    headless: true,
    args: options
  }
});

const app = express();
app.listen(PORT, () => console.log(`Running at Port: ${PORT}`);

client.on('qr', qr => {
  qrcode.generate(qr, qrcode => {
    console.log(qrcode)
    app.get('/', (req, res) => {
      res.send(qrcode)
    })
  });
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();
