const fs = require("fs");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path

process.on("message", (payload) => {
  const { tempFilePath, outputPath, url } = payload;

  const endProcess = (endPayload) => {
    const { statusCode, msg } = endPayload;
    fs.unlink(tempFilePath, (err) => {
      if (err) {
        process.send({ statusCode: 500, msg: { error: true, message: "Somethink went wrong", url: null } });
      }
    });
    process.send({ statusCode, msg });
    process.exit();
  };

  ffmpeg(tempFilePath)
    .setFfmpegPath(ffmpegPath)
    .fps(30)
    .addOptions([["-crf 24"]])
    .on('progress', (progress) => {
      console.log(`Processing: ${progress.timemark} done, file: ${outputPath}`);
    })
    .on("end", () => {
      console.log('video compress ended');
      endProcess({ statusCode: 200, msg: { error: false, message: "Video successful compressed and save", url }, path: outputPath });
    })
    .on("error", (err) => {
      endProcess({ statusCode: 500, msg: { error: true, message: err.message, url: null } });
    })
    .save(outputPath);
});