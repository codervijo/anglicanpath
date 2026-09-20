// JSON-LD builders. Every page's structured data comes from here so the shape
// stays consistent and the organization identity is defined once.
//
// Nothing in this file invents facts: `author` is always the organization
// (the site does not claim individual bylines), and `reviewedBy` is emitted
// only when frontmatter actually carries a named reviewer.

export const SITE_URL = 'https://anglicanpath.org';
export const SITE_NAME = 'Anglican Path';

/** The organization node, reused as author/publisher across page types. */
export const organization = () => ({
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
});

export const organizationLd = () => ({
  '@context': 'https://schema.org',
  ...organization(),
});

export const websiteLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  publisher: { '@id': `${SITE_URL}/#organization` },
});

export interface Crumb {
  name: string;
  /** Absolute path with leading and trailing slash, e.g. "/learn/". */
  path: string;
}

export const breadcrumbLd = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.name,
    item: `${SITE_URL}${c.path}`,
  })),
});

export interface ArticleLdInput {
  headline: string;
  description: string;
  path: string;
  updatedDate: Date;
  reviewer: { name: string; title: string } | null;
  reviewedDate: Date | null;
}

export function articleLd(a: ArticleLdInput) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.headline,
    description: a.description,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${a.path}` },
    dateModified: a.updatedDate.toISOString().slice(0, 10),
    author: organization(),
    publisher: organization(),
  };
  if (a.reviewer) {
    ld.reviewedBy = {
      '@type': 'Person',
      name: a.reviewer.name,
      jobTitle: a.reviewer.title,
    };
    if (a.reviewedDate) {
      ld.lastReviewed = a.reviewedDate.toISOString().slice(0, 10);
    }
  }
  return ld;
}

/**
 * A FAQ answer counts as written only if it is non-empty and carries no
 * placeholder markers. Unanswered questions still render on the page for the
 * operator to fill; they must never reach FAQPage markup, because marking up a
 * bracket-placeholder as an answer is exactly the kind of thing that earns a
 * structured-data manual action.
 */
export const isAnsweredFaq = (a: string): boolean =>
  a.trim().length > 0 && !/\[[^\]]*\]|DRAFT:|TODO/i.test(a);

export function faqLd(faq: { q: string; a: string }[] | undefined) {
  const answered = (faq ?? []).filter(f => isAnsweredFaq(f.a));
  if (answered.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: answered.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
