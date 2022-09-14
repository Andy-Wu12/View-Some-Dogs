import React, { useState } from 'react';

import { ImageList, queryOptionsToHTML, generateOptionRange ,DataFetcher } from '../util';

function DogQueryForm({queryOptions}) {
  const [posted, setPosted] = useState(false);
  const [imageLinks, setImageLinks] = useState([]);
  const [imageCount, setImageCount] = useState(9);

  const breedOptions = queryOptionsToHTML(queryOptions);
  // Config number of images to pull from API
  const imageCountOptions = generateOptionRange(1, 50);

  // TODO: Find way to stop user from spamming fetches
  function handleSubmit(e) {
    e.preventDefault();
    setPosted(true);
    setImageCount(e.target.imageCount.value);
    console.log(imageCount);
    const breed = e.target.breeds.value.trim().toLowerCase();

    if(breed !== undefined && breed.length > 0) {
      fetch(`http://localhost:3011/dog/${breed}/get-images/${imageCount}`)
      .then(response => response.json())
      .then(data => setImageLinks(data['message']))
      .catch(error => {
        setImageLinks([]);
      })
    }
  }

  let imageSectionHTML = <p> Select a name and click 'Fetch' to get started! </p>;
  if(posted) {
    if(imageLinks.length > 0) {
      imageSectionHTML = <ImageList images={imageLinks} desiredLength={imageCount} />;
    }
    else {
      imageSectionHTML = <p> Invalid breed name! </p>;
    }
  }

  return (
    <div className='query-form'>
      <h1>Lots of dogs! 🐕</h1>
      <form onSubmit={handleSubmit}>
        <p>
          See 
          <select name='imageCount' id='imageCount'> 
            {imageCountOptions}
          </select> 
          random photos of your favorite dogs
        </p>
        <label htmlFor="breeds"> Select a breed: </label>
        <select name="breeds" id="breeds">
          {breedOptions}
        </select>
        <button className="fetch" type="submit">Fetch</button>
      </form>
      <br/>
      {imageSectionHTML}
    </div>
  );
}

export function QueryBreedSection() {
  return (
  <>
    <section id='QueryBreedSection'>
      <DataFetcher url='http://localhost:3011/breeds' 
      ComponentToRender={DogQueryForm} />
    </section>
  </>
  );
}
