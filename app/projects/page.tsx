"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './Projects.css';
import { IMAGES } from '@/constants/images';
import { useLanguage } from '@/context/useLanguage';

export default function ProjectsPage() {
  const { t } = useLanguage();

  const STRAPI_BASE_URL = 'https://determined-desk-f2e043cadd.strapiapp.com';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 4; // number of projects per page ( change after testing)

  useEffect(() => {
    const fetchProjects = async () => {
      const cacheKey = `projects_page_${currentPage}`;
      const cacheTimeKey = `projects_time_${currentPage}`;
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes

      const cachedData = localStorage.getItem(cacheKey);
      const cachedTime = localStorage.getItem(cacheTimeKey);
      const now = Date.now();

      if (cachedData && cachedTime && (now - parseInt(cachedTime)) < cacheExpiry) {
        const data = JSON.parse(cachedData);
        setProjects(data.data);
        setTotalPages(data.totalPages);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${STRAPI_BASE_URL}/api/projects?sort=createdAt:desc&pagination[page]=${currentPage}&pagination[pageSize]=${pageSize}&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        const items = (data.data || []).map((item) => {
          const title = item.title ?? item.attributes?.title ?? '';
          const subtitle = item.subtitle ?? item.attributes?.subtitle ?? '';
          const documentId = item.documentId ?? item.attributes?.documentId ?? item.id;
          const imageObj = item.image ?? item.attributes?.image ?? null;

          return {
            id: item.id,
            documentId,
            title,
            subtitle,
            image: imageObj,
            raw: item,
          };
        });

        setProjects(items);
        setTotalPages(data.meta?.pagination?.pageCount ?? 1);
        setError(null);

        // cache
        localStorage.setItem(cacheKey, JSON.stringify({ data: items, totalPages: data.meta?.pagination?.pageCount ?? 1 }));
        localStorage.setItem(cacheTimeKey, now.toString());
      } catch (err) {
        setError(err.message);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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

  return (
    <main className="projects-page">
      <div className="container">
        <div className="projects-header">
          <h1 className="projects-title">{t('project.title')}</h1>
          <p className="projects-subtitle">{t('project.description')}</p>
        </div>

        {loading && projects.length === 0 && <p>Завантаження проєктів...</p>}
        {error && <p>Помилка при завантаженні проєктів: {error}</p>}

        {projects.length > 0 ? (
          <>
            <div className="projects-grid">
              {projects.map((project) => {
                const title = project.title ?? project.attributes?.title ?? 'Проєкт';
                const subtitle = project.subtitle ?? project.attributes?.subtitle ?? '';
                const link = project.link ?? project.attributes?.link ?? '#';

                const imageMeta = project.image?.formats?.medium
                  || project.image?.formats?.small
                  || project.image?.formats?.thumbnail
                  || project.image
                  || project.attributes?.image?.formats?.medium
                  || project.attributes?.image?.formats?.small
                  || project.attributes?.image?.formats?.thumbnail
                  || project.attributes?.image
                  || null;

                const rawImageUrl = imageMeta?.url ?? (typeof imageMeta === 'string' ? imageMeta : null);
                const imageUrl = rawImageUrl
                  ? (rawImageUrl.startsWith('http') ? rawImageUrl : `${STRAPI_BASE_URL}${rawImageUrl}`)
                  : IMAGES.PROJ;

                return (
                  <div
                    key={project.id}
                    className="project-card-item"
                  >
                    <Image
                      src={imageUrl}
                      alt={title}
                      fill
                      sizes="(max-width: 900px) 100vw, 25vw"
                      className="project-card-item__image"
                    />
                    <div className="project-card-overlay" />
                    <div className="project-card-content">
                      <h3 className="project-card-title">{title}</h3>
                      <p className="project-card-subtitle">{subtitle}</p>
                      <Link className="project-card-button" href={`/projects/${project.documentId}`}>
                        Переглянути проєкт
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="projects_pagination">
              <button
                className="projects_pagination_btn"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                ← Назад
              </button>

              <div className="projects_pagination_info">
                Сторінка {currentPage} з {totalPages}
              </div>

              <button
                className="projects_pagination_btn"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Далі →
              </button>
            </div>
          </>
        ) : (
          !loading && <p>Проєкти не знайдено</p>
        )}
      </div>
    </main>
  );
}
