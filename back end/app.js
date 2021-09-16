const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@piquante.j011u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});

app.use((req, res, next) => {
    res.status(201);
    next();
});

app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
    next();
});

app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
});

module.exports = app;