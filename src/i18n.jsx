import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"

export const STRINGS = {
  en: {
    logoAlt: "GG Marketing & Advertising logo",
    navCta: "Book Free Strategy Call",
    heroBadge: "Serving Austin, Texas Businesses",
    heroTitle: "Austin's Premier Marketing & Advertising Agency",
    heroSub:
      "Helping Austin businesses scale through high-performance marketing, paid advertising, branding, and digital growth systems.",
    heroCta1: "Book Free Strategy Call",
    heroCta2: "View Our Services",
    dashTitle: "Growth Dashboard",
    dashLive: "Live",
    dashRoas: "Paid Media ROAS",
    dashLeads: "Leads",
    dashCpl: "CPL",
    dashPipeline: "+$420K Pipeline Influenced",
    dashStack: "Creative + Performance Stack",
    servicesTitle: "Services Built for US Market Growth",
    serviceCardDesc:
      "Strategy, creative, and execution aligned to measurable pipeline growth.",
    mrWipoTitle: "Creative spotlight: brands in motion",
    mrWipoSub:
      "Automatic carousel — Mr. WIPO 3D universe, packaging, and product shots, plus premium client identity (Auto Techs Mobile).",
    mrWipoDots: "Select spotlight visual",
    mrWipoAlts: [
      "Mr. WIPO chef mascot 3D render",
      "Mr. WIPO french fries bag mascot",
      "Mr. WIPO Ginger Power 60ml energy shot",
      "Mr. WIPO tropical fruit pouch packaging",
      "Auto Techs Mobile logo — brake specialist branding",
    ],
    services: [
      "Branding Strategy",
      "Paid Advertising",
      "Social Media Management",
      "Growth Marketing",
      "Funnel Automation",
      "Conversion-Focused Web Design",
    ],
    showcaseLabel: "Showcase",
    showcaseTitle: "Featured work",
    showcaseSub:
      "A compact carousel — campaigns, local branding, and digital pieces at a glance.",
    showcaseCta: "I want this →",
    showcasePrev: "Previous slide",
    showcaseNext: "Next slide",
    showcaseDots: "Select project",
    showcaseGoTo: "View",
    whyTitle: "Why Austin Businesses Choose Us",
    whyBody:
      "We combine strategic clarity, premium creative execution, and conversion-focused systems tailored for Austin's competitive business ecosystem. Every campaign is designed to elevate brand authority and produce measurable growth.",
    resultsTitle: "Results That Build Market Authority",
    metrics: [
      "Campaigns Managed",
      "Revenue Generated",
      "Brands Scaled",
      "Client Retention",
    ],
    localTitle: "Local SEO Focus: Austin, Texas",
    localBody:
      "GG Marketing & Advertising is a high-performance digital partner for growth-focused brands searching for a trusted marketing agency in Austin TX.",
    seoKeywords: [
      "Marketing Agency Austin TX",
      "Advertising Agency Austin",
      "Digital Marketing Austin Texas",
      "Austin Paid Ads Agency",
    ],
    testimonialsTitle: "What Clients Say",
    testimonialDots: "Go to testimonial",
    testimonials: [
      {
        author: "S. Martinez",
        quote:
          "GG Marketing transformed our lead quality in under 90 days. Their Austin market strategy felt custom-built for our business.",
        role: "Founder, Austin Home Services Brand",
      },
      {
        author: "J. Reynolds",
        quote:
          "We moved from random campaigns to a full growth system with clear ROI. They execute like a true premium partner.",
        role: "CEO, B2B Technology Company in Austin",
      },
    ],
    finalTitle: "Ready to Scale Your Austin Business?",
    finalBody:
      "Book a free strategy call with GG Marketing & Advertising and get a tailored growth roadmap for your next stage of revenue expansion.",
    finalCta: "Book Free Strategy Call",
  },
  es: {
    logoAlt: "Logo de GG Marketing & Publicidad",
    navCta: "Reservar llamada gratuita",
    heroBadge: "Atendemos negocios en Austin, Texas",
    heroTitle: "La agencia líder de marketing y publicidad en Austin",
    heroSub:
      "Impulsamos empresas en Austin con marketing de alto rendimiento, publicidad paga, branding y sistemas digitales de crecimiento.",
    heroCta1: "Reservar llamada gratuita",
    heroCta2: "Ver servicios",
    dashTitle: "Panel de crecimiento",
    dashLive: "En vivo",
    dashRoas: "ROAS en medios pagos",
    dashLeads: "Leads",
    dashCpl: "CPL",
    dashPipeline: "+$420K en pipeline influenciado",
    dashStack: "Creatividad + performance",
    servicesTitle: "Servicios para crecer en el mercado USA",
    serviceCardDesc:
      "Estrategia, creatividad y ejecución alineadas a crecimiento medible de pipeline.",
    mrWipoTitle: "Destacado creativo: marcas en movimiento",
    mrWipoSub:
      "Empaque y producto, más identidad premium para clientes.",
    mrWipoDots: "Elegir visual del destacado",
    mrWipoAlts: [
      "Mascota 3D Mr. WIPO chef",
      "Mascota bolsa de papas Mr. WIPO",
      "Energy shot Ginger Power 60 ml Mr. WIPO",
      "Empaque pouch tropical Mr. WIPO",
      "Logo Auto Techs Mobile — especialista en frenos",
    ],
    services: [
      "Estrategia de marca",
      "Publicidad paga",
      "Gestión de redes sociales",
      "Growth marketing",
      "Automatización de embudos",
      "Diseño web orientado a conversión",
    ],
    showcaseLabel: "Vitrina",
    showcaseTitle: "Trabajos destacados",
    showcaseSub:
      "Carrusel compacto: campañas, branding local y piezas digitales en un solo vistazo.",
    showcaseCta: "Quiero algo así →",
    showcasePrev: "Diapositiva anterior",
    showcaseNext: "Diapositiva siguiente",
    showcaseDots: "Seleccionar proyecto",
    showcaseGoTo: "Ver",
    whyTitle: "Por qué eligen GG en Austin",
    whyBody:
      "Unimos claridad estratégica, creatividad premium y sistemas enfocados en conversión, adaptados al ecosistema competitivo de Austin. Cada campaña eleva autoridad de marca y genera crecimiento medible.",
    resultsTitle: "Resultados que construyen autoridad",
    metrics: [
      "Campañas gestionadas",
      "Ingresos generados",
      "Marcas escaladas",
      "Retención de clientes",
    ],
    localTitle: "SEO local: Austin, Texas",
    localBody:
      "GG Marketing & Publicidad es un socio digital de alto rendimiento para marcas en crecimiento que buscan una agencia de confianza en Austin TX.",
    seoKeywords: [
      "Agencia de marketing Austin TX",
      "Agencia de publicidad Austin",
      "Marketing digital Austin Texas",
      "Agencia de anuncios pagos Austin",
    ],
    testimonialsTitle: "Lo que dicen nuestros clientes",
    testimonialDots: "Ir al testimonio",
    testimonials: [
      {
        author: "S. Martinez",
        quote:
          "GG Marketing mejoró la calidad de nuestros leads en menos de 90 días. Su estrategia para Austin se sintió hecha a medida.",
        role: "Fundador, marca de servicios para el hogar en Austin",
      },
      {
        author: "J. Reynolds",
        quote:
          "Pasamos de campañas aisladas a un sistema de crecimiento con ROI claro. Ejecutan como un socio premium de verdad.",
        role: "CEO, empresa B2B de tecnología en Austin",
      },
    ],
    finalTitle: "¿Listo para escalar tu negocio en Austin?",
    finalBody:
      "Agenda una llamada estratégica gratuita con GG Marketing & Publicidad y recibe una hoja de ruta de crecimiento para tu siguiente etapa.",
    finalCta: "Reservar llamada gratuita",
  },
}

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

