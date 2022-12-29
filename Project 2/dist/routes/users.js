"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../models/user"));
const router = express_1.default.Router();
const userArray = [];
router.get('/', (req, res, next) => {
    res.status(200).send(userArray.map((user) => {
        const clone = Object.assign({}, user);
        delete clone.password;
        return clone;
    }));
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
    userArray.push(user);
    res.status(201).send({
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress
    });
});
router.get('/:userId', (req, res, next) => {
    const index = userArray.findIndex((user) => user.userId === req.params.userId);
    if (index < 0) {
        res.status(404).send({
            message: 'User not found',
            status: '404'
        });
    }
    else {
        res.status(200).send({
            userId: userArray[index].userId,
            firstName: userArray[index].firstName,
            lastName: userArray[index].lastName,
            emailAddress: userArray[index].emailAddress
        });
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
        for (const [key, value] of Object.entries(userArray[index])) {
            if (req.body.hasOwnProperty(key) && key !== 'userId') {
                userArray[index][key] = req.body[key];
            }
        }
        res.status(200).send({
            userId: userArray[index].userId,
            firstName: userArray[index].firstName,
            lastName: userArray[index].lastName,
            emailAddress: userArray[index].emailAddress
        });
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
exports.default = router;
//# sourceMappingURL=users.js.map