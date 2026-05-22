import React, { useEffect, useState } from 'react';
export default function PorchPiracyRiskMap() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/porch-piracy-risk-map').then(r => r.json()).then(setData).catch(() => {}); }, []);
  return <div><h1>Porch Piracy Risk Map</h1><p>Recommends safer final-drop handling by theft history, package value, and dwell time.</p>{data?.stops?.map(s => <section key={s.stop} style={{background:'#fff',padding:16,borderRadius:8,marginBottom:12}}><h2>{s.stop}</h2><p>{s.action} - risk {s.risk_score}</p></section>)}</div>;
}
