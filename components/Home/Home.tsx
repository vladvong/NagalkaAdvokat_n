"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import './Home.css';
import { useLanguage } from '../../context/useLanguage';
import { IMAGES } from '@/constants/images';
import Preloader from '../Preloader/Preloader';
import NewReviewSlider from '../NewReviewSlider/NewReviewSlider';
const Slider = dynamic(() => import('../Slider/Slider'), {
    ssr: false,
    loading: () => <div className="project_slider__placeholder" aria-hidden="true" />,
});

const ReviewsSlider = dynamic(() => import('../ReviewsSlider/ReviewsSlider'), {
    ssr: false,
    loading: () => <div className="reviews_slider__placeholder" aria-hidden="true" />,
});
    
// Компонент Counter для анімованого лічення
const Counter = ({ target, suffix = '', prefix = '', isLoaded }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isLoaded) return;

        let current = 0;
        const increment = target / 20;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, 50);

        return () => clearInterval(timer);
    }, [isLoaded, target]);

    return <span>{prefix}{count}{suffix}</span>;
};

export default function Home() {
    const { t } = useLanguage();
    const [isLoaded, setIsLoaded] = useState(false);
    const [formData, setFormData] = useState({ phone: '' });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const ringsWrapperRef = useRef<HTMLDivElement | null>(null);
    const [ringsAnimated, setRingsAnimated] = useState(false);

    useEffect(() => {
        // Симуляция загрузки - 2 секунды
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const mapContainer = document.getElementById('map-container');
        if (!mapContainer) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShowMap(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        observer.observe(mapContainer);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const target = ringsWrapperRef.current;
        if (!target || ringsAnimated) return;

        let lockTimeout: ReturnType<typeof setTimeout> | null = null;

        const lockScroll = () => {
            document.documentElement.classList.add('scroll-lock');
            document.body.classList.add('scroll-lock');
        };

        const unlockScroll = () => {
            document.documentElement.classList.remove('scroll-lock');
            document.body.classList.remove('scroll-lock');
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRingsAnimated(true);
                    lockScroll();
                    lockTimeout = setTimeout(unlockScroll, 1800);
                    observer.disconnect();
                }
            },
            { threshold: 0.55 }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
            if (lockTimeout) clearTimeout(lockTimeout);
            unlockScroll();
        };
    }, [ringsAnimated]);

    // Fetch competences from Strapi API (no pagination, title + description only)
    const [competences, setCompetences] = useState([]);
    const [competencesLoading, setCompetencesLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const fetchCompetences = async () => {
            setCompetencesLoading(true);
            try {
                const res = await fetch('https://determined-desk-f2e043cadd.strapiapp.com/api/competences?sort=createdAt:desc&populate=*', {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API}`,
                    },
                });
                if (!res.ok) {
                    if (mounted) setCompetences([]);
                    if (mounted) setCompetencesLoading(false);
                    return;
                }
                const json = await res.json();
                const items = (json.data || []).map((item) => {
                    const paragraphs: string[] = (item.paragraphs || []).map((p) => p.text || '');

                    return {
                        id: item.id,
                        title: item.title || '',
                        description: item.description || '',
                        paragraphs, 
                    };
                });

                if (mounted) {
                    setCompetences(items);
                    setCompetencesLoading(false);
                }
            } catch (err) {
                if (mounted) setCompetencesLoading(false);
            }
        };

        fetchCompetences();
        return () => { mounted = false; };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [allReviews, setAllReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const [reviewPhotos, setReviewPhotos] = useState([]);
    const [reviewPhotosLoading, setReviewPhotosLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const fetchReviewPhotos = async () => {
            try {
                const res = await fetch(
                    'https://determined-desk-f2e043cadd.strapiapp.com/api/photo-reviews?sort=createdAt:desc&populate=image',
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API}`,
                        },
                    }
                );

                if (!res.ok) {
                    throw new Error('Failed to fetch review photos');
                }

                const json = await res.json();

                const items = (json.data ?? []).map((item: any) => {
                    const img = item.image;

                    if (!img) return null;

                    // priority: medium → small → thumbnail → original
                    const selected =
                        img.formats?.medium ||
                        img.formats?.small ||
                        img.formats?.thumbnail ||
                        img;

                    const url = selected.url.startsWith('http')
                        ? selected.url
                        : `https://determined-desk-f2e043cadd.media.strapiapp.com${selected.url}`;

                    return {
                        id: item.id,
                        image: url,
                        width: selected.width ?? 800,
                        height: selected.height ?? 600,
                    };
                }).filter(Boolean);

                if (mounted) {
                    setReviewPhotos(items);
                    setReviewPhotosLoading(false);
                }
            } catch (error) {
                console.error('Photo reviews error:', error);
                if (mounted) {
                    setReviewPhotos([]);
                    setReviewPhotosLoading(false);
                }
            }
        };

        fetchReviewPhotos();

        return () => {
            mounted = false;
        };
    }, []);



    useEffect(() => {
        let mounted = true;

        const fetchReviews = async () => {
            try {
                const res = await fetch(
                    'https://determined-desk-f2e043cadd.strapiapp.com/api/reviews?sort=createdAt:desc&populate=*',
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API}`,
                        },
                    }
                );

                if (!res.ok) throw new Error('Failed to fetch reviews');

                const json = await res.json();

                const items = (json.data || []).map((item) => {
                    const imageMeta =
                        item.image?.formats?.thumbnail || item.image || null;
                    const imageUrl = imageMeta?.url
                        ? imageMeta.url.startsWith('http')
                            ? imageMeta.url
                            : `https://determined-desk-f2e043cadd.strapiapp.com${imageMeta.url}`
                        : IMAGES.DEFAULT_AVATAR;

                    return {
                        id: item.id,
                        name: item.name || 'Anonymous',
                        text: item.comment || '',
                        rating: '★'.repeat(item.rating || 5),
                        avatar: imageUrl,
                    };
                });

                if (mounted) {
                    setAllReviews(items);  // store ALL reviews here
                    setReviewsLoading(false);
                }
            } catch (err) {
                if (mounted) {
                    setAllReviews([]);
                    setReviewsLoading(false);
                }
            }
        };

        fetchReviews();
        return () => { mounted = false; };
    }, []);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        // Тут можна додати логіку відправки форми
        try {
            // Приклад: відправка на backend
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // });

            // Для демо просто показуємо успіх
            setTimeout(() => {
                setStatus('success');
                setFormData({ phone: '' });
                setLoading(false);
            }, 1000);
        } catch (error) {
            setStatus('error');
            setLoading(false);
        }
    };

    return (
        <main>
            <Preloader isVisible={!isLoaded} />
            <section className="hero" aria-label="Головний екран">
                <div className="container hero__container">
                    <div className="hero__overlay">
                        <div className="hero__text">
                            <h1 className="hero__title">{t('header.hero_title')}</h1>
                            <p className="hero__subtitle">{t('header.hero_subtitle')}</p>
                        </div>
                        <div className="stats stats--desktop">
                            <div className="stat">
                                <Counter target={8} suffix=" +" isLoaded={isLoaded} />
                                <p>{t('header.stat_experience')}</p>
                            </div>

                            <div className="stat">
                                <Counter target={200} suffix=" +" isLoaded={isLoaded} />
                                <p>{t('header.stat_victories')}</p>
                            </div>
                            <div className="stat">
                                <Counter target={100} prefix="$" suffix=" млн +" isLoaded={isLoaded} />
                                <p>{t('header.stat_recovered')}</p>
                            </div>
                            <div className="stat">
                                <Counter target={1.2} prefix="₴" suffix=" млрд +" isLoaded={isLoaded} />
                                <p>{t('header.stat_cancelled')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <div className="stats-mobile">
                <div className="container">
                    <div className="stats stats--mobile">
                        <div className="stat">
                            <Counter target={8} suffix=" +" isLoaded={isLoaded} />
                            <p>{t('header.stat_experience')}</p>
                        </div>
                        <div className="stat">
                            <Counter target={90} suffix=" +" isLoaded={isLoaded} />
                            <p>{t('header.stat_deals')}</p>
                        </div>
                        <div className="stat">
                            <Counter target={200} suffix=" +" isLoaded={isLoaded} />
                            <p>{t('header.stat_victories')}</p>
                        </div>
                        <div className="stat">
                            <Counter target={100} prefix="$" suffix="+ млн " isLoaded={isLoaded} />
                            <p>{t('header.stat_recovered')}</p>
                        </div>
                        <div className="stat">
                            <Counter target={1.2} prefix="₴" suffix="+ млрд " isLoaded={isLoaded} />
                            <p>{t('header.stat_cancelled')}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <section className="about" id="about" aria-label="Про мене">
                <div className="container">
                    <div className="about_wrapper">
                        <div className="about_image">
                            <Image
                                src={IMAGES.PHOTO_ABOUT}
                                alt="Фото про адвоката"
                                width={800}
                                height={600}
                                sizes="(max-width: 768px) 100vw, 800px"
                                loading="lazy"
                            />
                        </div>
                        <div className="about_info_wrapper">
                            <div className="about_info_text">
                                <div className="about_info_text-title">
                                    <h2>{t('home.about_title')}</h2>
                                    <p>{t('home.about_subtitle')}</p>
                                </div>
                                <div className="about_info_description">
                                    <p>{t('home.about_description')}</p>
                                </div>
                            </div>
                            <div className="about_info_subsection">
                                <h2>{t('home.memberships')}</h2>
                                <div className="about_info_subsection_list">
                                    <div className='about_info_subsection_item'>
                                        <Image src={IMAGES.ABOUT_1} alt="Логотип організації 1" width={180} height={180} sizes="180px" loading="lazy" />
                                        <p>{t('home.memberships')}</p>
                                   </div>
                                    <div className='about_info_subsection_item'>
                                        <Image src={IMAGES.ABOUT_2} alt="Логотип організації 2" width={180} height={180} sizes="180px" loading="lazy" />
                                        <p>{t('home.memberships_list')}</p>
                                    </div>
                                    <div>
                                        <Image src={IMAGES.ABOUT_3} alt="Логотип організації 3" width={180} height={180} sizes="180px" loading="lazy" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="competencies_wrapper" id="competencies" aria-label="Компетенції">
                <div className="container">
                    <div className="competencies_text">
                        <h2>{t('home.competencies_title')}</h2>
                        <p>{t('home.competencies_subtitle')}</p>
                    </div>
                    <div className="competencies_accordion">
                    {competencesLoading ? (
                        <p>Loading competences...</p>
                    ) : (
                        competences.map((item) => (
                        <details key={item.id} className="competency-item">
                            <summary className="competency-title">{item.title}</summary>
                            <div className="competency-content">
                            {item.paragraphs.length > 0 && (
                                <ul className="competency-list">
                                    {item.paragraphs.map((p, idx) => (
                                        <li key={idx} className="competency-list-item">{p}</li>
                                    ))}
                                </ul>
                            )}
                            {item.description && (
                                <p className="competency-description">
                                Для кого: {item.description}
                                </p>
                            )}
                            </div>
                        </details>
                        ))
                    )}
                    </div>
                </div>
            </section>
            <section className="project" id="projects" aria-label="Проєкти">
                <div className="container">
                    <div className="project_wrapper">
                        <div className="project_text feature-block">
                            <h2 className="feature-block__title">{t('home.projects_title')}</h2>
                            <p className="feature-block__subtitle">{t('home.projects_subtitle')}</p>
                        </div>
                        <div className="project_slider">
                            <Slider />
                        </div>
                    </div>
                </div>
            </section>
            <section className="reviews" aria-label="Відгуки клієнтів">
                <div className="container">
                    <div className="reviews_wrapper">
                        <div className="reviews_text feature-block">
                            <h2 className="feature-block__title">{t('reviews.title')}</h2>
                            <p className="feature-block__subtitle">{t('reviews.subtitle')}</p>
                        </div>
                        <div className="reviews_slide_wrapper">
                            <ReviewsSlider reviews={reviewPhotos} loading={reviewPhotosLoading} />
                        </div>
                    </div>
                    <div className="reviews_items">
                            <NewReviewSlider reviews={allReviews} loading={reviewsLoading} />
                    </div>
                </div>
            </section>
            <section className="CollaborationModel" aria-label="Модель співпраці">
                <div className="container">
                    <div className="CollaborationModel_text feature-block">
                        <h2 className="feature-block__title">{t('home.collaboration_title')}</h2>
                        <p className="feature-block__subtitle">{t('home.collaboration_subtitle')}</p>
                    </div>
                </div>
                <div
                    className={`CollaborationModel_rings_wrapper ${ringsAnimated ? 'rings-animated' : ''}`}
                    ref={ringsWrapperRef}
                >
                    <div className="container">
                        <div className="CollaborationModel_rings_items">
                            <div className="CollaborationModel_rings_item">
                                <div className="ring ring-1"><p>{t('home.step_1_title')}</p></div>
                                <div className="ring_text">
                                    <p>{t('home.step_1_text')}</p>
                                </div>
                            </div>
                            <div className="CollaborationModel_rings_item">
                                <div className="ring ring-1"><p>{t('home.step_2_title')}</p></div>
                                <div className="ring_text">
                                    <p>{t('home.step_2_text')}</p>
                                </div>
                            </div>
                            <div className="CollaborationModel_rings_item">
                                <div className="ring ring-2"><p>{t('home.step_3_title')}</p></div>
                                <div className="ring_text">
                                    <p>{t('home.step_3_text')}</p>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            <section className="kontakts" id="kontakt" aria-label="Контакти">
                <div className="container">
                    <div className="kontakts_wrapper_text feature-block">
                        <h2 className="feature-block__title">{t('contact.title')}</h2>
                    </div>
                    <div className="kontakts_wrapper">
                        <div className="kontakts_wrapper_info">
                            <div className="kontakts_wrapper_info-item">
                                <h3>{t('footer.address_label')}</h3>
                                <p>{t('footer.address')}</p>
                            </div>
                            <div className="kontakts_wrapper_info-item">
                                <h3>{t('footer.email_label')}</h3>
                                <p>{t('footer.email')}</p>
                            </div>
                            <div className="kontakts_wrapper_info-item">
                                <h3>{t('footer.phone_label')}</h3>
                                <p>{t('footer.phone')}</p>
                            </div>
                            <div className="kontakts_wrapper_info-item">
                                <h3>{t('footer.social_heading')}</h3>
                                <div className="kontakts_links">
                                    <a href="#"><Image src={IMAGES.INSTAGRAM_KONT} alt="Instagram" width={24} height={24} sizes="24px" loading="lazy" /></a>
                                    <a href="#"><Image src={IMAGES.FACEBOOK_KONT} alt="Facebook" width={24} height={24} sizes="24px" loading="lazy" /></a>
                                    <a href="#"><Image src={IMAGES.LINKEDIN_DARK} alt="Instagram" width={24} height={24} sizes="24px" loading="lazy" /></a>
                                    <a href="#"><Image src={IMAGES.YOUTUBE_DARK} alt="Facebook" width={24} height={24} sizes="24px" loading="lazy" /></a>
                                </div>
                            </div>
                            <div className="kontakts_wrapper_info-item last-item">
                                <h3>{t('footer.title')}</h3>
                                <p>{t('footer.subtitle')}</p>
                            </div>
                        </div>
                        <div className="kontakts_wrapper_map" id="map-container">
                            {showMap ? (
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3053.964684239391!2d30.520899200000006!3d50.4390447!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cfb2f78f081b%3A0xc8a631e5a0c305b8!2z0JDQtNCy0L7QutCw0YIg0J3QsNCz0LDQu9C60LAg0K_RgNC-0YHQu9Cw0LI!5e1!3m2!1suk!2sde!4v1770854516380!5m2!1suk!2sde" width="600" height="450" style={{border: 0}} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                            ) : (
                                <button className="map-placeholder" onClick={() => setShowMap(true)}>
                                    Завантажити карту
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="kontakts_wrapper_feedback">
                        <h3>{t('contact.feedback_title')}</h3>
                        <p>{t('contact.feedback_description')}</p>
                        <form className="kontakts_form" onSubmit={handleSubmit}>
                            <div className="form_group">
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Ваш телефон"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                    className="kontakts_input"
                                />

                            </div>
                            <button type="submit" className="kontakts_button" disabled={loading}>
                                {loading ? t('contact.form_sending') : t('contact.form_send')}
                            </button>
                            {status === 'success' && (
                                <p className="form_message success">{t('contact.form_success')}</p>
                            )}
                            {status === 'error' && (
                                <p className="form_message error">{t('contact.form_error')}</p>
                            )}
                        </form>
                    </div>
                </div>
            </section >
        </main >
    );
};