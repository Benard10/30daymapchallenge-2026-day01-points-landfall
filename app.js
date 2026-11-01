/* Historical data: see data/SOURCE-LICENSE.md. No bandwidth or latency inferred. */
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let points = [], filtered = [], selected = null, map, overlay;
let routes=null;
function updateRoutes(){
 if(!map.getLayer('cable-routes'))return;
 const hasFilter=Boolean($('search').value.trim()||$('country').value);
 const connectedIds=[...new Set(filtered.flatMap(d=>d.properties.cables.map(c=>c.id)))];
 const selectedIds=selected?selected.properties.cables.map(c=>c.id):[];
 map.setFilter('cable-routes',hasFilter?['in',['get','id'],['literal',connectedIds]]:null);
 map.setFilter('cable-highlight',['in',['get','id'],['literal',selectedIds]]);
 map.setPaintProperty('cable-routes','line-opacity',selected ? 0.1 : 0.4);
}
function addRoutes(){
 if(!routes||!map.isStyleLoaded()||map.getSource('cable-routes'))return;
 map.addSource('cable-routes',{type:'geojson',data:routes});
 const paint={'line-color':['get','color'],'line-width':1.4,'line-dasharray':[0,3],'line-opacity':.4};
 map.addLayer({id:'cable-routes',type:'line',source:'cable-routes',layout:{'line-cap':'round','line-join':'round'},paint});
 map.addLayer({id:'cable-highlight',type:'line',source:'cable-routes',layout:{'line-cap':'round','line-join':'round'},paint:{...paint,'line-width':2.4,'line-opacity':.95}});
 updateRoutes();
}
const views = {
 world:{bounds:[[-179,-60],[179,76]],maxZoom:2},
 // Coastal corridor from Dar es Salaam / Mombasa to Djibouti and the Horn.
 africa:{bounds:[[37,-8.5],[51,13.5]],maxZoom:5.5},
 asia:{bounds:[[92,-12],[142,25]],maxZoom:4.5}
};
let activeView='world';
function setActiveView(name){
 activeView=name;
 document.querySelectorAll('[data-view]').forEach(button=>{
  const active=button.dataset.view===name;
  button.classList.toggle('active',active);
  button.setAttribute('aria-pressed',String(active));
 });
}
function frameView(name,duration=1100){
 const preset=views[name];
 if(!preset)return;
 selected=null;$('detail').hidden=true;
 setActiveView(name);
 const height=map.getContainer().clientHeight;
 const padding=name==='africa'
  ? {top:Math.min(116,height*.22),bottom:Math.min(42,height*.1),left:28,right:28}
  : {top:Math.min(130,height*.24),bottom:Math.min(110,height*.2),left:24,right:24};
 map.stop();
 map.fitBounds(preset.bounds,{
  padding,
  maxZoom:preset.maxZoom,bearing:0,pitch:0,duration,
  essential:false
 });
 if(overlay)layers();
}
function layers() {
 updateRoutes();
 const color = d => d.properties.is_tbd ? [229,183,120] : [115,244,209];
 const radius = d => 3 + Math.sqrt(d.properties.cables.length) * 2;
 const base = {data:filtered,getPosition:d=>d.geometry.coordinates,getRadius:radius,radiusUnits:'pixels',radiusMinPixels:3,radiusMaxPixels:19,getFillColor:color};
 overlay.setProps({layers:[
  new deck.ScatterplotLayer({...base,id:'halo',radiusScale:2.2,opacity:.09,pickable:false}),
  new deck.ScatterplotLayer({...base,id:'points',opacity:.85,pickable:true,stroked:true,getLineColor:[170,255,235],lineWidthUnits:'pixels',getLineWidth:.4,onClick:info=>{if(info.object) choose(info.object);}}),
  new deck.ScatterplotLayer({id:'selected',data:selected && filtered.includes(selected)?[selected]:[],getPosition:d=>d.geometry.coordinates,getRadius:18,radiusUnits:'pixels',filled:false,stroked:true,getLineColor:[255,255,255],lineWidthUnits:'pixels',getLineWidth:2})
 ]});
}
function applyFilters(){
 const query=$('search').value.trim().toLocaleLowerCase(),country=$('country').value;
 filtered=points.filter(d=>(!country||d.properties.country===country)&&(!query||[d.properties.name,...d.properties.cables.map(c=>c.name)].join(' ').toLocaleLowerCase().includes(query)));
 if(selected&&!filtered.includes(selected)){selected=null;$('detail').hidden=true;}
 $('shown').textContent=`${filtered.length.toLocaleString()} results`;
 // Cap DOM rows, while rendering every matching point on the map.
 $('results').replaceChildren();
 filtered.slice(0,75).forEach((d,i)=>{
  const p=d.properties,b=document.createElement('button');b.className='result';
  b.innerHTML=`<span class="rank">${String(i+1).padStart(2,'0')}</span><span class="result-name"><b>${escapeHTML(p.name.split(',')[0])}</b><small>${escapeHTML(p.country)}</small></span><span class="count">${p.metadata_available?p.cables.length:'?'}</span><span aria-hidden="true">↗</span>`;
  b.setAttribute('aria-label',`${p.name}, ${p.metadata_available?p.cables.length+' cable connections':'cable membership unknown'}`);b.onclick=()=>choose(d);$('results').append(b);
 });
 if(!filtered.length)$('results').innerHTML='<p class="empty">No landing points found. Try another city, cable, or country.</p>';
 if(filtered.length>75){const note=document.createElement('p');note.className='empty';note.textContent='Showing the top 75 hubs. All matching points appear on the map; search to narrow the list.';$('results').append(note);}
 layers();
}
function choose(d){
 setActiveView(null);
 selected=d;const p=d.properties,[lon,lat]=d.geometry.coordinates;
 $('detail').innerHTML=`<button class="close" aria-label="Close landing point details">×</button><div class="eyebrow">WHERE THE NETWORK MEETS LAND</div><h2>${escapeHTML(p.name.split(',')[0])}</h2><p>${escapeHTML(p.country)}<br>${Math.abs(lat).toFixed(3)}° ${lat<0?'S':'N'} / ${Math.abs(lon).toFixed(3)}° ${lon<0?'W':'E'}${p.is_tbd?'<br>Location unconfirmed in source':''}${!p.metadata_available?'<br>Cable details unavailable.':''}</p><p><b>${p.metadata_available?p.cables.length+' listed cable connections':'Cable membership unknown'}</b><br>Historical late-2022 snapshot</p><ul>${p.cables.map(c=>`<li>${escapeHTML(c.name)}<small>${c.is_planned?'Planned in source':'Not flagged planned in source'} · RFS ${escapeHTML(c.rfs_year??'unknown')}</small></li>`).join('')}</ul><p>RFS = ready for service. These source records do not establish current operation, ownership, capacity, or latency.</p>`;
 $('detail').hidden=false;$('detail').querySelector('button').onclick=()=>{selected=null;$('detail').hidden=true;layers();};
 map.flyTo({center:d.geometry.coordinates,zoom:Math.max(map.getZoom(),4.5),duration:1000,essential:false});layers();
}
async function init(){
 try{
  if(!window.maplibregl||!window.deck)throw new Error('Map libraries could not load. Check your internet connection and reload.');
  // OpenFreeMap includes the required OpenMapTiles / OpenStreetMap attribution.
  // Its public vector basemap requires neither an API key nor an account.
  map=new maplibregl.Map({container:'map',style:'https://tiles.openfreemap.org/styles/dark',center:[0,10],zoom:0,maxZoom:13,minZoom:0,renderWorldCopies:false});
  // Keep the WebGL canvas aligned with the responsive dashboard grid.
  const mapResizeObserver=new ResizeObserver(()=>{
   map.resize();
   if(activeView)frameView(activeView,0);
  });
  mapResizeObserver.observe(document.querySelector('.map-panel'));
  map.on('remove',()=>mapResizeObserver.disconnect());
  map.addControl(new maplibregl.NavigationControl({showCompass:false}),'top-right');
  map.on('load',addRoutes);
  // Routes are optional: a missing route file must not prevent point exploration.
  fetch('data/cable-routes.geojson').then(response=>{
   if(!response.ok)throw new Error('Route data unavailable');
   return response.json();
  }).then(data=>{routes=data;addRoutes();}).catch(()=>{
   $('status').textContent='Cable routes unavailable; landing points remain available.';
  });
  overlay=new deck.MapboxOverlay({interleaved:false,layers:[],getTooltip:({object})=>object?{text:`${object.properties.name}\n${object.properties.metadata_available?object.properties.cables.length+' listed cable connections':'Cable membership unknown'}`,style:{backgroundColor:'#10232f',color:'#bdfbe9',fontSize:'12px'}}:null});map.addControl(overlay);
  let warned=false;map.on('error',()=>{if(!warned){$('status').textContent='Basemap unavailable. Landing points remain available; check your connection.';warned=true;}});
  const response=await fetch('data/hubs.geojson');if(!response.ok)throw new Error('Landing points could not be loaded. Please refresh and try again.');
  const data=await response.json();points=data.features.sort((a,b)=>b.properties.cables.length-a.properties.cables.length||a.properties.name.localeCompare(b.properties.name));
  const countries=[...new Set(points.map(d=>d.properties.country))].sort();
  for(const name of countries){const option=document.createElement('option');option.value=name;option.textContent=name;$('country').append(option);}
  $('total').textContent=points.length.toLocaleString();$('countries').textContent=countries.length;
  $('search').addEventListener('input',applyFilters);$('country').addEventListener('change',applyFilters);$('clear').onclick=()=>{$('search').value='';$('country').value='';applyFilters();};
  document.querySelectorAll('[data-view]').forEach(button=>button.onclick=()=>frameView(button.dataset.view));
  map.on('movestart',event=>{if(event.originalEvent)setActiveView(null);});
  if(!warned)$('status').textContent='';applyFilters();frameView('world',0);
 }catch(error){$('status').textContent=error.message;$('results').textContent='The atlas is temporarily unavailable. Please refresh and try again.';}
}
// Keep map space available on phones, narrow windows, and short laptop screens.
const compactLegend=window.matchMedia('(max-width: 900px), (max-height: 600px)');
const adaptLegend=()=>{document.querySelector('.legend').open=!compactLegend.matches;};
compactLegend.addEventListener('change',adaptLegend);
adaptLegend();
init();
