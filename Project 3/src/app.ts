import express from 'express';
import http from 'http';
import path from 'path';

import indexRouter from './routes/index';
import usersRouter from './routes/users';
import postsRouter from './routes/posts';
import commentsRouter from './routes/comments';
import authRouter from './routes/auth';

const app = express();
const server = http.createServer(app);
const port = 3000;

app.set('port', port);
server.listen(port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRouter);
app.use('/Users', usersRouter);
app.use('/Posts', postsRouter);
app.use('/Comments', commentsRouter);
app.use('/', indexRouter);
