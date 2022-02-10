const express = require('express');
const app = express();

const nodeMailer = require('nodemailer');

// port 5000 for dev
const PORT = process.env.PORT || 5000;

const { google } = require('googleapis');

require('dotenv').config();

const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: process.env.REF_TOKEN });

// Middleware

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/', async (req, res) => {
    console.log(req.body);

    const accessToken = await oAuth2Client.getAccessToken(); 

    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: process.env.EMAIL,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REF_TOKEN,
            accessToken: accessToken
        }
    });

    const mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: `Message from ${req.body.email} - ${req.body.subject}`,
        text: req.body.message
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.send('error');
        }

        console.log('Email sent ' + info.response);
        res.send('success');
    });
});

app.listen(PORT, () => {
    console.log(`Server running http://localhost:${PORT}/`);
});