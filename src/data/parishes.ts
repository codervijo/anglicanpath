export type Parish = {
  id: string; name: string; city: string; state: string; address: string;
  jurisdiction: string; book: string; churchmanship: string; serviceType: string;
  services: string[]; lat: number; lng: number; verified: boolean; website: string;
};

export const parishes: Parish[] = [
  { id: "st-anselm", name: "Sample Parish of St. Anselm", city: "Anytown", state: "VA", address: "101 Example Lane, Anytown, VA", jurisdiction: "ACNA", book: "2019", churchmanship: "Broad Church", serviceType: "Sung", services: ["Sunday — 10:00 AM", "Wednesday — 6:00 PM"], lat: 38.90, lng: -77.04, verified: true, website: "#" },
  { id: "holy-cross", name: "Sample Church of the Holy Cross", city: "Exampleton", state: "MD", address: "22 Fiction Avenue, Exampleton, MD", jurisdiction: "REC", book: "1928", churchmanship: "Anglo-Catholic", serviceType: "Sung", services: ["Sunday — 9:30 AM", "Friday — 7:00 AM"], lat: 39.05, lng: -76.88, verified: true, website: "#" },
  { id: "st-bede", name: "Sample St. Bede Anglican Church", city: "Northfield", state: "NC", address: "8 Placeholder Road, Northfield, NC", jurisdiction: "APA", book: "1928", churchmanship: "Anglo-Catholic", serviceType: "Said", services: ["Sunday — 8:00 AM", "Sunday — 10:30 AM"], lat: 35.78, lng: -78.64, verified: false, website: "#" },
  { id: "good-shepherd", name: "Sample Good Shepherd Parish", city: "Westhaven", state: "GA", address: "14 Sample Street, Westhaven, GA", jurisdiction: "ACC", book: "1928", churchmanship: "Broad Church", serviceType: "Sung", services: ["Sunday — 11:00 AM"], lat: 33.75, lng: -84.39, verified: true, website: "#" },
  { id: "st-mark", name: "Sample St. Mark's Church", city: "Lakeview", state: "TN", address: "50 Demonstration Drive, Lakeview, TN", jurisdiction: "ACNA", book: "1662", churchmanship: "Evangelical/Reformed Anglican", serviceType: "Said", services: ["Sunday — 9:00 AM", "Thursday — 6:30 PM"], lat: 36.16, lng: -86.78, verified: false, website: "#" },
  { id: "all-saints", name: "Sample All Saints' Parish", city: "Fairfield", state: "PA", address: "31 Example Close, Fairfield, PA", jurisdiction: "REC", book: "1662", churchmanship: "Evangelical/Reformed Anglican", serviceType: "Sung", services: ["Sunday — 10:00 AM"], lat: 39.95, lng: -75.17, verified: true, website: "#" },
  { id: "st-timothy", name: "Sample St. Timothy's Anglican", city: "Riverton", state: "OH", address: "72 Fiction Court, Riverton, OH", jurisdiction: "APA", book: "1928", churchmanship: "Anglo-Catholic", serviceType: "Sung", services: ["Sunday — 8:30 AM", "Sunday — 11:00 AM"], lat: 39.96, lng: -83.00, verified: false, website: "#" },
  { id: "christ-church", name: "Sample Christ Church", city: "Greendale", state: "SC", address: "9 Mockingbird Way, Greendale, SC", jurisdiction: "ACC", book: "1928", churchmanship: "Broad Church", serviceType: "Said", services: ["Sunday — 10:30 AM"], lat: 34.00, lng: -81.03, verified: true, website: "#" },
  { id: "st-columba", name: "Sample St. Columba Mission", city: "Brookside", state: "KY", address: "144 Sample Parish Road, Brookside, KY", jurisdiction: "ACNA", book: "2019", churchmanship: "Evangelical/Reformed Anglican", serviceType: "Sung", services: ["Sunday — 4:00 PM"], lat: 38.25, lng: -85.76, verified: false, website: "#" },
];
