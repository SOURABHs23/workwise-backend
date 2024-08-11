import express from "express";
import {
  addProduct,
  editProduct,
  getProduct,
  getProducts,
  deleteProduct,
  searchProducts,
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/productController.js";
import auth from "../middlewares/authMiddleware.js";
import { isSeller, isBuyer } from "../middlewares/roleMiddleware.js"; // Import the role-checking middleware

const productRoutes = express.Router();

// seller route
productRoutes.post("/add", auth, isSeller, addProduct); // Only sellers can add products
productRoutes.put("/edit/:id", auth, isSeller, editProduct); // Only sellers can edit products
productRoutes.delete("/delete/:id", auth, isSeller, deleteProduct); // Only sellers can delete products

productRoutes.get("/all", getProducts);

//buyer can search
productRoutes.get("/search", searchProducts);

//cart route
productRoutes.post("/cart/add", auth, isBuyer, addToCart); // Add product to cart (buyers only)
productRoutes.post("/cart/remove", auth, isBuyer, removeFromCart); // Remove product from cart (buyers only)
productRoutes.get("/cart", auth, isBuyer, getCart); // Get user's cart (buyers only)

//
productRoutes.get("/:id", getProduct);

export default productRoutes;
