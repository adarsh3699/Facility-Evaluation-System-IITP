const express = require('express');
// var mysql = require('mysql');
const { decryptText, dbConnect } = require('../helpers');

//setting express
const app = express();

//mysql databse connection
dbConnect.connect(function (error) { });

//get Faculty data
app.post('/', function (req, res) {
    const userId = decryptText(req.body.userId);

    if (userId) {
        try {
            dbConnect.query("SELECT name, email, department, isVerified FROM `facultyInfo` WHERE userId = " + userId, function (error, results, fields) {
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
        res.send({ statusCode: 400, msg: "Please UserId or valid UserId" });
    }

});

//confirm faculty data
app.post('/confirm', function (req, res) {
    const userId = decryptText(req.body.userId);
    // const userId = req.body.userId;

    if (userId) {
        try {
            dbConnect.query("UPDATE `facultyInfo` SET `isVerified` = '1' WHERE userId = " + userId , function (error, results, fields) {
                let toSend = {};
                if (error) {
                    res.status(500);
                    res.send({ statusCode: 500, msg: "Something went wrong" });
                    console.log(error);
                } else {
                    toSend.statusCode = 200;
                    toSend.msg = "Submit Successfully"
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
        res.send({ statusCode: 400, msg: "Please UserId or valid UserId" });
    }

});

//exporting this file so that it can be used at other places
module.exports = app;