const mongoose = require("mongoose");

var categorySchema = mongoose.Schema({
      name:{
          type: String,
          trim: true,
          required: true,
          maxLength: 30,
          unique: true
      }




},{timestamps: true});


module.exports = mongoose.model("Category", categorySchema);


