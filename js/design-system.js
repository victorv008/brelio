/* @ds-bundle: {"format":4,"namespace":"BrelioDesignSystem_2b4fd5","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"IconButton","sourcePath":"components/buttons/IconButton.jsx"},{"name":"CourseCard","sourcePath":"components/cards/CourseCard.jsx"},{"name":"SwipeCard","sourcePath":"components/cards/SwipeCard.jsx"},{"name":"Badge","sourcePath":"components/data/Badge.jsx"},{"name":"SectionHeader","sourcePath":"components/data/SectionHeader.jsx"},{"name":"StatChip","sourcePath":"components/data/StatChip.jsx"},{"name":"EmptyState","sourcePath":"components/feedback/EmptyState.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"14af2257fd39","components/buttons/IconButton.jsx":"e797716ac1ec","components/cards/CourseCard.jsx":"c478c93fb6ed","components/cards/SwipeCard.jsx":"9879ab0650f2","components/data/Badge.jsx":"2a763caf29fd","components/data/SectionHeader.jsx":"3e4fa6803fb8","components/data/StatChip.jsx":"ad6654baa4d5","components/feedback/EmptyState.jsx":"e45fe1625796","ui_kits/brelio_app/App.jsx":"e0af987c1c71","ui_kits/brelio_app/HomeScreen.jsx":"6ad8a75a53d6","ui_kits/brelio_app/PhoneFrame.jsx":"4da3bb1707fa","ui_kits/brelio_app/SavedScreen.jsx":"d4dec6581d3c","ui_kits/brelio_app/SearchScreen.jsx":"c57556df7dd7","ui_kits/brelio_app/SwipeScreen.jsx":"fea8bc473b56","ui_kits/brelio_app/data.js":"e6575ba2a210","ui_kits/brelio_web/CourseModal.jsx":"ac00e2099268","ui_kits/brelio_web/QuizModal.jsx":"45f2927a53e7","ui_kits/brelio_web/WebApp.jsx":"c07bec1cc477","ui_kits/brelio_web/WebHome.jsx":"2e459c0a2179","ui_kits/brelio_web/WebSaved.jsx":"96e74451bcef","ui_kits/brelio_web/WebSearch.jsx":"248e5a23d904","ui_kits/brelio_web/WebShell.jsx":"81c7478a628f","ui_kits/brelio_web/WebSwipe.jsx":"f3d27357909e","ui_kits/brelio_web/data.js":"b80930ef20fd"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BrelioDesignSystem_2b4fd5 = window.BrelioDesignSystem_2b4fd5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Brelio primary / secondary action button.
 * Primary = warm-accent pill with coral glow; press scales to ~0.96.
 * Labels say the action ("Börja swipa"), never "Submit".
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const sizes = {
    sm: {
      padding: '8px 16px',
      fontSize: 13
    },
    md: {
      padding: '13px 24px',
      fontSize: 16
    },
    lg: {
      padding: '17px 34px',
      fontSize: 18
    }
  };
  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    border: 'none',
    borderRadius: 'var(--radius-button)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.45 : 1,
    transform: pressed ? 'scale(0.97)' : hover ? 'translateY(-2px)' : 'none',
    transition: 'transform var(--dur-fast) var(--ease-spring), background var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)',
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: hover ? '#FF6B5E' : 'var(--accent)',
      color: '#fff',
      boxShadow: hover ? '0 0 0 1px rgba(255,78,66,0.4), 0 8px 32px -4px rgba(255,78,66,0.5)' : '0 6px 20px var(--accent-glow)'
    },
    cool: {
      background: hover ? 'var(--cool-soft)' : 'var(--cool)',
      color: '#fff',
      boxShadow: hover ? '0 0 0 1px rgba(124,107,255,0.4), 0 8px 32px -4px rgba(124,107,255,0.5)' : '0 6px 20px var(--cool-glow)'
    },
    ghost: {
      background: hover ? 'rgba(255,255,255,0.04)' : 'transparent',
      color: 'var(--text-hi)',
      border: `1px solid ${hover ? 'rgba(255,255,255,0.35)' : 'var(--line-strong)'}`
    }
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setPressed(false);
    },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    style: {
      ...base,
      ...variants[variant],
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/buttons/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Round icon button — transparent with hairline border, brightens on hover.
 * For close (✕), nav arrows, save toggles. Pass a glyph or SVG as children.
 */
