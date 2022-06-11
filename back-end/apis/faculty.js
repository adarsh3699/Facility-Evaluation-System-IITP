const express = require('express');
// var mysql = require('mysql');
const { decryptText, dbConnect } = require('../helpers');

//setting express
const app = express();

//mysql databse connection
dbConnect.connect(function (error) { });

let fac = "";
for (let i = 1; i <= 40; i++) {
    if (i == 1) {
        fac = fac + "f" + i
    }
    fac = fac + ", f" + i
}

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
                    const email = results[0].email;

                    const query = " SELECT \
                                    CandidateInfo.name, CandidateInfo.email, CandidateInfo.department, CandidateInfo.applicationNumber, \
                                    questionMarks.id AS questionMarksId \
                                    FROM CandidateInfo \
                                    LEFT JOIN questionMarks \
                                    ON questionMarks.facEmail = '" + email + "' \
                                    AND questionMarks.candEmail = CandidateInfo.email \
                                    WHERE '" + email + "' IN (" + fac + ") \
                                    ";

                    dbConnect.query(query, function (error2, results2, fields2) {
                        if (error2) {
                            res.status(500);
                            res.send({ statusCode: 500, msg: "Something went wrong" });
                        } else {
                            toSend.statusCode = 200;
                            toSend.data = {
                                facDetails: results[0] || {},
                                candDetails: results2 || [],
                            };
                            res.status(toSend.statusCode);
                            res.send(toSend);
                        }
                    });
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


app.post('/confirm', function (req, res) {
    const userId = decryptText(req.body.userId);
    // const userId = req.body.userId;

    if (userId) {
        try {
            dbConnect.query("UPDATE `facultyInfo` SET `isVerified` = '1' WHERE userId = " + userId, function (error, results, fields) {
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

//marks submit
app.post('/submit-marks', function (req, res) {
    const candEmail = req.body.candEmail;
    const facEmail = req.body.facEmail;
    const ques1 = req.body.ques1;
    const ques2 = req.body.ques2;
    const ques3 = req.body.ques3;
    const ques4 = req.body.ques4;
    const ques5 = req.body.ques5;
    const ques6 = req.body.ques6;
    const ques7 = req.body.ques7;
    const ques8 = req.body.ques8;
    const ques9 = req.body.ques9;
    const ques10 = req.body.ques10;
    const ques11 = req.body.ques11;
    const ques12 = req.body.ques12;
    const suitable = req.body.suitable;


    if (candEmail && facEmail) {
        try {


            dbConnect.query("SELECT * FROM `questionMarks` WHERE candEmail = '" + candEmail + "' AND facEmail = '" + facEmail + "'", function (error, results, fields) {
                let toSend = {};
                if (error) {
                    res.status(500);
                    res.send({ statusCode: 500, msg: "Something went wrong" });
                    console.log(error);
                } else {

                    if (results = "") {
                        res.status(toSend.statusCode);
                        res.send(toSend);
                        dbConnect.query("INSERT INTO `questionMarks` (`candEmail`, `facEmail`, `q1`, `q2`, `q3`, `q4`, `q5`, `q6`, `q7`, `q8`, `q9`, `q10`, `q11`, `q12`, `suitable`) VALUES ('" + candEmail + "', '" + facEmail + "', '" + ques1 + "', '" + ques2 + "', '" + ques3 + "', '" + ques4 + "', '" + ques5 + "', '" + ques6 + "', '" + ques7 + "', '" + ques8 + "', '" + ques9 + "', '" + ques10 + "', '" + ques11 + "', '" + ques12 + "', '" + suitable + "')", function (error2, results2, fields2) {
                            let toSend = {};
                            if (error) {
                                res.status(500);
                                res.send({ statusCode: 500, msg: "Something went wrong" });
                                console.log(error);
                            } else {
                                toSend.statusCode = 200;
                                toSend.msg = "Submit Successfully"

                                res.status(toSend.statusCode);
                                res.send(toSend);
                            }
                        });
                    } else {
                        toSend.statusCode = 200;
                        toSend.msg = "You can only Submit once"
                        res.status(toSend.statusCode);
                        res.send(toSend);
                    }
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