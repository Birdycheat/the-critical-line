"""Generate the 1200x630 Open Graph / X preview card (assets/social-card.png) using Latin Modern fonts and the exact critical-strip surface."""
import math
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "assets" / "fonts"
if not FONTS.exists():
    FONTS = ROOT.parent / "assets" / "fonts"


def c_mul(a, b):
    return (a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0])


def c_add(a, b):
    return (a[0] + b[0], a[1] + b[1])


def c_scale(a, q):
    return (a[0] * q, a[1] * q)


def n_pow(n, a, b):
    ang = b * math.log(n)
    r = n ** a
    return (r * math.cos(ang), r * math.sin(ang))


def zeta(sigma, t, N=96):
    z = (0.0, 0.0)
    for n in range(1, N):
        z = c_add(z, n_pow(n, -sigma, -t))
    d = (sigma - 1.0) ** 2 + t * t
    z = c_add(z, c_mul(n_pow(N, 1.0 - sigma, -t), ((sigma - 1.0) / d, -t / d)))
    z = c_add(z, c_scale(n_pow(N, -sigma, -t), 0.5))
    prod = (1.0, 0.0)
    bernoulli = {1: 1.0 / 12.0, 3: -1.0 / 720.0, 5: 1.0 / 30240.0}
    for k in range(1, 6):
        prod = c_mul(prod, (sigma + k - 1.0, t))
        if k in bernoulli:
            z = c_add(z, c_scale(c_mul(prod, n_pow(N, -sigma - k, -t)), bernoulli[k]))
    return math.hypot(z[0], z[1])


