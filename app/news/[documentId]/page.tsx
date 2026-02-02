import React from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import './NewsDetail.css';
import { IMAGES } from '@/constants/images';

const STRAPI_BASE_URL = 'https://determined-desk-f2e043cadd.strapiapp.com';

export default async function NewsDetail({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams?.documentId ?? null;

  if (!id) return notFound();

  const encodedId = encodeURIComponent(id);
  const url = `${STRAPI_BASE_URL}/api/news-items/${encodedId}?populate=*`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_STRAPI_API}`,
    },
    // ISR cache for performance
    next: { revalidate: 60 },
  });

  if (!res.ok) return notFound();

  const data = await res.json();
  const item = data?.data ?? null;

  if (!item) return notFound();

  const title = item.title;
  const subtitle = item.subtitle;
  const mini = item.mini_subtitle;
  const imageObj = item.image ?? null;

  const imageUrl = imageObj?.formats?.thumbnail?.url ?? imageObj?.url ?? null;
  const imageFinalUrl = imageUrl
    ? (imageUrl.startsWith('http') ? imageUrl : `${STRAPI_BASE_URL}${imageUrl}`)
    : IMAGES.NEWS;
  const imageWidth = imageObj?.width ?? 800;
  const imageHeight = imageObj?.height ?? 600;

  return (
    <main className="news_detail_main">
      <div className="news_detail_container">
        <a className="news_back" href="/news">← Повернутись до новин</a>

        <h1 className="news_title">{title}</h1>
        {subtitle && <p className="news_description">{subtitle}</p>}

        {imageFinalUrl && (
          <div className="news_detail_image">
            <Image src={imageFinalUrl} alt={title} fill className="news_image" style={{ objectFit: 'cover' }} />
          </div>
        )}

        {mini && <p className="news_item_mini">{mini}</p>}
      </div>
    </main>
  );
}
