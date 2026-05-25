const ffmpeg = require('fluent-ffmpeg');
const { exec } = require('child_process');
const util = require('util');
const execP = util.promisify(exec);
const fs = require('fs');

async function ingestVideo(inputPath) {
    const { stdout } = await execP(
        `ffprobe   -print_format json -show_streams "${inputPath}"`
    );
    const meta = JSON.parse(stdout);

    const audioOut = inputPath.replace(/\.[^.]+$/, '_audio.wav');
    await new Promise((res, rej) =>
        ffmpeg(inputPath)
            .outputOptions(['-vn', '-acodec', 'pcm_s16le', '-ar', '44100'])
            .output(audioOut)
            .on('end', res).on('error', rej).run()
    );

    return { path: inputPath, meta, audioPath: audioOut };
}

module.exports = { ingestVideo };