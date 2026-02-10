import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import '@/app/globals.css';
import './NewsDetail.css';
import { IMAGES } from '@/constants/images';
import { linkifyText } from '@/utils/linkifyText';

const STRAPI_BASE_URL = 'https://determined-desk-f2e043cadd.strapiapp.com';
export default async function NewsDetail({ params }: any) {
  const resolvedParams = await params;
  const id = resolvedParams?.documentId ?? null;

  if (!id) return notFound();

  const encodedId = encodeURIComponent(id);
  const url = `${STRAPI_BASE_URL}/api/news-items/${encodedId}?populate=*`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API}`,
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) return notFound();

  const { data } = await res.json();
  if (!data) return notFound();

  const {
    title,
    subtitle,
    date,
    image,
    ...rest
  } = data;

  const miniSubtitles: string[] = [];

  for (let i = 0; i <= 10; i++) {
    const key = i === 0 ? 'miniSubtitle' : `miniSubtitle${i}`;
    const value = rest?.[key];

    if (typeof value === 'string' && value.trim()) {
      miniSubtitles.push(value.trim());
    }
  }

  const imageUrl =
    image?.formats?.large?.url ||
    image?.formats?.medium?.url ||
    image?.url ||
    null;

  const imageFinalUrl = imageUrl
    ? imageUrl.startsWith('http')
      ? imageUrl
      : `${STRAPI_BASE_URL}${imageUrl}`
    : IMAGES.NEWS;

  const formattedDate = date
    ? new Intl.DateTimeFormat('uk-UA', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }).format(new Date(date))
    : null;

  return (
    <main className="news-detail">
      <div className="container">
        <a className="news_back" href="/news">
          ← Повернутись до новин
        </a>
      </div>

      <section className="news_detail_main">
        <div className="container">
          <article className="news_detail_wrapper">
            <div className="news_detail_author">
              <Image
                src={IMAGES.NEWS_AUTHOR}
                alt="Автор"
                width={96}
                height={96}
                className="news_detail_author-photo"
              />

              <div className="news_detail_author-info">
                <span className="news_detail_author-badge">
                  Автор матеріалу
                </span>
                <div className="news_detail_author-name">
                  Ярослав Нагалка
                </div>
                <div className="news_detail_author-role">
                  адвокат
                </div>

                <div className="news_detail_author-contacts">
                  <a href="tel:+380988817466">+38 (098) 881-74-66</a>
                  <a href="mailto:yaroslavnahalka@gmail.com">
                    yaroslavnahalka@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="news_detail_text">
              <h1 className="news_title">{title}</h1>

              {formattedDate && (
                <div className="news_date">
                  {formattedDate}
                </div>
              )}

              {subtitle && (
                <p className="news_description">
                  {subtitle}
                </p>
              )}

              {/* Main image */}
              <div className="news_detail_image">
                <Image
                  src={imageFinalUrl}
                  alt={title}
                  fill
                  priority
                  className="news_image"
                />
              </div>

              {/* Mini subtitles */}
              {miniSubtitles.length > 0 && (
                <div className="news_mini_block">
                  {miniSubtitles.map((text, index) => (
                    <p
                      key={index}
                      className="news_item_mini"
                    >
                      {linkifyText(text)}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
