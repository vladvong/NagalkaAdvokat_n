import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import './ProjectDetail.css';
import { IMAGES } from '@/constants/images';

const STRAPI_BASE_URL = 'https://determined-desk-f2e043cadd.strapiapp.com';

export default async function ProjectDetail({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.documentId ?? null;

  if (!id) return notFound();

  const encodedId = encodeURIComponent(id);
  const url = `${STRAPI_BASE_URL}/api/projects/${encodedId}?populate=*`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return notFound();

  const data = await res.json();
  const item = data?.data ?? null;

  if (!item) return notFound();

  const title = item.title;
  const subtitle = item.subtitle;
  const link = item.link ?? '#';
  const imageObj = item.image ?? null;

  /** ----------------------------
   * Mini subtitles collection
   * ---------------------------- */
  const miniSubtitles = [];

  for (let i = 0; i <= 10; i++) {
    const key = i === 0 ? 'miniSubtitle' : `miniSubtitle${i}`;
    const value = item?.[key];

    if (typeof value === 'string' && value.trim()) {
      miniSubtitles.push(value.trim());
    }
  }

  /** ----------------------------
   * Image handling
   * ---------------------------- */
  const imageUrl =
    imageObj?.formats?.large?.url ||
    imageObj?.formats?.medium?.url ||
    imageObj?.url ||
    null;

  const imageFinalUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${STRAPI_BASE_URL}${imageUrl}`
    : IMAGES.PROJ;

  return (
    <main className="project_detail_main">
      <div className="container">
        {/* Hero Section */}
        <section className="project_hero">
          <a className="project_back" href="/projects">
            ← Повернутись до проєктів
          </a>

          {imageFinalUrl && (
            <div className="project_hero_image">
              <Image
                src={imageFinalUrl}
                alt={title}
                fill
                priority
                className="project_image"
              />
              <div className="project_hero_overlay">
                <div className="project_hero_content">
                  <h1 className="project_title">{title}</h1>
                  {subtitle && (
                    <p className="project_subtitle">{subtitle}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {!imageFinalUrl && (
            <div className="project_hero_no_image">
              <h1 className="project_title">{title}</h1>
              {subtitle && (
                <p className="project_subtitle">{subtitle}</p>
              )}
            </div>
          )}
        </section>

        {/* Content Section */}
        <section className="project_content">
          {/* Mini subtitles */}
          {miniSubtitles.length > 0 && (
            <div className="project_mini_block">
              <h2 className="project_section_title">Деталі проєкту</h2>
              <div className="project_mini_list">
                {miniSubtitles.map((text, index) => (
                  <p key={index} className="project_item_mini">{text}</p>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {link && link !== '#' && (
            <div className="project_actions">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="project_view_btn"
              >
                Переглянути проєкт
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
