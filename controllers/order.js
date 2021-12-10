const { ProductCart, Order } = require("../models/order");

exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err || !order)
        return res.status(400).json({
          error: "Cannot find the order",
        });
      req.order = order;
      next();
    });
};

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const ord = new Order(req.body)
  ord.save((err, order) => {
    if (err || !order)
      return res.status(400).json({
        error: "Cannot push the order into the DB",
      });
    res.json(order);
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "name email")
    .exec((err, orders) => {
      if (err || !orders)
        return res.status(400).json({
          error: "Cannot get the orders",
        });
      res.json(orders);
    });
};

exports.getOrderStatus = (req, res) => {
  return Order.schema.path("status").enumValues;
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, order) => {
      if (err || !order)
        return res.status(400).json({
          error: "Cannot update the order",
        });
      res.json(order);
    }
  );
};
