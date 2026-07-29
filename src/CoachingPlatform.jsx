import { useState, useEffect } from "react";
import { fetchAllData, monday } from "./mondayClient.js";

const TODAY = new Date().toISOString().slice(0, 10);

// ─── Milestone Mortgage Solutions Brand ──────────────────────────────────────
const C = {
  bg: "#F6F7FA", surface: "#FFFFFF", surfaceHi: "#F3F5F9", border: "#E6E9F0",
  bHover: "rgba(78,161,240,0.45)", primary: "#4EA1F0", primaryDim: "rgba(78,161,240,0.14)",
  primaryText: "#2E86E0", accent: "#2E86E0", accentDim: "rgba(46,134,224,0.14)",
  gold: "#C9932E", goldDim: "rgba(201,147,46,0.14)", red: "#D6403D", redDim: "rgba(214,64,61,0.12)",
  green: "#1F9D5C", greenDim: "rgba(31,157,92,0.14)", text: "#151B33", muted: "#7C8494",
  dim: "#9AA3AF", white: "#10173A",
};

// ─── Icons ───────────────────────────────────────────────────────────────────
const I={
  dashboard:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  people:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  tasks:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  daily:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  resources:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  msg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  check:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  plus:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  trophy:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 22V2h4v20"/></svg>,
  edit:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  back:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  mail:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  search:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  repeat:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>,
  cal:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  chevL:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  chevR:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  chevD:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  send:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  megaphone:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  pdf:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  video:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  doc:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  trend:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

const dU=(d)=>Math.ceil((new Date(d)-new Date(TODAY))/864e5);
const fD=(d)=>{const s=String(d);return new Date(s.includes("T")?s:s+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});};
const fS=(d)=>new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const pC=(p)=>({high:C.red,medium:C.gold,low:C.primary}[p]||C.muted);
const cC=(c)=>({Sales:C.primary,"Product Knowledge":C.gold,Operations:C.accent,Partnerships:"#E07C5A",Compliance:"#7C6BC4"}[c]||C.muted);
const mkA=(n)=>n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
const shD=(d,n)=>{const x=new Date(d+"T12:00:00");x.setDate(x.getDate()+n);return x.toISOString().split("T")[0];};

// ─── Gamification ────────────────────────────────────────────────────────────
const POINTS={task:10,daily:5,call:1,meeting:3,application:5,preapproval:8,closed:25};
const LEVELS=[
  {min:0,    name:"Rookie",    icon:"🌱"},
  {min:150,  name:"Contender", icon:"⚡"},
  {min:400,  name:"Producer",  icon:"🔥"},
  {min:800,  name:"All-Star",  icon:"⭐"},
  {min:1500, name:"Champion",  icon:"👑"},
];
function levelFor(pts){let l=LEVELS[0];for(const lv of LEVELS)if(pts>=lv.min)l=lv;return l;}
function levelProgress(pts){
  const idx=LEVELS.findIndex(l=>l===levelFor(pts));
  const cur=LEVELS[idx],next=LEVELS[idx+1];
  if(!next)return{cur,next:null,pct:100};
  return{cur,next,pct:Math.max(4,Math.round(((pts-cur.min)/(next.min-cur.min))*100))};
}
const inRange=(dateStr,startDiff,endDiff)=>{const diff=Math.floor((new Date(TODAY+"T12:00:00")-new Date(dateStr+"T12:00:00"))/864e5);return diff>=startDiff&&diff<endDiff;};
const P_ALL=()=>true, P_WEEK=d=>inRange(d,0,7), P_LASTWEEK=d=>inRange(d,7,14);
function officerPoints(data,oid,pred=P_ALL){
  let pts=0;
  Object.entries(data.completions).forEach(([k,c])=>{if(k.startsWith(`${oid}-`)&&pred(c.completedAt||TODAY))pts+=POINTS.task;});
  Object.keys(data.dailyCompletions).forEach(k=>{if(k.startsWith(`${oid}-`)){const parts=k.split("-");if(pred(parts.slice(2).join("-")))pts+=POINTS.daily;}});
  (data.metrics||[]).forEach(m=>{if(m.officerId===oid&&pred(m.date))pts+=(m.calls||0)*POINTS.call+(m.meetings||0)*POINTS.meeting+(m.applications||0)*POINTS.application+(m.preapprovals||0)*POINTS.preapproval+(m.closed||0)*POINTS.closed;});
  return pts;
}
function officerStats(data,oid){
  let taskCount=0;Object.keys(data.completions).forEach(k=>{if(k.startsWith(`${oid}-`))taskCount++;});
  let dailyCount=0;Object.keys(data.dailyCompletions).forEach(k=>{if(k.startsWith(`${oid}-`))dailyCount++;});
  const m=sumMetrics((data.metrics||[]).filter(x=>x.officerId===oid));
  return{taskCount,dailyCount,metrics:m};
}
function officerStreak(data,oid){
  const dailyIds=data.dailyTasks.filter(t=>t.assignedTo.includes(oid)).map(t=>t.id);
  if(!dailyIds.length)return 0;
  const dayDone=dt=>dailyIds.some(did=>data.dailyCompletions[`${oid}-${did}-${dt}`]);
  let streak=0,cursor=TODAY;
  if(!dayDone(cursor))cursor=shD(cursor,-1);
  while(dayDone(cursor)&&streak<365){streak++;cursor=shD(cursor,-1);}
  return streak;
}
const BADGES=[
  {id:"first-close",name:"First Close",icon:"🎉",test:s=>s.metrics.closed>=1},
  {id:"closer-10",name:"Deal Closer",icon:"💰",test:s=>s.metrics.closed>=10},
  {id:"century-calls",name:"Century Club",icon:"📞",test:s=>s.metrics.calls>=100},
  {id:"task-master",name:"Task Master",icon:"✅",test:s=>s.taskCount>=25},
  {id:"daily-grind",name:"Daily Grind",icon:"📋",test:s=>s.dailyCount>=50},
  {id:"streak-7",name:"7-Day Streak",icon:"🔥",test:(s,streak)=>streak>=7},
  {id:"streak-30",name:"30-Day Streak",icon:"🚀",test:(s,streak)=>streak>=30},
];
function officerBadges(stats,streak){return BADGES.filter(b=>b.test(stats,streak));}

