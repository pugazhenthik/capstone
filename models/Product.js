const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
{
    title:{
      type: String,
      required: true,
      min: 3,
      max: 200,
    },
    sku: {    
        type: String,
        required: true,
        min: 3,
        max: 20,
    },
    image: {        
      type: String
    },
    price: {
      type: Float,
      required: true,
      min: 1,
      max: 20,
    },
    qunatity: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    description: {
        type: String
    },
},
{ timestamps: true }
)

module.exports = mongoose.model("Product", productSchema);
