import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";

// Ported from genai/src/components/site/site-shell.tsx (the <Sheet> half of
// SiteHeader). Mounted as an Astro island; the desktop nav stays server
// rendered in SiteHeader.astro so its links are in the static HTML.
const nav = [
  ["Paths", "/paths/from-evangelical/"],
  ["Learn", "/learn/"],
  ["Find a Parish", "/find-a-parish/"],
  ["Daily Office", "/office/"],
  ["About", "/about/"],
] as const;

export function MobileNav() {
  return <Sheet>
    <SheetTrigger asChild><Button variant="ghost" size="icon" className="size-11 lg:hidden" aria-label="Open navigation"><Menu /></Button></SheetTrigger>
    <SheetContent className="w-[min(20rem,calc(100vw-2rem))] bg-background">
      <SheetHeader><SheetTitle className="font-display text-2xl">Anglican Path</SheetTitle></SheetHeader>
      <nav className="mt-10 flex flex-col" aria-label="Mobile navigation">
        {nav.map(([label, to]) => <SheetClose asChild key={to}><a href={to} className="flex min-h-12 items-center border-b border-border py-3 font-display text-xl">{label}</a></SheetClose>)}
      </nav>
    </SheetContent>
  </Sheet>;
}

export default MobileNav;
