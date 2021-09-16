const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
                .catch(error => res.status(500).json({ error}));
        })
        .catch(error => res.status(500).json({ error : "le hash ne passe pas" }))
};

exports.login = (req, res, next) => {
    console.log(req);
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (valid) {
                            res.status(200).json({
                                userId: user._id,
                                token: "TOKEN",
                            });
                        } else {
                            return res.status(401).json({ error: "mdp incorrect" });
                        }
                    })
                    .catch()
            } else {
                return res.status(401).json({ error: "user not found" });
            }
        })
        .catch(e => res.status(500).json({ e }))
};
