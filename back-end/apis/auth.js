const express = require('express');
var url = require('url')
const { sendMail, md5Hash, encryptText, decryptText, dbConnect } = require('../helpers');

//setting express
const app = express();

//mysql databse connection
dbConnect.connect(function (error) { });

function emailLoopUpTable(userType) {
    return userType == 1 ? "facultyRegisteredEmail" : "candidateRegisteredEmail";
}

app.post('/register', function (req, res) {
    const email = req.body.email;
    const password = md5Hash(req.body.password);
    const userType = req.body.userType;

    try {
        if (email && req.body.password && userType) {
            if (dbConnect.state !== "authenticated") {
                res.status(500);
                res.send({ statusCode: 500, msg: "db connection failed" });
                return;
            }
            dbConnect.query("SELECT * FROM users WHERE email = '" + email + "'", function (error, results, fields) {
                let toSend = {};
                if (error) {
                    res.status(500);
                    res.send({ statusCode: 500, msg: error?.sqlMessage || "query failed" });
                } else {
                    toSend.statusCode = 200;
                    if (results == "") {
                        const query2 = "SELECT email FROM " + emailLoopUpTable(userType) + " WHERE email = '" + email + "'";
                        dbConnect.query(query2, function (error2, results2, fields2) {
                            if (error2) {
                                res.status(500);
                                res.send({ statusCode: 500, msg: error2?.sqlMessage || "query failed" });
                            } else {
                                if (results2 == "") {
                                    toSend.statusCode = 400;
                                    toSend.msg = "Your Email is not registered in Our DataBase";
                                    res.status(toSend.statusCode);
                                    res.send(toSend);
                                } else {

                                    dbConnect.query("INSERT INTO `users` (`email`, `password`, `userType`) VALUES ('" + email + "', '" + password + "', '" + userType + "')", function (error3, results3, fields3) {
                                        if (error3) {
                                            res.status(500);
                                            res.send({ statusCode: 500, msg: error3?.sqlMessage || "query failed" });
                                        } else {
                                            const baseUrl = 'http://' + req.headers.host;
                                            const emailValidationLink = baseUrl + "/verifyAccount?ka=" + btoa(encryptText(email));
                                            sendMail(email, "Email Verfication", "Verify your email at", emailValidationLink);

                                            const insertId = results3.insertId;

                                            if (userType == 2) {
                                                dbConnect.query("INSERT INTO `CandidateInfo` (`userId`, `name`, `applicationNumber`, `email`, `department`, `designation`, `titleOfTheTalk`, `researchTopic`, `Keyword1`, `Keyword2`, `Keyword3`, `Keyword4`) VALUES ('" + userType + "', '', '', '" + email + "', '', '', '', '', '', '', '', '')", function (error4, results4, fields4) {
                                                    if (error4) {
                                                        res.status(500);
                                                        res.send({ statusCode: 500, msg: error4?.sqlMessage || "query failed" });
                                                    } else {
                                                        toSend.statusCode = 200;
                                                        toSend.msg = "Sign up successful";
                                                    }
                                                    res.status(toSend.statusCode);
                                                    res.send(toSend);
                                                });
                                            } else if (userType == 1) {
                                                res.status(toSend.statusCode);
                                                toSend.statusCode = 200;

                                                toSend.msg = "Sign up successful";
                                                res.send(toSend);
                                            } else {
                                                res.status(400);
                                                res.send({ statusCode: 400, msg: "Wrong userType" });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        toSend.statusCode = 400;
                        toSend.msg = "Account already exists";
                        res.status(toSend.statusCode);
                        res.send(toSend);
                    }
                }
            });
        } else {
            res.status(400);
            res.send({ statusCode: 400, msg: "Please Provide all details" });
        }
    } catch (err) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Something went wrong", error: err.message });
    }
});

app.post('/login', function (req, res) {
    const email = req.body.email;
    const password = md5Hash(req.body.password);
    const userType = req.body.userType;

    try {
        if (email && req.body.password && userType) {
            if (dbConnect.state !== "authenticated") {
                res.status(500);
                res.send({ statusCode: 500, msg: "db connection failed" });
                return;
            }
            dbConnect.query("SELECT id, email, isVerified FROM users WHERE email = '" + email + "' AND password = '" + password + "' AND userType ='" + userType + "'", function (error, results, fields) {
                let toSend = {};
                if (error) {
                    res.status(500);
                    res.send({ statusCode: 500, msg: "Something went wrong" });
                } else {
                    if (results == "") {
                        res.status(400);
                        res.send({ statusCode: 400, msg: "Please Check Your Login Details" });
                    } else {
                        const verifyAccount = results[0]?.isVerified;
                        if (verifyAccount === 0) {
                            
                            const baseUrl = 'http://' + req.headers.host;
                            const emailValidationLink = baseUrl + "/verifyAccount?ka=" + btoa(encryptText(email));
                            sendMail(email, "Email Verfication", "Verify your email at", emailValidationLink);
                            
                            toSend.statusCode = 400;
                            toSend.msg = "Your account is not Verified please check your mail for verification";
                        } else {
                            toSend.statusCode = 200;
                            toSend.msg = "Login successful";
                            toSend.data = {
                                id: encryptText(results[0]?.id + ""),
                                userType: md5Hash(userType),
                            }
                        }

                        res.status(toSend.statusCode);
                        res.send(toSend);
                    }
                }
            })

        } else {
            res.status(400);
            res.send({ statusCode: 400, msg: "Please Provide all details" });
        }
    } catch (err) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Something went wrong", error: err.message });
    }
});

app.post('/forget-password', function (req, res) {
    const email = req.body.email;
    try {
        if (email) {
            let toSend = {}
            const otp = Math.floor(1000 + Math.random() * 9000);

            sendMail(email, "Forgot Password", "Your OTP is", otp);
            toSend.statusCode = 200;
            toSend.msg = "OTP sent successfully";
            toSend.otp = encryptText(otp + "")

            res.status(toSend.statusCode);
            res.send(toSend);
        } else {
            res.status(400);
            res.send({ statusCode: 400, msg: "Please Enter Your Email" });
        }

    } catch (e) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Something went wrong", error: err.message });
    }
});

app.post('/change-password', function (req, res) {
    const email = req.body.email;
    const password = md5Hash(req.body.password);
    const otp = req.body.otp;
    const encryptedOtp = decryptText(req.body.encryptedOtp);

    try {
        if (email && req.body.password && otp && req.body.encryptedOtp) {
            if (otp == encryptedOtp) {
                if (dbConnect.state !== "authenticated") {
                    res.status(500);
                    res.send({ statusCode: 500, msg: "db connection failed" });
                    return;
                }
                dbConnect.query("UPDATE users SET `password` = '" + password + "' WHERE email = '" + email + "'", function (error, results, fields) {
                    let toSend = {};
                    if (error) {
                        toSend.msg = error?.sqlMessage || "Something went wrong";
                        toSend.statusCode = 500;
                    } else {
                        toSend.statusCode = 200;
                        toSend.msg = "Password updated successfully";
                    }
                    res.status(toSend.statusCode);
                    res.send(toSend);
                })
            } else {
                res.status(400);
                res.send({ statusCode: 400, msg: "OTP do not match" });
            }
        } else {
            res.status(400);
            res.send({ statusCode: 400, msg: "Please provide all details" });
        }
    } catch (e) {
        res.status(500);
        res.send({ statusCode: 500, msg: "Something went wrong", error: err.message });
    }
});


module.exports = app;