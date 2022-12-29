"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentArray = void 0;
const express_1 = __importDefault(require("express"));
const comment_1 = __importDefault(require("../models/comment"));
const posts_1 = require("./posts");
const router = express_1.default.Router();
exports.commentArray = [];
router.get('/:postId', (req, res, next) => {
    const commentPosts = [];
    for (const [key, value] of Object.entries(exports.commentArray)) {
        if (value.postId === parseInt(req.params.postId)) {
            commentPosts.push(value);
        }
    }
    if (commentPosts.length === 0) {
        res.status(404).send({
            message: 'Comments not found',
            status: '404'
        });
    }
    else {
        res.status(200).send(commentPosts);
    }
});
router.post('/:postId', (req, res, next) => {
    for (const [key, value] of Object.entries(posts_1.postArray)) {
        if (value.postId === parseInt(req.params.postId)) {
            const comment = new comment_1.default((exports.commentArray[0]?.commentId + 1 || 1), req.body.comment, res.locals.userId, parseInt(req.params.postId), new Date());
            exports.commentArray.unshift(comment);
            res.status(201).send(comment);
            return;
        }
    }
    res.status(404).send({
        message: 'Post not found',
        status: '404'
    });
});
router.delete('/:postId/:commentId', (req, res, next) => {
    const index = exports.commentArray.findIndex((comment) => comment.commentId === parseInt(req.params.commentId));
    if (index < 0) {
        res.status(404).send({
            message: 'Comment not found',
            status: '404'
        });
    }
    else {
        exports.commentArray.splice(index, 1);
        res.sendStatus(204);
    }
});
exports.default = router;
//# sourceMappingURL=comments.js.map