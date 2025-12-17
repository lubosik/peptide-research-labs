'use client';

import { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      const headings = items.map((item) => {
        const element = document.getElementById(item.id);
        return {
          id: item.id,
          element,
          top: element ? element.getBoundingClientRect().top : 0,
        };
      });

      const current = headings
        .filter((h) => h.top <= 100 && h.top >= -100)
        .sort((a, b) => Math.abs(a.top) - Math.abs(b.top))[0];

      if (current) {
        setActiveId(current.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [items]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-ivory rounded-lg border border-taupe p-6 sticky top-24" style={{ boxShadow: '0 2px 8px rgba(43, 43, 43, 0.1)' }}>
      <h3 className="text-heading text-lg font-semibold text-charcoal mb-4">
        Table of Contents
      </h3>
      <nav>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => scrollToSection(item.id)}
                className={`text-left text-sm transition-colors w-full font-serif ${
                  activeId === item.id
                    ? 'text-charcoal font-semibold'
                    : 'text-stone hover:text-charcoal'
                }`}
                style={{ paddingLeft: `${(item.level - 2) * 16}px` }}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

