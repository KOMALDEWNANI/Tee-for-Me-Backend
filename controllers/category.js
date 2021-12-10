const Category = require("../models/category");
const User = require("../models/user");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category)
      return res.status(400).json({
        error: "No such category found in DB",
      });
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category)
      return res.status(400).json({
        error: "Cannot save the category into the DB",
      });
    res.json(category);
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find({}).exec((err, categories) => {
    if (err || !categories)
      return res.status(400).json({
        error: "No categories found",
      });
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, category) => {
    if (err || !category)
      return res.status(400).json({
        error: "Cannot update the category",
      });
    res.json(category);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err)
      return res.status(400).json({
        error: "Cannot delete the category",
      });
    res.json({
      message: `Successfully deleted ${category}`,
    });
  });
};
