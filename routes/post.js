const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');
const { isLoggedIn } = require('./middlewares');
const { route } = require('./page');

const router = express.Router();

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더를 생성합니다');
    fs.mkdirSync('uploads');
}

const upload = multer({             //multer 메서드
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

const upload2 = multer();
router.post('/', isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log(req.user);
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);   //게시글의 해시태그 내용을 정규표현식으로 추출
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },   //해시태그에서 #을 떼고 소문자로 변경한 후 
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));        // 모델만 추출하고 post.addHashtags로 게시글과 연결
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:id/posts', isLoggedIn, (req, res, next) => {
  try {
    Post.destroy({ where: { id: req.params.id }});
    res.send('OK');
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.post('/:id/like', isLoggedIn, async(req, res, next) => {
  try {
    //console.log(req.user.id)
    const post = await Post.findOne({ where: { id: req.params.id }});
    await post.addLiker(req.user.id);
    res.send('OK');
  } catch (error) {
    console.log(error);
    next(error);
  }
});
router.delete('/:id/unlike', isLoggedIn, async(req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id }});
    await post.removeLiker(req.user.id);
    res.send('OK');
  } catch (error) {
    console.log(error);
    next(error);
  }
});


module.exports = router;