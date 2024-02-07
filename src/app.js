const express = require("express");
require("dotenv").config();
require("./db/mongoose");
const morgan = require("morgan");
const nftRouter = require("./routers/nftRouter");
const userRouter = require("./routers/userRouter");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.static(`${__dirname}/src/nft-data/img`));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the NFT Marketplace",
  });
});
// Routes
app.use("/api/v1/nfts", nftRouter);
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
  console.log("Server up and running on port: ", PORT);
});
