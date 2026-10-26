/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

/* ============================================================================
   i18n — lightweight localization context for the OBM site and admin system.
   Supports three languages: English (en), Amharic (am), Oromo (om).
   Translation files are split per-page under en/, am/, om/ subdirectories.
   Use `useTranslation()` to get the `t()` function in any component.
   ========================================================================== */

export type Locale = 'en' | 'am' | 'om'

const STORAGE_KEY = 'obm-locale'

// --- Import all English namespace files ---
import enCommon from './en/common.json'
import enHome from './en/home.json'
import enAbout from './en/about.json'
import enServices from './en/services.json'
import enProjects from './en/projects.json'
import enCareers from './en/careers.json'
import enContact from './en/contact.json'
import enNotFound from './en/notFound.json'
import enRequestQuote from './en/requestQuote.json'
import enAdminCommon from './en/admin/common.json'
import enAdminLogin from './en/admin/login.json'
import enAdminDashboard from './en/admin/dashboard.json'
import enAdminSettings from './en/admin/settings.json'
import enAdminProjects from './en/admin/projects.json'
import enAdminServices from './en/admin/services.json'
import enAdminTestimonials from './en/admin/testimonials.json'
import enAdminContacts from './en/admin/contacts.json'
import enAdminCareers from './en/admin/careers.json'
import enAdminApplications from './en/admin/applications.json'
import enAdminHomeStats from './en/admin/homeStats.json'
import enAdminAbout from './en/admin/about.json'
import enAdminContactInfo from './en/admin/contactInfo.json'
import enAdminData from './en/admin/data.json'
import enAdminInquiries from './en/admin/inquiries.json'

// --- Import all Amharic namespace files ---
import amCommon from './am/common.json'
import amHome from './am/home.json'
import amAbout from './am/about.json'
import amServices from './am/services.json'
import amProjects from './am/projects.json'
import amCareers from './am/careers.json'
import amContact from './am/contact.json'
import amNotFound from './am/notFound.json'
import amRequestQuote from './am/requestQuote.json'
import amAdminCommon from './am/admin/common.json'
import amAdminLogin from './am/admin/login.json'
import amAdminDashboard from './am/admin/dashboard.json'
import amAdminSettings from './am/admin/settings.json'
import amAdminProjects from './am/admin/projects.json'
import amAdminServices from './am/admin/services.json'
import amAdminTestimonials from './am/admin/testimonials.json'
import amAdminContacts from './am/admin/contacts.json'
import amAdminCareers from './am/admin/careers.json'
import amAdminApplications from './am/admin/applications.json'
import amAdminHomeStats from './am/admin/homeStats.json'
import amAdminAbout from './am/admin/about.json'
import amAdminContactInfo from './am/admin/contactInfo.json'
import amAdminData from './am/admin/data.json'
import amAdminInquiries from './am/admin/inquiries.json'

// --- Import all Oromo namespace files ---
import omCommon from './om/common.json'
import omHome from './om/home.json'
import omAbout from './om/about.json'
import omServices from './om/services.json'
import omProjects from './om/projects.json'
import omCareers from './om/careers.json'
import omContact from './om/contact.json'
import omNotFound from './om/notFound.json'
import omRequestQuote from './om/requestQuote.json'
import omAdminCommon from './om/admin/common.json'
import omAdminLogin from './om/admin/login.json'
import omAdminDashboard from './om/admin/dashboard.json'
import omAdminSettings from './om/admin/settings.json'
import omAdminProjects from './om/admin/projects.json'
import omAdminServices from './om/admin/services.json'
import omAdminTestimonials from './om/admin/testimonials.json'
import omAdminContacts from './om/admin/contacts.json'
import omAdminCareers from './om/admin/careers.json'
import omAdminApplications from './om/admin/applications.json'
import omAdminHomeStats from './om/admin/homeStats.json'
import omAdminAbout from './om/admin/about.json'
import omAdminContactInfo from './om/admin/contactInfo.json'
import omAdminData from './om/admin/data.json'
import omAdminInquiries from './om/admin/inquiries.json'

// Deep-merge helper: recursively merges source into target
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target }
  for (const key of Object.keys(source)) {
    if (
      result[key] &&
      typeof result[key] === 'object' &&
      !Array.isArray(result[key]) &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      )
    } else {
      result[key] = source[key]
    }
  }
  return result
}

