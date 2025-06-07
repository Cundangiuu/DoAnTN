'use client'

import React, { useState, useEffect } from 'react'
import { Star } from 'lucide-react'

interface RatingProps {
  initialValue?: number
  count?: number
  onChange?: (value: number) => void
  isReadOnly?: boolean
  isDisabled?: boolean
}

export function Rating({
  initialValue = 0,
  count = 5,
  onChange,
  isReadOnly = false,
  isDisabled = false
}: Readonly<RatingProps>) {
  const [rating, setRating] = useState(initialValue)
  const [hover, setHover] = useState(0)

  useEffect(() => {
    setRating(initialValue)
  }, [initialValue])

  const handleRating = (value: number) => {
    if (!isReadOnly && !isDisabled) {
      setRating(value)
      if (onChange) {
        onChange(value)
      }
    }
  }

  const handleMouseEnter = (value: number) => {
    if (!isReadOnly && !isDisabled) {
      setHover(value)
    }
  }

  const handleMouseLeave = () => {
    if (!isReadOnly && !isDisabled) {
      setHover(0)
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[...Array(count)].map((_, index) => {
        const starValue = index + 1
        return (
          <button
            key={starValue}
            type="button"
            onClick={() => handleRating(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            disabled={isDisabled || isReadOnly}
            aria-label={`Rate ${starValue} out of ${count}`}
            className={`focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 rounded-full p-1 transition-colors duration-150 ease-in-out
              ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
              ${isReadOnly ? 'cursor-default' : ''}
              ${!isDisabled && !isReadOnly ? 'cursor-pointer' : ''}
            `}
          >
            <Star
              className={`w-6 h-6 ${
                (hover || rating) >= starValue
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}

