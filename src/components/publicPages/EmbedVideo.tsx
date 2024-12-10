import React from 'react';

function EmbedVideo() {
  return (
    <div className='mx-auto w-full flex justify-center items-center rounded-lg'>
      
      <iframe  className='rounded-xl w-full lg:w-full md:h-[500px] mx-auto' src="https://www.youtube.com/embed/QCVK9luTwuM?si=XI4mxHoqC3qemSBN" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
    </div>
  );
}

export default EmbedVideo;

// <iframe width="560" height="315" src="https://www.youtube.com/embed/QCVK9luTwuM?si=XI4mxHoqC3qemSBN" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
