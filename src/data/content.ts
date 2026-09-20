export type Article = {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  readingTime: string;
  reviewedBy: string;
  reviewedDate: string;
};

export const articles: Article[] = [
  { slug: "anglican-vs-catholic", title: "Anglican and Roman Catholic: a comparison", summary: "[Draft one-sentence comparison summary]", topic: "Comparisons", readingTime: "8 min", reviewedBy: "[Reviewer Name, Title]", reviewedDate: "[Review date]" },
  { slug: "what-is-anglicanism", title: "What is Anglicanism?", summary: "[Draft introductory summary]", topic: "Basics", readingTime: "6 min", reviewedBy: "[Reviewer Name, Title]", reviewedDate: "[Review date]" },
  { slug: "how-to-pray-the-daily-office", title: "How to pray the Daily Office", summary: "[Draft practical summary]", topic: "Prayer Book", readingTime: "7 min", reviewedBy: "[Reviewer Name, Title]", reviewedDate: "[Review date]" },
  { slug: "what-are-the-sacraments", title: "What are the Sacraments?", summary: "[Draft sacramental summary]", topic: "Sacraments", readingTime: "9 min", reviewedBy: "[Reviewer Name, Title]", reviewedDate: "[Review date]" },
  { slug: "a-brief-anglican-history", title: "A brief history of Anglicanism", summary: "[Draft historical summary]", topic: "History", readingTime: "12 min", reviewedBy: "[Reviewer Name, Title]", reviewedDate: "[Review date]" },
  { slug: "anglican-jurisdictions", title: "A guide to Anglican jurisdictions", summary: "[Draft jurisdiction summary]", topic: "Jurisdictions", readingTime: "10 min", reviewedBy: "[Reviewer Name, Title]", reviewedDate: "[Review date]" },
  { slug: "anglican-vs-orthodox", title: "Anglican and Orthodox: a comparison", summary: "[Draft one-sentence comparison summary]", topic: "Comparisons", readingTime: "9 min", reviewedBy: "[Reviewer Name, Title]", reviewedDate: "[Review date]" },
  { slug: "the-book-of-common-prayer", title: "The Book of Common Prayer", summary: "[Draft prayer book summary]", topic: "Prayer Book", readingTime: "8 min", reviewedBy: "[Reviewer Name, Title]", reviewedDate: "[Review date]" },
];

export const topics = ["Basics", "Comparisons", "Prayer Book", "Sacraments", "History", "Jurisdictions"];

export const paths = [
  { id: "from-evangelical", title: "From Evangelical", subtitle: "[Draft path introduction for readers from Evangelical traditions]" },
  { id: "from-roman-catholic", title: "From Roman Catholic", subtitle: "[Draft path introduction for readers from Roman Catholic backgrounds]" },
  { id: "orthodox-curious", title: "Orthodox-curious", subtitle: "[Draft path introduction for readers exploring Orthodoxy]" },
  { id: "from-episcopal", title: "From the Episcopal Church", subtitle: "[Draft path introduction for readers from the Episcopal Church]" },
  { id: "new-to-christianity", title: "New to Christianity", subtitle: "[Draft path introduction for readers new to Christianity]" },
];

export const pathSteps = [
  { title: "Begin with the essentials", slug: "what-is-anglicanism", time: "6 min" },
  { title: "Understand Scripture and tradition", slug: "anglican-vs-catholic", time: "8 min" },
  { title: "Meet the Book of Common Prayer", slug: "the-book-of-common-prayer", time: "8 min" },
  { title: "Learn about the Sacraments", slug: "what-are-the-sacraments", time: "9 min" },
  { title: "Pray the Daily Office", slug: "how-to-pray-the-daily-office", time: "7 min" },
  { title: "Understand jurisdictions", slug: "anglican-jurisdictions", time: "10 min" },
];

export const articleSections = [
  { id: "overview", title: "At a glance" },
  { id: "common-ground", title: "Common ground" },
  { id: "differences", title: "Important differences" },
  { id: "comparison", title: "Side-by-side comparison" },
  { id: "sources", title: "Primary sources" },
];
