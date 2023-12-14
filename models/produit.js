const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  statusProd: {
    type: String,
    enum: ['en arrivage', 'en stock', 'épuisé','archivé','Vendu'],
    default: 'en stock',

  },
  nb_views:{
    type: Number,
    default:0
  },
  category: {
    type: String,
  },
  marque: {
    type: String,
  },
  etat: {
    type: String,
  },
  taille: {
    type: String,
  },
  matieres: {
    type: String,
  },
  couleur: {
    type: String,
  },
  status: {
    type: String,
  },
  livraion:{
    type: String,
  },
  owner:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  image: {
    type: [String],
  },
  desc: {
    type: String
  }

},{ timestamps: true});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
