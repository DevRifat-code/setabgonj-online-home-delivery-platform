import React, { useEffect } from 'react';

interface HelmetProps {
  title: string;
  description?: string;
}

export default function Helmet({ title, description }: HelmetProps) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Direct DOM update for fallback trackers & active browsers
      document.title = title;
      
      let metaDesc = document.querySelector('meta[name="description"]');
      if (description) {
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return (
    <>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
    </>
  );
}
