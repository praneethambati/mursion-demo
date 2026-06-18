import { useState, useEffect, useRef, useCallback } from "react";
import {
  Video, VideoOff, Mic, MicOff, Cpu, Activity, Clock,
  BarChart2, User, Users, BookOpen, TrendingUp, Award,
  Zap, AlertCircle, CheckCircle, Target, ChevronRight,
  Radio, LogOut, RotateCcw, Play, FileText, Layers,
  Keyboard, WifiOff, Download
} from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from "recharts";

// ── Design tokens ──────────────────────────────────────────────────────────────
const T = {
  bg:      "#080808",
  surface: "#111111",
  raised:  "#181818",
  border:  "#242424",
  borderHi:"#333333",
  white:   "#FFFFFF",
  textPri: "#F0F0F0",
  textSec: "#888888",
  textMut: "#3A3A3A",
};

// ── Scenarios ──────────────────────────────────────────────────────────────────
const SCENARIOS = {
  classroom: {
    id: "classroom",
    title: "Classroom Management",
    subtitle: "De-escalate a disruptive student through genuine connection",
    role: "Teacher",
    avatarName: "Ethan",
    avatarRole: "Student, Grade 7",
    avatarInitial: "E",
    turns: [
      "Ugh, why do we even have to learn this? It's completely pointless.",
      "I don't care about fractions. When am I ever going to use this in real life?",
      "Everyone else thinks it's boring too. They just won't say it.",
      "I guess... but it still sounds kind of dumb to me.",
      "Fine. Maybe. But only if it's actually got something to do with games.",
      "Okay... that's actually kind of interesting. I didn't know that.",
    ],
    evalContext: "Teacher managing a disruptive student. Evaluate: empathy, de_escalation, engagement, clarity, adaptability, rapport.",
    icon: BookOpen,
  },
  performance: {
    id: "performance",
    title: "Performance Review",
    subtitle: "Coach an overwhelmed employee without triggering defensiveness",
    role: "Manager",
    avatarName: "Jordan",
    avatarRole: "Engineer, 2 years",
    avatarInitial: "J",
    turns: [
      "I already know what this meeting is about. The missed deadlines.",
      "It's not like I'm not trying. There's just way too much on my plate right now.",
      "I didn't want to seem like I couldn't handle it, so I kept trying to push through.",
      "I don't know. I keep starting things and then getting pulled into other fires.",
      "That would actually help a lot. I just didn't want to be a burden.",
      "Yeah. I think I can do better with the right structure. Thanks for hearing me out.",
    ],
    evalContext: "Manager conducting performance review. Evaluate: empathy, active_listening, clarity, psychological_safety, coaching, rapport.",
    icon: Users,
  },
};

// ── Cartoon avatar ─────────────────────────────────────────────────────────────
const CA_STYLES = `
  .ca-svg { width: 100%; max-width: 200px; height: auto; display: block; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.45)); }
  .ca-eyelid { transform-origin: center; transform-box: fill-box; animation: caBlink 3s infinite; }
  .ca-eyelid-r { animation-delay: 0.05s; }
  @keyframes caBlink { 0%, 96%, 100% { transform: scaleY(0); } 98% { transform: scaleY(1); } }
  .ca-mouth { transform-origin: center; transform-box: fill-box; }
  .ca-mouth-talk { animation: caMouthTalk 0.32s ease-in-out infinite; }
  @keyframes caMouthTalk { 0%, 100% { transform: scaleY(0.35); } 50% { transform: scaleY(1.15); } }
`;

