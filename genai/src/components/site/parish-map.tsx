import { useEffect, useRef } from "react";
import type { Parish } from "@/data/parishes";

export default function ParishMap({ parishes }: { parishes: Parish[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    let map: import("leaflet").Map | undefined;
    void import("leaflet").then(L => {
      if (!ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false, touchZoom: true, dragging: true }).setView([37.4, -81], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap contributors" }).addTo(map);
      parishes.forEach(p => L.circleMarker([p.lat, p.lng], { radius: 8, color: "#701515", fillColor: "#991b1b", fillOpacity: .9, weight: 2 }).addTo(map as import("leaflet").Map).bindPopup(`<strong>${p.name}</strong><br>${p.city}, ${p.state}<br><em>Fictitious sample</em>`));
      requestAnimationFrame(() => map?.invalidateSize());
      const observer = new ResizeObserver(() => map?.invalidateSize());
      observer.observe(ref.current);
      map.once("unload", () => observer.disconnect());
    });
    return () => { map?.remove(); };
  }, [parishes]);
  return <div ref={ref} className="h-[65dvh] min-h-[28rem] w-full touch-pan-x touch-pan-y md:sticky md:top-18 md:h-[calc(100dvh-4.5rem)]" aria-label="Map of fictitious sample parishes. Use two fingers to move the map on touch screens." />;
}
