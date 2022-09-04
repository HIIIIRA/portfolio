var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/dream', function (req, res, next) {
  res.render('pages/dream');
});

router.get('/dre', function (req, res, next) {
  res.render('pages/dream');
});

module.exports = router;
