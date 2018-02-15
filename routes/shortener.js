let I18n = require('../app').I18n;
let validUrl = require('valid-url');
let db = require('../bin/db.js');
let express = require('express');
let router = express.Router();

const domain = defineBaseDomain();
const usableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const usableCharLength = usableChars.length;
let idLength;
defineIdLength((result) => {idLength = result});

/* GET home page. */
router.post('/', function(req, res, next) {
    I18n.use(req.headers["accept-language"].substring(0,2));

    // If the entered URL is valid
    if (validUrl.isUri(req.body.uri)){
        let id;
        saveURL();

        // Save the link into the database with the founded id
        function saveURL() {
            id = makeId();

            db.get(id, (err, value) => {
                if (err) {
                    db.put(id, req.body.uri, () => {
                        res.render('minifier/minified',
                            {
                                title: ":: " + I18n.translate `Minified !`,
                                shortener_h1: I18n.translate `Your link was minified !`,
                                shortener_tagline: I18n.translate `All kuuu.ga URLs are deleted after one year of inactivity`,
                                url: domain + id
                            });
                    });
                } else {
                    saveURL()
                }
            })
        }

    // If the URL is incorrect
    } else {
        console.log('This is not a valid URL.');
    }
});

function makeId() {
    let text = "";

    for (let i = 0; i < idLength; i++)
        text += usableChars.charAt(Math.floor(Math.random() * usableCharLength));

    return text;
}

function defineBaseDomain() {
    let domain = 'http://';
    if (process.env.DOMAIN === undefined) {
        domain += '127.0.0.1:3000/'
    } else {
        domain += process.env.DOMAIN + '/'
    }
    return domain
}

function defineIdLength(callback) {
    db.get("-idLength", (err, values) => {
        let length;

        // Retrieve the greatest char length currently in use
        if (!err) {
            let lastEntry;

            for (let i = 0; i < values.length; i++) {
                if (lastEntry === undefined) {
                    lastEntry = [(i + 1), parseInt(values[i])]
                } else {
                    if (lastEntry[0] < (i + 1)) {
                        lastEntry = [i, parseInt(values[i])]
                    }
                }
            }

            // Check if there's enough id left to use, with this char length. And set a new char length if not.
            if (lastEntry !== undefined) {
                let maxId = multiplicativeRecursive(usableCharLength, usableCharLength, lastEntry[0]);

                if (lastEntry[1] < (maxId * 0.80)) {
                    length = lastEntry[0]
                } else {
                    length = lastEntry[0] + 1;
                    values.push(length);
                    db.put("-idLength", values)
                }
            }
            return callback(length)

        // If the database is empty, initialize it
        } else {
            db.put("-idLength", [0]);
            defineIdLength((response) => { return callback(response) })
        }
    });

    function multiplicativeRecursive(number, multiplicand, counter) {
        counter = counter - 1;
        if (counter <= 0) {
            return number
        } else {
            number = number * multiplicand;
            return multiplicativeRecursive(number, multiplicand, counter)
        }
    }
}

module.exports = router;