"use client";

import { useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import "@splidejs/react-splide/css";
import "./NewReviewSlider.css";

export default function NewReviewSlider({ reviews = [], loading }) {
    const splideRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(true);

    const updateArrows = () => {
        const splide = splideRef.current?.splide;
        if (!splide) return;

        const end = splide.Components.Controller.getEnd();
        setCanPrev(splide.index > 0);
        setCanNext(splide.index < end);
    };

    return (
        <div className="reviews-slider-wrapper">
            {/* LEFT ARROW */}
            <button
                className={`new-slider-arrow new-slider-arrow--prev ${!canPrev ? "disabled" : ""}`}
                onClick={() => splideRef.current?.splide.go("<")}
                disabled={!canPrev}
                aria-label="Previous review"
            >
                <svg viewBox="0 0 24 24">
                    <path d="M15 4L7 12l8 8" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            </button>

            {/* SLIDER */}
            <Splide
                ref={splideRef}
                options={{
                    perPage: 3,
                    gap: "24px",
                    arrows: false,
                    pagination: false,
                    breakpoints: {
                        1024: { perPage: 2 },
                        768: { perPage: 1 },
                    },
                }}
                onMounted={updateArrows}
                onMove={updateArrows}
            >
                {loading
                    ? [1, 2, 3].map((i) => (
                          <SplideSlide key={i}>
                              <div className="new-review_card skeleton" />
                          </SplideSlide>
                      ))
                    : reviews.map((review) => (
                          <SplideSlide key={review.id}>
                              <div className="new-review_card">
                                  <div className="review_header">
                                      <Image
                                          src={review.avatar}
                                          alt={review.name}
                                          width={60}
                                          height={60}
                                          className="review_avatar"
                                      />
                                      <div className="review_info">
                                          <h4 className="review_name">{review.name}</h4>
                                          <div className="review_rating">{review.rating}</div>
                                      </div>
                                  </div>
                                  <p className="review_text">{review.text}</p>
                              </div>
                          </SplideSlide>
                      ))}
            </Splide>

            {/* RIGHT ARROW */}
            <button
                className={`new-slider-arrow new-slider-arrow--next ${!canNext ? "disabled" : ""}`}
                onClick={() => splideRef.current?.splide.go(">")}
                disabled={!canNext}
                aria-label="Next review"
            >
                <svg viewBox="0 0 24 24">
                    <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
            </button>
        </div>
    );
}
