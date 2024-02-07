const {
  getAllNfts,
  getSingleNFT,
  createNFT,
  updateNFT,
  deleteNFT,
} = require("../controllers/nftController");

const { Router } = require("express");

const nftRouter = Router();

nftRouter.route("/").get(getAllNfts).post(createNFT);
nftRouter.route("/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

module.exports = nftRouter;
