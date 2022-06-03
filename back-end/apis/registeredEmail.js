const express = require('express');
var mysql = require('mysql');
const { runQuery } = require('../helpers');

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

app.get('/candidate', function (req, res) {
    const email = req.query.email;
    const password = req.query.password;
    try {
        if (email && password) {
            if (dbConnect.state !== "authenticated") {
                res.status(500);
                res.send({ statusCode: 500, msg: "db connection failed" });
                return;
            }
            dbConnect.query("SELECT * FROM candidateLoginData WHERE email = '" + email + "'", function (error, results, fields) {
                let toSend = {};
                if (error) {
                    toSend.msg = error?.sqlMessage || "query failed";
                    toSend.statusCode = 400;
                } else {
                    toSend.statusCode = 200;
                    if (results == "") {
                        dbConnect.query("SELECT email FROM candidateRegisteredEmail WHERE email = '" + email + "'", function (error2, results2, fields2) {
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
                                    dbConnect.query("INSERT INTO `candidateLoginData` (`email`, `password`) VALUES ('" + email + "', '" + password + "')", function (error3, results3, fields3) {
                                        if (error3) {
                                            toSend.msg = error3?.sqlMessage || "query failed";
                                            toSend.statusCode = 400;
                                        } else {
                                            toSend.statusCode = 200;
                                            toSend.msg = "sign up successful";
                                            toSend.data = results3;
                                        }
                                        res.status(toSend.statusCode);
                                        res.send(toSend);
                                    });
                                }
                            }
                        });
                    } else {
                        toSend.msg = "Account already exists";
                        res.status(toSend.statusCode);
                        res.send(toSend);
                    }
                    toSend.data = results;
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


//for faculty
app.get('/faculty', function (req, res) {
    const email = req.query.email;
    const password = req.query.password;
    try {
        if (email && password) {
            if (dbConnect.state !== "authenticated") {
                res.status(500);
                res.send({ statusCode: 500, msg: "db connection failed" });
                return;
            }
            dbConnect.query("SELECT * FROM facultyLoginData WHERE email = '" + email + "'", function (error, results, fields) {
                let toSend = {};
                if (error) {
                    toSend.msg = error?.sqlMessage || "query failed";
                    toSend.statusCode = 400;
                } else {
                    toSend.statusCode = 200;
                    if (results == "") {
                        dbConnect.query("SELECT email FROM facultyRegisteredEmail WHERE email = '" + email + "'", function (error2, results2, fields2) {
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
                                    dbConnect.query("INSERT INTO `facultyLoginData` (`email`, `password`) VALUES ('" + email + "', '" + password + "')", function (error3, results3, fields3) {
                                        if (error3) {
                                            toSend.msg = error3?.sqlMessage || "query failed";
                                            toSend.statusCode = 400;
                                        } else {
                                            toSend.statusCode = 200;
                                            toSend.msg = "sign up successful";
                                            toSend.data = results3;
                                        }
                                        res.status(toSend.statusCode);
                                        res.send(toSend);
                                    });
                                }
                            }
                        });
                    } else {
                        toSend.msg = "Account already exists";
                        res.status(toSend.statusCode);
                        res.send(toSend);
                    }
                    toSend.data = results;
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

//exporting this file so that it can be used at other places
module.exports = app;