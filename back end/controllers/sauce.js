const Sauce = require("../models/Sauce");
const user = require("../models/User");

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

};

exports.delete = (req, res, next) => {
    Sauce.findOneAndDelete({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.like = (req, res, next) => {

};