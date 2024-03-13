const sharp = require("sharp");

const uploadUserProfile = async (req, res) => {
  try {
    const buffer = await sharp(req.file.buffer)
      .resize({ height: 250, width: 250 })
      .png()
      .toBuffer();
    req.user.photo = buffer;
    await req.user.save();

    res.status(200).json({
      status: "success",
      data: req.user,
      message: "Profile image uploaded.",
    });
  } catch (error) {
    console.log(error);
    res.status(200).json({
      status: "failure",
      data: null,
      message: "Failed to upload profile image!",
    });
  }
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    result: nfts.length,
    data: {
      nfts,
    },
  });
};

const getSingleUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      foundNFT,
    },
  });
};

const createUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      nfts,
    },
  });
};

const updateUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      nfts,
    },
  });
};

const deleteUser = (req, res) => {
  res.status(200).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  uploadUserProfile,
};
