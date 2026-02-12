"use client";

import { useRef, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import Image from "next/image";
import "@splidejs/react-splide/css";
import "./NewReviewSlider.css";

export default function NewReviewSlider({ reviews = [], loading }) {
    const splideRef = useRef(null);

    return (
        
            <div className="reviews-slider-wrapper">

            {/* SLIDER */}
            <Splide
                ref={splideRef}
                options={{
                    type: "loop",
                    speed: 600,
                    perPage: 3,
                    gap: "24px",
                    arrows: false,
                    pagination: false,
                    autoplay: true,
                    interval: 3500,
                    pauseOnHover: true,
                    pauseOnFocus: true,
                    breakpoints: {
                        1200: { perPage: 2 },
                        768: { perPage: 1 },
                    },
                }}
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
        </div>
        
    );
}
