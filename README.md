# Image Text Overlay

A lightweight Flask web application that lets you upload an image, stamp bold text onto it, and instantly download the result — all from the browser with no sign-up required.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Configuration](#configuration)
- [Font Resolution](#font-resolution)
- [Limitations](#limitations)
- [Contributing](#contributing)

---

## Features

- **Drag-and-drop upload** — drop an image onto the page or click to browse.
- **Live preview** — see the selected image before processing.
- **Bold text overlay** — text is rendered in large, bold type with a black stroke outline and an indigo fill (`#4f46e5`).
- **Fixed output size** — every result is normalised to **1280 × 720 px** (16:9).
- **One-click download** — the processed PNG is returned directly to the browser and a download link is shown in-page.
- **No external dependencies in the browser** — pure HTML/CSS/JS frontend.

---

## Demo

1. Open the app in a browser.
2. Upload any image (PNG, JPG, GIF, or WEBP).
3. Type the text you want to overlay.
4. Click **Apply Text & Download** — the image with the overlay appears below the form.
5. Click **⬇ Download Image** to save the PNG.

---

## How It Works

```
Browser                          Flask server
  │                                   │
  │──── POST /process ──────────────► │
  │     (multipart: image + text)      │  1. Validate file type & text
  │                                   │  2. Open image with Pillow
  │                                   │  3. Resize to 1280×720
  │                                   │  4. Load bold font (Arial / DejaVu fallback)
  │                                   │  5. Draw black outline (±5 px offsets)
  │                                   │  6. Draw indigo text on top
  │◄─── PNG response ───────────────  │  7. Return PNG as file download
```

The text is drawn at position `(50, 500)` — roughly the lower-left quarter of the frame — using a font size of **120 pt**.

---

## Project Structure

```
Utilities/
├── app.py              # Flask application (routes + image processing logic)
├── requirements.txt    # Python dependencies
└── templates/
    └── index.html      # Single-page UI (HTML + CSS + vanilla JS)
```

---

## Requirements

| Dependency | Version | Purpose |
|-----------|---------|---------|
| Python    | 3.9+    | Runtime |
| Flask     | 3.1.0   | Web framework & routing |
| Pillow    | 12.2.0  | Image manipulation |

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/arundamo/Utilities.git
cd Utilities
```

### 2. Create a virtual environment (recommended)

```bash
python -m venv .venv
source .venv/bin/activate        # macOS / Linux
.venv\Scripts\activate           # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

---

## Running the App

### Development

```bash
python app.py
```

The server starts at **http://127.0.0.1:5000** by default.

To enable Flask's debug mode (auto-reload on code changes):

```bash
FLASK_DEBUG=1 python app.py
```

### Production

Use a production WSGI server such as **Gunicorn**:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

---

## Usage

1. Navigate to `http://localhost:5000`.
2. Click the upload area (or drag an image onto it).  
   Accepted formats: **PNG, JPG, JPEG, GIF, WEBP** — maximum **16 MB**.
3. Enter the text you want to stamp onto the image.
4. Click **Apply Text & Download**.
5. The processed image is previewed on the page; click **⬇ Download Image** to save it.

---

## API Reference

### `GET /`

Returns the main HTML page.

---

### `POST /process`

Applies text to the uploaded image and returns the result as a PNG file.

**Request** — `multipart/form-data`

| Field   | Type   | Required | Description |
|---------|--------|----------|-------------|
| `image` | file   | ✅       | Image file (PNG / JPG / JPEG / GIF / WEBP, ≤ 16 MB) |
| `text`  | string | ✅       | Text string to overlay onto the image |

**Responses**

| Status | Body / Content-Type | Description |
|--------|---------------------|-------------|
| `200 OK` | `image/png` (file attachment `updated_image.png`) | Processed image |
| `400 Bad Request` | `text/plain` | Missing file, empty filename, unsupported format, or empty text |

**Example with `curl`**

```bash
curl -X POST http://localhost:5000/process \
  -F "image=@photo.jpg" \
  -F "text=Hello World" \
  --output result.png
```

---

## Configuration

| Environment variable | Default | Description |
|----------------------|---------|-------------|
| `FLASK_DEBUG`        | `0`     | Set to `1` to enable debug / auto-reload mode |

The maximum upload size is hard-coded to **16 MB** (`app.config["MAX_CONTENT_LENGTH"]`). Change the value in `app.py` if needed.

---

## Font Resolution

The app tries to load a bold TrueType font in this order:

1. `arialbd.ttf` — Arial Bold (available on Windows / macOS when installed)
2. `/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf` — DejaVu Sans Bold (common on Linux)
3. Pillow's built-in bitmap font (fallback — smaller and not scalable)

For best results on a server, install the DejaVu fonts:

```bash
# Debian / Ubuntu
sudo apt-get install fonts-dejavu-core

# Alpine
apk add ttf-dejavu
```

---

## Limitations

- Text position and font size are fixed (`x=50, y=500`, `120 pt`). Long strings may overflow the image boundary.
- Output is always **1280 × 720 px** regardless of the original image dimensions.
- Only a single line of text is supported.
- No authentication or rate limiting — intended for personal / internal use.

---

## Contributing

1. Fork the repository and create a feature branch.
2. Make your changes and ensure the app runs without errors.
3. Open a pull request with a clear description of the change.
