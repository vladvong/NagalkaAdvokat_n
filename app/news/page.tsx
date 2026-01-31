"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import './News.css';
import Header from '../../components/Header/Header';
function News() {
  const STRAPI_BASE_URL = 'https://determined-desk-f2e043cadd.strapiapp.com';
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3; // just test pageSize for testing pagination, change then to 10 i think

  useEffect(() => {
    const fetchNews = async () => {
      const cacheKey = `news_page_${currentPage}`;
      const cacheTimeKey = `news_time_${currentPage}`;
      const cacheExpiry = 5 * 60 * 1000; // 5 минут

      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);
      const now = Date.now();

      if (cachedData && cachedTime && (now - parseInt(cachedTime)) < cacheExpiry) {
        const data = JSON.parse(cachedData);
        setNewsItems(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://determined-desk-f2e043cadd.strapiapp.com/api/news-items?pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_STRAPI_TOKEN}`,
            },
          }
        );


        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        
        const data = await response.json();
        setNewsItems(data.data);
        setTotalPages(data.meta.pagination.pageCount);
        setError(null);

        // Кешируем данные
        localStorage.setItem(cacheKey, JSON.stringify({ data: data.data, totalPages: data.meta.pagination.pageCount }));
        localStorage.setItem(cacheTimeKey, now.toString());
      } catch (err) {
        setError(err.message);
        setNewsItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  if (loading && newsItems.length === 0) {
    return (
      <main className="news_main">
        <div className="news_container">
          <h1 className="news_title">Новини</h1>
          <p>Завантаження новин...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="news_main">
        <div className="news_container">
          <h1 className="news_title">Новини</h1>
          <p>Помилка при завантаженні новин: {error}</p>
        </div>
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="news_main">
        <div className="news_container">
          <h1 className="news_title">Новини</h1>
          <p className="news_description">Всі новини</p>
        
        {loading && <p>Завантаження новин...</p>}
        {error && <p>Помилка: {error}</p>}
        
        {newsItems.length > 0 ? (
          <>
            <div className="news_grid">
              {newsItems.map((item) => {
                const imageMeta = item.image?.formats?.medium
                  || item.image?.formats?.small
                  || item.image?.formats?.thumbnail
                  || item.image
                  || null;
                const rawImageUrl = imageMeta?.url ?? null;
                const imageUrl = rawImageUrl
                  ? (rawImageUrl.startsWith('http') ? rawImageUrl : `${STRAPI_BASE_URL}${rawImageUrl}`)
                  : null;
                const imageWidth = imageMeta?.width ?? 800;
                const imageHeight = imageMeta?.height ?? 600;
                
                return (
                  <div key={item.id} className="news_item">
                    {imageUrl && (
                      <Image
                        src={imageUrl}
                        alt={item.title}
                        className="news_image"
                        width={imageWidth}
                        height={imageHeight}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        loading="lazy"
                      />
                    )}
                    <h3 className="news_item_title">{item.title}</h3>
                    <p className="news_item_subtitle">{item.subtitle}</p>
                    <p className="news_item_mini">{item.mini_subtitle}</p>
                    <a href={`/news/${item.documentId}`}>
                      <button className="news_button">Читати</button>
                    </a>
                  </div>
                );
              })}
            </div>

            <div className="news_pagination">
              <button
                className="news_pagination_btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                ← Назад
              </button>
              
              <div className="news_pagination_info">
                Сторінка {currentPage} з {totalPages}
              </div>
              
              <button
                className="news_pagination_btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Далі →
              </button>
            </div>
          </>
        ) : (
          <p>Новин не знайдено</p>
        )}
      </div>
    </main>
    </>
  );
}

export default News;
