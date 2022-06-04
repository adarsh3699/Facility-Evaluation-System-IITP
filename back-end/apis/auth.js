const express = require('express');
var url = require('url')
var mysql = require('mysql');
const { sendMail, md5Hash, encryptText, decryptText } = require('../helpers');

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
                    toSend.msg = error?.sqlMessage || "query failed";
                    toSend.statusCode = 400;
                } else {
                    toSend.statusCode = 200;
                    if (results == "") {
                        const query2 = "SELECT email FROM " + emailLoopUpTable(userType) + " WHERE email = '" + email + "'";
                        dbConnect.query(query2, function (error2, results2, fields2) {
                            if (error2) {
                                toSend.msg = error2?.sqlMessage || "query failed";
                                toSend.statusCode = 400;
                            } else {
                                if (results2 == "") {
                                    toSend.statusCode = 400;
                                    toSend.msg = "Your Email is not registered in Our DataBase";
                                    toSend.data = results2;
                                    res.status(toSend.statusCode);
                                    res.send(toSend);
                                } else {
                                    dbConnect.query("INSERT INTO `users` (`email`, `password`, `userType`) VALUES ('" + email + "', '" + password + "', '" + userType + "')", function (error3, results3, fields3) {
                                        if (error3) {
                                            toSend.msg = error3?.sqlMessage || "query failed";
                                            toSend.statusCode = 400;
                                        } else {
                                            const baseUrl = 'http://' + req.headers.host;
                                            const emailValidationLink = baseUrl + "/verifyAccount?ka=" + btoa(encryptText(email));
                                            sendMail(email, "Email Verfication", "Verify your email at \n" + emailValidationLink);
                                            toSend.statusCode = 200;
                                            toSend.msg = "Sign up successful";
                                            toSend.data = emailValidationLink;
                                        }
                                        res.status(toSend.statusCode);
                                        res.send(toSend);
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
                    // toSend.data = results;
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
                    toSend.msg = error?.sqlMessage || "Something went wrong";
                    toSend.statusCode = 500;
                } else {
                    if (results == "") {
                        res.status(400);
                        res.send({ statusCode: 400, msg: "Please Check Your Login Details" });
                    } else {
                        const verifyAccount = results[0]?.isVerified;
                        if (verifyAccount === 0) {
                            const baseUrl = 'http://' + req.headers.host;
                            const emailValidationLink = baseUrl + "/verifyAccount?ka=" + btoa(encryptText(email));
                            sendMail(email, "Email Verfication", "Verify your email at \n" + emailValidationLink);
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
    
            sendMail(email, "Email Verfication", "Your OTP Is \n" + otp);
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
        res.send("something went wrong");
        console.log(e);
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
                        toSend.msg = "Forgotten password successful";
                    }
                    res.status(toSend.statusCode);
                    res.send(toSend);
                })
            } else {
                res.status(400);
                res.send({ statusCode: 400, msg: "OTP does not match" });
            }
        } else {
            res.status(400);
            res.send({ statusCode: 400, msg: "Please provide all details" });
        }
    } catch (e) {
        res.send("something went wrong");
    }
});


module.exports = app;