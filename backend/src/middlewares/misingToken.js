exports.missingToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ log: "No authorization header provided." });
  } else if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ log: "Invalid authorization header format." });
  } else {
    next();
  }
};
