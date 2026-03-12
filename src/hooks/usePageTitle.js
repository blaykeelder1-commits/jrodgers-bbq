import { useEffect } from 'react';

export default function usePageTitle(title) {
  useEffect(() => {
    const base = 'J Rodgers BBQ & Soul Food';
    document.title = title ? `${title} | ${base}` : `${base} | Welcome Home`;
  }, [title]);
}
