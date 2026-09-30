// The advisory panel must render three honest states. The live collection
// ships empty, so the populated states are exercised here with fixtures.
// Fixture ids and names are deliberately not personal names: nothing that
// looks like a real or illustrative person exists anywhere in the repo.
// @vitest-environment node
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import AdvisoryPanel from '../components/site/AdvisoryPanel.astro';
import { panelLayout, type Reviewer } from '../lib/reviewers';

const fixture = (n: number, status: 'active' | 'emeritus' = 'active'): Reviewer =>
  ({
    id: `fixture-${n}`,
    collection: 'reviewers',
    data: {
      name: `fixture-${n}`,
      title: `fixture-title-${n}`,
      parish: `fixture-parish-${n}`,
      jurisdiction: 'fixture-jurisdiction',
      url: `https://example.invalid/${n}`,
      bio: `fixture-bio-${n}`,
      articlesReviewed: n === 1 ? ['live-article', 'draft-article'] : [],
      joinedDate: new Date('2026-01-01'),
      status,
    },
  }) as unknown as Reviewer;

const articles = { 'live-article': { title: 'Live article', href: '/learn/live-article/' } };

async function render(reviewers: Reviewer[], emeritus: Reviewer[] = []) {
  const container = await AstroContainer.create();
  return container.renderToString(AdvisoryPanel, { props: { reviewers, emeritus, articles } });
}

describe('panelLayout', () => {
  it('maps counts to layouts', () => {
    expect(panelLayout(0)).toBe('empty');
    expect(panelLayout(1)).toBe('few');
    expect(panelLayout(2)).toBe('few');
    expect(panelLayout(3)).toBe('several');
  });
});

describe('AdvisoryPanel', () => {
  it('empty: says reviewers are being invited, names no one, links the invitation page', async () => {
    const html = await render([]);
    expect(html).toContain('data-layout="empty"');
    expect(html).toContain('Clergy reviewers are being invited now.');
    expect(html).toContain('href="/about/review/"');
    expect(html).not.toContain('data-reviewer=');
  });

  it('few: renders each reviewer with parish link, bio and only live signed articles', async () => {
    const html = await render([fixture(1), fixture(2)]);
    expect(html).toContain('data-layout="few"');
    expect(html.match(/data-reviewer=/g)).toHaveLength(2);
    expect(html).toContain('href="https://example.invalid/1"');
    expect(html).toContain('fixture-bio-1');
    expect(html).toContain('href="/learn/live-article/"');
    expect(html).not.toContain('draft-article');
    expect(html).toContain('No articles signed yet.');
    expect(html).not.toContain('being invited');
  });

  it('several: grid layout for three or more, emeritus listed separately', async () => {
    const html = await render([fixture(1), fixture(2), fixture(3), fixture(4)], [fixture(5, 'emeritus')]);
    expect(html).toContain('data-layout="several"');
    expect(html.match(/data-reviewer=/g)).toHaveLength(4);
    expect(html).toContain('Former reviewers');
    expect(html).toContain('href="/about/reviewers/fixture-5/"');
  });
});
