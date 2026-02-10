import React from 'react';

export function linkifyText(text: string): React.ReactNode[] {
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/gi;

  return text.split(urlRegex).map((part, index) => {
    if (!part) return null;

    const isUrl =
      part.startsWith('http://') ||
      part.startsWith('https://') ||
      part.startsWith('www.');

    if (!isUrl) {
      return <React.Fragment key={index}>{part}</React.Fragment>;
    }

    const href = part.startsWith('http')
      ? part
      : `https://${part}`;

    return (
      <a
        key={index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="project_inline_link"
      >
        {part}
      </a>
    );
  });
}
