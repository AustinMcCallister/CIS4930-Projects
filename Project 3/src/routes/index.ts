import express from 'express';
const router = express.Router();

router.use('/', (req, res, next): void => {
  res.render('index', { title: 'Project 2' });
});

export default router;
