const express = require('express');
const app = express();
const https = require('https');
const request = require('request');
require('dotenv').config();

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/index.html`);
});

app.post('/', function (req, res) {
  const fullName = req.body.fullName;
  const email = req.body.email;
  const message = req.body.message;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fullName,
          MSG: message,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us21.api.mailchimp.com/3.0/lists/f49c7c9c22';
  const options = {
    method: 'POST',
    auth: process.env.API_KEY,
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(`${__dirname}/success.html`);
    } else {
      res.sendFile(`${__dirname}/failure.html`);
    }

    response.on('data', function (data) {
      // console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post('/failure', function (req, res) {
  res.redirect('/');
});

app.listen(3000, function () {
  console.log('Server is running on port 3000');
});
