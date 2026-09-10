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
  people:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  resources:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  msg:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  plus:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  close:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  edit:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  cal:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  pdf:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  video:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>,
  doc:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  trend:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

const fD=(d)=>{const s=String(d);return new Date(s.includes("T")?s:s+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});};
const cC=(c)=>({Sales:C.primary,"Product Knowledge":C.gold,Operations:C.accent,Partnerships:"#E07C5A",Compliance:"#7C6BC4"}[c]||C.muted);
const mkA=(n)=>n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);

const sI={width:"100%",background:"rgba(16,23,58,0.04)",border:`1px solid ${C.border}`,borderRadius:6,padding:"9px 11px",color:C.text,fontSize:13,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};
const sS={...sI,padding:"9px 8px",fontSize:12};
const sL={display:"block",fontSize:10,color:C.muted,marginBottom:4,fontWeight:600,textTransform:"uppercase",letterSpacing:0.8,fontFamily:"'Baloo 2',sans-serif"};
const bP=(ok)=>({width:"100%",padding:"11px",borderRadius:8,border:"none",fontSize:14,fontWeight:600,cursor:ok?"pointer":"default",background:ok?C.primary:"rgba(16,23,58,0.05)",color:ok?"#fff":C.muted,fontFamily:"inherit"});

function Modal({title,onClose,children,width=480}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><div onClick={e=>e.stopPropagation()} style={{background:C.surfaceHi,border:`1px solid ${C.border}`,borderRadius:14,padding:28,width,maxHeight:"85vh",overflowY:"auto"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><h2 style={{margin:0,fontSize:18,fontWeight:700,color:C.white}}>{title}</h2><button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",padding:4}}>{I.close}</button></div>{children}</div></div>;}
function Confirm({msg,sub,onOk,onNo}){return<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:200}} onClick={onNo}><div onClick={e=>e.stopPropagation()} style={{background:C.surfaceHi,border:`1px solid ${C.redDim}`,borderRadius:14,padding:28,width:380,textAlign:"center"}}><div style={{width:48,height:48,borderRadius:"50%",background:C.redDim,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",color:C.red}}>{I.trash}</div><p style={{color:C.white,fontSize:15,fontWeight:500,margin:"0 0 6px"}}>{msg}</p><p style={{color:C.muted,fontSize:13,margin:"0 0 24px"}}>{sub}</p><div style={{display:"flex",gap:10}}><button onClick={onNo} style={{flex:1,padding:10,borderRadius:8,border:`1px solid ${C.border}`,background:"transparent",color:C.text,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Cancel</button><button onClick={onOk} style={{flex:1,padding:10,borderRadius:8,border:"none",background:C.red,color:"#fff",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Delete</button></div></div></div>;}

// ═══════════════════════════════════════════════════════════════════════════════
export default function App(){
  const[data,setData]=useState(null);
  const[modal,setModal]=useState(null);
  const[rF,setRF]=useState("all");
  const[loaded,setLoaded]=useState(false);
  const[loadError,setLoadError]=useState(null);

  async function reload(){try{const d=await fetchAllData();setData(d);setLoadError(null);}catch(e){setLoadError(e.message||"Failed to load from Monday");}finally{setLoaded(true);}}
  useEffect(()=>{reload();},[]);

  async function addRes(r){try{const id=await monday.createResource(r);setData(p=>({...p,resources:[...p.resources,{title:r.title,description:r.description,type:r.type,category:r.category,url:r.url||"",id,createdAt:TODAY}]}));}catch(e){console.error("addRes failed",e);}}
  async function updRes(id,r){try{await monday.updateResource(id,r);setData(p=>({...p,resources:p.resources.map(x=>x.id===id?{...x,title:r.title,description:r.description,type:r.type,category:r.category,url:r.url||""}:x)}));}catch(e){console.error("updRes failed",e);}}
  async function delRes(id){try{await monday.deleteResource(id);setData(p=>({...p,resources:p.resources.filter(r=>r.id!==id),tasks:p.tasks.map(t=>t.resourceId===id?{...t,resourceId:""}:t)}));}catch(e){console.error("delRes failed",e);}}
  async function addRecap(r){try{const id=await monday.createRecap(r);setData(p=>({...p,recaps:[{...r,id,createdAt:TODAY},...p.recaps]}));}catch(e){console.error("addRecap failed",e);}}
  async function delRecap(id){try{await monday.deleteRecap(id);setData(p=>({...p,recaps:p.recaps.filter(r=>r.id!==id)}));}catch(e){console.error("delRecap failed",e);}}

  if(loadError)return<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Inter',sans-serif",flexDirection:"column",gap:10,padding:24,textAlign:"center"}}><p style={{color:C.red,fontWeight:600}}>Couldn't load data from Monday.com</p><p style={{opacity:0.6,fontSize:12,maxWidth:420}}>{loadError}</p><p style={{opacity:0.5,fontSize:12}}>Check your .env file has a valid VITE_MONDAY_API_TOKEN and board IDs, then refresh.</p></div>;
  if(!loaded||!data)return<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",background:C.bg,color:C.text,fontFamily:"'Inter',sans-serif"}}><p style={{opacity:0.6}}>Loading from Monday...</p></div>;

  const scrollTo=(id)=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth",block:"start"});};

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
          {data.resources.length} resources<br/>NMLS #1815656
        </div>
      </nav>

      {/* ── Main — everything on one scrollable page ── */}
      <main style={{flex:1,padding:"24px 32px",overflowY:"auto",maxHeight:"100vh"}}>
        <section id="resources"><ResourcesPage data={data} filter={rF} setFilter={setRF} setModal={setModal}/></section>
        <div style={{borderTop:`1px solid ${C.border}`,margin:"36px 0"}}/>
        <section id="calendar"><CalendarPage/></section>
        <div style={{borderTop:`1px solid ${C.border}`,margin:"36px 0"}}/>
        <section id="recaps"><RecapsPage data={data} setModal={setModal}/></section>
      </main>

      {modal==="add-resource"&&<AddResourceModal onClose={()=>setModal(null)} onSave={addRes}/>}
      {modal?.type==="edit-resource"&&<AddResourceModal resource={modal.resource} onClose={()=>setModal(null)} onSave={r=>updRes(modal.resource.id,r)}/>}
      {modal?.type==="confirm-delete-resource"&&<Confirm msg={`Delete "${modal.resource.title}"?`} sub="Any tasks linked to this resource will be unlinked." onNo={()=>setModal(null)} onOk={()=>{delRes(modal.resource.id);setModal(null);}}/>}
      {modal==="add-recap"&&<AddRecapModal data={data} onClose={()=>setModal(null)} onSave={addRecap}/>}
      {modal?.type==="confirm-delete-recap"&&<Confirm msg="Delete this recap?" sub="This can't be undone." onNo={()=>setModal(null)} onOk={()=>{delRecap(modal.recap.id);setModal(null);}}/>}
    </div>
  );
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
function AddResourceModal({resource,onClose,onSave}){
  const isE=!!resource;
  const[f,setF]=useState(resource?{title:resource.title,description:resource.description,type:resource.type,category:resource.category,url:resource.url||""}:{title:"",description:"",type:"pdf",category:"Sales",url:""});const s=(k,v)=>setF(p=>({...p,[k]:v}));
  return<Modal title={isE?"Edit Resource":"Add Resource"} onClose={onClose} width={420}><div style={{marginBottom:12}}><label style={sL}>Title *</label><input value={f.title} onChange={e=>s("title",e.target.value)} style={sI} autoFocus/></div><div style={{marginBottom:12}}><label style={sL}>Description</label><textarea value={f.description} onChange={e=>s("description",e.target.value)} rows={2} style={{...sI,resize:"vertical"}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}><div><label style={sL}>Type</label><select value={f.type} onChange={e=>s("type",e.target.value)} style={sS}>{["pdf","video","doc"].map(t=><option key={t}>{t.toUpperCase()}</option>)}</select></div><div><label style={sL}>Category</label><select value={f.category} onChange={e=>s("category",e.target.value)} style={sS}>{["Sales","Product Knowledge","Operations","Partnerships","Compliance"].map(c=><option key={c}>{c}</option>)}</select></div></div><div style={{marginBottom:16}}><label style={sL}>File Link (optional)</label><input value={f.url} onChange={e=>s("url",e.target.value)} placeholder="Paste a Google Drive / Dropbox / web link" style={sI}/><p style={{margin:"6px 0 0",fontSize:11,color:C.dim}}>Upload the file to Google Drive (or wherever you keep files), then paste its shareable link here.</p></div><button onClick={()=>{if(f.title){onSave(f);onClose();}}} style={bP(!!f.title)}>{isE?"Save Changes":"Add Resource"}</button></Modal>;
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