const sI={width:"100%",background:"rgba(16,23,58,0.04)",border:`1px solid ${C.border}`,borderRadius:6,padding:"9px 11px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
const sS={...sI,padding:"9px 8px",fontSize:12};
const sL={display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:0.8,fontFamily:"'Baloo 2',sans-serif"};
const bP=(ok)=>({width:"100%",padding:"11px",borderRadius:8,border:"none",fontSize:14,fontWeight:600,cursor:ok?"pointer":"default",background:ok?C.primary:"rgba(16,23,58,0.05)",color:ok?"#fff":C.muted,fontFamily:"inherit"});

function Ring({pct,size=56,sw=5,color=C.primary}){const r=(size-sw)/2,c=2*Math.PI*r;return<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(16,23,58,0.06)" strokeWidth={sw}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={c} strokeDashoffset={c-(pct/100)*c} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.6s"}}/></svg>;}
function Stat({label,value,sub,accent}){return<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",flex:1,minWidth:130}}><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,fontFamily:"'Baloo 2',sans-serif",marginBottom:5}}>{label}</div><div style={{fontSize:26,fontWeight:700,color:accent||C.white,lineHeight:1}}>{value}</div>{sub&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>{sub}</div>}</div>;}
function Modal({title,onClose,children,width=480}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:C.surfaceHi,border:`1px solid ${C.border}`,borderRadius:14,padding:28,width,maxHeight:"85vh",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h2 style={{margin:0,fontSize:18,fontWeight:700,color:C.white}}>{title}</h2><button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:4}}>{I.close}</button></div>{children}</div></div>;}
function Confirm({msg,sub,onOk,onNo}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onNo}><div onClick={e=>e.stopPropagation()} style={{background:C.surfaceHi,border:`1px solid ${C.redDim}`,borderRadius:14,padding:28,width:380,textAlign:"center"}}><div style={{width:48,height:48,borderRadius:"50%",background:C.redDim,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:C.red}}>{I.trash}</div><p style={{color:C.white,fontSize:15,fontWeight:500,margin:"0 0 6px"}}>{msg}</p><p style={{color:C.muted,fontSize:13,margin:"0 0 24px"}}>{sub}</p><div style={{display:"flex",gap:10}}><button onClick={onNo} style={{flex:1,padding:10,borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button><button onClick={onOk} style={{flex:1,padding:10,borderRadius:8,border:"none",background:C.red,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Delete</button></div></div></div>;}

// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const[data,setData]=useState(null);
  const[expandedOfficerId,setExpandedOfficerId]=useState(null);
  const[modal,setModal]=useState(null);
  const[tF,setTF]=useState("all");
  const[rF,setRF]=useState("all");
  const[loaded,setLoaded]=useState(false);
  const[loadError,setLoadError]=useState(null);
  const[search,setSearch]=useState("");
  const[dDate,setDDate]=useState(TODAY);
  const[aDate,setADate]=useState(TODAY);

  async function reload(){try{const d=await fetchAllData();setData(d);setLoadError(null);}catch(e){setLoadError(e.message||"Failed to load from Monday");}finally{setLoaded(true);}}
  useEffect(()=>{reload();},[]);

  // Every mutation below writes through to Monday first, then updates local
  // state on success. Data isn't re-fetched from Monday after every click —
  // if two people edited the board at once you'd want reload() instead, but
  // for a single coach this keeps things fast and simple.
  async function toggleC(oid,tid){const k=`${oid}-${tid}`,existing=data.completions[k];try{const newId=await monday.toggleTaskCompletion(oid,tid,existing?._id);setData(p=>{const c={...p.completions};if(existing)delete c[k];else c[k]={completedAt:TODAY,notes:"",_id:newId};return{...p,completions:c};});}catch(e){console.error("toggleC failed",e);}}
  async function addN(oid,tid,n){const k=`${oid}-${tid}`,existing=data.completions[k];if(!existing)return;try{await monday.setTaskCompletionNotes(existing._id,n);setData(p=>({...p,completions:{...p.completions,[k]:{...p.completions[k],notes:n}}}));}catch(e){console.error("addN failed",e);}}
  async function addTask(t){try{const id=await monday.createTask(t);setData(p=>({...p,tasks:[...p.tasks,{...t,id}]}));}catch(e){console.error("addTask failed",e);}}
  async function updT(id,t){try{await monday.updateTask(id,t);setData(p=>({...p,tasks:p.tasks.map(x=>x.id===id?{...t,id}:x)}));}catch(e){console.error("updT failed",e);}}
  async function delTask(id){try{await monday.deleteTask(id);setData(p=>{const c={...p.completions};Object.keys(c).forEach(k=>{if(k.endsWith(`-${id}`))delete c[k];});return{...p,tasks:p.tasks.filter(t=>t.id!==id),completions:c};});}catch(e){console.error("delTask failed",e);}}
  async function addRes(r){try{const id=await monday.createResource(r);setData(p=>({...p,resources:[...p.resources,{title:r.title,description:r.description,type:r.type,category:r.category,url:r.url||"",id,createdAt:TODAY}]}));}catch(e){console.error("addRes failed",e);}}
  async function updRes(id,r){try{await monday.updateResource(id,r);setData(p=>({...p,resources:p.resources.map(x=>x.id===id?{...x,title:r.title,description:r.description,type:r.type,category:r.category,url:r.url||""}:x)}));}catch(e){console.error("updRes failed",e);}}
  async function delRes(id){try{await monday.deleteResource(id);setData(p=>({...p,resources:p.resources.filter(r=>r.id!==id),tasks:p.tasks.map(t=>t.resourceId===id?{...t,resourceId:""}:t)}));}catch(e){console.error("delRes failed",e);}}
  async function addO(o){try{const id=await monday.createOfficer(o);const recurring=data.dailyTasks.filter(t=>t.recurring);if(recurring.length)await monday.addOfficerToRecurringDailyTasks(id,recurring);setData(p=>({...p,officers:[...p.officers,{...o,id,avatar:mkA(o.name),joinedDate:TODAY}],teams:p.teams.includes(o.team)?p.teams:[...p.teams,o.team],dailyTasks:p.dailyTasks.map(t=>t.recurring?{...t,assignedTo:[...t.assignedTo,id]}:t)}));}catch(e){console.error("addO failed",e);}}
  async function updO(id,u){try{await monday.updateOfficer(id,u);setData(p=>({...p,officers:p.officers.map(o=>o.id===id?{...o,...u,avatar:mkA(u.name||o.name)}:o),teams:p.teams.includes(u.team)?p.teams:[...p.teams,u.team]}));}catch(e){console.error("updO failed",e);}}
  async function delO(id){try{await monday.deleteOfficer(id);setData(p=>{const c={...p.completions},dc={...p.dailyCompletions};Object.keys(c).forEach(k=>{if(k.startsWith(`${id}-`))delete c[k];});Object.keys(dc).forEach(k=>{if(k.startsWith(`${id}-`))delete dc[k];});return{...p,officers:p.officers.filter(o=>o.id!==id),tasks:p.tasks.map(t=>({...t,assignedTo:t.assignedTo.filter(a=>a!==id)})),dailyTasks:p.dailyTasks.map(t=>({...t,assignedTo:t.assignedTo.filter(a=>a!==id)})),completions:c,dailyCompletions:dc};});}catch(e){console.error("delO failed",e);}}
  async function addDT(t){try{const id=await monday.createDailyTask(t);setData(p=>({...p,dailyTasks:[...p.dailyTasks,{...t,id,createdAt:TODAY}]}));}catch(e){console.error("addDT failed",e);}}
  async function updDT(id,t){try{await monday.updateDailyTask(id,t);setData(p=>({...p,dailyTasks:p.dailyTasks.map(x=>x.id===id?{...t,id,createdAt:x.createdAt}:x)}));}catch(e){console.error("updDT failed",e);}}
  async function togD(oid,did,dt){const k=`${oid}-${did}-${dt}`,existing=data.dailyCompletions[k];try{const newId=await monday.toggleDailyCheckin(oid,did,dt,existing?._id);setData(p=>{const dc={...p.dailyCompletions};if(existing)delete dc[k];else dc[k]={done:true,notes:"",_id:newId};return{...p,dailyCompletions:dc};});}catch(e){console.error("togD failed",e);}}
  async function setDN(oid,did,dt,n){const k=`${oid}-${did}-${dt}`,existing=data.dailyCompletions[k];if(!existing)return;try{await monday.setDailyCheckinNotes(existing._id,n);setData(p=>({...p,dailyCompletions:{...p.dailyCompletions,[k]:{...p.dailyCompletions[k],notes:n}}}));}catch(e){console.error("setDN failed",e);}}
  async function delDT(did){try{await monday.deleteDailyTask(did);setData(p=>{const dc={...p.dailyCompletions};Object.keys(dc).forEach(k=>{if(k.includes(`-${did}-`))delete dc[k];});return{...p,dailyTasks:p.dailyTasks.filter(t=>t.id!==did),dailyCompletions:dc};});}catch(e){console.error("delDT failed",e);}}
  async function logM(oid,dt,patch){const existing=data.metrics.find(m=>m.officerId===oid&&m.date===dt);try{const id=await monday.logMetrics(existing?.id,oid,dt,patch);setData(p=>({...p,metrics:existing?p.metrics.map(m=>m.id===existing.id?{...m,...patch,id}:m):[...p.metrics,{...patch,id,officerId:oid,date:dt}]}));}catch(e){console.error("logM failed",e);}}
  async function saveGoals(g){try{const id=await monday.updateGoals(data.goals._itemId,g);setData(p=>({...p,goals:{...g,_itemId:id}}));}catch(e){console.error("saveGoals failed",e);}}
  async function addRecap(r){try{const id=await monday.createRecap(r);setData(p=>({...p,recaps:[{...r,id,createdAt:TODAY},...p.recaps]}));}catch(e){console.error("addRecap failed",e);}}
  async function delRecap(id){try{await monday.deleteRecap(id);setData(p=>({...p,recaps:p.recaps.filter(r=>r.id!==id)}));}catch(e){console.error("delRecap failed",e);}}

  if(loadError)return<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Inter',sans-serif",flexDirection:"column",gap:10,padding:24,textAlign:"center"}}><p style={{color:C.red,fontWeight:600}}>Couldn't load data from Monday.com</p><p style={{opacity:0.6,fontSize:12,maxWidth:420}}>{loadError}</p><p style={{opacity:0.5,fontSize:12}}>Check your .env file has a valid VITE_MONDAY_API_TOKEN and board IDs, then refresh.</p></div>;
  if(!loaded||!data)return<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Inter',sans-serif"}}><p style={{opacity:0.6}}>Loading from Monday...</p></div>;

  // "Completion" is based on today's Daily Tasks (the recurring habit checklist),
  // since that's the workflow officers actually use day to day — the old one-time
  // Coaching Tasks list is tracked separately below and no longer drives this %.
  const oS=oid=>{const a=data.dailyTasks.filter(t=>t.assignedTo.includes(oid)),c=a.filter(t=>data.dailyCompletions[`${oid}-${t.id}-${TODAY}`]);return{total:a.length,completed:c.length,overdue:0,rate:a.length?Math.round((c.length/a.length)*100):0};};
  const gS={totalTasks:data.tasks.reduce((s,t)=>s+t.assignedTo.length,0),totalCompleted:Object.keys(data.completions).length,avgRate:data.officers.length?Math.round(data.officers.reduce((s,o)=>s+oS(o.id).rate,0)/data.officers.length):0,overdue:data.officers.reduce((s,o)=>s+oS(o.id).overdue,0)};
  const dSt=dt=>{let tot=0,dn=0;data.dailyTasks.forEach(t=>t.assignedTo.forEach(oid=>{if(data.officers.find(o=>o.id===oid)){tot++;if(data.dailyCompletions[`${oid}-${t.id}-${dt}`])dn++;}}));return{tot,dn,pct:tot?Math.round((dn/tot)*100):0};};
  const scrollTo=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});};
  const goToOfficer=(o)=>{setSearch("");setExpandedOfficerId(o.id);scrollTo("officers");};

  return(
    <div style={{fontFamily:"'Inter',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex"}}>
      <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* ── Sidebar ── */}
      <nav style={{width:240,minWidth:240,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"20px 0"}}>
        {/* Logo */}
        <div style={{padding:"0 20px 24px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",marginBottom:6}}>
            <div style={{fontSize:13,fontWeight:700,color:C.primary,letterSpacing:1,textTransform:"uppercase",fontFamily:"'Baloo 2',sans-serif",lineHeight:1}}>Coaching × Milestone</div>
          </div>
          <div style={{fontSize:9,color:C.dim,fontFamily:"'Baloo 2',sans-serif",letterSpacing:0.3}}>Milestone Mortgage Solutions</div>
        </div>

        <div style={{padding:"14px 20px 4px"}}>
          <a href="https://www.milestone-hub.com/rookie-lo-blueprint" target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"10px 14px",borderRadius:8,background:`linear-gradient(135deg,${C.primary},${C.accent})`,color:"#fff",fontSize:12,fontWeight:700,textDecoration:"none",fontFamily:"'Baloo 2',sans-serif",letterSpacing:0.3,boxShadow:"0 3px 10px rgba(78,161,240,0.35)"}}>{I.trend} Rookie LO Blueprint</a>
        </div>

        <div style={{padding:"10px 0",flex:1}}>
          {[
            {key:"dashboard",icon:I.dashboard,label:"Dashboard"},
            {key:"officers",icon:I.people,label:"Loan Officers"},
            {key:"activity",icon:I.trend,label:"Activity"},
            {key:"resources",icon:I.resources,label:"Resources"},
            {key:"calendar",icon:I.cal,label:"Calendar"},
            {key:"recaps",icon:I.msg,label:"Recaps"},
          ].map(item=>(
            <button key={item.key} onClick={()=>scrollTo(item.key)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 20px",margin:"1px 8px",width:"calc(100% - 16px)",
              borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:400,
              background:"transparent",color:C.muted,
              transition:"all 0.15s",fontFamily:"inherit",textAlign:"left",position:"relative",
            }} onMouseEnter={e=>{e.currentTarget.style.background=C.primaryDim;e.currentTarget.style.color=C.primary;}} onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.muted;}}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>

        <div style={{padding:"14px 20px",borderTop:`1px solid ${C.border}`,fontSize:10,color:C.dim,fontFamily:"'Baloo 2',sans-serif",lineHeight:1.8}}>
          {data.officers.length} officers · {data.tasks.length} tasks<br/>NMLS #1815656
        </div>
      </nav>

      {/* ── Main — everything on one scrollable page ── */}
      <main style={{flex:1,padding:"24px 32px",overflowY:"auto",maxHeight:"100vh"}}>
        <section id="dashboard"><Dashboard data={data} g={gS} oS={oS} goToOfficer={goToOfficer} dSt={dSt(TODAY)}/></section>
        <div style={{borderTop:`1px solid ${C.border}`,margin:"36px 0"}}/>
        <section id="officers"><Officers data={data} oS={oS} setModal={setModal} search={search} setSearch={setSearch} expandedId={expandedOfficerId} setExpandedId={setExpandedOfficerId} toggle={toggleC} addN={addN} togD={togD} setDN={setDN}/></section>
        <div style={{borderTop:`1px solid ${C.border}`,margin:"36px 0"}}/>
        <section id="activity"><ActivityPage data={data} date={aDate} setDate={setADate} logM={logM} setModal={setModal} dDate={dDate} setDDate={setDDate} togD={togD} setDN={setDN} delDT={delDT} tF={tF} setTF={setTF} toggle={toggleC}/></section>
        <div style={{borderTop:`1px solid ${C.border}`,margin:"36px 0"}}/>
        <section id="resources"><ResourcesPage data={data} filter={rF} setFilter={setRF} setModal={setModal}/></section>
        <div style={{borderTop:`1px solid ${C.border}`,margin:"36px 0"}}/>
        <section id="calendar"><CalendarPage/></section>
        <div style={{borderTop:`1px solid ${C.border}`,margin:"36px 0"}}/>
        <section id="recaps"><RecapsPage data={data} setModal={setModal}/></section>
      </main>

      {modal==="add-task"&&<AddTaskModal data={data} onClose={()=>setModal(null)} onSave={addTask}/>}
      {modal?.type==="edit-task"&&<AddTaskModal data={data} task={modal.task} onClose={()=>setModal(null)} onSave={t=>updT(modal.task.id,t)}/>}
      {modal?.type==="confirm-delete-task"&&<Confirm msg={`Delete "${modal.task.title}"?`} sub="Completion history will be lost." onNo={()=>setModal(null)} onOk={()=>{delTask(modal.task.id);setModal(null);}}/>}
      {modal==="add-resource"&&<AddResourceModal onClose={()=>setModal(null)} onSave={addRes}/>}
      {modal?.type==="edit-resource"&&<AddResourceModal resource={modal.resource} onClose={()=>setModal(null)} onSave={r=>updRes(modal.resource.id,r)}/>}
      {modal?.type==="confirm-delete-resource"&&<Confirm msg={`Delete "${modal.resource.title}"?`} sub="Any tasks linked to this resource will be unlinked." onNo={()=>setModal(null)} onOk={()=>{delRes(modal.resource.id);setModal(null);}}/>}
      {modal==="add-officer"&&<OfficerFormModal data={data} onClose={()=>setModal(null)} onSave={addO}/>}
      {modal==="add-daily"&&<AddDailyModal data={data} onClose={()=>setModal(null)} onSave={addDT}/>}
      {modal?.type==="edit-daily"&&<AddDailyModal data={data} task={modal.task} onClose={()=>setModal(null)} onSave={t=>updDT(modal.task.id,t)}/>}
      {modal?.type==="edit-officer"&&<OfficerFormModal data={data} officer={modal.officer} onClose={()=>setModal(null)} onSave={u=>updO(modal.officer.id,u)}/>}
      {modal?.type==="confirm-delete"&&<Confirm msg={`Remove ${modal.officer.name}?`} sub="Removes from all tasks and assignments." onNo={()=>setModal(null)} onOk={()=>{delO(modal.officer.id);setModal(null);}}/>}
      {modal?.type==="confirm-delete-daily"&&<Confirm msg={`Delete "${modal.task.title}"?`} sub="All history will be lost." onNo={()=>setModal(null)} onOk={()=>{delDT(modal.task.id);setModal(null);}}/>}
      {modal==="edit-goals"&&<GoalsModal goals={data.goals} onClose={()=>setModal(null)} onSave={saveGoals}/>}
      {modal==="add-recap"&&<AddRecapModal data={data} onClose={()=>setModal(null)} onSave={addRecap}/>}
      {modal?.type==="confirm-delete-recap"&&<Confirm msg="Delete this recap?" sub="This can't be undone." onNo={()=>setModal(null)} onOk={()=>{delRecap(modal.recap.id);setModal(null);}}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({data,g,oS,goToOfficer,dSt}){
  const board=data.officers.map(o=>({o,weekPts:officerPoints(data,o.id,P_WEEK),lastWeekPts:officerPoints(data,o.id,P_LASTWEEK),allTime:officerPoints(data,o.id,P_ALL),streak:officerStreak(data,o.id)}));
  const ranked=[...board].sort((a,b)=>b.weekPts-a.weekPts).map((r,i)=>({...r,rank:i+1}));
  const lastRanks={};[...board].sort((a,b)=>b.lastWeekPts-a.lastWeekPts).forEach((r,i)=>{lastRanks[r.o.id]=i+1;});
  const podium=ranked.slice(0,3);
  return<div>
    <div style={{position:"relative",overflow:"hidden",background:`linear-gradient(120deg,${C.accent},${C.primary} 55%,${C.gold})`,borderRadius:14,padding:"22px 28px",marginBottom:22,boxShadow:`0 8px 28px rgba(46,134,224,0.4), 0 2px 8px rgba(201,147,46,0.25)`,border:"1px solid rgba(255,255,255,0.25)"}}>
      <div style={{position:"absolute",top:-30,right:10,fontSize:130,lineHeight:1,color:"rgba(255,255,255,0.14)",fontFamily:"'Baloo 2',sans-serif",fontWeight:800,pointerEvents:"none"}}>"</div>
      <div style={{position:"relative",fontSize:10,fontWeight:800,color:"rgba(255,255,255,0.85)",textTransform:"uppercase",letterSpacing:1.5,fontFamily:"'Baloo 2',sans-serif",marginBottom:6}}>⚡ Daily Motivation</div>
      <p style={{position:"relative",margin:0,fontSize:19,fontWeight:800,color:"#fff",fontFamily:"'Baloo 2',sans-serif",fontStyle:"italic",lineHeight:1.4,textShadow:"0 2px 6px rgba(0,0,0,0.2)"}}>"Success is the sum of small efforts, repeated day in and day out."<span style={{display:"block",marginTop:6,fontSize:13,fontWeight:700,fontStyle:"normal",color:"rgba(255,255,255,0.9)",letterSpacing:0.3}}>— Robert Collier</span></p>
    </div>
    <div style={{marginBottom:24}}><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>Coaching Dashboard</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Milestone Mortgage Solutions — Team Progress</p></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr",gap:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:6}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:C.gold}}>{I.trophy}</span><h3 style={{margin:0,fontSize:14,fontWeight:600,color:C.white,fontFamily:"'Baloo 2',sans-serif"}}>Leaderboard</h3></div>
          <span style={{fontSize:9,color:C.dim,fontFamily:"'Baloo 2',sans-serif",textTransform:"uppercase",letterSpacing:0.6}}>This Week's Points</span>
        </div>
        {podium.length===3&&<div style={{display:"flex",alignItems:"flex-end",gap:12,marginBottom:26,padding:"0 4px"}}>
          {[podium[1],podium[0],podium[2]].map((r,pi)=>{
            const h=pi===1?120:pi===0?92:76;
            const rankColors={1:{bg:"linear-gradient(135deg,#FFD24D,#E8A317)",ring:"#FFD24D",shadow:"rgba(232,163,23,0.45)"},2:{bg:"linear-gradient(135deg,#8FD3FE,#4FA9E8)",ring:"#4FA9E8",shadow:"rgba(79,169,232,0.4)"},3:{bg:"linear-gradient(135deg,#FFAE73,#E8722D)",ring:"#E8722D",shadow:"rgba(232,114,45,0.4)"}}[r.rank];
            return<div key={r.o.id} onClick={()=>goToOfficer(r.o)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",cursor:"pointer"}}>
              <div style={{width:pi===1?30:26,height:pi===1?30:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:pi===1?15:13,fontWeight:800,color:"#fff",background:rankColors.bg,marginBottom:6,boxShadow:`0 3px 10px ${rankColors.shadow}`,fontFamily:"'Baloo 2',sans-serif",flexShrink:0}}>{r.rank}</div>
              <div style={{width:pi===1?76:60,height:pi===1?76:60,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:pi===1?22:17,fontWeight:700,color:"#fff",background:`linear-gradient(135deg,${C.gold},${C.primary})`,marginBottom:9,border:`3px solid ${rankColors.ring}`,flexShrink:0}}>{r.o.avatar}</div>
              <div style={{fontSize:pi===1?15:13,fontWeight:700,color:C.white,textAlign:"center",marginBottom:2,lineHeight:1.25,wordBreak:"break-word"}}>{r.o.name}</div>
              <div style={{fontSize:pi===1?14:12,color:rankColors.ring,fontWeight:700,fontFamily:"'Baloo 2',sans-serif",marginBottom:8}}>{r.weekPts} pts</div>
              <div style={{width:"100%",height:h,background:`linear-gradient(180deg,${rankColors.shadow},rgba(212,168,75,0.06))`,borderRadius:"8px 8px 0 0",border:`1px solid ${rankColors.ring}55`,borderBottom:"none"}}/>
            </div>;
          })}
        </div>}
        {ranked.map(r=>{
          const lvl=levelFor(r.allTime);
          const lastRank=lastRanks[r.o.id]||r.rank;
          const trend=r.rank<lastRank?"up":r.rank>lastRank?"down":"same";
          return<div key={r.o.id} onClick={()=>goToOfficer(r.o)} style={{display:"flex",alignItems:"center",gap:9,padding:"8px 10px",marginBottom:2,borderRadius:7,cursor:"pointer",background:r.rank===1?"rgba(212,168,75,0.05)":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(16,23,58,0.03)"} onMouseLeave={e=>e.currentTarget.style.background=r.rank===1?"rgba(212,168,75,0.05)":"transparent"}>
            <div style={{width:16,fontSize:12,fontWeight:700,color:r.rank===1?C.gold:C.dim,fontFamily:"'Baloo 2',sans-serif"}}>#{r.rank}</div>
            <span style={{width:11,fontSize:10,color:trend==="up"?C.green:trend==="down"?C.red:C.dim}}>{trend==="up"?"▲":trend==="down"?"▼":"–"}</span>
            <div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${r.rank===1?C.gold:C.primary}50,${r.rank===1?"#E07C5A":C.accent}50)`,flexShrink:0}}>{r.o.avatar}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:500,color:C.white,display:"flex",alignItems:"center",gap:5}}>{r.o.name}<span style={{fontSize:11}} title={lvl.name}>{lvl.icon}</span></div>
              <div style={{fontSize:10,color:C.muted,display:"flex",gap:6,alignItems:"center"}}>{r.streak>0&&<span style={{color:C.red}}>🔥{r.streak}</span>}<span>{lvl.name}</span></div>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:C.gold,fontFamily:"'Baloo 2',sans-serif"}}>{r.weekPts}<span style={{fontSize:9,color:C.dim,fontWeight:400}}> pts</span></span>
          </div>;})}
        {ranked.length===0&&<p style={{color:C.muted,fontSize:13}}>Add loan officers to start the competition.</p>}
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TASKS (combined: Daily checklist + One-time coaching assignments)
// ═══════════════════════════════════════════════════════════════════════════════
function DailyPage({data,date,setDate,togD,setDN,setModal,delDT}){
  const[eN,setEN]=useState(null);const[nT,setNT]=useState("");
  const[collapsed,setCollapsed]=useState({});
  const isT=date===TODAY;
  return<div>
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"4px 0 18px",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 14px",width:"fit-content"}}>
      <button onClick={()=>setDate(shD(date,-1))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:2,display:"flex"}}>{I.chevL}</button>
      <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:C.primary}}>{I.cal}</span><span style={{fontSize:14,fontWeight:600,color:C.white,minWidth:150}}>{fS(date)}</span>{isT&&<span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:C.primaryDim,color:C.primary,fontFamily:"'Baloo 2',sans-serif"}}>TODAY</span>}</div>
      <button onClick={()=>setDate(shD(date,1))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:2,display:"flex"}}>{I.chevR}</button>
      {!isT&&<button onClick={()=>setDate(TODAY)} style={{marginLeft:6,background:C.primaryDim,border:`1px solid rgba(45,183,166,0.2)`,borderRadius:6,padding:"4px 10px",color:C.primary,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Today</button>}
    </div>
    {data.dailyTasks.map(t=>{
      const aO=t.assignedTo.map(id=>data.officers.find(o=>o.id===id)).filter(Boolean);
      const dc=aO.filter(o=>data.dailyCompletions[`${o.id}-${t.id}-${date}`]).length;
      const isOpen=!collapsed[t.id];
      return<div key={t.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:8}}>
        <div onClick={()=>setCollapsed(p=>({...p,[t.id]:!p[t.id]}))} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:isOpen?6:0,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{color:C.dim,display:"flex",transform:isOpen?"none":"rotate(-90deg)",transition:"transform 0.15s"}}>{I.chevD}</span><span style={{fontSize:14,fontWeight:600,color:C.white}}>{t.title}</span><span style={{fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:3,background:`${cC(t.category)}20`,color:cC(t.category),textTransform:"uppercase",fontFamily:"'Baloo 2',sans-serif"}}>{t.category}</span>{t.recurring&&<span style={{display:"flex",alignItems:"center",gap:2,fontSize:9,color:C.primary,fontFamily:"'Baloo 2',sans-serif"}}>{I.repeat} Recurring</span>}{!t.recurring&&<span style={{fontSize:9,color:C.gold,fontFamily:"'Baloo 2',sans-serif"}}>One-off</span>}</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,fontFamily:"'Baloo 2',sans-serif",color:dc===aO.length?C.green:C.muted}}>{dc}/{aO.length}</span><button onClick={e=>{e.stopPropagation();setModal({type:"edit-daily",task:t});}} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",padding:2,opacity:0.6}}>{I.edit}</button><button onClick={e=>{e.stopPropagation();setModal({type:"confirm-delete-daily",task:t});}} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",padding:2,opacity:0.6}}>{I.trash}</button></div>
        </div>
        {isOpen&&<>
        {t.description&&<p style={{margin:"0 0 8px",fontSize:12,color:C.muted,whiteSpace:"pre-line",lineHeight:1.6}}>{t.description}</p>}
        {aO.map(o=>{const k=`${o.id}-${t.id}-${date}`,comp=data.dailyCompletions[k],done=!!comp,isE=eN===k;return<div key={o.id} style={{display:"flex",alignItems:"center",gap:9,padding:"5px 8px",borderRadius:5,background:done?"rgba(76,175,125,0.04)":"transparent",border:`1px solid ${done?"rgba(76,175,125,0.12)":"rgba(16,23,58,0.03)"}`,marginBottom:2}}>
          <button onClick={()=>togD(o.id,t.id,date)} style={{width:22,height:22,borderRadius:5,border:`2px solid ${done?C.green:"rgba(16,23,58,0.12)"}`,background:done?C.greenDim:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.green,flexShrink:0}}>{done&&I.check}</button>
          <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${C.primary}30,${C.accent}30)`,flexShrink:0}}>{o.avatar}</div>
          <span style={{fontSize:12,color:done?C.muted:C.white,fontWeight:500,minWidth:90}}>{o.name}</span>
          <div style={{flex:1}}>{done&&!isE&&<span onClick={()=>{setEN(k);setNT(comp.notes||"");}} style={{fontSize:11,color:comp.notes?C.text:C.dim,cursor:"pointer",fontStyle:comp.notes?"normal":"italic"}}>{comp.notes||"Add note..."}</span>}{done&&isE&&<div style={{display:"flex",gap:5}}><input value={nT} onChange={e=>setNT(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setDN(o.id,t.id,date,nT);setEN(null);}}} style={{...sI,flex:1,padding:"3px 8px",fontSize:11}} autoFocus/><button onClick={()=>{setDN(o.id,t.id,date,nT);setEN(null);}} style={{background:C.primary,border:"none",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontFamily:"inherit"}}>Save</button></div>}</div>
        </div>;})}
        </>}
      </div>;
    })}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVITY / FUNNEL TRACKER
