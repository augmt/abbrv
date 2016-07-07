"use strict";

const express = require("express");
const mongo = require("mongodb").MongoClient;
const randomstring = require("randomstring");
const app = express();

let hashes = [];

mongo.connect(process.env.MONGO_URL, function (err, db) {
    if (err) throw err;

    db.collection("aliases").find().toArray(function (err, docs) {
        if (err) throw err;

        for (let i = 0; i < docs.length; i++) {
            hashes[i] = docs[i].hash;
        }

        db.close();
    });
});

app.get("/", function (req, res) {
    res.send("<p>Lorem ipsum dolor sit amet &hellip;</p>");
});
app.get(/\/((?:https|http):\/\/)(.+)/, function (req, res) {
    const host = req.get("host");

    if (req.params["1"].startsWith(host) && req.params["1"] !== host) {
        return res.json({error: "abbrv redirects to an abbrv"});
    }

    mongo.connect(process.env.MONGO_URL, function (err, db) {
        if (err) throw err;

        const aliases = db.collection("aliases");
        const url = req.params["0"] + req.params["1"].replace(/\/$/, "");

        aliases.findOne({url}, function (err, document) {
            if (err) throw err;

            if (document) {
                db.close();
                return res.json({error: `an abbrv already exists for ${url}`});
            }

            let hash = "";
            while (hashes.indexOf(hash) >= 0 || !hash) {
                hash = randomstring.generate(3);
            }
            hashes.push(hash);

            aliases.insert({hash, url}, function (err) {
                if (err) throw err;

                db.close();
                res.json({"shortened_url": `https://${host}/${hash}`});
            });
        });
    });
});
app.get(/\/([0-9a-zA-Z]{3})$/, function (req, res) {
    const hash = req.params["0"];

    if (hashes.indexOf(req.params["0"]) === -1) {
        return res.json({error: "this abbrv does not yet exist"});
    }

    mongo.connect(process.env.MONGO_URL, function (err, db) {
        if (err) throw err;

        db.collection("aliases").findOne({hash}, function (err, document) {
            if (err) throw err;

            db.close();
            res.redirect(301, document.url);
        });
    });
});
app.listen(process.env.PORT);
