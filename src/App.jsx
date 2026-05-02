import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion"
import { Link } from "react-router-dom"
import { CinematicIntro } from "./CinematicIntro"
import { hasIntroBeenSeenThisSession } from "./introSession.js"
import { getServicesForLang, getVerticalCaseStudies } from "./copy"
import { LanguageToggle, useLang } from "./i18n"
import { STRATEGY_CONFIRM_PATH } from "./routes.js"

const logoPath = "/logo.png"

const metrics = [
  { value: 120, suffix: "+" },
  { value: 2, prefix: "$", suffix: "M+" },
  { value: 45, suffix: "+" },
  { value: 98, suffix: "%" },
]

const MR_WIPO_CAROUSEL_SRCS = [
  "/mr-wipo/chef.png",
  "/mr-wipo/fries.png",
  "/mr-wipo/ginger.png",
  "/mr-wipo/tropical.png",
  "/mr-wipo/autotechs-mobile.png",
]

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
}

const fadeStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.06 },
  },
}

const cardItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
}

function App() {
  return <AppShell />
}

function AppShell() {
  const reducedMotion = useReducedMotion()
  const { lang } = useLang()
  const [introUiReleased, setIntroUiReleased] = useState(() => hasIntroBeenSeenThisSession())
  const [showIntroLayer, setShowIntroLayer] = useState(() => !hasIntroBeenSeenThisSession())
  const onIntroReleased = useCallback(() => setIntroUiReleased(true), [])
  const onIntroExited = useCallback(() => setShowIntroLayer(false), [])

  return (
    <main className="relative overflow-x-hidden px-4 pb-[max(6rem,env(safe-area-inset-bottom,0px))] pt-[max(0px,env(safe-area-inset-top,0px))] text-slate-100 sm:px-6 lg:px-10">
      <AmbientBackground reducedMotion={reducedMotion} />
      {showIntroLayer ? (
        <CinematicIntro
          onReleased={onIntroReleased}
          onExited={onIntroExited}
          reducedMotionPref={reducedMotion}
        />
      ) : null}
      <div
        className="mx-auto w-full max-w-6xl"
        style={{ pointerEvents: introUiReleased ? "auto" : "none" }}
      >
        <Navbar introReleased={introUiReleased} />
        <Hero reducedMotion={reducedMotion} introReleased={introUiReleased} />
        <IcSegments key={`icp-${lang}`} reducedMotion={reducedMotion} />
        <Services />
        <ServicesSpotlightCarousel key={`services-spotlight-${lang}`} reducedMotion={reducedMotion} />
        <ShowcaseVitrine key={`showcase-${lang}`} reducedMotion={reducedMotion} />
        <WhyChooseUs />
        <Results />
        <LocalSEO />
        <Testimonials key={`testimonials-${lang}`} reducedMotion={reducedMotion} />
        <FinalCTA />
        <SiteFooter />
      </div>
    </main>
  )
}

function AmbientBackground({ reducedMotion }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        left: `${(i * 11 + 7) % 100}%`,
        size: 4 + (i % 5) * 2,
        delay: i * 0.24,
        duration: 7 + (i % 4) * 1.8,
      })),
    [],
  )

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-56 left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-400/25 blur-[145px]" />
      <div className="absolute right-[-15%] top-[22%] h-[24rem] w-[24rem] rounded-full bg-fuchsia-500/22 blur-[130px]" />
      <div className="hero-grid absolute inset-0 opacity-35" />
      <div className="noise-overlay absolute inset-0 opacity-30" />
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-cyan-200/75 shadow-[0_0_20px_rgba(82,232,255,0.8)]"
          style={{
            left: particle.left,
            width: particle.size,
            height: particle.size,
          }}
          initial={{ y: "102vh", opacity: 0 }}
          animate={
            reducedMotion
              ? { opacity: 0.35 }
              : {
                  y: "-8vh",
                  opacity: [0, 0.55, 0],
                }
          }
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}

function LogoMark({ className = "h-11 w-11" }) {
  const { copy } = useLang()
  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 rounded-xl bg-cyan-400/35 blur-xl" />
      <img
        src={logoPath}
        alt={copy.logoAlt}
        className="relative h-full w-full rounded-xl border border-white/20 object-contain bg-slate-950/70 p-1"
      />
    </div>
  )
}

