var express = require('express');
var router = express.Router();
const fs = require('fs');
const { Translate } = require('@google-cloud/translate').v2;
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

module.exports = router;
