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

//get candidate data
app.get('/', function (req, res) {
    const userId = decryptText(req.query.userId);
    if (req.query.userId) {
        try {
            dbConnect.query("SELECT * FROM `CandidateInfo` WHERE userId = '" + userId + "'", function (error, results, fields) {
                let toSend = {};
                if (error) {
                    res.status(500);
                    res.send({ statusCode: 500, msg: "Something went wrong" });
                } else {
                    toSend.statusCode = 200;
                    toSend.data = results;
    
                    res.status(toSend.statusCode);
                    res.send(toSend);
                }
            });
        } catch (e) {
            res.send("something went wrong");
        }
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please provide all details" });
    }
    
});


//exporting this file so that it can be used at other places
module.exports = app;