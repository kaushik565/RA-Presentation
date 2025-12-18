/* Performance CSS Additions - Add to App.css */

/* GPU Acceleration for animated elements */
.contentItem,
.licensingSection,
.whoTimelinePhaseHorizontal,
.qoSummaryCard,
.implCentered {
  transform: translateZ(0);
  backface-visibility: hidden;
  will-change: transform, opacity;
}

/* After animation complete, remove will-change to save memory */
.contentItem.reveal,
.licensingSection.animated {
  will-change: auto;
}

/* Contain layout changes within sections */
.heroSection,
.contentsSection,
.productLicensingSection,
.globalRegistrationsSection,
.whoTechnicalSection,
.qualityObjectivesSection,
.implementationSection {
  contain: layout style paint;
}

/* Optimize font rendering */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Reduce paint area for images */
img {
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
}

/* Smooth image loading */
img {
  opacity: 0;
  animation: fadeInImage 0.3s ease-in forwards;
}

@keyframes fadeInImage {
  to {
    opacity: 1;
  }
}

/* Optimize table rendering */
table {
  table-layout: fixed;
}

/* Reduce reflow on scroll */
.globalNavButtons {
  transform: translateZ(0);
  will-change: transform;
}

/* Optimize scroll performance */
html {
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch; /* For iOS devices */
}

/* Critical CSS - inline this in index.html for faster initial render */
/*
<style>
  #root { min-height: 100vh; }
  body { margin: 0; font-family: Arial, sans-serif; }
  .loadingScreen { 
    position: fixed; 
    inset: 0; 
    background: #dc2626;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
*/
