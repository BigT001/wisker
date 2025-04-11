import { Episode } from '@/lib/types'

export interface ContentPlan {
  id?: string
  series_concept?: string
  cat_name?: string
  content_style?: string
  episodes: Episode[]
  [key: string]: any
}

export interface ScriptGeneratorProps {
  contentPlan?: ContentPlan
  onScriptGenerated?: (episodeIndex: number, script: string) => void
  onEpisodeSelect?: (episodeIndex: number) => void
  selectedEpisode?: number
  standalone?: boolean
  apiConnected?: boolean | null
  selectedContentPlan?: ContentPlan
}

export interface EpisodeSelectorProps {
  episodes: Episode[]
  currentEpisodeIndex: number
  savedScripts: Record<number, string>
  onEpisodeChange: (index: number) => void
  disabled?: boolean
}

export interface EpisodeDetailsProps {
  episode: Episode
  episodeIndex: number
  hasScript: boolean
  onGenerateScript: () => void
  onViewScript: () => void
  isGenerating: boolean
  isSaving: boolean
}

export interface ScriptViewerProps {
  script: string
  episodeTitle: string
  episodeIndex: number
  onCopy: () => void
  onDownload: () => void
  onBackToDetails: () => void
}

export interface ProgressTrackerProps {
  progress: number
  isGenerating: boolean
}

export interface ScriptStatusProps {
  completedCount: number
  totalCount: number
}
