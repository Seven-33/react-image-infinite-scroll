import { useState, useEffect, useCallback, useMemo } from "react";
import Gallery, { PhotoClickHandler } from "react-photo-gallery";
import ImageViewer from "react-simple-image-viewer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import _ from "lodash";

import { fetchPhotos } from "../services/api";

import { Image, Photo } from "../types";

import Loading from "../components/loading/Loading";

const App = () => {
  const [images, setImageObjects] = useState<Image[]>([]);
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isSpinner, setIsSpinner] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const notify = () =>
    toast("Something went wrong, while fetching the photos from Unsaplsh!");

  const imageUrls = useMemo(() => images.map((image) => image.src), [images]);

  const fetchImages = useCallback(
    _.debounce((page) => {
      setIsSpinner(true);
      fetchPhotos(page)
        .then((response) => {
          const responseImages: Photo[] = response.data;
          const images = responseImages.map((image) => ({
            src: image.urls.regular,
            width: image.width,
            height: image.height,
          }));
          setImageObjects((imageObjects) => [...imageObjects, ...images]);
          setIsFirstLoading(false);
          setIsSpinner(false);
        })
        .catch((e) => {
          notify();
        });
    }, 500),
    [images]
  );
  console.log(isSpinner);

  const handleScroll = useCallback(() => {
    if (
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.offsetHeight
    ) {
      setPageNumber((prevPage) => prevPage + 1);
      console.log(pageNumber);
    }
  }, []);

  const handleOpenLightbox: PhotoClickHandler = (event, { photo, index }) => {
    setCurrentImage(index);
    setIsViewerOpen(true);
  };

  const handleCloseLightbox = () => {
    setCurrentImage(0);
    setIsViewerOpen(false);
  };

  useEffect(() => {
    fetchImages(pageNumber);
  }, [pageNumber]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {isFirstLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <Gallery photos={images} onClick={handleOpenLightbox} />
      )}

      {isViewerOpen && (
        <ImageViewer
          src={imageUrls}
          currentIndex={currentImage}
          onClose={handleCloseLightbox}
          disableScroll
          backgroundStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.9)",
          }}
          closeOnClickOutside
        />
      )}

      {!isFirstLoading && isSpinner && <Loading />}
      <ToastContainer />
    </div>
  );
};

export default App;
