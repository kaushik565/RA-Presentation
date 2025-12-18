// Image preloading hook
import { useEffect, useState } from 'react';

export const useImagePreload = (imageUrls) => {
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [loadProgress, setLoadProgress] = useState(0);

    useEffect(() => {
        let loadedCount = 0;
        const totalImages = imageUrls.length;

        const loadImage = (url) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    setLoadProgress(Math.round((loadedCount / totalImages) * 100));
                    resolve(url);
                };
                img.onerror = reject;
                img.src = url;
            });
        };

        Promise.all(imageUrls.map(loadImage))
            .then(() => {
                setImagesLoaded(true);
            })
            .catch((err) => {
                console.error('Error loading images:', err);
                setImagesLoaded(true); // Continue even if some images fail
            });
    }, [imageUrls]);

    return { imagesLoaded, loadProgress };
};

// Usage in App.jsx:
// const criticalImages = [
//   '/molbio-black-logo.png',
//   '/Global regitrations/01.png',
//   '/WHO/who.png',
//   '/implementation1.png',
//   '/certtificates/MDSAP.png',
//   '/certtificates/EVIVDR.png',
//   '/certtificates/ISO.png',
// ];
// const { imagesLoaded, loadProgress } = useImagePreload(criticalImages);