const serviceIcons = ["◇", "↗", "◎", "△", "⌁", "◉"]

export function getServicesForLang(lang) {
  return STRINGS[lang].services.map((name, i) => ({ name, icon: serviceIcons[i] }))
}

const portfolioAccents = [
  "from-amber-400/25 via-transparent to-cyan-400/10",
  "from-red-500/25 via-transparent to-transparent",
  "from-yellow-400/20 via-transparent to-fuchsia-500/15",
  "from-orange-400/25 via-transparent to-cyan-400/10",
]

const portfolioCopy = {
  en: [
    { title: "Growth & Reach", tag: "Campaign · Performance" },
    { title: "Auto Techs Mobile", tag: "Austin · Local Brand" },
    { title: "Social & Content", tag: "Reels · Stories · Community" },
    { title: "Brand & Web", tag: "Identity · Digital Experience" },
  ],
  es: [
    { title: "Crecimiento y alcance", tag: "Campaña · Performance" },
    { title: "Auto Techs Mobile", tag: "Austin · Marca local" },
    { title: "Social y contenido", tag: "Reels · Historias · Comunidad" },
    { title: "Marca y web", tag: "Identidad · Experiencia digital" },
  ],
}

export function getPortfolioSlides(lang) {
  const paths = [
    "/portfolio/work-growth.png",
    "/portfolio/work-autotechs.png",
    "/portfolio/work-social.png",
    "/portfolio/work-brand-web.png",
  ]
  return paths.map((src, i) => ({
    src,
    accent: portfolioAccents[i],
    ...portfolioCopy[lang][i],
  }))
}

export function LanguageToggle() {
  const { lang, setLang } = useLang()

  return (
    <div
      className="relative shrink-0 rounded-full border border-cyan-400/25 bg-slate-950/70 p-1 shadow-[0_0_28px_rgba(0,240,255,0.18),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md"
      role="group"
      aria-label="Language"
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
