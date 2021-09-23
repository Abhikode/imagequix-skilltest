const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const _ = require('lodash');
const err_log = require('../utility/error');

const authUser = (req, res, next) => {
    if(!req.headers['x-auth']) return res.status(401).send();
    try {
        const header_token = req.headers['x-auth'];
        jwt.verify(header_token, process.env.ACCESS_TOKEN_SALT, (err, decoded) => {
            if(err) return res.status(401).send();
            req.user_id = decoded.data;
            next();
        });
    } catch(e) {
        err_log(req.method, req.url, e.message)
        res.status(401).send();
    }
}

module.exports = { authUser }