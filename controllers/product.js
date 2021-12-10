const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product)
        return res.status(400).json({
          error: "Cannot get that product",
        });
      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err)
      return res.status(400).json({
        error: "Problem with the file cannot save ",
      });

    //Destructure fields
    const { name, description, price, category, stock } = fields;
    //Validation
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please provide all the fields",
      });
    }

    const product = new Product(fields);

    //Deal with files
    if (file.photo) {
      if (file.photo.size > 3000000) {
        // get file size by multplying desired size with 1024*1024, here can't upload more than 3MB approx
        return res.status(400).json({
          error: "File too large to upload",
        });
      }
      //save file in the product
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;

      //save product in the database
      product.save((err, product) => {
        if (err)
          return res.status(400).json({
            error: "Cannot save the product",
          });
        res.json(product);
      });
    }
  });
};

exports.getProduct = (req, res) => {
  req.product.photo.data = undefined;
  return res.json(req.product);
};

//Middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((err, product) => {
    if (err)
      return res.status(400).json({
        error: "Cannot delete the product",
      });
    res.json(product);
  });
};

exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err)
      return res.status(400).json({
        error: "Problem with the file cannot save ",
      });

    var product = req.product;
    product = _.extend(product, fields); //modify product according to fields

    //Deal with files
    if (file.photo) {
      if (file.photo.size > 3000000) {
        // get file size by multplying desired size with 1024*1024, here can't upload more than 3MB approx
        return res.status(400).json({
          error: "File too large to upload",
        });
      }
      //save file in the product
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;

      //save product in the database
      product.save((err, product) => {
        if (err)
          return res.status(400).json({
            error: "Cannot update the product",
          });
        res.json(product);
      });
    }
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No product found ",
        });
      }
      res.json(products);
    });
};


exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err)
      return res.status(400).json({
        error: "Cannot get the categories",
      });
    res.json(categories);
  });
};

//Middlewares
exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update : {$inc: { stock: -1, sold: +1}},
        upsert: true
      },
    };
  });

  Product.bulkWrite(myOperations, {}, (err, products) => {
    
    if (err || !products)
      {console.log(products);
      console.log(err)
      return res.status(400).json({
        error: "Bulk Operation failed",
      })};
    next();
  });
};
