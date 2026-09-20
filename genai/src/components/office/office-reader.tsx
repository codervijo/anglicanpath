import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Minus, Pause, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { officeSections } from "@/data/office";

export function OfficeReader({ book = "1928", office = "morning", date = "2026-09-18" }: { book?: string; office?: string; date?: string }) {
  const [theme, setTheme] = useState<"light" | "sepia" | "dark">("sepia");
  const [scale, setScale] = useState(1);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { document.documentElement.dataset["readingTheme"] = theme; return () => { delete document.documentElement.dataset["readingTheme"]; }; }, [theme]);
  const title = office === "evening" ? "Evening Prayer" : "Morning Prayer";
  return <div className="reading-surface min-h-screen">
    <div className="office-toolbar sticky top-18 z-30 border-b border-border bg-background/95">
      <div className="mx-auto grid max-w-6xl gap-3 px-5 py-3 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <Button variant="outline" className="h-11" asChild><Link to="/office/$book/$office/$date" params={{ book: book === "1928" ? "1662" : "1928", office, date }}>{book} BCP</Link></Button>
          <Button variant="outline" className="h-11" asChild><Link to="/office/$book/$office/$date" params={{ book, office: office === "morning" ? "evening" : "morning", date }}>{title}</Link></Button>
          <label className="sr-only" htmlFor="office-date">Office date</label><input id="office-date" type="date" value={date} readOnly className="col-span-2 h-11 min-w-0 rounded-md border border-input bg-background px-3 text-sm sm:w-auto" />
        </div>
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2" aria-label="Reading controls">
          <div className="flex" aria-label="Text size"><Button variant="outline" className="h-11 min-w-12 px-3 text-base" onClick={() => setScale(Math.max(.9, scale - .1))} aria-label="Decrease text size">A<Minus className="size-3" /></Button><Button variant="outline" className="h-11 min-w-12 px-3 text-base" onClick={() => setScale(Math.min(1.3, scale + .1))} aria-label="Increase text size">A<Plus className="size-3" /></Button></div>
          <div className="grid grid-cols-3">{(["light", "sepia", "dark"] as const).map(mode => <Button key={mode} variant={theme === mode ? "default" : "ghost"} className="h-11 min-w-0 px-2 capitalize" onClick={() => setTheme(mode)} aria-pressed={theme === mode}>{mode}</Button>)}</div>
        </div>
      </div>
    </div>
    <main className="mx-auto max-w-[46rem] px-5 py-12 sm:px-8 sm:py-16" style={{ fontSize: `${scale}rem` }}>
      <header className="text-center"><p className="text-xs font-bold uppercase text-primary">The {book} Book of Common Prayer</p><h1 className="mt-4 font-display text-5xl font-semibold sm:text-6xl">{title}</h1><p className="mt-3 text-muted-foreground">Friday, 18 September 2026 · [Liturgical season or feast]</p><div className="mx-auto my-8 h-px w-24 bg-primary" /></header>
      <div className="office-audio mb-12 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-y border-border py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto]"><Button size="icon" className="size-11" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause audio" : "Play audio"}>{playing ? <Pause/> : <Play/>}</Button><div className="min-w-0"><p className="truncate text-sm font-semibold">Audio Office · Placeholder</p><div className="mt-2 h-1 bg-muted"><div className="h-full w-1/3 bg-primary" /></div></div><span className="col-start-2 text-xs text-muted-foreground sm:col-auto">00:00 / 00:00</span></div>
      {officeSections.map((section, index) => <section key={section.id} id={section.id} className="mb-14 scroll-mt-36">
        <h2 className="font-display text-3xl font-semibold">{section.title}</h2>
        <p className="rubric mt-4 text-sm italic leading-6">{section.rubric}</p>
        {section.versicles?.map(line => <p key={line.role} className={`mt-4 grid grid-cols-[4.5rem_minmax(0,1fr)] gap-3 leading-8 sm:grid-cols-[5rem_minmax(0,1fr)] ${line.role === "People" ? "font-bold" : ""}`}><span className="text-sm text-muted-foreground">{line.role}</span><span className="min-w-0">{line.text}</span></p>)}
        {section.content && <div className={`office-copy mt-5 whitespace-pre-line leading-8 ${index === 0 ? "drop-cap" : ""}`}>{section.content}</div>}
        {section.verses?.map((verse, i) => <p key={verse} className="mt-3 grid grid-cols-[2rem_1fr] leading-8"><sup className="text-primary">{i + 1}</sup><span>{verse}</span></p>)}
        <details className="office-note mt-7 border-y border-border"><summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-primary">What is this part?<ChevronDown className="size-4 shrink-0" /></summary><p className="pb-4 text-sm leading-6 text-muted-foreground">{section.note}</p></details>
      </section>)}
    </main>
  </div>;
}
