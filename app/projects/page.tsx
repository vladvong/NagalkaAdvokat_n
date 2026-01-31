"use client";

import React from 'react';
import './Projects.css';
import { IMAGES } from '@/constants/images';
import { useLanguage } from '@/context/useLanguage';

export default function ProjectsPage() {
  const { t } = useLanguage();

  const projects = [
    {
      id: 1,
      title: 'Проєкт 1',
      subtitle: 'Короткий опис проєкту',
      image: IMAGES.PROJ,
      link: '#',
    },
    {
      id: 2,
      title: 'Проєкт 2',
      subtitle: 'Короткий опис проєкту',
      image: IMAGES.PROJ,
      link: '#',
    },
    {
      id: 3,
      title: 'Проєкт 3',
      subtitle: 'Короткий опис проєкту',
      image: IMAGES.PROJ,
      link: '#',
    },
    {
      id: 4,
      title: 'Проєкт 4',
      subtitle: 'Короткий опис проєкту',
      image: IMAGES.PROJ,
      link: '#',
    },
    {
      id: 5,
      title: 'Проєкт 5',
      subtitle: 'Короткий опис проєкту',
      image: IMAGES.PROJ,
      link: '#',
    },
    {
      id: 6,
      title: 'Проєкт 6',
      subtitle: 'Короткий опис проєкту',
      image: IMAGES.PROJ,
      link: '#',
    },
    {
      id: 7,
      title: 'Проєкт 7',
      subtitle: 'Короткий опис проєкту',
      image: IMAGES.PROJ,
      link: '#',
    },
    {
      id: 8,
      title: 'Проєкт 8',
      subtitle: 'Короткий опис проєкту',
      image: IMAGES.PROJ,
      link: '#',
    },
  ];

  return (
    <main className="projects-page">
      <div className="container">
        <div className="projects-header">
          <h1 className="projects-title">{t('project.title')}</h1>
          <p className="projects-subtitle">{t('project.description')}</p>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card-item"
              style={{ backgroundImage: `url(${project.image})` }}
            >
              <div className="project-card-overlay" />
              <div className="project-card-content">
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-subtitle">{project.subtitle}</p>
                <a className="project-card-button" href={project.link}>
                  Переглянути проєкт
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
