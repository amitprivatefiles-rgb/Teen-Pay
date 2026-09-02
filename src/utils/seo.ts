interface SEOConfig {
  title: string;
  description?: string;
  keywords?: string;
  isPrivate?: boolean;
  canonical?: string;
}

export const updateMetaTags = (isPrivate: boolean = false) => {
  if (isPrivate) {
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', 'noindex, nofollow');
  } else {
    const robotsMeta = document.querySelector('meta[name="robots"]');
    if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index, follow, max-image-preview:large');
    }
  }
};

export const setPageTitle = (title: string, isPrivate: boolean = false) => {
  if (isPrivate) {
    document.title = title;
  } else {
    document.title = `${title} | Engagement Experts`;
  }
};

const updateMetaTag = (selector: string, attribute: string, content: string) => {
  let meta = document.querySelector(selector);
  if (!meta) {
    meta = document.createElement('meta');
    if (selector.includes('name=')) {
      meta.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
    } else if (selector.includes('property=')) {
      meta.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
    }
    document.head.appendChild(meta);
  }
  meta.setAttribute(attribute, content);
};

export const updatePageSEO = (config: SEOConfig) => {
  setPageTitle(config.title, config.isPrivate);
  updateMetaTags(config.isPrivate);

  if (config.description) {
    updateMetaTag('meta[name="description"]', 'content', config.description);
    updateMetaTag('meta[property="og:description"]', 'content', config.description);
    updateMetaTag('meta[name="twitter:description"]', 'content', config.description);
  }

  if (config.keywords) {
    updateMetaTag('meta[name="keywords"]', 'content', config.keywords);
  }

  if (config.canonical) {
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', config.canonical);
  }

  const fullTitle = config.isPrivate ? config.title : `${config.title} | Engagement Experts`;
  updateMetaTag('meta[property="og:title"]', 'content', fullTitle);
  updateMetaTag('meta[name="twitter:title"]', 'content', fullTitle);
};
