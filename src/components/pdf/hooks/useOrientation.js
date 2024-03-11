import { useState } from 'react'

const useOrientation = (
  defaultOrientation = 'landscape',
  onOrientationChange,
) => {
  const [orientation, setOrientation] = useState(defaultOrientation)

  const toggleOrientation = (event) => {
    const newOrientation = event.target.checked ? 'landscape' : 'portrait'
    setOrientation(newOrientation)
    if (onOrientationChange) {
      onOrientationChange(newOrientation === 'landscape')
    }
  }

  return [orientation, toggleOrientation]
}

export default useOrientation