def build_card():
    # Render at 2x resolution then downsample with LANCZOS for crisp anti-aliased lines and glyphs.
    S = 2
    W, H = 1200 * S, 630 * S
    PAPER = (254, 253, 250)
    INK = (21, 25, 28)
    INK_SOFT = (86, 94, 99)
    LINE = (185, 180, 168)
    COPPER = (156, 65, 33)
    SLATE = (68, 75, 78)
    MESH = (154, 155, 148)

    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)

    f_reg = lambda sz: ImageFont.truetype(str(FONTS / "lmroman10-regular.otf"), sz * S)
    f_it = lambda sz: ImageFont.truetype(str(FONTS / "lmroman10-italic.otf"), sz * S)
    f_bold = lambda sz: ImageFont.truetype(str(FONTS / "lmroman10-bold.otf"), sz * S)
    f_math = lambda sz: ImageFont.truetype(str(FONTS / "latinmodern-math.otf"), sz * S)

    pad_x = 58 * S
    top_y = 40 * S

    # Header rule and monograph title (no personal logo or name in top bar)
    draw.text((pad_x, top_y + 1 * S), "THE CRITICAL LINE", font=f_reg(20), fill=INK)
    right_tag = "OPEN COLLABORATIVE EDITION · CC BY-NC 4.0"
    tw = draw.textlength(right_tag, font=f_reg(17))
    draw.text((W - pad_x - tw, top_y + 4 * S), right_tag, font=f_reg(17), fill=COPPER)
    rule_top = top_y + 42 * S
    draw.line([(pad_x, rule_top), (W - pad_x, rule_top)], fill=INK, width=int(1.5 * S))

    # Left column typography
    lx = pad_x
    draw.text((lx, 128 * S), "The Riemann", font=f_reg(58), fill=INK)
    draw.text((lx, 192 * S), "Hypothesis", font=f_reg(58), fill=INK)
    draw.text((lx, 274 * S), "An independent human-readable", font=f_it(25), fill=INK)
    draw.text((lx, 307 * S), "reconstruction of the formal proof", font=f_it(25), fill=INK)

    draw.line([(lx, 358 * S), (lx + 420 * S, 358 * S)], fill=LINE, width=S)
    draw.text((lx, 376 * S), "938+ reconstructed results · 10 chapters", font=f_reg(20), fill=INK_SOFT)
    draw.text((lx, 405 * S), "7,685+ pinned source ranges · 92 interactive labs", font=f_reg(20), fill=INK_SOFT)
    draw.text((lx, 444 * S), "Open for mathematical & formal audit", font=f_bold(20), fill=COPPER)

    # Right column: 3D surface of |zeta(sigma + it)| from plate.cjs
    ox, oy = 528 * S, 96 * S
    scale_plot = 1.18 * S

    def pt(s, t, z):
        px = ox + (33 + (t - 8.0) * 15.2 + 95.0 * s) * scale_plot
        py = oy + (278.0 - 60.0 * s - 39.0 * z + 0.24 * (t - 8.0)) * scale_plot
        return (px, py)

    nt, ns = 168, 26
    grid = []
    for j in range(ns + 1):
        s = j / ns
        row = []
        for i in range(nt + 1):
            t = 8.0 + 24.0 * i / nt
            row.append(pt(s, t, zeta(s, t)))
        grid.append(row)

    # Back reference lines
    for z_lvl in range(5):
        p0, p1, p2 = pt(0, 8, z_lvl), pt(1, 8, z_lvl), pt(1, 32, z_lvl)
        draw.line([p0, p1, p2], fill=(205, 202, 193), width=S)

    # Occluding slices back-to-front
    for j in range(ns, -1, -1):
        s = j / ns
        g = grid[j]
        poly = g + [pt(s, 32.0, 0.0), pt(s, 8.0, 0.0)]
        draw.polygon(poly, fill=PAPER)
        is_crit = (j == ns // 2)
        draw.line(
            g,
            fill=COPPER if is_crit else SLATE,
            width=int((3.2 if is_crit else 1.15) * S),
            joint="curve",
        )
        if j > 0:
            for i in range(0, nt + 1, 7):
                draw.line([g[i], grid[j - 1][i]], fill=MESH, width=S)

    # Base frame & ticks
    draw.line([pt(0, 8, 0), pt(0, 32, 0), pt(1, 32, 0)], fill=INK_SOFT, width=int(1.2 * S))
    for t_val in [8, 12, 16, 20, 24, 28, 32]:
        tx, ty = pt(0, t_val, 0)
        draw.line([(tx, ty), (tx, ty + 5 * S)], fill=INK_SOFT, width=S)
        lbl = str(t_val)
        lw = draw.textlength(lbl, font=f_reg(14))
        draw.text((tx - lw / 2, ty + 8 * S), lbl, font=f_reg(14), fill=INK_SOFT)

    cx_lbl, cy_lbl = pt(0.5, 32, 0)
    sx, sy = cx_lbl + 18 * S, cy_lbl - 8 * S
    draw.text((sx, sy), "σ", font=f_math(18), fill=COPPER)
    sw = draw.textlength("σ", font=f_math(18))
    draw.text((sx + sw + 2 * S, sy - 1 * S), " = ½", font=f_reg(18), fill=COPPER)
    z_lbl_x, z_lbl_y = pt(0, 8, 3.2)
    draw.text((z_lbl_x - 28 * S, z_lbl_y - 10 * S), "|ζ|", font=f_math(18), fill=INK_SOFT)

    # Footer
    foot_rule = H - 70 * S
    draw.line([(pad_x, foot_rule), (W - pad_x, foot_rule)], fill=INK, width=int(1.2 * S))
    draw.text(
        (pad_x, foot_rule + 16 * S),
        "Reconstructed from the formalization announced by Levent Alpöge, working with Claude",
        font=f_reg(18),
        fill=INK_SOFT,
    )
    r_p1, r_sigma, r_p2 = "Critical section ", "σ", " = ½ in copper"
    w1 = draw.textlength(r_p1, font=f_it(18))
    ws = draw.textlength(r_sigma, font=f_math(18))
    w2 = draw.textlength(r_p2, font=f_it(18))
    rx = W - pad_x - (w1 + ws + w2)
    ry = foot_rule + 16 * S
    draw.text((rx, ry), r_p1, font=f_it(18), fill=COPPER)
    draw.text((rx + w1, ry + 1 * S), r_sigma, font=f_math(18), fill=COPPER)
    draw.text((rx + w1 + ws, ry), r_p2, font=f_it(18), fill=COPPER)

    out = img.resize((1200, 630), Image.Resampling.LANCZOS)
    dest = ROOT / "assets" / "social-card.png"
    out.save(dest, format="PNG", optimize=True)
    print(f"Saved {dest} ({dest.stat().st_size:,} bytes)")


if __name__ == "__main__":
    build_card()
