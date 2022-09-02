var mysql = require('mysql');
const { enc, AES, MD5 } = require("crypto-js");
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

//mysql databse connection
const dbConnect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'faculty-recruit-iitp'
});

const encryptionKey = "";

const accountTitle = "";

const CLIENT_ID = '';
const CLEINT_SECRET = '';
const REDIRECT_URI = '';
const REFRESH_TOKEN = '';

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLEINT_SECRET,
    REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


function encryptText(text) {
    try {
        const encryptedValue = AES.encrypt(text, encryptionKey).toString();
        return encryptedValue;
    } catch {
        return null;
    }
}

function decryptText(enryptedValue) {
    let value = null;
    try {
        const decrypted = AES.decrypt(enryptedValue, encryptionKey);
        value = enc.Utf8.stringify(decrypted);
    } catch {
        return null;
    }

    return value;
}

function md5Hash(text) {
    try {
        return MD5(text).toString();
    } catch {
        return null;
    }
}

function runQuery(dbConnect, query, res, isSpecialCase) {
    try {
        if (dbConnect.state !== "authenticated") {
            res.status(500);
            res.send({ statusCode: 500, msg: "db connection failed" });
            return;
        }

        dbConnect.query(query, function (error, results, fields) {
            let toSend = {};
            if (error) {
                toSend.msg = error?.sqlMessage || "query failed";
                toSend.statusCode = 400;
            } else {
                if (isSpecialCase) {
                    toSend.statusCode = 200;
                    toSend.data = results;

                    if (results.length == 0) {
                        toSend.msg = "Your Email is not registered in Our DataBase";
                    } else {
                        toSend.msg = "success";
                    }
                } else {
                    toSend.msg = "success";
                    toSend.statusCode = 200;
                    toSend.data = results;
                }
            }
            res.status(toSend.statusCode);
            res.send(toSend);
        });
    } catch (err) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Something went wrong", error: err.message });
    }
}

async function sendMail(mailTo, mailSubject, title, object) {
    try {
        //mailing to the new user
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: "<email>",
                clientId: CLIENT_ID,
                clientSecret: CLEINT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        const mailOptions = {
            from: accountTitle + "<email>",
            to: mailTo,
            subject: mailSubject,
            text: title + "/n" + object,
            html: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><style>#wrapper {background-color: rgb(32, 32, 32);text-align: center;min-height: 50vh;padding: 50px;}#title {color: lightgray;font-size: 30px;font-weight: bold;letter-spacing: 1px;Padding-top: 5vh;margin-bottom: 20px;}#object {background-color: #f1f1f1;width: fit-content;margin: auto;margin: 20px auto;color: black;padding: 15px 25px;font-size: 20px;}@media only screen and (max-width: 768px) {#wrapper {padding: unset;}}</style></head><body id="wrapper"><div id="title">' + title + '</div><div id="object">' + object + '</div></body></html>',
        }

        const result = await transport.sendMail(mailOptions);

        console.log('Email sent...', result);
        return result;
    } catch (e) {
        console.log("Fail to send mail ", e)
    }
}

module.exports = { dbConnect, encryptText, decryptText, md5Hash, runQuery, sendMail };