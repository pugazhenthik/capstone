const router = require('express').Router();
const User = require('../models/User');

router.get('/', (req, res) => {
  try {
    const users = User.find({});
    !users && res.status(404).json({ status: 404, message: 'User not found!' });

    res.status(200).json({ status: 200, users: users });
  } catch (err) {
    console.log(err);
    res.status(500).json('Server error');
  }
});

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findByIdAndUpdate(id, {
      $set: req.body,
    });

    res.status(200).json({
      status: 200,
      message: 'User updated successfully',
      user: user,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    !user &&
      res.status(404).json({
        status: 404,
        error: 'User not found!',
      });

    res.status(200).json({
      status: 200,
      user: other,
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    !user &&
      res.status(404).json({
        status: 404,
        error: 'User not found!',
      });

    res.status(200).json({
      status: 200,
      message: 'User deleted successfully',
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/users');
module.exports = router;
