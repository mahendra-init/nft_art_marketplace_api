const NFT = require("../models/nftModel");
const APIFeatures = require("../utils/apiFeatures");

const getAllNfts = async (req, res) => {
  try {
    const features = new APIFeatures(NFT.find(), req.query)
      .filter()
      .sort()
      .fields()
      .paginate();

    const nfts = await features.query;

    res.status(200).json({
      status: "success",
      result: nfts.length,
      data: {
        nfts,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
    });
  }
};

const getSingleNFT = async (req, res) => {
  try {
    // Find the single nft with the given id from the url params
    const nft = await NFT.findById(req.params.id);

    if (!nft) {
      return res.status(404).json({
        status: "failure",
        message: "NFT not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        nft,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
    });
  }
};

const createNFT = async (req, res) => {
  try {
    const newNFT = await NFT.create(req.body);
    console.log(`Created a new NFT: ${newNFT.name}`);
    res.status(201).json({
      status: "success",
      data: {
        newNFT,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "failure",
      message: error.message,
    });
  }
};

const updateNFT = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const validUpdates = [
      "name",
      "duration",
      "maxGroupSize",
      "difficulty",
      "ratingsAverage",
      "ratingsQuantity",
      "price",
      "summary",
      "description",
      "imageCover",
      "images",
      "startDates",
    ];
    const isValidUpdate = updates.every((update) =>
      validUpdates.includes(update)
    );
    if (!isValidUpdate) {
      return res.status(400).send("Invalid Update Field!");
    }
    const nft = await NFT.findOne({ _id: req.params.id });
    if (!nft) {
      return res.status(404).send({
        status: "failure",
        message: `No NFT with the id of ${req.params.id} was found.`,
      });
    }

    updates.forEach((update) => (nft[update] = req.body[update]));
    const updatedNFT = await nft.save();

    res.status(200).json({
      status: "success",
      data: {
        updatedNFT,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
    });
  }
};

const deleteNFT = async (req, res) => {
  try {
    const nft = await NFT.findByIdAndDelete(req.params.id);
    if (!nft) {
      return res.status(404).json({
        status: "failure",
        message: `The NFT with the id "${req.params.id}" was not found!`,
      });
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
    });
  }
};

const getNFTStats = async (req, res) => {
  try {
    const stats = await NFT.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }, // Filtering out all the NFTs that have a rating less than or equal to 4
      },
      {
        $group: {
          _id: "$difficulty",
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: {
        stats,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await NFT.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$startDates",
          },
          nftCount: { $sum: 1 },
          nfts: { $push: "$name" },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      results: plan.length,
      data: {
        plan,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failure",
      message: "Internal Server Error",
    });
  }
};
module.exports = {
  getAllNfts,
  getSingleNFT,
  createNFT,
  updateNFT,
  deleteNFT,
  getNFTStats,
  getMonthlyPlan,
};
