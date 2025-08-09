import { useState, useEffect } from 'react'
import { nanoid } from "nanoid";
import reactLogo from './assets/react.svg'
import viteLogo from '/img.jpg'
import './App.css'
import ImgCard from './img-card'


function App() {
  const [images, setImages] = useState([])
  // const [newImage, setNewImage] = useState([])
  const [newPrompt, setNewPrompt] = useState('')

  // get images from backend
  useEffect(() => {
    fetch('http://localhost:5000/images')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json()
      })
      .then(data => {
        setImages(data)
      })
      .catch(err => console.error(err))
  }, []);

  // Add new image to server
  const addImage = () => {

    const formData = new FormData();
    formData.append('id', newImage.id);
    formData.append('img', newImage.img);
    console.log(formData)
    fetch('http://localhost:5000/images', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then(data => {
        console.log('Upload successful:', data);
        setImages(prev => [...prev, { id: data.id, img: data.img }]);
        // setNewImage(null);
      })
      .catch(error => console.error('Upload failed:', error));
  };

  // delete image by id
  const deleteImage = (id) => {
    fetch(`http://localhost:5000/delete/${id}`, { method: "DELETE" })
      .then(() => {
        setImages(prev => prev.filter(image => image.id !== id));
      })
      .catch(err => console.error(err));
  };

  // add new image localy
  function handleFileChange(event) {
    const files = event.target.files;
    // const fileArray = Array.from(files);

    // files.forEach((file) => {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const newImage = { id: nanoid(), img: e.target.result }
    //     setImages((prev) => [...prev, newImage]);
    //   };
    //   reader.readAsDataURL(file);
    // });
    setNewImage({ id: nanoid(), img: files[0] })
    // console.log(event.target.files[0])
  }

  // generate image and add to galery
  const handleGenerate = async () => {
    const postData = { prompt: newPrompt };
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    };

    const res = await fetch('http://localhost:5000/generate', requestOptions);
    const data = await res.json();
    const newImage = { id: data.id, filename: data.filename };
    setImages((prev) =>
      [...prev, newImage]
    );
  }


  const grid = images.map((img) => (
    <ImgCard
      img={`http://localhost:5000/images/${img.filename}`}
      id={img.id}
      key={img.id}
      deleteImage={deleteImage} />
  ))

  return (
    <>
      <div className='input'>
        {/* <input
          type="file"
          accept='image/*'
          placeholder="Image URL"
          onChange={handleFileChange} /> */}
        <input type="text" onChange={(e) => setNewPrompt(e.target.value)} />
        {/* <button type="button" onClick={addImage}>Add image</button> */}
        <button type="button" onClick={handleGenerate}>Generate</button>
      </div>
      <div className='grid'>
        {grid}
      </div>
    </>
  )
}

export default App
