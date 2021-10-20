import { useRef } from 'react'

export default function useDebounce(fn: any, delay: any) {
  const timeoutRef = useRef<any>(null)

  const debounceFn = (...params: any) => {
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => {
      fn(...params);
    }, delay)
  }

  return debounceFn
}