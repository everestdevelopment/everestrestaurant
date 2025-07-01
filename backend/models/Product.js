import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  nameKey: {
    type: String,
    required: true,
    trim: true,
  },
  descriptionKey: {
    type: String,
    required: true,
  },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { 
    type: String, 
    default: 'appetizers',
    enum: [
      'appetizers',
      'main_courses', 
      'desserts',
      'beverages',
      'pizza',
      'pasta',
      'salads',
      'seafood',
      'steaks',
      'soups',
      'grilled',
      'vegan',
      'sushi',
      'sandwiches',
      'breakfast',
      'kids',
      'specials',
      'cocktails',
      'smoothies'
    ]
  },
  rating: { type: Number, default: 4.5 },
  quantity: { type: Number, min: 0, required: false },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);
export default Product; 