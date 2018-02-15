let I18n = require('../app').I18n;
let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    I18n.use(req.headers["accept-language"].substring(0,2));
    res.render('minifier/minifying',
        {
            shortener_h1: I18n.translate `Minify your links`,
            shortener_tagline: I18n.translate `All kuuu.ga URLs are deleted after one year of inactivity`,
            shortener_placeholder: I18n.translate `Your original URL here`,
            shortener_button: I18n.translate `Shorten URL`
        });
});

module.exports = router;
