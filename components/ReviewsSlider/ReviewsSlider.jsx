"use client";

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import './ReviewsSlider.css';

function ReviewsSlider({ reviews = [], loading = true }) {
    const splideRef = useRef(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const handlePrevClick = () => {
        if (splideRef.current) splideRef.current.splide.go('<');
    };

    const handleNextClick = () => {
        if (splideRef.current) splideRef.current.splide.go('>');
    };

    const handleMove = () => {
        if (splideRef.current) {
            const splide = splideRef.current.splide;
            const endIndex = splide?.Components?.Controller?.getEnd?.() ?? (splide.length - 1);
            setCanScrollPrev(splide.index > 0);
            setCanScrollNext(splide.index < endIndex);
        }
    };

    return (
        <div className="reviews-slider">
            <button
                className={`reviews-arrow reviews-arrow--prev ${!canScrollPrev ? 'disabled' : ''}`}
                onClick={handlePrevClick}
                disabled={!canScrollPrev}
                aria-label="Попередній відгук"
            >
                <svg className="reviews-arrow__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 4L7 12l8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <Splide
                ref={splideRef}
                options={{
                    perPage: 1,
                    gap: '24px',
                    arrows: false, 
                    pagination: false,
                    type: 'slide',
                    autoplay: false,
                    rewind: false, 
                }}
                onMounted={handleMove}
                onMove={handleMove}
                aria-label="Слайдер відгуків"
                className="reviews-slider__track"
            >
                {loading
                    ? [1, 2, 3].map((i) => (
                          <SplideSlide key={`ph-${i}`} className="reviews-slide">
                              <div className="review_card review_card--slider placeholder">
                                  <div className="review_header placeholder" />
                                  <div className="review_text">Завантаження...</div>
                              </div>
                          </SplideSlide>
                      ))
                    : reviews.map((review) => (
                          <SplideSlide key={review.id} className="reviews-slide">
                              <div className="review_card review_card--slider">
                                  <div className="review_header">
                                      <Image
                                          src={review.avatar}
                                          alt={review.name}
                                          className="review_avatar"
                                          width={60}
                                          height={60}
                                          sizes="60px"
                                          loading="lazy"
                                      />
                                      <div className="review_info">
                                          <h4 className="review_name">{review.name}</h4>
                                          <div className="review_rating">
                                              <span>{review.rating}</span>
                                          </div>
                                      </div>
                                  </div>
                                  <p className="review_text">{review.text}</p>
                              </div>
                          </SplideSlide>
                      ))}
            </Splide>

            <button
                className={`reviews-arrow reviews-arrow--next ${!canScrollNext ? 'disabled' : ''}`}
                onClick={handleNextClick}
                disabled={!canScrollNext}
                aria-label="Наступний відгук"
            >
                <svg className="reviews-arrow__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

export default ReviewsSlider;
