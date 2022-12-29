import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();
export const jsonWebTokenKey = 'password';

const paths: Array<any> = [
  {
    method: ['PATCH', 'DELETE'],
    url: '/Users'
  },
  {
    method: ['POST', 'PATCH', 'DELETE'],
    url: '/Posts'
  },
  {
    method: ['POST', 'DELETE'],
    url: '/Comments'
  }
];

router.use('/', (req, res, next): void => {
  for (const path of paths) {
    if (req.url.includes(path.url) && path.method.includes(req.method)) {
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
            res.locals.userId = (verifiedToken as jwt.JwtPayload).UserData.userId;
            next();
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
    }
  }
  next();
});

export default router;