"""Build the two New Computer Modern signs used in the monograph from TeX Live."""
from pathlib import Path
import subprocess

from fontTools.fontBuilder import FontBuilder
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.ttLib import TTFont


directory = Path(__file__).resolve().parent
family = "Critical Line Additional Signs"
postscript = "CriticalLineAdditionalSigns-Regular"
sources = {"★": "NewCMMath-Regular.otf", "Ш": "NewCM10-Regular.otf"}
base = TTFont(directory / "latinmodern-math.otf")
units = base["head"].unitsPerEm
cmap = {}
outlines = {".notdef": T2CharStringPen(units // 2, None).getCharString()}
metrics = {".notdef": (units // 2, 0)}
notices = []
for character, filename in sources.items():
    source_path = subprocess.check_output(["kpsewhich", filename], text=True).strip()
    if not source_path:
        raise FileNotFoundError(filename)
    with TTFont(source_path) as source:
        if source["head"].unitsPerEm != units:
            raise ValueError(f"Unexpected units per em in {filename}")
        codepoint = ord(character)
        glyph = source.getBestCmap()[codepoint]
        name = f"uni{codepoint:04X}"
        cmap[codepoint] = name
        metrics[name] = source["hmtx"][glyph]
        pen = T2CharStringPen(metrics[name][0], None, roundTolerance=0)
        source.getGlyphSet()[glyph].draw(pen)
        outlines[name] = pen.getCharString()
        notices.append(source["name"].getDebugName(0))

builder = FontBuilder(units, isTTF=False)
builder.setupGlyphOrder(list(outlines))
builder.setupCharacterMap(cmap)
builder.setupCFF(postscript, {
    "FullName": family, "FamilyName": family, "Weight": "Regular",
    "Notice": "Glyph outlines from Antonis Tsolomitis, New Computer Modern, GUST Font License.",
}, outlines, {})
builder.setupHorizontalMetrics(metrics)
builder.setupHorizontalHeader(ascent=base["hhea"].ascent, descent=base["hhea"].descent)
builder.setupNameTable({
    "familyName": family, "styleName": "Regular", "fullName": family,
    "psName": postscript, "uniqueFontIdentifier": postscript + "-1",
    "version": "Version 1.000", "copyright": "\n".join(notices),
    "licenseDescription": "GUST Font License version 1.0 or later.",
})
builder.setupOS2(sTypoAscender=base["OS/2"].sTypoAscender,
                 sTypoDescender=base["OS/2"].sTypoDescender,
                 usWinAscent=base["OS/2"].usWinAscent, usWinDescent=base["OS/2"].usWinDescent)
builder.setupPost()
builder.font["head"].created = base["head"].created
builder.font["head"].modified = base["head"].modified
builder.font.recalcTimestamp = False
builder.font.flavor = "woff"
builder.save(directory / "critical-line-additional-signs.woff")
