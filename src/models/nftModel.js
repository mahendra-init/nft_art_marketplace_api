const mongoose = require("mongoose");
const slugify = require("slugify");

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "NFT must have a name"],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: String,
      required: [true, "must provide duration"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "must have a group size"],
    },
    difficulty: {
      type: String,
      required: [true, "must have a difficulty"],
    },
    ratingsAverage: {
      type: Number,
      default: 4,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "must provide a description"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Nft must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          "Discount price must be less than price. Please enter a lower amount.",
      },
    },
    imageCover: {
      type: String,
      required: [true, "Must provide an image url for the cover photo"],
    },
    images: [String],
    startDates: [Date],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

nftSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

//MONGOOSE MIDDLEWARE
nftSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
