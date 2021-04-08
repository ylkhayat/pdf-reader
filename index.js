const fs = require("fs");

const PDFExtract = require("pdf.js-extract").PDFExtract;
const pdfExtract = new PDFExtract();
const options = { normalizeWhitespace: true }; /* see below */
let firstY = 0;
let newLineBool = false;
let accumulatedLine = "";
let finalAccumulatedLine = "";
pdfExtract.extract("assets/brief.pdf", options, (err, data) => {
  if (err) return console.log(err);
  let textToWrite = data.pages.reduce((accum, { content }) => {
    return (
      accum +
      "\n" +
      content.reduce((accum1, { y, dir, str }) => {
        newLineBool = false;
        if (firstY === y) accumulatedLine = str + accumulatedLine;
        finalAccumulatedLine = accumulatedLine;
        // if (firstY === y)
        //   if (dir === "ltr")
        //     accumulatedLine = accumulatedLine + "\u202A" + str + "\u202C";
        //   else accumulatedLine = accumulatedLine + "\u202B" + str + "\u202C";
        // finalAccumulatedLine = accumulatedLine;
        if (firstY !== y) {
          newLineBool = true;
          firstY = y;
        }
        if (newLineBool) {
          accumulatedLine = "";
          return accum1 + finalAccumulatedLine + "\n";
        } else {
          return accum1;
        }
      }, "")
    );
  }, "");
  // textToWrite += +"\n" + finalAccumulatedLine;
  fs.writeFile("Output.txt", textToWrite, err => {
    if (err) throw err;
  });
  fs.writeFile("Output.json", JSON.stringify(data, null, 2), err => {
    if (err) throw err;
  });
});
