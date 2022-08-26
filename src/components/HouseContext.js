import { set } from 'mongoose'
import React, { useState, useEffect, createContext } from 'react'

// import data
import { housesData } from '../data'

// create context
export const HouseContext = createContext()

const HouseContextProvider = ({ children }) => {
  const [houses, setHouses] = useState(housesData)
  const [country, setCountry] = useState('Location (any)')
  const [countries, setCountries] = useState([])
  const [property, setProperty] = useState('Property type (any) ')
  const [properties, setProperties] = useState([])
  const [price, setPrice] = useState('Price range (any)')
  const [loading, setLoading] = useState(false)

  // return all countries

  useEffect(() => {
    const allCountries = houses.map((house) => {
      return house.country
    })
    // return umique countries
    const uniqueCountries = ['Location(any)', ...new Set(allCountries)]
    // set countries state
    setCountries(uniqueCountries)
  }, [])
  useEffect(() => {
    const allTypes = houses.map((house) => {
      return house.type
    })
    // unique type
    const uniqueType = ['Property type(any)', ...new Set(allTypes)]
    setProperties(uniqueType)
  }, [])

  const handleClick = () => {
    setLoading(true)
    // function check if the string includes 'any'
    const isDefault = (str) => {
      return str.split(' ').includes('(any)')
    }

    // get first value of price and parse it to number
    const minPrice = parseInt(price.split(' ')[0])
    // get second  value of price and parse it to number
    const maxPrice = parseInt(price.split(' ')[2])

    const newHouses = housesData.filter((house) => {
      const housePrice = parseInt(house.price)
      if (
        house.country === country &&
        house.type === property &&
        minPrice <= housePrice &&
        maxPrice >= housePrice
      ) {
        return house
      }
      // if all value are default
      if (isDefault(country) && isDefault(property) && isDefault(price)) {
        return house
      }
      if (!isDefault(country) && isDefault(property) && isDefault(price)) {
        return house.country === country
      }
      if (isDefault(country) && !isDefault(property) && isDefault(price)) {
        return house.type === property
      }
      if (isDefault(country) && isDefault(property) && !isDefault(price)) {
        if (minPrice <= housePrice && housePrice <= maxPrice) {
          return house
        }
      }

      // if country & property is not default
      if (!isDefault(country) && !isDefault(property) && isDefault(price)) {
        return house.country === country && house.type === property
      }
      //if country & price is not default
      if (!isDefault(country) && !isDefault(price) && isDefault(property)) {
        if (minPrice <= housePrice && maxPrice >= housePrice) {
          return house.country === country
        }
      }
      // if property && price is not default
      if (!isDefault(property) && !isDefault(price) && isDefault(country)) {
        if (minPrice <= housePrice && maxPrice >= housePrice) {
          return house.type === property
        }
      }
    })

    setTimeout(() => {
      return (
        newHouses.length < 1 ? setHouses([]) : setHouses(newHouses),
        setLoading(false)
      )
    }, 1000)
  }

  return (
    <HouseContext.Provider
      value={{
        country,
        setCountry,
        countries,
        property,
        setProperty,
        properties,
        price,
        setPrice,
        houses,
        loading,
        handleClick,
        loading,
      }}
    >
      {children}
    </HouseContext.Provider>
  )
}

export default HouseContextProvider