function IconButton({
  children,
  size = 'md',
  active = false,
  label,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dims = {
    sm: 34,
    md: 42,
    lg: 52
  }[size];
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": label,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: dims,
      height: dims,
      borderRadius: 'var(--radius-full)',
      border: '1px solid var(--line-strong)',
      background: active ? 'var(--accent-tint)' : hover ? 'rgba(255,255,255,0.07)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text-hi)',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: dims * 0.42,
      transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/cards/CourseCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Course poster card: cinematic dark poster art, glass category chip,
 * title in body face, mono meta row (lessons · minutes · XP).
 * Hover: lifts -8px, glow blooms in the card's own colour (`glow` prop),
 * art scales 1.03, title leans toward you, chip does a tiny wiggle.
 */
function CourseCard({
  title,
  category,
  image,
  poster,
  glow,
  level,
  desc,
  why,
  lessons,
  minutes,
  xp,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const art = image ? `linear-gradient(180deg, rgba(8,8,12,0) 40%, rgba(8,8,12,0.55) 100%), url(${image}) center/cover` : poster || 'linear-gradient(145deg, var(--cool) 0%, var(--accent) 100%)';
  const glowColor = glow || '#FF4E42';

  // faint film grain so gradients read analogue, not rendered
  const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
  const meta = [level, lessons != null && `${lessons} lekt.`, minutes != null && `${minutes} min`, xp != null && `${xp} XP`].filter(Boolean);
  return /*#__PURE__*/React.createElement("div", _extends({
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      width: 220,
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--line)',
      borderTop: '1px solid rgba(255,255,255,0.10)',
      overflow: 'hidden',
      cursor: onClick ? 'pointer' : 'default',
      boxShadow: hover ? `var(--shadow-pop), 0 22px 40px -12px ${glowColor}4D` : 'var(--shadow-card)',
      transform: hover ? 'translateY(-8px)' : 'translateY(0)',
      transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1), box-shadow 220ms cubic-bezier(0.16,1,0.3,1)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 150,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: art,
      transform: hover ? 'scale(1.03)' : 'scale(1)',
      transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(110% 80% at 50% -15%, rgba(255,255,255,0.10), transparent 55%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: GRAIN,
      backgroundSize: '140px 140px',
      opacity: 0.03,
      mixBlendMode: 'overlay',
      pointerEvents: 'none'
    }
  }), category && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 12,
      left: 12,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: 'var(--text-hi)',
      background: hover ? 'rgba(35,32,44,0.92)' : 'rgba(24,22,30,0.85)',
      borderTop: '1px solid rgba(255,255,255,0.18)',
      borderLeft: '1px solid rgba(255,255,255,0.18)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
      padding: '4px 9px',
      borderRadius: 'var(--radius-sm)',
      animation: hover ? 'b-wiggle 200ms ease' : 'none',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }, category)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 17,
      color: 'var(--text-hi)',
      letterSpacing: '-0.01em',
      lineHeight: 1.25,
      marginBottom: 10,
      textWrap: 'pretty',
      transform: hover ? 'translateX(2px)' : 'none',
      transition: 'transform 220ms cubic-bezier(0.16,1,0.3,1)'
    }
  }, title), desc && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      lineHeight: 1.45,
      color: 'var(--text-mid)',
      marginBottom: 10,
      textWrap: 'pretty'
    }
  }, desc), meta.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-mid)',
      letterSpacing: '0.06em',
      marginBottom: why ? 8 : 0
    }
  }, meta.join(' · ')), why && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 500,
      color: 'var(--amber)',
      display: 'flex',
      alignItems: 'center',
      gap: 5
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2726"), why)));
}
Object.assign(__ds_scope, { CourseCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/CourseCard.jsx", error: String((e && e.message) || e) }); }

// components/cards/SwipeCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Signature swipe card. Tall, image-forward, gradient scrim, title + meta low.
 * Physical: rotation tied to drag, weighted snap-back, fling on commit.
 * Directional overlays — Gillar (→ warm) · Skippa (← steel) · Spara (↑ cool).
 *
 * Fires onLike / onSkip / onSave when a drag passes threshold and flings out.
 */
function SwipeCard({
  title,
  category,
  image,
  poster,
  level,
  desc,
  why,
  lessons,
  minutes,
  xp,
  onLike,
  onSkip,
  onSave,
  style,
  ...rest
}) {
  const [drag, setDrag] = React.useState({
    x: 0,
    y: 0,
    active: false
  });
  const [gone, setGone] = React.useState(null); // 'like' | 'skip' | 'save'
  const start = React.useRef(null);
  const THRESH_X = 110;
  const THRESH_Y = 130;
  const onDown = e => {
    start.current = {
      x: e.clientX,
      y: e.clientY
    };
    setDrag(d => ({
      ...d,
      active: true
    }));
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const onMove = e => {
    if (!start.current) return;
    setDrag({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
      active: true
    });
  };
  const commit = dir => {
    setGone(dir);
    const fling = {
      like: {
        x: 600,
        y: 40
      },
      skip: {
        x: -600,
        y: 40
      },
      save: {
        x: 0,
        y: -700
      }
    }[dir];
    setDrag({
      ...fling,
      active: false
    });
    const cb = {
      like: onLike,
      skip: onSkip,
      save: onSave
    }[dir];
    setTimeout(() => cb && cb(), 320);
  };
  const onUp = () => {
    if (!start.current) return;
    start.current = null;
    const {
      x,
      y
    } = drag;
    if (y < -THRESH_Y && Math.abs(y) > Math.abs(x)) return commit('save');
    if (x > THRESH_X) return commit('like');
    if (x < -THRESH_X) return commit('skip');
    setDrag({
      x: 0,
      y: 0,
      active: false
    }); // weighted snap-back
  };
  const rot = Math.max(-18, Math.min(18, drag.x * 0.08));
  const likeOp = Math.max(0, Math.min(1, drag.x / THRESH_X));
  const skipOp = Math.max(0, Math.min(1, -drag.x / THRESH_X));
  const saveOp = Math.max(0, Math.min(1, -drag.y / THRESH_Y));
  const art = image ? `url(${image}) center/cover` : poster || 'linear-gradient(160deg, var(--cool) 0%, var(--accent) 100%)';

  // dominant colour for the glow halo behind the card
  const haloColor = poster && poster.match(/#[0-9a-fA-F]{3,6}/) ? poster.match(/#[0-9a-fA-F]{3,6}/)[0] : '#FF4E42';
  const meta = [level, lessons != null && `${lessons} lekt.`, minutes != null && `${minutes} min`, xp != null && `${xp} XP`].filter(Boolean);

  // film grain — analogue texture so the gradient doesn't look rendered
  const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 320,
      height: 460,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '20%',
      top: '22%',
      width: '60%',
      height: '60%',
      borderRadius: '50%',
      background: haloColor,
      filter: 'blur(72px)',
      opacity: 0.24,
      zIndex: 0,
      pointerEvents: 'none',
      transform: gone ? 'scale(0.6)' : `translate(${drag.x * 0.4}px, ${drag.y * 0.4}px)`,
      transition: drag.active ? 'none' : 'transform var(--dur-slow) var(--ease-spring), opacity var(--dur-slow) var(--ease-out)'
    }
  }), /*#__PURE__*/React.createElement("div", _extends({
    onPointerDown: onDown,
    onPointerMove: onMove,
    onPointerUp: onUp,
    onPointerCancel: onUp,
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      background: art,
      border: '1px solid rgba(255,255,255,0.18)',
      boxShadow: 'var(--shadow-pop), inset 0 1px 0 rgba(255,255,255,0.12)',
      cursor: drag.active ? 'grabbing' : 'grab',
      touchAction: 'none',
      userSelect: 'none',
      zIndex: 1,
      transform: `translate(${drag.x}px, ${drag.y}px) rotate(${rot}deg)`,
      transition: drag.active ? 'none' : `transform var(--dur-slow) var(--ease-spring), opacity var(--dur-slow) var(--ease-out)`,
      opacity: gone ? 0 : 1
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(120% 75% at 50% -12%, rgba(154,107,255,0.45), rgba(124,107,255,0.12) 38%, transparent 62%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(180deg, rgba(8,8,12,0) 38%, rgba(8,8,12,0.85) 100%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      backgroundImage: GRAIN,
      backgroundSize: '140px 140px',
      opacity: 0.04,
      mixBlendMode: 'overlay',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: likeOp * 0.8,
      background: 'linear-gradient(270deg, rgba(255,78,66,0.45), transparent 42%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: skipOp * 0.8,
      background: 'linear-gradient(90deg, rgba(90,90,107,0.5), transparent 42%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      opacity: saveOp * 0.8,
      background: 'linear-gradient(180deg, rgba(124,107,255,0.45), transparent 42%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement(Overlay, {
    op: likeOp,
    color: "var(--accent)",
    label: "Gillar",
    rotate: -12,
    side: "left"
  }), /*#__PURE__*/React.createElement(Overlay, {
    op: skipOp,
    color: "var(--gesture-skip)",
    label: "Skippa",
    rotate: 12,
    side: "right"
  }), /*#__PURE__*/React.createElement(Overlay, {
    op: saveOp,
    color: "var(--cool)",
    label: "Spara",
    rotate: -4,
    side: "top"
  }), category && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 16,
      left: 16,
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: 'var(--text-hi)',
      background: 'rgba(24,22,30,0.85)',
      borderTop: '1px solid rgba(255,255,255,0.18)',
      borderLeft: '1px solid rgba(255,255,255,0.18)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.10)',
      padding: '5px 10px',
      borderRadius: 'var(--radius-sm)'
    }
  }, category), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: 22
    }
  }, why && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--amber)',
      background: 'rgba(14,12,16,0.85)',
      border: '1px solid rgba(255,178,62,0.35)',
      padding: '5px 11px',
      borderRadius: 'var(--radius-full)',
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2726"), why), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 28,
      lineHeight: 1.08,
      letterSpacing: '-0.02em',
      color: '#fff',
      marginBottom: 8,
      textWrap: 'pretty'
    }
  }, title), desc && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      lineHeight: 1.45,
      color: 'rgba(244,244,247,0.85)',
      marginBottom: 10,
      textWrap: 'pretty'
    }
  }, desc), meta.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.06em',
      color: 'rgba(244,244,247,0.8)'
    }
  }, meta.join(' · ')))));
}
function Overlay({
  op,
  color,
  label,
  rotate,
  side
}) {
  const pos = side === 'top' ? {
    top: 24,
    left: '50%',
    transform: `translateX(-50%) rotate(${rotate}deg)`
  } : side === 'left' ? {
    top: 30,
    left: 22,
    transform: `rotate(${rotate}deg)`
  } : {
    top: 30,
    right: 22,
    transform: `rotate(${rotate}deg)`
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      ...pos,
      opacity: op,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 22,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color,
      border: `3px solid ${color}`,
      padding: '6px 14px',
      borderRadius: 'var(--radius-md)',
      pointerEvents: 'none'
    }
  }, label);
}
Object.assign(__ds_scope, { SwipeCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/cards/SwipeCard.jsx", error: String((e && e.message) || e) }); }

// components/data/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Small label. Default = mono category chip overlaid on poster art.
 * tone: 'mono' (neutral glass), 'accent', 'cool', 'amber'.
 */
function Badge({
  children,
  tone = 'mono',
  style,
  ...rest
}) {
  const tones = {
    mono: {
      color: 'var(--text-hi)',
      bg: 'rgba(8,8,12,0.55)',
      border: 'rgba(255,255,255,0.16)'
    },
    accent: {
      color: 'var(--accent)',
      bg: 'var(--accent-tint)',
      border: 'var(--accent)'
    },
    cool: {
      color: 'var(--cool)',
      bg: 'var(--cool-tint)',
      border: 'var(--cool)'
    },
    amber: {
      color: 'var(--amber)',
      bg: 'var(--amber-tint)',
      border: 'var(--amber)'
    }
  };
  const t = tones[tone] || tones.mono;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.14em',
      color: t.color,
      background: t.bg,
      border: `1px solid ${t.border}40`,
      padding: '4px 9px',
      borderRadius: 'var(--radius-sm)',
      lineHeight: 1,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data/SectionHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Editorial section header: mono number (01) + display title + hairline rule.
 * Use numbering ONLY where order is real (steps, progress) — never as decoration.
 */
function SectionHeader({
  number,
  title,
  action,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 14
    }
  }, number != null && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'rgba(255,78,66,0.7)',
      letterSpacing: '0.1em'
    }
  }, number), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 26,
      letterSpacing: '-0.02em',
      color: 'var(--text-hi)'
    }
  }, title)), action && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--accent)',
      cursor: 'pointer',
      whiteSpace: 'nowrap'
    }
  }, action)), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--line)',
      marginTop: 14
    }
  }));
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/data/StatChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Mono pill, tinted by gamification role. streak (warm) · xp (amber) · level (cool).
 * Use for the persistent reward HUD. Numbers are events — animate changes elsewhere.
 */
