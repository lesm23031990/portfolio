import { describe, it, expect } from 'vitest'
import { useLoading } from '../useLoading'

describe('useLoading', () => {
  it('starts with false', () => {
    const { loading } = useLoading()
    expect(loading.value).toBe(false)
  })

  it('showLoading sets loading to true', () => {
    const { loading, showLoading } = useLoading()
    showLoading()
    expect(loading.value).toBe(true)
  })

  it('hideLoading sets loading to false', () => {
    const { loading, showLoading, hideLoading } = useLoading()
    showLoading()
    expect(loading.value).toBe(true)
    hideLoading()
    expect(loading.value).toBe(false)
  })
})
