import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/img.jpg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const photos = [viteLogo, viteLogo, viteLogo, viteLogo, viteLogo]
  const grid = photos.map((photo) => {
    return <img src={photo} alt="" />
  })
  return (
    <>
      <button type="button">Add image</button>
      <div className='grid'>
        {grid}
      </div>
    </>
  )
}

export default App
