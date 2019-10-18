const fetch = require('node-fetch');
const nodemailer = require('nodemailer');

const getMailOptions = (body) => {
    return {
        from: 'japimeys@gmail.com',
        to: 'b.benhassine@hotmail.com',
        subject: 'Available Now -' + Date.now(),
        text: body
    }
};

let headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Upgrade-Insecure-Requests': '1',
    'Cookie': 'eZSESSID=4il08qi1eiij28l1e1f6ro7of0'
}

fetch('http://www.hauts-de-seine.gouv.fr/booking/create/13525/0', {
        method: 'POST',
        body: 'condition=on&nextButton=Effectuer+une+demande+de+rendez-vous',
        headers: headers
    })
    .then(res => res.text())
    .then(html => {
        let index = html.indexOf("Il n'existe plus de plage horaire libre pour votre demande de rendez-vous. Veuillez recommencer ultérieurement.");
        if (index !== -1) {
            let mailOptions = getMailOptions(html);
            sendMail(mailOptions);
        }

    }).catch(err => console.log(err));


let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Passw',
        pass: 'dzzdzdz!'
    }
});

const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}