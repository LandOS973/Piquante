const Sauce = require("../models/Sauce");
const user = require("../models/User");
const fs = require('fs');

exports.getAll = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(e => res.status(400).json({ e }));
};

exports.getOne = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(e => res.status(400).json({ e }));
};

exports.create = (req, res, next) => {
    const sauceObj = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObj,
        userId: sauceObj.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
        .then(() => res.status(201).json({ message: ' Object created ' }))
        .catch(error => res.status(400).json({ error }));
};

exports.modify = (req, res, next) => {
    let sauceObj = {};
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const name = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${name}`, (err) => {
                    if (err) console.log(err);
                    else {
                        console.log("ancienne photo supprimée");
                    }
                })
            })
            .catch(error => res.status(400).json({ error }));
        sauceObj = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        };
    } else {
        sauceObj = { ...req.body };
    }
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObj, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ message: error }));
};

exports.delete = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            const name = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${name}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
                    .catch((e) => res.status(400).json({ message: e }))
            })
        })
        .catch(error => res.status(400).json({ message: error }));
};

exports.like = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (req.body.like > 0) {
                sauce.likes += 1;
                sauce.usersLiked.push(req.body.userId);
            } else if (req.body.like <= 0) {
                sauce.dislikes += -1;
                sauce.usersDisliked.push(req.body.userId);
            }
            console.log(sauce.likes);
            console.log(sauce.usersLiked);
        })
        .catch(error => res.status(400).json({ message: error }));
};