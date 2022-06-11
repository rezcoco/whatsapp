const qrcode = require('qrcode');
const express = require('express');
const PORT = process.env.PORT || 8080
const { Client } = require('whatsapp-web.js');

const options = [ '--no-sandbox', '--disable-setuid-sandbox' ]
const client = new Client({
  puppeteer: {
    headless: true,
    args: options
  }
});

const app = express();
app.listen(PORT, () => console.log(`Running at Port: ${PORT}`));

client.on('qr', qr => {
  qrcode.toDataURL(qr, function (err, url) {
    console.log(url)
    app.get('/', (req, res) => {
      res.send(qrcode)
    })
  })
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.initialize();
