const qrcode = require('qrcode');
const express = require('express');
const bp = require('body-parser');
const PORT = process.env.PORT || 8080
const { Client, Contact } = require('whatsapp-web.js');

const options = [ '--no-sandbox', '--disable-setuid-sandbox' ]
const client = new Client({
  puppeteer: {
    headless: true,
    args: options 
  }
});
const contact = new Contact()

const app = express();

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.listen(PORT, () => console.log(`Running at Port: ${PORT}`));

client.on('qr', qr => {
  qrcode.toDataURL(qr, function (err, src) {
    console.log('Done !')
    app.get('/', (req, res) => {
      res.render('qrcode', { src })
    })
  })
});

client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', message => {
  let msg
  if(!contact.isMyContact) {
    msg = 'Apakah anda kurir ?\nKetik "#ya" jika ya, "#bukan" jika bukan.\n\n"Ini adalah pesan otomatis"'
    return client.sendMessage(message.from, msg);
  }
  if (message.body === '#ya') {
    msg = 'Ketik "#paket" jika mau antar paket, "#lokasi" jika anda perlu detail lokasi'
    return client.reply(message.from, msg);
  }
  if (message.body === '#paket') {
    msg = 'Tolong taruh paketnya di kursi / depan pintu kamar kos saya (No 3)\n*NOTE:* Usahakan jangan dititipkan'
    return client.reply(message.from, msg);
  }
  if (message.body === '#lokasi') {
    msg = 'https://maps.app.goo.gl/CBAPNRqB8EtCx26E6'
    return client.reply(message.from, msg);
  }
  if (message.body === '#bukan') {
    msg = 'Oke, silahkan tuliskan pesan anda'
    return client.reply(message.from, msg);
  }
});
  
client.initialize(); 
