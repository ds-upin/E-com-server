const Product = require("../models/Product");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../cloudinary");

// Add lazy loading
// @desc Get all the product
// Done
const getAllProduct = async (req, res) => {
    try {
        const products = await Product.find().select("-costPrice");
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// @desc 
// USER
// DONE
const getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select("-costPrice");
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

//ADMIN
// DONE

const postCreateProduct = async (req, res) => {
    try {
        const {
            name,
            slug,
            description,
            costPrice,
            sellingPrice,
            category,
            stock,
        } = req.body;

        let imageUrl = null;

        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: "products",
                        resource_type: "image",
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );

                stream.end(req.file.buffer);
            });

            imageUrl = uploadResult.secure_url;
        }

        const newProduct = new Product({
            name,
            slug,
            description,
            costPrice,
            sellingPrice,
            category,
            stock,
            image: imageUrl ? [{ url: imageUrl }] : [],
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error("Product creation failed:", err);
        res.status(500).json({ error: "Failed to create product" });
    }
};


// ADMIN
// DONE
const putUpdateProduct = async (req, res) => {
    try {

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        Object.assign(product, req.body);
        await product.save();

        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// ADMIN
// @desc Delete a product by ID
// DONE
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete image file from filesystem
        if (product.image && product.image.length > 0) {
            product.image.forEach((img) => {
                const imagePath = path.join(__dirname, "..", img.url.replace(`${req.protocol}://${req.get("host")}`, "."));
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.error("Failed to delete image:", err.message);
                    }
                });
            });
        }

        await product.deleteOne();

        res.status(200).json({ message: "Product and image deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllProduct, getProductDetails, postCreateProduct, putUpdateProduct, deleteProduct };