// ═══════════════════════════════════════════════════════════════════════════════
const FUNNEL_FIELDS=[
  {key:"calls",label:"Prospecting Calls"},{key:"applications",label:"Applications"},
  {key:"preapprovals",label:"Preapprovals"},{key:"closed",label:"Closed Loans"},
  {key:"creditPulls",label:"Credit Pulls"},{key:"faceToFace",label:"Face-to-Face Meetings"},
  {key:"followUpCalls",label:"Follow-Up Calls"},{key:"openHouses",label:"Open Houses"},
];
const pctOf=(n,d)=>d?Math.round((n/d)*100):0;
const inPeriod=(dateStr,period)=>{
  if(period==="all")return true;
  const diff=Math.floor((new Date(TODAY+"T12:00:00")-new Date(dateStr+"T12:00:00"))/864e5);
  if(period==="week")return diff>=0&&diff<7;
  if(period==="month")return diff>=0&&diff<30;
  return true;
};
function sumMetrics(list){return list.reduce((s,m)=>{FUNNEL_FIELDS.forEach(ff=>{s[ff.key]=(s[ff.key]||0)+(m[ff.key]||0);});return s;},{});}
// Daily goals are set once (team-wide, same for every officer). Week/Month
// summary goals are the daily goal × a workday count — an assumption we made
// since goals were only ever entered as a daily number.
const PERIOD_WORKDAYS={week:5,month:20,all:null};

