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
        type: SchemaType.OBJECT,
        properties: {
            keepScenes: { type: SchemaType.ARRAY, items: { type: SchemaType.NUMBER } },
            cutOrder: { type: SchemaType.ARRAY, items: { type: SchemaType.NUMBER } },
            transitions: {
                type: SchemaType.ARRAY, items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        type: { type: SchemaType.STRING },
                        durationMs: { type: SchemaType.NUMBER }
                    }
                }
            },
            colorGrade: { type: SchemaType.STRING },
            captionStyle: { type: SchemaType.STRING },
            musicBeatSync: { type: SchemaType.BOOLEAN },
            doodleAnnotations: {
                type: SchemaType.ARRAY, items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        atSecond: { type: SchemaType.NUMBER },
                        type: { type: SchemaType.STRING },
                        label: { type: SchemaType.STRING },
                        x: { type: SchemaType.NUMBER },
                        y: { type: SchemaType.NUMBER }
                    }
                }
            },
            doodleInstructions: {
                type: SchemaType.ARRAY, items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        type: { type: SchemaType.STRING },
                        timing: { type: SchemaType.NUMBER },
                        duration: { type: SchemaType.NUMBER },
                        position: { type: SchemaType.STRING },
                        description: { type: SchemaType.STRING }
                    }
                }
            },
            zoomPunches: {
                type: SchemaType.ARRAY, items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        atSecond: { type: SchemaType.NUMBER },
                        scale: { type: SchemaType.NUMBER },
                        durationMs: { type: SchemaType.NUMBER }
                    }
                }
            },
            autoSuggestions: {
                type: SchemaType.ARRAY, items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        technique: { type: SchemaType.STRING },
                        reason: { type: SchemaType.STRING },
                        applyAt: { type: SchemaType.ARRAY, items: { type: SchemaType.NUMBER } }
                    }
                }
            }
        },
        required: [
            'keepScenes', 'cutOrder', 'transitions', 'colorGrade',
            'captionStyle', 'musicBeatSync', 'doodleAnnotations',
            'doodleInstructions', 'zoomPunches', 'autoSuggestions'
        ]
    };

    return editPlanSchema;

}



module.exports = { execP, exportSchema };