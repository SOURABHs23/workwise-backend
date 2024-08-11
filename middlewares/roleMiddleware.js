export const isSeller = (req, res, next) => {
  if (req.user.role !== "seller") {
    return res
      .status(403)
      .json({ msg: "Access denied. Only sellers can perform this action." });
  }
  next();
};

export const isBuyer = (req, res, next) => {
  if (req.user && req.user.role === "buyer") {
    next();
  } else {
    res.status(403).json({ msg: "Only buyers can access this feature" });
  }
};
