"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { parsePhoneNumberWithError, type CountryCode as LibPhoneNumberCountryCode } from "libphonenumber-js"
import { Input } from "@/components/ui/input"
import type { CountryCode } from "@/lib/types"
import countryCodes from "public/data/countryCodes.json"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export function PhoneInput({ value, onChange, error }: PhoneInputProps): React.ReactElement {
  const [countryCode, setCountryCode] = useState<LibPhoneNumberCountryCode>("US")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredCountries, setFilteredCountries] = useState(countryCodes)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleCountryChange = useCallback(
    (newCountryCode: LibPhoneNumberCountryCode) => {
      setCountryCode(newCountryCode)
      updatePhoneNumber(phoneNumber, newCountryCode)
      setSearchTerm("")
    },
    [phoneNumber],
  )

  const handlePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newPhoneNumber = e.target.value.replace(/\D/g, "")
      setPhoneNumber(newPhoneNumber)
      updatePhoneNumber(newPhoneNumber, countryCode)
    },
    [countryCode],
  )

  const updatePhoneNumber = useCallback(
    (number: string, country: LibPhoneNumberCountryCode) => {
      try {
        const phoneNumber = parsePhoneNumberWithError(number, country)
        onChange(phoneNumber.isValid() ? phoneNumber.format("E.164") : "")
      } catch (error) {
        onChange("")
      }
    },
    [onChange],
  )

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }, [])

  useEffect(() => {
    const lowercaseSearchTerm = searchTerm.toLowerCase()
    const filtered = countryCodes.filter(
      (country) =>
        country.code.toLowerCase().startsWith(lowercaseSearchTerm) ||
        country.name.toLowerCase().startsWith(lowercaseSearchTerm),
    )
    setFilteredCountries(filtered)
  }, [searchTerm])

  const getSelectedCountryDialCode = useCallback(() => {
    const selectedCountry = countryCodes.find(({ code }) => code === countryCode)
    return selectedCountry ? `${selectedCountry.code} ${selectedCountry.dial_code}` : ""
  }, [countryCode])

  return (
    <div>
      <div className="flex space-x-2">
        <Select
          value={countryCode}
          onValueChange={handleCountryChange}
          onOpenChange={(open) => {
            if (open) {
              setTimeout(() => searchInputRef.current?.focus(), 0)
            } else {
              setSearchTerm("")
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue>{getSelectedCountryDialCode()}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="px-2 py-1">
              <Input
                ref={searchInputRef}
                placeholder="Search countries..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {filteredCountries.map((country: CountryCode) => (
              <SelectItem key={country.code} value={country.code}>
                {country.name} ({country.dial_code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="Phone number"
          className="flex-grow"
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

