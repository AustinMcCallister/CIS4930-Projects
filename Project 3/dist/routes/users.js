"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./auth");
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
const userArray = [];
router.get('/', (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            const verifiedToken = jsonwebtoken_1.default.verify(req.headers['authorization'].replace('Bearer ', ''), auth_1.jsonWebTokenKey);
            if (!verifiedToken) {
                res.status(401).send({
                    message: 'Unauthorized',
                    status: '401'
                });
            }
            else {
                res.locals.userId = verifiedToken.data.userId;
                res.status(200).send(userArray);
            }
            return;
        }
        catch {
            res.status(401).send({
                message: 'Invalid token',
                status: '401'
            });
            return;
        }
    }
    else {
        res.status(401).send({
            message: 'Unauthorized',
            status: '401'
        });
        return;
    }
});
router.post('/', (req, res, next) => {
    const user = new user_1.default(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password);
    for (const [key, value] of Object.entries(user)) {
        if (!value) {
            res.status(406).send({
                message: 'All fields required',
                status: '406'
            });
            return;
        }
    }
    for (const [key, value] of Object.entries(userArray)) {
        if (user.userId === value.userId) {
            res.status(409).send({
                message: 'Conflict',
                status: '409'
            });
            return;
        }
    }
    if (!user.emailAddress.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        res.status(406).send({
            message: 'Invalid Email',
            status: '406'
        });
    }
    else {
        bcrypt_1.default.genSalt(10, (err, salt) => {
            bcrypt_1.default.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                userArray.push(user);
                res.status(201).send(user);
            });
        });
    }
});
router.get('/:userId', (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            const verifiedToken = jsonwebtoken_1.default.verify(req.headers['authorization'].replace('Bearer ', ''), auth_1.jsonWebTokenKey);
            if (!verifiedToken) {
                res.status(401).send({
                    message: 'Unauthorized',
                    status: '401'
                });
            }
            else {
                res.locals.userId = verifiedToken.data.userId;
                const index = userArray.findIndex((user) => user.userId === req.params.userId);
                if (index < 0) {
                    res.status(404).send({
                        message: 'User not found',
                        status: '404'
                    });
                }
                else {
                    res.status(200).send(userArray[index]);
                }
            }
            return;
        }
        catch {
            res.status(401).send({
                message: 'Invalid token',
                status: '401'
            });
            return;
        }
    }
    else {
        res.status(401).send({
            message: 'Unauthorized',
            status: '401'
        });
        return;
    }
});
router.patch('/:userId', (req, res, next) => {
    const index = userArray.findIndex((user) => user.userId === req.params.userId);
    if (index < 0) {
        res.status(404).send({
            message: 'User not found',
            status: '404'
        });
    }
    else {
        if (req.body.hasOwnProperty('emailAddress') && !req.body.emailAddress.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            res.status(406).send({
                message: 'Invalid Email',
                status: '406'
            });
        }
        else {
            for (const [key, value] of Object.entries(userArray[index])) {
                if (req.body.hasOwnProperty(key) && key !== 'userId') {
                    userArray[index][key] = req.body[key];
                }
            }
            res.status(200).send(userArray[index]);
        }
    }
});
router.delete('/:userId', (req, res, next) => {
    const index = userArray.findIndex((user) => user.userId === req.params.userId);
    if (index < 0) {
        res.status(404).send({
            message: 'User not found',
            status: '404'
        });
    }
    else {
        userArray.splice(index, 1);
        res.sendStatus(204);
    }
});
router.get('/:userId/:password', (req, res, next) => {
    const index = userArray.findIndex((user) => user.userId === req.params.userId);
    if (index < 0) {
        res.status(401).send({
            message: 'Invalid Login',
            status: '401'
        });
    }
    else {
        bcrypt_1.default.compare(req.params.password, userArray[index].password, (err, result) => {
            if (result) {
                const token = jsonwebtoken_1.default.sign({
                    UserData: {
                        userId: userArray[index].userId
                    },
                    exp: (Math.floor(Date.now() / 1000) + (60 * 60))
                }, auth_1.jsonWebTokenKey);
                res.status(200).send({
                    token: token
                });
            }
            else {
                res.status(401).send({
                    message: 'Invalid Login',
                    status: '401'
                });
            }
        });
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map