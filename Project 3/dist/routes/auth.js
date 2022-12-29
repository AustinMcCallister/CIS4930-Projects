"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonWebTokenKey = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
exports.jsonWebTokenKey = 'password';
const paths = [
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
router.use('/', (req, res, next) => {
    for (const path of paths) {
        if (req.url.includes(path.url) && path.method.includes(req.method)) {
            if (req.headers['authorization']) {
                try {
                    const verifiedToken = jsonwebtoken_1.default.verify(req.headers['authorization'].replace('Bearer ', ''), exports.jsonWebTokenKey);
                    if (!verifiedToken) {
                        res.status(401).send({
                            message: 'Unauthorized',
                            status: '401'
                        });
                    }
                    else {
                        res.locals.userId = verifiedToken.UserData.userId;
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
exports.default = router;
//# sourceMappingURL=auth.js.map