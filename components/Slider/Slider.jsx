"use client";

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { IMAGES } from '@/constants/images';
import Link from 'next/link';
import './Slider.css';

function Slider({ children } = {}) {
    const splideRef = useRef(null);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(true);

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchSliderProjects = async () => {
            const cacheKey = 'slider_projects_v1';
            const cacheTimeKey = `${cacheKey}_time`;
            const cacheExpiry = 5 * 60 * 1000; // 5 minutes

            const cachedData = localStorage.getItem(cacheKey);
            const cachedTime = localStorage.getItem(cacheTimeKey);
            const now = Date.now();

            if (cachedData && cachedTime && (now - parseInt(cachedTime)) < cacheExpiry) {
                const data = JSON.parse(cachedData);
                if (mounted) {
                    setProjects(data);
                    setLoading(false);
                }
                return;
            }

            try {
                const res = await fetch('https://determined-desk-f2e043cadd.strapiapp.com/api/projects?sort=createdAt:desc&pagination[page]=1&pagination[pageSize]=6&populate=*', {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API}`,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch slider projects');
                const json = await res.json();
                const items = (json.data || []).map((item) => ({
                    id: item.id,
                    documentId: item.documentId ?? item.attributes?.documentId ?? item.id,
                    title: item.title ?? item.attributes?.title ?? '',
                    description: item.subtitle ?? item.attributes?.subtitle ?? '',
                    image: item.image ?? item.attributes?.image ?? null,
                }));
                if (mounted) {
                    setProjects(items);
                    setLoading(false);
                }
                localStorage.setItem(cacheKey, JSON.stringify(items));
                localStorage.setItem(cacheTimeKey, now.toString());
            } catch (err) {
                if (mounted) {
                    setProjects([]);
                    setLoading(false);
                }
            }
        };

        fetchSliderProjects();
        return () => { mounted = false; };
    }, []);

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
                {children ? children : (loading ? (
                    [1,2,3].map((i) => (
                        <SplideSlide key={`ph-${i}`} className="splide-slide">
                            <div className="project-card project-card--placeholder">
                                <div className="project-card__image placeholder" />
                                <div className="project-content">
                                    <div className="project-title-wrapper">
                                        <h3 className="project-title">Завантаження...</h3>
                                    </div>
                                </div>
                            </div>
                        </SplideSlide>
                    ))
                ) : projects.map((project) => {
                    const imageMeta = project.image?.formats?.medium
                      || project.image?.formats?.small
                      || project.image?.formats?.thumbnail
                      || project.image
                      || null;
                    const rawImageUrl = imageMeta?.url ?? null;
                    const imageUrl = rawImageUrl
                      ? (rawImageUrl.startsWith('http') ? rawImageUrl : `https://determined-desk-f2e043cadd.strapiapp.com${rawImageUrl}`)
                      : IMAGES.PROJ;

                    return (
                        <SplideSlide key={project.id} className="splide-slide">
                            <Link href={`/projects/${project.documentId}`} className="project-card-link">
                                <div className="project-card">
                                    <Image
                                        src={imageUrl}
                                        alt={project.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="project-card__image"
                                    />
                                    <div className="project-content">
                                        <div className="project-title-wrapper">
                                            <h3 className="project-title">{project.title}</h3>
                                        </div>
                                        <div className="project-bottom">
                                            <p className="project-description">{project.description}</p>
                                            <span className="project-card-button">Переглянути проєкт</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SplideSlide>
                    );
                }))}
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
