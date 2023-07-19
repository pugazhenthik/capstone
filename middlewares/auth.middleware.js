const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  let token = req.headers.token;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } else {
    return res
      .status(401)
      .json({ message: "Authentication token is missing." });
  }
};

exports.isAdmin = async (req, res, next) => {
  this.isAuthenticated(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({ message: "Access forbbiden" });
    }
  });
};

exports.isSeller = async (req, res, next) => {
  this.isAuthenticated(req, res, () => {
    if (req.user.role === "seller") {
      next();
    } else {
      return res.status(403).json({ message: "Access forbbiden" });
    }
  });
};

exports.isAdminOrSeller = async (req, res, next) => {
  this.isAuthenticated(req, res, () => {
    if (req.user.role === "admin" || req.user.role === "seller") {
      next();
    } else {
      return res.status(403).json({ message: "Access forbbiden" });
    }
  });
};
