const getAllUsers = (req, res) => {
  res.status(200).json({
    status: "succes",
    result: nfts.length,
    data: {
      nfts,
    },
  });
};

const getSingleUser = (req, res) => {
  res.status(200).json({
    status: "succes",
    data: {
      foundNFT,
    },
  });
};

const createUser = (req, res) => {
  res.status(200).json({
    status: "succes",
    data: {
      nfts,
    },
  });
};

const updateUser = (req, res) => {
  res.status(200).json({
    status: "succes",
    data: {
      nfts,
    },
  });
};

const deleteUser = (req, res) => {
  res.status(200).json({
    status: "succes",
    data: null,
  });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
};
