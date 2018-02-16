const https = require('https');
const validUrl = require('valid-url');
let I18n = require('../app').I18n;
let db = require('../bin/db.js');
let express = require('express');
let router = express.Router();

const domain = 'http://' + defineBaseDomain() + '/';
const usableChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const usableCharLength = usableChars.length;

let idLength, maxId, currentIdAmount;
getIdState((resLength, resMaxId, resCurrIdAmount) => {[idLength, maxId, currentIdAmount] = [resLength, resMaxId, resCurrIdAmount]});

/* GET home page. */
router.post('/', function(req, res, next) {
    I18n.use(req.headers["accept-language"].substring(0,2));
    //console.log(req.connection.remoteAddress);

    // Recaptcha checking
    verifyRecaptcha(req.body["g-recaptcha-response"], (success) => {
        if (success) {

            // Valid URL checking
            if (validUrl.isUri(req.body.uri)){
                let id;
                saveURL();

                // Save the link into the database with the found id
                function saveURL() {
                    id = makeId();

                    db.get(id, (err, value) => {
                        if (err) {
                            db.put(id, req.body.uri, () => {

                                // Send the page with the link
                                res.render('minifier/minified',
                                    {
                                        title: ":: " + I18n.translate `Minified !`,
                                        shortener_h1: I18n.translate `Your link was minified !`,
                                        shortener_tagline: I18n.translate `All kuuu.ga URLs are deleted after one year of inactivity`,
                                        url: domain + id
                                    });

                                currentIdAmount += 1;

                                // If there's not enough id left, update the id length
                                if (!hasIdLeft()) {
                                    db.get("-idLength", (err, values) => {
                                        if (err) {
                                            console.log("Err: Unable to update currentIdAmount") // TODO: Handle this error
                                        } else {
                                            console.log(values);
                                            values = values.slice(0, -1) + currentIdAmount;
                                            db.put("-idLength", values)
                                        }
                                    });
                                    getIdState((resLength, resMaxId, resCurrIdAmount) => {
                                        idLength = resLength;
                                        maxId = resMaxId;
                                        currentIdAmount = resCurrIdAmount;
                                    })
                                }
                            });
                        } else {
                            saveURL()
                        }
                    })
                }
            } else {
                res.end("This is not a valid URL."); // URL is incorrect
            }
        } else {
            res.end("You are a robot."); // Recaptcha failed
        }
    });
});

function makeId() {
    let text = "";

    for (let i = 0; i < idLength; i++)
        text += usableChars.charAt(Math.floor(Math.random() * usableCharLength));

    return text;
}

function defineBaseDomain() {
    if (process.env.DOMAIN === undefined) {
        return '127.0.0.1:3000'
    } else {
        return process.env.DOMAIN
    }
}

function hasIdLeft() {
    return currentIdAmount < maxId * 0.90;
}

function getIdState(callback) {
    db.get("-idLength", (err, values) => {
        let length, maxId, currentIdAmount;

        // If there's less than 20% of free link, set a longer link and reset the counter
        if (!err) {
            [length, currentIdAmount] = [values.length, parseInt(values.slice(-1))];
            maxId = multiplicativeRecursive(usableCharLength, usableCharLength, length);

            if (currentIdAmount > (maxId * 0.80)) {
                length += 1;
                currentIdAmount = 0;
                maxId = multiplicativeRecursive(usableCharLength, usableCharLength, length);
                values = values.slice(0, -1) + length;
                db.put("-idLength", values)
            }
            return callback(length, maxId, currentIdAmount)

        // If the database is empty, initialize it
        } else {
            db.put("-idLength", "0");
            getIdState((resLength, resMaxId, resCurrentIdAmount) => {return callback(resLength, resMaxId, resCurrentIdAmount)})
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

function verifyRecaptcha(key, callback) {
    //callback(true); /*
    https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.CAPTCHA + "&response=" + key, (res) => {
        let data = "";
        res.on('data', function (chunk) {
            data += chunk.toString();
        });
        res.on('end', function() {
            try {
                let parsedData = JSON.parse(data);
                callback(parsedData.success);
            } catch (e) {
                callback(false);
            }
        });
    });
}

module.exports = router;