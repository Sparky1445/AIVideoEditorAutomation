const { detectScenes } = require('../ingest/scenes');

async function analysePacing(samplePath) {
    const scenes = await detectScenes(samplePath);
    const durations = scenes
        .map((s, i) => (scenes[i + 1]?.start ?? s.end) - s.start)
        .filter(d => d > 0 && isFinite(d));

    if (durations.length === 0) {
        return { avgCutSeconds: null, variance: null, style: "Unknown", totalScenes: 1 };
    }

    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    const variance = Math.sqrt(
        durations.reduce((a, d) => a + Math.pow(d - avg, 2), 0) / durations.length
    );

    return {
        avgCutSeconds: +avg.toFixed(2),
        variance: +variance.toFixed(2),
        style: avg < 2 ? 'fast-cut' : avg < 4 ? 'medium' : 'cinematic',
        totalScenes: scenes.length,
    };
}

module.exports = { analysePacing };