function Navbar({ introReleased }) {
  const { copy } = useLang()
  return (
    <motion.header
      initial={false}
      animate={{
        opacity: introReleased ? 1 : 0,
        y: introReleased ? 0 : -12,
      }}
      transition={{ duration: 0.68, ease: "easeOut" }}
      style={{ pointerEvents: introReleased ? "auto" : "none" }}
      className="sticky z-40 mt-4 top-[max(1rem,env(safe-area-inset-top,0px))]"
    >
      <nav className="section-shell gradient-border flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3 sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <LogoMark />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
              {copy.navBrandName}
            </p>
            <p className="text-xs text-slate-300">{copy.navBrandLocation}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageToggle />
          <a
            href="#contact"
            className="rounded-lg border border-cyan-300/45 px-2 py-2 text-center text-[10px] font-semibold leading-tight text-cyan-100 transition hover:bg-cyan-300/15 min-[400px]:px-3 min-[400px]:text-xs sm:px-4 sm:text-sm"
          >
            {copy.navCta}
          </a>
        </div>
      </nav>
    </motion.header>
  )
}

function Hero({ reducedMotion, introReleased }) {
  const { copy } = useLang()
  const yMotion = useMotionValue(0)
  const springY = useSpring(yMotion, { stiffness: 80, damping: 20, mass: 0.5 })
  const floatA = useTransform(springY, [-80, 80], [10, -10])
  const floatB = useTransform(springY, [-80, 80], [-6, 14])

  useEffect(() => {
    if (reducedMotion) return undefined
    const onMove = (event) => {
      const middle = window.innerHeight / 2
      yMotion.set((event.clientY - middle) * 0.12)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [reducedMotion, yMotion])

  return (
    <motion.section
      initial={false}
      animate={{
        opacity: introReleased ? 1 : 0,
        y: introReleased ? 0 : 22,
      }}
      transition={{ duration: 0.85, ease: "easeOut", delay: introReleased ? 0.06 : 0 }}
      className="pt-18"
      style={{ pointerEvents: introReleased ? "auto" : "none" }}
    >
      <div className="section-shell gradient-border relative overflow-hidden rounded-3xl px-4 py-10 text-left sm:px-6 sm:py-12 md:px-12 md:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,rgba(95,235,255,0.2),transparent_40%),radial-gradient(circle_at_85%_40%,rgba(219,76,255,0.18),transparent_44%)]" />
        <div className="section-divider absolute inset-x-0 top-0 h-px" />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-flex rounded-full border border-fuchsia-300/40 bg-fuchsia-400/10 px-4 py-1 text-xs font-semibold tracking-[0.16em] text-fuchsia-100">
              {copy.heroBadge}
            </span>
            <h1 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {copy.heroTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
              {copy.heroSub}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#contact" className="premium-button">
                <span>{copy.heroCta1}</span>
              </a>
              <a
                href="#work"
                className="group rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:border-cyan-200/80 hover:bg-cyan-400/8"
              >
                <span className="inline-flex items-center gap-2">
                  {copy.heroCta2}
                  <span className="transition group-hover:translate-x-1">→</span>
                </span>
              </a>
            </div>
          </div>
          <motion.div style={{ y: floatA }} className="relative">
            <HeroVisual reducedMotion={reducedMotion} floatB={floatB} />
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

function HeroVisual({ reducedMotion, floatB }) {
  const { copy } = useLang()
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -inset-8 rounded-[2rem] bg-cyan-400/18 blur-3xl" />
      <motion.div
        className="relative rounded-2xl border border-white/18 bg-slate-950/65 p-4 shadow-[0_0_48px_rgba(29,198,255,0.28)] backdrop-blur-xl"
        animate={
          reducedMotion ? {} : { y: [0, -10, 0], rotateX: [0, 1.2, 0], rotateY: [0, -1.2, 0] }
        }
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="mb-3 flex items-center justify-between border-b border-white/12 pb-3">
          <p className="text-xs uppercase tracking-[0.16em] text-cyan-100">{copy.dashTitle}</p>
          <p className="rounded-full bg-emerald-400/20 px-2 py-1 text-[11px] text-emerald-200">{copy.dashLive}</p>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-white/6 p-3">
            <p className="text-xs text-slate-400">{copy.dashRoas}</p>
            <p className="mt-1 text-2xl font-semibold text-cyan-200">4.8x</p>
            <div className="mt-2 h-2 rounded-full bg-slate-900">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500"
                initial={{ width: "0%" }}
                whileInView={{ width: "78%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, delay: 0.1 }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/6 p-3">
              <p className="text-xs text-slate-400">{copy.dashLeads}</p>
              <p className="mt-1 text-lg font-semibold text-slate-100">+184%</p>
            </div>
            <div className="rounded-xl bg-white/6 p-3">
              <p className="text-xs text-slate-400">{copy.dashCpl}</p>
              <p className="mt-1 text-lg font-semibold text-slate-100">-36%</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ y: floatB }}
        className="absolute -right-7 -top-6 hidden rounded-xl border border-fuchsia-300/30 bg-fuchsia-400/15 px-4 py-3 text-sm text-fuchsia-100 shadow-[0_0_35px_rgba(229,92,255,0.25)] md:block"
      >
        {copy.dashPipeline}
      </motion.div>
      <motion.div
        initial={{ opacity: 0.8 }}
        animate={reducedMotion ? {} : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-8 left-8 hidden rounded-xl border border-cyan-300/30 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100 md:block"
      >
        {copy.dashStack}
      </motion.div>
    </div>
  )
}

function IcSegments({ reducedMotion }) {
  const { copy } = useLang()
  const segments = copy.icpSegments
  return (
    <motion.section
      id="segments"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="pt-20"
      aria-labelledby="icp-heading"
    >
      <h2 id="icp-heading" className="text-2xl font-semibold sm:text-3xl">
        {copy.icpTitle}
      </h2>
      <motion.div
        variants={fadeStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        className="mt-8 grid gap-4 sm:grid-cols-2"
      >
        {segments.map((segment) => (
          <motion.div
            key={segment.title}
            variants={cardItem}
            whileHover={reducedMotion ? {} : { y: -6 }}
            className="section-shell relative overflow-hidden rounded-2xl border border-white/10 p-5 sm:p-6"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/50 to-transparent opacity-90" />
            <h3 className="text-lg font-semibold text-slate-100">{segment.title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {segment.bullets.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-0.5 shrink-0 text-cyan-300/90">→</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

function Services() {
  const { lang, copy } = useLang()
  const servicesList = useMemo(() => getServicesForLang(lang), [lang])
  return (
    <motion.section
      key={`services-block-${lang}`}
      id="services"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="pt-20"
    >
      <h2 className="text-2xl font-semibold sm:text-3xl">{copy.servicesTitle}</h2>
      <motion.div
        variants={fadeStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        className="mt-8 grid gap-4 md:grid-cols-2"
      >
        {servicesList.map((service) => (
          <motion.div
            key={service.name}
            variants={cardItem}
            whileHover={{ y: -8, scale: 1.015 }}
            className="service-card section-shell group relative overflow-hidden rounded-xl p-5"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent opacity-80" />
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-200/30 bg-cyan-200/8 text-cyan-100 transition group-hover:scale-110 group-hover:border-cyan-200/80">
              {service.icon}
            </div>
            <p className="font-medium text-slate-100">{service.name}</p>
            <p className="mt-3 text-sm text-slate-400">{service.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

function ServicesSpotlightCarousel({ reducedMotion }) {
  const { copy } = useLang()
  const slides = useMemo(
    () =>
      MR_WIPO_CAROUSEL_SRCS.map((src, idx) => ({
        src,
        alt: copy.mrWipoAlts[idx] ?? copy.mrWipoAltFallback,
      })),
    [copy],
  )
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return undefined
    const id = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, 4500)
    return () => clearInterval(id)
  }, [paused, slides.length])

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="pt-10"
      aria-labelledby="services-spotlight-heading"
    >
      <div className="section-divider mb-6 h-px w-full max-w-3xl opacity-70" />
      <h3 id="services-spotlight-heading" className="text-lg font-semibold text-slate-100 md:text-xl">
        {copy.mrWipoTitle}
      </h3>
      <p className="mt-2 max-w-3xl text-sm text-slate-400 md:text-base">{copy.mrWipoSub}</p>

      <div
        className="relative mt-6 overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-b from-slate-950/90 to-black/90 shadow-[0_0_40px_rgba(0,240,255,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="pointer-events-none absolute -left-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-fuchsia-500/12 blur-3xl" />
        <div className="relative overflow-hidden rounded-2xl">
          <motion.div
            className="flex"
            animate={{ x: `-${active * 100}%` }}
            transition={{ duration: reducedMotion ? 0 : 0.55, ease: [0.32, 0.72, 0, 1] }}
          >
            {slides.map((item, idx) => (
              <div
                key={item.src}
                className="flex min-w-full shrink-0 items-center justify-center bg-black/30 px-4 py-5 md:px-8 md:py-8"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="max-h-[200px] w-auto max-w-full object-contain object-center md:max-h-[260px]"
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </motion.div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
      </div>

      <div
        className="mt-4 flex justify-center gap-1.5"
        role="tablist"
        aria-label={copy.mrWipoDots}
      >
        {slides.map((item, idx) => (
          <button
            key={`${item.src}-dot`}
            type="button"
            role="tab"
            aria-selected={idx === active}
            onClick={() => setActive(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === active ? "w-7 bg-cyan-200" : "w-2 bg-white/25 hover:bg-white/40"
            }`}
            aria-label={item.alt}
          />
        ))}
      </div>
    </motion.section>
  )
}

function ShowcaseVitrine({ reducedMotion }) {
  const { lang, copy } = useLang()
  const verticalCases = useMemo(() => getVerticalCaseStudies(lang), [lang])

  return (
    <motion.section
      id="work"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="pt-16"
      aria-labelledby="showcase-heading"
    >
      <div className="section-divider mb-8 h-px w-full opacity-80" />
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100">
          {copy.showcaseLabel}
        </span>
        <h2 id="showcase-heading" className="mt-3 text-2xl font-semibold md:text-3xl">
          {copy.showcaseTitle}
        </h2>
        <p className="mt-2 max-w-md text-sm text-slate-400 md:text-base">{copy.showcaseSub}</p>
        <a
          href="#contact"
          className="mt-4 inline-flex items-center justify-center rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-100 transition hover:border-cyan-200/50 hover:bg-cyan-400/10 md:text-sm"
        >
          {copy.showcaseCta}
        </a>
      </div>

      <motion.div
        variants={fadeStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto mt-10 grid max-w-5xl gap-5 sm:grid-cols-2"
      >
        {verticalCases.map((work, index) => (
          <motion.article
            key={`${work.verticalHeading}-${work.src}`}
            variants={cardItem}
            whileHover={reducedMotion ? {} : { y: -4 }}
            className="section-shell gradient-border group relative overflow-hidden rounded-2xl p-4 shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
          >
            <div
              className={`pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br ${work.accent} opacity-75`}
            />
            <div className="relative z-10 flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-100/95">
                {work.verticalHeading}
              </p>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100/90 md:text-xs">
                  {work.tag}
                </p>
                <h3 className="text-base font-semibold text-white md:text-lg">{work.title}</h3>
              </div>
              <div className="relative flex aspect-[4/3] w-full max-h-[200px] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/50 md:max-h-[220px]">
                <img
                  src={work.src}
                  alt={`${work.verticalHeading}: ${work.title}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="max-h-full max-w-full object-contain object-center transition duration-500 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent" />
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </motion.section>
  )
}

function WhyChooseUs() {
  const { copy } = useLang()
  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="pt-20"
    >
      <div className="section-shell rounded-2xl px-5 py-8 sm:p-8 md:p-10">
        <h2 className="text-2xl font-semibold sm:text-3xl">{copy.whyTitle}</h2>
        <p className="mt-4 max-w-3xl text-slate-300">{copy.whyBody}</p>
      </div>
    </motion.section>
  )
}

function Results() {
  const { copy, lang } = useLang()
  return (
    <motion.section
      key={`results-block-${lang}`}
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="pt-20"
    >
      <h2 className="text-2xl font-semibold sm:text-3xl">{copy.resultsTitle}</h2>
      <motion.div
        variants={fadeStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-120px" }}
        className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        {metrics.map((item, idx) => (
          <motion.div
            key={`metric-${idx}-${lang}`}
            variants={cardItem}
            whileHover={{ y: -6 }}
            className="section-shell relative overflow-hidden rounded-xl p-6 text-center transition hover:border-fuchsia-300/45"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-300/80 to-transparent" />
            <AnimatedMetric value={item.value} prefix={item.prefix} suffix={item.suffix} />
            <p className="mt-2 text-sm uppercase tracking-[0.1em] text-slate-300">
              {copy.metrics[idx]}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  )
}

function AnimatedMetric({ value, prefix = "", suffix = "" }) {
  const ref = useMotionValue(0)
  const [display, setDisplay] = useState(0)
  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true, margin: "-120px" })

  useEffect(() => {
    if (!inView) return undefined
    const controls = animate(ref, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(latest),
    })
    return () => controls.stop()
  }, [inView, ref, value])

  return (
    <p ref={containerRef} className="text-2xl font-semibold text-cyan-200 sm:text-3xl">
      {prefix}
      {Math.round(display)}
      {suffix}
    </p>
  )
}

function LocalSEO() {
  const { copy } = useLang()
  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="pt-20"
    >
      <div className="section-shell rounded-2xl px-5 py-8 sm:p-8">
        <h2 className="text-2xl font-semibold sm:text-3xl">{copy.localTitle}</h2>
        <p className="mt-4 text-slate-300">{copy.localBody}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {copy.seoKeywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full border border-cyan-300/45 bg-cyan-300/8 px-4 py-1 text-sm text-cyan-100"
            >
              {keyword}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function Testimonials({ reducedMotion }) {
  const { copy } = useLang()
  const [index, setIndex] = useState(0)
  const list = copy.testimonials

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length)
    }, 4600)
    return () => clearInterval(timer)
  }, [list.length])

  return (
    <motion.section
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="pt-20"
    >
      <h2 className="text-2xl font-semibold sm:text-3xl">{copy.testimonialsTitle}</h2>
      <div className="section-shell mt-8 overflow-hidden rounded-2xl p-3 md:p-4">
        <motion.div
          className="flex w-full"
          animate={{ x: `-${index * 100}%` }}
          transition={{ duration: reducedMotion ? 0 : 0.65, ease: "easeInOut" }}
        >
          {list.map((item) => (
            <figure
              key={item.author}
              className="testimonial-slide min-w-full shrink-0 rounded-xl border border-white/12 bg-white/4 p-4 sm:p-6"
            >
              <blockquote className="text-base leading-relaxed text-slate-200 sm:text-lg">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-sm text-slate-400">
                <span className="font-semibold text-slate-200">{item.author}</span> -{" "}
                {item.role}
              </figcaption>
            </figure>
          ))}
        </motion.div>
        <div className="mt-4 flex justify-center gap-2">
          {list.map((item, dotIndex) => (
            <button
              key={item.author}
              type="button"
              onClick={() => setIndex(dotIndex)}
              className={`h-2.5 rounded-full transition ${
                index === dotIndex ? "w-7 bg-cyan-200" : "w-2.5 bg-white/30"
              }`}
              aria-label={`${copy.testimonialDots} ${dotIndex + 1}`}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}

function SiteFooter() {
  const { copy } = useLang()
  return (
    <footer className="mt-20 border-t border-white/10 pt-10 pb-2">
      <p className="text-center text-[11px] font-medium tracking-wide text-slate-500 sm:text-xs">
        {copy.footerCopyright}
      </p>
    </footer>
  )
}

function FinalCTA() {
  const { copy } = useLang()
  return (
    <motion.section
      id="contact"
      variants={reveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="pt-20"
    >
      <div className="section-shell gradient-border rounded-3xl px-5 py-10 text-center sm:px-8 sm:py-14">
        <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">{copy.finalTitle}</h2>
        {copy.finalBody ? (
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">{copy.finalBody}</p>
        ) : null}
        <Link
          to={STRATEGY_CONFIRM_PATH}
          className="mt-8 inline-flex rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-7 py-3 font-semibold text-slate-950 transition hover:brightness-110"
        >
          {copy.finalCta}
        </Link>
      </div>
    </motion.section>
  )
}

export default App
