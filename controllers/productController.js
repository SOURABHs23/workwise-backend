import Product from "../model/Product.js";
import User from "../model/User.js";

export const addProduct = async (req, res) => {
  const { name, category, description, price, discount } = req.body;
  try {
    const newProduct = new Product({
      name,
      category,
      description,
      price,
      discount,
      seller: req.user.id,
    });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, price, discount } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, description, price, discount },
      { new: true }
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    console.log("in get products");
    console.log(products);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.json({ msg: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const searchProducts = async (req, res) => {
  console.log("in search,", req.query);
  const { name, category } = req.query;
  try {
    let query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      query.category = { $regex: category, $options: "i" }; // Case-insensitive search
    }
    console.log("in search", query);
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the product is already in the cart
    const productExists = user.cart.find(
      (item) => item.toString() === productId
    );

    if (productExists) {
      return res.status(400).json({ msg: "Product already in cart" });
    }

    user.cart.push(productId);
    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const productExists = user.cart.find(
      (item) => item.toString() === productId
    );

    if (!productExists) {
      return res.status(400).json({ msg: "Product doent exit in cart" });
    }
    user.cart = user.cart.filter((item) => item.toString() !== productId);

    await user.save();

    // res.json(user.cart);
    res.send("product removed");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    console.log("in getcart", req.user);
    const user = await User.findById(req.user.id).populate("cart");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
