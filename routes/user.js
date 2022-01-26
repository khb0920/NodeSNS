const express = require('express');
const bcrypt = require('bcrypt');

const { isLoggedIn } = require('./middlewares');
const User = require('../models/user');
const Post = require('../models/post');
const { addFollowing } = require('../testCtrl/user');

const router = express.Router();

router.post(':/id/follow', isLoggedIn, addFollowing);

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) {
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});
router.post('/:id/followCancel', isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id } });
    if (user) {
      await user.removeFollower(parseInt(req.user.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});


router.post("/profile", async(req, res, next) => {
  const { nick, password} = req.body;
  try{
    const hash = await bcrypt.hash(password, 12);
  await User.update({ 
    nick, 
    password: hash,
  }, {
    where: { id: req.user.id}, 
  });
  res.redirect('/');
  } catch (error){
    console.error(error);
    next(error);
  }
});


module.exports = router;