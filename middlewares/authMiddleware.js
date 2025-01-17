import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.header("authorization");
  console.log("in auth");
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("in auth token", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export default auth;
