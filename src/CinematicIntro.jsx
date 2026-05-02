import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useLang } from "./i18n"
import { writeIntroSeen } from "./introSession.js"

const logoPath = "/logo.png"

/** Main chrome can animate in */
const RELEASE_UI_MS = 2080
const EXIT_DURATION_NORMAL_MS = 700
const EXIT_DURATION_SKIP_MS = 400
const EXIT_DURATION_REDUCED_MS = 500

function getIntroFlyTarget() {
  if (typeof window === "undefined") {
    return { x: -300, y: -250, scale: 0.44, logoClass: "h-24 w-24" }
  }
  const w = window.innerWidth
  const h = window.innerHeight
  if (w < 400) {
    return {
      x: -Math.min(140, w * 0.32),
      y: -Math.min(120, h * 0.22),
      scale: 0.36,
      logoClass: "h-20 w-20",
    }
  }
  if (w < 640) {
    return {
      x: -Math.min(200, w * 0.38),
      y: -Math.min(170, h * 0.26),
      scale: 0.4,
      logoClass: "h-[5.5rem] w-[5.5rem]",
    }
  }
  if (w < 900) {
    return { x: -240, y: -210, scale: 0.42, logoClass: "h-24 w-24" }
  }
  return { x: -320, y: -270, scale: 0.45, logoClass: "h-24 w-24" }
}

/** Web Audio only — subtle, low gain */
function playIntroChime(audioContext) {
  const now = audioContext.currentTime
  const master = audioContext.createGain()
  master.gain.setValueAtTime(0.0001, now)
  master.gain.exponentialRampToValueAtTime(0.08, now + 0.04)
  master.gain.exponentialRampToValueAtTime(0.0001, now + 1.32)
  master.connect(audioContext.destination)

  const ratios = [1, 1.25, 1.5, 2]
  const base = 155
  ratios.forEach((r, i) => {
    const osc = audioContext.createOscillator()
    const g = audioContext.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(base * r, now)
    const t0 = now + i * 0.035
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(0.12 / ratios.length, t0 + 0.07)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.22)
    osc.connect(g)
    g.connect(master)
    osc.start(t0)
    osc.stop(t0 + 1.28)
  })

  const noiseBuf = audioContext.createBuffer(1, Math.floor(audioContext.sampleRate * 0.32), audioContext.sampleRate)
  const ch = noiseBuf.getChannelData(0)
  for (let i = 0; i < ch.length; i += 1) {
    ch[i] = (Math.random() * 2 - 1) * 0.07 * (1 - i / ch.length)
  }
  const noise = audioContext.createBufferSource()
  noise.buffer = noiseBuf
  const ng = audioContext.createGain()
  ng.gain.setValueAtTime(0.0001, now + 0.1)
  ng.gain.exponentialRampToValueAtTime(0.022, now + 0.14)
  ng.gain.exponentialRampToValueAtTime(0.0001, now + 0.42)
  noise.connect(ng)
  ng.connect(master)
  noise.start(now + 0.1)
  noise.stop(now + 0.48)
}

const particleConfig = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  left: `${((i * 17) % 100) + (i % 3)}%`,
  top: `${(i * 23) % 100}%`,
  size: 1.5 + (i % 4) * 0.85,
  delay: (i % 8) * 0.09,
  duration: 2.6 + (i % 5) * 0.32,
}))

/**
 * @param {{ onReleased: () => void, onExited: () => void, reducedMotionPref?: boolean | null }} props
 */
