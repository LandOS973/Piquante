const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schema = require('../models/password-validator');
const CryptoJS = require("crypto-js");
const dotenv = require("dotenv");
dotenv.config();

exports.signup = (req, res, next) => {
    if (schema.validate(req.body.password) == true) {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                let key = CryptoJS.enc.Hex.parse(process.env.CryptoKey);
                let iv = CryptoJS.enc.Hex.parse(process.env.CryptoIv);
                let emailCrypted = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
                const user = new User({
                    email: emailCrypted,
                    password: hash
                });
                user.save()
                    .then(() => res.status(201).json({ message: "Utilisateur créé" }))
                    .catch(error => res.status(500).json({ error }));
            })
            .catch(error => res.status(500).json({ error }))
    } else {
        res.status(400).json({ message: "Mot de passe trop faible" });
    }
};

exports.login = (req, res, next) => {
    let key = CryptoJS.enc.Hex.parse(process.env.CryptoKey);
    let iv = CryptoJS.enc.Hex.parse(process.env.CryptoIv);
    let emailCrypted = CryptoJS.AES.encrypt(req.body.email, key, { iv: iv }).toString();
    User.findOne({ email: emailCrypted })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: "utilisateur non trouvé !" })
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: "mauvais mdp !" })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.ACCESS_TOKEN,
                            { expiresIn: "24h" },
                        ),
                    });
                })
                .catch(error => res.status(500).json({  message : "Mauvais mot de passe" }));
        })
        .catch(error => res.status(500).json({ message : "Mauvais mot de passe" }));
};