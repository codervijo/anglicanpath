import { createFileRoute, Outlet, useMatchRoute } from "@tanstack/react-router";
import { ParishFinder } from "@/components/site/parish-finder";
export const Route=createFileRoute("/find-a-parish")({component:FinderLayout});
function FinderLayout(){const match=useMatchRoute();return match({to:"/find-a-parish",fuzzy:false})?<ParishFinder/>:<Outlet/>}
