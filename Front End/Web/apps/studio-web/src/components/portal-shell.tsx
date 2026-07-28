"use client";
import { AppShell } from "@game-aggregator/ui-web";
import { BarChart3, Boxes, Code2, Gamepad2, Image as ImageIcon, LayoutDashboard, Package, ShieldCheck } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
const items=[
 {label:"Overview",hash:"overview",icon:<LayoutDashboard className="size-4"/>},
 {label:"Games",hash:"games",icon:<Gamepad2 className="size-4"/>},
 {label:"Builds",hash:"builds",icon:<Boxes className="size-4"/>},
 {label:"Releases",hash:"releases",icon:<Package className="size-4"/>},
 {label:"Media",hash:"media",icon:<ImageIcon className="size-4"/>},
 {label:"Developer integration",hash:"integration",icon:<Code2 className="size-4"/>},
 {label:"Team",hash:"team",icon:<ShieldCheck className="size-4"/>},
 {label:"Analytics",hash:"analytics",icon:<BarChart3 className="size-4"/>},
];
export function studioNavigation(hash:string){return items.map(item=>({label:item.label,href:`/#${item.hash}`,icon:item.icon,active:hash===item.hash}))}
export function PortalShell({children}:{children:ReactNode}){const [hash,setHash]=useState("overview");useEffect(()=>{const update=()=>setHash(location.hash.slice(1)||"overview"),frame=requestAnimationFrame(update);addEventListener("hashchange",update);return()=>{cancelAnimationFrame(frame);removeEventListener("hashchange",update)}},[]);return <AppShell portalLabel="Studio workspace" navigation={studioNavigation(hash)}>{children}</AppShell>}
