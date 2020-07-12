import { useState, useCallback } from 'react'
import Cache from '@/lib/cache'

function useRequest(fetchRequest, { initData, cacheKey } = {}) {
  const [res, setRes] = useState(Cache.get(cacheKey) || initData)
  const callMethod = (o) =>
    fetchRequest(o).then((r) => {
      setRes(r)
      if (cacheKey) {
        Cache.set(cacheKey, r)
      }
      return r
    })
  const callRequest = useCallback(callMethod, [])
  return [callRequest, res]
}

export default useRequest
