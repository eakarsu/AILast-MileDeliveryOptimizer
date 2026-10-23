'use strict';
const express = require('express');
let seq = 0;
const store = new Map(); // ownerId -> Map(id->task)
function ownerOf(req){ const u=req.user||{}; return String(u.id||u.userId||u.email||u.sub||'unknown'); }
function ownerTasks(owner){ if(!store.has(owner)) store.set(owner,new Map()); return store.get(owner); }
function now(){ return new Date().toISOString(); }
function createTask(owner, body){
  const id = String(++seq);
  const t = { id, title:String(body.title||'').trim(), status: body.status||'todo', priority: body.priority||'medium', dueDate: body.dueDate||'', notes: body.notes||'', assignee: body.assignee||'', score: (body.score===undefined?0:body.score), ownerId: owner, createdAt: now(), updatedAt: now() };
  ownerTasks(owner).set(id,t); return t;
}
function filterTasks(list, q){
  q=q||{};
  let out=[...list];
  const needle=String(q.q||q.search||'').trim().toLowerCase();
  if(needle) out=out.filter(t=>[t.title,t.notes,t.status,t.priority,t.assignee].join(' ').toLowerCase().includes(needle));
  if(q.status) out=out.filter(t=>t.status===q.status);
  if(q.priority) out=out.filter(t=>t.priority===q.priority);
  return out;
}
function esc(v){ const s=(v===undefined||v===null)?'':String(v); return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s; }
function toCsv(list){
  const cols=['id','title','status','priority','dueDate','notes','assignee','score','ownerId','createdAt','updatedAt'];
  return [cols.join(','), ...list.map(t=>cols.map(c=>esc(t[c])).join(','))].join('\n')+'\n';
}
function hasKey(){ return !!(process.env.OPENROUTER_API_KEY||process.env.OPENAI_API_KEY); }
function base(feature, sections){
  return { feature, aiGenerated:false, provider: hasKey()?'provider-configured':'deterministic-fallback', label: hasKey()?'Deterministic fallback (provider configured; no paid call made)':'Deterministic fallback (no provider key configured)', sections };
}

const FEATURES={
 'route-priority': (records)=>{ const w={urgent:4,high:3,medium:2,low:1}; const ordered=[...records].sort((a,b)=>(w[b.priority]||0)-(w[a.priority]||0)); const urgent=records.filter(t=>t.priority==='urgent'||t.priority==='high').length; return base('route-priority',[{label:'Summary',value:'Deterministic fallback: tasks ordered by priority for route planning.'},{label:'Total tasks',value:records.length},{label:'Urgent or high priority',value:urgent},{label:'Has urgent work',value:urgent>0},{label:'Ordered task ids',value:ordered.map(t=>t.id||t.title||'')}]); },
 'sla-risk': (records)=>{ const overdue=records.filter(t=>t.dueDate && new Date(t.dueDate) < new Date() && t.status!=='done' && t.status!=='completed'); return base('sla-risk',[{label:'Summary',value:'Deterministic fallback: overdue open tasks indicate SLA risk.'},{label:'Total tasks',value:records.length},{label:'Overdue open tasks',value:overdue.length},{label:'At risk',value:overdue.length>0},{label:'Overdue task ids',value:overdue.map(t=>t.id||'')}]); },
 'load-balance': (records)=>{ const by={}; for(const t of records) by[t.status||'todo']=(by[t.status||'todo']||0)+1; return base('load-balance',[{label:'Summary',value:'Deterministic fallback: task counts grouped by status.'},{label:'Total tasks',value:records.length},{label:'Open tasks',value:records.filter(t=>t.status!=='done'&&t.status!=='completed').length},{label:'Counts by status',value:by},{label:'Busiest status',value:Object.keys(by).sort((a,b)=>by[b]-by[a])[0]||''}]); },
};

function createRouter(auth){
  const r=express.Router();
  const guard = auth || ((req,res)=>res.status(401).json({error:'Authentication required'}));
  r.use(guard);
  r.get('/tasks/export', (req,res)=>{
    const list=filterTasks([...ownerTasks(ownerOf(req)).values()], req.query);
    if(String(req.query.format||'csv').toLowerCase()==='json') return res.json({tasks:list,count:list.length,total:list.length});
    res.setHeader('Content-Type','text/csv'); res.setHeader('Content-Disposition','attachment; filename="tasks.csv"'); return res.send(toCsv(list));
  });
  r.get('/tasks', (req,res)=>{ const list=filterTasks([...ownerTasks(ownerOf(req)).values()], req.query); res.json({tasks:list, data:list, count:list.length, total:list.length}); });
  r.post('/tasks', (req,res)=>{
    if(!req.body||!String(req.body.title||'').trim()) return res.status(400).json({error:'title is required'});
    const t=createTask(ownerOf(req), req.body); return res.status(201).json(t);
  });
  r.get('/tasks/:id', (req,res)=>{ const t=ownerTasks(ownerOf(req)).get(String(req.params.id)); if(!t) return res.status(404).json({error:'Task not found'}); return res.json(t); });
  const update=(req,res)=>{ const m=ownerTasks(ownerOf(req)); const t=m.get(String(req.params.id)); if(!t) return res.status(404).json({error:'Task not found'}); for(const k of ['title','status','priority','dueDate','notes','assignee','score']) if(req.body && req.body[k]!==undefined) t[k]=req.body[k]; t.updatedAt=now(); return res.json(t); };
  r.put('/tasks/:id', update); r.patch('/tasks/:id', update);
  r.post('/ai-tasks/:feature', (req,res)=>{
    const fn=FEATURES[req.params.feature]; if(!fn) return res.status(404).json({error:'Unknown AI feature', available:Object.keys(FEATURES)});
    const records = Array.isArray(req.body&&req.body.records)?req.body.records : Array.isArray(req.body&&req.body.tasks)?req.body.tasks : [...ownerTasks(ownerOf(req)).values()];
    return res.json(fn(records));
  });
  return r;
}
module.exports={createRouter, filterTasks, toCsv, FEATURES, _store:store};
