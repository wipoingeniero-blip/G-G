import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { STRINGS } from "./copy"

const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const stored = localStorage.getItem("gg-lang")
      return stored === "es" || stored === "en" ? stored : "en"
    } catch {
      return "en"
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem("gg-lang", lang)
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang === "es" ? "es" : "en-US"
  }, [lang])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      copy: STRINGS[lang],
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) {
    throw new Error("useLang must be used within LangProvider")
  }
  return ctx
}

export function LanguageToggle() {
  const { lang, setLang, copy } = useLang()

  return (
    <div
      className="relative shrink-0 rounded-full border border-cyan-400/25 bg-slate-950/70 p-1 shadow-[0_0_28px_rgba(0,240,255,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
      role="group"
      aria-label={copy.langToggleAria}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-full opacity-40"
        style={{
          background:
            "linear-gradient(120deg, rgba(0,242,255,0.12), transparent 40%, rgba(255,0,255,0.12))",
        }}
      />
      <div className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-cyan-400/50 via-fuchsia-500/40 to-cyan-400/50 opacity-60 blur-[1px]" />

      <div className="relative flex items-stretch rounded-full">
        <motion.span
          transition={{ type: "spring", stiffness: 420, damping: 32 }}
          className="absolute top-0.5 bottom-0.5 w-[calc(50%-6px)] rounded-full bg-gradient-to-r from-cyan-400/35 via-cyan-300/15 to-fuchsia-500/35 shadow-[0_0_18px_rgba(0,240,255,0.45),inset_0_0_12px_rgba(255,0,255,0.15)]"
          initial={false}
          animate={{ left: lang === "en" ? 4 : "calc(50% + 2px)" }}
        />
        {[
          { code: "en", label: "EN" },
          { code: "es", label: "ES" },
        ].map(({ code, label }) => {
          const active = lang === code
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`relative z-10 min-w-[2.65rem] rounded-full px-2.5 py-1.5 text-[10px] font-bold tracking-[0.22em] transition-colors ${
                active ? "text-white" : "text-slate-500 hover:text-slate-300"
              }`}
              aria-pressed={active}
            >
              <span className="relative">{label}</span>
              {active ? (
                <span className="absolute inset-x-1 bottom-0.5 mx-auto block h-px max-w-[1.2rem] bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
