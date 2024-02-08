const {
  getAllNfts,
  getSingleNFT,
  createNFT,
  updateNFT,
  deleteNFT,
  getNFTStats,
  getMonthlyPlan,
} = require("../controllers/nftController");
const aliasTopNFTs = require("../middleware/top-5-nfts");

const { Router } = require("express");

const nftRouter = Router();

nftRouter.route("/top-5-nfts").get(aliasTopNFTs, getAllNfts);
nftRouter.route("/nft-stats").get(getNFTStats);
nftRouter.route("/monthly-plan/:year").get(getMonthlyPlan);
nftRouter.route("/").get(getAllNfts).post(createNFT);
nftRouter.route("/:id").get(getSingleNFT).patch(updateNFT).delete(deleteNFT);

module.exports = nftRouter;
