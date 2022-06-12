const qrcode = require('qrcode');
const express = require('express');
const bp = require('body-parser');
const PORT = process.env.PORT || 8080
const fs = require('fs');
const { Client, Contact, LegacySessionAuth } = require('whatsapp-web.js');

const options = [ '--no-sandbox', '--disable-setuid-sandbox' ]
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

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if(fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
let client
if (sessionData) {
    client = new Client({
        puppeteer: {
            args: options 
        },
        authStrategy: new LegacySessionAuth({
            session: sessionData
        })
    });
} else {
    client = new Client({
        puppeteer: {
            args: options 
        }
    });
}

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    sessionData = session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), (err) => {
        if (err) {
            console.error(err);
        }
    });
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
