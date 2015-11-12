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

router.get('/new', function(req, res, next){
  res.render('tacos/new', {})
})

router.post('/', function(req, res, next){
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('INSERT INTO tacos(shell, taste) VALUES($1,$2) returning id', [req.body.shell, req.body.taste], function(err, result) {
      done();
      console.log(result)
      res.redirect('/tacos/' + result.rows[0].id) 
      if (err) {
        return console.error('error running query', err);
      }
      console.log(result.rows[0].number);
      console.log("connected to db")
    });
  });
})

router.get('/:id', function(req, res, next){
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query('SELECT * FROM tacos WHERE id = $1', [req.params.id], function(err, result) {
      done();
      res.render('tacos/show', {taco: result.rows[0]})
      if (err) {
        return console.error('error running query', err);
      }
    });
  });

})

router.get('/update/:id', function(req, res, next){
  console.log("GET update!");
  console.log(req.params.id);

   pg.connect(conString, function(err, client, done) {
     if (err) {
      return console.error('error fetching client from pool', err);
     }
    client.query('SELECT * FROM tacos WHERE id = $1', [req.params.id], function(err, result) {
       done();
      res.render('tacos/update', {taco: result.rows[0]})
      if (err) {
        return console.error('error running query', err);
      }
    });
  });

})


router.post('/update/:id', function(req, res, next){
  pg.connect(conString, function(err, client, done) {
    if (err) {
      return console.error('error fetching client from pool', err);
    }
    client.query("UPDATE tacos SET shell=($1), taste=($2) WHERE id=($3)",[req.body.shell, req.body.taste, req.params.id], function(err, result) {
      done();
      console.log(result)
      res.redirect('/tacos/') 
      if (err) {
        return console.error('error running query', err);
      }
      console.log("connected to db")
    });
  });
});

router.get('/delete/:id', function(req, res, next) {
  
  pg.connect(conString, function(err, client, done) {
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({ success: false, data: err});
    }

    // SQL Query > Delete Data
    client.query("DELETE FROM tacos WHERE id=($1)", req.params.id, function(err, result){
      done();
      console.log(result)
      res.redirect('/tacos/') 
      if (err) {
        return console.error('error running query', err);
      }
    });
  });
})




    // pg.connect(connectionString, function(err, client, done) {
    //     // Handle connection errors
    //     if(err) {
    //       done();
    //       console.log(err);
    //       return res.status(500).json({ success: false, data: err});
    //     }

    //     // SQL Query > Delete Data
    //     client.query("DELETE FROM items WHERE id=($1)", [id]);

    //     // SQL Query > Select Data
    //     var query = client.query("SELECT * FROM items ORDER BY id ASC");

    //     // Stream results back one row at a time
    //     query.on('row', function(row) {
    //         results.push(row);
    //     });

    //     // After all data is returned, close connection and return results
    //     query.on('end', function() {
    //         done();
    //         return res.json(results);
    //     });
    // });



module.exports = router;
