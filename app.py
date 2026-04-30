import io
import os

from flask import Flask, render_template, request, send_file
from PIL import Image, ImageDraw, ImageFont

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB upload limit

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif", "webp"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def overlay_text(image_file, text: str) -> io.BytesIO:
    img = Image.open(image_file).convert("RGBA")
    img = img.resize((1280, 720), Image.Resampling.LANCZOS)

    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("arialbd.ttf", 120)
    except OSError:
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 120)
        except OSError:
            font = ImageFont.load_default()

    text_pos = (50, 500)
    outline_color = "black"
    text_color = "#4f46e5"

    for adj in range(-5, 6):
        draw.text((text_pos[0] + adj, text_pos[1]), text, font=font, fill=outline_color)
        draw.text((text_pos[0], text_pos[1] + adj), text, font=font, fill=outline_color)

    draw.text(text_pos, text, font=font, fill=text_color)

    output = io.BytesIO()
    img.convert("RGB").save(output, "PNG")
    output.seek(0)
    return output


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html")


@app.route("/process", methods=["POST"])
def process():
    if "image" not in request.files:
        return "No image file provided", 400

    file = request.files["image"]
    text = request.form.get("text", "").strip()

    if file.filename == "":
        return "No image selected", 400

    if not allowed_file(file.filename):
        return "Invalid file type. Allowed types: png, jpg, jpeg, gif, webp", 400

    if not text:
        return "No text provided", 400

    output = overlay_text(file.stream, text)

    return send_file(
        output,
        mimetype="image/png",
        as_attachment=True,
        download_name="updated_image.png",
    )


if __name__ == "__main__":
    debug = os.environ.get("FLASK_DEBUG", "0") == "1"
    app.run(debug=debug)
