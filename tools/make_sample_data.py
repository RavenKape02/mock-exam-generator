"""Copy a small set of real UPCAT bank questions into the prototype's sample data.

Run from the repo root:  python -I tools/make_sample_data.py
Reads ../Paper/Question Bank/UPCAT/bank, writes web-app/src/lib/data/sample-questions.json
and copies the figures it uses into web-app/static/figures/.
"""

import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BANK = ROOT.parent / "Paper" / "Question Bank" / "UPCAT" / "bank"
OUT_JSON = ROOT / "web-app" / "src" / "lib" / "data" / "sample-questions.json"
OUT_FIG = ROOT / "web-app" / "static" / "figures"

SUBJECTS = [
    ("mathematics.json", "math", "Mathematics"),
    ("science.json", "science", "Science"),
    ("reading-comprehension.json", "reading", "Reading Comprehension"),
    ("language-proficiency.json", "language", "Language Proficiency"),
]
PER_SUBJECT = 8
# Inline math is shown as plain text in the prototype; anything heavier is skipped.
HEAVY_TEX = re.compile(r"\\(frac|sqrt|sum|int|begin|left|right|cdot|times|div|pi|theta|circ|le|ge|ne)")


def plain(text: str | None) -> str | None:
    return None if text is None else text.replace("$", "")


def usable(q: dict) -> bool:
    texts = [q["stem"]] + [o["text"] for o in q["options"]]
    return not any(HEAVY_TEX.search(t) for t in texts)


def pick(data: dict) -> list[dict]:
    questions = [q for q in data["questions"] if usable(q)]
    chosen: list[dict] = []
    if "passages" in data:
        # One passage with its questions, so the passage panel has real content.
        first = next(q for q in questions if q.get("passage_id") and not q.get("figure"))
        chosen += [q for q in questions if q.get("passage_id") == first["passage_id"]][:4]
    figure = next((q for q in questions if q.get("figure") and not q.get("passage_id")), None)
    if figure:
        chosen.append(figure)
    # Fill the rest round-robin across topics.
    by_topic: dict[str, list[dict]] = {}
    for q in questions:
        if q not in chosen and not q.get("passage_id"):
            by_topic.setdefault(q["topic"], []).append(q)
    while len(chosen) < PER_SUBJECT and any(by_topic.values()):
        for topic in list(by_topic):
            if by_topic[topic] and len(chosen) < PER_SUBJECT:
                chosen.append(by_topic[topic].pop(0))
    return chosen


def main() -> None:
    if not BANK.exists():
        sys.exit(f"Bank not found: {BANK}")
    OUT_FIG.mkdir(parents=True, exist_ok=True)
    out = {"exam": "UPCAT", "subjects": []}
    for filename, slug, name in SUBJECTS:
        data = json.loads((BANK / filename).read_text(encoding="utf-8"))
        chosen = pick(data)
        passage_ids = {q["passage_id"] for q in chosen if q.get("passage_id")}
        for q in chosen:
            if q.get("figure"):
                src = BANK / q["figure"]
                shutil.copy2(src, OUT_FIG / src.name)
                q["figure"] = f"figures/{src.name}"
        out["subjects"].append(
            {
                "slug": slug,
                "name": name,
                "topics": data["topics"],
                "passages": [
                    {"id": p["id"], "text": p["text"]}
                    for p in data.get("passages", [])
                    if p["id"] in passage_ids
                ],
                "questions": [
                    {
                        "id": q["id"],
                        "topic": q["topic"],
                        "passageId": q.get("passage_id"),
                        "stem": plain(q["stem"]),
                        "figure": q.get("figure"),
                        "options": [{"label": o["label"], "text": plain(o["text"])} for o in q["options"]],
                        "key": q["key"],
                        "explanation": plain(q.get("explanation")),
                    }
                    for q in chosen
                ],
            }
        )
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(out, ensure_ascii=False, indent="\t"), encoding="utf-8")
    counts = ", ".join(f"{s['slug']} {len(s['questions'])}" for s in out["subjects"])
    print(f"Wrote {OUT_JSON.relative_to(ROOT)} ({counts})")


if __name__ == "__main__":
    main()
