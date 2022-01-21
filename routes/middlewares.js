const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    }else {
        res.status(403).send('로그인필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        next();
    }else {
        const message = encodeURIComponent('로그인한 상태입니다');
        res.redirect(`/?error=${message}`);
    }
};

exports.verifyToken = (req, res, next) => { //토큰 검증
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); //헤더의 토큰과 비밀키
        return next();  
    } catch(error) {
        if(error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 없습니다',
            });
        }
        return res.status(401).json({
            code: 401,
            message: '유효하지 않은 토큰입니다'
        });
    }
};

exports.apiLimiter = RateLimit({
    windowMs: 60 * 1000,
    max: 10,
    handler(req, res) {
        res.status(429).json({
            code: 429,
            message: '분당 10회만 요청가능합니다.',
        });
    },
});

exports.deprecated = (req, res) => {
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 출시되었습니다. 새로운 버전을 이용해주세요'
    });
};