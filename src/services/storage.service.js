const ImageKit = require("imagekit");

const imgKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile(file) {
  try {
    const result = await imgKit.upload({
      file: file,
      fileName: "music_" + Date.now(),
      folder: "/spotify/music",
    });

    return result;
  } catch (error) {
    console.error("ImageKit Upload Error:", error);
    throw error;
  }
}

module.exports = {
  uploadFile,
};
