import { useEffect, useMemo, useRef, useState } from 'react'

export default function useVirtualRows(
  rows,
  { enabled = true, rowHeight = 56, overscan = 8 } = {}
) {
  const bodyRef = useRef(null)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [startIndex, setStartIndex] = useState(0)
  const [estimatedRowHeight, setEstimatedRowHeight] = useState(Math.max(1, rowHeight))
  const shouldVirtualize = enabled && rows.length > 0
  const safeRowHeight = Math.max(1, Math.round(estimatedRowHeight || rowHeight))

  useEffect(() => {
    setEstimatedRowHeight(Math.max(1, rowHeight))
  }, [rowHeight])

  useEffect(() => {
    if (!shouldVirtualize) {
      setViewportHeight(0)
      setStartIndex(0)
      return
    }

    const scrollContainer = bodyRef.current?.closest('.react-table-scroll')
    if (!scrollContainer) return

    let frameId
    const updateMeasurements = () => {
      if (frameId) cancelAnimationFrame(frameId)
      frameId = requestAnimationFrame(() => {
        const nextViewportHeight = Math.max(0, Math.floor(scrollContainer.clientHeight))
        const nextStartIndex = Math.max(
          0,
          Math.floor(scrollContainer.scrollTop / safeRowHeight) - overscan
        )

        setViewportHeight((prev) => (prev === nextViewportHeight ? prev : nextViewportHeight))
        setStartIndex((prev) => (prev === nextStartIndex ? prev : nextStartIndex))
      })
    }

    updateMeasurements()
    scrollContainer.addEventListener('scroll', updateMeasurements, { passive: true })
    window.addEventListener('resize', updateMeasurements)

    let resizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateMeasurements)
      resizeObserver.observe(scrollContainer)
    }

    return () => {
      if (frameId) cancelAnimationFrame(frameId)
      scrollContainer.removeEventListener('scroll', updateMeasurements)
      window.removeEventListener('resize', updateMeasurements)
      if (resizeObserver) resizeObserver.disconnect()
    }
  }, [overscan, rows.length, safeRowHeight, shouldVirtualize])

  useEffect(() => {
    if (!shouldVirtualize) return

    const frameId = requestAnimationFrame(() => {
      const sampleRow = bodyRef.current?.querySelector('tr[data-virtual-row="true"]')
      if (!sampleRow) return

      const measuredRowHeight = Math.max(1, Math.round(sampleRow.getBoundingClientRect().height))
      setEstimatedRowHeight((prev) =>
        Math.abs(prev - measuredRowHeight) >= 2 ? measuredRowHeight : prev
      )
    })

    return () => cancelAnimationFrame(frameId)
  }, [rows, shouldVirtualize, startIndex])

  return useMemo(() => {
    if (!shouldVirtualize) {
      return {
        bodyRef,
        isVirtualized: false,
        visibleRows: rows,
        topPadding: 0,
        bottomPadding: 0
      }
    }

    const effectiveViewportHeight = Math.max(viewportHeight, safeRowHeight * 8)
    const boundedStartIndex = Math.min(startIndex, Math.max(0, rows.length - 1))
    const visibleCount = Math.max(
      1,
      Math.ceil(effectiveViewportHeight / safeRowHeight) + overscan * 2
    )
    const endIndex = Math.min(rows.length, boundedStartIndex + visibleCount)

    return {
      bodyRef,
      isVirtualized: true,
      visibleRows: rows.slice(boundedStartIndex, endIndex),
      topPadding: boundedStartIndex * safeRowHeight,
      bottomPadding: Math.max(0, (rows.length - endIndex) * safeRowHeight)
    }
  }, [rows, shouldVirtualize, viewportHeight, startIndex, safeRowHeight, overscan])
}
