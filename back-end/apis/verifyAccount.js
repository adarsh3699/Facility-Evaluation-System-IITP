const express = require('express');
const { decryptText, dbConnect } = require('../helpers');

//setting express
const app = express();

//mysql databse connection
dbConnect.connect(function (error) { });


app.get('/', async function (req, res) {
    const ka = req.query.ka;
    try {
        if (ka) {
            const decodedKa = await Buffer.from(ka, 'base64').toString("utf8");
            const email = decryptText(decodedKa);
            if (!email) {
                res.send("<center><h1>Invalid email</h1></center>");
                return;
            }

            if (dbConnect.state !== "authenticated") {
                res.send("db connection failed");
                return;
            }
            
            dbConnect.query("UPDATE users SET isVerified = 1 WHERE email = '" + email + "'", function (error, results, fields) {
                if (error) {
                    res.send("<center><h1>Failed to verify account</h1></center>");
                } else {
                    res.send("<center><h1>Account successfully verified</h1></center>");
                }
            });
        } else {
            res.send("<center><h1>Invalid url</h1></center>")
        }
    } catch (e) {
        res.status(500);
        res.send("<center><h1>Something went wrong</h1></center>");
    }
});


//exporting this file so that it can be used at other places
module.exports = app;