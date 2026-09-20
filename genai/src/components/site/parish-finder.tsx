import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, List, Map, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Parish, parishes } from "@/data/parishes";

const ParishMap = lazy(() => import("./parish-map"));
const options = { jurisdiction: ["All", "ACNA", "APA", "REC", "ACC"], book: ["All", "1662", "1928", "2019"], churchmanship: ["All", "Anglo-Catholic", "Broad Church", "Evangelical/Reformed Anglican"], serviceType: ["All", "Said", "Sung"] };

export function ParishFinder() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const [filters, setFilters] = useState({ jurisdiction: "All", book: "All", churchmanship: "All", serviceType: "All" });
  const hasFilters = query.length > 0 || Object.values(filters).some(value => value !== "All");
  const resetFilters = () => { setQuery(""); setFilters({ jurisdiction: "All", book: "All", churchmanship: "All", serviceType: "All" }); };
  const visible = useMemo(() => parishes.filter(p => (!query || `${p.name} ${p.city} ${p.state}`.toLowerCase().includes(query.toLowerCase())) && Object.entries(filters).every(([key, value]) => value === "All" || p[key as keyof Parish] === value)), [query, filters]);
  return <main>
    <header className="border-b border-border bg-secondary/25"><div className="mx-auto max-w-7xl px-5 py-10 sm:px-8"><p className="text-xs font-bold uppercase text-primary">Parish directory</p><h1 className="mt-3 font-display text-4xl font-semibold sm:text-6xl">Find a traditional Anglican parish</h1><p className="mt-4 max-w-2xl text-muted-foreground">All listings shown in this prototype are sample data for fictitious parishes.</p></div></header>
    <section className="border-b border-border bg-background"><div className="mx-auto max-w-7xl px-5 py-5 sm:px-8">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]"><div className="relative sm:col-span-2 lg:col-span-1"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"/><Input className="h-11 pl-9" value={query} onChange={e => setQuery(e.target.value)} placeholder="City, state, or parish name" aria-label="Search parishes" /></div>
      {Object.entries(options).map(([key, values]) => <label key={key} className="text-xs font-bold uppercase text-muted-foreground"><span className="sr-only">{key}</span><select aria-label={key} value={filters[key as keyof typeof filters]} onChange={e => setFilters({...filters, [key]: e.target.value})} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm font-normal normal-case text-foreground">{values.map(value => <option key={value}>{value}</option>)}</select></label>)}</div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3"><span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground"><SlidersHorizontal className="size-4 shrink-0" /> {visible.length} results</span><div className="flex items-center gap-2">{hasFilters && <Button size="sm" variant="ghost" className="h-11 px-3" onClick={resetFilters}><RotateCcw/>Reset</Button>}<div className="flex md:hidden"><Button className="h-11 min-w-16" variant={view === "list" ? "default" : "outline"} onClick={() => setView("list")} aria-pressed={view === "list"}><List/>List</Button><Button className="h-11 min-w-16" variant={view === "map" ? "default" : "outline"} onClick={() => setView("map")} aria-pressed={view === "map"}><Map/>Map</Button></div></div></div>
    </div></section>
    <div className="mx-auto grid max-w-[100rem] md:grid-cols-[minmax(22rem,38%)_1fr]">
      <div className={`${view === "map" ? "hidden" : "block"} max-h-[calc(100dvh-5rem)] overflow-y-auto border-r border-border md:block lg:max-h-[calc(100dvh-4.5rem)]`}><div className="border-b border-border px-5 py-4 text-sm text-muted-foreground">{visible.length} fictitious sample parishes</div>{visible.length ? visible.map(p => <ParishCard parish={p} key={p.id}/>) : <div className="px-5 py-12 text-center"><p className="font-display text-2xl font-semibold">No sample parishes found</p><Button variant="outline" className="mt-5 h-11" onClick={resetFilters}>Clear filters</Button></div>}</div>
      <div className={`${view === "list" ? "hidden" : "block"} min-h-[65dvh] md:block`}><Suspense fallback={<div className="grid min-h-[65dvh] place-items-center bg-muted text-muted-foreground">Loading sample map…</div>}><ParishMap parishes={visible}/></Suspense></div>
    </div>
  </main>;
}

export function ParishCard({ parish }: { parish: Parish }) {
 return <article className="border-b border-border px-5 py-6 transition-colors hover:bg-secondary/30">
   <div className="flex items-start justify-between gap-4"><div><span className="inline-block bg-primary/10 px-2 py-1 text-[.65rem] font-bold uppercase text-primary">Sample Data · Fictitious Parish</span><h2 className="mt-3 font-display text-2xl font-semibold"><Link to="/find-a-parish/$parishId" params={{ parishId: parish.id }} className="hover:text-primary">{parish.name}</Link></h2><p className="mt-1 text-sm text-muted-foreground">{parish.address}</p></div>{parish.verified && <span title="Verified sample status" className="shrink-0 text-primary"><CheckCircle2 className="size-5"/><span className="sr-only">Verified by parish</span></span>}</div>
   <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm"><div><dt className="text-muted-foreground">Jurisdiction</dt><dd className="font-semibold">{parish.jurisdiction}</dd></div><div><dt className="text-muted-foreground">Prayer Book</dt><dd className="font-semibold">{parish.book}</dd></div><div><dt className="text-muted-foreground">Churchmanship</dt><dd className="font-semibold">{parish.churchmanship}</dd></div><div><dt className="text-muted-foreground">Sunday service</dt><dd className="font-semibold">{parish.services[0]}</dd></div></dl>
 </article>;
}
