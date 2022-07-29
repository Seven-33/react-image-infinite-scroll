import React, { useState, useEffect, useCallback, useMemo } from "react";
import Gallery from "react-photo-gallery";
import _ from "lodash";

import { fetchPhotos } from "./services/api";

import { Image, Photo } from "./types";

import Loading from "./components/loading/Loading";

const App = () => {
  const [imageObjects, setImageObjects] = useState<Image[]>([]);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);

  const fetchImages = useCallback(
    _.debounce((page) => {
      setIsLoading(true);
      fetchPhotos(page)
        .then((response) => {
          const responseImages: Photo[] = response.data;
          const images = responseImages.map((image) => ({
            src: image.urls.regular,
            width: image.width,
            height: image.height,
          }));
          setImageObjects((imageObjects) => [...imageObjects, ...images]);
          console.log(imageObjects);
          setIsFirstLoading(false);
          setIsLoading(false);
        })
        .catch((e) => {
          alert(e);
        });
    }, 500),
    []
  );

  const handleScroll = useCallback(() => {
    if (
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.offsetHeight
    ) {
      console.error("handle scroll");
      setPageNumber((prevPage) => prevPage + 1);
    }
  }, []);

  const handleOpenLightbox = () => {};

  useEffect(() => {
    fetchImages(pageNumber);
    console.log("It's first render");
  }, [pageNumber]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {isFirstLoading ? (
        <Loading />
      ) : (
        <Gallery photos={imageObjects} onClick={handleOpenLightbox} />
      )}
      {isLoading ?? <Loading />}
    </div>
  );
};

export default App;
