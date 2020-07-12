import { useState, useEffect, useCallback, useReducer } from 'react'
/**
 *
 * @param {*} param0
 * const options = { initData: [], pageSize: 10, pageNo: 1 }
 *[onRefresh, onEndReached, array, isEnd, isRefresh, isLoadMore] = useInfinityList(fetchRequest,options)
 */
function useInfinityList(fetchRequest, { initData = false, pageSize = 10, pageNo = 1 } = {}) {
  const [array, setArray] = useState(initData)
  const [num, setNum] = useState(pageNo)
  const [size, setSize] = useState(pageSize)
  const [isEnd, setIsEnd] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [isLoadMore, setLoadMore] = useState(false)
  const [isRefresh, setRefresh] = useState(false)
  const [forceRefresh, setForceRefresh] = useReducer((x) => x + 1, 0)
  const fetchMethod = (o) => Promise.resolve(fetchRequest(o))

  useEffect(() => {
    if (isLoading) {
      return
    }
    setLoading(true)
    const getData = { query: { pageNo: num, pageSize: size } }
    fetchMethod(getData).then((res) => {
      if (!Array.isArray(res)) {
        throw Error('request result is not array')
      }
      const resTotal = res.length
      const isFirstPage = num <= pageNo
      if (resTotal < pageSize) {
        setIsEnd(true)
      } else {
        setIsEnd(false)
      }
      if (isFirstPage && resTotal === 0) {
        setArray([])
      } else if (isFirstPage) {
        setArray(res)
      } else {
        setArray(array.concat(res))
      }
      setLoading(false)
      setRefresh(false)
      setLoadMore(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [num, size, forceRefresh])

  useEffect(() => {
    setSize(pageSize)
  }, [pageSize])

  useEffect(() => {
    setNum(pageNo)
  }, [pageNo])

  const onEndReached = useCallback(() => {
    if (isLoading || isEnd || isRefresh || isLoadMore) {
      return
    }
    setLoadMore(true)
    setNum(num + 1)
  }, [isEnd, isLoadMore, isLoading, isRefresh, num])

  const onRefresh = useCallback(() => {
    setNum(pageNo)
    setRefresh(true)
    setForceRefresh()
  }, [forceRefresh, pageNo])

  return [onRefresh, onEndReached, array, isEnd, isRefresh, isLoadMore]
}

export default useInfinityList
