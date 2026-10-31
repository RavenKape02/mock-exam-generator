"""Generate Oplan Aral's raster art with the OpenAI Images API.

Run from the repo root:   python -I design/assets/generate.py [name ...]
With no names it makes every asset. Each image is saved to web-app/src/lib/assets/art/<name>.png,
and its prompt is written beside it as <name>.png.json so any image can be made again.

The key comes from ../Paper/codebase/.env (OPENAI_API_KEY) and is never printed.
base_url is passed explicitly because this machine has a stale OPENAI_BASE_URL.
"""

import base64
import json
import sys
from pathlib import Path

from openai import OpenAI

ROOT = Path(__file__).resolve().parents[2]
ENV = ROOT.parent / "Paper" / "codebase" / ".env"
OUT = ROOT / "web-app" / "src" / "lib" / "assets" / "art"
MODEL = "gpt-image-2.5-sunburst"

# Shared look: the "Pisara" palette (classroom chalkboard green + chalk yellow) in a soft matte 3D clay
# style. Prompts keep detail low and counts exact, because busy small details (crowded bubble grids,
# floating clutter, stray marks) are where image models go wrong.
STYLE = (
    "Soft matte 3D clay render, rounded simple forms, smooth surfaces, soft studio light from the upper left, "
    "one soft contact shadow. Palette only: chalkboard green #1F8A5B, deep board green #16352B, mint #E1F3E9, "
    "chalk yellow #F2D06B, warm white, a little graphite #1D1F24. No purple, violet or lavender. Clean and "
    "uncluttered, generous empty space. No text, letters, numbers or symbols on anything. No logos. No people."
)

BLOOM = (
    "a flower with exactly eight identical rounded petals evenly spaced around a smooth pearl-white centre"
)

SHEET = (
    "a single answer sheet card with exactly five neat rows of four round bubbles, perfectly aligned in a grid, "
    "with exactly one bubble filled solid green in each row; nothing else printed on the sheet"
)

ASSETS = {
    "auth-panel": {
        "size": "1024x1536",
        "background": "opaque",
        "prompt": (
            "Tall portrait still life for a log-in screen side panel, seen from a slightly high front angle. "
            f"Resting on a soft mint surface in the lower half: {SHEET}, one yellow pencil lying diagonally "
            f"across its lower corner, and two closed green books stacked beside it. Behind them, {BLOOM}, "
            "large, in green. The upper third is empty smooth background for a caption. Background: smooth "
            "vertical gradient from pale mint at the top to very pale chalk yellow at the bottom. " + STYLE
        ),
    },
    "hero": {
        "size": "1536x1024",
        "background": "transparent",
        "prompt": (
            "Isolated objects on a transparent background, three-quarter view from slightly above, grouped "
            f"tightly in the centre: {SHEET}, tilted slightly, with one yellow pencil resting across it; an open "
            f"book with blank pages to its left; and behind them {BLOOM} in green on a short stem with two "
            "leaves, plus one smaller identical flower in chalk yellow. Wide margins on all sides. " + STYLE
        ),
    },
    "empty-history": {
        "size": "1024x1024",
        "background": "transparent",
        "prompt": (
            "Small centred spot illustration on a transparent background for an empty list: a single blank "
            "answer sheet card with exactly four rows of four empty round bubbles, none filled, and one yellow "
            "pencil lying beside it, plus one small closed green flower bud. Calm, simple, lots of empty "
            "space. " + STYLE
        ),
    },
    "results": {
        "size": "1024x1024",
        "background": "transparent",
        "prompt": (
            f"Small centred spot illustration on a transparent background for an exam results screen: {SHEET}, "
            f"standing slightly tilted, with {BLOOM} in green resting on its top corner and one yellow pencil "
            "leaning against it. Quietly proud mood, simple, lots of empty space. " + STYLE
        ),
    },
    "bloom": {
        "size": "1024x1024",
        "background": "transparent",
        "prompt": (
            f"A single isolated cut-out on a transparent background, seen straight from the front: {BLOOM}, "
            "petals fading from white at the centre to chalkboard green #1F8A5B at the tips. No stem, no "
            "leaves. Centred, filling about 80% of the frame. " + STYLE
        ),
    },
    "bloom-chalk": {
        "size": "1024x1024",
        "background": "transparent",
        "prompt": (
            f"A single isolated cut-out on a transparent background, seen straight from the front: {BLOOM}, "
            "petals fading from white at the centre to chalk yellow #E2B13C at the tips, centre pale green. "
            "No stem, no leaves. Centred, filling about 80% of the frame. " + STYLE
        ),
    },
}


def load_key() -> str:
    for line in ENV.read_text(encoding="utf-8").splitlines():
        if line.startswith("OPENAI_API_KEY="):
            return line.split("=", 1)[1].strip().strip('"').strip("'")
    sys.exit(f"OPENAI_API_KEY not found in {ENV}")


def main() -> None:
    names = sys.argv[1:] or list(ASSETS)
    client = OpenAI(api_key=load_key(), base_url="https://api.openai.com/v1")
    OUT.mkdir(parents=True, exist_ok=True)
    for name in names:
        spec = ASSETS[name]
        result = client.images.generate(
            model=MODEL,
            prompt=spec["prompt"],
            size=spec["size"],
            background=spec["background"],
            output_format="png",
            quality="high",
            n=1,
        )
        path = OUT / f"{name}.png"
        path.write_bytes(base64.b64decode(result.data[0].b64_json))
        sidecar = {"model": MODEL, "size": spec["size"], "background": spec["background"], "prompt": spec["prompt"]}
        (OUT / f"{name}.png.json").write_text(json.dumps(sidecar, indent=2), encoding="utf-8")
        print(f"saved {path.relative_to(ROOT)}", flush=True)


if __name__ == "__main__":
    main()
