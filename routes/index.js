var express = require('express');
const res = require('express/lib/response');
var router = express.Router();
var formidable = require('formidable');
const fs = require('fs', 'fs-extra');
const { Translate } = require('@google-cloud/translate').v2;
SummarizerManager = require("node-summarizer").SummarizerManager;
require('dotenv').config();


/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/summarise', function (req, res) {
  res.send('Hello we summarise here')
})

router.post('/summarise', function (req, res) {
  console.log(req.body.data)

  const content = req.body.data;

  try {
    fs.writeFileSync('./Output.txt', content);
    // alert("Audio Saved Successfully!")
    res.redirect('back')
    //file written successfully
  } catch (err) {
    console.error(err);
    // res.redirect('back')
  }
})

router.post('/fileupload', function (req, res) {
  var form = new formidable.IncomingForm();
  //Formidable uploads to operating systems tmp dir by default
  form.uploadDir = "./";       //set upload directory
  form.keepExtensions = true;     //keep file extension

  form.parse(req, function (err, fields, files) {
    fs.rename('./invalid-name', './Output.txt', () => {
      console.log("\nFile Renamed!\n");
    });
    res.redirect('back')
  });
})

router.post('/summarisehindi', function (req, res) {
  // Your credentials
  const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

  // Configuration for the client
  const translate = new Translate({
    credentials: CREDENTIALS,
    projectId: CREDENTIALS.project_id
  });
  // console.log(req.body.hindidata)
  console.log("Hindi: " + req.body.hindidata)

  const translateText = async (text, targetLanguage) => {

    try {
      let [response] = await translate.translate(text, targetLanguage);
      return response;
    } catch (error) {
      console.log(`Error at translateText --> ${error}`);
      return 0;
    }
  };

  translateText(req.body.hindidata, 'en')
    .then((response) => {
      try {
        fs.writeFileSync('./Output.txt', response);
        // alert("Audio Saved Successfully!")
        //file written successfully
        res.redirect('back')
      } catch (err) {
        console.error(err);
        // res.redirect('back')
      }
    })
    .catch((err) => {
      console.log(err);
    });
})

router.get('/getsummary', function (req, res) {
  const fs = require("fs");
  var summarydata, reduction_accuracy;
  // __dirname means relative to script. Use "./data.txt" if you want it relative to execution path.
  fs.readFile("./Output.txt", (error, data) => {
    if (error) {
      throw error;
    }
    var filedata = data.toString();
    // console.log(filedata)
    Summarizer = new SummarizerManager(filedata, 5);
    summary = Summarizer.getSummaryByRank().then((summary_object) => {
      // console.log(summary_object.summary)
      summarydata = summary_object.summary
      // res.render('summarypage')
    })
    let reduction_percentage = Summarizer.getRankReductionAsDec().then((reduction_obj)=>{
      reduction_accuracy = Math.round(reduction_obj.dec_reduction *100, 2);
  })

    // setTimeout(() => {console.log("consss...... ", summarydata)}, 5000);
    setTimeout(async () => {

      try {
        fs.writeFileSync('./summaryoutput.txt', summarydata);
        // alert("Audio Saved Successfully!")
        //file written successfully
        res.render('summarypage', { summary: summarydata, accuracy: reduction_accuracy })
      } catch (err) {
        console.error(err);
        // res.redirect('back')
      }
      // console.log("summary..",Summarizer)
    }, 3000);

  })
})

module.exports = router;
