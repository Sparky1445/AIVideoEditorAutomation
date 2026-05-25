import cv2, numpy as np, json, sys

def extract_color_profile(video_path, sample_count=30):
    cap = cv2.VideoCapture(video_path)
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    step  = max(1, total // sample_count)

    l_vals, a_vals, b_vals = [], [], []
    for i in range(0, total, step):
        cap.set(cv2.CAP_PROP_POS_FRAMES, i)
        ret, frame = cap.read()
        if not ret: break
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
        l_vals.append(float(np.mean(lab[:, :, 0])))
        a_vals.append(float(np.mean(lab[:, :, 1])))
        b_vals.append(float(np.mean(lab[:, :, 2])))

    cap.release()
    brightness = np.mean(l_vals)           # 0–255 (L channel)
    warmth     = np.mean(b_vals) - 128     # positive = warm/yellow, negative = cool/blue

    # Recommend a LUT based on the profile
    lut = 'warm_cinematic.cube' if warmth > 5 else \
          'cool_clean.cube'     if warmth < -5 else \
          'neutral_grade.cube'

    print(json.dumps({
        "brightness": round(brightness, 2),
        "warmth":     round(warmth, 2),
        "lutFile":    lut
    }))

if __name__ == '__main__':
    extract_color_profile(sys.argv[1])