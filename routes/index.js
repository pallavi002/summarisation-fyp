var express = require('express');
var router = express.Router();
const fs = require('fs');

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
    fs.writeFileSync('./Output.txt', content)
    //file written successfully
  } catch (err) {
    console.error(err)
  }
})

module.exports = router;
