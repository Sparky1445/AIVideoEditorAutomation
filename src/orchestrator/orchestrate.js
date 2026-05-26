// const Anthropic = require('@anthropic-ai/sdk');
// const config = require('../../config.json');
// const client = new Anthropic({ apiKey: config.anthropicKey });

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../../config.json');
const genAI = new GoogleGenerativeAI(config.geminiKey);
const editPlanFunction = require('../utils.js');

async function generateEditPlan({ scenes, styleProfile, theme, effects }) {
    const prompt = `
You are a professional video editor. Given the data below, output ONLY a valid JSON edit plan.

THEME: ${theme}
EFFECTS REQUESTED: ${effects.join(', ')}

STYLE PROFILE:
${JSON.stringify(styleProfile, null, 2)}

NUMBER OF SCENES DETECTED: ${scenes.length}

## Auto-Suggestion Rule
After cloning the detected style from sample videos, you MUST suggest 2–4 additional
techniques that are NOT present in the sample but are commonly paired with that style.
Base your suggestions on the content type from THEME above:
- "reels/shorts" → suggest: speed ramps, zoom punches, glitch transitions, beat drops
- "educational"  → suggest: text callouts, chapter markers, recap overlays, highlight boxes
- "shayari/poetic" → suggest: slow dissolves, vignette, letter-by-letter text reveal, ambient music fade
Never apply auto-suggestions automatically — only list them so the user can accept or reject.


Return JSON in this EXACT structure — no other text:
{
  "keepScenes": [0, 1, 3],
  "cutOrder":   [0, 3, 1],
  "transitions": [
    { "type": "hard-cut",       "durationMs": 0 },
    { "type": "cross-dissolve", "durationMs": 200 }
  ],
  "colorGrade": "apply_lut",
  "doodleAnnotations": [
    { "atSecond": 3.2, "type": "arrow",    "label": "look here!", "x": 0.5, "y": 0.4 },
    { "atSecond": 8.0, "type": "stickman", "label": "explaining" }
  ],
  "captionStyle":   "bold-bottom",
  "musicBeatSync":  true,
  "zoomPunches":  [{ "atSecond": 5.0, "scale": 1.08, "durationMs": 300 }]
}`;

    // const msg = await client.messages.create({
    //     model: 'claude-opus-4-6',
    //     max_tokens: 2048,
    //     messages: [{ role: 'user', content: prompt }],
    // });


    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
        responseSchema: editPlanFunction.exportSchema()
        
    });

    // Strip any markdown fences if Claude wraps it
    // const raw = msg.content[0].text.replace(/```json|```/g, '').trim();
    // return JSON.parse(raw);

    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    return JSON.parse(raw);


}

module.exports = { generateEditPlan };