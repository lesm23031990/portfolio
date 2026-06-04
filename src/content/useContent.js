import { reactive } from 'vue'
import { loadContent, saveContent as persistContent, STORAGE_KEY } from './loadContent'

const state = reactive({
  data: loadContent()
})

export function useContent() {
  function save(data) {
    Object.assign(state.data, data)
    persistContent(state.data)
  }

  function getProjects(locale) {
    return (state.data.projects || [])
      .filter(p => p.enabled)
      .sort((a, b) => a.order - b.order)
      .map(p => ({
        ...p,
        title: p.title?.[locale] || p.title?.en || '',
        stack: p.stack?.[locale] || p.stack?.en || '',
        summary: p.summary?.[locale] || p.summary?.en || '',
        cta: p.cta?.[locale] || p.cta?.en || ''
      }))
  }

  function getStackGroups(locale) {
    return (state.data.stackGroups || [])
      .sort((a, b) => a.order - b.order)
      .map(g => ({
        key: g.key,
        label: g.label?.[locale] || g.label?.en || '',
        description: g.description?.[locale] || g.description?.en || ''
      }))
  }

  function getStackOrbs(locale) {
    return (state.data.stackOrbs || []).map(o => ({
      ...o,
      label: o.label?.[locale] || o.label?.en || '',
      style: {
        '--orb-size': o.size,
        '--orb-accent': o.accent,
        '--orb-glow': o.glow,
        '--orb-x': o.x,
        '--orb-y': o.y,
        '--orb-delay': o.delay
      }
    }))
  }

  function getProjectTheme(id) {
    return state.data.projectThemes?.[id] || {}
  }

  return {
    content: state.data,
    save,
    getProjects,
    getStackGroups,
    getStackOrbs,
    getProjectTheme
  }
}

export { STORAGE_KEY }
