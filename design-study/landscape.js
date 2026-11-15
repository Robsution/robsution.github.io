
(() => {
  const D = {"B":[[800,165,1.0,125,80,18],[400,140,0.68,105,70,-25],[590,265,0.46,70,46,10],[1000,262,0.5,72,55,-30],[1035,72,0.4,58,44,15],[640,58,0.36,150,28,8],[95,215,0.3,62,52,40],[205,62,0.3,60,40,-10],[700,335,-0.3,95,42,0],[930,160,-0.18,40,34,0],[225,335,-0.24,85,40,0],[505,92,0.12,22,18,0],[880,300,0.13,24,20,0],[130,120,0.12,26,20,0],[470,305,0.1,20,17,0],[705,215,0.11,21,18,0],[950,40,0.1,20,16,0],[335,232,0.09,22,18,0]],"fmin":-0.219449,"fmax":1.001956,"W":1100,"H":360,"ETA":380.0,"MINSTEP":1.1,"MAXSTEP":5.0,"SIG":1.15};
  const NS = "http://www.w3.org/2000/svg";
  const plot = document.getElementById("plot");
  const svg = plot.querySelector("svg");
  const layer = document.getElementById("walkers");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const R = D.fmax - D.fmin;

  // The landscape: a sum of rotated Gaussian bumps (the same ones the contours were traced from).
  const bumps = D.B.map(([x, y, a, sx, sy, r]) => ({
    x, y, a, ix: 1 / (sx * sx), iy: 1 / (sy * sy),
    c: Math.cos(r * Math.PI / 180), s: Math.sin(r * Math.PI / 180)
  }));
  function grad(x, y) {
    let gx = 0, gy = 0;
    for (const b of bumps) {
      const dx = x - b.x, dy = y - b.y;
      const u = b.c * dx + b.s * dy, v = -b.s * dx + b.c * dy;
      const e = b.a * Math.exp(-0.5 * (u * u * b.ix + v * v * b.iy));
      const du = -e * u * b.ix, dv = -e * v * b.iy;
      gx += du * b.c - dv * b.s;
      gy += du * b.s + dv * b.c;
    }
    return [gx / R, gy / R];
  }
  function randn() {
    let u = 0, v = 0;
    while (!u) u = Math.random();
    while (!v) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  // Noisy gradient ascent: step along the slope (clamped), noise shrinks near a peak, stop once it stops going anywhere.
  function walk(x, y) {
    const pts = [[x, y]];
    for (let i = 0; i < 900; i++) {
      const [gx, gy] = grad(x, y);
      let vx = D.ETA * gx, vy = D.ETA * gy;
      const sp = Math.hypot(vx, vy);
      if (sp > 1e-12) {
        const k = Math.min(Math.max(sp, D.MINSTEP), D.MAXSTEP) / sp;
        vx *= k; vy *= k;
      }
      const sig = D.SIG * Math.min(Math.max(sp / 2.2, 0.25), 1);
      x = Math.min(Math.max(x + vx + sig * randn(), 2), D.W - 2);
      y = Math.min(Math.max(y + vy + sig * randn(), 2), D.H - 2);
      pts.push([x, y]);
      if (i > 14) {
        const [ox, oy] = pts[pts.length - 15];
        if (Math.hypot(x - ox, y - oy) < 5) break;
      }
    }
    return pts;
  }

  const fmt = (x, y) => x.toFixed(1) + "," + y.toFixed(1);
  function el(name, attrs) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function animate(w, pts) {
    const L = [0];
    for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = L[L.length - 1];
    const dur = reduce ? 0 : Math.min(3200, Math.max(800, total / 0.15));
    const t0 = performance.now();
    let i = 0;
    function frame(now) {
      const t = dur ? Math.min(1, (now - t0) / dur) : 1;
      const target = total * (1 - (1 - t) * (1 - t));
      while (i < pts.length - 1 && L[i + 1] <= target) i++;
      let hx = pts[i][0], hy = pts[i][1];
      if (i < pts.length - 1) {
        const seg = L[i + 1] - L[i], f = seg > 0 ? (target - L[i]) / seg : 0;
        hx += (pts[i + 1][0] - pts[i][0]) * f;
        hy += (pts[i + 1][1] - pts[i][1]) * f;
      }
      const shown = pts.slice(0, i + 1).map(p => fmt(p[0], p[1]));
      shown.push(fmt(hx, hy));
      w.trail.setAttribute("points", shown.join(" "));
      w.head.setAttribute("cx", hx.toFixed(1));
      w.head.setAttribute("cy", hy.toFixed(1));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function retire() {
    for (const g of layer.querySelectorAll(".walker:not(.past)")) {
      g.classList.add("past");
      g.querySelector(".head").setAttribute("r", "3.6");
    }
    const all = layer.querySelectorAll(".walker");
    for (let k = 0; k < all.length - 6; k++) all[k].remove();
  }
  function release(x, y) {
    retire();
    const g = el("g", { class: "walker" });
    const trail = el("polyline", { class: "trail", points: fmt(x, y) });
    const start = el("circle", { class: "start", r: 2.6, cx: x.toFixed(1), cy: y.toFixed(1) });
    const head = el("circle", { class: "head", r: 4.5, cx: x.toFixed(1), cy: y.toFixed(1) });
    g.append(trail, start, head);
    layer.append(g);
    animate({ trail, head }, walk(x, y));
  }
  function toSvg(clientX, clientY) {
    const p = svg.createSVGPoint();
    p.x = clientX; p.y = clientY;
    return p.matrixTransform(svg.getScreenCTM().inverse());
  }

  plot.addEventListener("click", ev => {
    const p = toSvg(ev.clientX, ev.clientY);
    release(Math.min(Math.max(p.x, 4), D.W - 4), Math.min(Math.max(p.y, 4), D.H - 4));
  });
  plot.addEventListener("keydown", ev => {
    if (ev.key !== "Enter" && ev.key !== " ") return;
    ev.preventDefault();
    const r = svg.getBoundingClientRect();
    const p = toSvg(r.left + r.width * (0.1 + 0.8 * Math.random()), r.top + r.height * (0.15 + 0.7 * Math.random()));
    release(p.x, p.y);
  });

  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

  if (matchMedia("(hover: none) and (pointer: coarse)").matches) document.getElementById("verb").textContent = "Tap";

  // The page's one orchestrated moment: the first walker climbs once on load.
  const w0 = document.getElementById("w0");
  if (!reduce && w0) {
    const trail = w0.querySelector(".trail"), head = w0.querySelector(".head");
    const list = trail.points, pts = [];
    for (let k = 0; k < list.numberOfItems; k++) { const p = list.getItem(k); pts.push([p.x, p.y]); }
    trail.setAttribute("points", fmt(pts[0][0], pts[0][1]));
    head.setAttribute("cx", pts[0][0]); head.setAttribute("cy", pts[0][1]);
    setTimeout(() => animate({ trail, head }, pts), 350);
  }

  // Portrait: fall back to a labeled box if the image can't load (e.g. in a sandboxed preview).
  const img = document.querySelector(".portrait");
  if (img) {
    const fail = () => {
      const d = document.createElement("div");
      d.className = "portrait placeholder";
      d.textContent = "Portrait";
      img.replaceWith(d);
    };
    if (img.complete && img.naturalWidth === 0) fail();
    else img.addEventListener("error", fail);
  }

  // Copy email
  for (const btn of document.querySelectorAll(".copy")) {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        btn.textContent = "Copied";
      } catch (e) {
        const range = document.createRange();
        range.selectNodeContents(document.getElementById("email"));
        const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
        btn.textContent = "Selected";
      }
      setTimeout(() => { btn.textContent = "Copy"; }, 1800);
    });
  }
})();
