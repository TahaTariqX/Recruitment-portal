import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Toggle } from "@/components/ui/toggle"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"

const LANG_GROUPS = [
  { g:"Arabic",     s:["Arabic (Modern Standard)","Arabic (Egyptian)","Arabic (Gulf)","Arabic (Levantine)","Arabic (Moroccan)"] },
  { g:"Chinese",    s:["Chinese (Simplified)","Chinese (Traditional)","Chinese (Cantonese)"] },
  { g:"Dutch",      s:["Dutch (Netherlands)","Dutch (Belgium / Flemish)"] },
  { g:"English",    s:["English (UK)","English (US)","English (Australia)","English (Canada)","English (South Africa)"] },
  { g:"French",     s:["French (France)","French (Belgium)","French (Switzerland)","French (Canada)"] },
  { g:"German",     s:["German (Germany)","German (Austria)","German (Switzerland)"] },
  { g:"Italian",    s:["Italian (Italy)","Italian (Switzerland)"] },
  { g:"Norwegian",  s:["Norwegian (Bokmål)","Norwegian (Nynorsk)"] },
  { g:"Persian",    s:["Persian / Farsi","Dari"] },
  { g:"Portuguese", s:["Portuguese (Portugal)","Portuguese (Brazil)"] },
  { g:"Spanish",    s:["Spanish (Spain)","Spanish (Latin America)","Spanish (Mexico)","Spanish (Argentina)"] },
  { g:"Bulgarian",s:[] },{ g:"Croatian",s:[] },{ g:"Czech",s:[] },{ g:"Danish",s:[] },
  { g:"Estonian",s:[] },{ g:"Finnish",s:[] },{ g:"Greek",s:[] },{ g:"Hebrew",s:[] },
  { g:"Hindi",s:[] },{ g:"Hungarian",s:[] },{ g:"Indonesian",s:[] },{ g:"Japanese",s:[] },
  { g:"Korean",s:[] },{ g:"Latvian",s:[] },{ g:"Lithuanian",s:[] },{ g:"Polish",s:[] },
  { g:"Romanian",s:[] },{ g:"Russian",s:[] },{ g:"Slovak",s:[] },{ g:"Slovenian",s:[] },
  { g:"Swedish",s:[] },{ g:"Thai",s:[] },{ g:"Turkish",s:[] },{ g:"Ukrainian",s:[] },
  { g:"Vietnamese",s:[] }
]
const PRESET_SPECS = ["Commercial law","Criminal law","Family law","Labor law","IP law","Medical","Technical","Financial","Marketing","Environmental law","IT / Software","Literary"]
const PRESET_SVCS  = ["Translation","Journalistic editor","Proofreading","Lectorate"]
const INDUSTRIES   = ["Healthcare","Law & Compliance","Finance & Banking","Technology","Automotive","Energy","Education","Retail & E-commerce","Government & Public Sector"]
const CC_LIST = [["+49","🇩🇪"],["+1","🇺🇸"],["+44","🇬🇧"],["+33","🇫🇷"],["+34","🇪🇸"],["+39","🇮🇹"],["+31","🇳🇱"],["+48","🇵🇱"],["+7","🇷🇺"],["+90","🇹🇷"],["+20","🇪🇬"],["+966","🇸🇦"],["+86","🇨🇳"],["+91","🇮🇳"],["+55","🇧🇷"],["+52","🇲🇽"],["+81","🇯🇵"],["+82","🇰🇷"],["+61","🇦🇺"],["+27","🇿🇦"],["+380","🇺🇦"],["+40","🇷🇴"],["+36","🇭🇺"],["+45","🇩🇰"],["+46","🇸🇪"],["+47","🇳🇴"],["+358","🇫🇮"],["+41","🇨🇭"],["+43","🇦🇹"],["+32","🇧🇪"],["+351","🇵🇹"],["+30","🇬🇷"],["+420","🇨🇿"],["+421","🇸🇰"],["+385","🇭🇷"],["+359","🇧🇬"],["+372","🇪🇪"],["+371","🇱🇻"],["+370","🇱🇹"]]
const WIZ_META = [
  { title:"Are you an individual or an agency?",  sub:"This determines how we set up your language pairs." },
  { title:"What is your mother tongue?",           sub:"Select up to 2 native languages — these become your target languages." },
  { title:"Add your source languages",             sub:"Select every language you translate from." },
  { title:"Choose your specialisations",           sub:"These will apply to all your language pairs." },
  { title:"Services & rates",                      sub:"Select each service you offer and set your default rate and speed." },
]
const INTERP_WORKLOAD  = ["Full-time","Part-time, approximately 50%","Part-time approx. 25%","Sometimes","Rarely"]
const INTERP_EXP       = ["Under 1 year","1–3 years","3–5 years","5–10 years","Over 10 years"]
const GERMAN_LEVELS    = ["A1 — Beginner","A2 — Elementary","B1 — Intermediate","B2 — Upper intermediate","C1 — Advanced","C2 — Proficient / Native"]
const TRAVEL_MODES     = ["Public transportation","Car","Both"]
const INTERP_MODALITIES= ["Phone","On-site","Video"]
function bu(n) { return n==="Translation" ? {rl:"€/line",sl:"lines/hr"} : {rl:"€/min",sl:"lines/hr"} }
let _id = 1; const nid = () => _id++

// ── Shared styles ──────────────────────────────────────────────────────────────
const S = {
  label:    { fontSize:13.5, color:"var(--color-text-secondary)", textAlign:"right", lineHeight:1.4 },
  secLabel: { fontSize:11, fontWeight:700, color:"var(--color-text-tertiary)", letterSpacing:"1.2px", textTransform:"uppercase", paddingBottom:6, borderBottom:"1px solid var(--color-border-tertiary)", marginBottom:18, marginTop:16 },
  hint:     { fontSize:11.5, color:"var(--color-text-tertiary)", marginTop:3, lineHeight:1.5 },
  flbl:     { fontSize:10.5, fontWeight:700, color:"var(--color-text-tertiary)", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 },
  row:      (top) => ({ display:"grid", gridTemplateColumns:"220px 1fr", gap:12, marginBottom:18, alignItems:top?"start":"center" }),
  chip:     (on)  => ({ padding:"6px 12px", fontSize:12.5, borderRadius:6, border:`1px solid ${on?"#1a1a2e":"var(--color-border-secondary)"}`, background:on?"#1a1a2e":"var(--color-background-primary)", color:on?"white":"var(--color-text-primary)", cursor:"pointer", fontFamily:"inherit", fontWeight:500, transition:"all 0.1s" }),
  dHead:    { padding:"18px 20px 14px", borderBottom:"1px solid var(--color-border-tertiary)" },
  dFoot:    { padding:"14px 20px", borderTop:"1px solid var(--color-border-tertiary)", display:"flex", gap:8 },
  dBody:    { flex:1, overflowY:"auto", padding:20 },
  tagBlue:  { display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px", fontSize:12, background:"#dbeafe", color:"#1d4ed8", borderRadius:4, border:"1px solid #bfdbfe" },
  pairRow:  { display:"flex", alignItems:"center", gap:8, padding:"8px 11px", background:"var(--color-background-secondary)", border:"1px solid var(--color-border-tertiary)", borderRadius:4, marginBottom:6, fontSize:13 },
}

// ── Small components ──────────────────────────────────────────────────────────
const Trash = ({s=11}) => <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 01.5-.5h2a.5.5 0 01.5.5v1M5.5 6v4M8.5 6v4M3 3.5l.7 7.4a.67.67 0 00.67.6h5.33a.67.67 0 00.66-.6L11 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
const Plus  = ({s=11}) => <svg width={s} height={s} viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
const Restore = ({s=11}) => <svg width={s} height={s} viewBox="0 0 14 14" fill="none"><path d="M2.5 7a4.5 4.5 0 104.5-4.5c-1.4 0-2.67.64-3.5 1.65M2.5 1.5v2.7h2.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
const Info  = () => <svg width={14} height={14} viewBox="0 0 16 16" fill="none" style={{flexShrink:0,marginTop:1}}><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 7v5M8 5.5v-.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>

function UnitInput({ value, onChange, placeholder, unit, step="0.01", ov=false }) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-md overflow-hidden transition-colors border",
      ov ? "border-blue-200 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-400 focus-within:border-gray-900"
    )}>
      <input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} step={step}
        className={cn(
          "w-[38px] px-1 py-0.5 text-[11px] border-none bg-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          ov ? "text-blue-700" : "text-gray-900"
        )}/>
      <span className={cn(
        "text-[10px] font-medium px-1.5 border-l h-[22px] flex items-center whitespace-nowrap",
        ov ? "text-blue-500 border-blue-200 bg-blue-100" : "text-gray-400 border-gray-100 bg-gray-50"
      )}>
        {unit}
      </span>
    </div>
  )
}

function DrawerUnit({ value, onChange, placeholder, unit, step="0.01" }) {
  return (
    <div style={{ display:"flex", alignItems:"center", borderRadius:6, border:"1px solid var(--color-border-secondary)", overflow:"hidden", flex:1 }}>
      <input type="number" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} step={step}
        style={{ flex:1, padding:"6px 8px", fontSize:13, border:"none", background:"var(--color-background-primary)", color:"var(--color-text-primary)", outline:"none", minWidth:0, WebkitAppearance:"none", MozAppearance:"textfield" }}/>
      <span style={{ fontSize:11, fontWeight:500, color:"var(--color-text-tertiary)", padding:"0 8px", borderLeft:"1px solid var(--color-border-tertiary)", height:34, display:"flex", alignItems:"center", whiteSpace:"nowrap", background:"var(--color-background-secondary)" }}>
        {unit}
      </span>
    </div>
  )
}

