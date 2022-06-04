const express = require('express');
var mysql = require('mysql');
const { decryptText } = require('../helpers');

//setting express
const app = express();

//mysql databse connection
const dbConnect = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: 'sir-project'
});
dbConnect.connect(function (error) { });


app.get('/', function (req, res) {
    const ka = req.query.ka;
    try {
        if (ka) {
            const decodedKa = atob(ka);
            const email = decryptText(decodedKa);
            if (!email) {
                res.send("invalid email");
                return;
            }

            if (dbConnect.state !== "authenticated") {
                res.send("db connection failed");
                return;
            }
            
            dbConnect.query("UPDATE users SET isVerified = 1 WHERE email = '" + email + "'", function (error, results, fields) {
                if (error) {
                    res.send("failed to verify account");
                } else {
                    res.send("account successfully verified");
                }
            });
        } else {
            res.send("invalid url")
        }
    } catch (e) {
        res.send("something went wrong");
    }
});


//exporting this file so that it can be used at other places
module.exports = app;