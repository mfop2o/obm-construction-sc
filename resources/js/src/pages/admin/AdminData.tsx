import { useState } from 'react'
import {
  importProjects,
  resetProjects,
  useProjects,
} from '../../lib/projectsStore'
import Button from '../../components/ui/Button'

/* ============================================================================
   AdminData — export / import / reset tools for the dynamic content system.
   All data lives in the database via the Laravel API.
   ========================================================================== */

export default function AdminData() {
  const projects = useProjects()
  const [confirm, setConfirm] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  function notify(text: string) {
    setMessage(text)
    window.setTimeout(() => setMessage(null), 4000)
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(projects, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'obm-projects.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  async function handleImport(file: File) {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!Array.isArray(parsed)) throw new Error('invalid')
        setBusy(true)
        await importProjects(parsed)
        notify(`Imported ${parsed.length} projects.`)
      } catch {
        notify('That file is not valid JSON.')
      } finally {
        setBusy(false)
        // Reset input so the same file can be chosen again.
        ;(document.getElementById('import-file') as HTMLInputElement | null)?.setAttribute('value', '')
      }
    }
    reader.readAsText(file)
  }

  async function handleReset() {
    setBusy(true)
    try {
      await resetProjects()
      setConfirm(false)
      notify('Content reset to the original seed projects.')
    } catch {
      notify('Could not reset content.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-primary-950">Data &amp; Reset</h1>
        <p className="mt-1 text-sm text-concrete">
          Export a backup of your content, import a backup, or restore the
          original seed data. All content is stored in the database.
        </p>
      </header>

      {message && (
        <div className="rounded-sm border border-primary-200 bg-surface px-4 py-3 text-sm text-primary-900">
          {message}
        </div>
      )}

      {/* Storage status */}
      <section className="admin-card-flat p-6">
        <h2 className="mb-3 font-display text-lg font-semibold text-primary-950">Storage</h2>
        <p className="text-sm text-concrete">
          Projects are stored in the MySQL database via the Laravel API. The
          database is the single source of truth for the public
          /projects pages and this admin system. You currently have{' '}
          <span className="font-medium text-primary-900">{projects.length}</span>{' '}
          projects.
        </p>
      </section>

      {/* Export */}
      <section className="admin-card-flat p-6">
        <h2 className="mb-3 font-display text-lg font-semibold text-primary-950">Export</h2>
        <p className="mb-4 text-sm text-concrete">
          Download the current projects as a JSON backup.
        </p>
        <Button onClick={handleExport}>
          Export projects JSON
        </Button>
      </section>

      {/* Import */}
      <section className="admin-card-flat p-6">
        <h2 className="mb-3 font-display text-lg font-semibold text-primary-950">Import</h2>
        <p className="mb-4 text-sm text-concrete">
          Replace all projects from an exported JSON backup. This overwrites
          the current content in the database.
        </p>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-none border border-primary-200 bg-surface px-5 py-2.5 text-sm font-medium text-primary-900 transition-colors hover:bg-primary-100 disabled:opacity-50">
          {busy ? 'Importing…' : 'Choose JSON file'}
          <input
            id="import-file"
            type="file"
            accept="application/json,.json"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void handleImport(file)
            }}
          />
        </label>
      </section>

      {/* Reset */}
      <section className="admin-card-flat border-red-200 p-6">
        <h2 className="mb-3 font-display text-lg font-semibold text-red-700">Reset to seed</h2>
        <p className="mb-4 text-sm text-concrete">
          Permanently discard your saved changes and restore the original
          placeholder projects in the database. This cannot be undone.
        </p>
        {confirm ? (
          <span className="inline-flex items-center gap-2">
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              onClick={handleReset}
              disabled={busy}
            >
              {busy ? 'Resetting…' : 'Yes, reset everything'}
            </Button>
            <Button variant="ghost" onClick={() => setConfirm(false)} disabled={busy}>
              Cancel
            </Button>
          </span>
        ) : (
          <Button
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
            onClick={() => setConfirm(true)}
          >
            Reset content
          </Button>
        )}
      </section>
    </div>
  )
}
