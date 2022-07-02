const express = require('express');
const { decryptText, dbConnect } = require('../helpers');

//setting express
const app = express();

//mysql databse connection
dbConnect.connect(function (error) { });

//get candidate data by userId
app.post('/', function (req, res) {
    const userId = decryptText(req.body.userId);

    if (req.body.userId) {
        try {
            dbConnect.query("SELECT name, applicationNumber, email, phoneNo, whatsappNo, department, designation, titleOfTheTalk, researchTopic, Keyword1, Keyword2, Keyword3, Keyword4 FROM `CandidateInfo` WHERE userId = '" + userId + "'", function (error, results, fields) {
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
            res.status(500);
            res.send("something went wrong");
        }
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please provide all details" });
    }
});

//Update candidate data
app.post('/post', function (req, res) {
    const userId = decryptText(req.body.userId);
    const name = req.body.name;
    const applicationNumber = req.body.applicationNumber;
    const phoneNo = req.body.phoneNo;
    const whatsappNo = req.body.whatsappNo;
    const department = req.body.department;
    const designation = req.body.designation;
    const titleOfTheTalk = req.body.titleOfTheTalk;
    const researchTopic = req.body.researchTopic;
    const keyword1 = req.body.keyword1;
    const keyword2 = req.body.keyword2;
    const keyword3 = req.body.keyword3;
    const keyword4 = req.body.keyword4;

    let phoneNum;
    let whatsAppNum;

    whatsappNo ? whatsAppNum = "'" + whatsappNo + "'" : whatsAppNum = "NULL"
    phoneNo ? phoneNum = "'" + phoneNo + "'" : phoneNum = "NULL"

    if (req.body.userId) {
        try {
            dbConnect.query("UPDATE `CandidateInfo` SET `name` = '" + name + "', `applicationNumber` = '" + applicationNumber + "' , `phoneNo` = " + phoneNum + ", `whatsappNo` =" + whatsAppNum + ",  `department` = '" + department + "', `designation` = '" + designation + "', `titleOfTheTalk` = '" + titleOfTheTalk + "', `researchTopic` = '" + researchTopic + "', `keyword1` = '" + keyword1 + "', `keyword2` = '" + keyword2 + "', `keyword3` = '" + keyword3 + "', `keyword4` = '" + keyword4 + "' WHERE `CandidateInfo`.`userId` =" + userId, function (error, results, fields) {
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
            res.status(500);
            res.send({ statusCode: 500, msg: "Something went wrong" });
        }
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please provide all details" });
    }

});

//get candidate data by Email
app.post('/by-email', function (req, res) {
    const candEmail = req.body.candEmail;
    const facEmail = req.body.facEmail;

    if (candEmail && facEmail) {
        try {
            dbConnect.query("SELECT name, applicationNumber, email, phoneNo, whatsappNo, department, designation, titleOfTheTalk, researchTopic, Keyword1, Keyword2, Keyword3, Keyword4 FROM `CandidateInfo` WHERE email = '" + candEmail + "'", function (error, results, fields) {
                let toSend = {};
                if (error) {
                    res.status(500);
                    res.send({ statusCode: 500, msg: "Something went wrong" });
                } else {
                    try {
                        dbConnect.query("SELECT q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, absentOrPresent, suitable FROM `questionMarks` WHERE candEmail = '" + candEmail + "' AND facEmail = '" + facEmail + "'", function (error2, results2, fields2) {
                            let toSend = {};
                            if (error2) {
                                res.status(500);
                                res.send({ statusCode: 500, msg: "Something went wrong" });
                            } else {
                                toSend.statusCode = 200;
                                toSend.data = {
                                    candDetails: results[0] || {},
                                    candMarks: results2[0] || {},
                                };
                                res.status(toSend.statusCode);
                                res.send(toSend);
                            }
                        });
                    } catch (err) {
                        res.status(500);
                        res.send({ statusCode: 500, msg: "Something went wrong" });
                    }

                }
            });
        } catch (e) {
            res.status(500);
            res.send({ statusCode: 500, msg: "Something went wrong" });
        }
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please provide all details" });
    }
});

//get candidate data by department
app.get('/by-department', function (req, res) {
    const department = req.query.department;

    if (department) {
        try {
            const query =
                "SELECT \
                    CandidateInfo.*, \
                    COUNT(CASE WHEN questionMarks.absentOrPresent = 'Present' THEN 1 ELSE null END) AS presentCount, \
                    COUNT(CASE WHEN questionMarks.absentOrPresent = 'Absent' THEN 1 ELSE null END) AS absentCount \
                FROM CandidateInfo \
                LEFT JOIN questionMarks \
                ON CandidateInfo.email = questionMarks.candEmail \
                WHERE CandidateInfo.department = '"+ department + "' \
                GROUP BY CandidateInfo.email \
            ";

            dbConnect.query(query, function (error, results, fields) {
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
            res.status(500);
            res.send({ statusCode: 500, msg: "Something went wrong" });
        }
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please provide all details" });
    }
});

//exporting this file so that it can be used at other places
module.exports = app;