function CartoonAvatar({ scenarioId, agentSpeaking, turnIndex }) {
  const mouthClass = agentSpeaking ? "ca-mouth ca-mouth-talk" : "ca-mouth";

  if (scenarioId === "classroom") {
    const grumpy = turnIndex < 2;
    const soft   = turnIndex >= 4;
    return (
      <>
        <style>{CA_STYLES}</style>
        <svg className="ca-svg" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="ethan-skin" cx="42%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFE4C4" />
              <stop offset="55%" stopColor="#F5C99A" />
              <stop offset="100%" stopColor="#D4956A" />
            </radialGradient>
            <radialGradient id="ethan-cheek" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF9E7A" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#E87850" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ethan-shirt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFD54F" />
              <stop offset="100%" stopColor="#F9A825" />
            </linearGradient>
            <linearGradient id="ethan-vest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EF5350" />
              <stop offset="100%" stopColor="#C62828" />
            </linearGradient>
            <radialGradient id="ethan-hair" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#3D3D3D" />
              <stop offset="100%" stopColor="#0D0D0D" />
            </radialGradient>
            <radialGradient id="ethan-eye" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0E0E0" />
            </radialGradient>
            <radialGradient id="ethan-iris" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#5D4037" />
              <stop offset="100%" stopColor="#1A0A00" />
            </radialGradient>
            <filter id="ethan-soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* body — Motu-style round belly */}
          <ellipse cx="70" cy="138" rx="48" ry="22" fill="url(#ethan-shirt)" filter="url(#ethan-soft)" />
          <path d="M28 128 Q70 108 112 128 L118 160 L22 160 Z" fill="url(#ethan-shirt)" />
          <path d="M38 130 Q70 118 102 130 L106 160 L34 160 Z" fill="url(#ethan-vest)" />
          <ellipse cx="70" cy="126" rx="22" ry="14" fill="url(#ethan-vest)" opacity="0.85" />

          {/* ears */}
          <ellipse cx="24" cy="78" rx="9" ry="11" fill="url(#ethan-skin)" />
          <ellipse cx="116" cy="78" rx="9" ry="11" fill="url(#ethan-skin)" />
          <ellipse cx="24" cy="78" rx="5" ry="6" fill="#E8A87C" opacity="0.5" />
          <ellipse cx="116" cy="78" rx="5" ry="6" fill="#E8A87C" opacity="0.5" />

          {/* hair back */}
          <ellipse cx="70" cy="46" rx="52" ry="42" fill="url(#ethan-hair)" />
          <path d="M16 54 Q22 14 70 10 Q118 14 124 54 Q108 28 70 24 Q32 28 16 54Z" fill="url(#ethan-hair)" />
          <ellipse cx="50" cy="28" rx="14" ry="8" fill="#5A5A5A" opacity="0.35" />

          {/* face — very round chubby */}
          <ellipse cx="70" cy="78" rx="46" ry="44" fill="url(#ethan-skin)" filter="url(#ethan-soft)" />
          {/* chin / double chin */}
          <ellipse cx="70" cy="108" rx="28" ry="12" fill="url(#ethan-skin)" />
          <ellipse cx="70" cy="112" rx="20" ry="7" fill="#D4956A" opacity="0.35" />

          {/* cheek blush */}
          <ellipse cx="34" cy="88" rx="14" ry="10" fill="url(#ethan-cheek)" />
          <ellipse cx="106" cy="88" rx="14" ry="10" fill="url(#ethan-cheek)" />

          {/* forehead highlight */}
          <ellipse cx="58" cy="58" rx="18" ry="10" fill="#FFFFFF" opacity="0.22" />

          {/* eyebrows */}
          {grumpy ? (
            <>
              <path d="M38 62 L56 70" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
              <path d="M102 62 L84 70" stroke="#1A1A1A" strokeWidth="5" strokeLinecap="round" />
            </>
          ) : soft ? (
            <>
              <path d="M40 64 Q50 58 60 64" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M100 64 Q90 58 80 64" stroke="#1A1A1A" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <path d="M38 66 L60 66" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" />
              <path d="M102 66 L80 66" stroke="#1A1A1A" strokeWidth="4.5" strokeLinecap="round" />
            </>
          )}

          {/* eyes — big 3D */}
          <ellipse cx="50" cy="78" rx="14" ry="15" fill="url(#ethan-eye)" />
          <ellipse cx="90" cy="78" rx="14" ry="15" fill="url(#ethan-eye)" />
          <ellipse cx="50" cy="78" rx="14" ry="15" fill="none" stroke="#C4A882" strokeWidth="0.8" opacity="0.5" />
          <ellipse cx="90" cy="78" rx="14" ry="15" fill="none" stroke="#C4A882" strokeWidth="0.8" opacity="0.5" />
          <circle cx="52" cy="80" r="7.5" fill="url(#ethan-iris)" />
          <circle cx="92" cy="80" r="7.5" fill="url(#ethan-iris)" />
          <circle cx="54" cy="76" r="3" fill="#FFFFFF" opacity="0.95" />
          <circle cx="94" cy="76" r="3" fill="#FFFFFF" opacity="0.95" />
          <circle cx="50" cy="82" r="1.2" fill="#FFFFFF" opacity="0.6" />

          {/* eyelids */}
          <ellipse className="ca-eyelid" cx="50" cy="78" rx="15" ry="16" fill="url(#ethan-skin)" />
          <ellipse className="ca-eyelid ca-eyelid-r" cx="90" cy="78" rx="15" ry="16" fill="url(#ethan-skin)" />

          {/* nose — round 3D */}
          <ellipse cx="70" cy="92" rx="7" ry="6" fill="#E8A87C" />
          <ellipse cx="68" cy="90" rx="3" ry="2" fill="#FFFFFF" opacity="0.35" />

          {/* mouth */}
          <g className={mouthClass} transform="translate(70, 106)">
            {grumpy && !agentSpeaking ? (
              <path d="M-14 0 Q0 -8 14 0" stroke="#A0522D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            ) : soft && !agentSpeaking ? (
              <path d="M-14 3 Q0 14 14 3" stroke="#A0522D" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            ) : (
              <>
                <ellipse cx="0" cy="2" rx="14" ry="7" fill="#6D2B1A" />
                <ellipse cx="0" cy="0" rx="12" ry="4" fill="#C0392B" />
              </>
            )}
          </g>

          {/* hair front strands */}
          <path d="M20 50 Q30 32 44 38 M96 38 Q110 32 120 50" stroke="#2A2A2A" strokeWidth="4" strokeLinecap="round" />
          <path d="M70 12 Q58 22 52 36 M70 12 Q82 22 88 36" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </>
    );
  }

  // Jordan — 3D tired office worker
  const tense = turnIndex < 3;
  return (
    <>
      <style>{CA_STYLES}</style>
      <svg className="ca-svg" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="jordan-skin" cx="42%" cy="32%" r="68%">
            <stop offset="0%" stopColor="#F5DFC8" />
            <stop offset="55%" stopColor="#E8C4A8" />
            <stop offset="100%" stopColor="#C9A07A" />
          </radialGradient>
          <linearGradient id="jordan-shirt" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5C7A8F" />
            <stop offset="100%" stopColor="#2C3E50" />
          </linearGradient>
          <linearGradient id="jordan-collar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ECF0F1" />
            <stop offset="100%" stopColor="#BDC3C7" />
          </linearGradient>
          <radialGradient id="jordan-hair" cx="50%" cy="28%" r="72%">
            <stop offset="0%" stopColor="#6D4C41" />
            <stop offset="100%" stopColor="#2C1810" />
          </radialGradient>
          <radialGradient id="jordan-eye" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#D5D5D5" />
          </radialGradient>
          <filter id="jordan-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* shoulders / shirt */}
        <path d="M16 122 L48 108 L70 116 L92 108 L124 122 L130 160 L10 160 Z" fill="url(#jordan-shirt)" filter="url(#jordan-soft)" />
        <path d="M48 108 L70 116 L92 108 L88 160 L52 160 Z" fill="#34495E" opacity="0.5" />
        {/* collar */}
        <path d="M48 108 L70 118 L92 108 L86 128 L70 122 L54 128 Z" fill="url(#jordan-collar)" />
        <path d="M70 118 L70 160" stroke="#BDC3C7" strokeWidth="2" />
        {/* tie */}
        <path d="M70 118 L64 160 L70 154 L76 160 Z" fill="#C0392B" />
        <path d="M70 118 L66 130 L70 126 L74 130 Z" fill="#E74C3C" />

        {/* neck */}
        <rect x="56" y="108" width="28" height="18" rx="4" fill="url(#jordan-skin)" />

        {/* hair */}
        <ellipse cx="70" cy="50" rx="38" ry="32" fill="url(#jordan-hair)" />
        <path d="M34 56 Q36 26 70 22 Q104 26 106 56" fill="url(#jordan-hair)" />
        <ellipse cx="55" cy="30" rx="12" ry="6" fill="#8D6E63" opacity="0.3" />

        {/* face */}
        <ellipse cx="70" cy="76" rx="36" ry="40" fill="url(#jordan-skin)" filter="url(#jordan-soft)" />
        <ellipse cx="58" cy="56" rx="14" ry="8" fill="#FFFFFF" opacity="0.18" />

        {/* under-eye bags */}
        <ellipse cx="50" cy="86" rx="12" ry="6" fill="#B8956F" opacity="0.55" />
        <ellipse cx="90" cy="86" rx="12" ry="6" fill="#B8956F" opacity="0.55" />
        <path d="M38 84 Q50 90 62 84" stroke="#A08060" strokeWidth="1.5" fill="none" opacity="0.6" />
        <path d="M78 84 Q90 90 102 84" stroke="#A08060" strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* eyebrows */}
        <path d={tense ? "M36 60 L54 68" : "M38 62 L56 62"} stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d={tense ? "M104 60 L86 68" : "M102 62 L84 62"} stroke="#3E2723" strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* eyes */}
        <ellipse cx="50" cy="76" rx="11" ry="12" fill="url(#jordan-eye)" />
        <ellipse cx="90" cy="76" rx="11" ry="12" fill="url(#jordan-eye)" />
        <circle cx="51" cy="78" r="5.5" fill="#1A0A00" />
        <circle cx="91" cy="78" r="5.5" fill="#1A0A00" />
        <circle cx="53" cy="75" r="2" fill="#FFFFFF" opacity="0.9" />
        <circle cx="93" cy="75" r="2" fill="#FFFFFF" opacity="0.9" />

        {/* eyelids */}
        <ellipse className="ca-eyelid" cx="50" cy="76" rx="12" ry="13" fill="url(#jordan-skin)" />
        <ellipse className="ca-eyelid ca-eyelid-r" cx="90" cy="76" rx="12" ry="13" fill="url(#jordan-skin)" />

        {/* sweat drop */}
        {tense && (
          <g opacity="0.85">
            <path d="M108 54 Q112 62 106 68 Q114 62 108 54Z" fill="#85C1E9" />
            <ellipse cx="109" cy="58" rx="2" ry="3" fill="#FFFFFF" opacity="0.5" />
          </g>
        )}

        {/* mouth */}
        <g className={mouthClass} transform="translate(70, 98)">
          {tense && !agentSpeaking ? (
            <path d="M-11 0 L11 0" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" />
          ) : !agentSpeaking ? (
            <path d="M-11 2 Q0 10 11 2" stroke="#8B6914" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : (
            <>
              <ellipse cx="0" cy="2" rx="12" ry="6" fill="#5D4037" />
              <ellipse cx="0" cy="0" rx="10" ry="3.5" fill="#C0392B" opacity="0.8" />
            </>
          )}
        </g>
      </svg>
    </>
  );
}

