const Cart = require("../models/Cart");
const Product = require("../models/Product");

const calculateTotal = (cartItems, products) => {
  let total = 0;
  for (const item of cartItems) {
    const product = products.find(p => p._id.toString() === item.product.toString());
    if (product) {
      total += product.sellingPrice * item.quantity;
    }
  }
  return total;
};


const getUserCart = async (req, res) => {
    try {
        //console.log(req.user.id);
        const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

        if (!cart) {
            return res.status(200).json({
                items: [],
                total: 0
            });
        }

        const cartResponse = {
            items: cart.items,
            total: cart.total ?? 0,
        };

        res.status(200).json(cartResponse);
    } catch (error) {
        console.error("Error fetching user cart:", error);
        res.status(500).json({ error: "Server error while fetching cart." });
    }
};


const postAddItem = async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ error: "Invalid product ID or quantity" });
  }

  try {
    let cart = await Cart.findOne({ user: req.user.id });
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ error: "Product not found" });

    if (product.stock < quantity) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], total: 0 });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }
    const productsInCart = await Product.find({ _id: { $in: cart.items.map(i => i.product) } });
    cart.total = calculateTotal(cart.items, productsInCart);

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};


const putItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) return res.status(404).json({ error: "Item not found in cart" });

        item.quantity = quantity;

        cart.total = calculateTotal(cart.items, await Product.find({ _id: { $in: cart.items.map(i => i.product) } }));
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to update item quantity" });
    }
};

const deleteItem = async (req, res) => {
    const { productId } = req.params;
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        cart.total = calculateTotal(cart.items, await Product.find({ _id: { $in: cart.items.map(i => i.product) } }));
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error: "Failed to delete item" });
    }
};

const deleteClearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = [];
        cart.total = 0;
        await cart.save();

        res.status(200).json({ message: "Cart cleared" });
    } catch (error) {
        res.status(500).json({ error: "Failed to clear cart" });
    }
};

module.exports = {getUserCart, postAddItem, putItemQuantity, deleteItem, deleteClearCart};