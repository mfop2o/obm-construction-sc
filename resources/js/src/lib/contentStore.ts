import { useSyncExternalStore } from 'react'
import { http } from './api'

/* ============================================================================
   contentStore — API-backed content store for every dynamic website section.
   Mirrors the projectsStore pattern: items are fetched from the Laravel API
   once at module load, cached in-memory, and re-rendered via
   useSyncExternalStore. Every admin mutation calls the API then refreshes.

   Sections: testimonials, contact settings + offices, services, careers
   (openings/values/benefits), home stats, and about (mission/vision/values/
   milestones). All writes are Sanctum-protected.
   ========================================================================== */

type Listener = () => void

interface Testimonial {
  id: number
  quote: string
  name: string
  role: string | null
  company: string | null
  featured: boolean
  sort_order: number
}

interface Office {
  id: number
  name: string
  address: string | null
  city: string | null
  phone: string | null
  email: string | null
  sort_order: number
}

interface ContactData {
  settings: {
    id: number
    phone: string
    email: string
    address_line_1: string
    address_line_2: string | null
  }
  offices: Office[]
}

export interface ServiceItem {
  id: number
  title: string
  description: string
  overview: string
  /** The ProjectVisual key (e.g. 'facade', 'crane', 'road') shown on cards. */
  image: string
  /** Key into the serviceImages photo registry (e.g. 'building', 'roads'). */
  image_key: string | null
  capabilities: string[]
  sort_order: number
}

interface CareersData {
  openings: Array<{
    id: number
    title: string
    department: string | null
    location: string | null
    type: string
    blurb: string | null
    sort_order: number
  }>
  values: Array<{ id: number; title: string; text: string; sort_order: number }>
  benefits: Array<{ id: number; text: string; sort_order: number }>
}

interface HomeStat {
  id: number
  label: string
  value: number
  suffix: string | null
  sort_order: number
}

interface AboutData {
  settings: { id: number; mission: string; vision: string }
  values: Array<{ id: number; title: string; description: string; sort_order: number }>
  milestones: Array<{ id: number; year: string; title: string; description: string | null; sort_order: number }>
}

const listeners = new Set<Listener>()

let testimonials: Testimonial[] = []
let contactData: ContactData = { settings: { id: 0, phone: '', email: '', address_line_1: '', address_line_2: '' }, offices: [] }
let services: ServiceItem[] = []
let careersData: CareersData = { openings: [], values: [], benefits: [] }
let stats: HomeStat[] = []
let aboutData: AboutData = { settings: { id: 0, mission: '', vision: '' }, values: [], milestones: [] }
let ready = false

