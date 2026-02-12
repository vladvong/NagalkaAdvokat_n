"use client";

import './Header.css';
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/useLanguage';

export default function Header() {
    const { t, language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateHeader = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setIsHidden(true);
            } else if (currentScrollY < lastScrollY) {
                setIsHidden(false);
            }
            lastScrollY = currentScrollY;
            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLanguageChange = (lang) => {
        setLanguage(lang);
        setIsLangDropdownOpen(false);
    };

    return (
        <header className={`header ${isHidden ? 'header--hidden' : ''}`}>
                <div className="container">
                    <div className='header__wrapper'>
                        <div className="header__logo">
                            <a href="/" className="header__logo-link">
                                <span className="header__logo-title">{t('header.logo_title')}</span>
                                <span className="header__logo-subtitle">{t('header.logo_subtitle')}</span>
                            </a>
                        </div>
                       <nav className={`header__links ${isOpen ? 'header__links--open' : ''}`} aria-label="Головна навігація">
                            <button className="header__close" onClick={() => setIsOpen(false)}>✕</button>
                            <a href="/" className='header__link' onClick={() => setIsOpen(false)}>{t('header.nav_home')}</a>
                            <a href="/#competencies" className='header__link' onClick={() => setIsOpen(false)}>{t('header.nav_competencies')}</a>
                            <a href="/projects" className='header__link' onClick={() => setIsOpen(false)}>{t('header.nav_projects')}</a>
                            <a href="/news" className='header__link' onClick={() => setIsOpen(false)}>{t('header.nav_news')}</a>
                            <a href="/#kontakt" className='header__link' onClick={() => setIsOpen(false)}>{t('header.nav_contacts')}</a>

                            {/* Mobile Language Selector */}
                            <div className="header__mobile-lang-block">
                                <button
                                    className={`header__mobile-lang-mini ${language === 'uk' ? 'active' : ''}`}
                                    onClick={() => handleLanguageChange('uk')}
                                >
                                    укр
                                </button>
                                <button
                                    className={`header__mobile-lang-mini ${language === 'en' ? 'active' : ''}`}
                                    onClick={() => handleLanguageChange('en')}
                                >
                                    eng
                                </button>
                            </div>
                        </nav>
                        <button className={`header__burger ${isOpen ? 'header__burger--open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                        <div className="header__translate">
                            <div className="header__lang-dropdown">
                                <button
                                    className="header__lang-button"
                                    onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                                >
                                    {language === 'uk' ? 'укр' : 'eng'}
                                </button>
                                {isLangDropdownOpen && (
                                    <div className="header__lang-menu">
                                        <button
                                            className={`header__lang-option ${language === 'uk' ? 'active' : ''}`}
                                            onClick={() => handleLanguageChange('uk')}
                                        >
                                            укр
                                        </button>
                                        <button
                                            className={`header__lang-option ${language === 'en' ? 'active' : ''}`}
                                            onClick={() => handleLanguageChange('en')}
                                        >
                                            eng
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
    );
}
