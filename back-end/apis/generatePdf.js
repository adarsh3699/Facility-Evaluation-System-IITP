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

// router - Node + Express.js
app.get('/summary', async (req, res) => {
    const dept = req.query.dept; //studId_tableName

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
                    GROUP BY CandidateInfo.name \
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

//exporting this file so that it can be used at other places
module.exports = app;