function emit() {
  listeners.forEach((l) => l())
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/* ---- Read helpers ---- */

export function useTestimonials(): Testimonial[] {
  useSyncExternalStore(subscribe, () => testimonials)
  return testimonials
}

export function useContactData(): ContactData {
  useSyncExternalStore(subscribe, () => contactData)
  return contactData
}

export function useServices(): ServiceItem[] {
  useSyncExternalStore(subscribe, () => services)
  return services
}

export function useCareersData(): CareersData {
  useSyncExternalStore(subscribe, () => careersData)
  return careersData
}

export function useHomeStats(): HomeStat[] {
  useSyncExternalStore(subscribe, () => stats)
  return stats
}

export function useAboutData(): AboutData {
  useSyncExternalStore(subscribe, () => aboutData)
  return aboutData
}

export function useContentReady(): boolean {
  useSyncExternalStore(subscribe, () => ready)
  return ready
}

export interface ContactSubmission {
  id: number
  name: string
  email: string
  phone: string | null
  project_type: string | null
  message: string
  read: boolean
  created_at: string
}

let contacts: ContactSubmission[] = []
let contactsReady = false
const contactListeners = new Set<Listener>()

function emitContacts() {
  contactListeners.forEach((l) => l())
}

function subscribeContacts(listener: Listener): () => void {
  contactListeners.add(listener)
  return () => contactListeners.delete(listener)
}

async function refreshContacts() {
  try {
    const res = await http.get<{ data: ContactSubmission[] }>('/api/contacts')
    contacts = res.data.data ?? []
    contactsReady = true
  } catch {
    contacts = []
    contactsReady = true
  }
  emitContacts()
}

export function useContacts(): ContactSubmission[] {
  useSyncExternalStore(subscribeContacts, () => contacts)
  return contacts
}

export function useContactsReady(): boolean {
  useSyncExternalStore(subscribeContacts, () => contactsReady)
  return contactsReady
}

export function refreshContactsSync(): void {
  void refreshContacts()
}

/* ---- Module load: fetch everything ---- */

async function refreshAll() {
  try {
    const [t, c, s, careers, st, about] = await Promise.all([
      http.get<{ data: Testimonial[] }>('/api/testimonials'),
      http.get<{ data: ContactData }>('/api/contact-settings'),
      http.get<{ data: Service[] }>('/api/services'),
      http.get<{ data: CareersData }>('/api/careers'),
      http.get<{ data: HomeStat[] }>('/api/home-stats'),
      http.get<{ data: AboutData }>('/api/about'),
    ])
    testimonials = t.data.data ?? []
    contactData = c.data.data ?? contactData
    services = s.data.data ?? []
    careersData = careers.data.data ?? careersData
    stats = st.data.data ?? []
    aboutData = about.data.data ?? aboutData
  } catch {
    // Keep last known values on failure.
  }
  ready = true
  emit()
}

void refreshAll()

/* ---- Public: contact form submission ---- */

export async function submitContact(input: {
  name: string
  email: string
  phone?: string
  project_type?: string
  message: string
}): Promise<void> {
  await http.post('/api/contacts', input)
}

/* ---- Admin mutations ---- */

export async function createTestimonial(
  input: Partial<Omit<Testimonial, 'id' | 'sort_order'>>,
): Promise<void> {
  await http.post('/api/testimonials', input)
  await refreshAll()
}

export async function updateTestimonial(
  id: number,
  input: Partial<Omit<Testimonial, 'id' | 'sort_order'>>,
): Promise<void> {
  await http.put(`/api/testimonials/${id}`, input)
  await refreshAll()
}

export async function deleteTestimonial(id: number): Promise<void> {
  await http.delete(`/api/testimonials/${id}`)
  await refreshAll()
}

export async function updateContactSettings(input: {
  phone: string
  email: string
  address_line_1: string
  address_line_2: string
}): Promise<void> {
  await http.put('/api/contact-settings', input)
  await refreshAll()
}

export async function createOffice(input: Partial<Omit<Office, 'id' | 'sort_order'>>): Promise<void> {
  await http.post('/api/offices', input)
  await refreshAll()
}

export async function updateOffice(id: number, input: Partial<Omit<Office, 'id' | 'sort_order'>>): Promise<void> {
  await http.put(`/api/offices/${id}`, input)
  await refreshAll()
}

export async function deleteOffice(id: number): Promise<void> {
  await http.delete(`/api/offices/${id}`)
  await refreshAll()
}

export async function createService(input: Partial<Omit<ServiceItem, 'id' | 'sort_order'>>): Promise<void> {
  await http.post('/api/services', input)
  await refreshAll()
}

export async function updateService(id: number, input: Partial<Omit<ServiceItem, 'id' | 'sort_order'>>): Promise<void> {
  await http.put(`/api/services/${id}`, input)
  await refreshAll()
}

export async function deleteService(id: number): Promise<void> {
  await http.delete(`/api/services/${id}`)
  await refreshAll()
}

export async function createOpening(input: Partial<{ title: string; department: string; location: string; type: string; blurb: string }>): Promise<void> {
  await http.post('/api/careers/openings', input)
  await refreshAll()
}

export async function updateOpening(id: number, input: Partial<{ title: string; department: string; location: string; type: string; blurb: string }>): Promise<void> {
  await http.put(`/api/careers/openings/${id}`, input)
  await refreshAll()
}

export async function deleteOpening(id: number): Promise<void> {
  await http.delete(`/api/careers/openings/${id}`)
  await refreshAll()
}

export async function createCareerValue(input: { title: string; text: string }): Promise<void> {
  await http.post('/api/careers/values', input)
  await refreshAll()
}

export async function updateCareerValue(id: number, input: Partial<{ title: string; text: string }>): Promise<void> {
  await http.put(`/api/careers/values/${id}`, input)
  await refreshAll()
}

export async function deleteCareerValue(id: number): Promise<void> {
  await http.delete(`/api/careers/values/${id}`)
  await refreshAll()
}

export async function createCareerBenefit(input: { text: string }): Promise<void> {
  await http.post('/api/careers/benefits', input)
  await refreshAll()
}

export async function deleteCareerBenefit(id: number): Promise<void> {
  await http.delete(`/api/careers/benefits/${id}`)
  await refreshAll()
}

export async function updateCareerBenefit(id: number, input: Partial<{ text: string }>): Promise<void> {
  await http.put(`/api/careers/benefits/${id}`, input)
  await refreshAll()
}

export async function createHomeStat(input: Partial<Omit<HomeStat, 'id' | 'sort_order'>>): Promise<void> {
  await http.post('/api/home-stats', input)
  await refreshAll()
}

export async function updateHomeStat(id: number, input: Partial<Omit<HomeStat, 'id' | 'sort_order'>>): Promise<void> {
  await http.put(`/api/home-stats/${id}`, input)
  await refreshAll()
}

export async function deleteHomeStat(id: number): Promise<void> {
  await http.delete(`/api/home-stats/${id}`)
  await refreshAll()
}

export async function updateAboutSettings(input: { mission: string; vision: string }): Promise<void> {
  await http.put('/api/about', input)
  await refreshAll()
}

export async function createAboutValue(input: { title: string; description: string }): Promise<void> {
  await http.post('/api/about/values', input)
  await refreshAll()
}

export async function updateAboutValue(id: number, input: Partial<{ title: string; description: string }>): Promise<void> {
  await http.put(`/api/about/values/${id}`, input)
  await refreshAll()
}

export async function deleteAboutValue(id: number): Promise<void> {
  await http.delete(`/api/about/values/${id}`)
  await refreshAll()
}

export async function createMilestone(input: Partial<{ year: string; title: string; description: string }>): Promise<void> {
  await http.post('/api/about/milestones', input)
  await refreshAll()
}

export async function updateMilestone(id: number, input: Partial<{ year: string; title: string; description: string }>): Promise<void> {
  await http.put(`/api/about/milestones/${id}`, input)
  await refreshAll()
}

export async function deleteMilestone(id: number): Promise<void> {
  await http.delete(`/api/about/milestones/${id}`)
  await refreshAll()
}

export async function markContactRead(id: number, read: boolean): Promise<void> {
  await http.patch(`/api/contacts/${id}/read`, { read })
  await refreshContacts()
}

export async function deleteContact(id: number): Promise<void> {
  await http.delete(`/api/contacts/${id}`)
  await refreshContacts()
}