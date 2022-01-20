const jwt = require('jsonwebtoken');

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