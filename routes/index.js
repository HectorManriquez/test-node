const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/auth', (req, res, next) => {
  console.log(req);
  console.log(req.query);
  res.status(200).json(req.params);
});

router.get('/access', (req, res, next) => {
  console.log(req);
  console.log(req.query);
  res.status(200).json(req.query);
});

router.get('/test', (req, res, next) => {
  res.status(200).send({
      'status': 200,
      'message': 'success'
  })
});

router.post('/test', (req, res, next) => {
    // console.log(req);
    console.log(req.body);
    console.log(req.headers);
    res.status(200).send(req.body.pingData);
});

module.exports = router;
