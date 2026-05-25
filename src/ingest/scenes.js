const ffmpeg = require('fluent-ffmpeg');

async function detectScenes(inputPath, threshold = 0.1) {
    const scenes = [{ start: 0 }];
    const nullOut = process.platform === 'win32' ? 'NUL' : '/dev/null';

    console.log(`Detecting scenes with threshold ${threshold}`);

    await new Promise((res, rej) =>

        ffmpeg(inputPath)
            .outputOptions([
                '-vf', `select=gt(scene\\,${threshold}),showinfo`,
                '-vsync', 'vfr', '-f', 'null'
            ])
            .output(nullOut)
            .on('stderr', line => {

                //Debug to see if stderr is working
                // console.log(line);
                // FFmpeg showinfo outputs: pts_time:X
                const m = line.match(/pts_time:([\d.]+)/);
                if (m) scenes.push({ start: parseFloat(m[1]) });
            })
            .on('end', res).on('error', rej).run()
    ).then(() => console.log('Scene detection complete'));

    // Add end timestamps
    scenes.forEach((s, i) => s.end = scenes[i + 1]?.start ?? Infinity);
    return scenes;
}

module.exports = { detectScenes };