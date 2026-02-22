import { useEffect, useMemo, useRef, useState } from 'react'

export default function useVirtualRows(
  rows,
  { enabled = true, rowHeight = 56, overscan = 8 } = {}
) {
  const bodyRef = useRef(null)
  const [scrollTop, setScrollTop] = useState(0)
  const [viewportHeight, setViewportHeight] = useState(0)
  const shouldVirtualize = enabled && rows.length > 0

  useEffect(() => {
    if (!shouldVirtualize) {
      setScrollTop(0)
      setViewportHeight(0)
      return
    }

    const scrollContainer = bodyRef.current?.closest('.react-table-scroll')
    if (!scrollContainer) return

    let frameId
    const updateMeasurements = () => {
      if (frameId) cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        setScrollTop(scrollContainer.scrollTop)
        setViewportHeight(scrollContainer.clientHeight)
      })
    }

    updateMeasurements()
    scrollContainer.addEventListener('scroll', updateMeasurements, { passive: true })
    window.addEventListener('resize', updateMeasurements)

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      scrollContainer.removeEventListener('scroll', updateMeasurements)
      window.removeEventListener('resize', updateMeasurements)
    }
  }, [rows.length, shouldVirtualize])

  return useMemo(() => {
    if (!shouldVirtualize || viewportHeight === 0) {
      return {
        bodyRef,
        isVirtualized: false,
        visibleRows: rows,
        topPadding: 0,
        bottomPadding: 0
      }
    }

    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
    const visibleCount = Math.max(1, Math.ceil(viewportHeight / rowHeight) + overscan * 2)
    const endIndex = Math.min(rows.length, startIndex + visibleCount)

    return {
      bodyRef,
      isVirtualized: true,
      visibleRows: rows.slice(startIndex, endIndex),
      topPadding: startIndex * rowHeight,
      bottomPadding: Math.max(0, (rows.length - endIndex) * rowHeight)
    }
  }, [rows, shouldVirtualize, viewportHeight, scrollTop, rowHeight, overscan])
}
