import { useNavigate } from 'react-router-dom'
import {
  deleteProject,
  reorderProject,
  setFeaturedProject,
  useProjects,
  getProjectImage,
} from '../../lib/projectsStore'
import Button from '../../components/ui/Button'
import { EditButton, DeleteButton } from '../../components/admin/actions'
import { useTranslation } from '../../i18n'

/* ============================================================================
   AdminProjects — manager for the dynamic "Work" section.
   Lists all projects with create / edit / delete / reorder / feature actions.
   ========================================================================== */

export default function AdminProjects() {
  const projects = useProjects()
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary-950">
            {t('admin.projects.title')}
          </h1>
          <p className="mt-1 text-sm text-concrete">
            {t('admin.projects.description')}
          </p>
        </div>
        <Button onClick={() => navigate('/admin/projects/new')}>
          {t('admin.projects.newProject')}
        </Button>
      </header>

      {projects.length === 0 ? (
        <div className="admin-card-flat border-dashed p-10 text-center">
          <p className="font-display text-lg font-semibold text-primary-950">
            {t('admin.projects.noProjects')}
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-concrete">
            {t('admin.projects.noProjectsDesc')}
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/admin/projects/new')}>
              {t('admin.projects.createProject')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="admin-card-flat overflow-hidden">
          <ul className="divide-y divide-primary-100">
            {projects.map((p, index) => {
              const first = index === 0
              const last = index === projects.length - 1
              return (
                <li
                  key={p.slug}
                  className="flex flex-col gap-3 px-4 py-4 transition-colors hover:bg-primary-50/50 sm:flex-row sm:items-center"
                >
                  <div className="flex flex-1 items-center gap-3">
                    {/* Reorder controls */}
                    <div className="flex shrink-0 flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={first}
                        onClick={() => void reorderProject(p.slug, 'up')}
                        aria-label={`Move ${p.title} up`}
                        className="inline-flex h-6 w-6 items-center justify-center text-concrete enabled:hover:bg-primary-100 enabled:hover:text-primary-950 disabled:opacity-30"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15" /></svg>
                      </button>
                      <button
                        type="button"
                        disabled={last}
                        onClick={() => void reorderProject(p.slug, 'down')}
                        aria-label={`Move ${p.title} down`}
                        className="inline-flex h-6 w-6 items-center justify-center text-concrete enabled:hover:bg-primary-100 enabled:hover:text-primary-950 disabled:opacity-30"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9" /></svg>
                      </button>
                    </div>

                    {/* Thumb */}
                    <div className="hidden h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-primary-100 bg-stone-100 sm:block">
                      {getProjectImage(p) ? (
                        <img
                          src={getProjectImage(p)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary-900 text-xs font-semibold text-white">
                          {p.title.slice(0, 1)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-display font-semibold text-primary-950">
                          {p.title}
                        </p>
                        {p.featured && (
                          <span className="inline-flex items-center rounded-full bg-accent-400/20 px-2 py-0.5 text-xs font-semibold text-accent-600">
                            {t('admin.projects.featured')}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-concrete">
                        {p.category} · {p.status} · {p.year} · {p.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                    {!p.featured ? (
                      <button
                        type="button"
                        onClick={() => void setFeaturedProject(p.slug)}
                        className="rounded-sm px-2 py-1 text-xs font-medium text-accent-600 hover:bg-accent-400/10"
                      >
                        {t('admin.projects.feature')}
                      </button>
                    ) : (
                      <span className="px-2 py-1 text-xs text-concrete">
                        {t('admin.projects.featured')}
                      </span>
                    )}
                    <div className="flex shrink-0 items-center gap-1">
                      <EditButton
                        label={`Edit ${p.title}`}
                        onClick={() => navigate(`/admin/projects/${p.slug}`)}
                      />
                      <DeleteButton
                        label={`Delete ${p.title}`}
                        onDelete={() => void deleteProject(p.slug)}
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}
