const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user)
      return res.status(400).json({
        error: "No such user found in DB",
      });
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //TODO: Get back here for passwords
  req.profile.salt = undefined;
  req.profile.encry_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;

  res.json(req.profile);
};

// exports.getallUsers = (req, res) => {
//   User.find({}, (err, users) => {
//     if(err || !users)
//       return res.status(400).json({
//         error: "No user exists"
//       })
//     res.json(users)
//   })
// }
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    {
      _id: req.profile._id,
    },
    {
      $set: req.body,
    },
    { new: true, useFindAndModify: false },
    (err, user) => {
      if (err) {
        return res.status(400).json({
          error: "You are not allowed to do this",
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.getuserPurchaseList = (req, res) => {
    Order.find({ user: req.profile._id })
    .populate("user", "_id name")  
    .exec((err, order) => {
      if (err || !order)
        return res.status(400).json({
          error: "No order found for the user",
        });
      res.json(order);
    });
};

// middleware
exports.pushOrderInPurchaseList = (req, res, next) => {
      let purchases = []
      req.body.order.products.forEach(product => {
        purchases.push({
          _id: product._id,
          name: product.name,
          description: product.description,
          amount: req.body.order.amount,
          transaction_id: req.body.order.transaction_id
        })
      });


      //update purchases in database
      User.findOneAndUpdate({_id: req.profile._id},
        {$push: {purchases: purchases}},
        {new: true, useFindAndModify: false },
        (err, purchases) =>{
            if(err)
               return res.status(400).json({
                 error: "Cannot update the purchase List"
               })
            next();
        }
        
        )}

