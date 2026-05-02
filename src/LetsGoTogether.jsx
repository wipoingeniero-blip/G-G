import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"

const FORMSUBMIT_ACTION = "https://formsubmit.co/administrator@gygdigitalmarketing.com"

export default function LetsGoTogether() {
  const homeUrl = useMemo(() => {
    if (typeof window === "undefined") return "https://ggmarketingaustin.com/"
    const { protocol, host } = window.location
    if (!host) return "https://ggmarketingaustin.com/"
    return `${protocol}//${host}/`
  }, [])

  const formPageUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.href.split("#")[0]
  }, [])

  useEffect(() => {
    const prevTitle = document.title
    document.title = "Let's go together | G&G"
    const meta = document.createElement("meta")
    meta.setAttribute("name", "robots")
    meta.setAttribute("content", "noindex, nofollow")
    document.head.appendChild(meta)
    return () => {
      document.title = prevTitle
      meta.remove()
    }
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-hidden px-4 py-12 text-slate-100 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-cyan-400/20 blur-[120px]" />
        <div className="absolute right-[-20%] top-[20%] h-[20rem] w-[20rem] rounded-full bg-fuchsia-500/18 blur-[100px]" />
        <div className="noise-overlay absolute inset-0 opacity-25" />
      </div>

      <div className="mx-auto w-full max-w-lg">
        <Link
          to="/"
          className="inline-flex text-sm font-medium text-cyan-200/90 transition hover:text-cyan-100"
        >
          ← Home
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mt-10"
        >
          <img
            src="/logo.png"
            alt="G&G Marketing & Advertising"
            className="h-14 w-14 rounded-xl border border-white/15 object-contain bg-slate-950/70 p-1"
          />
          <h1 className="mt-8 text-2xl font-semibold leading-snug tracking-tight text-white sm:text-3xl">
            Your competition focuses on the present. We design the future.
          </h1>
          <p className="mt-4 text-sm text-slate-400">
            Tell us how we can help. This form sends your message directly to our team.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
          className="section-shell gradient-border mt-10 rounded-2xl p-6 sm:p-8"
        >
          <form action={FORMSUBMIT_ACTION} method="POST" className="space-y-5">
            <input type="hidden" name="_subject" value="G&G — Let's go together (strategy page)" />
            <input type="hidden" name="_next" value={homeUrl} />
            <input type="hidden" name="_template" value="table" />
            {formPageUrl ? <input type="hidden" name="_url" value={formPageUrl} /> : null}

            <div>
              <label htmlFor="lgt-name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Name
              </label>
              <input
                id="lgt-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="mt-2 w-full rounded-lg border border-white/12 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="lgt-email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email
              </label>
              <input
                id="lgt-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-2 w-full rounded-lg border border-white/12 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label htmlFor="lgt-phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Phone <span className="font-normal normal-case text-slate-500">(optional)</span>
              </label>
              <input
                id="lgt-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                className="mt-2 w-full rounded-lg border border-white/12 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2"
                placeholder="+1 …"
              />
            </div>

            <div>
              <label htmlFor="lgt-message" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Message
              </label>
              <textarea
                id="lgt-message"
                name="message"
                required
                rows={5}
                className="mt-2 w-full resize-y rounded-lg border border-white/12 bg-slate-950/60 px-3 py-2.5 text-slate-100 outline-none ring-cyan-400/40 placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2"
                placeholder="Goals, timeline, or questions…"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
            >
              Send message
            </button>

            <p className="text-center text-[11px] leading-relaxed text-slate-500">
              Delivered to{" "}
              <span className="text-slate-400">administrator@gygdigitalmarketing.com</span>. The first time
              you use FormSubmit, check that inbox to activate delivery if prompted.
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  )
}
