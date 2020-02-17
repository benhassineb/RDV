const fetch = require('node-fetch');
const nodemailer = require('nodemailer');
const open = require('opn');
const fs = require('fs');
const args = process.argv.slice(2);
// print process.argv
args.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
});
const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

const log = (text) => {
    let message=text + ',' + new Date().toISOString();
    fs.appendFile('log.txt',message + ',\r\n', (err) => {
        if (err) throw err;
        console.log(message);
    });
}



const getMailOptions = (body) => {
    // Use of Date.now() function 
    let d = Date(Date.now());
    // Converting the number of millisecond in date string 
    let a = d.toString()
    return {
        from: args[0],
        to: args[2],
        subject: 'Available Now -' + a,
        text: body
    }
};

let headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    'Upgrade-Insecure-Requests': '1',
    'Cookie': 'eZSESSID=4il08qi1eiij28l1e1f6ro7of0'
}
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: args[0],
        pass: args[1]
    }
});

function query() {
    return fetch('http://www.hauts-de-seine.gouv.fr/booking/create/13525/0', {
        method: 'POST',
        body: 'condition=on&nextButton=Effectuer+une+demande+de+rendez-vous',
        headers: headers
    }).then(response => {
        if (!response.ok) {
            log('KO');
            throw 'response was KO';
        }
        return response;
    })
        .then(res => res.text())
        .then(html => {
            let index = html.indexOf("Il n'existe plus de plage horaire libre pour votre demande de rendez-vous. Veuillez recommencer ultérieurement.");

            if (index === -1) {
                //sendMail(getMailOptions(html));
                log('Open');
                open('http://www.hauts-de-seine.gouv.fr/booking/create/13525', { app: 'chrome' });
                open('https://youtu.be/frhTXekMSaQ', { app: 'firefox' });

            }
            else {
                log('Closed');
            }
        }).catch(err => console.log(err));
}




const sendMail = (mailOptions) => {
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}
setInterval(function () { query(); }, 60000);
