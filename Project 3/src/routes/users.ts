import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';

import { jsonWebTokenKey } from './auth'
import User from '../models/user';

const router = express.Router();

const userArray: Array<User> = [];

router.get('/', (req, res, next): void => {
  // curl -X GET localhost:3000/users -H "Authorization: Bearer {token}"
  if (req.headers['authorization']) {
    try {
      const verifiedToken = jwt.verify(req.headers['authorization'].replace('Bearer ',''), jsonWebTokenKey);
      if (!verifiedToken) {
        res.status(401).send({
          message: 'Unauthorized',
          status: '401'
        });
      }
      else {
        res.locals.userId = (verifiedToken as jwt.JwtPayload).data.userId;
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

router.post('/', (req, res, next): void => {
  // curl -X POST localhost:3000/users -H "Content-Type: application/json" -d '{"userId":"string","firstName":"string","lastName":"string","emailAddress":"string","password":"string"}'
  const user: User = new User(req.body.userId, req.body.firstName, req.body.lastName, req.body.emailAddress, req.body.password);
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
    bcrypt.genSalt(10, (err, salt: string): void => {
      bcrypt.hash(user.password, salt, (err, hash: string): void => {
        user.password = hash;
        userArray.push(user);
        res.status(201).send(user);
      });
    });
  }
});

router.get('/:userId', (req, res, next): void => {
  // curl -X GET localhost:3000/users/:userId -H "Authorization: Bearer {token}"
  if (req.headers['authorization']) {
    try {
      const verifiedToken = jwt.verify(req.headers['authorization'].replace('Bearer ',''), jsonWebTokenKey);
      if (!verifiedToken) {
        res.status(401).send({
          message: 'Unauthorized',
          status: '401'
        });
      }
      else {
        res.locals.userId = (verifiedToken as jwt.JwtPayload).data.userId;
        const index: number = userArray.findIndex((user: User) => user.userId === req.params.userId);
        if (index < 0) { // userId not found
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

router.patch('/:userId', (req, res, next): void => {
  // curl -X PATCH localhost:3000/users/:userId -H "Content-Type: application/json" -H "Authorization: Bearer {token}" -d '{"userId":"string","firstName":"string","lastName":"string","emailAddress":"string","password":"string"}'
  const index: number = userArray.findIndex((user: User) => user.userId === req.params.userId);
  if (index < 0) { // userId not found
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
          userArray[index][key as keyof User] = req.body[key];
        }
      }
      res.status(200).send(userArray[index]);
    }
  }
});

router.delete('/:userId', (req, res, next): void => {
  // curl -X DELETE localhost:3000/users/:userId -H "Authorization: Bearer {token}"
  const index: number = userArray.findIndex((user: User) => user.userId === req.params.userId);
  if (index < 0) { // userId not found
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

router.get('/:userId/:password', (req, res, next): void => {
  // curl -X GET localhost:3000/users/:userId/:password
  const index: number = userArray.findIndex((user: User) => user.userId === req.params.userId);
  if (index < 0) {
    res.status(401).send({
      message: 'Invalid Login',
      status: '401'
    });
  }
  else {
    bcrypt.compare(req.params.password, userArray[index].password, (err, result: boolean): void => {
      if (result) {
        const token = jwt.sign({
          UserData: {
            userId: userArray[index].userId
          },
          exp: (Math.floor(Date.now() / 1000) + (60 * 60))
        }, jsonWebTokenKey);
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

export default router;
