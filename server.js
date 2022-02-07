const express = require('express');
const app = express();

const nodeMailer = require('nodemailer');

// port 5000 for dev
const PORT = process.env.PORT || 5000;

require('dotenv').config();

// Middleware

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/', (req, res) => {
    console.log(req.body);

    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
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