const express = require("express");
const cors = require("cors");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");
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
app.use(cors());

// DATA Sanitization against nosql query injection
app.use(mongoSanitize());

// DATA Sanatization against site script xss
app.use(xssClean());

app.use(
  hpp({
    whitelist: [
      "duration",
      "price",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
    ],
  })
);

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