function MetricRow({officer,metric,date,logM,goals}){
  const[f,setF]=useState({calls:metric?.calls||0,meetings:metric?.meetings||0,applications:metric?.applications||0,preapprovals:metric?.preapprovals||0,closed:metric?.closed||0,creditPulls:metric?.creditPulls||0,faceToFace:metric?.faceToFace||0,followUpCalls:metric?.followUpCalls||0,openHouses:metric?.openHouses||0,notes:metric?.notes||""});
  const[dirty,setDirty]=useState(false);
  const s=(k,v)=>{setF(p=>({...p,[k]:v}));setDirty(true);};
  const save=()=>{logM(officer.id,date,f);setDirty(false);};
  return<div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 10px",borderRadius:7,background:dirty?"rgba(212,168,75,0.04)":"transparent",border:`1px solid ${dirty?"rgba(212,168,75,0.15)":"rgba(16,23,58,0.03)"}`,marginBottom:2,flexWrap:"wrap"}}>
    <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${C.primary}30,${C.accent}30)`,flexShrink:0}}>{officer.avatar}</div>
    <span style={{fontSize:12,color:C.white,fontWeight:500,minWidth:100}}>{officer.name}</span>
    {FUNNEL_FIELDS.map(ff=>{const goal=goals?.[ff.key]??0;const hit=f[ff.key]>=goal;return<div key={ff.key} style={{width:84,textAlign:"center"}}>
      <input type="number" min="0" value={f[ff.key]} onChange={e=>s(ff.key,Math.max(0,Number(e.target.value)||0))} style={{...sS,width:84,textAlign:"center",padding:"7px 4px",borderColor:hit?"rgba(76,175,125,0.4)":C.border,background:hit?"rgba(76,175,125,0.06)":sS.background,color:hit?C.green:C.text}}/>
    </div>;})}
    <input value={f.notes} onChange={e=>s("notes",e.target.value)} placeholder="Names / notes of people called..." style={{...sI,flex:1,minWidth:160,padding:"7px 9px",fontSize:12}}/>
    {dirty&&<button onClick={save} style={{background:C.primary,border:"none",color:"#fff",fontSize:11,fontWeight:600,padding:"6px 12px",borderRadius:6,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}>Save</button>}
  </div>;
}

function ActivityPage({data,date,setDate,logM,setModal,dDate,setDDate,togD,setDN,delDT,tF,setTF,toggle}){
  const[period,setPeriod]=useState("week");
  const[view,setView]=useState("daily");
  const pill=(active)=>({padding:"5px 14px",borderRadius:6,border:"1px solid",fontSize:12,cursor:"pointer",fontWeight:600,fontFamily:"inherit",background:active?C.primaryDim:"transparent",borderColor:active?`rgba(45,183,166,0.3)`:C.border,color:active?C.primary:C.muted});
  const isT=date===TODAY;
  const periodMetrics=data.metrics.filter(m=>inPeriod(m.date,period));
  const goals=data.goals||{};
  return<div>
    <div style={{marginBottom:6}}><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>Activity</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Calls, meetings, applications, preapprovals & closed loans — plus daily &amp; one-time tasks, tracked together</p></div>

    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"20px 0 8px",flexWrap:"wrap",gap:8}}>
      <h3 style={{fontSize:18,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>Log for the day</h3>
      <button onClick={()=>setModal("edit-goals")} style={{display:"flex",alignItems:"center",gap:5,background:"rgba(16,23,58,0.03)",border:`1px solid ${C.border}`,color:C.muted,padding:"6px 12px",borderRadius:7,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.edit} Edit Goals</button>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 14px",width:"fit-content"}}>
      <button onClick={()=>setDate(shD(date,-1))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:2,display:"flex"}}>{I.chevL}</button>
      <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:C.primary}}>{I.cal}</span><span style={{fontSize:14,fontWeight:600,color:C.white,minWidth:150}}>{fS(date)}</span>{isT&&<span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:C.primaryDim,color:C.primary,fontFamily:"'Baloo 2',sans-serif"}}>TODAY</span>}</div>
      <button onClick={()=>setDate(shD(date,1))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:2,display:"flex"}}>{I.chevR}</button>
      {!isT&&<button onClick={()=>setDate(TODAY)} style={{marginLeft:6,background:C.primaryDim,border:`1px solid rgba(45,183,166,0.2)`,borderRadius:6,padding:"4px 10px",color:C.primary,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Today</button>}
    </div>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",marginBottom:28}}>
      <div style={{display:"flex",alignItems:"flex-end",gap:10,padding:"0 10px 10px",marginBottom:6,borderBottom:`1px solid ${C.border}`,fontSize:10,color:C.dim,textTransform:"uppercase",letterSpacing:0.6,fontFamily:"'Baloo 2',sans-serif"}}>
        <div style={{width:26}}/><div style={{minWidth:100}}>Officer</div>{FUNNEL_FIELDS.map(ff=><div key={ff.key} style={{width:84,textAlign:"center"}}>
          <div>{ff.label}</div>
          <div style={{display:"inline-block",marginTop:4,fontSize:10,color:C.primary,background:C.primaryDim,textTransform:"none",fontWeight:700,padding:"1px 7px",borderRadius:20,fontFamily:"'Baloo 2',sans-serif"}}>Goal {goals[ff.key]??"–"}</div>
        </div>)}<div style={{flex:1,minWidth:160}}>Notes</div>
      </div>
      {data.officers.length===0&&<p style={{color:C.muted,fontSize:13,padding:"6px 10px"}}>Add loan officers to start tracking activity.</p>}
      {data.officers.map(o=>{const metric=data.metrics.find(m=>m.officerId===o.id&&m.date===date);return<MetricRow key={`${o.id}-${date}`} officer={o} metric={metric} date={date} logM={logM} goals={goals}/>;})}
    </div>

    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10,flexWrap:"wrap",gap:8}}>
      <h3 style={{fontSize:18,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>Conversion Summary</h3>
      <div style={{display:"flex",gap:6}}>{[{k:"week",l:"This Week"},{k:"month",l:"This Month"},{k:"all",l:"All Time"}].map(p=><button key={p.k} onClick={()=>setPeriod(p.k)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid",fontSize:11,cursor:"pointer",fontWeight:500,fontFamily:"inherit",background:period===p.k?C.primaryDim:"transparent",borderColor:period===p.k?`rgba(45,183,166,0.3)`:C.border,color:period===p.k?C.primary:C.muted}}>{p.l}</button>)}</div>
    </div>

    <h3 style={{fontSize:13,fontWeight:600,color:C.white,margin:"0 0 10px",fontFamily:"'Baloo 2',sans-serif"}}>By Officer</h3>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",overflowX:"auto"}}>
      <div style={{display:"grid",gridTemplateColumns:`1.3fr repeat(${FUNNEL_FIELDS.length},0.8fr)`,gap:4,padding:"9px 14px",background:"rgba(16,23,58,0.03)",fontSize:9,color:C.dim,textTransform:"uppercase",letterSpacing:0.5,fontFamily:"'Baloo 2',sans-serif",minWidth:760}}>
        <div>Officer</div>{FUNNEL_FIELDS.map(ff=><div key={ff.key}>{ff.label}</div>)}
      </div>
      {data.officers.map(o=>{const m=sumMetrics(periodMetrics.filter(x=>x.officerId===o.id));return<div key={o.id} style={{display:"grid",gridTemplateColumns:`1.3fr repeat(${FUNNEL_FIELDS.length},0.8fr)`,gap:4,padding:"9px 14px",fontSize:12,color:C.text,borderTop:`1px solid ${C.border}`,minWidth:760}}>
        <div style={{display:"flex",alignItems:"center",gap:7,fontWeight:500,color:C.white}}><div style={{width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${C.primary}30,${C.accent}30)`,flexShrink:0}}>{o.avatar}</div>{o.name}</div>
        {FUNNEL_FIELDS.map(ff=><div key={ff.key} style={ff.key==="closed"?{color:C.green,fontWeight:600}:undefined}>{m[ff.key]||0}</div>)}
      </div>;})}
      {data.officers.length===0&&<p style={{color:C.muted,fontSize:13,padding:"12px 14px"}}>No officers yet.</p>}
    </div>

    <div style={{borderTop:`1px solid ${C.border}`,margin:"32px 0"}}/>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6,flexWrap:"wrap",gap:8}}>
      <div><h3 style={{fontSize:18,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>Tasks</h3><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>{view==="daily"?"Recurring and one-off daily assignments":"One-time assignments with deadlines"}</p></div>
      <button onClick={()=>setModal(view==="daily"?"add-daily":"add-task")} style={{display:"flex",alignItems:"center",gap:5,background:C.primary,border:"none",color:"#fff",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.plus} {view==="daily"?"New Daily Task":"New Task"}</button>
    </div>
    <div style={{display:"flex",gap:6,margin:"14px 0 20px"}}>
      <button onClick={()=>setView("daily")} style={pill(view==="daily")}>{I.repeat} Daily Tasks</button>
      <button onClick={()=>setView("onetime")} style={pill(view==="onetime")}>{I.tasks} One-Time Tasks</button>
    </div>
    {view==="daily"
      ?<DailyPage data={data} date={dDate} setDate={setDDate} togD={togD} setDN={setDN} setModal={setModal} delDT={delDT}/>
      :<TasksPage data={data} filter={tF} setFilter={setTF} setModal={setModal} toggle={toggle}/>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OFFICERS + DETAIL + TASKS + RESOURCES (same patterns, Milestone branded)
// ═══════════════════════════════════════════════════════════════════════════════
function Officers({data,oS,setModal,search,setSearch,expandedId,setExpandedId,toggle,addN,togD,setDN}){
  const f=data.officers.filter(o=>o.name.toLowerCase().includes(search.toLowerCase())||o.team.toLowerCase().includes(search.toLowerCase()));
  const expandedOfficer=expandedId&&data.officers.find(o=>o.id===expandedId);
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><div><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>Loan Officers</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Manage your Milestone team</p></div><button onClick={()=>setModal("add-officer")} style={{display:"flex",alignItems:"center",gap:5,background:C.primary,border:"none",color:"#fff",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.plus} Add Officer</button></div>
    <div style={{position:"relative",margin:"14px 0 18px"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted}}>{I.search}</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...sI,paddingLeft:36,maxWidth:340}}/></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
      {f.map(o=>{const s=oS(o.id);const isExpanded=expandedId===o.id;const gPts=officerPoints(data,o.id);const lvl=levelFor(gPts);const streak=officerStreak(data,o.id);const badges=officerBadges(officerStats(data,o.id),streak);return<div key={o.id} style={{background:C.surface,border:`1px solid ${isExpanded?C.primary:C.border}`,borderRadius:12,padding:20,position:"relative"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=isExpanded?C.primary:C.bHover;e.currentTarget.querySelector('.act').style.opacity=1;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=isExpanded?C.primary:C.border;e.currentTarget.querySelector('.act').style.opacity=0;}}>
        <div className="act" style={{position:"absolute",top:12,right:12,display:"flex",gap:4,opacity:0,transition:"opacity 0.15s"}}><button onClick={()=>setModal({type:"edit-officer",officer:o})} style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.border}`,background:"rgba(16,23,58,0.03)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>{I.edit}</button><button onClick={()=>setModal({type:"confirm-delete",officer:o})} style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.redDim}`,background:"rgba(224,82,82,0.04)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.red}}>{I.trash}</button></div>
        <div onClick={()=>setExpandedId(isExpanded?null:o.id)} style={{cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
            <div style={{width:44,height:44,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${C.primary}40,${C.accent}40)`,position:"relative",flexShrink:0}}>{o.avatar}<span style={{position:"absolute",bottom:-3,right:-3,fontSize:12,background:C.surfaceHi,borderRadius:"50%",width:19,height:19,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.border}`}}>{lvl.icon}</span></div>
            <div>
              <div style={{fontWeight:600,fontSize:14,color:C.white}}>{o.name}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:C.gold,fontFamily:"'Baloo 2',sans-serif",marginTop:1}}><span>{lvl.name}</span>{streak>0&&<span style={{color:C.red}}>🔥{streak}</span>}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <Ring pct={s.rate} size={42} sw={4}/>
            <div><div style={{fontSize:19,fontWeight:700,color:C.white,fontFamily:"'Baloo 2',sans-serif"}}>{s.rate}%</div><div style={{fontSize:10,color:C.muted}}>completion</div></div>
            <div style={{marginLeft:"auto",textAlign:"right"}}><div style={{fontSize:16,fontWeight:700,color:C.gold,fontFamily:"'Baloo 2',sans-serif"}}>{gPts}</div><div style={{fontSize:9,color:C.muted}}>points</div></div>
          </div>
          <div style={{display:"flex",gap:12,fontSize:11,color:C.muted,marginBottom:badges.length?8:0}}><span><strong style={{color:C.green}}>{s.completed}</strong> done</span><span><strong style={{color:C.white}}>{s.total-s.completed}</strong> left</span>{s.overdue>0&&<span><strong style={{color:C.red}}>{s.overdue}</strong> overdue</span>}</div>
          {badges.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{badges.map(b=><span key={b.id} title={b.name} style={{fontSize:13,background:C.surfaceHi,border:`1px solid ${C.border}`,borderRadius:5,width:22,height:22,display:"flex",alignItems:"center",justifyContent:"center"}}>{b.icon}</span>)}</div>}
        </div>
      </div>;})}
    </div>
    {expandedOfficer&&<div style={{marginTop:16,background:C.surface,border:`1px solid ${C.primary}`,borderRadius:12,padding:20}}>
      <OfficerDetail data={data} officer={expandedOfficer} oS={oS} toggle={toggle} addN={addN} togD={togD} setDN={setDN} setModal={setModal} onClose={()=>setExpandedId(null)}/>
    </div>}
  </div>;
}

function OfficerDetail({data,officer,oS,toggle,addN,togD,setDN,setModal,onClose}){
  const s=oS(officer.id);const tasks=data.tasks.filter(t=>t.assignedTo.includes(officer.id));const dailies=data.dailyTasks.filter(t=>t.assignedTo.includes(officer.id));
  const gPts=officerPoints(data,officer.id);const lvl=levelFor(gPts);const lp=levelProgress(gPts);const streak=officerStreak(data,officer.id);const badges=officerBadges(officerStats(data,officer.id),streak);
  const[ne,setNe]=useState(null);const[nt,setNt]=useState("");const[dne,setDne]=useState(null);const[dnt,setDnt]=useState("");
  return<div>
    <button onClick={onClose} style={{background:"none",border:"none",color:C.primary,cursor:"pointer",fontSize:13,marginBottom:12,padding:0,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>{I.close} Collapse</button>
    <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:16,flexWrap:"wrap"}}>
      <div style={{width:56,height:56,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#fff",background:`linear-gradient(135deg,${C.primary},${C.accent})`,flexShrink:0,position:"relative"}}>{officer.avatar}<span style={{position:"absolute",bottom:-3,right:-3,fontSize:15,background:C.surfaceHi,borderRadius:"50%",width:23,height:23,display:"flex",alignItems:"center",justifyContent:"center",border:`1px solid ${C.border}`}}>{lvl.icon}</span></div>
      <div style={{flex:1,minWidth:180}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h1 style={{fontSize:20,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>{officer.name}</h1><span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:5,background:C.goldDim,color:C.gold,fontFamily:"'Baloo 2',sans-serif",textTransform:"uppercase",letterSpacing:0.4}}>{lvl.name}</span>{streak>0&&<span style={{fontSize:11,color:C.red,fontWeight:600,display:"flex",alignItems:"center",gap:2}}>🔥{streak}-day streak</span>}<button onClick={()=>setModal({type:"edit-officer",officer})} style={{background:"rgba(16,23,58,0.03)",border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 9px",cursor:"pointer",display:"flex",alignItems:"center",gap:3,color:C.muted,fontSize:11,fontFamily:"inherit"}}>{I.edit} Edit</button></div>
        <div style={{display:"flex",gap:14,marginTop:3,fontSize:12,color:C.muted,flexWrap:"wrap"}}><span style={{display:"flex",alignItems:"center",gap:3}}>{I.mail} {officer.email}</span>{officer.phone&&<span style={{display:"flex",alignItems:"center",gap:3}}>{I.phone} {officer.phone}</span>}</div>
        {lp.next&&<div style={{marginTop:9,maxWidth:280}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.dim,marginBottom:3,fontFamily:"'Baloo 2',sans-serif"}}><span>{lp.cur.name}</span><span>{lp.next.name} at {lp.next.min}pts</span></div>
          <div style={{height:5,background:"rgba(16,23,58,0.06)",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${lp.pct}%`,background:`linear-gradient(90deg,${C.gold},${C.primary})`,borderRadius:3}}/></div>
        </div>}
      </div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><Stat label="Points" value={gPts} accent={C.gold}/><Stat label="Progress" value={`${s.rate}%`} accent={C.primary}/><Stat label="Done" value={s.completed} accent={C.green}/><Stat label="Overdue" value={s.overdue} accent={s.overdue>0?C.red:C.green}/></div>
    </div>
    {badges.length>0&&<div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:20}}>{badges.map(b=><span key={b.id} title={b.name} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,color:C.text,background:C.surfaceHi,border:`1px solid ${C.border}`,borderRadius:20,padding:"5px 10px"}}><span style={{fontSize:14}}>{b.icon}</span>{b.name}</span>)}</div>}
    {dailies.length>0&&<><h3 style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:8,fontFamily:"'Baloo 2',sans-serif",display:"flex",alignItems:"center",gap:6}}>{I.daily} Today's Dailies ({dailies.filter(t=>data.dailyCompletions[`${officer.id}-${t.id}-${TODAY}`]).length}/{dailies.length})</h3>
      {dailies.map(t=>{const k=`${officer.id}-${t.id}-${TODAY}`,comp=data.dailyCompletions[k],done=!!comp;return<div key={t.id} style={{background:C.surface,border:`1px solid ${done?"rgba(76,175,125,0.15)":C.border}`,borderRadius:8,padding:"9px 12px",marginBottom:5}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}><button onClick={()=>togD(officer.id,t.id,TODAY)} style={{width:22,height:22,borderRadius:5,border:`2px solid ${done?C.green:"rgba(16,23,58,0.12)"}`,background:done?C.greenDim:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.green,flexShrink:0}}>{done&&I.check}</button><span style={{fontSize:13,fontWeight:500,color:done?C.muted:C.white,flex:1}}>{t.title}</span><span style={{fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:3,background:`${cC(t.category)}20`,color:cC(t.category),fontFamily:"'Baloo 2',sans-serif"}}>{t.category}</span></div>
        {done&&<div style={{marginTop:5,paddingTop:5,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6,paddingLeft:31}}><span style={{fontSize:9,color:C.muted,fontFamily:"'Baloo 2',sans-serif"}}>NOTE:</span>{dne===t.id?<><input value={dnt} onChange={e=>setDnt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setDN(officer.id,t.id,TODAY,dnt);setDne(null);}}} style={{...sI,flex:1,padding:"2px 7px",fontSize:11}} autoFocus/><button onClick={()=>{setDN(officer.id,t.id,TODAY,dnt);setDne(null);}} style={{background:C.primary,border:"none",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontFamily:"inherit"}}>Save</button></>:<span onClick={()=>{setDne(t.id);setDnt(comp.notes||"");}} style={{fontSize:11,color:comp.notes?C.text:C.dim,cursor:"pointer",fontStyle:comp.notes?"normal":"italic"}}>{comp.notes||"Add note..."}</span>}</div>}
      </div>;})}
    <div style={{height:16}}/></>}
    <h3 style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:8,fontFamily:"'Baloo 2',sans-serif"}}>Coaching Tasks ({tasks.length})</h3>
    {tasks.length===0&&<p style={{color:C.muted,fontSize:13}}>No coaching tasks assigned.</p>}
    {tasks.map(t=>{const k=`${officer.id}-${t.id}`,done=!!data.completions[k],comp=data.completions[k],d=dU(t.dueDate),ov=!done&&d<0;return<div key={t.id} style={{background:C.surface,border:`1px solid ${done?"rgba(76,175,125,0.15)":ov?C.redDim:C.border}`,borderRadius:9,padding:"12px 16px",marginBottom:6}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>toggle(officer.id,t.id)} style={{width:24,height:24,borderRadius:5,border:`2px solid ${done?C.green:"rgba(16,23,58,0.12)"}`,background:done?C.greenDim:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.green,flexShrink:0}}>{done&&I.check}</button><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:done?C.muted:C.white,textDecoration:done?"line-through":"none"}}>{t.title}</div><div style={{fontSize:11,color:C.muted,marginTop:1}}>{t.description}</div></div><span style={{fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:4,background:`${pC(t.priority)}20`,color:pC(t.priority),textTransform:"uppercase",fontFamily:"'Baloo 2',sans-serif"}}>{t.priority}</span><span style={{fontSize:11,color:ov?C.red:C.muted,fontFamily:"'Baloo 2',sans-serif",whiteSpace:"nowrap"}}>{done?`Done ${fD(comp.completedAt)}`:ov?`${Math.abs(d)}d overdue`:`Due ${fD(t.dueDate)}`}</span></div>
      {done&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6,paddingLeft:34}}><span style={{fontSize:9,color:C.muted,fontFamily:"'Baloo 2',sans-serif"}}>NOTE:</span>{ne===t.id?<><input value={nt} onChange={e=>setNt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){addN(officer.id,t.id,nt);setNe(null);}}} style={{...sI,flex:1,padding:"3px 7px",fontSize:11}} autoFocus/><button onClick={()=>{addN(officer.id,t.id,nt);setNe(null);}} style={{background:C.primary,border:"none",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontFamily:"inherit"}}>Save</button></>:<span onClick={()=>{setNe(t.id);setNt(comp.notes||"");}} style={{fontSize:11,color:comp.notes?C.text:C.dim,cursor:"pointer",fontStyle:comp.notes?"normal":"italic"}}>{comp.notes||"Add note..."}</span>}</div>}
    </div>;})}
  </div>;
}

function TasksPage({data,filter,setFilter,setModal,toggle}){
  const cats=["all",...new Set(data.tasks.map(t=>t.category))];const fil=filter==="all"?data.tasks:data.tasks.filter(t=>t.category===filter);
  return<div>
    <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>{cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid",fontSize:11,cursor:"pointer",fontWeight:500,fontFamily:"inherit",background:filter===c?(c==="all"?C.primaryDim:`${cC(c)}15`):"transparent",borderColor:filter===c?(c==="all"?`rgba(45,183,166,0.3)`:`${cC(c)}40`):C.border,color:filter===c?(c==="all"?C.primary:cC(c)):C.muted}}>{c==="all"?"All":c}</button>)}</div>
    {fil.map(t=>{const dn=t.assignedTo.filter(id=>data.completions[`${id}-${t.id}`]).length,pct=t.assignedTo.length?Math.round(dn/t.assignedTo.length*100):0,d=dU(t.dueDate);return<div key={t.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:7}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><span style={{fontSize:14,fontWeight:600,color:C.white}}>{t.title}</span><span style={{fontSize:8,fontWeight:700,padding:"2px 5px",borderRadius:3,background:`${cC(t.category)}20`,color:cC(t.category),textTransform:"uppercase",fontFamily:"'Baloo 2',sans-serif"}}>{t.category}</span></div><p style={{margin:"2px 0 6px",fontSize:12,color:C.muted}}>{t.description}</p><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,maxWidth:160,height:4,background:"rgba(16,23,58,0.06)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pct===100?C.green:C.primary,borderRadius:2}}/></div><span style={{fontSize:11,fontFamily:"'Baloo 2',sans-serif",color:pct===100?C.green:C.muted}}>{dn}/{t.assignedTo.length}</span></div></div>
        <div style={{textAlign:"right"}}><div style={{display:"flex",alignItems:"center",gap:6,justifyContent:"flex-end"}}><span style={{fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:4,background:`${pC(t.priority)}20`,color:pC(t.priority),textTransform:"uppercase",fontFamily:"'Baloo 2',sans-serif"}}>{t.priority}</span><button onClick={()=>setModal({type:"edit-task",task:t})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",padding:2,opacity:0.6}}>{I.edit}</button><button onClick={()=>setModal({type:"confirm-delete-task",task:t})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",padding:2,opacity:0.6}}>{I.trash}</button></div><div style={{fontSize:11,color:d<0?C.red:C.muted,marginTop:4,fontFamily:"'Baloo 2',sans-serif"}}>{d<0?`${Math.abs(d)}d overdue`:d===0?"Today":`${d}d left`}</div></div></div>
      <div style={{marginTop:8,paddingTop:7,borderTop:`1px solid ${C.border}`,display:"flex",gap:4,flexWrap:"wrap"}}>{t.assignedTo.map(id=>{const o=data.officers.find(x=>x.id===id);if(!o)return null;const done=!!data.completions[`${id}-${t.id}`];return<button key={id} onClick={()=>toggle(id,t.id)} title={`${o.name}`} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:5,fontSize:10,cursor:"pointer",border:`1px solid ${done?"rgba(76,175,125,0.3)":"rgba(16,23,58,0.06)"}`,background:done?C.greenDim:"transparent",color:done?C.green:C.muted,fontFamily:"inherit"}}>{done&&<span style={{width:10,height:10}}>{I.check}</span>}{o.avatar}</button>;})}</div>
    </div>;})}
  </div>;
}

function ResourcesPage({data,filter,setFilter,setModal}){
  const cats=["all",...new Set(data.resources.map(r=>r.category))];const fil=filter==="all"?data.resources:data.resources.filter(r=>r.category===filter);const ti={pdf:I.pdf,video:I.video,doc:I.doc};
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><div><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>Resources</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Coaching materials and training content</p></div><button onClick={()=>setModal("add-resource")} style={{display:"flex",alignItems:"center",gap:5,background:C.primary,border:"none",color:"#fff",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.plus} Add Resource</button></div>
    <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>{cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid",fontSize:11,cursor:"pointer",fontWeight:500,fontFamily:"inherit",background:filter===c?(c==="all"?C.primaryDim:`${cC(c)}15`):"transparent",borderColor:filter===c?(c==="all"?`rgba(45,183,166,0.3)`:`${cC(c)}40`):C.border,color:filter===c?(c==="all"?C.primary:cC(c)):C.muted}}>{c==="all"?"All":c}</button>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>{fil.map(r=>{const lk=data.tasks.filter(t=>t.resourceId===r.id);return<div key={r.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16,transition:"border-color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.bHover} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:9}}><div style={{width:32,height:32,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",background:`${cC(r.category)}15`,color:cC(r.category)}}>{ti[r.type]||I.doc}</div><div><span style={{fontSize:9,fontWeight:700,color:cC(r.category),textTransform:"uppercase",fontFamily:"'Baloo 2',sans-serif"}}>{r.category}</span><div style={{fontSize:13,fontWeight:600,color:C.white}}>{r.title}</div></div></div><div style={{display:"flex",alignItems:"center",gap:2,flexShrink:0}}><button onClick={()=>setModal({type:"edit-resource",resource:r})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",padding:2,opacity:0.6}}>{I.edit}</button><button onClick={()=>setModal({type:"confirm-delete-resource",resource:r})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",padding:2,opacity:0.6}}>{I.trash}</button></div></div>
      <p style={{margin:"0 0 8px",fontSize:12,color:C.muted,lineHeight:1.6,whiteSpace:"pre-line"}}>{r.description}</p>
      {r.url&&<a href={r.url} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:5,background:"rgba(16,23,58,0.03)",border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",color:C.primary,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",marginBottom:8,textDecoration:"none",width:"fit-content"}}>{I.doc} Open File</a>}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:10,color:C.dim}}>{r.type.toUpperCase()} · {fD(r.createdAt)}</span>{lk.length>0&&<span style={{fontSize:9,color:C.primary,fontFamily:"'Baloo 2',sans-serif"}}>{lk.length} task{lk.length>1?"s":""}</span>}</div>
    </div>;})}</div>
  </div>;
}

function CalendarPage(){
  const src="https://calendar.google.com/calendar/embed?src=c_d49efcfe3601543bc131b1c6087e9307a593a8aac2451692f58215eeb2f7dddd%40group.calendar.google.com&ctz=America%2FNew_York&showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=MONTH";
  return<div>
    <div style={{marginBottom:20}}><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>Coaching Calls</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>All scheduled coaching calls. Add or edit events on the "Coaching Calls" Google Calendar and they'll show up here automatically.</p></div>
    <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
      <iframe src={src} style={{border:0,display:"block"}} width="100%" height="650" frameBorder="0" scrolling="no" title="Coaching Calls Calendar"/>
    </div>
  </div>;
}

// Strips a trailing " — Mon D, YYYY" style date suffix from a recap title
// (so we don't show the same date twice when we fall back to the title).
function stripRecapDateSuffix(title){
  return (title||"").replace(/\s+[—-]\s+[A-Z][a-z]{2}\s+\d{1,2},\s+\d{4}\s*$/,"").trim();
}

// Turns "**bold**" spans inside a line of recap text into real <strong> nodes.
function inlineBold(str,keyPrefix){
  return String(str).split(/\*\*(.*?)\*\*/g).map((p,i)=>i%2===1?<strong key={keyPrefix+"-"+i} style={{color:C.text}}>{p}</strong>:<span key={keyPrefix+"-"+i}>{p}</span>);
}

// Lightweight markdown parser for Roam-style recap summaries: turns "### Heading"
// lines into section labels and consecutive "- item" lines into real bullet lists.
function parseRecapBlocks(text){
  const lines=String(text||"").split("\n");
  const blocks=[];let curBullets=null;
  for(const raw of lines){
    const line=raw.trim();
    if(!line){curBullets=null;continue;}
    const h=line.match(/^#{2,4}\s+(.*)/);
    if(h){curBullets=null;blocks.push({type:"heading",content:h[1]});continue;}
    const b=line.match(/^[-*]\s+(.*)/);
    if(b){
      if(!curBullets){curBullets={type:"bullets",items:[]};blocks.push(curBullets);}
      curBullets.items.push(b[1]);
      continue;
    }
    curBullets=null;
    blocks.push({type:"para",content:line});
  }
  return blocks;
}

function RecapBlocks({text}){
  const blocks=parseRecapBlocks(text);
  return<>{blocks.map((b,i)=>{
    if(b.type==="heading")return<div key={i} style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.4,color:C.dim,margin:i?"12px 0 5px":"0 0 5px"}}>{b.content}</div>;
    if(b.type==="bullets")return<ul key={i} style={{margin:"0 0 4px",paddingLeft:16}}>{b.items.map((it,j)=><li key={j} style={{fontSize:12,color:C.muted,lineHeight:1.6,marginBottom:3}}>{inlineBold(it,i+"-"+j)}</li>)}</ul>;
    return<p key={i} style={{margin:"0 0 8px",fontSize:12,color:C.muted,lineHeight:1.6}}>{inlineBold(b.content,"p"+i)}</p>;
  })}</>;
}

function RecapCard({r,o,setModal}){
  const[open,setOpen]=useState(false);
  const title=stripRecapDateSuffix(r.title)||o?.name||"Coaching Call Recap";
  return<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
      <div style={{width:28,height:28,minWidth:28,borderRadius:"50%",background:C.primaryDim,color:C.primary,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700}}>{o?mkA(o.name):I.people}</div>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:13,fontWeight:600,color:C.text}}>{title}</div>
        <div style={{fontSize:10,color:C.dim}}>{r.date?fD(r.date):r.createdAt?fD(r.createdAt):""}</div>
      </div>
      {setModal&&<button onClick={()=>setModal({type:"confirm-delete-recap",recap:r})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",padding:2,opacity:0.6}}>{I.trash}</button>}
    </div>
    <div style={{maxHeight:open?"none":52,overflow:"hidden",position:"relative"}}>
      <RecapBlocks text={r.text}/>
      {!open&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:24,background:`linear-gradient(transparent,${C.surface})`}}/>}
    </div>
    <button onClick={()=>setOpen(v=>!v)} style={{background:"none",border:"none",padding:0,margin:"2px 0 10px",color:C.primary,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{open?"Show less ▲":"Show more ▾"}</button>
    {r.meetingUrl&&<a href={r.meetingUrl} target="_blank" rel="noopener noreferrer" style={{display:"flex",alignItems:"center",gap:5,background:"rgba(16,23,58,0.03)",border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",color:C.primary,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit",textDecoration:"none",width:"fit-content"}}>{I.video} View call</a>}
  </div>;
}

function RecapsPage({data,setModal}){
  const recaps=data.recaps||[];
  const[sort,setSort]=useState("newest");
  const rD=r=>r.date||r.createdAt||"";
  const sorted=[...recaps].sort((a,b)=>sort==="newest"?rD(b).localeCompare(rD(a)):rD(a).localeCompare(rD(b)));
  return<div>
    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:20,flexWrap:"wrap"}}>
      <div><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Baloo 2',sans-serif"}}>Coaching Call Recaps</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Auto-posted after each coaching call on the Roam/Coaching Calls calendar — or add one yourself below, video link included.</p></div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
          <button onClick={()=>setSort("newest")} style={{padding:"8px 12px",border:"none",background:sort==="newest"?C.primaryDim:C.surface,color:sort==="newest"?C.primary:C.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Newest first</button>
          <button onClick={()=>setSort("oldest")} style={{padding:"8px 12px",border:"none",borderLeft:`1px solid ${C.border}`,background:sort==="oldest"?C.primaryDim:C.surface,color:sort==="oldest"?C.primary:C.muted,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Oldest first</button>
        </div>
        <button onClick={()=>setModal("add-recap")} style={{display:"flex",alignItems:"center",gap:6,padding:"9px 14px",borderRadius:8,border:"none",background:C.primary,color:"#fff",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",whiteSpace:"nowrap"}}>{I.plus} Add Recap</button>
      </div>
    </div>
    {recaps.length===0?
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"32px 16px",textAlign:"center",color:C.muted,fontSize:13}}>No recaps yet. Once a coaching call on the Calendar tab finishes, its recap will appear here automatically — or add one manually with the button above.</div>
    :<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:12}}>
      {sorted.map(r=>{const o=data.officers.find(x=>x.id===r.officerId);return<RecapCard key={r.id} r={r} o={o} setModal={setModal}/>;})}
    </div>}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════════════════════
function OfficerFormModal({data,officer,onClose,onSave}){
  const isE=!!officer;const[f,setF]=useState({name:officer?.name||"",email:officer?.email||"",phone:officer?.phone||""});const s=(k,v)=>setF(p=>({...p,[k]:v}));const ok=f.name.trim().length>=2&&f.email.includes("@");
  return<Modal title={isE?"Edit Loan Officer":"Add Loan Officer"} onClose={onClose} width={420}>
    <div style={{marginBottom:12}}><label style={sL}>Full Name *</label><input value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Jane Smith" style={sI} autoFocus/></div>
    <div style={{marginBottom:12}}><label style={sL}>Email *</label><input value={f.email} onChange={e=>s("email",e.target.value)} placeholder="jane@milestonemortgage.com" style={sI}/></div>
    <div style={{marginBottom:18}}><label style={sL}>Phone</label><input value={f.phone} onChange={e=>s("phone",e.target.value)} placeholder="(508) 123-4567" style={sI}/></div>
    {f.name.trim()&&<div style={{background:C.primaryDim,border:`1px solid rgba(45,183,166,0.15)`,borderRadius:8,padding:12,marginBottom:16,display:"flex",alignItems:"center",gap:10}}><div style={{width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${C.primary}40,${C.accent}40)`}}>{mkA(f.name)}</div><div style={{fontSize:13,fontWeight:600,color:C.white}}>{f.name.trim()}</div><div style={{marginLeft:"auto",fontSize:9,color:C.dim,fontFamily:"'Baloo 2',sans-serif"}}>Preview</div></div>}
    <button onClick={()=>{if(ok){onSave({name:f.name.trim(),email:f.email.trim(),phone:f.phone.trim(),team:officer?.team||data.teams[0]});onClose();}}} style={bP(ok)}>{isE?"Save Changes":"Add Officer"}</button>
  </Modal>;
}

function AddTaskModal({data,task,onClose,onSave}){
  const isE=!!task;
  const[f,setF]=useState(task?{title:task.title,description:task.description,category:task.category,priority:task.priority,dueDate:task.dueDate,assignedTo:task.assignedTo,resourceId:task.resourceId||""}:{title:"",description:"",category:"Sales",priority:"medium",dueDate:shD(TODAY,14),assignedTo:[],resourceId:""});const s=(k,v)=>setF(p=>({...p,[k]:v}));const tgl=id=>s("assignedTo",f.assignedTo.includes(id)?f.assignedTo.filter(x=>x!==id):[...f.assignedTo,id]);const ok=f.title&&f.assignedTo.length;
  return<Modal title={isE?"Edit Coaching Task":"New Coaching Task"} onClose={onClose}><div style={{marginBottom:12}}><label style={sL}>Title *</label><input value={f.title} onChange={e=>s("title",e.target.value)} style={sI} autoFocus/></div><div style={{marginBottom:12}}><label style={sL}>Description</label><textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={2} style={{...sI,resize:"vertical"}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}><div><label style={sL}>Category</label><select value={f.category} onChange={e=>s("category",e.target.value)} style={sS}>{["Sales","Product Knowledge","Operations","Partnerships","Compliance"].map(c=><option key={c}>{c}</option>)}</select></div><div><label style={sL}>Priority</label><select value={f.priority} onChange={e=>s("priority",e.target.value)} style={sS}>{["high","medium","low"].map(p=><option key={p}>{p}</option>)}</select></div><div><label style={sL}>Due Date</label><input type="date" value={f.dueDate} onChange={e=>s("dueDate",e.target.value)} style={sS}/></div></div><div style={{marginBottom:12}}><label style={sL}>Linked Resource</label><select value={f.resourceId} onChange={e=>s("resourceId",e.target.value)} style={sS}><option value="">None</option>{data.resources.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></div><div style={{marginBottom:16}}><label style={sL}>Assign To *</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}><button onClick={()=>s("assignedTo",f.assignedTo.length===data.officers.length?[]:data.officers.map(o=>o.id))} style={{padding:"4px 9px",borderRadius:5,fontSize:11,cursor:"pointer",border:`1px solid ${C.border}`,background:"rgba(16,23,58,0.02)",color:C.muted,fontFamily:"inherit"}}>{f.assignedTo.length===data.officers.length?"None":"All"}</button>{data.officers.map(o=><button key={o.id} onClick={()=>tgl(o.id)} style={{padding:"4px 10px",borderRadius:5,fontSize:11,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${f.assignedTo.includes(o.id)?C.primary:C.border}`,background:f.assignedTo.includes(o.id)?C.primaryDim:"transparent",color:f.assignedTo.includes(o.id)?C.primary:C.muted}}>{o.name}</button>)}</div></div><button onClick={()=>{if(ok){onSave(f);onClose();}}} style={bP(ok)}>{isE?"Save Changes":"Create Task"}</button></Modal>;
}

function AddResourceModal({resource,onClose,onSave}){
  const isE=!!resource;
  const[f,setF]=useState(resource?{title:resource.title,description:resource.description,type:resource.type,category:resource.category,url:resource.url||""}:{title:"",description:"",type:"pdf",category:"Sales",url:""});const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return<Modal title={isE?"Edit Resource":"Add Resource"} onClose={onClose} width={420}><div style={{marginBottom:12}}><label style={sL}>Title *</label><input value={f.title} onChange={e=>s("title",e.target.value)} style={sI} autoFocus/></div><div style={{marginBottom:12}}><label style={sL}>Description</label><textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={2} style={{...sI,resize:"vertical"}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}><div><label style={sL}>Type</label><select value={f.type} onChange={e=>s("type",e.target.value)} style={sS}>{["pdf","video","doc"].map(t=><option key={t}>{t.toUpperCase()}</option>)}</select></div><div><label style={sL}>Category</label><select value={f.category} onChange={e=>s("category",e.target.value)} style={sS}>{["Sales","Product Knowledge","Operations","Partnerships","Compliance"].map(c=><option key={c}>{c}</option>)}</select></div></div><div style={{marginBottom:16}}><label style={sL}>File Link (optional)</label><input value={f.url} onChange={e=>s("url",e.target.value)} placeholder="Paste a Google Drive / Dropbox / web link" style={sI}/><p style={{margin:"6px 0 0",fontSize:11,color:C.dim}}>Upload the file to Google Drive (or wherever you keep files), then paste its shareable link here.</p></div><button onClick={()=>{if(f.title){onSave(f);onClose();}}} style={bP(!!f.title)}>{isE?"Save Changes":"Add Resource"}</button></Modal>;
}

function AddDailyModal({data,task,onClose,onSave}){
  const isE=!!task;
  const[f,setF]=useState(task?{title:task.title,description:task.description,category:task.category,assignedTo:task.assignedTo,recurring:task.recurring}:{title:"",description:"",category:"Sales",assignedTo:[],recurring:true});const s=(k,v)=>setF(p=>({...p,[k]:v}));const tgl=id=>s("assignedTo",f.assignedTo.includes(id)?f.assignedTo.filter(x=>x!==id):[...f.assignedTo,id]);const ok=f.title&&f.assignedTo.length;
  return<Modal title={isE?"Edit Daily Task":"New Daily Task"} onClose={onClose}><div style={{marginBottom:12}}><label style={sL}>Title *</label><input value={f.title} onChange={e=>s("title",e.target.value)} placeholder="e.g. Make 10+ Outbound Calls" style={sI} autoFocus/></div><div style={{marginBottom:12}}><label style={sL}>Description</label><textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={2} style={{...sI,resize:"vertical"}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}><div><label style={sL}>Category</label><select value={f.category} onChange={e=>s("category",e.target.value)} style={sS}>{["Sales","Product Knowledge","Operations","Partnerships","Compliance"].map(c=><option key={c}>{c}</option>)}</select></div><div><label style={sL}>Type</label><div style={{display:"flex",gap:6,marginTop:4}}><button onClick={()=>s("recurring",true)} style={{flex:1,padding:7,borderRadius:6,border:`1px solid ${f.recurring?C.primary:C.border}`,background:f.recurring?C.primaryDim:"transparent",color:f.recurring?C.primary:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>{I.repeat} Recurring</button><button onClick={()=>s("recurring",false)} style={{flex:1,padding:7,borderRadius:6,border:`1px solid ${!f.recurring?C.gold:C.border}`,background:!f.recurring?C.goldDim:"transparent",color:!f.recurring?C.gold:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>One-off</button></div></div></div><div style={{marginBottom:16}}><label style={sL}>Assign To *</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}><button onClick={()=>s("assignedTo",f.assignedTo.length===data.officers.length?[]:data.officers.map(o=>o.id))} style={{padding:"4px 9px",borderRadius:5,fontSize:11,cursor:"pointer",border:`1px solid ${C.border}`,background:"rgba(16,23,58,0.02)",color:C.muted,fontFamily:"inherit"}}>{f.assignedTo.length===data.officers.length?"None":"All"}</button>{data.officers.map(o=><button key={o.id} onClick={()=>tgl(o.id)} style={{padding:"4px 10px",borderRadius:5,fontSize:11,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${f.assignedTo.includes(o.id)?C.primary:C.border}`,background:f.assignedTo.includes(o.id)?C.primaryDim:"transparent",color:f.assignedTo.includes(o.id)?C.primary:C.muted}}>{o.name}</button>)}</div></div><button onClick={()=>{if(ok){onSave(f);onClose();}}} style={bP(ok)}>{isE?"Save Changes":"Create Daily Task"}</button></Modal>;
}

function AddRecapModal({data,onClose,onSave}){
  const[f,setF]=useState({title:"",officerId:"",date:TODAY,text:"",meetingUrl:""});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const ok=f.text.trim().length>0;
  return<Modal title="Add Call Recap" onClose={onClose}>
    <div style={{marginBottom:12}}><label style={sL}>Title</label><input value={f.title} onChange={e=>s("title",e.target.value)} placeholder="e.g. 1:1 Check-in — Logan Bruneau" style={sI} autoFocus/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
      <div><label style={sL}>Loan Officer</label><select value={f.officerId} onChange={e=>s("officerId",e.target.value)} style={sS}><option value="">General / Team</option>{data.officers.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}</select></div>
      <div><label style={sL}>Call Date</label><input type="date" value={f.date} onChange={e=>s("date",e.target.value)} style={sS}/></div>
    </div>
    <div style={{marginBottom:12}}><label style={sL}>Recap Notes *</label><textarea value={f.text} onChange={e=>s("text",e.target.value)} rows={6} placeholder={"### Key Topics\n- What we covered\n\n### Action Items\n- Next steps"} style={{...sI,resize:"vertical"}}/></div>
    <div style={{marginBottom:16}}><label style={sL}>Video Link</label><input value={f.meetingUrl} onChange={e=>s("meetingUrl",e.target.value)} placeholder="Paste the Roam / Zoom / Google Meet recording link" style={sI}/><p style={{margin:"6px 0 0",fontSize:11,color:C.dim}}>Shows as a "View call" button on the recap card.</p></div>
    <button onClick={()=>{if(ok){onSave({title:f.title.trim()||`Coaching Call Recap — ${fD(f.date)}`,officerId:f.officerId,date:f.date,text:f.text.trim(),meetingUrl:f.meetingUrl.trim()});onClose();}}} style={bP(ok)}>Add Recap</button>
  </Modal>;
}

function GoalsModal({goals,onClose,onSave}){
  const[f,setF]=useState({calls:goals.calls,meetings:goals.meetings,applications:goals.applications,preapprovals:goals.preapprovals,closed:goals.closed,creditPulls:goals.creditPulls,faceToFace:goals.faceToFace,followUpCalls:goals.followUpCalls,openHouses:goals.openHouses});
  const s=(k,v)=>setF(p=>({...p,[k]:Math.max(0,Number(v)||0)}));
  return<Modal title="Edit Daily Goals" onClose={onClose} width={420}>
    <p style={{margin:"0 0 16px",fontSize:12,color:C.muted,lineHeight:1.5}}>Same daily target for every loan officer. Week/Month goals shown in Activity are this number × 5 workdays (week) or × 20 workdays (month).</p>
    {FUNNEL_FIELDS.map(ff=><div key={ff.key} style={{marginBottom:12}}><label style={sL}>{ff.label}</label><input type="number" min="0" value={f[ff.key]} onChange={e=>s(ff.key,e.target.value)} style={sI}/></div>)}
    <button onClick={()=>{onSave(f);onClose();}} style={bP(true)}>Save Goals</button>
  </Modal>;
}

