exports.postInput = (req, res, next) => {
    const { Validator } = require('node-input-validator');
    const v = new Validator(JSON.parse(req.body.sauce), {
        name: 'required|minLength:3',
        manufacturer: 'required|minLength:3',
        description: 'required|minLength:3',
        mainPepper: 'required|minLength:3',
    });
    v.check().then((matched) => {
        console.log(matched);
        if (!matched) {
            res.status(422).send(v.errors);
        }else{
            next();
        }
    });
}

exports.modifyInput = (req, res, next) => {
    const { Validator } = require('node-input-validator');
    const v = new Validator(req.body, {
        name: 'required|minLength:3',
        manufacturer: 'required|minLength:3',
        description: 'required|minLength:3',
        mainPepper: 'required|minLength:3',
    });
    v.check().then((matched) => {
        console.log(matched);
        if (!matched) {
            res.status(422).send(v.errors);
        }else{
            next();
        }
    });
}