export function CinematicIntro({ onReleased, onExited, reducedMotionPref }) {
  const { copy } = useLang()
  const systemReduced = useReducedMotion()
  const reducedMotion = reducedMotionPref === true || systemReduced === true

  const fly = useMemo(() => getIntroFlyTarget(), [])
  const [phase, setPhase] = useState("play")
  const [soundPrompt, setSoundPrompt] = useState(false)
  const audioCtxRef = useRef(null)
  const chimePlayedRef = useRef(false)
  const timersRef = useRef([])
  const releasedRef = useRef(false)
  const exitedRef = useRef(false)

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id))
    timersRef.current = []
  }, [])

  const releaseUi = useCallback(() => {
    if (releasedRef.current) return
    releasedRef.current = true
    onReleased()
  }, [onReleased])

  const finishSession = useCallback(() => {
    if (exitedRef.current) return
    exitedRef.current = true
    writeIntroSeen()
    onExited()
  }, [onExited])

  const tryPlayChime = useCallback(() => {
    if (reducedMotion || chimePlayedRef.current) return true
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return true
    try {
      const ctx = audioCtxRef.current ?? new AC()
      audioCtxRef.current = ctx
      if (ctx.state === "suspended") {
        return false
      }
      playIntroChime(ctx)
      chimePlayedRef.current = true
      setSoundPrompt(false)
      return true
    } catch {
      return true
    }
  }, [reducedMotion])

  const handleEnableSound = useCallback(() => {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) {
      setSoundPrompt(false)
      return
    }
    const ctx = audioCtxRef.current ?? new AC()
    audioCtxRef.current = ctx
    ctx.resume().then(() => {
      if (!chimePlayedRef.current) {
        playIntroChime(ctx)
        chimePlayedRef.current = true
      }
      setSoundPrompt(false)
    })
  }, [])

  useEffect(() => {
    if (reducedMotion) {
      const t = setTimeout(() => releaseUi(), 80)
      timersRef.current.push(t)
      const t2 = setTimeout(() => setPhase("exit"), 160)
      timersRef.current.push(t2)
      return clearTimers
    }

    const trySound = window.setTimeout(() => {
      const ok = tryPlayChime()
      if (!ok) setSoundPrompt(true)
    }, 260)
    timersRef.current.push(trySound)

    const tRelease = window.setTimeout(() => {
      releaseUi()
      setPhase("exit")
    }, RELEASE_UI_MS)
    timersRef.current.push(tRelease)

    return clearTimers
  }, [clearTimers, reducedMotion, releaseUi, tryPlayChime])

  const handleSkip = useCallback(() => {
    clearTimers()
    releaseUi()
    setPhase("exit-skip")
  }, [clearTimers, releaseUi])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") handleSkip()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleSkip])

  const exitDurationSec =
    phase === "exit-skip"
      ? EXIT_DURATION_SKIP_MS / 1000
      : reducedMotion
        ? EXIT_DURATION_REDUCED_MS / 1000
        : EXIT_DURATION_NORMAL_MS / 1000

  useEffect(() => {
    if (phase !== "exit" && phase !== "exit-skip") return undefined
    const id = window.setTimeout(finishSession, exitDurationSec * 1000 + 50)
    return () => clearTimeout(id)
  }, [phase, exitDurationSec, finishSession])

  useEffect(() => {
    return () => {
      clearTimers()
      try {
        audioCtxRef.current?.close()
      } catch {
        /* ignore */
      }
    }
  }, [clearTimers])

  const exiting = phase === "exit" || phase === "exit-skip"
  const flyLogo = phase === "exit" && !reducedMotion
  const exitReducedInner = phase === "exit" && reducedMotion

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#03050c]"
      style={{
        paddingLeft: "env(safe-area-inset-left, 0px)",
        paddingRight: "env(safe-area-inset-right, 0px)",
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
      initial={{ opacity: 1 }}
      animate={
        exiting ? { opacity: 0, scale: 1.035, filter: "blur(12px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }
      }
      transition={{ duration: exitDurationSec, ease: [0.22, 1, 0.36, 1] }}
      role="presentation"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 hero-grid opacity-25"
          initial={{ opacity: 0 }}
          animate={{ opacity: reducedMotion ? 0.18 : 0.26 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <div className="noise-overlay absolute inset-0 opacity-[0.2]" />
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-400/18 blur-[118px]" />
        <div className="absolute bottom-[-18%] right-[-8%] h-[20rem] w-[20rem] rounded-full bg-fuchsia-600/16 blur-[96px]" />
        {!reducedMotion &&
          particleConfig.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-cyan-200/45 shadow-[0_0_10px_rgba(94,234,255,0.4)]"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0.18], y: [0, -14, -4] }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
            />
          ))}
        <motion.div
          className="pointer-events-none absolute inset-y-0 left-[-45%] w-[58%] bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent skew-x-[-11deg]"
          initial={{ x: "-25%" }}
          animate={{ x: ["-25%", "240%"] }}
          transition={{ duration: 2.05, delay: 0.32, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      <button
        type="button"
        onClick={handleSkip}
        className="pointer-events-auto absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-[60] rounded-full border border-white/14 bg-slate-950/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200 backdrop-blur-md transition hover:border-cyan-300/38 hover:bg-slate-900/92 hover:text-white sm:right-6 sm:text-[13px]"
        aria-label={copy.introSkipAria}
      >
        {copy.introSkip}
      </button>

      {soundPrompt ? (
        <button
          type="button"
          onClick={handleEnableSound}
          className="pointer-events-auto absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-[60] -translate-x-1/2 rounded-full border border-cyan-400/32 bg-slate-950/88 px-5 py-2.5 text-xs font-semibold text-cyan-100 shadow-[0_0_22px_rgba(34,211,238,0.12)] backdrop-blur-md transition hover:bg-cyan-500/14 sm:text-sm"
        >
          {copy.introEnableSound}
        </button>
      ) : null}

      <div className="relative z-10 flex flex-col items-center px-6">
        <motion.div
          className="relative flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.84, filter: "blur(14px)", x: 0, y: 0 }}
          animate={
            flyLogo
              ? { x: fly.x, y: fly.y, scale: fly.scale, opacity: 0.92, filter: "blur(0px)" }
              : phase === "exit-skip"
                ? { opacity: 0, scale: 0.9, x: 0, y: 0, filter: "blur(4px)" }
                : exitReducedInner
                  ? { opacity: 0, scale: 0.97, x: 0, y: 0, filter: "blur(6px)" }
                  : {
                      opacity: 1,
                      scale: reducedMotion ? 1 : [0.84, 1.06, 1],
                      x: 0,
                      y: 0,
                      filter: reducedMotion ? "blur(0px)" : ["blur(12px)", "blur(2px)", "blur(0px)"],
                    }
          }
          transition={
            flyLogo
              ? { duration: 0.76, ease: [0.32, 0.72, 0, 1] }
              : phase === "exit-skip"
                ? { duration: 0.32, ease: "easeOut" }
                : exitReducedInner
                  ? { duration: 0.4, ease: "easeOut" }
                  : reducedMotion
                    ? { duration: 0.45, ease: "easeOut" }
                    : { duration: 1.05, times: [0, 0.55, 1], ease: "easeOut" }
          }
        >
          <div className={`relative ${fly.logoClass}`}>
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/38 blur-2xl" />
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              {!reducedMotion ? (
                <motion.div
                  className="pointer-events-none absolute inset-y-0 w-[42%] bg-gradient-to-r from-transparent via-white/32 to-transparent"
                  initial={{ x: "-130%" }}
                  animate={{ x: "230%" }}
                  transition={{ duration: 1.05, delay: 0.42, ease: "easeInOut" }}
                />
              ) : null}
            </div>
            <img
              src={logoPath}
              alt=""
              className="relative h-full w-full rounded-2xl border border-white/22 object-contain bg-slate-950/82 p-1.5 shadow-[0_0_36px_rgba(56,189,248,0.2)]"
              decoding="async"
            />
          </div>

          <motion.p
            className="mt-8 max-w-[20rem] text-center text-[11px] font-medium uppercase tracking-[0.38em] text-slate-400 sm:mt-9 sm:max-w-none sm:text-xs sm:tracking-[0.36em]"
            initial={{ opacity: 0, y: 12 }}
            animate={
              exiting ? { opacity: 0, y: -6 } : { opacity: 1, y: 0, letterSpacing: "0.36em" }
            }
            transition={
              exiting
                ? { duration: 0.28, ease: "easeOut" }
                : { delay: reducedMotion ? 0.04 : 0.72, duration: 0.85, ease: "easeOut" }
            }
          >
            {copy.introTagline}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}