function Chip({ label, selected, onClick }) {
  return (
    <Toggle size="sm" pressed={selected} onPressedChange={()=>onClick()} className="rounded-md px-3 text-xs font-medium h-8 data-[state=on]:bg-gray-900 data-[state=on]:text-white border border-gray-200">
      {label}
    </Toggle>
  )
}

function LangSelect({ value, onChange, exclude=[], placeholder="Select language..." }) {
  return (
    <Select value={value||""} onValueChange={onChange}>
      <SelectTrigger className="w-full"><SelectValue placeholder={placeholder}/></SelectTrigger>
      <SelectContent>
        {LANG_GROUPS.map(g => {
          if (g.s.length) {
            const vis = g.s.filter(s=>!exclude.includes(s))
            if (!vis.length) return null
            return <SelectGroup key={g.g}><SelectLabel>{g.g}</SelectLabel>{vis.map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectGroup>
          }
          if (exclude.includes(g.g)) return null
          return <SelectItem key={g.g} value={g.g}>{g.g}</SelectItem>
        })}
      </SelectContent>
    </Select>
  )
}

function FormRow({ label, required, hint, children, top=false, labelPaddingTop }) {
  const shouldPt = labelPaddingTop === undefined && top
  return (
    <div className={cn(
      "grid grid-cols-1 md:grid-cols-[220px_1fr] gap-1 md:gap-3 mb-3 md:mb-[18px]",
      top ? "md:items-start" : "md:items-center"
    )}>
      <div className={cn(
        "text-[13.5px] text-gray-500 leading-snug md:text-right",
        shouldPt && "md:pt-2"
      )}>
        {required && <span className="text-[#e63946] mr-0.5">*</span>}{label}
      </div>
      <div>
        {children}
        {hint && <p className="text-[11.5px] text-gray-400 mt-1 leading-relaxed">{hint}</p>}
      </div>
    </div>
  )
}

function SecLabel({ children }) {
  return <div style={S.secLabel}>{children}</div>
}

// ── Reusable sheet wrapper (slide-in drawer) ─────────────────────────────────
function FormSheet({ open, onOpenChange, title, sub, progress, children, footer }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:w-[480px] sm:max-w-md p-0 flex flex-col gap-0">
        {progress != null && <Progress value={progress} className="rounded-none h-[3px]"/>}
        <SheetHeader className="p-5 pb-4 border-b border-gray-100 space-y-1">
          <SheetTitle>{title}</SheetTitle>
          {sub && <SheetDescription>{sub}</SheetDescription>}
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        <div className="p-4 border-t border-gray-100 flex gap-2">{footer}</div>
      </SheetContent>
    </Sheet>
  )
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── top-level flow ──
  const [step,setStep] = useState("basic")   // basic | role | interpreter | translator | review
  const [role,setRole] = useState("")         // translator | interpreter | both
  const [submitted,setSubmitted] = useState(false)

  // ── basic info (common) ──
  const [firstName,setFirstName] = useState("")
  const [lastName,setLastName]   = useState("")
  const [birthDate,setBirthDate] = useState("")
  const [gender,setGender]       = useState("")
  const [email,setEmail]         = useState("")
  const [password,setPassword]   = useState("")
  const [passwordConfirm,setPasswordConfirm] = useState("")
  const [cc,setCc]               = useState("+49")
  const [phone,setPhone]         = useState("")
  const [country,setCountry]     = useState("")
  const [address,setAddress]     = useState("")
  const [city,setCity]           = useState("")
  const [postal,setPostal]       = useState("")
  const [taxId,setTaxId]         = useState("")
  const [vatSub,setVatSub]       = useState(false)
  const [vatNum,setVatNum]       = useState("")
  const [foundUs,setFoundUs]     = useState("")
  const [consent,setConsent]     = useState(false)

  // ── translator-specific ──
  const [catTools,setCatTools]   = useState([])
  const [catOther,setCatOther]   = useState("")
  const [workload,setWorkload]   = useState("")
  const [yearsExp,setYearsExp]   = useState("")
  const [industries,setInds]     = useState([])
  const [indOpen,setIndOpen]     = useState(false)
  const [pairs,setPairs]         = useState([])
  const [langReady,setLangReady] = useState(false)

  // ── interpreter-specific ──
  const [interpModalities,setInterpModalities] = useState([])      // Phone/On-site/Video
  const [interpBdu,setInterpBdu]               = useState(false)
  const [interpBduOther,setInterpBduOther]     = useState(false)
  const [interpBduOtherText,setInterpBduOtherText] = useState("")
  const [interpLangs,setInterpLangs]           = useState("")       // free text
  const [interpWorkload,setInterpWorkload]     = useState("")
  const [interpExp,setInterpExp]               = useState("")
  const [germanLevel,setGermanLevel]           = useState("")
  const [travelMode,setTravelMode]             = useState("")
  const [interpSvcs,setInterpSvcs]             = useState("")       // free text: what type of interpreting services
  const [interpIndustries,setInterpIndustries] = useState("")       // free text

  // ── wizard/drawer state ──
  const [wizOpen,setWizOpen]     = useState(false)
  const [wizStep,setWizStep]     = useState(1)
  const [wizData,setWizData]     = useState({type:"",mt1:"",mt2:"",srcLangs:[],specs:[],services:[],certifiedPairs:{}})
  const [wizErr,setWizErr]       = useState({})
  const [pairOpen,setPairOpen]   = useState(false)
  const [pairStep,setPairStep]   = useState(1)
  const [pairData,setPairData]   = useState({from:"",to:"",services:[],certified:false,specRates:{}})
  const [specOpen,setSpecOpen]   = useState(false)
  const [specData,setSpecData]   = useState({sel:"",rates:{}})
  const [svcOpen,setSvcOpen]     = useState(false)
  const [svcData,setSvcData]     = useState({sel:"",rate:"",speed:""})
  const [dlg,setDlg]             = useState({open:false,msg:"",cb:null})
  const [hovRow,setHovRow]       = useState(null)
  const [hovCol,setHovCol]       = useState(null)
  const [hovCell,setHovCell]     = useState(null)
  const [pairsBannerShown,setPairsBannerShown] = useState(() => {
    try { return localStorage.getItem("pairsBannerDismissed") !== "1" } catch { return true }
  })
  function dismissPairsBanner() {
    setPairsBannerShown(false)
    try { localStorage.setItem("pairsBannerDismissed","1") } catch {}
  }

  const toggleCert = (id) => mp(ps=>{const p=ps.find(p=>p.id===id);if(p)p.cert=!p.cert})

  // ── mutations ──
  function mp(fn) { setPairs(p=>{ const n=JSON.parse(JSON.stringify(p)); fn(n); return n }) }
  function cfm(msg,cb) { setDlg({open:true,msg,cb}) }
  function delPair(id)    { cfm("Delete this language pair? This cannot be undone.", ()=>setPairs(p=>p.filter(x=>x.id!==id))) }
  function delSvc(pid,sn) { cfm(`Remove "${sn}" from this pair?`, ()=>mp(ps=>{const p=ps.find(p=>p.id===pid);if(p)p.services=p.services.filter(s=>s.name!==sn)})) }
  function delSpec(pid,sp){ cfm(`Remove "${sp}" from this pair?`, ()=>mp(ps=>{const p=ps.find(p=>p.id===pid);if(p){p.specs=p.specs.filter(s=>s!==sp);p.services.forEach(s=>{delete s.overrides[sp];delete s.notOffered[sp]})}})) }
  const setOv   = (pid,sn,sp,f,v) => mp(ps=>{const svc=ps.find(p=>p.id===pid)?.services.find(s=>s.name===sn);if(svc){if(!svc.overrides[sp])svc.overrides[sp]={};svc.overrides[sp][f]=v}})
  const resetOv = (pid,sn,sp)     => mp(ps=>{const svc=ps.find(p=>p.id===pid)?.services.find(s=>s.name===sn);if(svc)delete svc.overrides[sp]})
  const setNO   = (pid,sn,sp,v)   => mp(ps=>{const svc=ps.find(p=>p.id===pid)?.services.find(s=>s.name===sn);if(svc){if(v){svc.notOffered[sp]=true;delete svc.overrides[sp]}else delete svc.notOffered[sp]}})
  const setBase = (pid,sn,f,v)    => mp(ps=>{const svc=ps.find(p=>p.id===pid)?.services.find(s=>s.name===sn);if(svc)svc[f]=v})
  const toggleP = id              => mp(ps=>{const p=ps.find(p=>p.id===id);if(p)p.open=!p.open})

  // ── wizard ──
  function wizNext() {
    if(wizStep===1&&!wizData.type)            {setWizErr({t:"Please select individual or agency."});return}
    if(wizStep===2&&!wizData.mt1)             {setWizErr({mt1:"Please select your primary mother tongue."});return}
    if(wizStep===3&&!wizData.srcLangs.length) {setWizErr({src:"Please add at least one source language."});return}
    if(wizStep===5){
      if(!wizData.services.length)            {setWizErr({svc:"Please select at least one service."});return}
      const bad=wizData.services.filter(s=>!s.rate||!s.speed)
      if(bad.length)                          {setWizErr({rates:bad.map(s=>s.name)});return}
    }
    setWizErr({})
    if(wizStep<5) setWizStep(s=>s+1)
    else {
      const targets=[wizData.mt1,wizData.mt2].filter(Boolean)
      const np=wizData.srcLangs.flatMap(src=>targets.map(tgt=>({
        id:nid(),from:src,to:tgt,open:true,cert:!!wizData.certifiedPairs[`${src}|${tgt}`],
        specs:[...wizData.specs],
        services:wizData.services.map(sv=>({...sv,overrides:{},notOffered:{}}))
      })))
      setPairs(p=>[...p,...np]); setLangReady(true); setWizOpen(false)
    }
  }

  // ── pair drawer ──
  function pairNext() {
    if(pairStep===1){
      if(!pairData.from||!pairData.to){alert("Select both languages.");return}
      if(pairData.from===pairData.to){alert("Source and target must differ.");return}
      setPairStep(2)
    } else {
      const basesvcs=pairData.services.length?pairData.services:[{name:"Translation",rate:"0",speed:"0",...bu("Translation"),overrides:{},notOffered:{}}]
      const svcs=basesvcs.map(svc=>{
        const overrides={}
        usedSpecs.forEach(sp=>{
          const r=pairData.specRates?.[sp]?.[svc.name]
          if(r&&(r.rate||r.speed)) overrides[sp]={rate:r.rate||svc.rate,speed:r.speed||svc.speed}
        })
        return {...svc,overrides,notOffered:{}}
      })
      setPairs(p=>[...p,{id:nid(),from:pairData.from,to:pairData.to,open:true,cert:pairData.certified,specs:pairs.length?[...pairs[0].specs]:[],services:svcs}])
      setPairOpen(false)
    }
  }

  // ── spec drawer ──
  function confirmSpec() {
    if(!specData.sel){alert("Select a specialisation.");return}
    mp(ps=>ps.forEach(p=>{
      if(!p.specs.includes(specData.sel)){
        p.specs.push(specData.sel)
        p.services.forEach(svc=>{const ov=specData.rates[svc.name];if(ov&&(ov.rate!==svc.rate||ov.speed!==svc.speed))svc.overrides[specData.sel]={rate:ov.rate,speed:ov.speed}})
      }
    }))
    setSpecOpen(false)
  }

  // ── svc drawer ──
  function confirmSvc() {
    if(!svcData.sel){alert("Select a service.");return}
    const u=bu(svcData.sel)
    mp(ps=>ps.forEach(p=>{if(!p.services.find(s=>s.name===svcData.sel))p.services.push({name:svcData.sel,rate:svcData.rate||"0",speed:svcData.speed||"0",rl:u.rl,sl:u.sl,overrides:{},notOffered:{}})}))
    setSvcOpen(false)
  }

  // ── derived ──
  const usedSpecs  = pairs.length ? pairs[0].specs : []
  const availSpecs = PRESET_SPECS.filter(s=>!usedSpecs.includes(s))
  const uniqSvcs   = Object.values(pairs.reduce((a,p)=>{p.services.forEach(s=>{if(!a[s.name])a[s.name]=s});return a},{}))
  const usedSvcMap = pairs.reduce((a,p)=>{p.services.forEach(s=>a[s.name]=true);return a},{})
  const availSvcs  = PRESET_SVCS.filter(s=>!usedSvcMap[s])

  // ── top-level flow helpers ──
  const STEPS = [
    { id:"basic", label:"Basic info" },
    { id:"role",  label:"Role" },
    ...(role==="interpreter"||role==="both" ? [{id:"interpreter",label:"Interpreter"}] : []),
    ...(role==="translator"||role==="both"  ? [{id:"translator", label:"Translator" }] : []),
    { id:"review", label:"Review" },
  ]
  const curIdx = Math.max(0, STEPS.findIndex(s=>s.id===step))

  function goNext() {
    // per-step validation
    if(step==="basic"){
      if(!firstName||!lastName||!birthDate||!email||!password||!phone||!country||!address||!city||!taxId){
        alert("Please fill in all required fields."); return
      }
      if(password.length<6){ alert("Password must be at least 6 characters."); return }
      if(password!==passwordConfirm){ alert("Passwords do not match."); return }
    }
    if(step==="role" && !role){ alert("Please select translator, interpreter, or both."); return }
    if(step==="interpreter"){
      if(!interpModalities.length){ alert("Please select at least one order type."); return }
      if(!interpLangs.trim()){ alert("Please list the languages you can interpret."); return }
      if(!interpWorkload||!interpExp||!travelMode||!interpIndustries.trim()){
        alert("Please fill in all required interpreter fields."); return
      }
    }
    if(step==="translator"){
      if(!langReady||pairs.length===0){ alert("Please add your language information."); return }
      if(!catTools.length){ alert("Please select at least one CAT tool."); return }
      if(!workload||!yearsExp){ alert("Please fill in workload and years of experience."); return }
    }
    const i = STEPS.findIndex(s=>s.id===step)
    if(i<STEPS.length-1) { setStep(STEPS[i+1].id); window.scrollTo({top:0}) }
  }
  function goBack() {
    const i = STEPS.findIndex(s=>s.id===step)
    if(i>0) { setStep(STEPS[i-1].id); window.scrollTo({top:0}) }
  }
  function submit() {
    if(!consent){ alert("Please accept the data processing consent."); return }
    setSubmitted(true)
  }

  // ── Wizard step content ──
  function WizBody() {
    const errRates = wizErr.rates||[]
    if(wizStep===1) return (
      <div>
        {["individual","agency"].map(t=>(
          <div key={t} onClick={()=>setWizData(d=>({...d,type:t}))}
            style={{ padding:"14px 16px", border:`1px solid ${wizData.type===t?"#1a1a2e":"var(--color-border-secondary)"}`, borderRadius:8, cursor:"pointer", marginBottom:10, background:wizData.type===t?"var(--color-background-secondary)":"var(--color-background-primary)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:4 }}>
              <div style={{ width:16, height:16, borderRadius:8, border:`1.5px solid ${wizData.type===t?"#1a1a2e":"var(--color-border-secondary)"}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {wizData.type===t&&<div style={{ width:8, height:8, borderRadius:4, background:"#1a1a2e" }}/>}
              </div>
              <span style={{ fontSize:13.5, fontWeight:500 }}>{t==="individual"?"Individual translator":"Agency"}</span>
            </div>
            <p style={{ fontSize:12, color:"var(--color-text-secondary)", lineHeight:1.5, marginLeft:26 }}>
              {t==="individual"?"You translate personally. Target languages are your native tongue(s).":"You manage multiple translators. Pairs will be grouped by target language."}
            </p>
          </div>
        ))}
        {wizErr.t && <p style={{fontSize:11,color:"#dc2626",marginTop:4}}>{wizErr.t}</p>}
      </div>
    )
    if(wizStep===2) return (
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div>
          <p style={S.flbl}>Primary mother tongue</p>
          <LangSelect value={wizData.mt1} onChange={v=>setWizData(d=>({...d,mt1:v,mt2:d.mt2===v?"":d.mt2}))}/>
          {wizErr.mt1&&<p style={{fontSize:11,color:"#dc2626",marginTop:4}}>{wizErr.mt1}</p>}
        </div>
        <div>
          <p style={S.flbl}>Second mother tongue (optional)</p>
          <LangSelect value={wizData.mt2} onChange={v=>setWizData(d=>({...d,mt2:v}))} exclude={wizData.mt1?[wizData.mt1]:[]} placeholder="None"/>
        </div>
      </div>
    )
    if(wizStep===3) {
      const targets=[wizData.mt1,wizData.mt2].filter(Boolean)
      return (
        <div>
          <p style={S.flbl}>Add source languages</p>
          <p style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:10,lineHeight:1.5}}>Each selected language will be paired with: {targets.join(", ")}</p>
          <LangSelect value="" onChange={v=>{if(v&&!wizData.srcLangs.includes(v))setWizData(d=>({...d,srcLangs:[...d.srcLangs,v]}))}} exclude={targets}/>
          {wizData.srcLangs.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:10}}>{wizData.srcLangs.map(l=><span key={l} style={S.tagBlue}>{l}<button type="button" onClick={()=>setWizData(d=>({...d,srcLangs:d.srcLangs.filter(x=>x!==l)}))} style={{background:"none",border:"none",cursor:"pointer",color:"#93c5fd",fontSize:14,lineHeight:1,padding:0}}>×</button></span>)}</div>}
          {wizErr.src&&<p style={{fontSize:11,color:"#dc2626",marginTop:6}}>{wizErr.src}</p>}
          {wizData.srcLangs.length>0&&(
            <div style={{marginTop:18}}>
              <p style={{...S.flbl,marginBottom:8}}>Pairs that will be created</p>
              {wizData.srcLangs.flatMap(src=>targets.map(tgt=>{
                const key=`${src}|${tgt}`
                const certified=!!wizData.certifiedPairs[key]
                return (
                  <div key={key} style={{...S.pairRow,justifyContent:"space-between"}}>
                    <span style={{fontWeight:500}}>{src}</span>
                    <span style={{color:"var(--color-text-tertiary)",fontSize:12}}>→</span>
                    <span style={{color:"var(--color-text-secondary)",flex:1,marginLeft:8}}>{tgt}</span>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}} onClick={e=>e.stopPropagation()}>
                      <Checkbox checked={certified} onCheckedChange={v=>setWizData(d=>({...d,certifiedPairs:{...d.certifiedPairs,[key]:!!v}}))}/>
                      <span style={{fontSize:11,color:certified?"#1a6b3a":"var(--color-text-tertiary)",fontWeight:certified?500:400}}>{certified?"★ Certified":"Certified?"}</span>
                    </div>
                  </div>
                )
              }))}
            </div>
          )}
        </div>
      )
    }
    if(wizStep===4) return (
      <div>
        <p style={S.flbl}>Select specialisations (optional)</p>
        <p style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:12,lineHeight:1.5}}>These will appear as rows in your language pair table.</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {PRESET_SPECS.map(sp=><Chip key={sp} label={sp} selected={wizData.specs.includes(sp)} onClick={()=>setWizData(d=>({...d,specs:d.specs.includes(sp)?d.specs.filter(s=>s!==sp):[...d.specs,sp]}))}/>)}
        </div>
      </div>
    )
    if(wizStep===5) return (
      <div>
        <div style={{display:"flex",gap:10,background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:6,padding:"10px 12px",marginBottom:16,fontSize:12,color:"#1e40af",lineHeight:1.55}}>
          <Info/><span><strong>Important:</strong> Translation is billed per <em>line</em>. Journalistic editor, Proofreading and Lectorate are billed per <em>minute</em>.</span>
        </div>
        <p style={S.flbl}>Select services</p>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:4}}>
          {PRESET_SVCS.map(sv=><Chip key={sv} label={sv} selected={wizData.services.some(s=>s.name===sv)}
            onClick={()=>{setWizData(d=>{const has=d.services.some(s=>s.name===sv);return{...d,services:has?d.services.filter(s=>s.name!==sv):[...d.services,{name:sv,rate:"",speed:"",...bu(sv)}]}});setWizErr(e=>({...e,svc:undefined,rates:undefined}))}}/>)}
        </div>
        {wizErr.svc&&<p style={{fontSize:11,color:"#dc2626",marginBottom:8}}>{wizErr.svc}</p>}
        {wizData.services.length>0&&(
          <div style={{marginTop:16}}>
            <Separator style={{marginBottom:16}}/>
            <p style={S.flbl}>Set default rates & speeds</p>
            {wizData.services.map(svc=>(
              <div key={svc.name} style={{marginBottom:14}}>
                <p style={{fontSize:13,fontWeight:500,marginBottom:6}}>{svc.name}</p>
                <div style={{display:"flex",gap:8}}>
                  <DrawerUnit value={svc.rate} onChange={v=>{setWizData(d=>({...d,services:d.services.map(s=>s.name===svc.name?{...s,rate:v}:s)}));setWizErr(e=>({...e,rates:(e.rates||[]).filter(n=>n!==svc.name||!v)}))}} placeholder="0.00" unit={svc.rl||svc.rateLabel} step="0.01"/>
                  <DrawerUnit value={svc.speed} onChange={v=>{setWizData(d=>({...d,services:d.services.map(s=>s.name===svc.name?{...s,speed:v}:s)}));setWizErr(e=>({...e,rates:(e.rates||[]).filter(n=>n!==svc.name||!v)}))}} placeholder="0" unit={svc.sl||svc.speedLabel} step="10"/>
                </div>
                {errRates.includes(svc.name)&&<p style={{fontSize:11,color:"#dc2626",marginTop:4}}>Please fill out these fields</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    )
    return null
  }

  // ── Pair table ──
  function PairTable({ pair }) {
    return (
      <div style={{borderTop:"1px solid var(--color-border-tertiary)",overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
          <thead>
            <tr>
              <th style={{padding:"11px 14px",background:"var(--color-background-primary)",borderBottom:"1px solid var(--color-border-tertiary)",borderRight:"1px solid var(--color-border-tertiary)",textAlign:"left",fontSize:11.5,color:"var(--color-text-tertiary)",fontWeight:400,verticalAlign:"middle",width:160,minWidth:160}}>Specialisation</th>
              {pair.services.map((svc,si)=>{
                const isHov = hovCol && hovCol.pid===pair.id && hovCol.svc===svc.name
                return (
                  <th key={svc.name}
                    onMouseEnter={()=>setHovCol({pid:pair.id,svc:svc.name})}
                    onMouseLeave={()=>setHovCol(null)}
                    style={{padding:"11px 14px",background:"var(--color-background-primary)",borderBottom:"1px solid var(--color-border-tertiary)",borderRight:si===pair.services.length-1?"none":"1px solid var(--color-border-tertiary)",textAlign:"left",verticalAlign:"top",whiteSpace:"nowrap"}}>
                    <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:6}}>
                      <div>
                        <p style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)",marginBottom:6}}>{svc.name}</p>
                        <div style={{display:"flex",gap:5,alignItems:"center"}}>
                          <UnitInput value={svc.rate} onChange={v=>setBase(pair.id,svc.name,"rate",v)} placeholder="0.00" unit={svc.rl||svc.rateLabel} step="0.01"/>
                          <UnitInput value={svc.speed} onChange={v=>setBase(pair.id,svc.name,"speed",v)} placeholder="0" unit={svc.sl||svc.speedLabel} step="10"/>
                        </div>
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" onClick={()=>delSvc(pair.id,svc.name)}
                            className={cn("w-[18px] h-[18px] border-none bg-none cursor-pointer flex items-center justify-center rounded-sm flex-shrink-0 transition-all",
                              isHov ? "text-red-600 bg-red-50" : "text-gray-400 hover:text-red-600 hover:bg-red-50")}>
                            <Trash s={11}/>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Remove "{svc.name}" from this pair</TooltipContent>
                      </Tooltip>
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {pair.specs.map((spec,spi)=>{
              const isHovR = hovRow && hovRow.pid===pair.id && hovRow.spec===spec
              return (
                <tr key={spec}>
                  <td onMouseEnter={()=>setHovRow({pid:pair.id,spec})} onMouseLeave={()=>setHovRow(null)}
                    style={{padding:14,borderBottom:spi===pair.specs.length-1?"none":"1px solid var(--color-border-tertiary)",borderRight:"1px solid var(--color-border-tertiary)",verticalAlign:"middle",width:160,minWidth:160}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
                      <span style={{fontSize:13,fontWeight:500,color:"var(--color-text-primary)"}}>{spec}</span>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button type="button" onClick={()=>delSpec(pair.id,spec)}
                            className={cn("w-[18px] h-[18px] border-none bg-none cursor-pointer flex items-center justify-center rounded-sm flex-shrink-0 transition-all",
                              isHovR ? "text-red-600 bg-red-50" : "text-gray-400 hover:text-red-600 hover:bg-red-50")}>
                            <Trash s={11}/>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>Remove "{spec}" from this pair</TooltipContent>
                      </Tooltip>
                    </div>
                  </td>
                  {pair.services.map((svc,si)=>{
                    const ov=svc.overrides[spec]||{}
                    const isOvR=ov.rate!==undefined, isOvS=ov.speed!==undefined, hasOv=isOvR||isOvS
                    const notOff=svc.notOffered[spec]
                    const ck=`${pair.id}|${svc.name}|${spec}`
                    const isHovC = hovCell && hovCell.k===ck
                    return (
                      <td key={svc.name}
                        onMouseEnter={()=>setHovCell({k:ck})}
                        onMouseLeave={()=>setHovCell(null)}
                        style={{padding:14,borderBottom:spi===pair.specs.length-1?"none":"1px solid var(--color-border-tertiary)",borderRight:si===pair.services.length-1?"none":"1px solid var(--color-border-tertiary)",verticalAlign:notOff?"middle":"top",position:"relative",minWidth:140}}>
                        {notOff ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" onClick={()=>setNO(pair.id,svc.name,spec,false)}
                                className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-sm border-none bg-none cursor-pointer flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                <Restore s={12}/>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>Restore this service for "{spec}"</TooltipContent>
                          </Tooltip>
                        ) : (
                          <div style={{display:"flex",flexDirection:"column",gap:5}}>
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <span style={{fontSize:10.5,color:"var(--color-text-tertiary)",width:26,flexShrink:0}}>rate</span>
                              <UnitInput value={isOvR?ov.rate:svc.rate} onChange={v=>setOv(pair.id,svc.name,spec,"rate",v)} placeholder="0.00" unit={svc.rl||svc.rateLabel} step="0.01" ov={isOvR}/>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:5}}>
                              <span style={{fontSize:10.5,color:"var(--color-text-tertiary)",width:26,flexShrink:0}}>spd</span>
                              <UnitInput value={isOvS?ov.speed:svc.speed} onChange={v=>setOv(pair.id,svc.name,spec,"speed",v)} placeholder="0" unit={svc.sl||svc.speedLabel} step="10" ov={isOvS}/>
                            </div>
                            <div className="flex gap-2 mt-0.5">
                              {hasOv && (
                                <button type="button" onClick={()=>resetOv(pair.id,svc.name,spec)}
                                  className="text-[10px] text-blue-500 hover:text-blue-700 bg-transparent border-none cursor-pointer p-0 font-medium transition-colors">
                                  ↺ Reset
                                </button>
                              )}
                              <button type="button" onClick={()=>setNO(pair.id,svc.name,spec,true)}
                                className="text-[10px] text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer p-0 transition-colors">
                                Not offered
                              </button>
                            </div>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  function PairCard({ pair }) {
    return (
      <div style={{background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:8,marginBottom:10,overflow:"hidden"}}>
        <div onClick={()=>toggleP(pair.id)} style={{display:"flex",alignItems:"center",padding:"12px 16px",gap:10,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,flex:1,flexWrap:"wrap"}}>
            <span style={{fontSize:14,fontWeight:500}}>{pair.from}</span>
            <span style={{color:"var(--color-text-tertiary)",fontSize:12}}>→</span>
            <span style={{fontSize:14,fontWeight:500}}>{pair.to}</span>
            <div onClick={e=>e.stopPropagation()} style={{display:"inline-flex",alignItems:"center",gap:6,marginLeft:4}}>
              <Checkbox id={`cert-${pair.id}`} checked={!!pair.cert} onCheckedChange={()=>toggleCert(pair.id)}/>
              <label htmlFor={`cert-${pair.id}`} style={{fontSize:11,color:pair.cert?"#1a6b3a":"var(--color-text-tertiary)",cursor:"pointer",fontWeight:pair.cert?500:400}}>
                {pair.cert?"★ Certified":"Certified?"}
              </label>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:"auto",flexShrink:0}}>
            <Badge variant="secondary" style={{fontSize:11}}>{pair.services.length} service{pair.services.length!==1?"s":""}</Badge>
            <Badge variant="secondary" style={{fontSize:11}}>{pair.specs.length} spec{pair.specs.length!==1?"s":""}</Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <span style={{fontSize:10,color:"var(--color-text-tertiary)",transform:pair.open?"rotate(180deg)":"none",transition:"transform 0.18s",display:"block",cursor:"pointer"}}>▾</span>
              </TooltipTrigger>
              <TooltipContent>{pair.open ? "Collapse" : "Expand to edit rates"}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" onClick={e=>{e.stopPropagation();delPair(pair.id)}}
                  className="w-[22px] h-[22px] rounded border-none bg-none cursor-pointer flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                  <Trash s={12}/>
                </button>
              </TooltipTrigger>
              <TooltipContent>Delete this language pair</TooltipContent>
            </Tooltip>
          </div>
        </div>
        {pair.open && PairTable({pair})}
      </div>
    )
  }

  // ── Submitted screen ──
  if (submitted) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f0f2f5] font-sans">
        <Card className="max-w-md text-center shadow-xl">
          <CardContent className="p-12">
            <div className="mx-auto w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center mb-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <CardTitle className="text-xl font-medium mb-2">Application submitted</CardTitle>
            <CardDescription className="leading-relaxed">
              Thank you, {firstName || "applicant"}. We've received your {role==="both"?"translator & interpreter":role} application and will be in touch shortly.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <TooltipProvider delayDuration={200}>
    <div style={{position:"relative",height:"100vh",overflow:"hidden",background:"#f0f2f5",fontFamily:"-apple-system,'Helvetica Neue',sans-serif"}}>
      <div style={{height:"100%",overflowY:"auto"}}>

        {/* Navbar */}
        <nav className="bg-white border-b border-gray-100 px-3 md:px-6 h-12 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="bg-[#1a1a2e] text-white font-extrabold text-[15px] px-[7px] py-[3px] rounded tracking-tight">
              <span className="text-[#e63946]">24</span>
            </div>
            <span className="text-sm text-gray-500 font-medium tracking-wider">translate</span>
          </div>
          <div className="hidden lg:flex gap-5 items-center">
            {["Candidates","Pending Actions","Statistics","Blocked Applications","Settings","Reasons for Rejection"].map(l=>(
              <span key={l} className="text-[13px] text-gray-500 cursor-pointer whitespace-nowrap">{l}</span>
            ))}
          </div>
          <span className="text-[13px] text-gray-500 font-medium cursor-pointer">Taha Tariq ▾</span>
        </nav>

        {/* Title + Progress header */}
        <div className="max-w-[760px] mx-auto px-4 pt-6 md:pt-9">
          <h1 className="text-center text-xl md:text-[26px] font-normal text-gray-900 mb-5 md:mb-6">Application form</h1>

          {/* Mobile stepper */}
          <div className="md:hidden mb-6">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-medium text-gray-900">Step {curIdx+1} of {STEPS.length}</span>
              <span className="text-gray-500">{STEPS[curIdx].label}</span>
            </div>
            <Progress value={((curIdx+1)/STEPS.length)*100}/>
          </div>

          {/* Desktop stepper */}
          <div className="hidden md:flex items-center gap-1.5 mb-8 px-2">
            {STEPS.map((s,i)=>(
              <React.Fragment key={s.id}>
                <div className="flex items-center gap-[7px] flex-shrink-0">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center text-[11px] font-semibold",
                    i===curIdx ? "border-[#1a1a2e] bg-[#1a1a2e] text-white" :
                    i<curIdx   ? "border-[#1a6b3a] bg-[#1a6b3a] text-white" :
                                 "border-gray-200 text-gray-400"
                  )}>
                    {i<curIdx ? "✓" : i+1}
                  </div>
                  <span className={cn(
                    "text-xs",
                    i===curIdx ? "text-gray-900 font-medium" : "text-gray-400"
                  )}>{s.label}</span>
                </div>
                {i<STEPS.length-1 && <div className={cn("flex-1 h-px transition-colors", i<curIdx ? "bg-[#1a6b3a]" : "bg-gray-100")}/>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── STEP 1: BASIC INFO ── */}
        {step==="basic" && (
          <div style={{maxWidth:760,margin:"0 auto",padding:"0 16px"}}>
            <SecLabel>Personal Information</SecLabel>
            <FormRow label="First name" required><Input value={firstName} onChange={e=>setFirstName(e.target.value)}/></FormRow>
            <FormRow label="Last name" required><Input value={lastName} onChange={e=>setLastName(e.target.value)}/></FormRow>
            <FormRow label="Birth date" required><Input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)}/></FormRow>
            <FormRow label="Gender" top hint="If the customer requires a specific gender.">
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>{["Masculine","Feminine","Diverse","Prefer not to say"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </FormRow>

            <SecLabel>Contact &amp; Account</SecLabel>
            <FormRow label="E-mail" required><Input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></FormRow>
            <FormRow label="Password" required top hint="Enter the password you wish to use to access our platforms."><Input type="password" value={password} onChange={e=>setPassword(e.target.value)}/></FormRow>
            <FormRow label="Confirm password" required><Input type="password" value={passwordConfirm} onChange={e=>setPasswordConfirm(e.target.value)}/></FormRow>
            <FormRow label="Mobile number" required top hint="Enter your mobile number including country code.">
              <div style={{display:"flex"}}>
                <Select value={cc} onValueChange={setCc}>
                  <SelectTrigger style={{width:110,borderRadius:"6px 0 0 6px",borderRight:"none",background:"var(--color-background-secondary)",flexShrink:0}}><SelectValue/></SelectTrigger>
                  <SelectContent>{CC_LIST.map(([code,flag])=><SelectItem key={code} value={code}>{flag} {code}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="tel" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone number" style={{borderRadius:"0 6px 6px 0"}}/>
              </div>
            </FormRow>

            <SecLabel>Address</SecLabel>
            <FormRow label="Country of origin" required><Input value={country} onChange={e=>setCountry(e.target.value)}/></FormRow>
            <FormRow label="Address" required><Input value={address} onChange={e=>setAddress(e.target.value)} placeholder="Street name and house number"/></FormRow>
            <FormRow label="City" required><Input value={city} onChange={e=>setCity(e.target.value)}/></FormRow>
            <FormRow label="Postal code"><Input value={postal} onChange={e=>setPostal(e.target.value)}/></FormRow>

            <SecLabel>Tax &amp; Financial</SecLabel>
            <FormRow label="Tax ID number" required><Input value={taxId} onChange={e=>setTaxId(e.target.value)}/></FormRow>
            <FormRow label="Are you subject to VAT in Germany?" top>
              <RadioGroup value={vatSub?"yes":"no"} onValueChange={v=>setVatSub(v==="yes")} style={{display:"flex",gap:24,paddingTop:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}><RadioGroupItem value="yes" id="vy"/><Label htmlFor="vy">Yes</Label></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}><RadioGroupItem value="no" id="vn"/><Label htmlFor="vn">No</Label></div>
              </RadioGroup>
            </FormRow>
            {vatSub&&<FormRow label="VAT number"><Input value={vatNum} onChange={e=>setVatNum(e.target.value)} placeholder="Enter your VAT number"/></FormRow>}

            <SecLabel>Source</SecLabel>
            <FormRow label="How did you find our ad?">
              <Select value={foundUs} onValueChange={setFoundUs}>
                <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>{["LinkedIn","Indeed","Google","Referral","Other"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </FormRow>
          </div>
        )}

        {/* ── STEP 2: ROLE SELECT ── */}
        {step==="role" && (
          <div style={{maxWidth:760,margin:"0 auto",padding:"0 16px"}}>
            <p style={{textAlign:"center",fontSize:14,color:"var(--color-text-secondary)",marginBottom:28,lineHeight:1.6}}>
              Choose the role you're applying for. You can apply for both if you offer translation and interpretation services.
            </p>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              {[
                {id:"translator",  title:"Translator",              desc:"You translate written content between languages — documents, websites, articles, legal texts, etc."},
                {id:"interpreter", title:"Interpreter",              desc:"You interpret spoken language in real-time — phone calls, on-site meetings, or video sessions."},
                {id:"both",        title:"Both — translator & interpreter", desc:"You offer both written translation and live interpretation services."},
              ].map(r=>(
                <Card key={r.id} onClick={()=>setRole(r.id)}
                  className={cn("cursor-pointer transition-all", role===r.id ? "border-gray-900 border-[1.5px] bg-gray-50" : "hover:border-gray-300")}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3.5">
                      <div className={cn("w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5", role===r.id ? "border-gray-900" : "border-gray-200")}>
                        {role===r.id && <div className="w-2 h-2 rounded-full bg-gray-900"/>}
                      </div>
                      <div>
                        <CardTitle className="text-[15px] font-medium mb-1 text-gray-950">{r.title}</CardTitle>
                        <CardDescription className="text-[12.5px] leading-relaxed">{r.desc}</CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: INTERPRETER ── */}
        {step==="interpreter" && (
          <div style={{maxWidth:760,margin:"0 auto",padding:"0 16px"}}>
            <SecLabel>Interpreting preferences</SecLabel>
            <FormRow label="Which orders would you like to accept?" required top>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {INTERP_MODALITIES.map(m=>(
                  <Chip key={m} label={m} selected={interpModalities.includes(m)} onClick={()=>setInterpModalities(p=>p.includes(m)?p.filter(x=>x!==m):[...p,m])}/>
                ))}
              </div>
            </FormRow>
            <FormRow label="What type of interpreting services do you offer?" top>
              <Input value={interpSvcs} onChange={e=>setInterpSvcs(e.target.value)} placeholder="e.g. simultaneous, consecutive, sworn, liaison..."/>
            </FormRow>
            <FormRow label="Additional qualification" top>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Checkbox id="bdu" checked={interpBdu} onCheckedChange={setInterpBdu}/>
                  <Label htmlFor="bdu" style={{fontSize:13.5,cursor:"pointer",fontWeight:400}}>BDÜ</Label>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Checkbox id="bduo" checked={interpBduOther} onCheckedChange={v=>{setInterpBduOther(v);if(!v)setInterpBduOtherText("")}}/>
                  <Label htmlFor="bduo" style={{fontSize:13.5,cursor:"pointer",fontWeight:400}}>Other</Label>
                </div>
                {interpBduOther && <Input value={interpBduOtherText} onChange={e=>setInterpBduOtherText(e.target.value)} placeholder="Please specify" style={{marginTop:2}}/>}
              </div>
            </FormRow>

            <SecLabel>Languages</SecLabel>
            <FormRow label="Which languages can you interpret between German and other languages?" required top>
              <Input value={interpLangs} onChange={e=>setInterpLangs(e.target.value)} placeholder="e.g. English, French, Arabic..."/>
            </FormRow>

            <SecLabel>Experience</SecLabel>
            <FormRow label="How much do you work/intend to work as an interpreter?" required top>
              <Select value={interpWorkload} onValueChange={setInterpWorkload}>
                <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>{INTERP_WORKLOAD.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </FormRow>
            <FormRow label="How much experience do you have as an interpreter?" required top>
              <Select value={interpExp} onValueChange={setInterpExp}>
                <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>{INTERP_EXP.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Level of German language proficiency" top hint="Please indicate your German language level.">
              <Select value={germanLevel} onValueChange={setGermanLevel}>
                <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>{GERMAN_LEVELS.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </FormRow>
            <FormRow label="Are you traveling by public transport or by car?" required top>
              <Select value={travelMode} onValueChange={setTravelMode}>
                <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                <SelectContent>{TRAVEL_MODES.map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
            </FormRow>
            <FormRow label="In which industry(s) do you have experience or would you like to work?" required top>
              <Input value={interpIndustries} onChange={e=>setInterpIndustries(e.target.value)} placeholder="e.g. healthcare, legal, finance..."/>
            </FormRow>
          </div>
        )}

        {/* ── STEP 4: TRANSLATOR ── */}
        {step==="translator" && (
          <>
            <div style={{maxWidth:760,margin:"0 auto",padding:"0 16px"}}>
              <SecLabel>Languages &amp; Services</SecLabel>
              <FormRow label="Language information" required top>
                {!langReady ? (
                  <div style={{background:"var(--color-background-primary)",border:"1px solid var(--color-border-tertiary)",borderRadius:8,overflow:"hidden"}}>
                    {[["Mother tongue & source languages","— define which languages you translate from and into."],["Specialisations","— areas like Commercial law or Medical that apply across all your pairs."],["Services","— Translation, Journalistic editor, Proofreading and Lectorate, each with its own billing unit."],["Default rates & speeds","— your baseline pricing per service, overridable per specialisation later."]].map(([b,r],i,arr)=>(
                      <div key={b} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 16px",borderBottom:i<arr.length-1?"1px solid var(--color-border-tertiary)":"none",fontSize:12.5,color:"var(--color-text-secondary)",lineHeight:1.5}}>
                        <div style={{width:20,height:20,borderRadius:10,border:"1px solid var(--color-border-tertiary)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:"var(--color-text-tertiary)",flexShrink:0,marginTop:1}}>{i+1}</div>
                        <div><strong style={{fontWeight:500,color:"var(--color-text-primary)"}}>{b}</strong> {r}</div>
                      </div>
                    ))}
                    <div style={{padding:"12px 16px 14px"}}>
                      <Button onClick={()=>{setWizData({type:"",mt1:"",mt2:"",srcLangs:[],specs:[],services:[],certifiedPairs:{}});setWizStep(1);setWizErr({});setWizOpen(true)}}
                        style={{width:"100%",background:"#1a1a2e",color:"white",justifyContent:"center",display:"flex",alignItems:"center",gap:6}}>
                        <Plus s={12}/> Add language information
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <Button onClick={()=>{setPairData({from:"",to:"",services:[],certified:false,specRates:{}});setPairStep(1);setPairOpen(true)}} style={{background:"#1a1a2e",color:"white",display:"flex",alignItems:"center",gap:5}} size="sm"><Plus s={11}/> Add language pair</Button>
                    <Button onClick={()=>{const rates={};uniqSvcs.forEach(s=>{rates[s.name]={rate:s.rate,speed:s.speed}});setSpecData({sel:"",rates});setSpecOpen(true)}} variant="outline" size="sm" style={{display:"flex",alignItems:"center",gap:5}}><Plus s={11}/> Add specialisation</Button>
                    <Button onClick={()=>{setSvcData({sel:"",rate:"",speed:""});setSvcOpen(true)}} variant="outline" size="sm" style={{display:"flex",alignItems:"center",gap:5}}><Plus s={11}/> Add service</Button>
                  </div>
                )}
              </FormRow>
            </div>

            {langReady && pairs.length>0 && (
              <div className="w-full md:max-w-[70vw] mx-auto px-4 md:px-6 pt-1 pb-4">
                {pairsBannerShown && (
                  <div className="mb-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 flex items-start gap-3">
                    <div className="flex-shrink-0 text-blue-600 mt-0.5">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3"/><path d="M8 7.5v4M8 5v-.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
                    </div>
                    <div className="flex-1 text-[12.5px] leading-relaxed text-blue-900">
                      <p className="font-semibold mb-1">How this works</p>
                      <ul className="space-y-0.5 text-blue-800/90">
                        <li>• <strong>Click a pair</strong> to expand its rate table</li>
                        <li>• <strong>Edit any rate or speed</strong> directly in the cells — changes save automatically</li>
                        <li>• <strong>Hover a cell</strong> to mark it as "Not offered" or reset an override</li>
                        <li>• Use the <strong>trash icons</strong> to remove pairs, services, or specialisations</li>
                      </ul>
                    </div>
                    <button type="button" onClick={dismissPairsBanner} aria-label="Dismiss" className="flex-shrink-0 text-blue-400 hover:text-blue-700 transition-colors w-6 h-6 flex items-center justify-center rounded hover:bg-blue-100">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                )}
                {pairs.map(p=><React.Fragment key={p.id}>{PairCard({pair:p})}</React.Fragment>)}
              </div>
            )}

            <div style={{maxWidth:760,margin:"0 auto",padding:"0 16px"}}>
              <FormRow label="CAT tool(s)" top labelPaddingTop={0} hint="At least one CAT tool is required for translation services.">
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {["SDL Trados Studio","memoQ","Wordfast","Other"].map(t=>(
                    <div key={t} style={{display:"flex",alignItems:"center",gap:8}}>
                      <Checkbox id={`c-${t}`} checked={catTools.includes(t)} onCheckedChange={v=>{setCatTools(p=>v?[...p,t]:p.filter(x=>x!==t));if(t==="Other"&&!v)setCatOther("")}}/>
                      <Label htmlFor={`c-${t}`} style={{fontSize:13.5,cursor:"pointer",fontWeight:400}}>{t}</Label>
                    </div>
                  ))}
                  {catTools.includes("Other")&&<Input value={catOther} onChange={e=>setCatOther(e.target.value)} placeholder="Please specify your CAT tool" style={{marginTop:4}}/>}
                </div>
              </FormRow>

              <SecLabel>Experience</SecLabel>
              <FormRow label="Workload preference / Availability" required>
                <Select value={workload} onValueChange={setWorkload}>
                  <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                  <SelectContent>{["Full-time (40+ hrs/week)","Part-time (20–40 hrs/week)","Occasional (under 20 hrs/week)","Project-based"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </FormRow>
              <FormRow label="Years of translation experience" required>
                <Select value={yearsExp} onValueChange={setYearsExp}>
                  <SelectTrigger><SelectValue placeholder="Select"/></SelectTrigger>
                  <SelectContent>{["Under 1 year","1–3 years","3–5 years","5–10 years","Over 10 years"].map(o=><SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
                </Select>
              </FormRow>
              <FormRow label="Specialist industry experience" top>
                <Popover open={indOpen} onOpenChange={setIndOpen}>
                  <PopoverTrigger asChild>
                    <div style={{border:"1px solid var(--color-border-secondary)",borderRadius:6,minHeight:36,padding:"3px 10px",display:"flex",alignItems:"center",gap:5,cursor:"pointer",background:"var(--color-background-primary)",flexWrap:"wrap",fontSize:13.5}}>
                      {industries.length===0&&<span style={{color:"var(--color-text-tertiary)"}}>Select industries</span>}
                      {industries.map(ind=><span key={ind} style={{...S.tagBlue,fontSize:12}}>{ind}<button type="button" onClick={e=>{e.stopPropagation();setInds(p=>p.filter(i=>i!==ind))}} style={{background:"none",border:"none",cursor:"pointer",color:"#93c5fd",fontSize:13,lineHeight:1,padding:0}}>×</button></span>)}
                      <span style={{marginLeft:"auto",fontSize:10,color:"var(--color-text-tertiary)"}}>▾</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent style={{width:280,padding:0}}>
                    <Command>
                      <CommandInput placeholder="Search industries..."/>
                      <CommandList>
                        <CommandEmpty>No industries found.</CommandEmpty>
                        <CommandGroup>
                          {INDUSTRIES.map(ind=>(
                            <CommandItem key={ind} value={ind} onSelect={()=>setInds(p=>p.includes(ind)?p.filter(i=>i!==ind):[...p,ind])}>
                              <div style={{width:14,height:14,borderRadius:2,border:`1px solid ${industries.includes(ind)?"#1a1a2e":"var(--color-border-secondary)"}`,background:industries.includes(ind)?"#1a1a2e":"transparent",display:"flex",alignItems:"center",justifyContent:"center",marginRight:8,flexShrink:0}}>
                                {industries.includes(ind)&&<svg width="8" height="6" viewBox="0 0 8 6" fill="none"><path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.3" strokeLinecap="round"/></svg>}
                              </div>
                              {ind}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormRow>
            </div>
          </>
        )}

        {/* ── STEP 5: REVIEW ── */}
        {step==="review" && (
          <div style={{maxWidth:760,margin:"0 auto",padding:"0 16px"}}>
            <p style={{textAlign:"center",fontSize:14,color:"var(--color-text-secondary)",marginBottom:28,lineHeight:1.6}}>
              Please review your application below. You can go back to any step to make changes.
            </p>

            {/* Basic */}
            <Card className="mb-3.5">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 p-5">
                <CardTitle className="text-[13px]">Basic information</CardTitle>
                <button type="button" onClick={()=>setStep("basic")} className="text-xs text-blue-500 font-medium hover:underline">Edit</button>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <dl className="grid grid-cols-[110px_1fr] sm:grid-cols-[160px_1fr] gap-x-3 sm:gap-x-4 gap-y-2 text-[12.5px]">
                  <dt className="text-gray-400">Name</dt><dd>{firstName} {lastName}</dd>
                  <dt className="text-gray-400">Birth date</dt><dd>{birthDate||"—"}</dd>
                  <dt className="text-gray-400">Gender</dt><dd>{gender||"—"}</dd>
                  <dt className="text-gray-400">E-mail</dt><dd>{email}</dd>
                  <dt className="text-gray-400">Mobile</dt><dd>{cc} {phone}</dd>
                  <dt className="text-gray-400">Address</dt><dd>{address}, {postal} {city}, {country}</dd>
                  <dt className="text-gray-400">Tax ID</dt><dd>{taxId}</dd>
                  <dt className="text-gray-400">VAT in Germany</dt><dd>{vatSub?`Yes${vatNum?` (${vatNum})`:""}`:"No"}</dd>
                  <dt className="text-gray-400">Found via</dt><dd>{foundUs||"—"}</dd>
                </dl>
              </CardContent>
            </Card>

            {/* Role */}
            <Card className="mb-3.5">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 p-5">
                <CardTitle className="text-[13px]">Role</CardTitle>
                <button type="button" onClick={()=>setStep("role")} className="text-xs text-blue-500 font-medium hover:underline">Edit</button>
              </CardHeader>
              <CardContent className="p-5 pt-0">
                <p className="text-[13px] capitalize m-0">{role==="both"?"Translator & Interpreter":role}</p>
              </CardContent>
            </Card>

            {/* Interpreter */}
            {(role==="interpreter"||role==="both") && (
              <Card className="mb-3.5">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 p-5">
                  <CardTitle className="text-[13px]">Interpreter details</CardTitle>
                  <button type="button" onClick={()=>setStep("interpreter")} className="text-xs text-blue-500 font-medium hover:underline">Edit</button>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <dl className="grid grid-cols-[110px_1fr] sm:grid-cols-[200px_1fr] gap-x-3 sm:gap-x-4 gap-y-2 text-[12.5px]">
                    <dt className="text-gray-400">Order types</dt><dd>{interpModalities.join(", ")||"—"}</dd>
                    <dt className="text-gray-400">Services offered</dt><dd>{interpSvcs||"—"}</dd>
                    <dt className="text-gray-400">Qualifications</dt><dd>{[interpBdu&&"BDÜ",interpBduOther&&(interpBduOtherText||"Other")].filter(Boolean).join(", ")||"—"}</dd>
                    <dt className="text-gray-400">Languages</dt><dd>{interpLangs}</dd>
                    <dt className="text-gray-400">Workload</dt><dd>{interpWorkload}</dd>
                    <dt className="text-gray-400">Experience</dt><dd>{interpExp}</dd>
                    <dt className="text-gray-400">German level</dt><dd>{germanLevel||"—"}</dd>
                    <dt className="text-gray-400">Travel mode</dt><dd>{travelMode}</dd>
                    <dt className="text-gray-400">Industries</dt><dd>{interpIndustries}</dd>
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Translator */}
            {(role==="translator"||role==="both") && (
              <Card className="mb-3.5">
                <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 p-5">
                  <CardTitle className="text-[13px]">Translator details</CardTitle>
                  <button type="button" onClick={()=>setStep("translator")} className="text-xs text-blue-500 font-medium hover:underline">Edit</button>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <dl className="grid grid-cols-[110px_1fr] sm:grid-cols-[200px_1fr] gap-x-3 sm:gap-x-4 gap-y-2 text-[12.5px]">
                    <dt className="text-gray-400">Language pairs</dt>
                    <dd>{pairs.length ? pairs.map(p=>`${p.from} → ${p.to}${p.cert?" ★":""}`).join(" · ") : "—"}</dd>
                    <dt className="text-gray-400">Specialisations</dt><dd>{usedSpecs.join(", ")||"—"}</dd>
                    <dt className="text-gray-400">Services</dt><dd>{uniqSvcs.map(s=>s.name).join(", ")||"—"}</dd>
                    <dt className="text-gray-400">CAT tools</dt><dd>{catTools.map(t=>t==="Other"&&catOther?`Other (${catOther})`:t).join(", ")||"—"}</dd>
                    <dt className="text-gray-400">Workload</dt><dd>{workload}</dd>
                    <dt className="text-gray-400">Years experience</dt><dd>{yearsExp}</dd>
                    <dt className="text-gray-400">Industries</dt><dd>{industries.join(", ")||"—"}</dd>
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Consent */}
            <div style={{display:"flex",alignItems:"flex-start",gap:10,marginTop:20,marginBottom:8}}>
              <Checkbox id="con" checked={consent} onCheckedChange={setConsent} style={{marginTop:2,flexShrink:0}}/>
              <Label htmlFor="con" style={{fontSize:12.5,color:"var(--color-text-secondary)",lineHeight:1.5,cursor:"pointer"}}>
                By submitting your application, you agree that 24translate has the right to store and process your personal data for up to 3 years. Rejected applications will be deleted after 1 year at the latest, and approved applications will be handled according to a separate agreement.
              </Label>
            </div>
          </div>
        )}

        {/* ── Nav footer ── */}
        <div style={{maxWidth:760,margin:"0 auto",padding:"32px 16px 48px",display:"flex",gap:12,justifyContent:"space-between",alignItems:"center"}}>
          <Button variant="outline" onClick={goBack} disabled={curIdx===0} style={{opacity:curIdx===0?0.4:1}}>← Back</Button>
          {step!=="review" ? (
            <Button onClick={goNext} style={{background:"#1a1a2e",color:"white",padding:"10px 36px",fontSize:14}}>Continue →</Button>
          ) : (
            <Button onClick={submit} disabled={!consent} style={{background:"#1a1a2e",color:"white",padding:"10px 44px",fontSize:15,opacity:consent?1:0.5}}>Apply</Button>
          )}
        </div>
      </div>

      {/* ── WIZARD DRAWER ── */}
      <FormSheet open={wizOpen} onOpenChange={setWizOpen} title={WIZ_META[wizStep-1].title} sub={WIZ_META[wizStep-1].sub} progress={(wizStep/5)*100}
        footer={<>
          {wizStep>1&&<Button variant="outline" onClick={()=>{setWizStep(s=>s-1);setWizErr({})}}>Back</Button>}
          <Button variant="outline" onClick={()=>setWizOpen(false)}>Cancel</Button>
          <Button onClick={wizNext} style={{flex:1,background:"#1a1a2e",color:"white"}}>{wizStep===5?"Finish":"Continue"}</Button>
        </>}>
        <div style={{marginBottom:12}}>
          <p style={{fontSize:10,fontWeight:700,color:"var(--color-text-tertiary)",letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>Step {wizStep} of 5</p>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {Array.from({length:5}).map((_,i)=>(
              <div key={i} style={{width:i+1===wizStep?22:7,height:7,borderRadius:i+1===wizStep?4:50,background:i<wizStep?"#1a1a2e":"var(--color-border-tertiary)",border:`1px solid ${i<wizStep?"#1a1a2e":"var(--color-border-secondary)"}`,transition:"all 0.2s",flexShrink:0}}/>
            ))}
          </div>
        </div>
        <Separator style={{marginBottom:16}}/>
        {WizBody()}
      </FormSheet>

      {/* ── ADD PAIR DRAWER ── */}
      <FormSheet open={pairOpen} onOpenChange={setPairOpen} title="Add language pair" sub={`Step ${pairStep} of 2 — ${pairStep===1?"choose languages":"choose services"}`} progress={(pairStep/2)*100}
        footer={<>
          {pairStep>1&&<Button variant="outline" onClick={()=>setPairStep(1)}>Back</Button>}
          <Button variant="outline" onClick={()=>setPairOpen(false)}>Cancel</Button>
          <Button onClick={pairNext} style={{flex:1,background:"#1a1a2e",color:"white"}}>{pairStep===2?"Add pair":"Continue"}</Button>
        </>}>
        <div style={{display:"flex",alignItems:"center",marginBottom:20}}>
          <div style={{width:22,height:22,borderRadius:11,background:pairStep>1?"#1a1a2e":"transparent",border:`2px solid #1a1a2e`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:pairStep>1?"white":"#1a1a2e",flexShrink:0}}>{pairStep>1?"✓":"1"}</div>
          <span style={{fontSize:12,fontWeight:pairStep===1?500:400,color:pairStep===1?"var(--color-text-primary)":"var(--color-text-tertiary)",margin:"0 10px"}}>Languages</span>
          <div style={{flex:1,height:1,background:"var(--color-border-tertiary)"}}/>
          <div style={{width:22,height:22,borderRadius:11,background:"transparent",border:`2px solid ${pairStep===2?"#1a1a2e":"var(--color-border-secondary)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:600,color:pairStep===2?"#1a1a2e":"var(--color-text-tertiary)",flexShrink:0}}>2</div>
          <span style={{fontSize:12,fontWeight:pairStep===2?500:400,color:pairStep===2?"var(--color-text-primary)":"var(--color-text-tertiary)",margin:"0 10px"}}>Services</span>
        </div>
        {pairStep===1 ? (
          <div style={{display:"flex",flexDirection:"column",gap:16}}>
            <div><p style={S.flbl}>Source language</p><LangSelect value={pairData.from} onChange={v=>setPairData(d=>({...d,from:v}))}/></div>
            <p style={{textAlign:"center",fontSize:11,color:"var(--color-text-tertiary)",margin:"-8px 0"}}>translates into</p>
            <div><p style={S.flbl}>Target language</p><LangSelect value={pairData.to} onChange={v=>setPairData(d=>({...d,to:v}))}/></div>
          </div>
        ) : (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 13px",background:"var(--color-background-secondary)",border:"1px solid var(--color-border-tertiary)",borderRadius:6,fontSize:13.5,fontWeight:500,marginBottom:16}}>
              {pairData.from} <span style={{color:"var(--color-text-tertiary)"}}>→</span> {pairData.to}
            </div>
            <p style={S.flbl}>Select services</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
              {PRESET_SVCS.map(sv=><Chip key={sv} label={sv} selected={pairData.services.some(s=>s.name===sv)}
                onClick={()=>setPairData(d=>{const has=d.services.some(s=>s.name===sv);return{...d,services:has?d.services.filter(s=>s.name!==sv):[...d.services,{name:sv,rate:"0",speed:"0",...bu(sv),overrides:{},notOffered:{}}]}})}/>)}
            </div>
            {usedSpecs.length>0&&pairData.services.length>0&&(
              <>
                <Separator style={{marginBottom:16}}/>
                <p style={S.flbl}>Default rates per specialisation</p>
                <p style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:12,lineHeight:1.5}}>
                  Set rates for each specialisation already used across your pairs. Leave blank to inherit the service default.
                </p>
                {usedSpecs.map(sp=>(
                  <div key={sp} style={{marginBottom:16}}>
                    <p style={{fontSize:12,fontWeight:600,color:"var(--color-text-primary)",marginBottom:8}}>{sp}</p>
                    {pairData.services.map(svc=>{
                      const sr=pairData.specRates?.[sp]?.[svc.name]||{}
                      const setR=(field,val)=>setPairData(d=>({...d,specRates:{...d.specRates,[sp]:{...(d.specRates[sp]||{}),[svc.name]:{...(d.specRates[sp]?.[svc.name]||{}),[field]:val}}}}))
                      return (
                        <div key={svc.name} style={{marginBottom:8}}>
                          <p style={{fontSize:11,color:"var(--color-text-tertiary)",marginBottom:4}}>{svc.name}</p>
                          <div style={{display:"flex",gap:8}}>
                            <DrawerUnit value={sr.rate||""} onChange={v=>setR("rate",v)} placeholder={svc.rate||"0.00"} unit={svc.rl||svc.rateLabel} step="0.01"/>
                            <DrawerUnit value={sr.speed||""} onChange={v=>setR("speed",v)} placeholder={svc.speed||"0"} unit={svc.sl||svc.speedLabel} step="10"/>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </>
            )}
            <Separator style={{marginBottom:16}}/>
            <p style={S.flbl}>Certification</p>
            <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"var(--color-background-secondary)",borderRadius:4,cursor:"pointer"}}
              onClick={()=>setPairData(d=>({...d,certified:!d.certified}))}>
              <Checkbox checked={pairData.certified} onCheckedChange={v=>setPairData(d=>({...d,certified:!!v}))}/>
              <span style={{fontSize:12,color:"var(--color-text-secondary)"}}>I am certified for this language pair</span>
            </div>
          </div>
        )}
      </FormSheet>

      {/* ── ADD SPEC DRAWER ── */}
      <FormSheet open={specOpen} onOpenChange={setSpecOpen} title="Add specialisation" sub="Added to all language pairs."
        footer={<><Button variant="outline" onClick={()=>setSpecOpen(false)}>Cancel</Button><Button onClick={confirmSpec} style={{flex:1,background:"#1a1a2e",color:"white"}}>Add to all pairs</Button></>}>
        <p style={S.flbl}>Select specialisation</p>
        {availSpecs.length===0 ? <p style={{fontSize:12,color:"var(--color-text-tertiary)"}}>All preset specialisations have already been added.</p> : (
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
            {availSpecs.map(sp=><Chip key={sp} label={sp} selected={specData.sel===sp}
              onClick={()=>setSpecData(d=>{const rates={};uniqSvcs.forEach(svc=>{rates[svc.name]={rate:svc.rate,speed:svc.speed}});return{...d,sel:d.sel===sp?"":sp,rates}})}/>)}
          </div>
        )}
        {specData.sel&&uniqSvcs.length>0&&(
          <div>
            <Separator style={{marginBottom:16}}/>
            <p style={S.flbl}>Default rates for this specialisation</p>
            <p style={{fontSize:12,color:"var(--color-text-secondary)",marginBottom:12,lineHeight:1.5}}>Pre-filled from each service default. Edit to override.</p>
            {uniqSvcs.map(svc=>(
              <div key={svc.name} style={{marginBottom:14}}>
                <p style={{fontSize:13,fontWeight:500,marginBottom:6}}>{svc.name}</p>
                <div style={{display:"flex",gap:8}}>
                  <DrawerUnit value={specData.rates[svc.name]?.rate||""} onChange={v=>setSpecData(d=>({...d,rates:{...d.rates,[svc.name]:{...d.rates[svc.name],rate:v}}}))} placeholder="0.00" unit={svc.rl||svc.rateLabel} step="0.01"/>
                  <DrawerUnit value={specData.rates[svc.name]?.speed||""} onChange={v=>setSpecData(d=>({...d,rates:{...d.rates,[svc.name]:{...d.rates[svc.name],speed:v}}}))} placeholder="0" unit={svc.sl||svc.speedLabel} step="10"/>
                </div>
              </div>
            ))}
          </div>
        )}
      </FormSheet>

      {/* ── ADD SERVICE DRAWER ── */}
      <FormSheet open={svcOpen} onOpenChange={setSvcOpen} title="Add service" sub="This service will be added to all language pairs."
        footer={<><Button variant="outline" onClick={()=>setSvcOpen(false)}>Cancel</Button><Button onClick={confirmSvc} style={{flex:1,background:"#1a1a2e",color:"white"}}>Add to all pairs</Button></>}>
        <p style={S.flbl}>Select service</p>
        {availSvcs.length===0 ? <p style={{fontSize:12,color:"var(--color-text-tertiary)"}}>All preset services have already been added.</p> : (
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:16}}>
            {availSvcs.map(sv=><Chip key={sv} label={sv} selected={svcData.sel===sv} onClick={()=>setSvcData(d=>({...d,sel:d.sel===sv?"":sv,rate:"",speed:""}))}/>)}
          </div>
        )}
        {svcData.sel&&(
          <div>
            <Separator style={{marginBottom:16}}/>
            <p style={{fontSize:13,fontWeight:500,marginBottom:8}}>{svcData.sel}</p>
            <div style={{display:"flex",gap:8}}>
              <DrawerUnit value={svcData.rate} onChange={v=>setSvcData(d=>({...d,rate:v}))} placeholder="0.00" unit={bu(svcData.sel).rl} step="0.01"/>
              <DrawerUnit value={svcData.speed} onChange={v=>setSvcData(d=>({...d,speed:v}))} placeholder="0" unit={bu(svcData.sel).sl} step="10"/>
            </div>
          </div>
        )}
      </FormSheet>

      {/* ── CONFIRM ── */}
      <AlertDialog open={dlg.open} onOpenChange={v=>{if(!v)setDlg(d=>({...d,open:false}))}}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm deletion</AlertDialogTitle>
            <AlertDialogDescription>{dlg.msg}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={()=>{dlg.cb?.();setDlg(d=>({...d,open:false}))}} className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
    </TooltipProvider>
  )
}
