const express = require('express');
const httpSignature = require('http-signature');
const utf8 = require('utf8');

const router = express.Router();
const publicKey = utf8.encode(process.env.ST_PUBLIC_KEY);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/auth', (req, res, next) => {
    console.log(req);
    console.log(req.query);
    res.status(200).json(req.params);
});

router.get('/smartthings', (req, res, next) => {
    res.status(200).send({
        'status': 200,
        'message': 'success'
    })
});

router.post('/smartthings', (req, res, next) => {
    console.log(req.body);
    console.log(req.headers);

    if (req.body && req.body.lifecycle === 'PING' || signatureIsVerified(req)) {
        handleRequest(req, res);
    } else {
        res.status(401).send('Forbidden');
    }
});

function signatureIsVerified(req) {
    try {
        let parsed = httpSignature.parseRequest(req);
        console.log('THIS IS THE PARSED DATA');
        console.log(parsed);
        if (!httpSignature.verifySignature(parsed, publicKey)) {
            console.log('IS THIS EVEN HITTTT');
            console.log('forbidden - failed verifySignature');
            return false;
        }
    } catch (error) {
        console.log('WE HAVE THROWN AN ERRORRR!');
        console.error(error);
        return false;
    }
    return true;
}

function handleRequest(req, res) {
    // handle all lifecycles from SmartThings
    const lifecycle = req.body.lifecycle;

    if (lifecycle === 'PING') {
        console.log(`${lifecycle} lifecycle triggered`);
        res.status(200).send({
            pingData: req.body.pingData
        });
    }

    if (lifecycle === 'CONFIGURATION') {
        console.log(`${lifecycle} lifecycle triggered`);

        res.status(200).send({
            "name": "Yonomi",
            "description": "Yonomi integration device permissions.",
            "id": "app",
            "permissions": [
                "l:devices",
                "r:devices:*",
                "w:devices:*",
                "x:devices:*",
                "l:installedapps",
                "r:installedapps:*",
                "w:installedapps:*",
                "r:locations:*",
                "w:locations:*",
                "r:apps:*",
                "w:apps:*",
                "r:deviceprofiles",
                "w:deviceprofiles",
                "r:schedules",
                "w:schedules"
            ]
        });
    }
}

module.exports = router;
