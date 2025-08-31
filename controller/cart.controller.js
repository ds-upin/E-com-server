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

// Complete
//DONE
const getUserCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

        if (cart) {
            //console.log("cart1",cart);
            cart.items = cart.items.filter(item => item.product !== null);
            cart.total = cart.items.reduce((sum, item) => {
                return sum + item.product.sellingPrice * item.quantity;
            }, 0);

            //Save the cleaned-up cart
            await cart.save();

            cart = await Cart.findById(cart._id).populate("items.product");
            //console.log("cart2",cart)

            return res.status(200).json({
                items: cart.items,
                total: cart.total,
                message: "Cart cleaned and updated."
            });
        } else {
            return res.status(200).json({
                items: [],
                total: 0,
                message: "Cart not found."
            });
        }

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


const patchItemQuantity = async (req, res) => {
    //console.log(req.body);
    const { productId, quantity } = req.body;

    if (quantity === undefined || quantity < 0) {
        return res.status(400).send({ msg: "Quantity must be 0 or greater" });
    }

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ error: "Item not found in cart" });

        if (quantity === 0) {
            // Remove the item from the cart
            cart.items.splice(itemIndex, 1);
        } else {
            // Update the quantity
            cart.items[itemIndex].quantity = quantity;
        }

        // Recalculate total
        const productIds = cart.items.map(i => i.product);
        const products = await Product.find({ _id: { $in: productIds } });

        cart.total = calculateTotal(cart.items, products);
        await cart.save();

        // Optionally repopulate before sending
        const updatedCart = await Cart.findById(cart._id).populate('items.product');

        return res.status(200).json(updatedCart);

    } catch (error) {
        console.error("Failed to patch item quantity:", error);
        return res.status(500).json({ error: "Failed to update item quantity" });
    }
};

const deleteItem = async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        if (cart.items.length === initialLength) {
            return res.status(404).json({ error: "Item not found in cart" });
        }

        const products = await Product.find({
            _id: { $in: cart.items.map(i => i.product) }
        });

        cart.total = calculateTotal(cart.items, products);
        await cart.save();

        return res.status(200).json({ message: "Item deleted", cart });
    } catch (error) {
        console.error("Error deleting cart item:", error);
        return res.status(500).json({ error: "Failed to delete item" });
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

module.exports = { getUserCart, postAddItem, patchItemQuantity, deleteItem, deleteClearCart };