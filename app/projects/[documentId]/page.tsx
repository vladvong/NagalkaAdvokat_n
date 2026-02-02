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

  const imageUrl = imageObj?.formats?.thumbnail?.url ?? imageObj?.url ?? null;
  const imageFinalUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `${STRAPI_BASE_URL}${imageUrl}`) : IMAGES.PROJ;

  return (
    <main className="project_detail_main">
      <div className="project_detail_container">
        <a className="project_back" href="/projects">← Повернутись до проєктів</a>

        <h1 className="project_title">{title}</h1>
        {subtitle && <p className="project_subtitle">{subtitle}</p>}

        {imageFinalUrl && (
          <div className="project_detail_image">
            <Image src={imageFinalUrl} alt={title} fill className="project_image" style={{ objectFit: 'cover' }} />
          </div>
        )}

      </div>
    </main>
  );
}
