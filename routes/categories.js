const router = require('express').Router();
const Category = require('../models/Category');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    
    if (categories) {
      res.status(200).json({ data: categories });
    }
    
    res.status(404).json({ message: 'Category not found!' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    })

    await category.save();

    res.status(200).json({ data: category });
  } catch(error) {
    console.log(error)
    res.status(500).json({ error: 'Server error' });
  }
})

router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const category = await Category.findByIdAndUpdate(id, {
      $set: req.body,
    });

    res.status(200).json({ message: 'Category updated successfully', data: category });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (category) {
      res.status(200).json({ data: category });
    }
    res.status(404).json({ error: 'Category not found!' });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (category) {
      res.status(200).json({ message: 'Category deleted successfully' });
    }
    
    res.status(404).json({ error: 'Category not found!'});

    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/categories');
module.exports = router;
