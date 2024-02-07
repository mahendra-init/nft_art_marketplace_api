const NFT = require("../models/nftModel");

const getAllNfts = async (req, res) => {
  try {
    const nfts = await NFT.find();

    res.status(200).json({
      status: "success",
      result: nfts.length,
      data: {
        nfts,
      },
    });
  } catch (error) {
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

module.exports = {
  getAllNfts,
  getSingleNFT,
  createNFT,
  updateNFT,
  deleteNFT,
};
