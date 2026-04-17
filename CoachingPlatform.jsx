import { useState, useEffect, useCallback } from "react";

const SK = "coaching-x-milestone-v6";
const TODAY = "2026-04-17";

// ─── Milestone Mortgage Solutions Brand ──────────────────────────────────────
const C = {
  bg: "#0C1B2A", surface: "#112236", surfaceHi: "#162C45", border: "rgba(255,255,255,0.07)",
  bHover: "rgba(45,183,166,0.35)", primary: "#2DB7A6", primaryDim: "rgba(45,183,166,0.12)",
  primaryText: "#2DB7A6", accent: "#1E88C7", accentDim: "rgba(30,136,199,0.12)",
  gold: "#D4A84B", goldDim: "rgba(212,168,75,0.12)", red: "#E05252", redDim: "rgba(224,82,82,0.12)",
  green: "#4CAF7D", greenDim: "rgba(76,175,125,0.12)", text: "#E2E8F0", muted: "#7B8FA3",
  dim: "#4A5F75", white: "#F1F5F9",
};

const DD = {
  officers: [
    { id:"lo1",name:"Sarah Chen",avatar:"SC",email:"sarah.chen@milestonemortgage.com",team:"Purchase",joinedDate:"2025-11-01",phone:"(508) 201-4410" },
    { id:"lo2",name:"Marcus Rivera",avatar:"MR",email:"marcus.r@milestonemortgage.com",team:"Refinance",joinedDate:"2025-10-15",phone:"(508) 302-8821" },
    { id:"lo3",name:"Jenna Patel",avatar:"JP",email:"jenna.p@milestonemortgage.com",team:"Purchase",joinedDate:"2026-01-10",phone:"(508) 410-3367" },
    { id:"lo4",name:"David Kim",avatar:"DK",email:"david.k@milestonemortgage.com",team:"Refinance",joinedDate:"2025-09-20",phone:"(508) 518-9943" },
    { id:"lo5",name:"Aisha Okafor",avatar:"AO",email:"aisha.o@milestonemortgage.com",team:"FHA/VA",joinedDate:"2026-02-01",phone:"(508) 607-2258" },
  ],
  resources: [
    { id:"r1",title:"Consultative Selling Framework",type:"pdf",category:"Sales",description:"Master needs-based selling for mortgage professionals.",createdAt:"2026-03-01" },
    { id:"r2",title:"Rate Lock Strategies Webinar",type:"video",category:"Product Knowledge",description:"When and how to advise clients on locking rates in volatile markets.",createdAt:"2026-03-10" },
    { id:"r3",title:"Pipeline Management Playbook",type:"doc",category:"Operations",description:"Best practices for managing 30+ loans simultaneously.",createdAt:"2026-02-20" },
    { id:"r4",title:"Realtor Partnership Blueprint",type:"pdf",category:"Partnerships",description:"Build referral relationships that compound over time.",createdAt:"2026-03-15" },
    { id:"r5",title:"Compliance Quick-Reference",type:"doc",category:"Compliance",description:"TRID timelines, RESPA guidelines, and disclosure checklists.",createdAt:"2026-01-28" },
    { id:"r6",title:"Objection Handling Masterclass",type:"video",category:"Sales",description:"Scripts for the 12 most common borrower objections.",createdAt:"2026-04-01" },
  ],
  tasks: [
    { id:"t1",title:"Complete Consultative Selling Module",description:"Read the framework doc and submit 3 key takeaways.",resourceId:"r1",assignedTo:["lo1","lo2","lo3","lo4","lo5"],dueDate:"2026-04-25",priority:"high",category:"Sales" },
    { id:"t2",title:"Watch Rate Lock Webinar",description:"Watch the full webinar and complete the quiz.",resourceId:"r2",assignedTo:["lo1","lo3","lo5"],dueDate:"2026-04-30",priority:"medium",category:"Product Knowledge" },
    { id:"t3",title:"Pipeline Audit Exercise",description:"Audit your current pipeline using the playbook template.",resourceId:"r3",assignedTo:["lo2","lo4"],dueDate:"2026-05-05",priority:"high",category:"Operations" },
    { id:"t4",title:"Realtor Outreach Plan",description:"Draft a 30-day outreach plan targeting 5 new realtor partners.",resourceId:"r4",assignedTo:["lo1","lo2","lo3"],dueDate:"2026-05-10",priority:"medium",category:"Partnerships" },
    { id:"t5",title:"Compliance Certification Review",description:"Review the quick-reference guide and pass the internal assessment.",resourceId:"r5",assignedTo:["lo1","lo2","lo3","lo4","lo5"],dueDate:"2026-04-20",priority:"high",category:"Compliance" },
    { id:"t6",title:"Objection Role-Play Session",description:"Complete a role-play session with your coach.",resourceId:"r6",assignedTo:["lo3","lo4","lo5"],dueDate:"2026-05-15",priority:"low",category:"Sales" },
  ],
  completions: {
    "lo1-t5":{completedAt:"2026-04-15",notes:"Passed with 94%"},"lo2-t5":{completedAt:"2026-04-16",notes:"Passed with 88%"},
    "lo1-t1":{completedAt:"2026-04-14",notes:"Great insights on discovery questions"},"lo3-t2":{completedAt:"2026-04-13",notes:""},
    "lo4-t3":{completedAt:"2026-04-12",notes:"Identified 4 stale leads"},
  },
  teams:["Purchase","Refinance","FHA/VA","Jumbo","USDA"],
  dailyTasks: [
    { id:"d1",title:"Make 10+ Outbound Calls",description:"Reach out to prospects and referral partners.",assignedTo:["lo1","lo2","lo3","lo4","lo5"],recurring:true,category:"Sales",createdAt:"2026-04-01" },
    { id:"d2",title:"Update CRM Pipeline",description:"Log all new leads, status changes, and notes.",assignedTo:["lo1","lo2","lo3","lo4","lo5"],recurring:true,category:"Operations",createdAt:"2026-04-01" },
    { id:"d3",title:"Send 3 Follow-Up Emails",description:"Follow up with prospects from this week.",assignedTo:["lo1","lo3","lo5"],recurring:true,category:"Sales",createdAt:"2026-04-10" },
    { id:"d4",title:"Review Today's Rate Sheet",description:"Check rate sheet and note significant changes.",assignedTo:["lo1","lo2","lo3","lo4","lo5"],recurring:true,category:"Product Knowledge",createdAt:"2026-04-01" },
  ],
  dailyCompletions: {
    "lo1-d1-2026-04-17":{done:true,notes:"Made 14 calls, 3 callbacks scheduled"},"lo1-d2-2026-04-17":{done:true,notes:""},
    "lo2-d1-2026-04-17":{done:true,notes:"12 calls, 2 warm leads"},"lo3-d4-2026-04-17":{done:true,notes:"Rates dropped 0.125"},
    "lo1-d1-2026-04-16":{done:true,notes:"11 calls"},"lo2-d1-2026-04-16":{done:true,notes:"10 calls"},
  },
  messages: [
    { id:"m1",type:"announcement",from:"Coach",to:[],title:"Welcome to Q2 Coaching!",body:"This quarter we're focusing on consultative selling and pipeline management. Check your assigned tasks and let's crush it!",date:"2026-04-01",read:["lo1","lo2"] },
    { id:"m2",type:"announcement",from:"Coach",to:[],title:"Rate Sheet Alert — Rates Dropped!",body:"Rates dropped 0.125 across the board today. Great time to reach out to fence-sitters and refi candidates.",date:"2026-04-17",read:["lo1","lo3"] },
    { id:"m3",type:"dm",from:"Coach",to:["lo1"],title:"",body:"Great work on the Consultative Selling module, Sarah! Your takeaways were spot-on. Let's discuss your pipeline in our 1:1 this week.",date:"2026-04-15",read:["lo1"] },
    { id:"m4",type:"dm",from:"Coach",to:["lo4"],title:"",body:"David, your pipeline audit uncovered some great opportunities. I'd love to review your follow-up plan before Friday.",date:"2026-04-13",read:[] },
  ],
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
  send:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  megaphone:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l18-5v12L3 13v-2z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>,
  pdf:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  video:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  doc:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

const dU=(d)=>Math.ceil((new Date(d)-new Date(TODAY))/864e5);
const fD=(d)=>new Date(d).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
const fS=(d)=>new Date(d+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"});
const pC=(p)=>({high:C.red,medium:C.gold,low:C.primary}[p]||C.muted);
const cC=(c)=>({Sales:C.primary,"Product Knowledge":C.gold,Operations:C.accent,Partnerships:"#E07C5A",Compliance:"#7C6BC4"}[c]||C.muted);
const mkA=(n)=>n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);
const shD=(d,n)=>{const x=new Date(d+"T12:00:00");x.setDate(x.getDate()+n);return x.toISOString().split("T")[0];};

const sI={width:"100%",background:"rgba(255,255,255,0.04)",border:`1px solid ${C.border}`,borderRadius:6,padding:"9px 11px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
const sS={...sI,padding:"9px 8px",fontSize:12};
const sL={display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:0.8,fontFamily:"'Space Grotesk',sans-serif"};
const bP=(ok)=>({width:"100%",padding:"11px",borderRadius:8,border:"none",fontSize:14,fontWeight:600,cursor:ok?"pointer":"default",background:ok?C.primary:"rgba(255,255,255,0.05)",color:ok?"#fff":C.muted,fontFamily:"inherit"});

function Ring({pct,size=56,sw=5,color=C.primary}){const r=(size-sw)/2,c=2*Math.PI*r;return<svg width={size} height={size} style={{transform:"rotate(-90deg)"}}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw}/><circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeDasharray={c} strokeDashoffset={c-(pct/100)*c} strokeLinecap="round" style={{transition:"stroke-dashoffset 0.6s"}}/></svg>;}
function Stat({label,value,sub,accent}){return<div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",flex:1,minWidth:130}}><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,fontFamily:"'Space Grotesk',sans-serif",marginBottom:5}}>{label}</div><div style={{fontSize:26,fontWeight:700,color:accent||C.white,lineHeight:1}}>{value}</div>{sub&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>{sub}</div>}</div>;}
function Modal({title,onClose,children,width=480}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}} onClick={onClose}><div onClick={e=>e.stopPropagation()} style={{background:C.surfaceHi,border:`1px solid ${C.border}`,borderRadius:14,padding:28,width,maxHeight:"85vh",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h2 style={{margin:0,fontSize:18,fontWeight:700,color:C.white}}>{title}</h2><button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:4}}>{I.close}</button></div>{children}</div></div>;}
function Confirm({msg,sub,onOk,onNo}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onNo}><div onClick={e=>e.stopPropagation()} style={{background:C.surfaceHi,border:`1px solid ${C.redDim}`,borderRadius:14,padding:28,width:380,textAlign:"center"}}><div style={{width:48,height:48,borderRadius:"50%",background:C.redDim,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:C.red}}>{I.trash}</div><p style={{color:C.white,fontSize:15,fontWeight:500,margin:"0 0 6px"}}>{msg}</p><p style={{color:C.muted,fontSize:13,margin:"0 0 24px"}}>{sub}</p><div style={{display:"flex",gap:10}}><button onClick={onNo} style={{flex:1,padding:10,borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button><button onClick={onOk} style={{flex:1,padding:10,borderRadius:8,border:"none",background:C.red,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Delete</button></div></div></div>;}

// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const[data,setData]=useState(null);
  const[page,setPage]=useState("dashboard");
  const[selO,setSelO]=useState(null);
  const[modal,setModal]=useState(null);
  const[tF,setTF]=useState("all");
  const[rF,setRF]=useState("all");
  const[loaded,setLoaded]=useState(false);
  const[search,setSearch]=useState("");
  const[dDate,setDDate]=useState(TODAY);
  const[msgTab,setMsgTab]=useState("all");

  useEffect(()=>{(async()=>{try{const r=await window.storage.get(SK);if(r?.value)setData(JSON.parse(r.value));else setData(DD);}catch{setData(DD);}setLoaded(true);})();},[]);
  useEffect(()=>{if(data&&loaded){(async()=>{try{await window.storage.set(SK,JSON.stringify(data));}catch{}})();}},[data,loaded]);

  const toggleC=useCallback((oid,tid)=>{setData(p=>{const k=`${oid}-${tid}`,c={...p.completions};if(c[k])delete c[k];else c[k]={completedAt:TODAY,notes:""};return{...p,completions:c};});},[]);
  const addN=useCallback((oid,tid,n)=>{setData(p=>{const k=`${oid}-${tid}`;if(!p.completions[k])return p;return{...p,completions:{...p.completions,[k]:{...p.completions[k],notes:n}}};});},[]);
  const addTask=useCallback(t=>setData(p=>({...p,tasks:[...p.tasks,{...t,id:`t${Date.now()}`}]})),[]);
  const addRes=useCallback(r=>setData(p=>({...p,resources:[...p.resources,{...r,id:`r${Date.now()}`,createdAt:TODAY}]})),[]);
  const addO=useCallback(o=>setData(p=>({...p,officers:[...p.officers,{...o,id:`lo${Date.now()}`,avatar:mkA(o.name),joinedDate:TODAY}],teams:p.teams.includes(o.team)?p.teams:[...p.teams,o.team]})),[]);
  const updO=useCallback((id,u)=>setData(p=>({...p,officers:p.officers.map(o=>o.id===id?{...o,...u,avatar:mkA(u.name||o.name)}:o),teams:p.teams.includes(u.team)?p.teams:[...p.teams,u.team]})),[]);
  const delO=useCallback(id=>{setData(p=>{const c={...p.completions},dc={...p.dailyCompletions};Object.keys(c).forEach(k=>{if(k.startsWith(`${id}-`))delete c[k];});Object.keys(dc).forEach(k=>{if(k.startsWith(`${id}-`))delete dc[k];});return{...p,officers:p.officers.filter(o=>o.id!==id),tasks:p.tasks.map(t=>({...t,assignedTo:t.assignedTo.filter(a=>a!==id)})),dailyTasks:p.dailyTasks.map(t=>({...t,assignedTo:t.assignedTo.filter(a=>a!==id)})),completions:c,dailyCompletions:dc};});},[]);
  const addDT=useCallback(t=>setData(p=>({...p,dailyTasks:[...p.dailyTasks,{...t,id:`d${Date.now()}`,createdAt:TODAY}]})),[]);
  const togD=useCallback((oid,did,dt)=>{setData(p=>{const k=`${oid}-${did}-${dt}`,dc={...p.dailyCompletions};if(dc[k])delete dc[k];else dc[k]={done:true,notes:""};return{...p,dailyCompletions:dc};});},[]);
  const setDN=useCallback((oid,did,dt,n)=>{setData(p=>{const k=`${oid}-${did}-${dt}`;if(!p.dailyCompletions[k])return p;return{...p,dailyCompletions:{...p.dailyCompletions,[k]:{...p.dailyCompletions[k],notes:n}}};});},[]);
  const delDT=useCallback(did=>{setData(p=>{const dc={...p.dailyCompletions};Object.keys(dc).forEach(k=>{if(k.includes(`-${did}-`))delete dc[k];});return{...p,dailyTasks:p.dailyTasks.filter(t=>t.id!==did),dailyCompletions:dc};});},[]);
  const addMsg=useCallback(m=>setData(p=>({...p,messages:[{...m,id:`m${Date.now()}`,date:TODAY,read:[]},...p.messages]})),[]);

  if(!loaded||!data)return<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,color:C.text,fontFamily:"'DM Sans',sans-serif"}}><p style={{opacity:0.6}}>Loading...</p></div>;

  const oS=oid=>{const a=data.tasks.filter(t=>t.assignedTo.includes(oid)),c=a.filter(t=>data.completions[`${oid}-${t.id}`]),ov=a.filter(t=>!data.completions[`${oid}-${t.id}`]&&dU(t.dueDate)<0);return{total:a.length,completed:c.length,overdue:ov.length,rate:a.length?Math.round((c.length/a.length)*100):0};};
  const gS={totalTasks:data.tasks.reduce((s,t)=>s+t.assignedTo.length,0),totalCompleted:Object.keys(data.completions).length,avgRate:data.officers.length?Math.round(data.officers.reduce((s,o)=>s+oS(o.id).rate,0)/data.officers.length):0,overdue:data.officers.reduce((s,o)=>s+oS(o.id).overdue,0)};
  const dSt=dt=>{let tot=0,dn=0;data.dailyTasks.forEach(t=>t.assignedTo.forEach(oid=>{if(data.officers.find(o=>o.id===oid)){tot++;if(data.dailyCompletions[`${oid}-${t.id}-${dt}`])dn++;}}));return{tot,dn,pct:tot?Math.round((dn/tot)*100):0};};
  const nav=(pg,o=null)=>{setPage(pg);setSelO(o);setSearch("");};
  const unreadCount=data.messages.filter(m=>m.type==="announcement"&&!m.read.includes("coach")).length;

  return(
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",display:"flex"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/>

      {/* ── Sidebar ── */}
      <nav style={{width:240,minWidth:240,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"20px 0"}}>
        {/* Logo */}
        <div style={{padding:"0 20px 24px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
            <div style={{width:36,height:36,borderRadius:8,background:`linear-gradient(135deg, ${C.primary}, ${C.accent})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff",letterSpacing:-0.5}}>M</div>
            <div>
              <div style={{fontSize:11,fontWeight:600,color:C.primary,letterSpacing:1.5,textTransform:"uppercase",fontFamily:"'Space Grotesk',sans-serif",lineHeight:1}}>Coaching</div>
              <div style={{fontSize:10,color:C.muted,fontFamily:"'Space Grotesk',sans-serif",letterSpacing:0.5}}>× Milestone</div>
            </div>
          </div>
          <div style={{fontSize:9,color:C.dim,fontFamily:"'Space Grotesk',sans-serif",letterSpacing:0.3}}>Milestone Mortgage Solutions</div>
        </div>

        <div style={{padding:"10px 0",flex:1}}>
          {[
            {key:"dashboard",icon:I.dashboard,label:"Dashboard"},
            {key:"officers",icon:I.people,label:"Loan Officers"},
            {key:"daily",icon:I.daily,label:"Daily Tasks"},
            {key:"tasks",icon:I.tasks,label:"Coaching Tasks"},
            {key:"resources",icon:I.resources,label:"Resources"},
            {key:"messages",icon:I.msg,label:"Messages",badge:unreadCount},
          ].map(item=>(
            <button key={item.key} onClick={()=>nav(item.key)} style={{
              display:"flex",alignItems:"center",gap:10,padding:"10px 20px",margin:"1px 8px",width:"calc(100% - 16px)",
              borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:(page===item.key||(page==="officer-detail"&&item.key==="officers"))?600:400,
              background:(page===item.key||(page==="officer-detail"&&item.key==="officers"))?C.primaryDim:"transparent",
              color:(page===item.key||(page==="officer-detail"&&item.key==="officers"))?C.primary:C.muted,
              transition:"all 0.15s",fontFamily:"inherit",textAlign:"left",position:"relative",
            }}>
              {item.icon}{item.label}
              {item.badge>0&&<span style={{marginLeft:"auto",background:C.red,color:"#fff",fontSize:9,fontWeight:700,borderRadius:10,padding:"1px 6px",minWidth:16,textAlign:"center"}}>{item.badge}</span>}
            </button>
          ))}
        </div>

        <div style={{padding:"14px 20px",borderTop:`1px solid ${C.border}`,fontSize:10,color:C.dim,fontFamily:"'Space Grotesk',sans-serif",lineHeight:1.8}}>
          {data.officers.length} officers · {data.tasks.length} tasks<br/>NMLS #1815656
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{flex:1,padding:"24px 32px",overflowY:"auto",maxHeight:"100vh"}}>
        {page==="dashboard"&&<Dashboard data={data} g={gS} oS={oS} nav={nav} dSt={dSt(TODAY)}/>}
        {page==="officers"&&<Officers data={data} oS={oS} nav={nav} setModal={setModal} search={search} setSearch={setSearch}/>}
        {page==="officer-detail"&&selO&&<OfficerDetail data={data} officer={selO} oS={oS} toggle={toggleC} addN={addN} togD={togD} setDN={setDN} nav={nav} setModal={setModal}/>}
        {page==="daily"&&<DailyPage data={data} date={dDate} setDate={setDDate} togD={togD} setDN={setDN} setModal={setModal} delDT={delDT}/>}
        {page==="tasks"&&<TasksPage data={data} filter={tF} setFilter={setTF} setModal={setModal} toggle={toggleC}/>}
        {page==="resources"&&<ResourcesPage data={data} filter={rF} setFilter={setRF} setModal={setModal}/>}
        {page==="messages"&&<MessagesPage data={data} tab={msgTab} setTab={setMsgTab} setModal={setModal}/>}
      </main>

      {modal==="add-task"&&<AddTaskModal data={data} onClose={()=>setModal(null)} onAdd={addTask}/>}
      {modal==="add-resource"&&<AddResourceModal onClose={()=>setModal(null)} onAdd={addRes}/>}
      {modal==="add-officer"&&<OfficerFormModal data={data} onClose={()=>setModal(null)} onSave={addO}/>}
      {modal==="add-daily"&&<AddDailyModal data={data} onClose={()=>setModal(null)} onAdd={addDT}/>}
      {modal==="send-dm"&&<SendDMModal data={data} onClose={()=>setModal(null)} onSend={addMsg}/>}
      {modal==="send-announcement"&&<SendAnnouncementModal onClose={()=>setModal(null)} onSend={addMsg}/>}
      {modal?.type==="edit-officer"&&<OfficerFormModal data={data} officer={modal.officer} onClose={()=>setModal(null)} onSave={u=>{updO(modal.officer.id,u);if(selO?.id===modal.officer.id)setSelO({...modal.officer,...u,avatar:mkA(u.name)});}}/>}
      {modal?.type==="confirm-delete"&&<Confirm msg={`Remove ${modal.officer.name}?`} sub="Removes from all tasks and assignments." onNo={()=>setModal(null)} onOk={()=>{delO(modal.officer.id);setModal(null);if(selO?.id===modal.officer.id)nav("officers");}}/>}
      {modal?.type==="confirm-delete-daily"&&<Confirm msg={`Delete "${modal.task.title}"?`} sub="All history will be lost." onNo={()=>setModal(null)} onOk={()=>{delDT(modal.task.id);setModal(null);}}/>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard({data,g,oS,nav,dSt}){
  const sorted=[...data.officers].sort((a,b)=>oS(b.id).rate-oS(a.id).rate);
  const upcoming=data.tasks.filter(t=>dU(t.dueDate)>=0&&dU(t.dueDate)<=14).sort((a,b)=>dU(a.dueDate)-dU(b.dueDate));
  return<div>
    <div style={{marginBottom:24}}><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>Coaching Dashboard</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Milestone Mortgage Solutions — Team Progress</p></div>
    <div style={{display:"flex",gap:12,marginBottom:24,flexWrap:"wrap"}}>
      <Stat label="Assignments" value={g.totalTasks} sub="coaching tasks"/><Stat label="Completed" value={g.totalCompleted} accent={C.green} sub={`${g.totalTasks?Math.round((g.totalCompleted/g.totalTasks)*100):0}% done`}/><Stat label="Avg Progress" value={`${g.avgRate}%`} accent={C.primary} sub="per officer"/><Stat label="Today's Dailies" value={`${dSt.pct}%`} accent={dSt.pct===100?C.green:C.gold} sub={`${dSt.dn}/${dSt.tot} done`}/>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{color:C.gold}}>{I.trophy}</span><h3 style={{margin:0,fontSize:14,fontWeight:600,color:C.white,fontFamily:"'Space Grotesk',sans-serif"}}>Leaderboard</h3></div>
        {sorted.map((o,i)=>{const s=oS(o.id);return<div key={o.id} onClick={()=>nav("officer-detail",o)} style={{display:"flex",alignItems:"center",gap:11,padding:"8px 10px",marginBottom:2,borderRadius:7,cursor:"pointer",background:i===0?"rgba(212,168,75,0.05)":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"} onMouseLeave={e=>e.currentTarget.style.background=i===0?"rgba(212,168,75,0.05)":"transparent"}>
          <div style={{width:20,fontSize:12,fontWeight:700,color:i===0?C.gold:C.dim,fontFamily:"'Space Grotesk',sans-serif"}}>#{i+1}</div>
          <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${i===0?C.gold:C.primary}50,${i===0?"#E07C5A":C.accent}50)`}}>{o.avatar}</div>
          <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:C.white}}>{o.name}</div><div style={{fontSize:10,color:C.muted}}>{s.completed}/{s.total}</div></div>
          <Ring pct={s.rate} size={34} sw={3} color={i===0?C.gold:C.primary}/><span style={{fontSize:12,fontWeight:600,color:i===0?C.gold:C.primary,fontFamily:"'Space Grotesk',sans-serif",width:34,textAlign:"right"}}>{s.rate}%</span>
        </div>;})}
      </div>
      <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{color:C.primary}}>{I.daily}</span><h3 style={{margin:0,fontSize:14,fontWeight:600,color:C.white,fontFamily:"'Space Grotesk',sans-serif"}}>Upcoming Deadlines</h3></div>
        {upcoming.length===0&&<p style={{color:C.muted,fontSize:13}}>No deadlines in the next 2 weeks.</p>}
        {upcoming.map(t=>{const d=dU(t.dueDate),dn=t.assignedTo.filter(id=>data.completions[`${id}-${t.id}`]).length;return<div key={t.id} style={{padding:"9px 0",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:13,fontWeight:500,color:C.white}}>{t.title}</span><span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:d<=3?C.redDim:C.primaryDim,color:d<=3?C.red:C.primary,fontFamily:"'Space Grotesk',sans-serif"}}>{d===0?"Today":`${d}d`}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(dn/t.assignedTo.length)*100}%`,background:C.primary,borderRadius:2}}/></div><span style={{fontSize:10,color:C.muted,fontFamily:"'Space Grotesk',sans-serif"}}>{dn}/{t.assignedTo.length}</span></div>
        </div>;})}
      </div>
    </div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MESSAGES PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function MessagesPage({data,tab,setTab,setModal}){
  const filtered=tab==="all"?data.messages:data.messages.filter(m=>m.type===tab);
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
      <div><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>Messages</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Announcements and direct messages to your team</p></div>
      <div style={{display:"flex",gap:8}}>
        <button onClick={()=>setModal("send-announcement")} style={{display:"flex",alignItems:"center",gap:5,background:C.accentDim,border:`1px solid rgba(30,136,199,0.3)`,color:C.accent,padding:"9px 14px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.megaphone} Announcement</button>
        <button onClick={()=>setModal("send-dm")} style={{display:"flex",alignItems:"center",gap:5,background:C.primary,border:"none",color:"#fff",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.send} Direct Message</button>
      </div>
    </div>
    <div style={{display:"flex",gap:6,margin:"18px 0 20px"}}>
      {["all","announcement","dm"].map(t=><button key={t} onClick={()=>setTab(t)} style={{padding:"5px 14px",borderRadius:6,border:"1px solid",fontSize:11.5,cursor:"pointer",fontWeight:500,fontFamily:"inherit",background:tab===t?C.primaryDim:"transparent",borderColor:tab===t?`rgba(45,183,166,0.3)`:C.border,color:tab===t?C.primary:C.muted}}>{t==="all"?"All":t==="announcement"?"Announcements":"Direct Messages"}</button>)}
    </div>
    {filtered.length===0&&<p style={{color:C.muted,fontSize:14,marginTop:20}}>No messages yet.</p>}
    {filtered.map(m=>{
      const isAnn=m.type==="announcement";
      const recipients=isAnn?data.officers:m.to.map(id=>data.officers.find(o=>o.id===id)).filter(Boolean);
      return<div key={m.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 20px",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
          <div style={{width:32,height:32,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:isAnn?C.accentDim:C.primaryDim,color:isAnn?C.accent:C.primary,flexShrink:0}}>{isAnn?I.megaphone:I.send}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:isAnn?C.accentDim:C.primaryDim,color:isAnn?C.accent:C.primary,textTransform:"uppercase",fontFamily:"'Space Grotesk',sans-serif"}}>{isAnn?"Announcement":"DM"}</span>
              {m.title&&<span style={{fontSize:14,fontWeight:600,color:C.white}}>{m.title}</span>}
              {!isAnn&&recipients.length>0&&<span style={{fontSize:13,fontWeight:500,color:C.white}}>To: {recipients.map(o=>o.name).join(", ")}</span>}
            </div>
            <div style={{fontSize:11,color:C.dim,marginTop:2}}>{fD(m.date)} · From {m.from}</div>
          </div>
        </div>
        <p style={{margin:0,fontSize:13,color:C.text,lineHeight:1.6,paddingLeft:42}}>{m.body}</p>
      </div>;
    })}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DAILY TASKS
// ═══════════════════════════════════════════════════════════════════════════════
function DailyPage({data,date,setDate,togD,setDN,setModal,delDT}){
  const[eN,setEN]=useState(null);const[nT,setNT]=useState("");
  const dS=dt=>{let t=0,d=0;data.dailyTasks.forEach(tk=>tk.assignedTo.forEach(oid=>{if(data.officers.find(o=>o.id===oid)){t++;if(data.dailyCompletions[`${oid}-${tk.id}-${dt}`])d++;}}));return{t,d,p:t?Math.round(d/t*100):0};};
  const ds=dS(date);const isT=date===TODAY;
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><div><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>Daily Tasks</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Recurring and one-off daily assignments</p></div><button onClick={()=>setModal("add-daily")} style={{display:"flex",alignItems:"center",gap:5,background:C.primary,border:"none",color:"#fff",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.plus} New Daily Task</button></div>
    <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0",background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"9px 14px",width:"fit-content"}}>
      <button onClick={()=>setDate(shD(date,-1))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:2,display:"flex"}}>{I.chevL}</button>
      <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{color:C.primary}}>{I.cal}</span><span style={{fontSize:14,fontWeight:600,color:C.white,minWidth:150}}>{fS(date)}</span>{isT&&<span style={{fontSize:9,fontWeight:700,padding:"2px 7px",borderRadius:4,background:C.primaryDim,color:C.primary,fontFamily:"'Space Grotesk',sans-serif"}}>TODAY</span>}</div>
      <button onClick={()=>setDate(shD(date,1))} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:2,display:"flex"}}>{I.chevR}</button>
      {!isT&&<button onClick={()=>setDate(TODAY)} style={{marginLeft:6,background:C.primaryDim,border:`1px solid rgba(45,183,166,0.2)`,borderRadius:6,padding:"4px 10px",color:C.primary,fontSize:11,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>Today</button>}
    </div>
    <div style={{display:"flex",gap:12,marginBottom:20}}><Stat label="Check-ins" value={ds.t}/><Stat label="Completed" value={ds.d} accent={C.green}/><Stat label="Rate" value={`${ds.p}%`} accent={ds.p===100?C.green:ds.p>=50?C.gold:C.red}/></div>
    {data.dailyTasks.map(t=>{
      const aO=t.assignedTo.map(id=>data.officers.find(o=>o.id===id)).filter(Boolean);
      const dc=aO.filter(o=>data.dailyCompletions[`${o.id}-${t.id}-${date}`]).length;
      return<div key={t.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:8}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:14,fontWeight:600,color:C.white}}>{t.title}</span><span style={{fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:3,background:`${cC(t.category)}20`,color:cC(t.category),textTransform:"uppercase",fontFamily:"'Space Grotesk',sans-serif"}}>{t.category}</span>{t.recurring&&<span style={{display:"flex",alignItems:"center",gap:2,fontSize:9,color:C.primary,fontFamily:"'Space Grotesk',sans-serif"}}>{I.repeat} Recurring</span>}{!t.recurring&&<span style={{fontSize:9,color:C.gold,fontFamily:"'Space Grotesk',sans-serif"}}>One-off</span>}</div>
          <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:11,fontFamily:"'Space Grotesk',sans-serif",color:dc===aO.length?C.green:C.muted}}>{dc}/{aO.length}</span><button onClick={()=>setModal({type:"confirm-delete-daily",task:t})} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",padding:2,opacity:0.6}}>{I.trash}</button></div>
        </div>
        {t.description&&<p style={{margin:"0 0 8px",fontSize:12,color:C.muted}}>{t.description}</p>}
        {aO.map(o=>{const k=`${o.id}-${t.id}-${date}`,comp=data.dailyCompletions[k],done=!!comp,isE=eN===k;return<div key={o.id} style={{display:"flex",alignItems:"center",gap:9,padding:"5px 8px",borderRadius:5,background:done?"rgba(76,175,125,0.04)":"transparent",border:`1px solid ${done?"rgba(76,175,125,0.12)":"rgba(255,255,255,0.03)"}`,marginBottom:2}}>
          <button onClick={()=>togD(o.id,t.id,date)} style={{width:22,height:22,borderRadius:5,border:`2px solid ${done?C.green:"rgba(255,255,255,0.12)"}`,background:done?C.greenDim:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.green,flexShrink:0}}>{done&&I.check}</button>
          <div style={{width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${C.primary}30,${C.accent}30)`,flexShrink:0}}>{o.avatar}</div>
          <span style={{fontSize:12,color:done?C.muted:C.white,fontWeight:500,minWidth:90}}>{o.name}</span>
          <div style={{flex:1}}>{done&&!isE&&<span onClick={()=>{setEN(k);setNT(comp.notes||"");}} style={{fontSize:11,color:comp.notes?C.text:C.dim,cursor:"pointer",fontStyle:comp.notes?"normal":"italic"}}>{comp.notes||"Add note..."}</span>}{done&&isE&&<div style={{display:"flex",gap:5}}><input value={nT} onChange={e=>setNT(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setDN(o.id,t.id,date,nT);setEN(null);}}} style={{...sI,flex:1,padding:"3px 8px",fontSize:11}} autoFocus/><button onClick={()=>{setDN(o.id,t.id,date,nT);setEN(null);}} style={{background:C.primary,border:"none",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontFamily:"inherit"}}>Save</button></div>}</div>
        </div>;})}
      </div>;
    })}
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// OFFICERS + DETAIL + TASKS + RESOURCES (same patterns, Milestone branded)
// ═══════════════════════════════════════════════════════════════════════════════
function Officers({data,oS,nav,setModal,search,setSearch}){
  const f=data.officers.filter(o=>o.name.toLowerCase().includes(search.toLowerCase())||o.team.toLowerCase().includes(search.toLowerCase()));
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><div><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>Loan Officers</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Manage your Milestone team</p></div><button onClick={()=>setModal("add-officer")} style={{display:"flex",alignItems:"center",gap:5,background:C.primary,border:"none",color:"#fff",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.plus} Add Officer</button></div>
    <div style={{position:"relative",margin:"14px 0 18px"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.muted}}>{I.search}</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{...sI,paddingLeft:36,maxWidth:340}}/></div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:12}}>
      {f.map(o=>{const s=oS(o.id);return<div key={o.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:20,position:"relative"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.bHover;e.currentTarget.querySelector('.act').style.opacity=1;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.querySelector('.act').style.opacity=0;}}>
        <div className="act" style={{position:"absolute",top:12,right:12,display:"flex",gap:4,opacity:0,transition:"opacity 0.15s"}}><button onClick={()=>setModal({type:"edit-officer",officer:o})} style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.03)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted}}>{I.edit}</button><button onClick={()=>setModal({type:"confirm-delete",officer:o})} style={{width:28,height:28,borderRadius:6,border:`1px solid ${C.redDim}`,background:"rgba(224,82,82,0.04)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.red}}>{I.trash}</button></div>
        <div onClick={()=>nav("officer-detail",o)} style={{cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}><div style={{width:44,height:44,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${C.primary}40,${C.accent}40)`}}>{o.avatar}</div><div><div style={{fontWeight:600,fontSize:14,color:C.white}}>{o.name}</div><div style={{fontSize:11,color:C.muted}}>{o.team} Team</div></div></div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}><Ring pct={s.rate} size={42} sw={4}/><div><div style={{fontSize:19,fontWeight:700,color:C.white,fontFamily:"'Space Grotesk',sans-serif"}}>{s.rate}%</div><div style={{fontSize:10,color:C.muted}}>completion</div></div></div>
          <div style={{display:"flex",gap:12,fontSize:11,color:C.muted}}><span><strong style={{color:C.green}}>{s.completed}</strong> done</span><span><strong style={{color:C.white}}>{s.total-s.completed}</strong> left</span>{s.overdue>0&&<span><strong style={{color:C.red}}>{s.overdue}</strong> overdue</span>}</div>
        </div>
      </div>;})}
    </div>
  </div>;
}

function OfficerDetail({data,officer,oS,toggle,addN,togD,setDN,nav,setModal}){
  const s=oS(officer.id);const tasks=data.tasks.filter(t=>t.assignedTo.includes(officer.id));const dailies=data.dailyTasks.filter(t=>t.assignedTo.includes(officer.id));
  const[ne,setNe]=useState(null);const[nt,setNt]=useState("");const[dne,setDne]=useState(null);const[dnt,setDnt]=useState("");
  return<div>
    <button onClick={()=>nav("officers")} style={{background:"none",border:"none",color:C.primary,cursor:"pointer",fontSize:13,marginBottom:12,padding:0,display:"flex",alignItems:"center",gap:4,fontFamily:"inherit"}}>{I.back} All officers</button>
    <div style={{display:"flex",alignItems:"center",gap:18,marginBottom:24,flexWrap:"wrap"}}>
      <div style={{width:56,height:56,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#fff",background:`linear-gradient(135deg,${C.primary},${C.accent})`,flexShrink:0}}>{officer.avatar}</div>
      <div style={{flex:1,minWidth:180}}>
        <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><h1 style={{fontSize:20,fontWeight:700,color:C.white,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>{officer.name}</h1><button onClick={()=>setModal({type:"edit-officer",officer})} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,borderRadius:6,padding:"3px 9px",cursor:"pointer",display:"flex",alignItems:"center",gap:3,color:C.muted,fontSize:11,fontFamily:"inherit"}}>{I.edit} Edit</button></div>
        <div style={{display:"flex",gap:14,marginTop:3,fontSize:12,color:C.muted,flexWrap:"wrap"}}><span>{officer.team}</span><span style={{display:"flex",alignItems:"center",gap:3}}>{I.mail} {officer.email}</span>{officer.phone&&<span style={{display:"flex",alignItems:"center",gap:3}}>{I.phone} {officer.phone}</span>}</div>
      </div>
      <div style={{display:"flex",gap:10}}><Stat label="Progress" value={`${s.rate}%`} accent={C.primary}/><Stat label="Done" value={s.completed} accent={C.green}/><Stat label="Overdue" value={s.overdue} accent={s.overdue>0?C.red:C.green}/></div>
    </div>
    {dailies.length>0&&<><h3 style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:8,fontFamily:"'Space Grotesk',sans-serif",display:"flex",alignItems:"center",gap:6}}>{I.daily} Today's Dailies ({dailies.filter(t=>data.dailyCompletions[`${officer.id}-${t.id}-${TODAY}`]).length}/{dailies.length})</h3>
      {dailies.map(t=>{const k=`${officer.id}-${t.id}-${TODAY}`,comp=data.dailyCompletions[k],done=!!comp;return<div key={t.id} style={{background:C.surface,border:`1px solid ${done?"rgba(76,175,125,0.15)":C.border}`,borderRadius:8,padding:"9px 12px",marginBottom:5}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}><button onClick={()=>togD(officer.id,t.id,TODAY)} style={{width:22,height:22,borderRadius:5,border:`2px solid ${done?C.green:"rgba(255,255,255,0.12)"}`,background:done?C.greenDim:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.green,flexShrink:0}}>{done&&I.check}</button><span style={{fontSize:13,fontWeight:500,color:done?C.muted:C.white,flex:1}}>{t.title}</span><span style={{fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:3,background:`${cC(t.category)}20`,color:cC(t.category),fontFamily:"'Space Grotesk',sans-serif"}}>{t.category}</span></div>
        {done&&<div style={{marginTop:5,paddingTop:5,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6,paddingLeft:31}}><span style={{fontSize:9,color:C.muted,fontFamily:"'Space Grotesk',sans-serif"}}>NOTE:</span>{dne===t.id?<><input value={dnt} onChange={e=>setDnt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){setDN(officer.id,t.id,TODAY,dnt);setDne(null);}}} style={{...sI,flex:1,padding:"2px 7px",fontSize:11}} autoFocus/><button onClick={()=>{setDN(officer.id,t.id,TODAY,dnt);setDne(null);}} style={{background:C.primary,border:"none",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontFamily:"inherit"}}>Save</button></>:<span onClick={()=>{setDne(t.id);setDnt(comp.notes||"");}} style={{fontSize:11,color:comp.notes?C.text:C.dim,cursor:"pointer",fontStyle:comp.notes?"normal":"italic"}}>{comp.notes||"Add note..."}</span>}</div>}
      </div>;})}
    <div style={{height:16}}/></>}
    <h3 style={{fontSize:14,fontWeight:600,color:C.white,marginBottom:8,fontFamily:"'Space Grotesk',sans-serif"}}>Coaching Tasks ({tasks.length})</h3>
    {tasks.length===0&&<p style={{color:C.muted,fontSize:13}}>No coaching tasks assigned.</p>}
    {tasks.map(t=>{const k=`${officer.id}-${t.id}`,done=!!data.completions[k],comp=data.completions[k],d=dU(t.dueDate),ov=!done&&d<0;return<div key={t.id} style={{background:C.surface,border:`1px solid ${done?"rgba(76,175,125,0.15)":ov?C.redDim:C.border}`,borderRadius:9,padding:"12px 16px",marginBottom:6}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}><button onClick={()=>toggle(officer.id,t.id)} style={{width:24,height:24,borderRadius:5,border:`2px solid ${done?C.green:"rgba(255,255,255,0.12)"}`,background:done?C.greenDim:"transparent",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.green,flexShrink:0}}>{done&&I.check}</button><div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:done?C.muted:C.white,textDecoration:done?"line-through":"none"}}>{t.title}</div><div style={{fontSize:11,color:C.muted,marginTop:1}}>{t.description}</div></div><span style={{fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:4,background:`${pC(t.priority)}20`,color:pC(t.priority),textTransform:"uppercase",fontFamily:"'Space Grotesk',sans-serif"}}>{t.priority}</span><span style={{fontSize:11,color:ov?C.red:C.muted,fontFamily:"'Space Grotesk',sans-serif",whiteSpace:"nowrap"}}>{done?`Done ${fD(comp.completedAt)}`:ov?`${Math.abs(d)}d overdue`:`Due ${fD(t.dueDate)}`}</span></div>
      {done&&<div style={{marginTop:6,paddingTop:6,borderTop:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:6,paddingLeft:34}}><span style={{fontSize:9,color:C.muted,fontFamily:"'Space Grotesk',sans-serif"}}>NOTE:</span>{ne===t.id?<><input value={nt} onChange={e=>setNt(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"){addN(officer.id,t.id,nt);setNe(null);}}} style={{...sI,flex:1,padding:"3px 7px",fontSize:11}} autoFocus/><button onClick={()=>{addN(officer.id,t.id,nt);setNe(null);}} style={{background:C.primary,border:"none",color:"#fff",fontSize:10,padding:"3px 8px",borderRadius:4,cursor:"pointer",fontFamily:"inherit"}}>Save</button></>:<span onClick={()=>{setNe(t.id);setNt(comp.notes||"");}} style={{fontSize:11,color:comp.notes?C.text:C.dim,cursor:"pointer",fontStyle:comp.notes?"normal":"italic"}}>{comp.notes||"Add note..."}</span>}</div>}
    </div>;})}
  </div>;
}

function TasksPage({data,filter,setFilter,setModal,toggle}){
  const cats=["all",...new Set(data.tasks.map(t=>t.category))];const fil=filter==="all"?data.tasks:data.tasks.filter(t=>t.category===filter);
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><div><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>Coaching Tasks</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>One-time assignments with deadlines</p></div><button onClick={()=>setModal("add-task")} style={{display:"flex",alignItems:"center",gap:5,background:C.primary,border:"none",color:"#fff",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.plus} New Task</button></div>
    <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>{cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid",fontSize:11,cursor:"pointer",fontWeight:500,fontFamily:"inherit",background:filter===c?(c==="all"?C.primaryDim:`${cC(c)}15`):"transparent",borderColor:filter===c?(c==="all"?`rgba(45,183,166,0.3)`:`${cC(c)}40`):C.border,color:filter===c?(c==="all"?C.primary:cC(c)):C.muted}}>{c==="all"?"All":c}</button>)}</div>
    {fil.map(t=>{const dn=t.assignedTo.filter(id=>data.completions[`${id}-${t.id}`]).length,pct=t.assignedTo.length?Math.round(dn/t.assignedTo.length*100):0,d=dU(t.dueDate);return<div key={t.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:7}}>
      <div style={{display:"flex",alignItems:"flex-start",gap:12}}><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><span style={{fontSize:14,fontWeight:600,color:C.white}}>{t.title}</span><span style={{fontSize:8,fontWeight:700,padding:"2px 5px",borderRadius:3,background:`${cC(t.category)}20`,color:cC(t.category),textTransform:"uppercase",fontFamily:"'Space Grotesk',sans-serif"}}>{t.category}</span></div><p style={{margin:"2px 0 6px",fontSize:12,color:C.muted}}>{t.description}</p><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,maxWidth:160,height:4,background:"rgba(255,255,255,0.06)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:pct===100?C.green:C.primary,borderRadius:2}}/></div><span style={{fontSize:11,fontFamily:"'Space Grotesk',sans-serif",color:pct===100?C.green:C.muted}}>{dn}/{t.assignedTo.length}</span></div></div>
        <div style={{textAlign:"right"}}><span style={{fontSize:8,fontWeight:700,padding:"2px 6px",borderRadius:4,background:`${pC(t.priority)}20`,color:pC(t.priority),textTransform:"uppercase",fontFamily:"'Space Grotesk',sans-serif"}}>{t.priority}</span><div style={{fontSize:11,color:d<0?C.red:C.muted,marginTop:4,fontFamily:"'Space Grotesk',sans-serif"}}>{d<0?`${Math.abs(d)}d overdue`:d===0?"Today":`${d}d left`}</div></div></div>
      <div style={{marginTop:8,paddingTop:7,borderTop:`1px solid ${C.border}`,display:"flex",gap:4,flexWrap:"wrap"}}>{t.assignedTo.map(id=>{const o=data.officers.find(x=>x.id===id);if(!o)return null;const done=!!data.completions[`${id}-${t.id}`];return<button key={id} onClick={()=>toggle(id,t.id)} title={`${o.name}`} style={{display:"flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:5,fontSize:10,cursor:"pointer",border:`1px solid ${done?"rgba(76,175,125,0.3)":"rgba(255,255,255,0.06)"}`,background:done?C.greenDim:"transparent",color:done?C.green:C.muted,fontFamily:"inherit"}}>{done&&<span style={{width:10,height:10}}>{I.check}</span>}{o.avatar}</button>;})}</div>
    </div>;})}
  </div>;
}

function ResourcesPage({data,filter,setFilter,setModal}){
  const cats=["all",...new Set(data.resources.map(r=>r.category))];const fil=filter==="all"?data.resources:data.resources.filter(r=>r.category===filter);const ti={pdf:I.pdf,video:I.video,doc:I.doc};
  return<div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><div><h1 style={{fontSize:24,fontWeight:700,color:C.white,margin:0,fontFamily:"'Space Grotesk',sans-serif"}}>Resources</h1><p style={{color:C.muted,margin:"3px 0 0",fontSize:13}}>Coaching materials and training content</p></div><button onClick={()=>setModal("add-resource")} style={{display:"flex",alignItems:"center",gap:5,background:C.primary,border:"none",color:"#fff",padding:"9px 16px",borderRadius:8,fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>{I.plus} Add Resource</button></div>
    <div style={{display:"flex",gap:6,marginBottom:18,flexWrap:"wrap"}}>{cats.map(c=><button key={c} onClick={()=>setFilter(c)} style={{padding:"5px 12px",borderRadius:6,border:"1px solid",fontSize:11,cursor:"pointer",fontWeight:500,fontFamily:"inherit",background:filter===c?(c==="all"?C.primaryDim:`${cC(c)}15`):"transparent",borderColor:filter===c?(c==="all"?`rgba(45,183,166,0.3)`:`${cC(c)}40`):C.border,color:filter===c?(c==="all"?C.primary:cC(c)):C.muted}}>{c==="all"?"All":c}</button>)}</div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>{fil.map(r=>{const lk=data.tasks.filter(t=>t.resourceId===r.id);return<div key={r.id} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:12,padding:16,transition:"border-color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.bHover} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:8}}><div style={{width:32,height:32,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",background:`${cC(r.category)}15`,color:cC(r.category)}}>{ti[r.type]||I.doc}</div><div><span style={{fontSize:9,fontWeight:700,color:cC(r.category),textTransform:"uppercase",fontFamily:"'Space Grotesk',sans-serif"}}>{r.category}</span><div style={{fontSize:13,fontWeight:600,color:C.white}}>{r.title}</div></div></div>
      <p style={{margin:"0 0 8px",fontSize:12,color:C.muted,lineHeight:1.5}}>{r.description}</p>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}><span style={{fontSize:10,color:C.dim}}>{r.type.toUpperCase()} · {fD(r.createdAt)}</span>{lk.length>0&&<span style={{fontSize:9,color:C.primary,fontFamily:"'Space Grotesk',sans-serif"}}>{lk.length} task{lk.length>1?"s":""}</span>}</div>
    </div>;})}</div>
  </div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODALS
// ═══════════════════════════════════════════════════════════════════════════════
function OfficerFormModal({data,officer,onClose,onSave}){
  const isE=!!officer;const[f,setF]=useState({name:officer?.name||"",email:officer?.email||"",phone:officer?.phone||"",team:officer?.team||data.teams[0],ct:"",uc:false});const s=(k,v)=>setF(p=>({...p,[k]:v}));const ok=f.name.trim().length>=2&&f.email.includes("@");
  return<Modal title={isE?"Edit Loan Officer":"Add Loan Officer"} onClose={onClose} width={420}>
    <div style={{marginBottom:12}}><label style={sL}>Full Name *</label><input value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Jane Smith" style={sI} autoFocus/></div>
    <div style={{marginBottom:12}}><label style={sL}>Email *</label><input value={f.email} onChange={e=>s("email",e.target.value)} placeholder="jane@milestonemortgage.com" style={sI}/></div>
    <div style={{marginBottom:12}}><label style={sL}>Phone</label><input value={f.phone} onChange={e=>s("phone",e.target.value)} placeholder="(508) 123-4567" style={sI}/></div>
    <div style={{marginBottom:18}}><label style={sL}>Team</label>{!f.uc?<div style={{display:"flex",gap:8}}><select value={f.team} onChange={e=>s("team",e.target.value)} style={{...sS,flex:1}}>{data.teams.map(t=><option key={t} value={t}>{t}</option>)}</select><button onClick={()=>s("uc",true)} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,borderRadius:6,padding:"0 10px",cursor:"pointer",color:C.primary,fontSize:11,fontFamily:"inherit",whiteSpace:"nowrap"}}>+ New</button></div>:<div style={{display:"flex",gap:8}}><input value={f.ct} onChange={e=>s("ct",e.target.value)} placeholder="Team name..." style={{...sI,flex:1}} autoFocus/><button onClick={()=>s("uc",false)} style={{background:"rgba(255,255,255,0.03)",border:`1px solid ${C.border}`,borderRadius:6,padding:"0 10px",cursor:"pointer",color:C.muted,fontSize:11,fontFamily:"inherit"}}>Cancel</button></div>}</div>
    {f.name.trim()&&<div style={{background:C.primaryDim,border:`1px solid rgba(45,183,166,0.15)`,borderRadius:8,padding:12,marginBottom:16,display:"flex",alignItems:"center",gap:10}}><div style={{width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.white,background:`linear-gradient(135deg,${C.primary}40,${C.accent}40)`}}>{mkA(f.name)}</div><div><div style={{fontSize:13,fontWeight:600,color:C.white}}>{f.name.trim()}</div><div style={{fontSize:11,color:C.muted}}>{f.uc?f.ct||"New Team":f.team} Team</div></div><div style={{marginLeft:"auto",fontSize:9,color:C.dim,fontFamily:"'Space Grotesk',sans-serif"}}>Preview</div></div>}
    <button onClick={()=>{if(ok){onSave({name:f.name.trim(),email:f.email.trim(),phone:f.phone.trim(),team:f.uc?f.ct.trim():f.team});onClose();}}} style={bP(ok)}>{isE?"Save Changes":"Add Officer"}</button>
  </Modal>;
}

function AddTaskModal({data,onClose,onAdd}){
  const[f,setF]=useState({title:"",description:"",category:"Sales",priority:"medium",dueDate:"2026-05-01",assignedTo:[],resourceId:""});const s=(k,v)=>setF(p=>({...p,[k]:v}));const tgl=id=>s("assignedTo",f.assignedTo.includes(id)?f.assignedTo.filter(x=>x!==id):[...f.assignedTo,id]);const ok=f.title&&f.assignedTo.length;
  return<Modal title="New Coaching Task" onClose={onClose}><div style={{marginBottom:12}}><label style={sL}>Title *</label><input value={f.title} onChange={e=>s("title",e.target.value)} style={sI} autoFocus/></div><div style={{marginBottom:12}}><label style={sL}>Description</label><textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={2} style={{...sI,resize:"vertical"}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}><div><label style={sL}>Category</label><select value={f.category} onChange={e=>s("category",e.target.value)} style={sS}>{["Sales","Product Knowledge","Operations","Partnerships","Compliance"].map(c=><option key={c}>{c}</option>)}</select></div><div><label style={sL}>Priority</label><select value={f.priority} onChange={e=>s("priority",e.target.value)} style={sS}>{["high","medium","low"].map(p=><option key={p}>{p}</option>)}</select></div><div><label style={sL}>Due Date</label><input type="date" value={f.dueDate} onChange={e=>s("dueDate",e.target.value)} style={sS}/></div></div><div style={{marginBottom:12}}><label style={sL}>Linked Resource</label><select value={f.resourceId} onChange={e=>s("resourceId",e.target.value)} style={sS}><option value="">None</option>{data.resources.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}</select></div><div style={{marginBottom:16}}><label style={sL}>Assign To *</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}><button onClick={()=>s("assignedTo",f.assignedTo.length===data.officers.length?[]:data.officers.map(o=>o.id))} style={{padding:"4px 9px",borderRadius:5,fontSize:11,cursor:"pointer",border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.02)",color:C.muted,fontFamily:"inherit"}}>{f.assignedTo.length===data.officers.length?"None":"All"}</button>{data.officers.map(o=><button key={o.id} onClick={()=>tgl(o.id)} style={{padding:"4px 10px",borderRadius:5,fontSize:11,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${f.assignedTo.includes(o.id)?C.primary:C.border}`,background:f.assignedTo.includes(o.id)?C.primaryDim:"transparent",color:f.assignedTo.includes(o.id)?C.primary:C.muted}}>{o.name}</button>)}</div></div><button onClick={()=>{if(ok){onAdd(f);onClose();}}} style={bP(ok)}>Create Task</button></Modal>;
}

