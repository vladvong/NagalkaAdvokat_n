"use client";

import React, { useRef, useState } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { IMAGES } from '@/constants/images';
import './Slider.css';

function Slider({ children } = {}) {
    const splideRef = useRef(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const projects = [
        {
            id: 1,
            title: 'Проєкт 1',
            description: 'Опис першого проєкту',
            image: IMAGES.PROJ
        },
        {
            id: 2,
            title: 'Проєкт 2',
            description: 'Опис другого проєкту',
            image: IMAGES.PROJ
        },
        {
            id: 3,
            title: 'Проєкт 3',
            description: 'Опис третього проєкту',
            image: IMAGES.PROJ
        },
    ];

    const handlePrevClick = () => {
        if (splideRef.current) {
            splideRef.current.splide.go('<');
        }
    };

    const handleNextClick = () => {
        if (splideRef.current) {
            splideRef.current.splide.go('>');
        }
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
        <div className="slider-wrapper">
            <button 
                className={`slider-arrow slider-arrow--prev ${!canScrollPrev ? 'disabled' : ''}`}
                onClick={handlePrevClick}
                disabled={!canScrollPrev}
                aria-label="Попередній слайд"
            >
                <svg className="slider-arrow__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 4L7 12l8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <Splide
                ref={splideRef}
                options={{
                    perPage: 3,
                    gap: '24px',
                    arrows: false,
                    pagination: false,
                    type: 'slide',
                    autoplay: false,
                    breakpoints: {
                        1440: {
                            perPage: 2,
                            gap: '20px',
                        },
                        768: {
                            perPage: 1,
                            gap: '16px',
                        },
                    },
                }}
                onMounted={(splide) => handleMove()}
                onMove={() => handleMove()}
                aria-label="Слайдер проєктів"
                className="slider-container"
            >
                {children ? children : projects.map((project) => (
                    <SplideSlide key={project.id} className="splide-slide">
                        <div
                            className="project-card"
                            style={{ backgroundImage: `url(${project.image})` }}
                        >
                            <div className="project-content">
                                <div className="project-title-wrapper">
                                    <h3 className="project-title">{project.title}</h3>
                                </div>
                                <div className="project-bottom">
                                    <p className="project-description">{project.description}</p>
                                    <a href="#" className="project-link">Читати далі →</a>
                                </div>
                            </div>
                        </div>
                    </SplideSlide>
                ))}
            </Splide>
            
            <button 
                className={`slider-arrow slider-arrow--next ${!canScrollNext ? 'disabled' : ''}`}
                onClick={handleNextClick}
                disabled={!canScrollNext}
                aria-label="Наступний слайд"
            >
                <svg className="slider-arrow__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </div>
    );
}

export default Slider;