// Hero section translations — inlined to ensure they are always bundled correctly
const heroOverrides: Record<string, Record<string, Record<string, string>>> = {
  en: {
    home: {
      heroEyebrow: 'General Contractor • Engineering & Infrastructure',
      heroTitleLine1: 'OBM – We Build Strong,',
      heroTitleLine2: 'Finish with Quality,',
      heroTitleLine3: 'and Deliver Lasting Results',
    },
  },
  am: {
    home: {
      heroEyebrow: 'ዋና ተቋራጭ • ምህንድስና እና መሰረተ ልማት',
      heroTitleLine1: 'OBM – በኃይሎ እንገናኝ፣',
      heroTitleLine2: 'በጥራት የሚጠናቀቅ፣',
      heroTitleLine3: 'የሚቀጥሉ ውጤቶችንም እንሰጣለን።',
    },
  },
  om: {
    home: {
      heroEyebrow: 'Kontaaktara Waliigalaa • Injinariingii & Bu’uura Misoomaa',
      heroTitleLine1: 'OBM – Nii humna dhabeessa,',
      heroTitleLine2: 'Qulqullina dhaabbata,',
      heroTitleLine3: 'Natiifama dhaabbata dhiheessuu.',
    },
  },
}

// Merge all namespace files for a locale into a single flat-ish object
function buildLocaleTranslations(
  locale: string,
  ...records: Record<string, unknown>[]
): Record<string, unknown> {
  let merged: Record<string, unknown> = {}
  for (const rec of records) {
    merged = deepMerge(merged, rec)
  }
  // Apply inlined hero overrides last so they always win
  if (heroOverrides[locale]) {
    merged = deepMerge(merged, heroOverrides[locale] as Record<string, unknown>)
  }
  return merged
}

const translations: Record<Locale, Record<string, unknown>> = {
  en: buildLocaleTranslations(
    'en',
    enCommon, enHome, enAbout, enServices, enProjects,
    enCareers, enContact, enNotFound,
    enAdminCommon, enAdminLogin, enAdminDashboard, enAdminSettings,
    enAdminProjects, enAdminServices, enAdminTestimonials, enAdminContacts,
    enAdminCareers, enAdminApplications, enAdminHomeStats, enAdminAbout, enAdminContactInfo,
    enAdminData, enAdminInquiries, enRequestQuote,
  ),
  am: buildLocaleTranslations(
    'am',
    amCommon, amHome, amAbout, amServices, amProjects,
    amCareers, amContact, amNotFound,
    amAdminCommon, amAdminLogin, amAdminDashboard, amAdminSettings,
    amAdminProjects, amAdminServices, amAdminTestimonials, amAdminContacts,
    amAdminCareers, amAdminApplications, amAdminHomeStats, amAdminAbout, amAdminContactInfo,
    amAdminData, amAdminInquiries, amRequestQuote,
  ),
  om: buildLocaleTranslations(
    'om',
    omCommon, omHome, omAbout, omServices, omProjects,
    omCareers, omContact, omNotFound,
    omAdminCommon, omAdminLogin, omAdminDashboard, omAdminSettings,
    omAdminProjects, omAdminServices, omAdminTestimonials, omAdminContacts,
    omAdminCareers, omAdminApplications, omAdminHomeStats, omAdminAbout, omAdminContactInfo,
    omAdminData, omAdminInquiries, omRequestQuote,
  ),
}

const localeLabels: Record<Locale, string> = {
  en: 'English',
  am: 'አማርኛ',
  om: 'Afaan Oromoo',
}

interface I18nState {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, params?: Record<string, string | number>) => string
  localeLabel: string
}

const I18nContext = createContext<I18nState | undefined>(undefined)

function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'am' || stored === 'om') return stored
  } catch {
    // SSR or private browsing
  }
  return 'en'
}

function resolve(obj: unknown, path: string): string | undefined {
  const parts = path.split('.')
  let current: unknown = obj
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object')
      return undefined
    current = (current as Record<string, unknown>)[part]
  }
  return typeof current === 'string' ? current : undefined
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {
      // ignore
    }
  }, [])

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const value = resolve(translations[locale], key) ?? resolve(translations.en, key) ?? key
      if (!params) return value
      return Object.entries(params).reduce<string>(
        (result, [k, v]) => result.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v)),
        value,
      )
    },
    [locale],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t, localeLabel: localeLabels[locale] }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation(): I18nState {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within a LanguageProvider')
  return ctx
}

export const availableLocales: Locale[] = ['en', 'am', 'om']
export const localeLabelsMap = localeLabels
