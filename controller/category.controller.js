const Category = require('../models/category');
const Subcategory = require('../models/sub_category');

// Controller functions to handle category related operations

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate('subcategories');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories' });
  }
};

// Create a new category
const createCategory = async (req, res) => {
  const { name } = req.body.values;
  const { subcategories } = req.body;

  try {
    const category = await Category.create({ name,subcategories });
    subcategories.map(async x=>{
      const scategory = await Subcategory.findOne({_id:x});
      scategory.category = category._id
      await scategory.save()
    })
    
    res.status(201).json(category);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Get a single category by ID
const getCategoryById = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId).populate('subcategories');
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category' });
  }
};

// Update a category by ID
const updateCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  const { subcategories } = req.body;
  console.log(req.body);
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name,subcategories },
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    console.log(subcategories);
    subcategories.map(async x=>{
      const scategory = await Subcategory.findOne({_id:x});
      console.log("dsdsdsd",scategory);
      scategory.category = updatedCategory._id
      await scategory.save()
    });

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
};
// Update a category by ID
const updateSubCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { subcategories } = req.body;
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        { $push: { subcategories: { $each: subcategories } } },
        { new: true }
      );

      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found' });
      }
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ message: 'Error updating category' });
    }
  };
// Delete a category by ID
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
  updateSubCategory
};