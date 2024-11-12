import React from 'react';

function EmbedVideo() {
  return (
    <div className='mx-auto w-full flex justify-center items-center rounded-lg'>
      
      <iframe  className='rounded-xl w-full lg:w-2/3 md:h-[500px] mx-auto' src="https://www.youtube.com/embed/VtHEtba0OnA?si=2jge8FP5YpEqSbq7" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    </div>
  );
}

export default EmbedVideo;
