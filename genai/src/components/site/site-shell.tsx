import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  ["Learn", "/learn"], ["Find a Parish", "/find-a-parish"], ["Daily Office", "/office"], ["About", "/about"],
] as const;

export function SiteHeader() {
  return <header className="site-header sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur">
    <div className="mx-auto grid h-18 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-8">
      <Link to="/" className="min-w-0 font-display text-2xl font-semibold text-foreground no-underline">Anglican <span className="text-primary">Path</span></Link>
      <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Main navigation">
        <Link to="/paths/$pathId" params={{ pathId: "from-evangelical" }} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Paths</Link>{nav.map(([label, to]) => <Link key={to} to={to} activeProps={{ className: "text-primary" }} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">{label}</Link>)}
      </nav>
      <Sheet>
        <SheetTrigger asChild><Button variant="ghost" size="icon" className="size-11 lg:hidden" aria-label="Open navigation"><Menu /></Button></SheetTrigger>
        <SheetContent className="w-[min(20rem,calc(100vw-2rem))] bg-background">
          <SheetHeader><SheetTitle className="font-display text-2xl">Anglican Path</SheetTitle></SheetHeader>
          <nav className="mt-10 flex flex-col" aria-label="Mobile navigation">
            <SheetClose asChild><Link to="/paths/$pathId" params={{ pathId: "from-evangelical" }} className="flex min-h-12 items-center border-b border-border py-3 font-display text-xl">Paths</Link></SheetClose>{nav.map(([label, to]) => <SheetClose asChild key={to}><Link to={to} className="flex min-h-12 items-center border-b border-border py-3 font-display text-xl">{label}</Link></SheetClose>)}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </header>;
}

export function SiteFooter() {
  return <footer className="site-footer border-t border-border bg-secondary/35">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto]">
      <div><div className="font-display text-2xl font-semibold">Anglican Path</div><p className="mt-2 max-w-md text-sm text-muted-foreground">A non-profit resource for learning, finding a parish, and praying the Daily Office.</p></div>
      <div className="text-sm text-muted-foreground"><p>All parish listings on this prototype are fictitious.</p><p className="mt-2">© [Year] Anglican Path</p></div>
    </div>
  </footer>;
}

export function PageIntro({ eyebrow, title, description }: { eyebrow?: string; title: string; description: string }) {
  return <header className="border-b border-border bg-secondary/25"><div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">{eyebrow && <p className="text-xs font-bold uppercase text-primary">{eyebrow}</p>}<h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight sm:text-6xl">{title}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p></div></header>;
}

export function Ornament() { return <div className="my-7 flex items-center justify-center gap-4 text-primary" aria-hidden="true"><span className="h-px w-12 bg-border"/><span>†</span><span className="h-px w-12 bg-border"/></div>; }
