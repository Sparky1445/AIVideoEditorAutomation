const { execP } = require('../utils');
const { analysePacing } = require('./pacing');

async function analyseSamples(samplePaths) {
    // Average style across all sample videos
    const pacings = await Promise.all(samplePaths.map(analysePacing));
    const avgCut = pacings.reduce((a, b) => a + b.avgCutSeconds, 0) / pacings.length;

    // Run Python colour analyser on first sample
    const { stdout } = await execP(`python src/analyse/colorgrade.py "${samplePaths[0]}"`);
    const color = JSON.parse(stdout);

    return {
        pacing: {
            avgCutSeconds: +avgCut.toFixed(2),
            style: avgCut < 2 ? 'fast-cut' : avgCut < 4 ? 'medium' : 'cinematic'
        },
        color,
        transitions: {
            primary: avgCut < 2 ? 'hard-cut' : 'cross-dissolve',
            durationMs: avgCut < 2 ? 0 : 200,
        },
    };
}

module.exports = { analyseSamples };