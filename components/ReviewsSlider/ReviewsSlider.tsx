"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import "./ReviewsSlider.css";

export type ReviewPhoto = {
    id: number;
    image: string;
    width: number;
    height: number;
};

type Props = {
    reviews: ReviewPhoto[];
    loading?: boolean;
};

export default function ReviewsSlider({
    reviews = [],
    loading = true,
}: Props) {
    const splideRef = useRef<any>(null);
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
        <div className="reviews-slider">
           

            <Splide
                ref={splideRef}
                className="reviews-slider__track"
                options={{
                    perPage: 1, // ✅ ONE IMAGE ONLY
                    gap: "0px",
                    arrows: false,
                    pagination: false,
                    drag: true,
                    rewind: false,
                }}
                onMounted={updateArrows}
                onMove={updateArrows}
            >
                {loading
                    ? [1].map((i) => (
                          <SplideSlide key={i}>
                              <div className="review-photo-card skeleton" />
                          </SplideSlide>
                      ))
                    : reviews.map((r) => (
                          <SplideSlide key={r.id}>
                              <div className="review-photo-card">
                                  <Image
                                      src={r.image} // ✅ FIXED
                                      alt="Customer review photo"
                                      fill
                                      sizes="(max-width: 768px) 100vw, 600px"
                                      className="review-photo-img"
                                      priority
                                  />
                              </div>
                          </SplideSlide>
                      ))}
            </Splide>
        </div>
    );
}
