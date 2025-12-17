import { useState, useEffect } from 'react';
import slides from '../slides/slides.json';
import Slide from './Slide';

export default function Deck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slideList = slides.slides || [];
  const active = slideList[activeIndex] || {};

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') setActiveIndex(Math.max(0, activeIndex - 1));
      if (e.key === 'ArrowRight') setActiveIndex(Math.min(slideList.length - 1, activeIndex + 1));
      if (e.key === 'Home') setActiveIndex(0);
      if (e.key === 'End') setActiveIndex(slideList.length - 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, slideList.length]);

  return (
    <div className="deckShell">
      <aside className="deckSidebar">
        <div className="sidebarHeader">Slides ({slideList.length})</div>
        {slideList.map((s, idx) => (
          <button
            key={s.id}
            className={`sidebarItem ${activeIndex === idx ? 'active' : ''}`}
            onClick={() => setActiveIndex(idx)}
          >
            {idx + 1}. {s.title}
          </button>
        ))}
      </aside>
      <main className="deckMain">
        {slideList.length > 0 ? (
          <>
            <Slide slide={active} />
            <div className="slideNav">
              <button onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}>← Prev</button>
              <span>{activeIndex + 1} / {slideList.length}</span>
              <button onClick={() => setActiveIndex(Math.min(slideList.length - 1, activeIndex + 1))}>Next →</button>
            </div>
          </>
        ) : (
          <section className="slideCanvas empty">
            <p>No slides yet. Add content to get started.</p>
          </section>
        )}
      </main>
    </div>
  );
}
