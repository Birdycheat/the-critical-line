"""Build the Unicode script and fraction glyphs used in plain-text math labels."""
from pathlib import Path
import unicodedata

from fontTools.fontBuilder import FontBuilder
from fontTools.misc.transform import Transform
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.t2CharStringPen import T2CharStringPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont


directory = Path(__file__).resolve().parent
source = TTFont(directory / "latinmodern-math.otf")
glyphs = source.getGlyphSet()
cmap = source.getBestCmap()
constants = source["MATH"].table.MathConstants
scale = constants.ScriptPercentScaleDown / 100
rise = constants.SuperscriptShiftUp.Value
fall = -constants.SubscriptShiftDown.Value
units = source["head"].unitsPerEm
family = "Critical Line Math Scripts"
postscript = "CriticalLineMathScripts-Regular"


def draw(parts, advance):
    """Compose the original outlines and measure their left bearing."""
    pen = T2CharStringPen(advance, None)
    bounds = BoundsPen(None)
    for glyph, factor, dx, dy in parts:
        transform = Transform(factor, 0, 0, factor, dx, dy)
        glyphs[glyph].draw(TransformPen(pen, transform))
        glyphs[glyph].draw(TransformPen(bounds, transform))
    return pen.getCharString(), round(bounds.bounds[0]) if bounds.bounds else 0


def script(letter):
    """Use the math font’s optical script-size outlines when available."""
    # The Unicode modifier in m⁻ᵋ decomposes to open e; the exponent denotes ε.
    if letter == "ɛ":
        letter = "ε"
    if letter.isascii() and letter.islower():
        name = "MATHEMATICAL ITALIC SMALL " + letter.upper()
        letter = "ℎ" if letter == "h" else unicodedata.lookup(name)
    elif unicodedata.name(letter).startswith("GREEK SMALL LETTER "):
        name = unicodedata.name(letter).removeprefix("GREEK SMALL LETTER ")
        letter = unicodedata.lookup("MATHEMATICAL ITALIC SMALL " + name)
    name = cmap[ord(letter)]
    return name + ".st" if name + ".st" in glyphs else name


def form(character):
    tag, *codepoints = unicodedata.decomposition(character).split()
    letters = [chr(int(value, 16)) for value in codepoints]
    if tag == "<fraction>":
        numerator, _, denominator = letters
        above, below = script(numerator), script(denominator)
        # Draw the fraction solidus between two raised and lowered digits.
        step = round(glyphs[above].width * scale)
        parts = [(above, scale, 0, rise), (cmap[0x2044], 0.75, step - 100, 90),
                 (below, scale, step + 195, -30)]
        return parts, round(step + 195 + scale * glyphs[below].width)
    glyph = script(letters[0])
    return [(glyph, scale, 0, rise if tag == "<super>" else fall)], round(scale * glyphs[glyph].width)


characters = ("⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱᵀᵗʲᵏ"
              "ˢᵐʰᵈᵘᵉᴺᵃᴰᶠᵇᵛᴴᵟᶜᴮᴹʳᵁᵋᶻ"
              "₀₁₂₃₄₅₆₇₈₉₊₋₌₍₎ₐₑₒₓₕₖₗₘₙₚₛₜᵢᵣᵤᵥⱼ"
              "ᵦᵧ"
              "⅐⅑⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞")
mapping = {ord(char): "uni%04X" % ord(char) for char in characters}
order = [".notdef", *mapping.values()]
outlines = {}
metrics = {}
outlines[".notdef"], bearing = draw([], units // 2)
metrics[".notdef"] = (units // 2, bearing)
for codepoint, name in mapping.items():
    parts, advance = form(chr(codepoint))
    outlines[name], bearing = draw(parts, advance)
    metrics[name] = (advance, bearing)

builder = FontBuilder(units, isTTF=False)
builder.setupGlyphOrder(order)
builder.setupCharacterMap(mapping)
builder.setupCFF(postscript, {
    "FullName": family, "FamilyName": family, "Weight": "Regular",
    "Notice": "Derived from Latin Modern Math under the GUST Font License.",
}, outlines, {})
builder.setupHorizontalMetrics(metrics)
builder.setupHorizontalHeader(ascent=source["hhea"].ascent, descent=source["hhea"].descent)
builder.setupNameTable({
    "familyName": family, "styleName": "Regular", "fullName": family,
    "psName": postscript, "uniqueFontIdentifier": postscript + "-1",
    "version": "Version 1.000", "copyright": source["name"].getDebugName(0),
    "licenseDescription": "GUST Font License, version 1.0, under LPPL 1.3c or later.",
})
builder.setupOS2(sTypoAscender=source["OS/2"].sTypoAscender,
                 sTypoDescender=source["OS/2"].sTypoDescender,
                 usWinAscent=source["OS/2"].usWinAscent, usWinDescent=source["OS/2"].usWinDescent)
builder.setupPost()
builder.font["head"].created = source["head"].created
builder.font["head"].modified = source["head"].modified
builder.font.recalcTimestamp = False
builder.font.flavor = "woff"
builder.save(directory / "critical-line-math-scripts.woff")
