var express = require('express');
var router = express.Router();
var pg = require('pg');
var conString = "postgres://@localhost/taco_types";



/* GET users listing. */
router.get('/', function(req, res, next) {

  console.log('tacos!!!!')

  pg.connect(conString, function(err, client, done) {

    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM tacos', function(err, result) {
      done();
      res.render('tacos/index', {tacos: result.rows})
      if (err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0].number);
      console.log("connected to db")
    });

  });



});

module.exports = router;
