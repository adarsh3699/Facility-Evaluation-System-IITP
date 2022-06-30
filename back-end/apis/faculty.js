const express = require('express');
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
            res.status(500);
            res.send({ statusCode: 500, msg: "Something went wrong" });
        }
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please submit UserId" });
    }

});

app.post('/confirm', function (req, res) {
    const userId = decryptText(req.body.userId);

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
            res.status(500);
            res.send({ statusCode: 500, msg: "Something went wrong" });
        }
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please submit UserId" });
    }

});

//marks submit
app.post('/submit-marks', function (req, res) {
    const candEmail = req.body.candEmail;
    const facName = req.body.facName;
    const facEmail = req.body.facEmail;
    const qstnsMarks = req.body.qstnsMarks;
    const suitable = req.body.suitable;
    const absentOrPresent = req.body.absentOrPresent;

console.log(candEmail , facEmail , absentOrPresent);
    if (candEmail && facEmail && absentOrPresent) {
        try {
            dbConnect.query("SELECT * FROM `questionMarks` WHERE candEmail = '" + candEmail + "' AND facEmail = '" + facEmail + "'", function (error, results, fields) {
                let toSend = {};
                if (error) {
                    res.status(500);
                    res.send({ statusCode: 500, msg: "Something went wrong" });
                } else {

                    if (results == "") {
                        try {
                            let query = "";
                            if (absentOrPresent === "Present" && qstnsMarks && suitable) {
                                let qstnsMarksQuery = '';
                                for (let i = 0; i < qstnsMarks.length; i++) {
                                    const thisQstnMark = (qstnsMarks[i]).trim();
                                    if (!thisQstnMark) {
                                        res.status(400);
                                        res.send({ statusCode: 400, msg: "Please submit marks for all questions" });
                                        return;
                                    }
                                    qstnsMarksQuery += (thisQstnMark + "', '");
                                    query = "INSERT INTO questionMarks \
                                    (`candEmail`, `facName`, `facEmail`, `q1`, `q2`, `q3`, `q4`, `q5`, `q6`, `q7`, `q8`, `q9`, `q10`, `q11`, `q12`, `suitable`, absentOrPresent) \
                                    VALUES ('" + candEmail + "', '" + facName + "', '" + facEmail + "', '" + qstnsMarksQuery + suitable + "', '" + absentOrPresent + "')";
                                }
                            } else if (absentOrPresent === "Absent") {
                                console.log("else");
                                query = "INSERT INTO questionMarks \
                                (`candEmail`, `facName`, `facEmail`, absentOrPresent) \
                                VALUES ('" + candEmail + "', '" + facName + "', '" + facEmail + "', '" + absentOrPresent + "')";
                            }

                            console.log(query);
                            dbConnect.query(query, function (error2, results2, fields2) {
                                if (error2) {
                                    res.status(500);
                                    res.send({ statusCode: 500, msg: "Something went wrong" });
                                    console.log(error2);
                                } else {
                                    toSend.statusCode = 200;
                                    toSend.msg = "Marks submitted successfully"

                                    res.status(toSend.statusCode);
                                    res.send(toSend);
                                }
                            });
                        } catch (err) {
                            res.status(500);
                            res.send({ statusCode: 500, msg: "Something went wrong" });
                        }

                    } else {
                        toSend.statusCode = 400;
                        toSend.msg = "You can only Submit once"
                        res.status(toSend.statusCode);
                        res.send(toSend);
                    }
                }
            });
        } catch (e) {
            res.status(500);
            res.send({ statusCode: 500, msg: "Something went wrong" });
        }
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please submit all fields" });
    }

});

//exporting this file so that it can be used at other places
module.exports = app;