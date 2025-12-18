// Quick integration guide for App.jsx
// Add these changes to implement fast loading

// 1. Add imports at the top of App.jsx (after existing imports):
import LoadingScreen from './components/LoadingScreen';
import { useImagePreload } from './hooks/useImagePreload';

// 2. Define critical images array (after imports, before component):
const criticalImages = [
  '/molbio-black-logo.png',
  '/Global regitrations/01.png',
  '/Global regitrations/02.png',
  '/Global regitrations/03.png',
  '/Global regitrations/04.png',
  '/Global regitrations/05.png',
  '/Global regitrations/06.png',
  '/WHO/who.png',
  '/implementation1.png',
  '/implementation2.png',
  '/certtificates/MDSAP.png',
  '/certtificates/EVIVDR.png',
  '/certtificates/ISO.png',
  '/submitted image.jpg',
];

// 3. Inside App component (after all useState declarations):
const { imagesLoaded, loadProgress } = useImagePreload(criticalImages);

// 4. Add early return for loading state (before the main return):
if (!imagesLoaded) {
  return <LoadingScreen progress={loadProgress} />;
}

// 5. Add loading="lazy" to non-critical images in JSX:
// For tables and detail images that appear later:
<img src="/certtificates/MDSAP.png" alt="MDSAP" loading="lazy" />

// 6. Add error handling for images:
<img 
  src={imageSrc}
  alt={altText}
  onError={(e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.src = '/molbio-black-logo.png'; // Fallback
  }}
/>

// EXAMPLE: Complete integration at the top of App component
function App() {
  // Add this after all your existing useState declarations
  const { imagesLoaded, loadProgress } = useImagePreload(criticalImages);
  
  // Existing useRef declarations...
  const contentsRef = useRef(null);
  // ... rest of your refs
  
  // Existing useState declarations...
  const [showSections, setShowSections] = useState(false);
  // ... rest of your state
  
  // Early return for loading
  if (!imagesLoaded) {
    return <LoadingScreen progress={loadProgress} />;
  }
  
  // ... rest of your existing code
  return (
    <div className="singlePageLayout">
      {/* Your existing JSX */}
    </div>
  );
}
