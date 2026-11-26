import { listChecklists, progressOf } from '../services/checklistService.js'
import { listDrafts } from '../services/draftService.js'
import { checklistTitle, draftText } from './sampleText.js'
import { formatDate } from './formatDate.js'

// How many rows the dashboard panel shows before the person goes to the full list.
const MAX_ITEMS = 3

// The most recently touched drafts and unfinished checklists, newest first, as rows for the
// dashboard's "Continue where you left off" panel.
//
// Completed checklists are left out on purpose: there is nothing left to continue, so the panel
// would be offering a finished task as unfinished work.
export function continueItems(t, language) {
  const drafts = listDrafts().map((draft) => {
    const { title, area } = draftText(draft, t)
    const date = t('app.drafts.updated', { date: formatDate(draft.updatedAt, language) })
    return {
      key: `draft-${draft.id}`,
      kind: 'draft',
      to: `/app/drafts/${draft.id}`,
      title,
      meta: `${area} · ${date}`,
      updatedAt: draft.updatedAt,
    }
  })

  const checklists = listChecklists()
    .map((list) => ({ list, progress: progressOf(list) }))
    .filter(({ progress }) => progress.status !== 'completed')
    .map(({ list, progress }) => ({
      key: `checklist-${list.id}`,
      kind: 'checklist',
      to: `/app/checklist/${list.id}`,
      title: checklistTitle(list, t),
      meta: `${t(`app.areas.${list.areaId}`)} · ${t('app.checklist.tasksDone', { done: progress.done, total: progress.total })}`,
      updatedAt: list.updatedAt,
    }))

  // ISO dates (YYYY-MM-DD) sort correctly as plain strings; on a tie the draft stays first.
  return [...drafts, ...checklists].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, MAX_ITEMS)
}
