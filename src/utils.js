const { exec } = require('child_process');

function execP(cmd) {
    return new Promise((resolve, reject) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) reject(err);
            else resolve({ stdout, stderr });
        });
    });
}

function exportSchema() {


    const editPlanSchema = {
        type: "object",
        properties: {
            keepScenes: { type: "array", items: { type: "number" } },
            cutOrder: { type: "array", items: { type: "number" } },
            transitions: {
                type: "array", items: {
                    type: "object",
                    properties: {
                        type: { type: "string" },
                        durationMs: { type: "number" }
                    }
                }
            },
            colorGrade: { type: "string" },
            captionStyle: { type: "string" },
            musicBeatSync: { type: "boolean" },
            doodleAnnotations: {
                type: "array", items: {
                    type: "object",
                    properties: {
                        atSecond: { type: "number" },
                        type: { type: "string" },
                        label: { type: "string" },
                        x: { type: "number" },
                        y: { type: "number" }
                    }
                }
            },
            doodleInstructions: {
                type: "array", items: {
                    type: "object",
                    properties: {
                        type: { type: "string" },
                        timing: { type: "number" },
                        duration: { type: "number" },
                        position: { type: "string" },
                        description: { type: "string" }
                    }
                }
            },
            zoomPunches: {
                type: "array", items: {
                    type: "object",
                    properties: {
                        atSecond: { type: "number" },
                        scale: { type: "number" },
                        durationMs: { type: "number" }
                    }
                }
            },
            autoSuggestions: {
                type: "array", items: {
                    type: "object",
                    properties: {
                        technique: { type: "string" },
                        reason: { type: "string" },
                        applyAt: { type: "array", items: { type: "number" } }
                    }
                }
            }
        },
        required: [
            "keepScenes", "cutOrder", "transitions", "colorGrade",
            "captionStyle", "musicBeatSync", "doodleAnnotations",
            "doodleInstructions", "zoomPunches", "autoSuggestions"
        ]
    };

    return editPlanSchema;

}



module.exports = { execP, exportSchema };