function AddResourceModal({onClose,onAdd}){
  const[f,setF]=useState({title:"",description:"",type:"pdf",category:"Sales"});const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return<Modal title="Add Resource" onClose={onClose} width={420}><div style={{marginBottom:12}}><label style={sL}>Title *</label><input value={f.title} onChange={e=>s("title",e.target.value)} style={sI} autoFocus/></div><div style={{marginBottom:12}}><label style={sL}>Description</label><textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={2} style={{...sI,resize:"vertical"}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}><div><label style={sL}>Type</label><select value={f.type} onChange={e=>s("type",e.target.value)} style={sS}>{["pdf","video","doc"].map(t=><option key={t}>{t.toUpperCase()}</option>)}</select></div><div><label style={sL}>Category</label><select value={f.category} onChange={e=>s("category",e.target.value)} style={sS}>{["Sales","Product Knowledge","Operations","Partnerships","Compliance"].map(c=><option key={c}>{c}</option>)}</select></div></div><button onClick={()=>{if(f.title){onAdd(f);onClose();}}} style={bP(!!f.title)}>Add Resource</button></Modal>;
}

function AddDailyModal({data,onClose,onAdd}){
  const[f,setF]=useState({title:"",description:"",category:"Sales",assignedTo:[],recurring:true});const s=(k,v)=>setF(p=>({...p,[k]:v}));const tgl=id=>s("assignedTo",f.assignedTo.includes(id)?f.assignedTo.filter(x=>x!==id):[...f.assignedTo,id]);const ok=f.title&&f.assignedTo.length;
  return<Modal title="New Daily Task" onClose={onClose}><div style={{marginBottom:12}}><label style={sL}>Title *</label><input value={f.title} onChange={e=>s("title",e.target.value)} placeholder="e.g. Make 10+ Outbound Calls" style={sI} autoFocus/></div><div style={{marginBottom:12}}><label style={sL}>Description</label><textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={2} style={{...sI,resize:"vertical"}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}><div><label style={sL}>Category</label><select value={f.category} onChange={e=>s("category",e.target.value)} style={sS}>{["Sales","Product Knowledge","Operations","Partnerships","Compliance"].map(c=><option key={c}>{c}</option>)}</select></div><div><label style={sL}>Type</label><div style={{display:"flex",gap:6,marginTop:4}}><button onClick={()=>s("recurring",true)} style={{flex:1,padding:7,borderRadius:6,border:`1px solid ${f.recurring?C.primary:C.border}`,background:f.recurring?C.primaryDim:"transparent",color:f.recurring?C.primary:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>{I.repeat} Recurring</button><button onClick={()=>s("recurring",false)} style={{flex:1,padding:7,borderRadius:6,border:`1px solid ${!f.recurring?C.gold:C.border}`,background:!f.recurring?C.goldDim:"transparent",color:!f.recurring?C.gold:C.muted,fontSize:11,cursor:"pointer",fontFamily:"inherit"}}>One-off</button></div></div></div><div style={{marginBottom:16}}><label style={sL}>Assign To *</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}><button onClick={()=>s("assignedTo",f.assignedTo.length===data.officers.length?[]:data.officers.map(o=>o.id))} style={{padding:"4px 9px",borderRadius:5,fontSize:11,cursor:"pointer",border:`1px solid ${C.border}`,background:"rgba(255,255,255,0.02)",color:C.muted,fontFamily:"inherit"}}>{f.assignedTo.length===data.officers.length?"None":"All"}</button>{data.officers.map(o=><button key={o.id} onClick={()=>tgl(o.id)} style={{padding:"4px 10px",borderRadius:5,fontSize:11,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${f.assignedTo.includes(o.id)?C.primary:C.border}`,background:f.assignedTo.includes(o.id)?C.primaryDim:"transparent",color:f.assignedTo.includes(o.id)?C.primary:C.muted}}>{o.name}</button>)}</div></div><button onClick={()=>{if(ok){onAdd(f);onClose();}}} style={bP(ok)}>Create Daily Task</button></Modal>;
}

function SendDMModal({data,onClose,onSend}){
  const[to,setTo]=useState([]);const[body,setBody]=useState("");const tgl=id=>setTo(to.includes(id)?to.filter(x=>x!==id):[...to,id]);const ok=to.length&&body.trim();
  return<Modal title="Send Direct Message" onClose={onClose}><div style={{marginBottom:12}}><label style={sL}>To *</label><div style={{display:"flex",gap:5,flexWrap:"wrap"}}>{data.officers.map(o=><button key={o.id} onClick={()=>tgl(o.id)} style={{padding:"5px 11px",borderRadius:5,fontSize:11,cursor:"pointer",fontFamily:"inherit",border:`1px solid ${to.includes(o.id)?C.primary:C.border}`,background:to.includes(o.id)?C.primaryDim:"transparent",color:to.includes(o.id)?C.primary:C.muted}}>{o.name}</button>)}</div></div><div style={{marginBottom:16}}><label style={sL}>Message *</label><textarea value={body} onChange={e=>setBody(e.target.value)} rows={4} placeholder="Write your message..." style={{...sI,resize:"vertical"}}/></div><button onClick={()=>{if(ok){onSend({type:"dm",from:"Coach",to,title:"",body:body.trim()});onClose();}}} style={bP(ok)}>Send Message</button></Modal>;
}

function SendAnnouncementModal({onClose,onSend}){
  const[title,setTitle]=useState("");const[body,setBody]=useState("");const ok=title.trim()&&body.trim();
  return<Modal title="Post Announcement" onClose={onClose}><div style={{marginBottom:12}}><label style={sL}>Title *</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Rate Sheet Alert" style={sI} autoFocus/></div><div style={{marginBottom:16}}><label style={sL}>Message *</label><textarea value={body} onChange={e=>setBody(e.target.value)} rows={4} placeholder="Your announcement to all officers..." style={{...sI,resize:"vertical"}}/></div><button onClick={()=>{if(ok){onSend({type:"announcement",from:"Coach",to:[],title:title.trim(),body:body.trim()});onClose();}}} style={bP(ok)}>Post Announcement</button></Modal>;
}
