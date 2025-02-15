import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getCarMakes, getCarModels, type CarMake, type CarModel } from '@/lib/utils'

export function useCarSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [makes, setMakes] = useState<CarMake[]>([])
  const [models, setModels] = useState<CarModel[]>([])
  const [loading, setLoading] = useState(true)
  const [modelLoading, setModelLoading] = useState(false)
  const [value, setValue] = useState(searchParams.get('make') || '')
  const [modelValue, setModelValue] = useState(searchParams.get('model') || '')
  const [search, setSearch] = useState('')
  const [modelSearch, setModelSearch] = useState('')
  const [yearFrom, setYearFrom] = useState(searchParams.get('yearFrom') || '')
  const [yearTo, setYearTo] = useState(searchParams.get('yearTo') || '')
  const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || '')
  const [transmission, setTransmission] = useState(searchParams.get('transmission') || '')
  const [fuelType, setFuelType] = useState(searchParams.get('fuelType') || '')
  const [mileageFrom, setMileageFrom] = useState(searchParams.get('mileageFrom') || '')
  const [mileageTo, setMileageTo] = useState(searchParams.get('mileageTo') || '')
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')

  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const data = await getCarMakes()
        setMakes(data)
      } catch (error) {
        console.error('Failed to fetch car makes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMakes()
  }, [])

  useEffect(() => {
    const fetchModels = async () => {
      if (!value) {
        setModels([])
        setModelValue('')
        return
      }

      setModelLoading(true)
      try {
        const data = await getCarModels(value)
        setModels(data)
        setModelValue('')
      } catch (error) {
        console.error('Failed to fetch car models:', error)
      } finally {
        setModelLoading(false)
      }
    }

    fetchModels()
  }, [value])

  const filteredMakes = makes.filter((make) =>
    make.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(modelSearch.toLowerCase())
  )

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    Array.from(params.keys()).forEach(key => {
      if (key !== 'view') params.delete(key)
    })

    if (value) params.set('make', value)
    if (modelValue) params.set('model', modelValue)
    if (yearFrom) params.set('yearFrom', yearFrom)
    if (yearTo) params.set('yearTo', yearTo)
    if (priceRange) params.set('priceRange', priceRange)
    if (transmission) params.set('transmission', transmission)
    if (fuelType) params.set('fuelType', fuelType)
    if (mileageFrom) params.set('mileageFrom', mileageFrom)
    if (mileageTo) params.set('mileageTo', mileageTo)
    if (keyword) params.set('keyword', keyword)

    router.push(`/cars?${params.toString()}`)
  }

  const handleReset = () => {
    setValue('')
    setModelValue('')
    setYearFrom('')
    setYearTo('')
    setPriceRange('')
    setTransmission('')
    setFuelType('')
    setMileageFrom('')
    setMileageTo('')
    setKeyword('')
    setSearch('')
    setModelSearch('')
    
    const params = new URLSearchParams()
    if (searchParams.get('view')) {
      params.set('view', searchParams.get('view')!)
    }
    router.push(`/cars?${params.toString()}`)
  }

  return {
    makes,
    models,
    loading,
    modelLoading,
    value,
    modelValue,
    search,
    modelSearch,
    yearFrom,
    yearTo,
    priceRange,
    transmission,
    fuelType,
    mileageFrom,
    mileageTo,
    keyword,
    filteredMakes,
    filteredModels,
    setValue,
    setModelValue,
    setSearch,
    setModelSearch,
    setYearFrom,
    setYearTo,
    setPriceRange,
    setTransmission,
    setFuelType,
    setMileageFrom,
    setMileageTo,
    setKeyword,
    handleSearch,
    handleReset,
  }
} 