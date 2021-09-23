const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schema = require('../models/password-validator');

exports.signup = (req, res, next) => {
    if(schema.validate(req.body.password) == true){
        bcrypt.hash(req.body.password,10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({message: "Utilisateur créé"}))
            .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}))
    }else{
        res.status(400).json({message: "Mot de passe trop faible"});
    }
};

exports.login = (req, res, next) => {
    User.findOne({email:req.body.email})
    .then(user=>{
        if (!user) {
            return res.status(401).json({error: "utilisateur non trouvé !"})
        }
        bcrypt.compare(req.body.password,user.password)
        .then(valid => {
            if(!valid){
                return res.status(401).json({error: "mauvais mdp !"})
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId:user._id},
                    process.env.ACCESS_TOKEN,
                    {expiresIn:"24h"},
                ),
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error=>res.status(500).json({ error }));
};