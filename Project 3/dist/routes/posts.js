"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postArray = void 0;
const express_1 = __importDefault(require("express"));
const post_1 = __importDefault(require("../models/post"));
const comments_1 = require("./comments");
const router = express_1.default.Router();
exports.postArray = [];
router.get('/', (req, res, next) => {
    res.status(200).send(exports.postArray);
});
router.post('/', (req, res, next) => {
    const post = new post_1.default((exports.postArray[0]?.postId + 1 || 1), new Date(), req.body.title, req.body.content, res.locals.userId, req.body.headerImage, new Date());
    for (const [key, value] of Object.entries(post)) {
        if (!value) {
            res.status(406).send({
                message: 'All fields required',
                status: '406'
            });
            return;
        }
    }
    exports.postArray.unshift(post);
    res.status(201).send(post);
});
router.get('/:postId', (req, res, next) => {
    const index = exports.postArray.findIndex((post) => post.postId === parseInt(req.params.postId));
    if (index < 0) {
        res.status(404).send({
            message: 'Post not found',
            status: '404'
        });
    }
    else {
        res.status(200).send(exports.postArray[index]);
    }
});
router.patch('/:postId', (req, res, next) => {
    const index = exports.postArray.findIndex((post) => post.postId === parseInt(req.params.postId));
    if (index < 0) {
        res.status(404).send({
            message: 'Post not found',
            status: '404'
        });
    }
    else {
        for (const [key, value] of Object.entries(exports.postArray[index])) {
            if (req.body.hasOwnProperty(key) && (key === 'title' || key === 'content' || key === 'headerImage')) {
                exports.postArray[index][key || 'content' || 'headerImage'] = req.body[key];
                exports.postArray[index].lastUpdated = new Date();
            }
        }
        res.status(200).send(exports.postArray[index]);
    }
});
router.delete('/:postId', (req, res, next) => {
    const index = exports.postArray.findIndex((post) => post.postId === parseInt(req.params.postId));
    if (index < 0) {
        res.status(404).send({
            message: 'Post not found',
            status: '404'
        });
    }
    else {
        for (let i = (comments_1.commentArray.length - 1); i >= 0; i--) {
            if (comments_1.commentArray[i].postId === exports.postArray[index].postId) {
                comments_1.commentArray.splice(i, 1);
            }
        }
        exports.postArray.splice(index, 1);
        res.sendStatus(204);
    }
});
router.get('/User/:userId', (req, res, next) => {
    const userPosts = [];
    for (const [key, value] of Object.entries(exports.postArray)) {
        if (value.userId === req.params.userId) {
            userPosts.push(value);
        }
    }
    if (userPosts.length === 0) {
        res.status(404).send({
            message: 'Posts not found',
            status: '404'
        });
    }
    else {
        res.status(200).send(userPosts);
    }
});
exports.default = router;
//# sourceMappingURL=posts.js.map