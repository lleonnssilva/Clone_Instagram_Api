const Post = require("../models/Post");
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  async index(req, res) {
    const post = await Post.find({}).sort("-createdAt");
    return res.json(post);
  },
  async store(req, res) {
    const { author, place, description, hashtags } = req.body;
    const { filename: image } = req.file;
    const [name] = image.split(".");
    const filename = `${name}.jpg`;
    let jimpImg = await jimp.read(req.file.path);

    jimpImg
      .resize(200, 200)
      .write(path.resolve(req.file.destination, "resized", filename));

    fs.unlinkSync(req.file.path);

    const post = await Post.create({
      author,
      place,
      description,
      hashtags,
      image: filename
    });
    req.io.emit("post", post);
    return res.json(post);
  }
};
