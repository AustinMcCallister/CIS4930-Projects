import express from 'express';

import Post from '../models/post';
import { commentArray } from './comments';

const router = express.Router();

export const postArray: Array<Post> = [];

router.get('/', (req, res, next): void => {
  // curl -X GET localhost:3000/posts
  res.status(200).send(postArray);
});

router.post('/', (req, res, next): void => {
  // curl -X POST localhost:3000/posts -H "Content-Type: application/json" -H "Authorization: Bearer {token}" -d '{"title":"string","content":"string","headerImage":"string"}'
  const post: Post = new Post((postArray[0]?.postId + 1 || 1), new Date(), req.body.title, req.body.content, res.locals.userId, req.body.headerImage, new Date());
  for (const [key, value] of Object.entries(post)) {
    if (!value) {
      res.status(406).send({
        message: 'All fields required',
        status: '406'
      });
      return;
    }
  }
  postArray.unshift(post);
  res.status(201).send(post);
});

router.get('/:postId', (req, res, next): void => {
  // curl -X GET localhost:3000/posts/:postId -H "Authorization: Bearer {token}"
  const index: number = postArray.findIndex((post: Post) => post.postId === parseInt(req.params.postId));
  if (index < 0) { // postId not found
    res.status(404).send({
      message: 'Post not found',
      status: '404'
    });
  }
  else {
    res.status(200).send(postArray[index]);
  }
});

router.patch('/:postId', (req, res, next): void => {
  // curl -X PATCH localhost:3000/posts/:postId -H "Content-Type: application/json" -H "Authorization: Bearer {token}" -d '{"title":"string","content":"string","headerImage":"string"}'
  const index: number = postArray.findIndex((post: Post) => post.postId === parseInt(req.params.postId));
  if (index < 0) { // postId not found
    res.status(404).send({
      message: 'Post not found',
      status: '404'
    });
  }
  else {
    for (const [key, value] of Object.entries(postArray[index])) {
      if (req.body.hasOwnProperty(key) && (key === 'title' || key === 'content' || key === 'headerImage')) {
        postArray[index][key as 'title' || 'content' || 'headerImage'] = req.body[key];
        postArray[index].lastUpdated = new Date();
      }
    }
    res.status(200).send(postArray[index]);
  }
});

router.delete('/:postId', (req, res, next): void => {
  // curl -X DELETE localhost:3000/posts/:postId -H "Authorization: Bearer {token}"
  const index: number = postArray.findIndex((post: Post) => post.postId === parseInt(req.params.postId));
  if (index < 0) { // postId not found
    res.status(404).send({
      message: 'Post not found',
      status: '404'
    });
  }
  else {
    // Delete from the back to prevent skipping posts when indexes shift
    for (let i = (commentArray.length - 1); i >= 0; i--) {
      if (commentArray[i].postId === postArray[index].postId) {
        commentArray.splice(i, 1);
      }
    }
    postArray.splice(index, 1);
    res.sendStatus(204);
  }
});

router.get('/User/:userId', (req, res, next): void => {
  // curl -X GET localhost:3000/posts/user/:userId -H "Authorization: Bearer {token}"
  const userPosts: Array<Post> = [];
  for (const [key, value] of Object.entries(postArray)) {
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

export default router;