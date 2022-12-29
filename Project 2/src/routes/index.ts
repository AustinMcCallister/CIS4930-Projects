import express from 'express';
const router = express.Router();

router.get('/', (req, res, next): void => {
  res.render('index', { title: 'Project 2' });
});

export default router;
