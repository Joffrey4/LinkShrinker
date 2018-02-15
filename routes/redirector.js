let db = require('../bin/db.js');
let express = require('express');
let router = express.Router();

/* GET home page. */
router.get('/:id', function(req, res, next) {

    db.get(req.params.id, (err, value) => {
        if (err) {
            // Set an error if the link does not exist
            let error = new Error('Not Found');
            error.status = 404;
            next(error);

            // Redirect if the link exists
        } else {
            res.redirect(value);
        }
    })
});

module.exports = router;