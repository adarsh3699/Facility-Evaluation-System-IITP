const { enc, AES, MD5 } = require("crypto-js");

const encryptionKey = "bhemu_is_kutta";

function encryptText(text) {
    try {
        const encryptedValue = AES.encrypt(text, encryptionKey).toString();
        return encryptedValue;
    } catch {
        return null;
    }
}

function decryptText(enryptedValue) {
    let value = null;
    try {
        const decrypted = AES.decrypt(enryptedValue, encryptionKey);
        value = enc.Utf8.stringify(decrypted);
    } catch {
        return null;
    }

    return value;
}

function md5Hash(text) {
    try {
        return MD5(text).toString();
    } catch {
        return null;
    }
}

function runQuery(dbConnect, query, res, isSpecialCase) {
    try {
        if (dbConnect.state !== "authenticated") {
            res.status(500);
            res.send({statusCode: 500, msg: "db connection failed"});
            return;
        }

        dbConnect.query(query, function (error, results, fields) {
            let toSend = {};
            if (error) {
                toSend.msg = error?.sqlMessage || "query failed";
                toSend.statusCode = 400; 
            } else {
                if (isSpecialCase) {
                    toSend.statusCode = 200;
                    toSend.data = results;
                    
                    if (results.length == 0){
                        toSend.msg = "Your Email is not registered in Our DataBase";
                    } else {
                        toSend.msg = "success";
                    }
                } else {
                    toSend.msg = "success";
                    toSend.statusCode = 200;
                    toSend.data = results;
                }
            }
            res.status(toSend.statusCode);
            res.send(toSend);
        });
    } catch (err) {
        res.status(500);
        res.send({statusCode: 500, msg: "Something went wrong", error: err.message});
    }
}

module.exports = { encryptText, decryptText, md5Hash, runQuery };