"""
Convert v10-presentation-cue-sheet.md to a printable PDF.
Run: python docs/poster/generate_cue_sheet_pdf.py
"""

import re
from pathlib import Path

from fpdf import FPDF

HERE = Path(__file__).parent
MD = HERE / "v10-presentation-cue-sheet.md"
OUT = HERE / "v10-presentation-cue-sheet.pdf"

FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_REG = str(FONT_DIR / "arial.ttf")
FONT_BOLD = str(FONT_DIR / "arialbd.ttf")
FONT_ITALIC = str(FONT_DIR / "ariali.ttf")


def sanitize(text: str) -> str:
    replacements = {
        "\u2014": "-",
        "\u2013": "-",
        "\u2265": ">=",
        "\u2192": "->",
        "\u00b7": "-",
        "\u2022": "-",
        "\u2018": "'",
        "\u2019": "'",
        "\u201c": '"',
        "\u201d": '"',
        "\u2194": "<->",
    }
    for old, new in replacements.items():
        text = text.replace(old, new)
    return text.encode("latin-1", errors="replace").decode("latin-1")


class CueSheetPDF(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.add_font("Arial", "", FONT_REG)
        self.add_font("Arial", "B", FONT_BOLD)
        self.add_font("Arial", "I", FONT_ITALIC)
        self.set_auto_page_break(auto=True, margin=18)
        self.set_margins(18, 18, 18)

    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Arial", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 6, "UniSchedule AI v10 - Presentation Cue Sheet", align="C", new_x="LMARGIN", new_y="NEXT")
        self.ln(2)

    def footer(self):
        self.set_y(-12)
        self.set_font("Arial", "I", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, f"Page {self.page_no()}", align="C")

    def h1(self, text: str):
        self.ln(4)
        self.set_font("Arial", "B", 16)
        self.set_text_color(20, 31, 74)
        self.multi_cell(0, 8, sanitize(text))
        self.ln(2)

    def h2(self, text: str):
        self.ln(3)
        self.set_font("Arial", "B", 13)
        self.set_text_color(31, 111, 192)
        self.multi_cell(0, 7, sanitize(text))
        self.ln(1)

    def h3(self, text: str):
        self.ln(2)
        self.set_font("Arial", "B", 11)
        self.set_text_color(31, 35, 46)
        self.multi_cell(0, 6, sanitize(text))
        self.ln(1)

    def body(self, text: str, bold: bool = False, italic: bool = False):
        style = "B" if bold else ("I" if italic else "")
        self.set_font("Arial", style, 10)
        self.set_text_color(31, 35, 46)
        self.multi_cell(0, 5, sanitize(text))
        self.ln(1)

    def quote(self, text: str):
        self.set_font("Arial", "I", 10)
        self.set_text_color(50, 50, 50)
        x = self.get_x()
        self.set_x(x + 6)
        self.multi_cell(0, 5, sanitize(text))
        self.ln(1)

    def bullet(self, text: str):
        self.set_font("Arial", "", 10)
        self.set_text_color(31, 35, 46)
        self.multi_cell(0, 5, sanitize(f"- {text}"))
        self.ln(0.5)

    def table_row(self, cells: list[str], header: bool = False):
        col_w = (self.w - 36) / max(len(cells), 1)
        self.set_font("Arial", "B" if header else "", 9)
        self.set_text_color(31, 35, 46)
        for cell in cells:
            self.cell(col_w, 6, sanitize(cell.strip()), border=1)
        self.ln()


def parse_table(lines: list[str], start: int) -> tuple[list[list[str]], int]:
    rows = []
    i = start
    while i < len(lines) and lines[i].strip().startswith("|"):
        row = [c.strip() for c in lines[i].strip().strip("|").split("|")]
        if not all(set(c) <= set("-:") for c in row):
            rows.append(row)
        i += 1
    return rows, i


def read_markdown(path: Path) -> str:
    for encoding in ("utf-8", "utf-8-sig", "utf-16", "utf-16-le"):
        try:
            return path.read_text(encoding=encoding)
        except UnicodeDecodeError:
            continue
    raise UnicodeDecodeError("md", b"", 0, 1, f"Cannot decode {path}")


def build_pdf():
    text = read_markdown(MD)
    lines = text.splitlines()
    pdf = CueSheetPDF()
    pdf.add_page()

    i = 0
    in_code = False
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            in_code = not in_code
            i += 1
            continue

        if in_code:
            pdf.body(stripped, italic=True)
            i += 1
            continue

        if stripped == "---":
            pdf.add_page()
            i += 1
            continue

        if stripped.startswith("# "):
            pdf.h1(stripped[2:].strip())
            i += 1
            continue

        if stripped.startswith("## "):
            pdf.h2(stripped[3:].strip())
            i += 1
            continue

        if stripped.startswith("### "):
            pdf.h3(stripped[4:].strip())
            i += 1
            continue

        if stripped.startswith("|") and "|" in stripped[1:]:
            rows, i = parse_table(lines, i)
            if rows:
                pdf.table_row(rows[0], header=True)
                for row in rows[1:]:
                    pdf.table_row(row)
                pdf.ln(2)
            continue

        if stripped.startswith("> "):
            quote_lines = []
            while i < len(lines) and lines[i].strip().startswith("> "):
                quote_lines.append(lines[i].strip()[2:].strip())
                i += 1
            pdf.quote(" ".join(quote_lines))
            continue

        if stripped.startswith("- "):
            pdf.bullet(stripped[2:].strip())
            i += 1
            continue

        if stripped.startswith("**") and stripped.endswith("**"):
            pdf.body(stripped.strip("*"), bold=True)
            i += 1
            continue

        if not stripped:
            pdf.ln(2)
            i += 1
            continue

        pdf.body(stripped)
        i += 1

    pdf.output(str(OUT))
    print(f"Saved: {OUT.resolve()}")


if __name__ == "__main__":
    build_pdf()
