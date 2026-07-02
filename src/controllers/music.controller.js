const musicModel = require("../models/music.model");
const ablumModel = require("../models/album.model");
const jwt = require("jsonwebtoken");
const musicUpload = require("../services/storage.service");

async function createMusic(req, res) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "Please upload a music file",
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      try {
        if (err) {
          return res.status(403).json({
            message: "Invalid or expired token",
          });
        }

        // Only artist can create music
        if (decoded.role !== "artist") {
          return res.status(403).json({
            message: "Only artists can create music",
          });
        }

        const { title } = req.body;

        const result = await musicUpload.uploadFile(
          req.file.buffer.toString("base64"),
        );

        const music = await musicModel.create({
          uri: result.url,
          title,
          artist: decoded.id,
        });

        return res.status(201).json({
          message: "Music created successfully",
          music,
        });
      } catch (error) {
        return res.status(500).json({
          message: error.message,
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function createAlbum(req, res) {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "Only artists can create albums",
      });
    }

    const { title, musicsIds } = req.body;
    const album = await albumModel.create({
      title,
      musics: musicsIds,
      artist: decoded.id,
    });

    return res.status(201).json({
      message: "Album created successfully",
      album: {
        id: album._id,
        title: album.title,
        musics: album.musics,
        artist: album.artist,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  createMusic,
};
