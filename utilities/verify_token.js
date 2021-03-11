const jwt = require("jsonwebtoken");

module.exports.verifyToken = (req, res, next) => {
  var token = req.body.token || req.query.token || req.headers["token"];
  // decode token
  if (token) {
    console.log("token", token);
    jwt.verify(token.split(" ")[1], "vnrvjrekrke", function (err, decoded) {
      if (err) {
        console.log("error", err);
        return res.status(401).json({
          success: false,
          message: "Unauthorized user!",
          status: 401,
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(400).json({
      success: false,
      message: "No token provided.",
      status: 400,
    });
  }
};
