const express = require('express');
var mysql = require('mysql');
const { decryptText, dbConnect } = require('../helpers');

//setting express
const app = express();

//mysql databse connection
dbConnect.connect(function (error) { });

//get candidate data
app.get('/', function (req, res) {
    const userId = decryptText(req.query.userId);
    if (req.query.userId) {
        try {
            dbConnect.query("SELECT name, applicationNumber, email, department, designation, titleOfTheTalk, researchTopic, Keyword1, Keyword2, Keyword3, Keyword4, addedOn FROM `CandidateInfo` WHERE userId = '" + userId + "'", function (error, results, fields) {
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

//post candidate data
app.post('/', function (req, res) {
    const userId = decryptText(req.query.userId);
    const name = req.body.name;
    const applicationNumber = req.body.applicationNumber;
    const email = req.body.email;
    const department = req.body.department;
    const designation = req.body.designation;
    const titleOfTheTalk = req.body.titleOfTheTalk;
    const researchTopic = req.body.researchTopic;
    const keyword1 = req.body.keyword1;
    const keyword2 = req.body.keyword2;
    const keyword3 = req.body.keyword3;
    const keyword4 = req.body.keyword4;

    if (req.query.userId) {
        try {
            dbConnect.query("UPDATE `CandidateInfo` SET `name` = '" + name + "', `applicationNumber` = '" + applicationNumber + "', `email` = '" + email + "', `department` = '" + department + "', `designation` = '" + designation + "', `titleOfTheTalk` = '" + titleOfTheTalk + "', `researchTopic` = '" + researchTopic + "', `keyword1` = '" + keyword1 + "', `keyword2` = '" + keyword2 + "', `keyword3` = '" + keyword3 + "', `keyword4` = '" + keyword4 + "' WHERE `CandidateInfo`.`userId` =" + userId, function (error, results, fields) {
                let toSend = {};
                if (error) {
                    res.status(500);
                    res.send({ statusCode: 500, msg: "Something went wrong" });
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
        res.send({ statusCode: 400, msg: "Please provide all details" });
    }

});



//exporting this file so that it can be used at other places
module.exports = app;