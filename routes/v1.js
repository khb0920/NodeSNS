const express = require('express');
const jwt = require('jsonwebtoken');

const { verifyToken, deprecated } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(deprecated);

router.post('/token', async(req, res) => {           // 이전버젼 v1
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
    });
    if(!domain) {
        return res.status(401).json({
            code: 401,
            message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
        });
    }
    const token = jwt.sign({    //토큰 
        id: domain.User.id,     // 토큰의 내용
        nick: domain.User.nick,
    }, process.env.JWT_SECRET, {   //토큰의 비밀키  
        expiresIn: '5m',            //토큰의 설정 유효기간 5분
        issuer: 'nodeSNS',
    });
    return res.json({
        code: 200,
        message: '토큰이 발급되었습니다',
        token,
    });
} catch(error) {
    console.error(error);
    return res.status(500).json({
        code: 500,
        message: '서버 에러',
    });
}
});

router.get('/test', verifyToken, (req, res) => {
    res.json(req.decoded);
});

router.get('/posts/my', verifyToken, (req, res) => {
    Post.findAll({ where: { userId: req.decoded.id }})
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch((error) => {
            console.log(error);
            return res.status(500).json({
                code: 500,
                message: "서버에러",
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, async(req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { title: req.params.title} });
        if(!hashtag) {
            return res.json({
                code: 200,
                message: "검색 결과가 없습니다"
            })
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: "서버 에러",
        });
    }
});

module.exports = router;