// ── EEG line ───────────────────────────────────────────────────────────────────
function EEGLine({ active }) {
  const canvasRef = useRef(null);
  const frameRef  = useRef(null);
  const phaseRef  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width  = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = 36 * window.devicePixelRatio;
    canvas.style.height = "36px";
    const W = canvas.width, H = canvas.height;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.shadowBlur = 0;
      if (!active) {
        ctx.strokeStyle = T.border;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, H / 2);
        ctx.lineTo(W, H / 2);
        ctx.stroke();
        return;
      }
      phaseRef.current += 0.035;
      const p = phaseRef.current;
      ctx.strokeStyle = T.white;
      ctx.lineWidth = 1.5 * window.devicePixelRatio;
      ctx.beginPath();
      for (let x = 0; x < W; x++) {
        const t = x / W;
        const y = H / 2
          + Math.sin(t * 12 + p) * H * 0.22
          + Math.sin(t * 5  + p * 0.7) * H * 0.12
          + Math.sin(t * 28 + p * 1.4) * H * 0.07;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      frameRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [active]);

  return <canvas ref={canvasRef} style={{ width: "100%", height: 36, display: "block" }} />;
}

// ── Score bar ──────────────────────────────────────────────────────────────────
function ScoreBar({ label, value }) {
  return (
    <div style={{ marginBottom: 11 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 10, color: T.textSec, textTransform: "uppercase", letterSpacing: "0.10em", fontFamily: "Inter, sans-serif" }}>
          {label.replace(/_/g, " ")}
        </span>
        <span style={{ fontSize: 11, color: value > 0 ? T.textPri : T.textMut, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
          {value.toString().padStart(3, "0")}
        </span>
      </div>
      <div style={{ height: 2, background: T.border }}>
        <div style={{ height: "100%", width: `${value}%`, background: T.white, transition: "width 0.9s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
}

// ── Transcript bubble ──────────────────────────────────────────────────────────
function Bubble({ speaker, text, isAgent }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: isAgent ? "flex-start" : "flex-end", marginBottom: 14, animation: "slideUp 0.2s ease forwards" }}>
      <span style={{ fontSize: 10, color: T.textMut, marginBottom: 4, fontFamily: "Inter, sans-serif", letterSpacing: "0.07em", textTransform: "uppercase" }}>{speaker}</span>
      <div style={{
        maxWidth: "86%", padding: "10px 14px",
        borderRadius: isAgent ? "2px 10px 10px 10px" : "10px 2px 10px 10px",
        background: isAgent ? T.surface : T.raised,
        border: `1px solid ${T.border}`,
        fontSize: 13, color: T.textPri, lineHeight: 1.6, fontFamily: "Inter, sans-serif",
      }}>
        {text}
      </div>
    </div>
  );
}

// ── Insight row ────────────────────────────────────────────────────────────────
function InsightRow({ text, time }) {
  return (
    <div style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${T.border}`, animation: "slideUp 0.25s ease" }}>
      <Activity size={12} color={T.textSec} style={{ marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.55, fontFamily: "Inter, sans-serif" }}>{text}</div>
        <div style={{ fontSize: 10, color: T.textMut, marginTop: 3, fontFamily: "'JetBrains Mono', monospace" }}>{time}</div>
      </div>
    </div>
  );
}

// ── Error banner ───────────────────────────────────────────────────────────────
function ErrorBanner({ message, onDismiss }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.borderHi}`, borderLeft: `2px solid ${T.textSec}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, animation: "slideUp 0.2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <WifiOff size={12} color={T.textSec} />
        <span style={{ fontSize: 12, color: T.textSec, fontFamily: "Inter, sans-serif" }}>{message}</span>
      </div>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: T.textMut, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ── Generating overlay (report loading) ───────────────────────────────────────
function GeneratingOverlay() {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? "" : d + "."), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24, fontFamily: "Inter, sans-serif" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: T.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Cpu size={16} color={T.bg} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: T.textPri, marginBottom: 6 }}>
          Generating report{dots}
        </div>
        <div style={{ fontSize: 13, color: T.textMut }}>Analysing your full session — this takes a moment</div>
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: T.borderHi, animation: `blink 1.2s ${i*0.3}s infinite` }} />
        ))}
      </div>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const speak = (text, onEnd) => {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.93; u.pitch = 1.0; u.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const pick = voices.find(v => v.lang === "en-US") || voices[0];
  if (pick) u.voice = pick;

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    clearInterval(poll);
    onEnd?.();
  };
  u.onend = finish;
  u.onerror = finish;
  window.speechSynthesis.speak(u);
  // Chrome often never fires onend — poll instead
  const poll = setInterval(() => {
    if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) finish();
  }, 200);
};

// All API calls go through our own serverless proxy — key stays server-side
const callClaude = async (body) => {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || data.error || `API error ${res.status}`);
  return data.content?.map(b => b.text || "").join("") || "";
};

const fmt = s => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const escHtml = s => String(s)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const buildReportHtml = (report, scenario, duration, transcript) => {
  const scoreRows = Object.entries(report.scores)
    .map(([k, v]) => `<tr><td>${escHtml(k.replace(/_/g, " "))}</td><td>${v}</td></tr>`)
    .join("");
  const strengths = report.strengths.map(s => `<li>${escHtml(s)}</li>`).join("");
  const improvements = report.improvements.map(s => `<li>${escHtml(s)}</li>`).join("");
  const turns = transcript.map(t =>
    `<div class="turn"><div class="speaker">${escHtml(t.speaker)}</div><p>${escHtml(t.text)}</p></div>`
  ).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SimEval Report — ${escHtml(scenario?.title || "Simulation")}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Inter, system-ui, sans-serif; background: #f4f4f4; color: #111; line-height: 1.6; padding: 40px 24px; }
    .page { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 36px; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    .meta { color: #666; font-size: 13px; margin-bottom: 28px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 12px; margin-bottom: 20px; }
    .card { border: 1px solid #e0e0e0; border-radius: 10px; padding: 18px; }
    .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; color: #888; margin-bottom: 8px; }
    .big { font-family: "JetBrains Mono", monospace; font-size: 42px; font-weight: 600; text-align: center; }
    .summary { font-size: 14px; color: #444; }
    h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #888; margin: 24px 0 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 14px; }
    td { padding: 8px 0; border-bottom: 1px solid #eee; }
    td:last-child { text-align: right; font-family: "JetBrains Mono", monospace; font-weight: 600; }
    ul { padding-left: 18px; font-size: 14px; color: #444; }
    li { margin-bottom: 8px; }
    .quote { border-left: 3px solid #111; padding: 12px 16px; font-style: italic; color: #444; background: #fafafa; border-radius: 0 8px 8px 0; }
    .focus { font-size: 16px; font-weight: 500; }
    .turn { margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid #eee; }
    .speaker { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 4px; }
    .turn p { font-size: 14px; color: #222; }
    .footer { margin-top: 32px; font-size: 11px; color: #aaa; text-align: center; }
    @media print {
      body { background: #fff; padding: 0; }
      .page { border: none; border-radius: 0; padding: 0; max-width: none; }
    }
    @media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="page">
    <h1>Performance Report</h1>
    <div class="meta">${escHtml(scenario?.title || "Simulation")} · Duration ${fmt(duration)} · Generated ${new Date().toLocaleString()}</div>

    <div class="grid">
      <div class="card"><div class="label">Score</div><div class="big">${report.overall}</div></div>
      <div class="card"><div class="label">Grade</div><div class="big">${escHtml(report.grade)}</div></div>
      <div class="card"><div class="label">Assessment</div><div class="summary">${escHtml(report.summary)}</div></div>
    </div>

    <h2>Skill breakdown</h2>
    <table><tbody>${scoreRows}</tbody></table>

    <h2>Strengths</h2>
    <ul>${strengths}</ul>

    <h2>To develop</h2>
    <ul>${improvements}</ul>

    <h2>Best moment</h2>
    <div class="quote">${escHtml(report.highlight_quote)}</div>

    <h2>Next session focus</h2>
    <p class="focus">${escHtml(report.next_focus)}</p>

    ${turns ? `<h2>Transcript</h2>${turns}` : ""}

    <div class="footer">SimEval · Mursion AI Evaluation</div>
  </div>
</body>
</html>`;
};

const downloadReport = (report, scenario, duration, transcript) => {
  const html = buildReportHtml(report, scenario, duration, transcript);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const slug = (scenario?.title || "simulation").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  a.href = url;
  a.download = `simeval-report-${slug}-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const hasSpeechRecognition = () =>
  typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

// ── Global CSS ─────────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&family=Inter:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080808; }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(14px) } to { opacity:1; transform:translateY(0) } }
  @keyframes slideUp { from { opacity:0; transform:translateY(7px)  } to { opacity:1; transform:translateY(0) } }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:0.15} }
  @keyframes micPulse{ 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #242424; border-radius: 1px; }
  textarea { font-family: 'Inter', sans-serif; }

  @media (max-width: 820px) {
    .lobby-hero     { font-size: 32px !important; }
    .lobby-cards    { grid-template-columns: 1fr !important; }
    .lobby-features { flex-wrap: wrap; justify-content: center; gap: 16px !important; }

    .sim-grid    { display: flex !important; flex-direction: column !important; height: auto !important; min-height: 100vh; overflow-y: auto !important; }
    .sim-left    { width: 100% !important; border-right: none !important; border-bottom: 1px solid #242424; order: 2; padding: 16px !important; }
    .sim-center  { order: 1; padding: 14px !important; }
    .sim-right   { width: 100% !important; border-left: none !important; border-top: 1px solid #242424; order: 3; }
    .sim-videos  { grid-template-columns: 1fr 1fr !important; }
    .sim-videos > div { min-height: 160px !important; }
    .sim-metrics { display: grid !important; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .sim-metrics > div { margin-bottom: 0 !important; }
    .sim-transcript-wrap { max-height: 280px; }

    .report-scorerow { grid-template-columns: 1fr 1fr !important; }
    .report-summary  { grid-column: 1 / -1; }
    .report-two      { grid-template-columns: 1fr !important; }
    .report-actions  { flex-direction: column !important; }
    .report-actions button { width: 100% !important; justify-content: center; }
  }
  @media (max-width: 480px) {
    .lobby-hero  { font-size: 27px !important; }
    .sim-videos  { grid-template-columns: 1fr !important; }
    .sim-metrics { grid-template-columns: 1fr 1fr !important; }
    .report-scorerow { grid-template-columns: 1fr !important; }
  }
`;

// ══════════════════════════════════════════════════════════════════════════════
export default function SimulationRoom() {
  const [screen, setScreen]           = useState("lobby");
  const [scenario, setScenario]       = useState(null);
  const [turnIndex, setTurnIndex]     = useState(0);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [simActive, setSimActive]     = useState(false);
  const [transcript, setTranscript]   = useState([]);
  const [listening, setListening]     = useState(false);
  const [typingMode, setTypingMode]   = useState(false); // fallback for no speech API
  const [userSpeech, setUserSpeech]   = useState("");
  const [emotion, setEmotion]         = useState("neutral");
  const [scores, setScores]           = useState({ empathy: 0, clarity: 0, active_listening: 0, de_escalation: 0, adaptability: 0, rapport: 0 });
  const [overall, setOverall]         = useState(0);
  const [insights, setInsights]       = useState([]);
  const [coachTip, setCoachTip]       = useState("");
  const [elapsed, setElapsed]         = useState(0);
  const [radarData, setRadarData]     = useState([]);
  const [cameraOn, setCameraOn]       = useState(true);
  const [finalReport, setFinalReport] = useState(null);
  const [ending, setEnding]           = useState(false);
  const [generating, setGenerating]   = useState(false);
  const [errorMsg, setErrorMsg]       = useState("");
  const [processing, setProcessing]   = useState(false);

  const videoRef   = useRef(null);
  const canvasRef  = useRef(null);
  const streamRef  = useRef(null);
  const recognRef  = useRef(null);
  const timerRef   = useRef(null);
  const emotionRef = useRef(null);
  const convRef    = useRef([]);
  const scrollRef  = useRef(null);
  const expectingUserRef = useRef(false);
  const submittingRef    = useRef(false);
  const submitTurnRef    = useRef(null);
  const silenceTimerRef  = useRef(null);
  const pendingSpeechRef = useRef("");

  const SILENCE_MS = 3000; // wait 3s of silence before auto-submit

  // detect speech support once on mount + preload TTS voices (Chrome)
  useEffect(() => {
    if (!hasSpeechRecognition()) setTypingMode(true);
    const load = () => window.speechSynthesis.getVoices();
    load();
    window.speechSynthesis.onvoiceschanged = load;
  }, []);

  // ── Camera ─────────────────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setCameraOn(false); // no camera, degrade gracefully
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
  }, []);

  // ── Emotion capture ────────────────────────────────────────────────────────
  const captureEmotion = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !cameraOn) return;
    const cv = canvasRef.current;
    cv.width = 160; cv.height = 120;
    try {
      cv.getContext("2d").drawImage(videoRef.current, 0, 0, 160, 120);
      const b64 = cv.toDataURL("image/jpeg", 0.6).split(",")[1];
      const text = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 10,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: "image/jpeg", data: b64 } },
            { type: "text", text: "One word only from: confident calm engaged nervous stressed neutral frustrated happy" }
          ]
        }]
      });
      const word = text.trim().toLowerCase().replace(/[^a-z]/g, "");
      const valid = ["confident","calm","engaged","nervous","stressed","neutral","frustrated","happy"];
      setEmotion(valid.includes(word) ? word : "neutral");
    } catch { /* silent — emotion is optional */ }
  }, [cameraOn]);

  // ── Speech recognition ─────────────────────────────────────────────────────
  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const scheduleAutoSubmit = useCallback((transcript) => {
    clearSilenceTimer();
    if (!transcript.trim() || !expectingUserRef.current || submittingRef.current) return;
    pendingSpeechRef.current = transcript;
    silenceTimerRef.current = setTimeout(() => {
      if (expectingUserRef.current && !submittingRef.current && pendingSpeechRef.current.trim()) {
        submitTurnRef.current?.(pendingSpeechRef.current);
      }
    }, SILENCE_MS);
  }, [clearSilenceTimer]);

  const startListening = useCallback(() => {
    expectingUserRef.current = true;
    pendingSpeechRef.current = "";
    clearSilenceTimer();
    setUserSpeech("");
    if (typingMode) { setListening(true); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setTypingMode(true); setListening(true); return; }
    try {
      const r = new SR();
      r.continuous = true;
      r.interimResults = true;
      r.lang = "en-US";
      r.onresult = e => {
        const transcript = Array.from(e.results).map(x => x[0].transcript).join("");
        setUserSpeech(transcript);
        scheduleAutoSubmit(transcript);
      };
      r.onerror = (e) => {
        if (e.error === "no-speech" || e.error === "aborted") return;
        setTypingMode(true);
        setListening(true);
      };
      r.onend = () => {
        if (expectingUserRef.current && !submittingRef.current) {
          try { r.start(); } catch { setListening(false); }
        } else {
          setListening(false);
        }
      };
      r.start();
      recognRef.current = r;
      setListening(true);
    } catch { setTypingMode(true); setListening(true); }
  }, [typingMode, clearSilenceTimer, scheduleAutoSubmit]);

  // ── Evaluate turn ──────────────────────────────────────────────────────────
  const evaluateTurn = useCallback(async (text, sc) => {
    const history = convRef.current.map(t => `${t.speaker}: ${t.text}`).join("\n");
    try {
      const raw = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content:
          `Mursion behavioral evaluator. Scenario: ${sc.evalContext}\n\nConversation:\n${history}\n\nLearner just said: "${text}"\n\nReturn ONLY JSON, no markdown:\n{"scores":{"empathy":<0-100>,"clarity":<0-100>,"active_listening":<0-100>,"de_escalation":<0-100>,"adaptability":<0-100>,"rapport":<0-100>},"overall":<0-100>,"insight":"<specific observation>","coaching_tip":"<one concrete suggestion>"}`
        }]
      });
      const p = JSON.parse(raw.replace(/```json|```/g, "").trim());
      setScores(p.scores);
      setOverall(p.overall);
      setInsights(prev => [{ text: p.insight, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }, ...prev].slice(0, 8));
      setCoachTip(p.coaching_tip);
      setRadarData(Object.entries(p.scores).map(([k, v]) => ({ subject: k.replace(/_/g, " "), value: v })));
    } catch {
      setErrorMsg("Evaluation failed — scores will update on your next turn.");
    }
  }, []);

  // ── Agent speaks ───────────────────────────────────────────────────────────
  const agentRespond = useCallback((sc, idx) => {
    const line = sc.turns[idx] || "I think I understand now. Thank you.";
    setAgentSpeaking(true);
    setTranscript(prev => [...prev, { speaker: sc.avatarName, text: line, isAgent: true }]);
    convRef.current = [...convRef.current, { speaker: sc.avatarName, text: line }];
    speak(line, () => { setAgentSpeaking(false); startListening(); });
  }, [startListening]);

  // ── Submit turn ────────────────────────────────────────────────────────────
  const submitTurn = useCallback(async (overrideText) => {
    const text = (overrideText ?? userSpeech).trim();
    if (!text || !scenario || submittingRef.current) return;
    clearSilenceTimer();
    submittingRef.current = true;
    expectingUserRef.current = false;
    pendingSpeechRef.current = "";
    recognRef.current?.stop();
    setUserSpeech("");
    setListening(false);
    setProcessing(true);
    setTranscript(prev => [...prev, { speaker: "You", text, isAgent: false }]);
    convRef.current = [...convRef.current, { speaker: "You", text }];
    try {
      await evaluateTurn(text, scenario);
      const next = turnIndex + 1;
      setTurnIndex(next);
      if (next >= scenario.turns.length) setTimeout(() => endSession(), 1400);
      else setTimeout(() => agentRespond(scenario, next), 700);
    } finally {
      setProcessing(false);
      submittingRef.current = false;
    }
  }, [userSpeech, scenario, turnIndex, evaluateTurn, agentRespond, clearSilenceTimer]);

  submitTurnRef.current = submitTurn;

  // ── End session ────────────────────────────────────────────────────────────
  const endSession = useCallback(async () => {
    if (ending) return;
    setEnding(true); setSimActive(false); setGenerating(true);
    clearInterval(timerRef.current);
    clearInterval(emotionRef.current);
    window.speechSynthesis.cancel();
    recognRef.current?.stop();
    stopCamera();

    const history = convRef.current.map(t => `${t.speaker}: ${t.text}`).join("\n");
    try {
      const raw = await callClaude({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{ role: "user", content:
          `Mursion final report. Scenario: ${scenario?.evalContext}\n\nTranscript:\n${history}\n\nReturn ONLY JSON:\n{"overall":<0-100>,"scores":{"empathy":<0-100>,"clarity":<0-100>,"active_listening":<0-100>,"de_escalation":<0-100>,"adaptability":<0-100>,"rapport":<0-100>},"grade":"A+|A|B+|B|C+|C|D","summary":"<2 sentence assessment>","strengths":["<s1>","<s2>"],"improvements":["<i1>","<i2>"],"next_focus":"<single most important skill>","highlight_quote":"<best learner line and why>"}`
        }]
      });
      setFinalReport(JSON.parse(raw.replace(/```json|```/g, "").trim()));
    } catch {
      setFinalReport({ overall, scores, grade: "B", summary: "Session completed. See individual skill scores above.", strengths: ["Completed the full simulation"], improvements: ["Continue practising"], next_focus: "Keep developing your interpersonal skills", highlight_quote: "Good effort throughout the session." });
    }
    setGenerating(false);
    setScreen("report");
  }, [ending, scenario, overall, scores, stopCamera]);

  // ── Start session ──────────────────────────────────────────────────────────
  const startSession = useCallback(async (sc) => {
    setScenario(sc); setScreen("sim");
    setTranscript([]); convRef.current = [];
    setTurnIndex(0); setElapsed(0);
    setInsights([]); setRadarData([]);
    setScores({ empathy: 0, clarity: 0, active_listening: 0, de_escalation: 0, adaptability: 0, rapport: 0 });
    setOverall(0); setEnding(false); setGenerating(false);
    setUserSpeech(""); setEmotion("neutral"); setErrorMsg("");
    await startCamera();
    setSimActive(true);
    timerRef.current   = setInterval(() => setElapsed(e => e + 1), 1000);
    emotionRef.current = setInterval(captureEmotion, 5000);
    setTimeout(() => agentRespond(sc, 0), 1000);
  }, [startCamera, captureEmotion, agentRespond]);

  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: "smooth" }); }, [transcript]);
  useEffect(() => () => {
    clearInterval(timerRef.current);
    clearInterval(emotionRef.current);
    clearSilenceTimer();
    stopCamera();
    window.speechSynthesis.cancel();
  }, [stopCamera, clearSilenceTimer]);

  if (generating) return <GeneratingOverlay />;

  // ══════════════════════════════════════════════════════════════════════════
  // LOBBY
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === "lobby") return (
    <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: "Inter, sans-serif" }}>
      <style>{GLOBAL_CSS}</style>

      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 56, animation: "fadeUp 0.5s ease" }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: T.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Cpu size={17} color={T.bg} />
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: T.textPri, letterSpacing: "-0.03em" }}>SimEval</div>
          <div style={{ fontSize: 10, color: T.textMut, letterSpacing: "0.16em", textTransform: "uppercase" }}>Mursion · AI Evaluation</div>
        </div>
      </div>

      <div style={{ textAlign: "center", maxWidth: 540, marginBottom: 52, animation: "fadeUp 0.55s ease 0.07s both" }}>
        <h1 className="lobby-hero" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 42, fontWeight: 700, color: T.textPri, lineHeight: 1.1, letterSpacing: "-0.04em", marginBottom: 16 }}>
          Practice the conversation<br />before it counts.
        </h1>
        <p style={{ fontSize: 15, color: T.textSec, lineHeight: 1.65 }}>
          Join a live simulation with an AI avatar. Your facial expressions and speech are evaluated in real time. Walk away with a full behavioural performance report.
        </p>
      </div>

      {!hasSpeechRecognition() && (
        <div style={{ maxWidth: 540, width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.borderHi}`, borderRadius: "0 8px 8px 0", padding: "10px 14px", marginBottom: 20, display: "flex", gap: 8, alignItems: "center", animation: "fadeUp 0.55s ease both" }}>
          <Keyboard size={13} color={T.textSec} />
          <span style={{ fontSize: 12, color: T.textSec, fontFamily: "Inter, sans-serif" }}>
            Speech recognition unavailable in this browser — you can type your responses instead.
          </span>
        </div>
      )}

      <div className="lobby-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, maxWidth: 600, width: "100%", marginBottom: 44, animation: "fadeUp 0.55s ease 0.14s both" }}>
        {Object.values(SCENARIOS).map(sc => {
          const Icon = sc.icon;
          return (
            <button key={sc.id} onClick={() => startSession(sc)} style={{
              background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12,
              padding: "26px 22px", cursor: "pointer", textAlign: "left",
              transition: "border-color 0.18s, background 0.18s", color: "inherit",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.background = T.raised; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;   e.currentTarget.style.background = T.surface; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 8, background: T.raised, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} color={T.textSec} />
                </div>
                <ChevronRight size={15} color={T.textMut} />
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: 15, color: T.textPri, marginBottom: 6, letterSpacing: "-0.02em" }}>{sc.title}</div>
              <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.55, marginBottom: 18 }}>{sc.subtitle}</div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 6, background: T.bg, border: `1px solid ${T.border}` }}>
                <User size={10} color={T.textMut} />
                <span style={{ fontSize: 11, color: T.textSec, fontFamily: "'JetBrains Mono', monospace" }}>Role: {sc.role}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="lobby-features" style={{ display: "flex", gap: 28, animation: "fadeUp 0.55s ease 0.21s both" }}>
        {[[Video,"Camera analysis"],[Mic,"Speech evaluation"],[Layers,"AI scoring"],[BarChart2,"Full report"]].map(([Icon, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, color: T.textMut, fontSize: 12, fontFamily: "Inter, sans-serif" }}>
            <Icon size={12} color={T.textMut} />{label}
          </div>
        ))}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // SIMULATION ROOM
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === "sim") return (
    <div className="sim-grid" style={{ height: "100vh", background: T.bg, display: "grid", gridTemplateColumns: "216px 1fr 260px", fontFamily: "Inter, sans-serif", overflow: "hidden" }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── LEFT ── */}
      <div className="sim-left" style={{ background: T.surface, borderRight: `1px solid ${T.border}`, padding: "20px 16px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4 }}>Scenario</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: T.textPri, lineHeight: 1.3 }}>{scenario?.title}</div>
          <div style={{ fontSize: 11, color: T.textMut, marginTop: 2 }}>You are the {scenario?.role}</div>
        </div>

        <div style={{ height: 1, background: T.border, marginBottom: 18 }} />

        <div className="sim-metrics">
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "13px 12px", marginBottom: 10, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 3 }}>
              <Clock size={10} color={T.textMut} />
              <span style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.13em" }}>Time</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 600, color: T.textPri, letterSpacing: "0.05em" }}>{fmt(elapsed)}</div>
          </div>
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "13px 12px", marginBottom: 10, textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 3 }}>
              <Activity size={10} color={T.textMut} />
              <span style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.13em" }}>Score</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 36, fontWeight: 600, color: T.textPri }}>{overall}</div>
          </div>
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "11px 12px", marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.13em", marginBottom: 3 }}>State</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: T.textPri, textTransform: "capitalize" }}>{emotion}</div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12 }}>Live scores</div>
          {Object.entries(scores).map(([k, v]) => <ScoreBar key={k} label={k} value={v} />)}
        </div>

        <div style={{ flex: 1 }} />

        <button onClick={endSession} disabled={ending} style={{
          width: "100%", padding: "9px 12px", borderRadius: 7,
          background: "transparent", border: `1px solid ${T.border}`,
          color: T.textSec, fontSize: 11, fontWeight: 500,
          fontFamily: "'DM Sans', sans-serif", cursor: ending ? "not-allowed" : "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          opacity: ending ? 0.4 : 1, transition: "border-color 0.15s, color 0.15s",
        }}
          onMouseEnter={e => { if (!ending) { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textPri; }}}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSec; }}
        >
          <LogOut size={12} />
          End session
        </button>
      </div>

      {/* ── CENTER ── */}
      <div className="sim-center" style={{ display: "flex", flexDirection: "column", padding: "16px 18px", gap: 12, overflow: "hidden" }}>

        {/* Signal bar */}
        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "8px 14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: T.white, animation: "blink 1.8s infinite" }} />
              <span style={{ fontSize: 10, color: T.textPri, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>LIVE</span>
              <span style={{ fontSize: 10, color: T.textMut }}>· {scenario?.title}</span>
            </div>
            <div style={{ display: "flex", gap: 7 }}>
              <button onClick={() => setCameraOn(v => !v)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 5, background: "transparent", border: `1px solid ${T.border}`, color: T.textSec, fontSize: 11, cursor: "pointer" }}>
                {cameraOn ? <Video size={11} /> : <VideoOff size={11} />}
              </button>
              <button onClick={() => setTypingMode(v => !v)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 9px", borderRadius: 5, background: typingMode ? T.raised : "transparent", border: `1px solid ${T.border}`, color: typingMode ? T.textPri : T.textSec, fontSize: 11, cursor: "pointer", title: "Toggle typed input" }}>
                <Keyboard size={11} />
              </button>
            </div>
          </div>
          <EEGLine active={simActive} />
        </div>

        {/* Error banner */}
        {errorMsg && <ErrorBanner message={errorMsg} onDismiss={() => setErrorMsg("")} />}

        {/* Video tiles */}
        <div className="sim-videos" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, flex: 1, minHeight: 0 }}>

          {/* Avatar */}
          <div style={{ background: T.surface, borderRadius: 12, border: `1px solid ${agentSpeaking ? T.borderHi : T.border}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", transition: "border-color 0.3s", minHeight: 190, overflow: "hidden" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "16px 20px 52px" }}>
              <CartoonAvatar scenarioId={scenario?.id} agentSpeaking={agentSpeaking} turnIndex={turnIndex} />
            </div>
            <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 12, color: T.textPri, fontWeight: 500 }}>{scenario?.avatarName}</div>
                <div style={{ fontSize: 10, color: T.textMut }}>{scenario?.avatarRole}</div>
              </div>
              {agentSpeaking && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <Radio size={9} color={T.textSec} style={{ animation: "blink 1.1s infinite" }} />
                  <span style={{ fontSize: 9, color: T.textSec, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>SPEAKING</span>
                </div>
              )}
            </div>
          </div>

          {/* Learner */}
          <div style={{ background: T.surface, borderRadius: 12, border: `1px solid ${listening ? T.borderHi : T.border}`, overflow: "hidden", position: "relative", minHeight: 190, transition: "border-color 0.3s" }}>
            <video ref={videoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: cameraOn ? "block" : "none", transform: "scaleX(-1)" }} />
            {!cameraOn && (
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: T.raised, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={20} color={T.textMut} />
                </div>
              </div>
            )}
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 12, color: T.textPri, fontWeight: 500 }}>You</div>
                <div style={{ fontSize: 10, color: T.textMut }}>{scenario?.role}</div>
              </div>
              <div style={{ fontSize: 10, color: T.textSec, textTransform: "capitalize", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.07em" }}>{emotion}</div>
            </div>
          </div>
        </div>

        {/* Speech / type input */}
        <div style={{ background: T.surface, border: `1px solid ${listening || userSpeech.trim() ? T.borderHi : T.border}`, borderRadius: 10, padding: "13px 15px", transition: "border-color 0.25s" }}>
          {listening || userSpeech.trim() ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {typingMode
                    ? <Keyboard size={12} color={T.textPri} />
                    : <Mic size={12} color={T.textPri} style={{ animation: "micPulse 1s infinite" }} />
                  }
                  <span style={{ fontSize: 11, color: T.textPri, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.09em" }}>
                    {typingMode ? "TYPE RESPONSE" : "RECORDING"}
                  </span>
                </div>
                <button onClick={submitTurn} disabled={!userSpeech.trim()} style={{
                  padding: "6px 14px", borderRadius: 6,
                  background: userSpeech.trim() ? T.white : T.raised,
                  border: `1px solid ${userSpeech.trim() ? T.white : T.border}`,
                  color: userSpeech.trim() ? T.bg : T.textMut,
                  fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                  cursor: userSpeech.trim() ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", gap: 4,
                }}>
                  Submit <ChevronRight size={11} />
                </button>
              </div>
              {typingMode
                ? <textarea
                    autoFocus
                    value={userSpeech}
                    onChange={e => setUserSpeech(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && userSpeech.trim()) { e.preventDefault(); submitTurn(); } }}
                    placeholder="Type your response… (Enter to submit)"
                    style={{ background: "transparent", border: "none", outline: "none", resize: "none", fontSize: 13, color: T.textPri, lineHeight: 1.55, minHeight: 52, width: "100%" }}
                  />
                : <div style={{ fontSize: 13, color: userSpeech ? T.textPri : T.textMut, fontStyle: userSpeech ? "normal" : "italic", lineHeight: 1.55, minHeight: 20 }}>
                    {userSpeech || "Speak now — auto-sends after a 3s pause, or click Submit"}
                  </div>
              }
            </div>
          ) : processing ? (
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: T.textSec, fontSize: 12 }}>
              <Activity size={11} color={T.textSec} style={{ animation: "blink 1s infinite" }} />
              Evaluating your response…
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 7, color: T.textMut, fontSize: 12 }}>
              {agentSpeaking
                ? <><Radio size={11} color={T.textMut} style={{ animation: "blink 1s infinite" }} /> Avatar is speaking…</>
                : <><Activity size={11} color={T.textMut} /> Waiting for your turn…</>
              }
            </div>
          )}
        </div>

        {/* Coaching tip */}
        {coachTip && (
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `2px solid ${T.white}`, borderRadius: "0 8px 8px 0", padding: "9px 13px", display: "flex", gap: 9, alignItems: "flex-start", animation: "slideUp 0.3s ease" }}>
            <Target size={12} color={T.textSec} style={{ marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: T.textSec, lineHeight: 1.55 }}>
              <span style={{ color: T.textPri, fontWeight: 500 }}>Coaching: </span>{coachTip}
            </div>
          </div>
        )}
      </div>

      {/* ── RIGHT ── */}
      <div className="sim-right" style={{ background: T.surface, borderLeft: `1px solid ${T.border}`, padding: "20px 16px", display: "flex", flexDirection: "column", gap: 16, overflow: "hidden" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 5 }}>
            <BookOpen size={9} color={T.textMut} /> Transcript
          </div>
          <div className="sim-transcript-wrap" style={{ flex: 1, overflowY: "auto" }}>
            {transcript.length === 0
              ? <div style={{ color: T.textMut, fontSize: 12, textAlign: "center", marginTop: 28 }}>Transcript will appear here…</div>
              : transcript.map((t, i) => <Bubble key={i} speaker={t.speaker} text={t.text} isAgent={t.isAgent} />)
            }
            <div ref={scrollRef} />
          </div>
        </div>

        <div style={{ height: 1, background: T.border }} />

        <div style={{ maxHeight: 175, overflow: "hidden" }}>
          <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
            <Zap size={9} color={T.textMut} /> Observations
          </div>
          {insights.length === 0
            ? <div style={{ color: T.textMut, fontSize: 12 }}>Insights appear after your first response…</div>
            : insights.slice(0, 4).map((ins, i) => <InsightRow key={i} text={ins.text} time={ins.time} />)
          }
        </div>

        {radarData.length > 0 && (
          <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 10px" }}>
            <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
              <BarChart2 size={9} color={T.textMut} /> Skill radar
            </div>
            <ResponsiveContainer width="100%" height={138}>
              <RadarChart data={radarData} margin={{ top: 6, right: 18, bottom: 6, left: 18 }}>
                <PolarGrid stroke={T.border} />
                <PolarAngleAxis dataKey="subject" tick={{ fill: T.textMut, fontSize: 8, fontFamily: "Inter" }} />
                <Radar dataKey="value" stroke={T.white} fill={T.white} fillOpacity={0.08} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );

  // ══════════════════════════════════════════════════════════════════════════
  // REPORT
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === "report" && finalReport) {
    const reportRadar = Object.entries(finalReport.scores).map(([k, v]) => ({ subject: k.replace(/_/g, " "), value: v }));
    return (
      <div style={{ minHeight: "100vh", background: T.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", fontFamily: "Inter, sans-serif" }}>
        <style>{GLOBAL_CSS}</style>

        <div style={{ maxWidth: 720, width: "100%", animation: "fadeUp 0.45s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: T.white, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Cpu size={16} color={T.bg} />
            </div>
            <div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 17, color: T.textPri, letterSpacing: "-0.03em" }}>Performance Report</div>
              <div style={{ fontSize: 11, color: T.textMut }}>{scenario?.title} · {fmt(elapsed)}</div>
            </div>
          </div>

          <div className="report-scorerow" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 2fr", gap: 12, marginBottom: 14 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "22px 18px", textAlign: "center", display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 5, flexShrink: 0 }}>
                <Activity size={10} color={T.textMut} />
                <span style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.14em" }}>Score</span>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 52, fontWeight: 600, color: T.textPri, lineHeight: 1 }}>{finalReport.overall}</div>
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "22px 18px", textAlign: "center", display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 5, flexShrink: 0 }}>
                <Award size={10} color={T.textMut} />
                <span style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.14em" }}>Grade</span>
              </div>
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'JetBrains Mono', monospace", fontSize: 52, fontWeight: 600, color: T.textPri, lineHeight: 1 }}>{finalReport.grade}</div>
            </div>
            <div className="report-summary" style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "22px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 9 }}>
                <FileText size={10} color={T.textMut} />
                <span style={{ fontSize: 9, color: T.textMut, textTransform: "uppercase", letterSpacing: "0.14em" }}>Assessment</span>
              </div>
              <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.65 }}>{finalReport.summary}</div>
            </div>
          </div>

          <div className="report-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px" }}>
              <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16, display: "flex", alignItems: "center", gap: 5 }}>
                <BarChart2 size={9} color={T.textMut} /> Skill breakdown
              </div>
              {Object.entries(finalReport.scores).map(([k, v]) => <ScoreBar key={k} label={k} value={v} />)}
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px" }}>
              <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 4, display: "flex", alignItems: "center", gap: 5 }}>
                <Target size={9} color={T.textMut} /> Skill radar
              </div>
              <ResponsiveContainer width="100%" height={175}>
                <RadarChart data={reportRadar} margin={{ top: 8, right: 20, bottom: 8, left: 20 }}>
                  <PolarGrid stroke={T.border} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: T.textMut, fontSize: 9, fontFamily: "Inter" }} />
                  <Radar dataKey="value" stroke={T.white} fill={T.white} fillOpacity={0.1} strokeWidth={1.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="report-two" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px" }}>
              <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
                <CheckCircle size={9} color={T.textMut} /> Strengths
              </div>
              {finalReport.strengths.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
                  <TrendingUp size={12} color={T.textSec} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: T.textSec, lineHeight: 1.55 }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px" }}>
              <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 14, display: "flex", alignItems: "center", gap: 5 }}>
                <AlertCircle size={9} color={T.textMut} /> To develop
              </div>
              {finalReport.improvements.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 9, marginBottom: 10, alignItems: "flex-start" }}>
                  <ChevronRight size={12} color={T.textSec} style={{ marginTop: 2, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: T.textSec, lineHeight: 1.55 }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: T.surface, borderLeft: `2px solid ${T.white}`, borderRadius: "0 10px 10px 0", padding: "16px 18px", marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
              <Zap size={9} color={T.textMut} /> Best moment
            </div>
            <div style={{ fontSize: 13, color: T.textSec, lineHeight: 1.65, fontStyle: "italic" }}>{finalReport.highlight_quote}</div>
          </div>

          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 36 }}>
            <div style={{ fontSize: 9, color: T.textMut, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 7, display: "flex", alignItems: "center", gap: 5 }}>
              <Target size={9} color={T.textMut} /> Next session focus
            </div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 500, color: T.textPri, lineHeight: 1.5 }}>{finalReport.next_focus}</div>
          </div>

          <div className="report-actions" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => downloadReport(finalReport, scenario, elapsed, transcript)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 9, background: T.white, border: "none", color: T.bg, fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
              <Download size={13} /> Download report
            </button>
            <button onClick={() => { setScreen("lobby"); setFinalReport(null); setEnding(false); setSimActive(false); }} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 9, background: "transparent", border: `1px solid ${T.border}`, color: T.textSec, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textPri; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSec; }}
            >
              <Play size={13} /> New simulation
            </button>
            <button onClick={() => startSession(scenario)} style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 9, background: "transparent", border: `1px solid ${T.border}`, color: T.textSec, fontSize: 13, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = T.borderHi; e.currentTarget.style.color = T.textPri; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textSec; }}
            >
              <RotateCcw size={13} /> Retry scenario
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
