'use client';

import Image from 'next/image';
import '@/styles/storiesSlider.css';
import { useState, useEffect, useRef } from 'react';

const AUTO_DURATION = 5000;

export default function StoriesSlider() {
  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    async function fetchStories() {
      try {
        const res = await fetch('https://furssati.io/wp-json/wp/v2/stori?_embed');
        const data = await res.json();

        const images = data.map((item) =>
          item._embedded?.['wp:featuredmedia']?.[0]?.source_url || null
        );

        setStories(images.filter(Boolean));
      } catch (err) {
        console.error('فشل تحميل الستوريز:', err);
      }
    }

    fetchStories();
  }, []);

  const startTimer = () => {
    clearTimeout(timerRef.current);
    progressRef.current?.classList.remove('animate');
    void progressRef.current?.offsetWidth;
    progressRef.current?.classList.add('animate');

    timerRef.current = setTimeout(() => {
      if (activeIndex < stories.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else {
        setActiveIndex(null);
      }
    }, AUTO_DURATION);
  };

  const close = () => setActiveIndex(null);
  const next = () => {
    if (activeIndex < stories.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else {
      close();
    }
  };
  const prev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (activeIndex !== null) {
      startTimer();
    }
    return () => clearTimeout(timerRef.current);
  }, [activeIndex]);

  useEffect(() => {
    const handleKey = (e) => {
      if (activeIndex === null) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex]);

  return (
    <>
      <div className="story-thumbnails">
        {stories.map((img, index) => (
          <div
            key={index}
            className="story-circle"
            onClick={() => setActiveIndex(index)}
          >
            <Image src={img} alt={`story-${index}`} width={60} height={60} />
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <div className="story-fullscreen">
          <div className="progress-bar" ref={progressRef}></div>
          <button className="close-btn" onClick={close}>×</button>
          <button className="arrow-btn left" onClick={prev}>‹</button>
          <Image
            src={stories[activeIndex]}
            alt={`story-full-${activeIndex}`}
            width={700}
            height={700}
            className="story-full-image"
          />
          <button className="arrow-btn right" onClick={next}>›</button>
        </div>
      )}
    </>
  );
}
