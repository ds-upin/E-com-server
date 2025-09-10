require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./connections");

const cartRouter = require("./routes/cart.routes");
const adminRouter = require("./routes/admin-panel.routes");
const authRouter = require("./routes/auth.routes");
const orderRouter = require("./routes/order.routes");
const productRouter = require("./routes/product.routes");
const userRouter = require("./routes/user.routes");

const PORT = process.env.PORT;
const APP_NAME = process.env.APP_NAME || "Ecom";
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI);

const app = express();

app.use(cors({
    origin: "https://e-com-front-sage.vercel.app",
    credentials: true
}));
app.options('*', cors({
  origin: "https://e-com-front-sage.vercel.app",
  credentials: true
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads', {
    setHeaders: (res, path) => {
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));


//app.use("/uploads",express.static(path.join(__dirname,"uploads")))

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use('/api/admin-panel', adminRouter);

app.listen(PORT, (err) => {
    if (err) console.log("Error in server setup");
    console.log(APP_NAME, " [Server listening on port:", PORT, "]");
});