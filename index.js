const qrcode = require('qrcode');
const express = require('express');
const bp = require('body-parser');
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
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.listen(PORT, () => console.log(`Running at Port: ${PORT}`));

client.on('qr', qr => {
  qrcode.toDataURL(qr, function (err, src) {
    console.log('Done !')
    app.get('/', (req, res) => {
      res.send({ src })
    })
  })
});

client.on('ready', () => {
  console.log('Client is ready!');
});
 
client.initialize();
