const router = require('express').Router();
const Category = require('../models/Category');

router.get('/', (req, res) => {
  try {
    const categories = Category.find();
    !categories && res.status(404).json({ status: 404, message: 'Category not found!' });

    res.status(200).json({ status: 200, categories: categories });
  } catch (err) {
    console.log(err);
    res.status(500).json('Server error');
  }
});

router.post('/', async (req, res) => {
  try {
    const category = await new Category({
      name: req.body.name,
      description: req.body.description,
    })
    await category.save();

    res.status(200).json({
      status: 200,
      category: category,
    });
  } catch(err) {
    res.status(500).json({
      status: 500,
      message: "Internal server error, user not registered",
    });
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findByIdAndUpdate(id, {
      $set: req.body,
    });

    res.status(200).json({
      status: 200,
      message: 'Category updated successfully',
      category: category,
    });
  } catch (err) {
    console.log(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    const { password, updatedAt, ...other } = category._doc;
    !category &&
      res.status(404).json({
        status: 404,
        error: 'Category not found!',
      });

    res.status(200).json({
      status: 200,
      category: other,
    });
  } catch (err) {
    console.log(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    !category &&
      res.status(404).json({
        status: 404,
        error: 'Category not found!',
      });

    res.status(200).json({
      status: 200,
      message: 'Category deleted successfully',
    });
  } catch (err) {
    console.log(err);
  }
});

router.post('/categories');
module.exports = router;
