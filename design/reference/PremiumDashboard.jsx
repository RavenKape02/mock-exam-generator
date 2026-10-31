import { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  LayoutGrid, User, Bookmark, Cloud, Settings, Plus, ChevronLeft, ChevronRight,
  Play, FileText, Link2, Video, Image as ImageIcon, Upload, Music, Clock, Sparkles,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Motion helpers                                                     */
/* ------------------------------------------------------------------ */

const REDUCED =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Tweens a number from its last value to the new target (ease-out quart).
function useTween(target, duration = 1100) {
  const [v, setV] = useState(REDUCED ? target : 0);
  const from = useRef(0);
  useEffect(() => {
    if (REDUCED) { setV(target); return; }
    const a = from.current;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
      const val = a + (target - a) * e;
      from.current = val;
      setV(val);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function Num({ value, decimals = 0, suffix = "", duration }) {
  const v = useTween(value, duration);
  return (
    <span className="num">
      {v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
}

// Reveal wrapper: blur-to-sharp entrance, staggered by index.
function R({ i = 0, className = "", style, children, ...rest }) {
  return (
    <div className={`rv ${className}`} style={{ "--i": i, ...style }} {...rest}>
      {children}
    </div>
  );
}

// Pill switcher with a sliding indicator.
function Segmented({ options, value, onChange, className = "", label }) {
  const ref = useRef(null);
  const [ind, setInd] = useState({ x: 0, w: 0 });
  const measure = () => {
    const el = ref.current && ref.current.querySelector(`[data-seg="${value}"]`);
    if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
  };
  useLayoutEffect(measure, [value]);
  useEffect(() => {
    if (!ref.current || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [value]);
  return (
    <div ref={ref} className={`seg ${className}`} role="tablist" aria-label={label}>
      <span
        className="seg-ind"
        style={{ width: ind.w, transform: `translateX(${ind.x}px)`, opacity: ind.w ? 1 : 0 }}
      />
      {options.map((o) => (
        <button
          key={o.id}
          data-seg={o.id}
          role="tab"
          aria-selected={value === o.id}
          className={`seg-btn ${value === o.id ? "on" : ""}`}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// FLIP: when items move inside a grid, slide them instead of jumping.
function useFlip(ref, signature) {
  const prev = useRef(new Map());
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const next = new Map();
    Array.from(el.children).forEach((k) => {
      const id = k.dataset.flip;
      if (!id) return;
      const pos = { x: k.offsetLeft, y: k.offsetTop };
      next.set(id, pos);
      const p = prev.current.get(id);
      if (p && !REDUCED && k.animate && (p.x !== pos.x || p.y !== pos.y)) {
        k.animate(
          [{ transform: `translate(${p.x - pos.x}px, ${p.y - pos.y}px)` }, { transform: "translate(0,0)" }],
          { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
        );
      }
    });
    prev.current = next;
  }, [signature]);
}

/* ------------------------------------------------------------------ */
/*  Visual atoms                                                       */
/* ------------------------------------------------------------------ */

function Bloom({ size = 120, hue = "lav", spin = false }) {
  return (
    <div className="bloom-wrap" aria-hidden="true">
      <div className={`bloom ${hue} ${spin ? "spin" : ""}`} style={{ width: size, height: size }}>
        {Array.from({ length: 8 }).map((_, k) => (
          <span key={k} style={{ transform: `rotate(${k * 45}deg)` }} />
        ))}
        <i />
      </div>
    </div>
  );
}

function Avatar({ m, size = 36, ring = false }) {
  return (
    <span
      className={`av ${ring ? "ring" : ""}`}
      style={{
        width: size, height: size, fontSize: size * 0.34,
        background: `linear-gradient(135deg, ${m.g[0]}, ${m.g[1]})`,
      }}
      aria-hidden="true"
    >
      {m.i}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const ME = { n: "Hannah Brooks", i: "HB", g: ["#E2D8FF", "#8C6CF7"] };
const MEMBERS = [
  { n: "Sophie Bates", i: "SB", g: ["#FFD9B8", "#F59E7A"] },
  { n: "Alex Jefferson", i: "AJ", g: ["#CFE0FF", "#7B9CF2"] },
  { n: "Daniel Torres", i: "DT", g: ["#D7F2E2", "#5DBE8E"] },
  { n: "Mia Chen", i: "MC", g: ["#F8D3EC", "#D77BB6"] },
];
const WEEK = [
  { d: "Tue", n: 20, h: 6.4, a: "Sprint planning, 10:00 AM" },
  { d: "Wed", n: 21, h: 8.5, a: "Design review, 2:00 PM" },
  { d: "Thu", n: 22, h: 9.9, a: "User interviews, 11:00 AM" },
  { d: "Fri", n: 23, h: 10.3, a: "Demo day, 4:00 PM" },
  { d: "Sat", n: 24, h: 3.2, a: "No meetings" },
  { d: "Sun", n: 25, h: 1.5, a: "No meetings" },
  { d: "Mon", n: 26, h: 4.3, a: "Brainstorm session, 11:30 AM" },
];
const VIDEOS = [
  { t: "Design critique: the checkout flow", by: "Sophie Bates", d: "12:40", hue: "lav", tone: "t-lav" },
  { t: "Motion basics for product teams", by: "Alex Jefferson", d: "08:15", hue: "blue", tone: "t-blue" },
];
const NOTES = [
  { m: MEMBERS[0], t: "commented on Q4 roadmap", ago: "2 min ago" },
  { m: MEMBERS[1], t: "shared Onboarding flow v2 with you", ago: "25 min ago" },
  { m: MEMBERS[3], t: "moved Launch checklist to Done", ago: "1 h ago" },
];
const PSTATS = [
  { l: "Projects shipped", v: 48 },
  { l: "Videos published", v: 112 },
  { l: "Followers", v: 2146 },
  { l: "Focus hours", v: 339 },
];
const FOCUS = [
  { d: "Mon", h: 5.2 }, { d: "Tue", h: 6.4 }, { d: "Wed", h: 4.8 }, { d: "Thu", h: 7.1 },
  { d: "Fri", h: 6.0 }, { d: "Sat", h: 2.3 }, { d: "Sun", h: 1.2 },
];
const SAVED = [
  { id: "1", type: "video", t: "Brain-computer interfaces, explained", src: "Lex Notes", hue: "lav", tone: "t-lav", tag: "New" },
  { id: "2", type: "doc", t: "Q2 design review: findings and next steps", src: "Workspace doc", tone: "t-blue" },
  { id: "3", type: "link", t: "Material motion guidelines", src: "Web link", tone: "t-pink" },
  { id: "4", type: "video", t: "How a paper plane really flies", src: "Field Lab", hue: "pink", tone: "t-pink" },
  { id: "5", type: "doc", t: "Onboarding checklist for new hires", src: "Workspace doc", tone: "t-mint", tag: "New" },
  { id: "6", type: "link", t: "Accessible design patterns cheat sheet", src: "Web link", tone: "t-blue" },
  { id: "7", type: "video", t: "Inside a ceramics studio", src: "Make Weekly", hue: "mint", tone: "t-mint" },
  { id: "8", type: "doc", t: "Brand voice guide v3", src: "Workspace doc", tone: "t-lav" },
];
const COLLECTIONS = [
  { n: "Design inspiration", c: 24, sw: "linear-gradient(135deg,#E2D8FF,#8C6CF7)" },
  { n: "Team onboarding", c: 9, sw: "linear-gradient(135deg,#D7F2E2,#5DBE8E)" },
  { n: "Read later", c: 31, sw: "linear-gradient(135deg,#CFE0FF,#7B9CF2)" },
  { n: "Neuroscience reference", c: 7, sw: "linear-gradient(135deg,#F8D3EC,#D77BB6)" },
];
const CATS = [
  { l: "Videos", v: 31.6, icon: Video, tone: "tn-lav", bar: "#7A5AF8" },
  { l: "Documents", v: 18.2, icon: FileText, tone: "tn-blue", bar: "#5B85EE" },
  { l: "Images", v: 12.9, icon: ImageIcon, tone: "tn-pink", bar: "#D46AAE" },
  { l: "Audio", v: 5.7, icon: Music, tone: "tn-mint", bar: "#3FB37F" },
];
const FILES = [
  { n: "Q4 roadmap.pdf", s: "2.4 MB", m: "Today", icon: FileText, tone: "tn-blue" },
  { n: "Product demo.mp4", s: "486 MB", m: "Yesterday", icon: Video, tone: "tn-lav" },
  { n: "Moodboard.png", s: "8.1 MB", m: "Oct 22", icon: ImageIcon, tone: "tn-pink" },
  { n: "Podcast intro.wav", s: "34 MB", m: "Oct 20", icon: Music, tone: "tn-mint" },
];
const UPLOAD_NAMES = ["Brand assets.zip", "Interview notes.pdf", "Hero render.png", "Team sync.mp4"];

/* ------------------------------------------------------------------ */
/*  Pages                                                              */
/* ------------------------------------------------------------------ */

function Dashboard() {
  const [day, setDay] = useState(6);
  const [range, setRange] = useState("week");
  const [read, setRead] = useState(false);
  const stats = range === "week" ? { p: 38, t: 54, pp: 62, tp: 78 } : { p: 162, t: 231, pp: 74, tp: 88 };
  const max = Math.max(...WEEK.map((w) => w.h));

  return (
    <div className="grid">
      <R i={0} className="card hero c-8">
        <div className="hero-copy">
          <h1>Work’s always better together</h1>
          <p>Invite teammates so everyone sees the same boards, videos and deadlines.</p>
          <button className="btn dark press"><Plus size={15} /> Add member</button>
        </div>
        <div className="hero-art"><Bloom size={170} spin /></div>
      </R>

      <R i={1} className="card c-4">
        <div className="card-h">
          <h3>October 2026</h3>
          <div className="row">
            <button className="ibtn" aria-label="Previous day" onClick={() => setDay((d) => Math.max(0, d - 1))}><ChevronLeft size={16} /></button>
            <button className="ibtn" aria-label="Next day" onClick={() => setDay((d) => Math.min(6, d + 1))}><ChevronRight size={16} /></button>
          </div>
        </div>
        <Segmented
          className="seg-days"
          label="Day"
          value={day}
          onChange={setDay}
          options={WEEK.map((w, k) => ({ id: k, label: <><small>{w.d}</small><b>{w.n}</b></> }))}
        />
        <div className="day-note"><Clock size={14} /><span key={day} className="swap">{WEEK[day].a}</span></div>
      </R>

      <R i={2} className="card c-4">
        <div className="card-h"><h3>Members</h3><span className="mute">4 online</span></div>
        <div className="members">
          {MEMBERS.map((m) => (
            <div className="member" key={m.n}><Avatar m={m} size={46} /><span>{m.n.split(" ")[0]}</span></div>
          ))}
        </div>
        <div className="stack">
          <div className="row">{[ME, ...MEMBERS].map((m) => <Avatar key={m.i} m={m} size={26} />)}</div>
          <span>+12 more in this workspace</span>
        </div>
      </R>

      <R i={3} className="card c-4">
        <div className="card-h"><h3>Focus time</h3><span className="chip"><span key={day} className="swap">{WEEK[day].d}</span></span></div>
        <div className="big"><Num value={WEEK[day].h} decimals={1} suffix="h" duration={700} /></div>
        <div className="bars">
          {WEEK.map((w, k) => (
            <button
              key={k}
              className={`bar-col ${k === day ? "on" : ""}`}
              onClick={() => setDay(k)}
              aria-label={`${w.d}: ${w.h} hours`}
            >
              <span className="bar" style={{ height: `${(w.h / max) * 100}%`, "--i": k }} />
            </button>
          ))}
        </div>
        <div className="bar-days">{WEEK.map((w) => <span key={w.n}>{w.d[0]}</span>)}</div>
      </R>

      <R i={4} className="card c-4">
        <div className="card-h"><h3>Last videos</h3><button className="link">See all</button></div>
        <div className="vids">
          {VIDEOS.map((v) => (
            <button className="vid" key={v.t}>
              <div className={`thumb ${v.tone}`}>
                <Bloom size={62} hue={v.hue} />
                <span className="dur">{v.d}</span>
                <span className="play"><Play size={12} fill="currentColor" /></span>
              </div>
              <p>{v.t}</p>
              <small>{v.by}</small>
            </button>
          ))}
        </div>
      </R>

      <R i={5} className="card c-4">
        <div className="card-h">
          <h3>Statistics</h3>
          <Segmented
            label="Range"
            value={range}
            onChange={setRange}
            options={[{ id: "week", label: "Weekly" }, { id: "month", label: "Monthly" }]}
          />
        </div>
        <div className="pair">
          <div>
            <b><Num value={stats.p} duration={800} /></b><small>Projects shipped</small>
            <div className="meter"><span style={{ width: `${stats.pp}%` }} /></div>
          </div>
          <div>
            <b><Num value={stats.t} duration={800} /></b><small>Tasks closed</small>
            <div className="meter"><span style={{ width: `${stats.tp}%`, background: "#D46AAE" }} /></div>
          </div>
        </div>
      </R>

      <div className="c-4 col">
        <R i={6} className="event">
          <span className="live" />
          <div><b>Brainstorm session</b><small>Starts in 12 min</small></div>
          <button className="btn light press">Join</button>
        </R>
        <R i={7} className="card promo">
          <Bloom size={84} hue="pink" />
          <div>
            <h3>See where the week went</h3>
            <p>Team analytics break down focus time by project.</p>
            <button className="btn dark press">Upgrade plan</button>
          </div>
        </R>
      </div>

      <R i={8} className="card c-4">
        <div className="card-h">
          <h3>Notifications</h3>
          <button className="link" onClick={() => setRead(true)} disabled={read}>{read ? "All read" : "Mark all read"}</button>
        </div>
        <ul className="notes">
          {NOTES.map((n, k) => (
            <li key={k} className={`note ${read ? "read" : ""}`}>
              <Avatar m={n.m} size={34} />
              <div><p><b>{n.m.n}</b> {n.t}</p><small>{n.ago}</small></div>
              <span className="dot" style={{ transitionDelay: `${k * 70}ms` }} />
            </li>
          ))}
        </ul>
      </R>
    </div>
  );
}

function Profile() {
  const [busy, setBusy] = useState(false);
  return (
    <div className="grid">
      <R i={0} className="card pro c-12">
        <div className="pro-banner"><Bloom size={200} spin /></div>
        <div className="pro-row">
          <Avatar m={ME} size={88} ring />
          <div className="pro-id">
            <h1>Hannah Brooks</h1>
            <p>Lead product designer at Northwind Studio</p>
          </div>
          <div className="row">
            <button className={`status ${busy ? "busy" : ""}`} onClick={() => setBusy((b) => !b)} aria-pressed={busy}>
              <span />{busy ? "Busy" : "Available"}
            </button>
            <button className="btn dark press">Edit profile</button>
          </div>
        </div>
      </R>

      {PSTATS.map((s, k) => (
        <R i={k + 1} key={s.l} className="card c-3 pstat">
          <small>{s.l}</small>
          <b><Num value={s.v} duration={1300} /></b>
        </R>
      ))}

      <R i={5} className="card c-5 about">
        <div className="card-h"><h3>About</h3></div>
        <p>
          Designs tools for small creative teams. Currently leading the redesign of the
          shared workspace, with a focus on calmer notifications and faster handoff.
        </p>
        <div className="tags">
          {["Product design", "Prototyping", "Design systems", "Motion"].map((t) => <span key={t}>{t}</span>)}
        </div>
      </R>

      <R i={6} className="card c-7">
        <div className="card-h">
          <h3>Focus this week</h3>
          <span className="big-sm"><Num value={33} decimals={1} suffix="h" /></span>
        </div>
        <div className="fchart">
          {FOCUS.map((f, k) => (
            <div className="fcol" key={f.d}>
              <span className="fbar" style={{ height: `${(f.h / 7.1) * 100}%`, "--i": k }}>
                <span className="fval">{f.h}h</span>
              </span>
              <small>{f.d}</small>
            </div>
          ))}
        </div>
      </R>
    </div>
  );
}

function Saved() {
  const [filter, setFilter] = useState("all");
  const [items, setItems] = useState(SAVED);
  const [leaving, setLeaving] = useState([]);
  const gridRef = useRef(null);
  const shown = items.filter((x) => filter === "all" || x.type === filter);
  useFlip(gridRef, shown.map((x) => x.id).join(","));

  const remove = (id) => {
    setLeaving((l) => [...l, id]);
    setTimeout(() => {
      setItems((xs) => xs.filter((x) => x.id !== id));
      setLeaving((l) => l.filter((y) => y !== id));
    }, REDUCED ? 0 : 380);
  };
  const plural = { video: "video", doc: "doc", link: "link" };

  return (
    <>
      <R i={0} className="page-h">
        <div>
          <h1>Saved for later</h1>
          <p>Videos, docs and links you bookmarked across the workspace.</p>
        </div>
        <Segmented
          label="Filter"
          value={filter}
          onChange={setFilter}
          options={[
            { id: "all", label: "All" }, { id: "video", label: "Videos" },
            { id: "doc", label: "Docs" }, { id: "link", label: "Links" },
          ]}
        />
      </R>

      <div className="grid">
        <div className="c-9 saved-grid" ref={gridRef}>
          {shown.map((x, k) => (
            <R i={k + 1} key={x.id} data-flip={x.id} className={`card saved lift ${leaving.includes(x.id) ? "leaving" : ""}`}>
              <div className={`thumb ${x.tone}`}>
                {x.type === "video" ? (
                  <Bloom size={74} hue={x.hue} />
                ) : (
                  <span className="ticon">{x.type === "doc" ? <FileText size={20} /> : <Link2 size={20} />}</span>
                )}
                {x.tag && <span className="tag">{x.tag}</span>}
              </div>
              <div className="saved-b"><p>{x.t}</p></div>
              <div className="saved-f">
                <small>{x.src}</small>
                <button className="ibtn on" aria-label="Remove from saved" onClick={() => remove(x.id)}>
                  <Bookmark size={16} fill="currentColor" />
                </button>
              </div>
            </R>
          ))}
          {shown.length === 0 && (
            <div className="empty rv">
              Nothing saved here yet. Bookmark a {filter === "all" ? "video, doc or link" : plural[filter]} to find it again later.
            </div>
          )}
        </div>

        <R i={2} className="card c-3 coll-card">
          <div className="card-h"><h3>Collections</h3><span className="mute">{COLLECTIONS.length}</span></div>
          <ul className="coll">
            {COLLECTIONS.map((c) => (
              <li key={c.n}><span className="sw" style={{ background: c.sw }} /><span className="n">{c.n}</span><small>{c.c}</small></li>
            ))}
          </ul>
          <button className="btn dark press wide"><Plus size={15} /> New collection</button>
        </R>
      </div>
    </>
  );
}

function CloudPage() {
  const used = 68.4, total = 100;
  const r = 62, C = 2 * Math.PI * r;
  const [on, setOn] = useState(REDUCED);
  const [ups, setUps] = useState([]);
  const timers = useRef([]);

  useEffect(() => {
    const a = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => {
      cancelAnimationFrame(a);
      timers.current.forEach(clearInterval);
    };
  }, []);

  const startUpload = () => {
    const id = Date.now();
    const name = UPLOAD_NAMES[ups.length % UPLOAD_NAMES.length];
    setUps((u) => [{ id, n: name, p: 0 }, ...u]);
    let p = 0;
    const t = setInterval(() => {
      p = Math.min(100, p + Math.random() * 16 + 6);
      setUps((u) => u.map((x) => (x.id === id ? { ...x, p } : x)));
      if (p >= 100) clearInterval(t);
    }, 160);
    timers.current.push(t);
  };

  return (
    <>
      <R i={0} className="page-h">
        <div>
          <h1>Cloud storage</h1>
          <p>Everything your team has uploaded, sorted by type.</p>
        </div>
        <button className="btn dark press" onClick={startUpload}><Upload size={15} /> Upload file</button>
      </R>

      <div className="grid">
        <R i={1} className="card c-7">
          <div className="card-h"><h3>Storage</h3><span className="mute">{total} GB plan</span></div>
          <div className="ring-wrap">
            <div className="ring">
              <svg width="150" height="150" viewBox="0 0 150 150">
                <defs>
                  <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#B9A4FF" />
                    <stop offset="100%" stopColor="#7A5AF8" />
                  </linearGradient>
                </defs>
                <circle className="trk" cx="75" cy="75" r={r} />
                <circle
                  className="val"
                  cx="75" cy="75" r={r}
                  strokeDasharray={C}
                  strokeDashoffset={on ? C * (1 - used / total) : C}
                />
              </svg>
              <div className="ring-c">
                <b><Num value={used} decimals={1} suffix=" GB" duration={1400} /></b>
                <small>of {total} GB used</small>
              </div>
            </div>
            <div className="cats">
              {CATS.map((c, k) => {
                const I = c.icon;
                return (
                  <div className="cat" key={c.l}>
                    <span className={`ci ${c.tone}`}><I size={16} /></span>
                    <div className="cn">
                      <div className="row between"><span>{c.l}</span><small>{c.v} GB</small></div>
                      <div className="cm"><span style={{ width: `${(c.v / 31.6) * 100}%`, background: c.bar, "--i": k }} /></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </R>

        <R i={2} className="card c-5 drop">
          <span className="drop-ic"><Upload size={20} /></span>
          <h3>Drop files to upload</h3>
          <p>Or pick them from your computer. Files up to 2 GB each.</p>
          <button className="btn light press" onClick={startUpload}>Choose files</button>
        </R>

        <R i={3} className="card c-12">
          <div className="card-h"><h3>Recent files</h3><button className="link">View all</button></div>
          <ul className="files">
            {ups.map((u) => (
              <li className="file new" key={u.id}>
                <span className="fi tn-lav"><Upload size={16} /></span>
                <div className="fn">
                  <p>{u.n}</p>
                  {u.p < 100 ? (
                    <div className="up-bar"><span style={{ width: `${u.p}%` }} /></div>
                  ) : (
                    <small className="swap">Uploaded just now</small>
                  )}
                </div>
                <span className="fs">{u.p < 100 ? `${Math.round(u.p)}%` : "Done"}</span>
              </li>
            ))}
            {FILES.map((f) => {
              const I = f.icon;
              return (
                <li className="file" key={f.n}>
                  <span className={`fi ${f.tone}`}><I size={16} /></span>
                  <div className="fn"><p>{f.n}</p><small>Modified {f.m}</small></div>
                  <span className="fs">{f.s}</span>
                </li>
              );
            })}
          </ul>
        </R>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Shell                                                              */
/* ------------------------------------------------------------------ */

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { id: "profile", label: "Profile", icon: User },
  { id: "saved", label: "Saved", icon: Bookmark },
  { id: "cloud", label: "Cloud storage", icon: Cloud },
];
const STEP = 52; // button height (44) + gap (8)

export default function PremiumDashboard() {
  const [page, setPage] = useState("dashboard");
  const idx = NAV.findIndex((n) => n.id === page);

  return (
    <div className="pd">
      <style>{CSS}</style>

      <aside className="side">
        <div className="logo"><Sparkles size={18} /></div>
        <nav className="nav" aria-label="Main">
          <span className="nav-ind" style={{ transform: `translateY(${idx * STEP}px)` }} />
          {NAV.map((n) => {
            const I = n.icon;
            const active = page === n.id;
            return (
              <button
                key={n.id}
                className={`nav-btn ${active ? "on" : ""}`}
                aria-label={n.label}
                aria-current={active ? "page" : undefined}
                onClick={() => setPage(n.id)}
              >
                <I size={18} strokeWidth={1.8} />
                <span key={active ? `f-${page}` : "t"} className={`tip ${active ? "flash" : ""}`}>{n.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="side-foot">
          <button className="nav-btn" aria-label="Settings">
            <Settings size={18} strokeWidth={1.8} />
            <span className="tip">Settings</span>
          </button>
          <Avatar m={ME} size={36} />
        </div>
      </aside>

      <main className="main" key={page}>
        {page === "dashboard" && <Dashboard />}
        {page === "profile" && <Profile />}
        {page === "saved" && <Saved />}
        {page === "cloud" && <CloudPage />}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Styles (move to globals.css in your project if you prefer)         */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');

.pd{
  --bg:#E8E8EE; --card:#fff; --ink:#18171D; --mute:#8B8A97; --line:#EFEEF4;
  --lav:#EEE8FF; --vio:#7A5AF8; --soft:#F6F5FA;
  --ease:cubic-bezier(.2,.8,.2,1); --spring:cubic-bezier(.34,1.45,.64,1);
  --sh:0 1px 2px rgba(24,23,29,.04),0 10px 30px -14px rgba(24,23,29,.14);
  font-family:'Geist','Inter',system-ui,-apple-system,'Segoe UI',sans-serif;
  color:var(--ink); background:var(--bg);
  height:100vh; height:100dvh; display:flex; gap:16px; padding:14px;
  box-sizing:border-box; overflow:hidden; -webkit-font-smoothing:antialiased;
}
.pd *,.pd *::before,.pd *::after{box-sizing:border-box}
.pd :where(button){font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0}
.pd :where(h1,h3,p){margin:0}
.pd :focus-visible{outline:2px solid var(--vio);outline-offset:2px}
.row{display:flex;align-items:center;gap:6px}
.between{justify-content:space-between}
.num{font-variant-numeric:tabular-nums}

/* Reveal: blur to sharp, staggered */
.rv{animation:rv .8s var(--ease) backwards;animation-delay:calc(var(--i,0) * 70ms)}
@keyframes rv{from{opacity:0;filter:blur(16px);transform:translateY(12px) scale(.985)}}
.swap{display:inline-block;animation:swap .45s var(--ease) backwards}
@keyframes swap{from{opacity:0;filter:blur(6px);transform:translateY(4px)}}

/* Sidebar */
.side{width:64px;flex:none;background:var(--ink);border-radius:26px;display:flex;flex-direction:column;align-items:center;padding:14px 0;gap:26px;position:relative;z-index:5}
.logo{width:38px;height:38px;border-radius:13px;background:linear-gradient(135deg,#D9CCFF,#8C6CF7);display:grid;place-items:center;color:#fff}
.nav{position:relative;display:flex;flex-direction:column;gap:8px}
.nav-ind{position:absolute;left:0;top:0;width:44px;height:44px;border-radius:50%;background:#D9CCFF;transition:transform .6s var(--spring)}
.nav-ind::after{content:"";position:absolute;right:-12px;top:50%;width:8px;height:14px;margin-top:-7px;background:#fff;border-radius:0 8px 8px 0}
.nav-btn{position:relative;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;color:#8F8E9C;transition:color .3s}
.nav-btn:hover{color:#fff}
.nav-btn.on{color:var(--ink)}
.nav-btn svg{position:relative;z-index:1}
.tip{position:absolute;left:calc(100% + 22px);top:50%;transform:translate(-6px,-50%);background:var(--ink);color:#fff;font-size:12px;font-weight:500;padding:6px 10px;border-radius:9px;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s,transform .3s var(--ease);box-shadow:0 8px 18px rgba(0,0,0,.18)}
.nav-btn:hover .tip,.nav-btn:focus-visible .tip{opacity:1;transform:translate(0,-50%)}
.tip.flash{animation:tipflash 1.6s var(--ease)}
@keyframes tipflash{0%{opacity:0;transform:translate(-6px,-50%)}15%,70%{opacity:1;transform:translate(0,-50%)}100%{opacity:0;transform:translate(0,-50%)}}
.side-foot{margin-top:auto;display:flex;flex-direction:column;align-items:center;gap:14px}

/* Layout */
.main{flex:1;min-width:0;overflow-y:auto;overflow-x:hidden;padding:2px 2px 28px}
.grid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:14px}
.c-3{grid-column:span 3}.c-4{grid-column:span 4}.c-5{grid-column:span 5}.c-7{grid-column:span 7}
.c-8{grid-column:span 8}.c-9{grid-column:span 9}.c-12{grid-column:span 12}
.col{display:flex;flex-direction:column;gap:14px}
.page-h{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap;margin:8px 4px 20px}
.page-h h1{font-size:clamp(24px,3vw,32px);font-weight:600;letter-spacing:-.03em}
.page-h p{font-size:13px;color:var(--mute);margin-top:6px}

/* Cards and controls */
.card{background:var(--card);border-radius:22px;padding:18px;box-shadow:var(--sh);min-width:0}
.card-h{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:14px}
.card-h h3{font-size:14px;font-weight:600;letter-spacing:-.01em}
.mute{color:var(--mute);font-size:12px}
.link{font-size:12px;color:var(--mute);transition:color .2s}
.link:hover:not(:disabled){color:var(--ink)}
.link:disabled{cursor:default}
.chip{font-size:11px;font-weight:500;padding:4px 10px;border-radius:999px;background:var(--lav);color:#5B3FD6}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;padding:0 15px;border-radius:999px;font-size:13px;font-weight:500;white-space:nowrap;transition:transform .3s var(--spring),box-shadow .3s var(--ease),background .2s}
.btn.dark{background:var(--ink);color:#fff}
.btn.dark:hover{box-shadow:0 10px 20px -10px rgba(24,23,29,.7)}
.btn.light{background:#fff;color:var(--ink)}
.btn.wide{width:100%;margin-top:12px}
.press:active{transform:scale(.95)}
.ibtn{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;color:var(--mute);transition:background .2s,color .2s,transform .3s var(--spring)}
.ibtn:hover{background:#F1F0F6;color:var(--ink)}
.ibtn:active{transform:scale(.88)}
.ibtn.on{color:var(--vio)}
.lift{transition:transform .45s var(--ease),box-shadow .45s var(--ease)}
.lift:hover{transform:translateY(-4px);box-shadow:0 2px 4px rgba(24,23,29,.04),0 24px 40px -18px rgba(24,23,29,.28)}

/* Segmented */
.seg{position:relative;display:inline-flex;background:#F1F0F6;border-radius:999px;padding:3px;flex:none}
.seg-ind{position:absolute;top:3px;bottom:3px;left:0;border-radius:999px;background:#fff;box-shadow:0 1px 3px rgba(24,23,29,.12);transition:transform .55s var(--spring),width .55s var(--spring)}
.seg-btn{position:relative;z-index:1;height:28px;padding:0 12px;font-size:12px;font-weight:500;color:var(--mute);border-radius:999px;transition:color .3s}
.seg-btn.on{color:var(--ink)}
.seg-days{display:flex;width:100%;background:transparent;padding:0}
.seg-days .seg-ind{top:0;bottom:0;border-radius:15px;background:var(--ink);box-shadow:0 10px 18px -10px rgba(24,23,29,.6)}
.seg-days .seg-btn{flex:1;min-width:0;padding:0;height:60px;border-radius:15px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.seg-days .seg-btn small{font-size:11px}
.seg-days .seg-btn b{font-size:15px;font-weight:600;color:var(--ink);transition:color .3s}
.seg-days .seg-btn.on,.seg-days .seg-btn.on b{color:#fff}
.day-note{margin-top:14px;display:flex;align-items:center;gap:8px;font-size:12px;color:#55536A;background:var(--soft);border-radius:12px;padding:11px 12px}

/* Bloom (3D-ish flower) */
.bloom-wrap{filter:drop-shadow(0 16px 20px rgba(110,80,230,.28));flex:none}
.bloom{position:relative;--p1:#CDBBFF;--p2:#8C6CF7;transition:transform .7s var(--spring)}
.bloom.pink{--p1:#FAD0EC;--p2:#DE7DBE}
.bloom.mint{--p1:#C6EEDB;--p2:#4DB98C}
.bloom.blue{--p1:#D3E2FF;--p2:#6A8FF0}
.bloom span{position:absolute;left:50%;top:50%;width:48%;height:26%;margin-top:-13%;transform-origin:0 50%;border-radius:0 60% 60% 0/0 50% 50% 0;background:linear-gradient(90deg,rgba(255,255,255,.95),var(--p1) 40%,var(--p2));box-shadow:inset -4px -3px 8px rgba(40,20,90,.16)}
.bloom i{position:absolute;inset:36%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff,var(--p1) 55%,var(--p2))}
.bloom.spin{animation:spin 50s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* Dashboard */
.hero{position:relative;overflow:hidden;min-height:184px;display:flex;align-items:center;padding:26px;background:linear-gradient(115deg,#ECE5FF 0%,#DCCEFF 48%,#F4DDF6 100%)}
.hero-copy{position:relative;z-index:1;max-width:360px;display:flex;flex-direction:column;gap:10px;align-items:flex-start}
.hero h1{font-size:clamp(21px,2.3vw,28px);font-weight:600;letter-spacing:-.03em;line-height:1.12}
.hero p{font-size:13px;color:#5E5A70;line-height:1.5}
.hero-art{position:absolute;right:2%;top:50%;transform:translateY(-50%)}
.members{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
.member{display:flex;flex-direction:column;align-items:center;gap:8px;font-size:12px;color:#55536A}
.av{display:inline-grid;place-items:center;border-radius:50%;font-weight:600;color:rgba(24,23,29,.72);flex:none}
.av.ring{box-shadow:0 0 0 5px #fff,0 12px 26px -10px rgba(24,23,29,.45)}
.stack{display:flex;align-items:center;gap:14px;margin-top:16px;padding-top:14px;border-top:1px solid var(--line);font-size:12px;color:var(--mute)}
.stack .row{gap:0}
.stack .av{margin-right:-8px;box-shadow:0 0 0 2px #fff}
.big{font-size:40px;font-weight:600;letter-spacing:-.035em;line-height:1}
.big-sm{font-size:15px;font-weight:600}
.bars{display:flex;align-items:flex-end;gap:6px;height:84px;margin-top:18px}
.bar-col{flex:1;height:100%;display:flex;align-items:flex-end}
.bar{display:block;width:100%;border-radius:8px;background:#ECE7FB;transform-origin:bottom;transition:height .6s var(--ease),background .3s;animation:grow .9s var(--ease) backwards;animation-delay:calc(var(--i) * 50ms + 250ms)}
.bar-col:hover .bar{background:#DCD2FA}
.bar-col.on .bar{background:linear-gradient(180deg,#A28BFA,#7A5AF8)}
@keyframes grow{from{transform:scaleY(0)}}
.bar-days{display:flex;gap:6px;margin-top:6px}
.bar-days span{flex:1;text-align:center;font-size:10px;color:var(--mute)}
.vids{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.vid{text-align:left;display:flex;flex-direction:column;gap:6px;border-radius:16px;padding:6px;transition:background .25s}
.vid:hover{background:var(--soft)}
.thumb{position:relative;height:96px;border-radius:13px;display:grid;place-items:center;overflow:hidden}
.t-lav{background:linear-gradient(135deg,#F3EEFF,#DFD4FF)}
.t-blue{background:linear-gradient(135deg,#F0F4FF,#D6E3FF)}
.t-pink{background:linear-gradient(135deg,#FFF1FA,#F7D5EC)}
.t-mint{background:linear-gradient(135deg,#F0FBF5,#CFEFDF)}
.vid:hover .bloom,.lift:hover .bloom{transform:scale(1.1) rotate(14deg)}
.dur{position:absolute;right:6px;bottom:6px;font-size:10px;font-weight:500;background:rgba(24,23,29,.75);color:#fff;padding:2px 6px;border-radius:6px}
.play{position:absolute;left:6px;bottom:6px;width:24px;height:24px;border-radius:50%;background:#fff;display:grid;place-items:center;opacity:0;transform:scale(.5);transition:opacity .25s,transform .4s var(--spring)}
.vid:hover .play{opacity:1;transform:none}
.vid p{font-size:12px;font-weight:500;line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.vid small{font-size:11px;color:var(--mute)}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:4px}
.pair b{display:block;font-size:36px;font-weight:600;letter-spacing:-.035em;line-height:1.05}
.pair small{font-size:12px;color:var(--mute)}
.meter{height:6px;border-radius:99px;background:#F0EFF5;margin-top:12px;overflow:hidden}
.meter span{display:block;height:100%;border-radius:inherit;background:var(--vio);transition:width .8s var(--ease)}
.event{display:flex;align-items:center;gap:12px;background:var(--ink);color:#fff;border-radius:999px;padding:8px 8px 8px 18px;box-shadow:0 16px 30px -16px rgba(24,23,29,.75)}
.event > div{flex:1;min-width:0;display:flex;flex-direction:column}
.event b{font-size:13px;font-weight:600}
.event small{font-size:11px;color:#A9A7B8}
.live{width:8px;height:8px;border-radius:50%;background:#4ADE80;flex:none;animation:pulse 2s infinite}
@keyframes pulse{0%{box-shadow:0 0 0 0 rgba(74,222,128,.6)}70%,100%{box-shadow:0 0 0 9px rgba(74,222,128,0)}}
.promo{flex:1;display:flex;gap:14px;align-items:center;background:linear-gradient(135deg,#FFFFFF,#FBEFF8)}
.promo h3{font-size:15px;font-weight:600;letter-spacing:-.01em}
.promo p{font-size:12px;color:var(--mute);margin:4px 0 12px;line-height:1.45}
.notes{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:2px}
.note{display:flex;align-items:center;gap:10px;padding:8px;border-radius:14px;transition:background .25s}
.note:hover{background:var(--soft)}
.note > div{flex:1;min-width:0}
.note p{font-size:12px;line-height:1.4;color:#55536A}
.note p b{color:var(--ink);font-weight:600}
.note small{font-size:11px;color:var(--mute)}
.note .dot{width:7px;height:7px;border-radius:50%;background:var(--vio);flex:none;transition:transform .45s var(--spring),opacity .3s}
.note.read .dot{transform:scale(0);opacity:0}

/* Profile */
.pro{padding:0;overflow:hidden}
.pro-banner{height:136px;position:relative;overflow:hidden;background:linear-gradient(115deg,#ECE5FF,#D9CBFF 50%,#F6DDF4)}
.pro-banner .bloom-wrap{position:absolute;right:6%;top:-34px}
.pro-row{display:flex;align-items:flex-end;gap:16px;padding:0 22px 20px;margin-top:-40px;flex-wrap:wrap;position:relative}
.pro-id{flex:1;min-width:200px;padding-bottom:4px}
.pro-id h1{font-size:22px;font-weight:600;letter-spacing:-.025em}
.pro-id p{font-size:13px;color:var(--mute);margin-top:2px}
.status{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 14px;border-radius:999px;font-size:13px;font-weight:500;background:#E7F8EE;color:#1E7A48;transition:background .35s,color .35s,transform .3s var(--spring)}
.status:active{transform:scale(.95)}
.status span{width:8px;height:8px;border-radius:50%;background:#22C55E;transition:background .35s}
.status.busy{background:#FDECEC;color:#B42318}
.status.busy span{background:#EF4444}
.pstat small{font-size:12px;color:var(--mute)}
.pstat b{display:block;font-size:32px;font-weight:600;letter-spacing:-.035em;margin-top:10px}
.about p{font-size:13px;line-height:1.6;color:#55536A;max-width:60ch}
.tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:16px}
.tags span{font-size:12px;padding:6px 11px;border-radius:999px;background:#F1F0F6}
.fchart{display:flex;align-items:flex-end;gap:10px;height:160px;padding-top:28px}
.fcol{flex:1;height:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:8px}
.fcol small{font-size:11px;color:var(--mute)}
.fbar{position:relative;width:100%;max-width:46px;border-radius:12px;background:linear-gradient(180deg,#E6DEFF,#CDBDFF);transform-origin:bottom;animation:grow .9s var(--ease) backwards;animation-delay:calc(var(--i) * 60ms + 300ms);transition:background .3s}
.fcol:hover .fbar{background:linear-gradient(180deg,#A28BFA,#7A5AF8)}
.fval{position:absolute;left:50%;top:-28px;transform:translate(-50%,6px);font-size:11px;font-weight:600;background:var(--ink);color:#fff;padding:3px 7px;border-radius:7px;opacity:0;white-space:nowrap;transition:opacity .25s,transform .35s var(--spring)}
.fcol:hover .fval{opacity:1;transform:translate(-50%,0)}

/* Saved */
.saved-grid{position:relative;display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:14px;align-content:start}
.saved{padding:8px;display:flex;flex-direction:column}
.saved .thumb{height:124px}
.saved-b{padding:10px 6px 2px}
.saved-b p{font-size:13px;font-weight:500;line-height:1.35}
.saved-f{display:flex;align-items:center;justify-content:space-between;padding:4px 0 0 6px;margin-top:auto}
.saved-f small{font-size:11px;color:var(--mute)}
.tag{position:absolute;left:8px;top:8px;font-size:10px;font-weight:600;padding:3px 8px;border-radius:999px;background:var(--ink);color:#fff}
.ticon{width:46px;height:46px;border-radius:15px;background:#fff;display:grid;place-items:center;color:#55536A;box-shadow:0 10px 20px -10px rgba(24,23,29,.35);transition:transform .55s var(--spring)}
.saved:hover .ticon{transform:translateY(-4px) rotate(-8deg)}
.rv.leaving{animation:leave .38s var(--ease) forwards;pointer-events:none}
@keyframes leave{to{opacity:0;filter:blur(10px);transform:scale(.92)}}
.empty{grid-column:1/-1;padding:44px 20px;text-align:center;color:var(--mute);font-size:13px;background:#F1F0F6;border-radius:22px}
.coll-card{align-self:start}
.coll{list-style:none;margin:0;padding:0}
.coll li{display:flex;align-items:center;gap:10px;padding:8px 6px;border-radius:12px;font-size:13px;transition:background .2s}
.coll li:hover{background:var(--soft)}
.coll .sw{width:30px;height:30px;border-radius:10px;flex:none}
.coll .n{flex:1;min-width:0}
.coll small{color:var(--mute);font-size:12px}

/* Cloud */
.ring-wrap{display:flex;align-items:center;gap:26px;flex-wrap:wrap}
.ring{position:relative;width:150px;height:150px;flex:none}
.ring svg{transform:rotate(-90deg)}
.ring circle{fill:none;stroke-width:12}
.ring .trk{stroke:#F0EDF9}
.ring .val{stroke:url(#rg);stroke-linecap:round;transition:stroke-dashoffset 1.4s var(--ease) .15s}
.ring-c{position:absolute;inset:0;display:grid;place-content:center;text-align:center}
.ring-c b{font-size:22px;font-weight:600;letter-spacing:-.03em}
.ring-c small{font-size:11px;color:var(--mute)}
.cats{flex:1;min-width:200px;display:flex;flex-direction:column;gap:14px}
.cat{display:flex;align-items:center;gap:12px;font-size:13px}
.cat small{color:var(--mute);font-size:12px}
.ci{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;flex:none}
.cn{flex:1}
.cm{height:5px;border-radius:9px;background:#F0EFF5;margin-top:7px;overflow:hidden}
.cm span{display:block;height:100%;border-radius:inherit;transform-origin:left;animation:growx 1s var(--ease) backwards;animation-delay:calc(var(--i) * 80ms + 300ms)}
@keyframes growx{from{transform:scaleX(0)}}
.tn-lav{background:#EEE8FF;color:#6B4CF0}
.tn-blue{background:#E6EEFF;color:#3F6AE0}
.tn-pink{background:#FCE8F5;color:#C2479A}
.tn-mint{background:#E2F6EC;color:#23905F}
.drop{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:8px;background:linear-gradient(135deg,#F4F0FF,#FBF2FA);border:1.5px dashed #D4C8F7;box-shadow:none}
.drop h3{font-size:15px;font-weight:600}
.drop p{font-size:12px;color:var(--mute);max-width:240px;line-height:1.45;margin-bottom:6px}
.drop-ic{width:46px;height:46px;border-radius:15px;background:#fff;color:var(--vio);display:grid;place-items:center;box-shadow:0 10px 20px -10px rgba(110,80,230,.5)}
.files{list-style:none;margin:0;padding:0}
.file{display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:14px;font-size:13px;transition:background .2s}
.file:hover{background:var(--soft)}
.file.new{animation:rv .6s var(--ease) backwards}
.fi{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;flex:none}
.fn{flex:1;min-width:0}
.fn p{font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fn small{color:var(--mute);font-size:11px}
.fs{color:var(--mute);font-size:12px;white-space:nowrap;font-variant-numeric:tabular-nums}
.up-bar{height:4px;border-radius:9px;background:#F0EFF5;margin-top:7px;overflow:hidden;max-width:320px}
.up-bar span{display:block;height:100%;background:var(--vio);border-radius:inherit;transition:width .2s linear}

/* Responsive */
@media (max-width:1100px){
  .c-3,.c-4{grid-column:span 6}
  .c-5,.c-7,.c-8,.c-9{grid-column:span 12}
}
@media (max-width:680px){
  .pd{padding:10px;gap:10px}
  .side{width:56px;border-radius:22px}
  .c-4{grid-column:span 12}
  .c-3{grid-column:span 6}
  .hero-art{right:-60px;opacity:.55}
  .pstat b{font-size:26px}
}

/* Respect reduced motion */
@media (prefers-reduced-motion:reduce){
  .pd *,.pd *::before,.pd *::after{animation-duration:.01ms!important;animation-delay:0ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}
}
`;
