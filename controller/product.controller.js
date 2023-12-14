const Product = require('../models/produit');
const Category = require('../models/category');
const Subcategory = require('../models/sub_category');
const User = require('../models/user');


const dotenv = require('dotenv');

dotenv.config();

const createProduct = async (req, res) => {
  try {

    const product = new Product(req.body);
    product.owner = req.route.meta.user._id
    await product.save();  

    const user =  await User.findById( req.route.meta.user._id);

    user.my_prods.push(product._id)
    await user.save();  

    if(!product)
      return res.status(401).json({ error: 'Failed to create product' });

    return res.status(201).json(product);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Failed to create product' });
  }
};

const gegtImagesNames = async (req, res) => {
  
  try{
    let files = req.files;
    let tab = [];
    files.map(x=>{
      tab.push( process.env.HOST + x.originalname)
    })
    return res.status(201).json(tab);

  }catch(err){
    console.log(err);
    return res.status(500).json({ error: err});
  }

};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};
const getRandomProducts = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const skipCount = totalProducts > 8 ? Math.floor(Math.random() * (totalProducts - 10)) : 0;
    const randomProducts = await Product.find().populate('owner').skip(skipCount).limit(10);
    res.status(200).json(randomProducts);

  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
};
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id).populate('owner');
    console.log(product);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve product' });
  }
};

const updateProductById = async (req, res) => {

  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

// Delete a product by ID
const deleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndRemove(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};

const updateViews = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.nb_views +=1;

    product.save()

    res.json({ message: product.nb_views });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};


const searchProducts = async (req, res) => {
  const { title, category } = req.query;
  console.log({ title, category });
  try {
    
    const query = {};
    console.log(title != 'null' );
    if (title) {
      query.title =title != 'null' ?  { $regex:  title , $options: 'i' } : null;
    }
    if (category) {
      query.category= category  ? { $regex: category, $options: 'i' } : null;
      
    }

    
    const products = await Product.find({
      $or: [
        { title: query.title },
        { category: query.category },

      ]
    }).limit(8);

    res.status(200).json(products);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error});
  }
};

const searchCateProducts = async (req, res) => {
  if(req.query.subcategory){

    const subcategory = req.query.subcategory.split(',');
  
    try {
      const productsByCategorySubName = await Subcategory.find({ name: { $in: subcategory } }).populate('id_prod');
  
      res.status(200).json(productsByCategorySubName);
  
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error});
    }
  }
};

const searchSimilarProduct = async (req, res) => {
  try {
    let query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.title) {
      // Assuming you want to perform a case-insensitive partial match on the title
      query.$or = [
        { title: { $regex: new RegExp(req.query.title, 'i') } },
      ];
    }

    const limit = 8;
    const totalDocuments = await Product.countDocuments(query);
    const randomSkip = Math.floor(Math.random() * (totalDocuments / limit));

    const products = await Product.find(query).populate('owner')
      .skip(randomSkip)
      .limit(limit);

    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};



const fs = require('fs');
const { log } = require('console');

const deleteImages = async (req, res) => {

  const filePath = req.body.filePath;

  Product.findOneAndUpdate(
    { _id: req.body.id },
    { $pull: { photos: filePath } },
    { new: true }
  )
    .then(updatedDocument => {
      if (updatedDocument) {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
            return res.status(200).json({ message: 'Array element deleted:', updatedDocument});
          } else {
            console.log('File deleted successfully');
          }
      });
      } else {
        return res.status(404).json('Document not found.');
      }
    })
    .catch(error => {
      return res.status(500).json('Error updating document:', error);
    });
  



}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  searchProducts,
  searchCateProducts,
  searchSimilarProduct,
  gegtImagesNames,
  deleteImages,
  updateViews,
  getRandomProducts
};
