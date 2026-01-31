"use client";

import React from 'react';
import Image from 'next/image';
import './Footer.css';
import { useLanguage } from '../../context/useLanguage';
import { IMAGES } from '@/constants/images';

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__logo">
            <h3 className="footer__title">{t('footer.title')}</h3>
            <p className="footer__subtitle">{t('footer.subtitle')}</p>
          </div>
          <div className="footer__contacts">
            <h4 className="footer__heading">{t('footer.contacts_heading')}</h4>
            <div className="footer__contact-item">
              <h5>{t('footer.address_label')}</h5>
              <p>{t('footer.address')}</p>
            </div>
            <div className="footer__contact-item">
              <h5>{t('footer.email_label')}</h5>
              <p>{t('footer.email')}</p>
            </div>
            <div className="footer__contact-item">
              <h5>{t('footer.phone_label')}</h5>
              <p>{t('footer.phone')}</p>
            </div>
          </div>
          <div className="footer__social">
            <h4 className="footer__heading">{t('footer.social_heading')}</h4>
            <div className="footer_social_items">
              <a href="#" className="footer__social-link"><Image src={IMAGES.FACEBOOK} alt="Facebook" width={24} height={24} sizes="24px" loading="lazy" /></a>
              <a href="#" className="footer__social-link"><Image src={IMAGES.INSTAGRAM} alt="Instagram" width={24} height={24} sizes="24px" loading="lazy" /></a>
            </div>
          </div>
        </div>
        <div className="footer__bottom">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
