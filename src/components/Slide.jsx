export default function Slide({ slide = {} }) {
  const { title = '', subtitle = '', bullets = [], images = [], type = 'default' } = slide;

  // Title Slide
  if (type === 'titleSlide') {
    return (
      <section className="slideCanvas titleSlide">
        <div className="titleLeft">
          <h1 className="titleMain">{title}</h1>
          {subtitle && <p className="titleSub">{subtitle}</p>}
          <div className="molbioLogo">
            <svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
              {/* Molbio Logo placeholder - red curved design */}
              <text x="20" y="50" fontSize="24" fontWeight="bold" fill="#dc2626">molbio</text>
              <text x="20" y="70" fontSize="10" fill="#333">INNOVATE • IMPACT • INSPIRE</text>
            </svg>
          </div>
        </div>
        <div className="titleRight">
          {/* Placeholder for building image - gradient background */}
          <div className="buildingPlaceholder"></div>
        </div>
      </section>
    );
  }

  // Default slide
  return (
    <section className="slideCanvas">
      <h1>{title}</h1>
      {bullets.length > 0 && (
        <ul>
          {bullets.map((bullet, idx) => (
            <li key={idx}>{bullet}</li>
          ))}
        </ul>
      )}
      {images.length > 0 && (
        <div className="images">
          {images.map((img, idx) => (
            <img key={idx} src={img.url} alt={img.name} />
          ))}
        </div>
      )}
    </section>
  );
}
