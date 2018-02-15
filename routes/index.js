let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('minifier/minifying',
        {
            h1_brand: "Minify your links"
        });
});

module.exports = router;
