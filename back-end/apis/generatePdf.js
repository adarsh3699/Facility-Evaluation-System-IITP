const express = require('express');
const { dbConnect } = require('../helpers');
const fs = require("fs");
const PDFDocument = require("pdfkit-table");
const app = express();

//mysql databse connection
dbConnect.connect(function (error) { });

let fac = "";
for (let i = 1; i <= 40; i++) {
    if (i == 1) {
        fac = fac + "CandidateInfo.f" + i;
        continue;
    }
    fac = fac + ", CandidateInfo.f" + i;
}

// generate summary-sheet PDF 
app.get('/summary-sheet/:dept', async (req, res) => {
    const dept = req.params.dept.split("-")[0]; //studId_tableName

    if (dept) {
        const query = " SELECT DISTINCT \
                    CandidateInfo.name, \
                    " + fac + ", \
                    COUNT(questionMarks.id) AS actualFac, \
                    COUNT(CASE WHEN questionMarks.suitable = 'Yes' THEN 1 ELSE null END) AS suitableYCount, \
                    COUNT(CASE WHEN questionMarks.suitable = 'No' THEN 1 ELSE null END) AS suitableNCount, \
                    COUNT(CASE WHEN questionMarks.absentOrPresent = 'Present' THEN 1 ELSE null END) AS presentCount, \
                    COUNT(CASE WHEN questionMarks.absentOrPresent = 'Absent' THEN 1 ELSE null END) AS absentCount \
                    FROM CandidateInfo \
                    LEFT JOIN questionMarks \
                    ON CandidateInfo.email = questionMarks.candEmail \
                    WHERE CandidateInfo.department = '" + dept + "' \
                    GROUP BY CandidateInfo.email \
                "

        dbConnect.query(query, async function (error, results, fields) {
            if (error) {
                res.status(500);
                res.send({ statusCode: 500, msg: "Something went wrong" });
            } else {
                const tableRows = []
                for (let i = 0; i < results.length; i++) {
                    const thisItem = results[i];
                    const presentCount = parseInt(thisItem["presentCount"]);
                    const absentCount = parseInt(thisItem["absentCount"]);

                    let totalFac = 0;
                    Object.keys(thisItem).forEach((key) => { if (/^f[0-9]+$/.test(key) && thisItem[key]) totalFac++ })

                    const row = [];
                    row.push(thisItem.name);
                    row.push(totalFac);
                    row.push(thisItem.actualFac);
                    row.push(thisItem.suitableYCount);
                    row.push(thisItem.suitableNCount);
                    row.push(presentCount >= absentCount ? "Present" : "Absent");

                    tableRows.push(row);
                }

                const table = {
                    title: "Summary Sheet",
                    subtitle: " ",
                    headers: ["Name", "Total Fac", "Actual Fac", "Suitable-Yes", "Suitable-Yes", "Attendance"],
                    rows: tableRows
                };

                // init document
                let doc = new PDFDocument({ margin: 30, size: 'A4' });
                // A4 595.28 x 841.89 (portrait) (about width sizes)
                await doc.table(table, { width: 535 });
                doc.pipe(fs.createWriteStream("pdfs/" + dept + "-Summary.pdf"));
                doc.pipe(res);
                doc.end();
            }
        });
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please Enter Department" });
    }
});

// generate detail-sheet PDF 
app.get('/detail-sheet/:fileName', async (req, res) => {
    const fileNameArr = req.params.fileName.split("-");
    const name = fileNameArr[0];
    const dept = fileNameArr[1];
    const phoneNo = fileNameArr[2];

    const decodedDataStr = Buffer.from(req.query.data, 'base64').toString("utf8"); //atob(req.query.data);
    const decodedData = JSON.parse(decodedDataStr);
    const { email = "", titleOfTheTalk = "", designation = "", keyword1 = "", keyword2 = "", keyword3 = "", keyword4 = "", whatsappNo = "", facToReviewCount } = decodedData || {};

    if (email) {
        let qSumStr = Array.from(Array(12)).reduce((acc, item, i) => ( acc + "q" + (i+1) + "+"), "");
        qSumStr = qSumStr.substring(0, qSumStr.length-1);

        let qStr = Array.from(Array(12)).reduce((acc, item, i) => ( acc + "q" + (i+1) + ","), "");

        const query = " SELECT facName, absentOrPresent, " + qStr + " suitable, (" + qSumStr  + ") AS total FROM `questionMarks` WHERE candEmail = '" + email + "' ORDER BY facName";

        dbConnect.query(query, async function (error, results, fields) {
            if (error) {
                res.status(500);
                res.send({ statusCode: 500, msg: "Something went wrong" });
            } else {
                let totalYesCount = 0;
                let totalNoCount = 0;
                const facTableRows = results.map((item)=> {
                    item.suitable === "Yes" ? totalYesCount++ : item.suitable === "No" ? totalNoCount++ : "";
                    return Object.values(item).map((thisVal) => (thisVal || "null") )
                })

                const candDetailsTable = {
                    title: "Candidate Details",
                    headers: ["Name", name],
                    rows: [
                        ["Email", email],
                        ["Phone No.", phoneNo],
                        ["Whatsapp No.", whatsappNo],
                        ["Title", titleOfTheTalk],
                        ["Department", dept],
                        ["Designation", designation],
                        ["Keyword1", keyword1],
                        ["Keyword2", keyword2],
                        ["Keyword3", keyword3],
                        ["Keyword4", keyword4]
                    ]
                };

                const detailSheetTable = {
                    title: "\n\n\nDetails Sheet",
                    headers: ["FacName", "Present/Absent", "Q1", "Q2", "Q3", "Q4", "Q5", "Q6", "Q7", "Q8", "Q9", "Q10", "Q11", "Q12", "Suitable", "Total"],
                    rows: facTableRows
                };

                const facReviewTable = {
                    title: "\n\n\n",
                    headers: ["Total Fac Needed to Review", facToReviewCount],
                    rows: [
                        ["Total Fac Reviewed", results.length],
                        ["Total Suitable Yes", totalYesCount],
                        ["Total Suitable NO", totalNoCount]
                    ]
                };

                // init document
                let doc = new PDFDocument({ margin: 30, size: 'A3' });
                await doc.table(candDetailsTable, { width: 300 });
                await doc.table(detailSheetTable, { width: 700 });
                await doc.table(facReviewTable, { width: 300 });

                doc.pipe(fs.createWriteStream("pdfs/" + dept + "-Summary.pdf"));
                doc.pipe(res);
                doc.end();
            }
        });
    } else {
        res.status(400);
        res.send({ statusCode: 400, msg: "Please Enter Email" });
    }
});

//exporting this file so that it can be used at other places
module.exports = app;