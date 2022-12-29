import express from 'express';

import Comment from '../models/comment';
import { postArray } from './posts';

const router = express.Router();

export const commentArray: Array<Comment> = [];

router.get('/:postId', (req, res, next): void => {
  // curl -X GET localhost:3000/comments/:postId
  const commentPosts: Array<Comment> = [];
  for (const [key, value] of Object.entries(commentArray)) {
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

router.post('/:postId', (req, res, next): void => {
  // curl -X POST localhost:3000/comments/:postId -H "Content-Type: application/json" -H "Authorization: Bearer {token}" -d '{"comment":"string"}'
  for (const [key, value] of Object.entries(postArray)) {
    if (value.postId === parseInt(req.params.postId)) {
      const comment: Comment = new Comment((commentArray[0]?.commentId + 1 || 1), req.body.comment, res.locals.userId, parseInt(req.params.postId), new Date());
      commentArray.unshift(comment);
      res.status(201).send(comment);
      return;
    }
  }
  res.status(404).send({
    message: 'Post not found',
    status: '404'
  });
});

router.delete('/:postId/:commentId', (req, res, next): void => {
  // curl -X DELETE localhost:3000/comments/:postId/:commentId -H "Authorization: Bearer {token}"
  const index: number = commentArray.findIndex((comment: Comment) => comment.commentId === parseInt(req.params.commentId));
  if (index < 0) { // commentId not found
    res.status(404).send({
      message: 'Comment not found',
      status: '404'
    });
  }
  else {
    commentArray.splice(index, 1);
    res.sendStatus(204);
  }
});


export default router;