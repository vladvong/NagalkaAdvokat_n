"use client";

import React, { useState, useEffect } from 'react';
import './Home.css';
import { useLanguage } from '../../context/useLanguage';
import { IMAGES } from '@/constants/images';
import Preloader from '../Preloader/Preloader';
import Slider from '../Slider/Slider';
import ReviewsSlider from '../ReviewsSlider/ReviewsSlider';
    
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

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
            <div className="hero" role="region" aria-label="Головний екран">
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
            </div>
            
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
            
            <div className="about" id="about" role="region" aria-label="Про мене">
                <div className="container">
                    <div className="about_wrapper">
                        <div className="about_image">
                            <img
                                src={IMAGES.PHOTO_ABOUT}
                                alt="Фото про адвоката"
                                width="800"
                                height="600"
                                loading="lazy"
                                decoding="async"
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
                                    <div>
                                        <img src={IMAGES.ABOUT_1} alt="Логотип організації 1" width="180" height="180" loading="lazy" decoding="async" />
                                    </div>
                                    <div>
                                        <img src={IMAGES.ABOUT_2} alt="Логотип організації 2" width="180" height="180" loading="lazy" decoding="async" />
                                    </div>
                                    <div>
                                        <img src={IMAGES.ABOUT_3} alt="Логотип організації 3" width="180" height="180" loading="lazy" decoding="async" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="competencies_wrapper" id="competencies" role="region" aria-label="Компетенції">
                <div className="container">
                    <div className="competencies_text">
                        <h2>{t('home.competencies_title')}</h2>
                        <p>{t('home.competencies_subtitle')}</p>
                    </div>
                    <div className="competencies_accordion">
                        <details>
                            <summary><span></span>{t('home.competency_1')}</summary>
                            <div className="details_text">
                                <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
                            </div>
                        </details>
                        <details>
                            <summary><span></span>{t('home.competency_2')}</summary>
                            <div className="details_text">
                                <p>Epcot is a theme park at Walt Disney World Resort featuring exciting attractions, international pavilions, award-winning fireworks and seasonal special events.</p>
                            </div>
                        </details>
                        <details>
                            <summary><span></span>{t('home.competency_3')}</summary>
                            <div className="details_text">
                                <p>Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....Бла бла....</p>
                            </div>

                        </details>
                    </div>
                </div>
            </div>
            <div className="project" id="projects" role="region" aria-label="Проєкти">
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
            </div>
            <div className="reviews" role="region" aria-label="Відгуки клієнтів">
                <div className="container">
                    <div className="reviews_wrapper">
                        <div className="reviews_text feature-block">
                            <h2 className="feature-block__title">{t('reviews.title')}</h2>
                            <p className="feature-block__subtitle">{t('reviews.subtitle')}</p>
                        </div>
                        <div className="reviews_slide_wrapper">
                            <ReviewsSlider />
                        </div>
                    </div>
                    <div className="reviews_items">
                        <div className="review_card">
                            <div className="review_header">
                                <img src={IMAGES.PHOTO_ABOUT} alt="Клієнт" className="review_avatar" width="60" height="60" loading="lazy" decoding="async" />
                                <div className="review_info">
                                    <h4 className="review_name">Іван Петренко</h4>
                                    <div className="review_rating">
                                        <span>★★★★★</span>
                                    </div>
                                </div>
                            </div>
                            <p className="review_text">Чудовий адвокат! Допоміг мені розібратися з усіма складностями справи. Дуже професійний підхід.</p>
                        </div>
                        <div className="review_card">
                            <div className="review_header">
                                <img src={IMAGES.PHOTO_ABOUT} alt="Клієнт" className="review_avatar" width="60" height="60" loading="lazy" decoding="async" />
                                <div className="review_info">
                                    <h4 className="review_name">Марія Коваленко</h4>
                                    <div className="review_rating">
                                        <span>★★★★★</span>
                                    </div>
                                </div>
                            </div>
                            <p className="review_text">Дуже задоволена результатом. Ярослав забезпечив мені найкращий результат у справі.</p>
                        </div>
                        <div className="review_card">
                            <div className="review_header">
                                <img src={IMAGES.PHOTO_ABOUT} alt="Клієнт" className="review_avatar" width="60" height="60" loading="lazy" decoding="async" />
                                <div className="review_info">
                                    <h4 className="review_name">Олег Сидоренко</h4>
                                    <div className="review_rating">
                                        <span>★★★★★</span>
                                    </div>
                                </div>
                            </div>
                            <p className="review_text">Рекомендую всім! Адвокат знає своє діло і завжди готов допомогти.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="CollaborationModel" role="region" aria-label="Модель співпраці">
                <div className="container">
                    <div className="CollaborationModel_text feature-block">
                        <h2 className="feature-block__title">{t('home.collaboration_title')}</h2>
                        <p className="feature-block__subtitle">{t('home.collaboration_subtitle')}</p>
                    </div>
                </div>
                <div className="CollaborationModel_rings_wrapper">
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
            </div>

            <div className="kontakts" id="kontakt" role="region" aria-label="Контакти">
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
                                    <a href="#"><img src={IMAGES.INSTAGRAM_KONT} alt="Instagram" width="24" height="24" loading="lazy" decoding="async" /></a>
                                    <a href="#"><img src={IMAGES.FACEBOOK_KONT} alt="Facebook" width="24" height="24" loading="lazy" decoding="async" /></a>
                                </div>
                            </div>
                            <div className="kontakts_wrapper_info-item last-item">
                                <h3>{t('footer.title')}</h3>
                                <p>{t('footer.subtitle')}</p>
                            </div>
                        </div>
                        <div className="kontakts_wrapper_map" id="map-container">
                            {showMap ? (
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3053.964465633042!2d30.518324276860387!3d50.43904808818426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4cefe5aff722d%3A0x6e4e8a54da9e7e78!2z0YPQuy4g0KjQvtGC0LAg0KDRg9GB0YLQsNCy0LXQu9C4LCAxMSwg0JrQuNC10LIsINCj0LrRgNCw0LjQvdCwLCAwMjAwMA!5e1!3m2!1sru!2sde!4v1769123502266!5m2!1sru!2sde"
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                    style={{ border: 0, width: '100%', height: '100%' }}
                                    allowFullScreen
                                    title="Google Maps"
                                />
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
            </div >
        </main >
    );
};