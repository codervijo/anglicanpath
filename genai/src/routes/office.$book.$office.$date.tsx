import { createFileRoute } from "@tanstack/react-router";
import { OfficeReader } from "@/components/office/office-reader";
export const Route=createFileRoute("/office/$book/$office/$date")({head:({params})=>{const label=params.office==="evening"?"Evening Prayer":"Morning Prayer";const title=`${label} · ${params.book} BCP — Anglican Path`;const description=`A placeholder ${label} reading view for ${params.date}.`;return{meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]};},component:OfficePage});
function OfficePage(){const p=Route.useParams();return <OfficeReader {...p}/>}
