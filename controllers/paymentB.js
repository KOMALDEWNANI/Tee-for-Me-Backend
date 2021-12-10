const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "ynpkw4hq47ksc6dy",
  publicKey: "c9pbhx5znnv4c872",
  privateKey: "a72ef665a2aeb612914773d677156f1a"
});

exports.getToken = (req, res) => {
    gateway.clientToken.generate({}, (err, response) => {
            if(err){
                res.status(500).send(err)
            } else{
                res.send(response)
            }
      });
}
exports.processPayment = (req, res) => {
    const nonceFromTheClient = req.body.paymentMethodNonce
    const amountFromTheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromTheClient ,
        paymentMethodNonce: nonceFromTheClient,
       
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
        if(err){
            res.status(500).send(err)
        } else{
            res.send(result)
        }
      });
}