function StatChip({
  role = 'xp',
  icon,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const roles = {
    streak: {
      color: 'var(--accent)',
      bg: 'var(--accent-tint)'
    },
    xp: {
      color: 'var(--amber)',
      bg: 'var(--amber-tint)'
    },
    level: {
      color: 'var(--cool)',
      bg: 'var(--cool-tint)'
    }
  };
  const r = roles[role] || roles.xp;
  return /*#__PURE__*/React.createElement("span", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 500,
      color: r.color,
      background: r.bg,
      border: `1px solid ${r.color}33`,
      padding: '5px 12px',
      borderRadius: 'var(--radius-chip)',
      lineHeight: 1,
      boxShadow: hover ? `0 0 18px -3px ${r.color}, inset 0 1px 0 rgba(255,255,255,0.08)` : `0 0 0 0 transparent, inset 0 1px 0 rgba(255,255,255,0.05)`,
      transition: 'box-shadow var(--dur-base) var(--ease-out)',
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, icon), children);
}
Object.assign(__ds_scope, { StatChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/StatChip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/EmptyState.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Empty state = an invitation, never an apology. Icon + display headline +
 * one line + at least one next-move button. Voice is the interface's.
 * e.g. "Du har sett allt" → "Visa sparade".
 */
function EmptyState({
  icon = '🎉',
  title,
  line,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 14,
      padding: '48px 28px',
      maxWidth: 360,
      margin: '0 auto',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 52,
      lineHeight: 1
    }
  }, icon), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 30,
      letterSpacing: '-0.02em',
      color: 'var(--text-hi)',
      textWrap: 'pretty'
    }
  }, title), line && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      lineHeight: 1.5,
      color: 'var(--text-mid)'
    }
  }, line), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      marginTop: 10,
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, actionLabel && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    onClick: onAction
  }, actionLabel), secondaryLabel && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    onClick: onSecondary
  }, secondaryLabel)));
}
Object.assign(__ds_scope, { EmptyState });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/EmptyState.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_app/App.jsx
try { (() => {
// Brelio app — root. Welcome overlay → tabbed phone shell with reward HUD.
const DS_app = window.BrelioDesignSystem_2b4fd5;
function Welcome({
  onStart
}) {
  const {
    Button
  } = DS_app;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 20,
      background: 'var(--ink-900)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 56,
      marginBottom: 18
    }
  }, "\uD83D\uDC4B"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 14px',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 38,
      lineHeight: 1.06,
      letterSpacing: '-0.03em',
      color: 'var(--text-hi)'
    }
  }, "V\xE4lkommen till ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "Brelio")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 28px',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      lineHeight: 1.5,
      color: 'var(--text-mid)',
      maxWidth: 300
    }
  }, "Din personliga kursuppt\xE4ckare. Swipa dig fram till kunskap \u2014 precis som TikTok, fast f\xF6r l\xE4rande."), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onStart
  }, "Kom ig\xE5ng \uD83D\uDD25"));
}
function App() {
  const [started, setStarted] = React.useState(false);
  const [tab, setTab] = React.useState('home');
  const [streak] = React.useState(7);
  const [level, setLevel] = React.useState(1);
  const [xp, setXp] = React.useState(0);
  const [saved, setSaved] = React.useState([]);
  const addXp = n => setXp(x => {
    const nx = x + n;
    if (nx >= 200) setLevel(l => l + 1);
    return nx % 200;
  });
  const addSaved = c => setSaved(s => s.find(x => x.id === c.id) ? s : [c, ...s]);
  const screen = {
    home: /*#__PURE__*/React.createElement(HomeScreen, {
      onStartSwipe: () => setTab('swipe'),
      onOpen: () => setTab('swipe')
    }),
    swipe: /*#__PURE__*/React.createElement(SwipeScreen, {
      streak: streak,
      onXp: addXp,
      onSaveCourse: addSaved
    }),
    search: /*#__PURE__*/React.createElement(SearchScreen, {
      onOpen: () => setTab('swipe')
    }),
    saved: /*#__PURE__*/React.createElement(SavedScreen, {
      saved: saved,
      onExplore: () => setTab('search')
    })
  }[tab];
  return /*#__PURE__*/React.createElement(PhoneFrame, null, !started && /*#__PURE__*/React.createElement(Welcome, {
    onStart: () => setStarted(true)
  }), /*#__PURE__*/React.createElement(StatusBar, null), /*#__PURE__*/React.createElement(TopBar, {
    streak: streak,
    xp: xp,
    level: level
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 3,
      background: 'var(--ink-700)',
      margin: '0 18px 8px',
      borderRadius: 2,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${xp / 200 * 100}%`,
      background: 'var(--fire)',
      borderRadius: 2,
      transition: 'width var(--dur-cine) var(--ease-spring)'
    }
  })), screen, /*#__PURE__*/React.createElement(BottomNav, {
    tab: tab,
    onTab: setTab
  }));
}
Object.assign(window, {
  App
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_app/HomeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Home feed — hero, quiz banner, course rails.
const DS_home = window.BrelioDesignSystem_2b4fd5;
function Rail({
  number,
  title,
  courses,
  onOpen
}) {
  const {
    SectionHeader,
    CourseCard
  } = DS_home;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 18px'
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    number: number,
    title: title,
    action: "Se alla"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      overflowX: 'auto',
      padding: '16px 18px 4px',
      scrollbarWidth: 'none'
    }
  }, courses.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    style: {
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement(CourseCard, _extends({}, c, {
    onClick: () => onOpen && onOpen(c),
    style: {
      width: 200
    }
  }))))));
}
function HomeScreen({
  onStartSwipe,
  onOpen
}) {
  const {
    Button
  } = DS_home;
  const courses = window.BRELIO_COURSES;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      overflowY: 'auto',
      flex: 1,
      paddingBottom: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '8px 18px 24px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      color: 'var(--amber)',
      background: 'var(--amber-tint)',
      border: '1px solid rgba(255,178,62,0.25)',
      padding: '5px 11px',
      borderRadius: 'var(--radius-full)',
      marginBottom: 18
    }
  }, "\u2728 L\xE4rande gjort enkelt"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 14px',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 40,
      lineHeight: 1.04,
      letterSpacing: '-0.03em',
      color: 'var(--text-hi)',
      textWrap: 'pretty'
    }
  }, "Swipa dig till ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontStyle: 'italic'
    }
  }, "din n\xE4sta kurs")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 22px',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      lineHeight: 1.5,
      color: 'var(--text-mid)'
    }
  }, "Bl\xE4ddra bland hundratals kurser precis som p\xE5 Tinder. Gilla det du vill l\xE4ra dig, hoppa \xF6ver resten."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    onClick: onStartSwipe
  }, "B\xF6rja swipa"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost"
  }, "Utforska kurser"))), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '0 18px 28px',
      borderRadius: 'var(--radius-xl)',
      padding: 18,
      background: 'var(--fire)',
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      cursor: 'pointer',
      boxShadow: '0 12px 34px rgba(255,78,66,0.3)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 34
    }
  }, "\uD83E\uDDE0"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 17,
      color: '#fff'
    }
  }, "Dagens Quiz"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'rgba(255,255,255,0.85)'
    }
  }, "10 fr\xE5gor \xB7 upp till 200 XP")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      color: '#fff'
    }
  }, "\u2192")), /*#__PURE__*/React.createElement(Rail, {
    number: "01",
    title: "Popul\xE4rt just nu \uD83D\uDD25",
    courses: courses.slice(0, 5),
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement(Rail, {
    number: "02",
    title: "Rekommenderat \u2728",
    courses: courses.slice(3, 8),
    onOpen: onOpen
  }), /*#__PURE__*/React.createElement(Rail, {
    number: "03",
    title: "Nya kurser \uD83C\uDD95",
    courses: [...courses].reverse().slice(0, 5),
    onOpen: onOpen
  }));
}
Object.assign(window, {
  HomeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_app/PhoneFrame.jsx
try { (() => {
// Brelio phone shell — status bar, top reward HUD, content area, bottom nav.
const DS_shell = window.BrelioDesignSystem_2b4fd5;
function StatusBar() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 22px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-hi)',
      fontWeight: 500,
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", null, "9:41"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 6,
      fontSize: 12,
      opacity: 0.9
    }
  }, /*#__PURE__*/React.createElement("span", null, "5G"), /*#__PURE__*/React.createElement("span", null, "100%")));
}
function TopBar({
  streak,
  xp,
  level
}) {
  const {
    StatChip
  } = DS_shell;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 18px 14px',
      flex: 'none'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 23,
      letterSpacing: '-0.02em',
      color: 'var(--text-hi)'
    }
  }, "Brelio ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "\uD83D\uDD25")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(StatChip, {
    role: "streak",
    icon: "\uD83D\uDD25"
  }, streak), /*#__PURE__*/React.createElement(StatChip, {
    role: "level",
    icon: "\u26A1"
  }, "Lvl ", level)));
}
const NAV = [{
  id: 'home',
  label: 'Hem',
  icon: '⌂'
}, {
  id: 'swipe',
  label: 'Swipa',
  icon: '⇄'
}, {
  id: 'search',
  label: 'Sök',
  icon: '⌕'
}, {
  id: 'saved',
  label: 'Sparade',
  icon: '🔖'
}];
function BottomNav({
  tab,
  onTab
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      borderTop: '1px solid var(--line)',
      background: 'rgba(10,10,15,0.85)',
      backdropFilter: 'blur(16px)',
      padding: '8px 6px 22px',
      flex: 'none'
    }
  }, NAV.map(n => {
    const active = tab === n.id;
    return /*#__PURE__*/React.createElement("button", {
      key: n.id,
      onClick: () => onTab(n.id),
      style: {
        flex: 1,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        padding: '6px 0',
        color: active ? 'var(--accent)' : 'var(--text-lo)',
        transition: 'color var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20,
        lineHeight: 1
      }
    }, n.icon), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        letterSpacing: '0.04em'
      }
    }, n.label));
  }));
}
function PhoneFrame({
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 390,
      height: 844,
      background: 'var(--ink-850)',
      borderRadius: 46,
      overflow: 'hidden',
      border: '1px solid var(--line-strong)',
      boxShadow: '0 40px 120px rgba(0,0,0,0.6), inset 0 0 0 8px #000',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }
  }, children);
}
Object.assign(window, {
  StatusBar,
  TopBar,
  BottomNav,
  PhoneFrame
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_app/PhoneFrame.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_app/SavedScreen.jsx
try { (() => {
// Saved screen — list of saved courses, or an inviting empty state.
const DS_saved = window.BrelioDesignSystem_2b4fd5;
function SavedScreen({
  saved,
  onExplore,
  onOpen
}) {
  const {
    SectionHeader,
    EmptyState,
    Badge
  } = DS_saved;
  if (!saved || saved.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(EmptyState, {
      icon: "\uD83D\uDD16",
      title: "Inga sparade \xE4nnu",
      line: "Swipa upp p\xE5 en kurs f\xF6r att spara den hit f\xF6r senare.",
      actionLabel: "Utforska kurser",
      onAction: onExplore
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '4px 18px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Sparade kurser \uD83D\uDCDA"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: 'var(--text-mid)',
      margin: '0 0 18px'
    }
  }, "Kurser du har sparat f\xF6r att l\xE4sa senare"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, saved.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    onClick: () => onOpen && onOpen(c),
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      background: 'var(--ink-750)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-lg)',
      padding: 12,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 64,
      height: 64,
      borderRadius: 'var(--radius-md)',
      background: c.poster,
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 26
    }
  }, c.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Badge, null, c.category), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 16,
      color: 'var(--text-hi)',
      margin: '7px 0 4px'
    }
  }, c.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-lo)'
    }
  }, c.lessons, " lekt. \xB7 ", c.minutes, " min \xB7 ", c.xp, " XP")), /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-lo)',
      fontSize: 18
    }
  }, "\u2192")))));
}
Object.assign(window, {
  SavedScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_app/SavedScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_app/SearchScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Search / explore screen — category chips + results grid.
const DS_search = window.BrelioDesignSystem_2b4fd5;
function SearchScreen({
  onOpen
}) {
  const {
    CourseCard,
    Badge,
    SectionHeader
  } = DS_search;
  const [active, setActive] = React.useState('Alla');
  const cats = window.BRELIO_CATEGORIES;
  const courses = window.BRELIO_COURSES;
  const filtered = active === 'Alla' ? courses : courses.filter(c => c.category === active);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '4px 18px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Utforska kurser \uD83D\uDD0D"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'var(--ink-750)',
      border: '1px solid var(--line)',
      borderRadius: 'var(--radius-full)',
      padding: '12px 18px',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-lo)',
      fontSize: 16
    }
  }, "\u2315"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-lo)'
    }
  }, "S\xF6k bland hundratals kurser\u2026")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      marginBottom: 22
    }
  }, ['Alla', ...cats.map(c => c.label)].map(label => {
    const on = active === label;
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      onClick: () => setActive(label),
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        cursor: 'pointer',
        padding: '7px 14px',
        borderRadius: 'var(--radius-full)',
        background: on ? 'var(--accent)' : 'transparent',
        color: on ? '#fff' : 'var(--text-mid)',
        border: `1px solid ${on ? 'var(--accent)' : 'var(--line-strong)'}`,
        transition: 'all var(--dur-base) var(--ease-out)'
      }
    }, label);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, filtered.map(c => /*#__PURE__*/React.createElement(CourseCard, _extends({
    key: c.id
  }, c, {
    minutes: undefined,
    onClick: () => onOpen && onOpen(c),
    style: {
      width: '100%'
    }
  })))), filtered.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-mid)',
      textAlign: 'center',
      padding: 40
    }
  }, "Inga kurser i denna kategori \xE4nnu."));
}
Object.assign(window, {
  SearchScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_app/SearchScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_app/SwipeScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Swipe screen — the signature deck. Top card is live; one peeks behind.
const DS_swipe = window.BrelioDesignSystem_2b4fd5;
function SwipeScreen({
  streak,
  onXp,
  onSaveCourse
}) {
  const {
    SwipeCard,
    EmptyState,
    IconButton
  } = DS_swipe;
  const [idx, setIdx] = React.useState(0);
  const [toast, setToast] = React.useState(null);
  const courses = window.BRELIO_COURSES;
  const done = idx >= courses.length;
  const advance = kind => {
    if (kind === 'like') {
      onXp && onXp(10);
      flash('+10 XP · Gillad 🔥', 'var(--accent)');
    }
    if (kind === 'save') {
      onSaveCourse && onSaveCourse(courses[idx]);
      flash('Sparad 🔖', 'var(--cool)');
    }
    setIdx(i => i + 1);
  };
  const flash = (msg, color) => {
    setToast({
      msg,
      color
    });
    setTimeout(() => setToast(null), 1100);
  };
  if (done) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement(EmptyState, {
      icon: "\uD83C\uDF89",
      title: "Du har sett allt!",
      line: "Kolla dina sparade kurser eller b\xF6rja om fr\xE5n b\xF6rjan.",
      actionLabel: "B\xF6rja om",
      onAction: () => setIdx(0),
      secondaryLabel: "Visa sparade"
    }));
  }
  const top = courses[idx];
  const peek = courses[idx + 1];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 0 8px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-lo)',
      marginBottom: 18,
      textTransform: 'uppercase',
      letterSpacing: '0.16em'
    }
  }, "Hitta din kurs \uD83C\uDFAF"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 320,
      height: 460
    }
  }, peek && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      transform: 'scale(0.94) translateY(16px)',
      filter: 'brightness(0.7)'
    }
  }, /*#__PURE__*/React.createElement(SwipeCard, _extends({
    key: 'peek' + peek.id
  }, peek))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0
    }
  }, /*#__PURE__*/React.createElement(SwipeCard, _extends({
    key: top.id
  }, top, {
    onLike: () => advance('like'),
    onSkip: () => advance('skip'),
    onSave: () => advance('save')
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      marginTop: 26,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(GestureBtn, {
    color: "var(--gesture-skip)",
    label: "Skippa",
    glyph: "\u2715",
    onClick: () => advance('skip')
  }), /*#__PURE__*/React.createElement(GestureBtn, {
    color: "var(--cool)",
    label: "Spara",
    glyph: "\uD83D\uDD16",
    small: true,
    onClick: () => advance('save')
  }), /*#__PURE__*/React.createElement(GestureBtn, {
    color: "var(--accent)",
    label: "Gillar",
    glyph: "\u2665",
    onClick: () => advance('like')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      color: 'var(--text-lo)',
      marginTop: 18
    }
  }, "\u2190 skippa \xA0\xB7\xA0 \u2191 spara \xA0\xB7\xA0 \u2192 gillar"), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 24,
      left: '50%',
      transform: 'translateX(-50%)',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      fontWeight: 600,
      color: '#fff',
      background: toast.color,
      padding: '8px 16px',
      borderRadius: 'var(--radius-full)',
      boxShadow: 'var(--shadow-pop)',
      animation: 'pop var(--dur-slow) var(--ease-spring)'
    }
  }, toast.msg));
}
function GestureBtn({
  color,
  label,
  glyph,
  small,
  onClick
}) {
  const [press, setPress] = React.useState(false);
  const size = small ? 52 : 64;
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    onClick: onClick,
    onPointerDown: () => setPress(true),
    onPointerUp: () => setPress(false),
    onPointerLeave: () => setPress(false),
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      cursor: 'pointer',
      background: 'var(--ink-750)',
      border: `2px solid ${color}`,
      color,
      fontSize: small ? 20 : 26,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: press ? 'scale(0.9)' : 'scale(1)',
      transition: 'transform var(--dur-fast) var(--ease-spring)',
      boxShadow: `0 8px 22px ${color}33`
    }
  }, glyph);
}
Object.assign(window, {
  SwipeScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_app/SwipeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_app/data.js
try { (() => {
// Brelio app — demo course data. Gradients stay inside the warm/cool brand bands.
window.BRELIO_COURSES = [{
  id: 1,
  title: 'UX för nybörjare',
  category: 'Design',
  emoji: '🎨',
  lessons: 12,
  minutes: 45,
  xp: 120,
  poster: 'linear-gradient(155deg,#7C6BFF 0%,#FF4E42 100%)'
}, {
  id: 2,
  title: 'Komposition & ljus i foto',
  category: 'Foto',
  emoji: '📷',
  lessons: 8,
  minutes: 32,
  xp: 90,
  poster: 'linear-gradient(155deg,#FF5E3A 0%,#FFB23E 100%)'
}, {
  id: 3,
  title: 'Bygg din första app',
  category: 'Kod',
  emoji: '💻',
  lessons: 14,
  minutes: 60,
  xp: 180,
  poster: 'linear-gradient(155deg,#6E7BFF 0%,#FF4E42 100%)'
}, {
  id: 4,
  title: 'Skriv som ett proffs',
  category: 'Språk',
  emoji: '✍️',
  lessons: 10,
  minutes: 38,
  xp: 110,
  poster: 'linear-gradient(155deg,#9A6BFF 0%,#FF9233 100%)'
}, {
  id: 5,
  title: 'Grunderna i ekonomi',
  category: 'Pengar',
  emoji: '💰',
  lessons: 9,
  minutes: 40,
  xp: 130,
  poster: 'linear-gradient(155deg,#2DD4BF 0%,#7C6BFF 100%)'
}, {
  id: 6,
  title: 'Träna smartare, inte hårdare',
  category: 'Hälsa',
  emoji: '🏃',
  lessons: 7,
  minutes: 28,
  xp: 80,
  poster: 'linear-gradient(155deg,#FF4E42 0%,#FFB23E 100%)'
}, {
  id: 7,
  title: 'Musikteori på 30 minuter',
  category: 'Musik',
  emoji: '🎵',
  lessons: 6,
  minutes: 30,
  xp: 75,
  poster: 'linear-gradient(155deg,#7C6BFF 0%,#FF5E3A 100%)'
}, {
  id: 8,
  title: 'Tala inför publik',
  category: 'Karriär',
  emoji: '🎤',
  lessons: 11,
  minutes: 42,
  xp: 140,
  poster: 'linear-gradient(155deg,#FF9233 0%,#FF3B4D 100%)'
}];
window.BRELIO_CATEGORIES = [{
  label: 'Design',
  emoji: '🎨'
}, {
  label: 'Kod',
  emoji: '💻'
}, {
  label: 'Foto',
  emoji: '📷'
}, {
  label: 'Språk',
  emoji: '✍️'
}, {
  label: 'Pengar',
  emoji: '💰'
}, {
  label: 'Hälsa',
  emoji: '🏃'
}, {
  label: 'Musik',
  emoji: '🎵'
}, {
  label: 'Karriär',
  emoji: '🎤'
}, {
  label: 'Vetenskap',
  emoji: '🔬'
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/brelio_web/CourseModal.jsx
try { (() => {
// Course detail modal — lesson reader. Completing a lesson awards XP once.
const DS_modal = window.BrelioDesignSystem_2b4fd5;
function CourseModal({
  course,
  onClose,
  onXp
}) {
  const {
    Button,
    Badge
  } = DS_modal;
  const [done, setDone] = React.useState([]);
  if (!course) return null;
  const lessons = window.BRELIO_LESSONS.slice(0, Math.min(6, course.lessons));
  const complete = i => {
    if (done.includes(i)) return;
    setDone(d => [...d, i]);
    onXp && onXp(15);
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,5,7,0.7)',
      backdropFilter: 'blur(6px)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 520,
      maxWidth: '100%',
      maxHeight: '86vh',
      overflowY: 'auto',
      background: 'var(--ink-800)',
      borderRadius: 'var(--radius-xl)',
      borderTop: '1px solid rgba(255,255,255,0.14)',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      borderRight: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      boxShadow: 'var(--shadow-pop)',
      animation: 'b-modal 260ms var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height: 170,
      background: course.poster,
      borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      background: 'radial-gradient(110% 90% at 50% -15%, rgba(255,255,255,0.10), transparent 55%), linear-gradient(180deg, transparent 30%, rgba(16,16,25,0.9) 100%)'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "St\xE4ng",
    style: {
      position: 'absolute',
      top: 14,
      right: 14,
      width: 34,
      height: 34,
      borderRadius: '50%',
      border: '1px solid rgba(255,255,255,0.2)',
      background: 'rgba(8,8,12,0.5)',
      backdropFilter: 'blur(10px)',
      color: 'var(--text-hi)',
      cursor: 'pointer',
      fontSize: 14
    }
  }, "\u2715"), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 22,
      bottom: 16,
      right: 22
    }
  }, /*#__PURE__*/React.createElement(Badge, null, course.category), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 26,
      letterSpacing: '-0.02em',
      color: '#fff',
      marginTop: 8
    }
  }, course.title))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 22px 22px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.06em',
      color: 'var(--text-lo)',
      marginBottom: 16
    }
  }, course.lessons, " lektioner \xB7 ", course.minutes, " min \xB7 ", course.xp, " XP totalt"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginBottom: 18
    }
  }, lessons.map((l, i) => {
    const isDone = done.includes(i);
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      onClick: () => complete(i),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 14px',
        textAlign: 'left',
        background: isDone ? 'rgba(255,178,62,0.08)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isDone ? 'rgba(255,178,62,0.3)' : 'var(--line)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'background var(--dur-base) var(--ease-out), border var(--dur-base) var(--ease-out)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: isDone ? 'var(--amber)' : 'var(--text-lo)',
        width: 22
      }
    }, isDone ? '✓' : String(i + 1).padStart(2, '0')), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 500,
        color: 'var(--text-hi)'
      }
    }, l.t), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'var(--text-lo)'
      }
    }, isDone ? '+15 XP' : l.m + ' min'));
  })), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: () => complete(done.length < lessons.length ? lessons.findIndex((_, i) => !done.includes(i)) : 0)
  }, done.length === 0 ? 'Börja lära dig' : done.length >= lessons.length ? 'Kursen klar 🎉' : 'Fortsätt lära dig'))));
}
Object.assign(window, {
  CourseModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_web/CourseModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_web/QuizModal.jsx
try { (() => {
// Dagens Quiz — 3 questions, +25 XP per correct answer, awarded on finish.
const DS_quiz = window.BrelioDesignSystem_2b4fd5;
function QuizModal({
  onClose,
  onXp
}) {
  const {
    Button
  } = DS_quiz;
  const quiz = window.BRELIO_QUIZ;
  const [i, setI] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [score, setScore] = React.useState(0);
  const [finished, setFinished] = React.useState(false);
  const q = quiz[i];
  const pick = idx => {
    if (picked != null) return;
    setPicked(idx);
    const correct = idx === q.a;
    if (correct) setScore(s => s + 1);
    setTimeout(() => {
      if (i + 1 < quiz.length) {
        setI(i + 1);
        setPicked(null);
      } else {
        setFinished(true);
        const total = (correct ? score + 1 : score) * 25;
        if (total > 0) onXp && onXp(total);
      }
    }, 900);
  };
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(5,5,7,0.7)',
      backdropFilter: 'blur(6px)',
      padding: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      width: 460,
      maxWidth: '100%',
      background: 'var(--ink-800)',
      borderRadius: 'var(--radius-xl)',
      borderTop: '1px solid rgba(255,178,62,0.4)',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      borderRight: '1px solid var(--line)',
      borderBottom: '1px solid var(--line)',
      boxShadow: '0 0 80px -16px rgba(255,178,62,0.4), var(--shadow-pop)',
      padding: 26,
      animation: 'b-modal 260ms var(--ease-out)'
    }
  }, !finished ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      color: 'var(--amber)'
    }
  }, "\uD83E\uDDE0 Dagens quiz \xB7 ", i + 1, " / ", quiz.length), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "St\xE4ng",
    style: {
      width: 30,
      height: 30,
      borderRadius: '50%',
      border: '1px solid var(--line-strong)',
      background: 'none',
      color: 'var(--text-mid)',
      cursor: 'pointer',
      fontSize: 12
    }
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 5,
      marginBottom: 22
    }
  }, quiz.map((_, k) => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      background: k < i || k === i && picked != null ? 'var(--amber)' : 'var(--ink-700)',
      transition: 'background var(--dur-base) var(--ease-out)'
    }
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 20px',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 20,
      color: 'var(--text-hi)',
      lineHeight: 1.3
    }
  }, q.q), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 9
    }
  }, q.options.map((opt, idx) => {
    const isPicked = picked === idx;
    const isRight = picked != null && idx === q.a;
    const isWrong = isPicked && idx !== q.a;
    return /*#__PURE__*/React.createElement("button", {
      key: idx,
      onClick: () => pick(idx),
      style: {
        padding: '13px 16px',
        textAlign: 'left',
        cursor: picked == null ? 'pointer' : 'default',
        background: isRight ? 'rgba(255,178,62,0.12)' : isWrong ? 'rgba(255,59,77,0.10)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isRight ? 'var(--amber)' : isWrong ? 'var(--accent)' : 'var(--line-strong)'}`,
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        fontWeight: 500,
        color: isRight ? 'var(--amber)' : isWrong ? 'var(--accent)' : 'var(--text-hi)',
        transition: 'all var(--dur-base) var(--ease-out)'
      }
    }, opt, isRight && ' ✓', isWrong && ' ✕');
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '14px 4px 4px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 46,
      marginBottom: 12
    }
  }, score === quiz.length ? '🎉' : score > 0 ? '⚡' : '🧠'), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 26,
      letterSpacing: '-0.02em',
      color: 'var(--text-hi)'
    }
  }, score, " av ", quiz.length, " r\xE4tt"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 20px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--amber)'
    }
  }, "+", score * 25, " XP intj\xE4nat"), /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: onClose
  }, "Klart"))));
}
Object.assign(window, {
  QuizModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_web/QuizModal.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_web/WebApp.jsx
try { (() => {
// Brelio web app — root. Atmosphere + sidebar + top HUD + page transitions + modals + flash.
const DS_appw = window.BrelioDesignSystem_2b4fd5;
function WebApp() {
  const [tab, setTab] = React.useState('home');
  const [streak] = React.useState(7);
  const [level, setLevel] = React.useState(1);
  const [xp, setXp] = React.useState(35);
  const [saved, setSaved] = React.useState([]);
  const [query, setQuery] = React.useState('');
  const [course, setCourse] = React.useState(null); // course detail modal
  const [quizOpen, setQuizOpen] = React.useState(false);
  const [flash, setFlash] = React.useState(null); // {color, key}

  const addXp = n => setXp(x => {
    const nx = x + n;
    if (nx >= 200) {
      setLevel(l => l + 1);
      return nx - 200;
    }
    return nx;
  });
  const addSaved = c => setSaved(s => s.find(x => x.id === c.id) ? s : [c, ...s]);
  const doFlash = color => setFlash({
    color,
    key: Date.now()
  });
  const go = t => {
    setTab(t);
    const m = document.getElementById('brelio-main');
    if (m) m.scrollTo({
      top: 0
    });
  };
  const screen = {
    home: /*#__PURE__*/React.createElement(WebHome, {
      onStartSwipe: () => go('swipe'),
      onExplore: () => go('search'),
      onOpen: setCourse,
      onQuiz: () => setQuizOpen(true)
    }),
    swipe: /*#__PURE__*/React.createElement(WebSwipe, {
      onXp: addXp,
      onSaveCourse: addSaved,
      onFlash: doFlash
    }),
    search: /*#__PURE__*/React.createElement(WebSearch, {
      query: query,
      onOpen: setCourse
    }),
    saved: /*#__PURE__*/React.createElement(WebSaved, {
      saved: saved,
      onExplore: () => go('search'),
      onSwipe: () => go('swipe'),
      onOpen: setCourse
    })
  }[tab];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      background: 'radial-gradient(800px circle at 100% 0%, rgba(255,78,66,0.08), transparent 58%), radial-gradient(720px circle at 0% 100%, rgba(124,107,255,0.05), transparent 60%), var(--ink-850)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      minHeight: '100vh',
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    tab: tab,
    onTab: go,
    level: level,
    xp: xp,
    onStartSwipe: () => go('swipe')
  }), /*#__PURE__*/React.createElement("main", {
    id: "brelio-main",
    style: {
      flex: 1,
      height: '100vh',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement(TopBar, {
    streak: streak,
    level: level,
    xp: xp,
    query: query,
    onQuery: v => {
      setQuery(v);
      if (v) setTab('search');
    }
  }), /*#__PURE__*/React.createElement("div", {
    key: tab,
    className: "b-page",
    style: {
      maxWidth: 1080,
      margin: '0 auto',
      padding: '36px 40px 80px'
    }
  }, screen))), course && /*#__PURE__*/React.createElement(CourseModal, {
    course: course,
    onClose: () => setCourse(null),
    onXp: addXp
  }), quizOpen && /*#__PURE__*/React.createElement(QuizModal, {
    onClose: () => setQuizOpen(false),
    onXp: addXp
  }), flash && /*#__PURE__*/React.createElement("div", {
    key: flash.key,
    onAnimationEnd: () => setFlash(null),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 80,
      pointerEvents: 'none',
      background: flash.color,
      animation: 'b-flash 300ms var(--ease-out) forwards'
    }
  }));
}
Object.assign(window, {
  WebApp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_web/WebApp.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_web/WebHome.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Desktop home — hero band, breathing quiz banner, staggered course grid.
const DS_homew = window.BrelioDesignSystem_2b4fd5;
function WebRail({
  number,
  title,
  courses,
  delay,
  onOpen,
  onSeeAll
}) {
  const {
    SectionHeader,
    CourseCard
  } = DS_homew;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "b-rise",
    style: {
      animationDelay: delay + 'ms'
    }
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    number: number,
    title: title,
    action: /*#__PURE__*/React.createElement("span", {
      onClick: onSeeAll
    }, "Se alla \u2192")
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 20,
      marginTop: 22
    }
  }, courses.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "b-rise",
    style: {
      animationDelay: delay + 60 + i * 40 + 'ms'
    }
  }, /*#__PURE__*/React.createElement(CourseCard, _extends({}, c, {
    onClick: () => onOpen(c),
    style: {
      width: '100%'
    }
  }))))));
}
function WebHome({
  onStartSwipe,
  onExplore,
  onOpen,
  onQuiz
}) {
  const {
    Button
  } = DS_homew;
  const [quizHover, setQuizHover] = React.useState(false);
  const courses = window.BRELIO_COURSES;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "b-rise",
    style: {
      position: 'relative',
      borderRadius: 'var(--radius-2xl)',
      overflow: 'hidden',
      padding: '52px 48px',
      marginBottom: 40,
      border: '1px solid var(--line)',
      borderTop: '1px solid rgba(255,255,255,0.10)',
      background: 'radial-gradient(120% 140% at 0% 0%, rgba(124,107,255,0.22), transparent 55%), radial-gradient(120% 140% at 100% 100%, rgba(255,78,66,0.22), transparent 55%), var(--ink-800)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      color: 'var(--amber)',
      background: 'var(--amber-tint)',
      border: '1px solid rgba(255,178,62,0.25)',
      padding: '6px 13px',
      borderRadius: 'var(--radius-full)',
      marginBottom: 22
    }
  }, "\u2728 L\xE4rande gjort enkelt"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 16px',
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 'clamp(40px, 5vw, 60px)',
      lineHeight: 1.02,
      letterSpacing: '-0.03em',
      color: 'var(--text-hi)',
      maxWidth: 720,
      textWrap: 'pretty'
    }
  }, "Swipa dig till ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)',
      fontStyle: 'italic'
    }
  }, "din n\xE4sta kurs")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 30px',
      fontFamily: 'var(--font-body)',
      fontSize: 18,
      lineHeight: 1.5,
      color: 'var(--text-mid)',
      maxWidth: 560
    }
  }, "Bl\xE4ddra bland hundratals kurser precis som p\xE5 Tinder. Gilla det du vill l\xE4ra dig, hoppa \xF6ver resten \u2014 och spara det f\xF6r senare."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    size: "lg",
    onClick: onStartSwipe
  }, "B\xF6rja swipa"), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "lg",
    onClick: onExplore
  }, "Utforska kurser"))), /*#__PURE__*/React.createElement("div", {
    className: "b-rise",
    onClick: onQuiz,
    onMouseEnter: () => setQuizHover(true),
    onMouseLeave: () => setQuizHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18,
      marginBottom: 44,
      cursor: 'pointer',
      borderRadius: 'var(--radius-xl)',
      padding: '22px 26px',
      animationDelay: '80ms',
      background: 'rgba(24,22,30,0.9)',
      borderTop: '1px solid rgba(255,178,62,0.4)',
      borderLeft: '1px solid rgba(255,255,255,0.08)',
      borderRight: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      boxShadow: quizHover ? '0 0 60px -6px rgba(255,178,62,0.55), inset 0 1px 0 rgba(255,255,255,0.08)' : undefined,
      animation: quizHover ? 'none' : 'b-quizpulse 2.5s ease-in-out infinite',
      transform: quizHover ? 'translateY(-3px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 42
    }
  }, "\uD83E\uDDE0"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: 20,
      color: 'var(--text-hi)'
    }
  }, "Dagens Quiz \u2014 testa din kunskap!"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-mid)',
      marginTop: 3,
      letterSpacing: '0.04em'
    }
  }, "10 fr\xE5gor \xB7 tj\xE4na upp till 200 XP \xB7 bygg din combo")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 15,
      padding: '10px 20px',
      borderRadius: 'var(--radius-full)',
      color: quizHover ? '#0A0A0F' : 'var(--amber)',
      background: quizHover ? 'var(--amber)' : 'var(--amber-tint)',
      border: '1px solid rgba(255,178,62,0.45)',
      transition: 'all var(--dur-base) var(--ease-out)'
    }
  }, "Starta \u2192")), /*#__PURE__*/React.createElement(WebRail, {
    number: "01",
    title: "Popul\xE4rt just nu \uD83D\uDD25",
    courses: courses.slice(0, 4),
    delay: 160,
    onOpen: onOpen,
    onSeeAll: onExplore
  }), /*#__PURE__*/React.createElement(WebRail, {
    number: "02",
    title: "Rekommenderat f\xF6r dig \u2728",
    courses: courses.slice(4, 8),
    delay: 280,
    onOpen: onOpen,
    onSeeAll: onExplore
  }));
}
Object.assign(window, {
  WebHome
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_web/WebHome.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_web/WebSaved.jsx
try { (() => {
// Desktop saved — saved list, or an inviting empty state with floating icon.
const DS_savedw = window.BrelioDesignSystem_2b4fd5;
function WebSaved({
  saved,
  onExplore,
  onSwipe,
  onOpen
}) {
  const {
    SectionHeader,
    Badge,
    Button
  } = DS_savedw;
  if (!saved || saved.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '55vh'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        maxWidth: 380
      }
    }, /*#__PURE__*/React.createElement("div", {
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        top: -30,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 220,
        height: 220,
        borderRadius: '50%',
        background: 'var(--cool)',
        opacity: 0.14,
        filter: 'blur(64px)',
        pointerEvents: 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 52,
        lineHeight: 1,
        marginBottom: 16,
        animation: 'b-float 3s ease-in-out infinite'
      }
    }, "\uD83D\uDD16"), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: '0 0 10px',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 30,
        letterSpacing: '-0.02em',
        color: 'var(--text-hi)'
      }
    }, "Inga sparade \xE4nnu"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 24px',
        fontFamily: 'var(--font-body)',
        fontSize: 16,
        lineHeight: 1.5,
        color: 'var(--text-mid)'
      }
    }, "Swipa upp p\xE5 en kurs i fl\xF6det f\xF6r att spara den hit f\xF6r senare."), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement(Button, {
      variant: "primary",
      onClick: onExplore
    }, "Utforska kurser"), /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onSwipe
    }, "B\xF6rja swipa"))));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "b-rise"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: "Sparade kurser"
  })), /*#__PURE__*/React.createElement("p", {
    className: "b-rise",
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      color: 'var(--text-mid)',
      margin: '12px 0 26px',
      animationDelay: '50ms'
    }
  }, "Kurser du har sparat f\xF6r att l\xE4sa senare"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, saved.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "b-rise",
    onClick: () => onOpen(c),
    style: {
      display: 'flex',
      gap: 18,
      alignItems: 'center',
      background: 'var(--ink-750)',
      border: '1px solid var(--line)',
      borderTop: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 'var(--radius-lg)',
      padding: 14,
      cursor: 'pointer',
      animationDelay: 100 + i * 50 + 'ms',
      transition: 'background var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = 'var(--ink-700)';
      e.currentTarget.style.transform = 'translateX(3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'var(--ink-750)';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 76,
      height: 76,
      borderRadius: 'var(--radius-md)',
      background: c.poster,
      flex: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 30
    }
  }, c.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Badge, null, c.category), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 18,
      color: 'var(--text-hi)',
      margin: '8px 0 5px'
    }
  }, c.title), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      letterSpacing: '0.06em',
      color: 'var(--text-lo)'
    }
  }, c.lessons, " lektioner \xB7 ", c.minutes, " min \xB7 ", c.xp, " XP")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 14,
      color: 'var(--accent)',
      whiteSpace: 'nowrap'
    }
  }, "B\xF6rja l\xE4ra dig \u2192")))));
}
Object.assign(window, {
  WebSaved
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_web/WebSaved.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_web/WebSearch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Desktop search/explore — category pills + responsive results grid.
const DS_searchw = window.BrelioDesignSystem_2b4fd5;
function WebSearch({
  query,
  onOpen
}) {
  const {
    CourseCard,
    SectionHeader
  } = DS_searchw;
  const [active, setActive] = React.useState('Alla');
  const [sort, setSort] = React.useState('relevant');
  const cats = window.BRELIO_CATEGORIES;
  const courses = window.BRELIO_COURSES;
  let list = active === 'Alla' ? courses : courses.filter(c => c.category === active);
  if (query) list = list.filter(c => (c.title + c.category).toLowerCase().includes(query.toLowerCase()));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "b-rise"
  }, /*#__PURE__*/React.createElement(SectionHeader, {
    title: query ? `Sökresultat för "${query}"` : 'Utforska kurser'
  })), /*#__PURE__*/React.createElement("div", {
    className: "b-rise",
    style: {
      display: 'flex',
      gap: 14,
      alignItems: 'center',
      margin: '18px 0 24px',
      animationDelay: '60ms'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      flex: 1
    }
  }, ['Alla', ...cats.map(c => c.label)].map(label => /*#__PURE__*/React.createElement(FilterPill, {
    key: label,
    label: label,
    active: active === label,
    onClick: () => setActive(label)
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-mid)'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: sort,
    onChange: e => setSort(e.target.value),
    style: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid var(--line)',
      color: 'var(--text-hi)',
      borderRadius: 'var(--radius-md)',
      padding: '6px 10px',
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("option", {
    value: "relevant"
  }, "Mest relevant"), /*#__PURE__*/React.createElement("option", {
    value: "popular"
  }, "Popul\xE4r"), /*#__PURE__*/React.createElement("option", {
    value: "newest"
  }, "Senaste")))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-lo)',
      marginBottom: 16,
      letterSpacing: '0.06em'
    }
  }, list.length, " KURSER HITTADES"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: 20
    }
  }, list.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "b-rise",
    style: {
      animationDelay: 120 + i * 40 + 'ms'
    }
  }, /*#__PURE__*/React.createElement(CourseCard, _extends({}, c, {
    onClick: () => onOpen(c),
    style: {
      width: '100%'
    }
  }))))), list.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      color: 'var(--text-mid)',
      textAlign: 'center',
      padding: 60
    }
  }, "Inga kurser matchar. Prova en annan kategori eller s\xF6kterm."));
}
function FilterPill({
  label,
  active,
  onClick
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      cursor: 'pointer',
      padding: '9px 18px',
      borderRadius: 'var(--radius-full)',
      background: active ? 'var(--accent)' : hover ? 'rgba(255,255,255,0.04)' : 'transparent',
      color: active ? '#fff' : hover ? 'var(--text-hi)' : 'var(--text-mid)',
      border: `1px solid ${active ? 'var(--accent)' : hover ? 'rgba(255,255,255,0.12)' : 'var(--line-strong)'}`,
      boxShadow: active && hover ? '0 0 20px -4px rgba(255,78,66,0.6)' : 'none',
      transition: 'all var(--dur-base) var(--ease-out)'
    }
  }, label);
}
Object.assign(window, {
  WebSearch
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_web/WebSearch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_web/WebShell.jsx
try { (() => {
// Brelio web shell — glass sidebar + top HUD bar with working popovers and XP burst.
const DS_shellw = window.BrelioDesignSystem_2b4fd5;
const WEB_NAV = [{
  id: 'home',
  label: 'Hem',
  icon: '⌂'
}, {
  id: 'swipe',
  label: 'Swipa',
  icon: '⇄'
}, {
  id: 'search',
  label: 'Sök',
  icon: '⌕'
}, {
  id: 'saved',
  label: 'Sparade',
  icon: '🔖'
}];
function Sidebar({
  tab,
  onTab,
  level,
  xp,
  onStartSwipe
}) {
  const {
    Button
  } = DS_shellw;
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 248,
      flex: 'none',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px) saturate(160%)',
      WebkitBackdropFilter: 'blur(20px) saturate(160%)',
      borderRight: '1px solid var(--line)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
      padding: '26px 18px',
      height: '100vh',
      position: 'sticky',
      top: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: '-0.02em',
      color: 'var(--text-hi)',
      padding: '0 10px 26px'
    }
  }, "Brelio ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "\uD83D\uDD25")), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, WEB_NAV.map(n => /*#__PURE__*/React.createElement(NavItem, {
    key: n.id,
    item: n,
    active: tab === n.id,
    onTab: onTab
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      padding: '0 4px'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "primary",
    fullWidth: true,
    onClick: onStartSwipe,
    style: {
      animation: 'b-breathe 2s ease-in-out infinite'
    }
  }, "B\xF6rja swipa")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: '16px 12px 0',
      borderTop: '1px solid var(--line)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--cool)'
    }
  }, "\u26A1 Niv\xE5 ", level), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-lo)'
    }
  }, /*#__PURE__*/React.createElement(TickNumber, {
    value: xp
  }), " / 200 XP")), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 5,
      background: 'var(--ink-700)',
      borderRadius: 3
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${xp / 200 * 100}%`,
      background: 'var(--fire)',
      borderRadius: 3,
      transition: 'width var(--dur-cine) var(--ease-spring)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 12,
      color: xp >= 150 ? 'var(--amber)' : 'var(--text-mid)',
      marginTop: 8,
      fontWeight: 500
    }
  }, xp >= 150 ? `Bara ${200 - xp} XP till nästa nivå! 🔥` : 'Gilla kurser och klara lektioner för XP')));
}
function NavItem({
  item,
  active,
  onTab
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onTab(item.id),
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '12px 14px',
      cursor: 'pointer',
      borderRadius: 'var(--radius-md)',
      border: 'none',
      textAlign: 'left',
      background: active ? 'var(--accent-tint)' : hover ? 'rgba(255,255,255,0.05)' : 'transparent',
      color: active ? 'var(--accent)' : hover ? 'var(--text-hi)' : 'var(--text-mid)',
      fontFamily: 'var(--font-body)',
      fontSize: 16,
      fontWeight: active ? 600 : 500,
      transition: 'background var(--dur-base) var(--ease-out), color var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      width: 22,
      textAlign: 'center'
    }
  }, item.icon), item.label);
}

/* Animated number — ticks from old to new value over 600ms. */
function TickNumber({
  value
}) {
  const [shown, setShown] = React.useState(value);
  const prev = React.useRef(value);
  React.useEffect(() => {
    const from = prev.current,
      to = value;
    prev.current = value;
    if (from === to) return;
    const t0 = performance.now(),
      dur = 600;
    let raf;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3); // ease-out
      setShown(Math.round(from + (to - from) * e));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return /*#__PURE__*/React.createElement("span", null, shown);
}

/* Chip wrapper that pops + emits a particle burst when `signal` changes. */
function BurstChip({
  signal,
  color,
  onClick,
  children
}) {
  const [burst, setBurst] = React.useState(null);
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setBurst(Date.now());
    const t = setTimeout(() => setBurst(null), 550);
    return () => clearTimeout(t);
  }, [signal]);
  const dots = burst ? [...Array(6)].map((_, i) => {
    const ang = i / 6 * Math.PI * 2 + 0.4;
    return {
      x: Math.cos(ang) * 34,
      y: Math.sin(ang) * 34,
      key: burst + '-' + i
    };
  }) : [];
  return /*#__PURE__*/React.createElement("span", {
    onClick: onClick,
    style: {
      position: 'relative',
      display: 'inline-flex',
      cursor: 'pointer',
      animation: burst ? 'b-chippop 500ms var(--ease-spring)' : 'none'
    }
  }, children, dots.map(d => /*#__PURE__*/React.createElement("span", {
    key: d.key,
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: color,
      pointerEvents: 'none',
      '--bx': d.x + 'px',
      '--by': d.y + 'px',
      animation: 'b-burst 500ms var(--ease-out) forwards'
    }
  })));
}
function Popover({
  x = 'right',
  children,
  onClose
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 40
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 10px)',
      [x]: 0,
      zIndex: 50,
      minWidth: 230,
      background: 'rgba(17,17,26,0.97)',
      borderTop: '1px solid rgba(255,255,255,0.14)',
      borderLeft: '1px solid rgba(255,255,255,0.10)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 'var(--radius-lg)',
      padding: 16,
      boxShadow: 'var(--shadow-pop)',
      animation: 'b-modal 200ms var(--ease-out)'
    }
  }, children));
}
function TopBar({
  streak,
  level,
  xp,
  query,
  onQuery
}) {
  const {
    StatChip
  } = DS_shellw;
  const [open, setOpen] = React.useState(null); // 'streak' | 'level' | 'profile'
  const [focus, setFocus] = React.useState(false);
  const days = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];
  const toggle = k => setOpen(open === k ? null : k);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      padding: '18px 40px',
      position: 'sticky',
      top: 0,
      zIndex: 30,
      background: 'rgba(12,12,18,0.88)',
      borderBottom: '1px solid var(--line)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      maxWidth: 460,
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: focus ? 'rgba(255,255,255,0.09)' : 'rgba(255,255,255,0.06)',
      border: `1px solid ${focus ? 'rgba(255,78,66,0.28)' : 'rgba(255,255,255,0.08)'}`,
      boxShadow: focus ? '0 0 16px -6px rgba(255,78,66,0.28), inset 0 1px 0 rgba(255,255,255,0.06)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
      borderRadius: 'var(--radius-full)',
      padding: '10px 16px',
      transition: 'border var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-mid)',
      fontSize: 16
    }
  }, "\u2315"), /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => onQuery(e.target.value),
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    placeholder: "S\xF6k bland hundratals kurser\u2026",
    style: {
      flex: 1,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'var(--text-hi)',
      fontSize: 14,
      fontFamily: 'var(--font-body)',
      '::placeholder': {
        color: 'var(--text-lo)'
      }
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: 'auto',
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(BurstChip, {
    signal: streak,
    color: "var(--accent)",
    onClick: () => toggle('streak')
  }, /*#__PURE__*/React.createElement(StatChip, {
    role: "streak",
    icon: "\uD83D\uDD25"
  }, streak, " dagar")), open === 'streak' && /*#__PURE__*/React.createElement(Popover, {
    onClose: () => setOpen(null)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--text-hi)',
      marginBottom: 4
    }
  }, "\uD83D\uDD25 ", streak, " dagar i rad"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-mid)',
      marginBottom: 14
    }
  }, "L\xE4r dig n\xE5got varje dag f\xF6r att beh\xE5lla din streak."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, days.map((d, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 10,
      padding: '8px 0',
      borderRadius: 8,
      background: i < streak ? 'var(--accent-tint)' : 'rgba(255,255,255,0.04)',
      color: i < streak ? 'var(--accent)' : 'var(--text-lo)',
      border: `1px solid ${i < streak ? 'rgba(255,78,66,0.3)' : 'var(--line)'}`
    }
  }, d))))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(BurstChip, {
    signal: xp,
    color: "var(--amber)",
    onClick: () => toggle('level')
  }, /*#__PURE__*/React.createElement(StatChip, {
    role: "level",
    icon: "\u26A1"
  }, "Lvl ", level)), open === 'level' && /*#__PURE__*/React.createElement(Popover, {
    onClose: () => setOpen(null)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--text-hi)',
      marginBottom: 4
    }
  }, "\u26A1 Niv\xE5 ", level), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-body)',
      fontSize: 13,
      color: 'var(--text-mid)',
      marginBottom: 12
    }
  }, 200 - xp, " XP kvar till niv\xE5 ", level + 1, "."), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 6,
      background: 'var(--ink-700)',
      borderRadius: 3,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${xp / 200 * 100}%`,
      background: 'var(--fire)',
      borderRadius: 3,
      transition: 'width var(--dur-cine) var(--ease-spring)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-lo)'
    }
  }, /*#__PURE__*/React.createElement(TickNumber, {
    value: xp
  }), " / 200 XP"))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => toggle('profile'),
    style: {
      width: 38,
      height: 38,
      borderRadius: '50%',
      background: 'var(--fire)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 16,
      fontWeight: 700,
      color: '#fff',
      fontFamily: 'var(--font-body)',
      border: 'none',
      cursor: 'pointer',
      boxShadow: open === 'profile' ? '0 0 0 2px rgba(255,78,66,0.5)' : 'none'
    }
  }, "A"), open === 'profile' && /*#__PURE__*/React.createElement(Popover, {
    onClose: () => setOpen(null)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: '50%',
      background: 'var(--fire)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
      color: '#fff',
      fontFamily: 'var(--font-body)'
    }
  }, "A"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-body)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--text-hi)'
    }
  }, "Alex Andersson"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-lo)',
      marginTop: 2
    }
  }, "Niv\xE5 ", level, " \xB7 ", streak, " dagars streak"))), ['Min profil', 'Inställningar', 'Notiser', 'Logga ut'].map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '10px 10px',
      background: 'none',
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      fontFamily: 'var(--font-body)',
      fontSize: 14,
      color: r === 'Logga ut' ? 'var(--accent)' : 'var(--text-mid)',
      transition: 'background var(--dur-base) var(--ease-out)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)',
    onMouseLeave: e => e.currentTarget.style.background = 'none'
  }, r))))));
}
Object.assign(window, {
  Sidebar,
  TopBar,
  TickNumber
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_web/WebShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_web/WebSwipe.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Desktop swipe — physical card deck; keyboard ← ↑ →; confirmation flash via onFlash.
const DS_swipew = window.BrelioDesignSystem_2b4fd5;
function WebSwipe({
  onXp,
  onSaveCourse,
  onFlash
}) {
  const {
    SwipeCard
  } = DS_swipew;
  const [idx, setIdx] = React.useState(0);
  const [toast, setToast] = React.useState(null);
  const [popKey, setPopKey] = React.useState(null);
  const courses = window.BRELIO_COURSES;
  const done = idx >= courses.length;
  const flash = (msg, color) => {
    setToast({
      msg,
      color
    });
    setTimeout(() => setToast(null), 1200);
  };
  const advance = React.useCallback(kind => {
    setIdx(i => {
      if (i >= courses.length) return i;
      if (kind === 'like') {
        onXp && onXp(10);
        flash('Gillade! +10 XP 🔥', 'var(--accent)');
        onFlash && onFlash('rgba(255,78,66,0.08)');
      }
      if (kind === 'save') {
        onSaveCourse && onSaveCourse(courses[i]);
        flash('Sparad till din resa 🔖', 'var(--cool)');
        onFlash && onFlash('rgba(124,107,255,0.08)');
      }
      if (kind === 'skip') {
        flash('Nästa →', 'rgba(255,255,255,0.2)');
      }
      return i + 1;
    });
    setPopKey(kind + Date.now());
  }, []);
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        advance('skip');
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        advance('save');
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        advance('like');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance]);
  if (done) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        maxWidth: 400
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 52,
        marginBottom: 16
      }
    }, "\uD83C\uDF89"), /*#__PURE__*/React.createElement("h2", {
      style: {
        margin: '0 0 10px',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 28,
        letterSpacing: '-0.02em',
        color: 'var(--text-hi)'
      }
    }, "Du har sett allt!"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '0 0 24px',
        fontFamily: 'var(--font-body)',
        fontSize: 15,
        lineHeight: 1.5,
        color: 'var(--text-mid)'
      }
    }, "Bra jobbat. Kolla dina sparade kurser eller b\xF6rja om och hitta fler guldkorn."), /*#__PURE__*/React.createElement("button", {
      onClick: () => setIdx(0),
      style: {
        padding: '11px 22px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--accent)',
        color: '#fff',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        border: 'none',
        cursor: 'pointer'
      }
    }, "B\xF6rja om")));
  }
  const top = courses[idx];
  const peek = courses[idx + 1];
  const peek2 = courses[idx + 2];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 12,
      color: 'var(--text-lo)',
      textTransform: 'uppercase',
      letterSpacing: '0.16em',
      marginBottom: 6
    }
  }, "Hitta kursen som tar dig n\xE4rmare ditt m\xE5l"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      color: 'var(--text-mid)',
      margin: '0 0 28px',
      letterSpacing: '0.05em'
    }
  }, "Kort ", idx + 1, " av ", courses.length, " \xB7 Piltangenter fungerar ocks\xE5"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      width: 360,
      height: 520
    }
  }, peek2 && /*#__PURE__*/React.createElement("div", {
    key: 'peek2' + peek2.id,
    style: {
      position: 'absolute',
      inset: 0,
      transform: 'scale(0.88) translateY(28px)',
      filter: 'brightness(0.50)',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(SwipeCard, _extends({}, peek2, {
    style: {
      width: '100%',
      height: '100%'
    }
  }))), peek && /*#__PURE__*/React.createElement("div", {
    key: 'peek' + peek.id,
    style: {
      position: 'absolute',
      inset: 0,
      transform: 'scale(0.92) translateY(16px)',
      filter: 'brightness(0.65)',
      zIndex: 2
    }
  }, /*#__PURE__*/React.createElement(SwipeCard, _extends({}, peek, {
    style: {
      width: '100%',
      height: '100%'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    key: top.id,
    style: {
      position: 'absolute',
      inset: 0,
      animation: 'b-cardrise 280ms var(--ease-spring)',
      zIndex: 3
    }
  }, /*#__PURE__*/React.createElement(SwipeCard, _extends({}, top, {
    style: {
      width: '100%',
      height: '100%'
    },
    onLike: () => advance('like'),
    onSkip: () => advance('skip'),
    onSave: () => advance('save')
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 20,
      marginTop: 24
    }
  }, /*#__PURE__*/React.createElement(SwipeBtn, {
    color: "#5A5A6B",
    label: "Skippa",
    glyph: "\u2715",
    pop: popKey && popKey.startsWith('skip'),
    onClick: () => advance('skip')
  }), /*#__PURE__*/React.createElement(SwipeBtn, {
    color: "#FF4E42",
    label: "Gillar",
    glyph: "\u2665",
    pop: popKey && popKey.startsWith('like'),
    onClick: () => advance('like')
  }), /*#__PURE__*/React.createElement(SwipeBtn, {
    color: "#7C6BFF",
    label: "Spara",
    glyph: "\uD83D\uDD16",
    pop: popKey && popKey.startsWith('save'),
    onClick: () => advance('save')
  })), toast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: 40,
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 5,
      fontFamily: 'var(--font-body)',
      fontSize: 15,
      fontWeight: 600,
      color: '#fff',
      whiteSpace: 'nowrap',
      background: toast.color,
      padding: '12px 22px',
      borderRadius: 'var(--radius-full)',
      boxShadow: 'var(--shadow-pop)',
      animation: 'popw var(--dur-slow) var(--ease-spring)'
    }
  }, toast.msg));
}
function SwipeBtn({
  color,
  label,
  glyph,
  pop,
  onClick
}) {
  const [press, setPress] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const size = 64;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    onClick: onClick,
    onPointerDown: () => setPress(true),
    onPointerUp: () => setPress(false),
    onPointerEnter: () => setHover(true),
    onPointerLeave: () => {
      setPress(false);
      setHover(false);
    },
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      cursor: 'pointer',
      background: 'var(--ink-750)',
      border: `2px solid ${color}`,
      color,
      fontSize: 24,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: press ? 'scale(0.88)' : hover ? 'scale(1.1)' : 'scale(1)',
      transition: 'transform var(--dur-fast) var(--ease-spring), box-shadow var(--dur-base) var(--ease-out)',
      boxShadow: hover ? `0 0 20px -2px ${color}` : `0 8px 20px ${color}22`,
      animation: pop ? 'b-pop 400ms var(--ease-spring)' : 'none'
    }
  }, glyph), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 11,
      color: 'var(--text-lo)',
      textTransform: 'uppercase',
      letterSpacing: '0.12em'
    }
  }, label));
}
Object.assign(window, {
  WebSwipe
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_web/WebSwipe.jsx", error: String((e && e.message) || e) }); }

// ui_kits/brelio_web/data.js
try { (() => {
// Brelio app — demo data. Card art: cinematic dark gradients (category-keyed), not stock brights.
window.BRELIO_COURSES = [{
  id: 1,
  level: 'Nybörjare',
  desc: 'Lär dig grunderna i användarupplevelse och designtänk.',
  why: 'Passar dig som vill börja skapa digitalt',
  title: 'UX för nybörjare',
  category: 'Design',
  emoji: '🎨',
  lessons: 12,
  minutes: 45,
  xp: 120,
  glow: '#9A6BFF',
  poster: 'linear-gradient(150deg,#2a2440,#3c2040)'
}, {
  id: 2,
  level: 'Nybörjare',
  desc: 'Ta bättre bilder med ljus, linjer och komposition.',
  why: 'Passar dig som fotar med mobilen',
  title: 'Komposition & ljus i foto',
  category: 'Foto',
  emoji: '📷',
  lessons: 8,
  minutes: 32,
  xp: 90,
  glow: '#2DD4BF',
  poster: 'linear-gradient(150deg,#1a2a3a,#2a3520)'
}, {
  id: 3,
  level: 'Medel',
  desc: 'Bygg och publicera en riktig app, steg för steg.',
  why: 'Passar dig som vill skapa på riktigt',
  title: 'Bygg din första app',
  category: 'Kod',
  emoji: '💻',
  lessons: 14,
  minutes: 60,
  xp: 180,
  glow: '#6E7BFF',
  poster: 'linear-gradient(150deg,#0f1a2e,#1a1428)'
}, {
  id: 4,
  level: 'Nybörjare',
  desc: 'Skriv tydligare texter som folk faktiskt läser.',
  why: 'Passar dig som skriver varje dag',
  title: 'Skriv som ett proffs',
  category: 'Språk',
  emoji: '✍️',
  lessons: 10,
  minutes: 38,
  xp: 110,
  glow: '#9A6BFF',
  poster: 'linear-gradient(150deg,#2a1a2e,#1a2a2a)'
}, {
  id: 5,
  level: 'Nybörjare',
  desc: 'Förstå sparande, ränta och budget utan krångel.',
  why: 'Passar dig som vill få koll på pengarna',
  title: 'Grunderna i ekonomi',
  category: 'Pengar',
  emoji: '💰',
  lessons: 9,
  minutes: 40,
  xp: 130,
  glow: '#FFB23E',
  poster: 'linear-gradient(150deg,#2a2010,#1a1a10)'
}, {
  id: 6,
  level: 'Nybörjare',
  desc: 'Få ut mer av din träning med mindre tid.',
  why: 'Passar dig med fullt schema',
  title: 'Träna smartare, inte hårdare',
  category: 'Hälsa',
  emoji: '🏃',
  lessons: 7,
  minutes: 28,
  xp: 80,
  glow: '#2DD4BF',
  poster: 'linear-gradient(150deg,#0f2a1a,#1a2a10)'
}, {
  id: 7,
  level: 'Medel',
  desc: 'Ackord, skalor och rytm — snabbt och praktiskt.',
  why: 'Passar dig som spelar på gehör',
  title: 'Musikteori på 30 minuter',
  category: 'Musik',
  emoji: '🎵',
  lessons: 6,
  minutes: 30,
  xp: 75,
  glow: '#FF4E42',
  poster: 'linear-gradient(150deg,#2a1028,#1a0a18)'
}, {
  id: 8,
  level: 'Medel',
  desc: 'Våga ta ordet och håll presentationer med lugn.',
  why: 'Passar dig som vill växa i jobbet',
  title: 'Tala inför publik',
  category: 'Karriär',
  emoji: '🎤',
  lessons: 11,
  minutes: 42,
  xp: 140,
  glow: '#FF9233',
  poster: 'linear-gradient(150deg,#1a1020,#2a1818)'
}];
window.BRELIO_CATEGORIES = [{
  label: 'Design',
  emoji: '🎨'
}, {
  label: 'Kod',
  emoji: '💻'
}, {
  label: 'Foto',
  emoji: '📷'
}, {
  label: 'Språk',
  emoji: '✍️'
}, {
  label: 'Pengar',
  emoji: '💰'
}, {
  label: 'Hälsa',
  emoji: '🏃'
}, {
  label: 'Musik',
  emoji: '🎵'
}, {
  label: 'Karriär',
  emoji: '🎤'
}];

// Lesson template for the course reader (durations in min).
window.BRELIO_LESSONS = [{
  t: 'Introduktion',
  m: 4
}, {
  t: 'Grunderna',
  m: 7
}, {
  t: 'Verktygen du behöver',
  m: 6
}, {
  t: 'Praktisk övning',
  m: 9
}, {
  t: 'Vanliga misstag',
  m: 5
}, {
  t: 'Avslutande projekt',
  m: 12
}];

// Dagens quiz — 3 frågor, +25 XP per rätt svar.
window.BRELIO_QUIZ = [{
  q: 'Vad står "UX" för?',
  options: ['User Experience', 'Universal Export', 'Unified Syntax', 'User Extension'],
  a: 0
}, {
  q: 'Ungefär hur stor del av jordens yta täcks av vatten?',
  options: ['50 %', '60 %', '70 %', '85 %'],
  a: 2
}, {
  q: 'Vilket år landade människan första gången på månen?',
  options: ['1965', '1969', '1972', '1975'],
  a: 1
}];
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/brelio_web/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.CourseCard = __ds_scope.CourseCard;

__ds_ns.SwipeCard = __ds_scope.SwipeCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.StatChip = __ds_scope.StatChip;

__ds_ns.EmptyState = __ds_scope.EmptyState;

})();
