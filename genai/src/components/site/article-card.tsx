import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/data/content";

export function ArticleCard({ article }: { article: Article }) {
  return <article className="group border-t border-border pt-5">
    <p className="text-xs font-bold uppercase text-primary">{article.topic}</p>
    <h3 className="mt-2 font-display text-2xl font-semibold leading-tight"><Link to="/learn/$slug" params={{ slug: article.slug }} className="decoration-primary/40 underline-offset-4 group-hover:underline">{article.title}</Link></h3>
    <p className="mt-3 leading-7 text-muted-foreground">{article.summary}</p>
    <Link to="/learn/$slug" params={{ slug: article.slug }} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Read article <ArrowRight className="size-4" /></Link>
  </article>;
}
