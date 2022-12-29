import express from 'express';
import User from '../models/user';

const router = express.Router();

const userArray: Array<User> = [];

router.get('/', (req, res, next): void => {
  // curl -X GET localhost:3000/users
  res.status(200).send(userArray.map((user: User) => {
    const clone = Object.assign({}, user) as any
    delete clone.password;
    return clone;
  }));
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
  userArray.push(user);
  res.status(201).send({
    userId: user.userId,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress
  });
});

router.get('/:userId', (req, res, next): void => {
  // curl -X GET localhost:3000/users/:userId
  const index: number = userArray.findIndex((user) => user.userId === req.params.userId);
  if (index < 0) { // userId not found
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

router.patch('/:userId', (req, res, next): void => {
  // curl -X PATCH localhost:3000/users/:userId -H "Content-Type: application/json" -d '{"userId":"string","firstName":"string","lastName":"string","emailAddress":"string","password":"string"}'
  const index: number = userArray.findIndex((user) => user.userId === req.params.userId);
  if (index < 0) { // userId not found
    res.status(404).send({
      message: 'User not found',
      status: '404'
    });
  }
  else {
    for (const [key, value] of Object.entries(userArray[index])) {
      if (req.body.hasOwnProperty(key) && key !== 'userId') {
        userArray[index][key as keyof User] = req.body[key];
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

router.delete('/:userId', (req, res, next): void => {
  // curl -X DELETE localhost:3000/users/:userId
  const index: number = userArray.findIndex((user) => user.userId === req.params.userId);
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

export default router;
