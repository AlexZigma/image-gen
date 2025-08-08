import { useState } from 'react'
import { nanoid } from "nanoid";
import reactLogo from './assets/react.svg'
import viteLogo from '/img.jpg'
import './App.css'
import ImgCard from './img-card'

function App() {
  const [images, setImages] = useState([
    {id: nanoid(), img: viteLogo},
    {id: nanoid(), img: viteLogo},
  ])
  
  function handleFileChange(event){
    const files = event.target.files;
    const fileArray = Array.from(files);

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {id: nanoid(), img: e.target.result}
        setImages((prev) => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
  }

  function deleteImage(id){
    const remainingImages = images.filter((img) => img.id !== id)
    setImages(remainingImages)
  }

  // const photos = [viteLogo, viteLogo, viteLogo, viteLogo, viteLogo]
  const grid = images.map((img) => (
    <ImgCard img={img.img} id={img.id} key={img.id} deleteImage={deleteImage}/>
  ))
  return (
    <>
      <div>
        <input type="file" multiple accept='image/*' onChange={handleFileChange} />
        <button type="button">Create image</button>
        {/* <button type="button"></button> */}
        <button type="button">Import</button>
      </div>
      <div className='grid'>
        {/* <ImgCard img={img} id={img.id} key={img.id}/> */}
        {grid}
      </div>
    </>
  )
}

export default App
