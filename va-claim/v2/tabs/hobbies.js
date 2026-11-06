// Hobbies & property tab (id 'hobbies', order 50). Personal / money color (gold).
// General, educational content only. All prices are rough 2026 planning ranges.
// Sources:
// Examples
//   https://openrivers.lib.umn.edu/article/solar-shed  (Augsburg Univ. solar work shed, Minneapolis)
//   https://www.homedepot.com/c/ap/transforming-a-pre-fabricated-tuff-shed-into-a-solar-powered-workshop/9ba683603be9fa5395fab9011574fa07
//   https://www.huntingforgeorge.com/blog/inside-the-big-shed-project-can-i-run-it-off-grid/
//   https://www.garagejournal.com/forum/threads/the-gunner-garage.393507/  (Lino Lakes, MN)
//   https://www.finewoodworking.com/2010/10/28/turn-your-garage-into-a-real-workshop
//   https://www.finewoodworking.com/2025/01/15/cold-weather-woodworking-part-1
//   https://www.garagejournal.com/forum/threads/separating-metal-working-from-other-areas.556869/
//   https://sawmillcreek.org/threads/new-pole-barn-workshop.188708/
// Costs and energy
//   https://www.bobvila.com/articles/cost-to-build-shed  (12x16 shed $3k to $15k, electrical $600 to $2,200)
//   https://www.thepricer.org/cost-to-build-a-detached-garage/  (garage $40 to $70/sf, slab $6 to $12/sf, insulation $1.5k to $5k)
//   https://summertownmetals.com/pole-barn/pole-barn-cost-guide/  (pole barn shell $15 to $40/sf)
//   https://www.budgetheating.com/how-much-does-it-cost-to-install-a-mini-split-in6/  (single zone $2k to $7k)
//   https://www.farmandfleet.com/products/1488372-mr-heater-80k-btu-big-maxx-natural-gas-unit-heater.html
//   https://www.woodcraft.com/blogs/shop-knowledge-guides/workshop-heating  (wood stove, radiant floor ~$12/sf, electric)
//   https://www.energysage.com/local-data/electricity-cost/mn/hennepin-county/minneapolis/  (~18 cents/kWh, Oct 2026)
//   https://www.energysage.com/local-data/solar-panel-cost/mn/  ($3.23/W average installed, 2026)
//   https://nrgcleanpower.com/learning-center/solar-battery-cost/  ($730 to $1,800 per kWh installed; 25D credit ended 12/31/2025)
//   https://ycharts.com/indicators/minnesota_residential_propane_price  (~$1.90/gal, Oct 2026)
//   https://www.eia.gov/dnav/ng/hist/n3010mn3a.htm  (MN residential gas $10.98/Mcf 2025, about $1.06/therm)
//   https://dnr.state.mn.us/climate/journal/twin-cities-normals-1991-2020-compared-1981-2010.html  (Jan normal 16.2 F)
//   https://profilesolar.com/locations/United-States/Minneapolis/  (kWh/day per kW: summer 6.84, fall 3.42, winter 2.32, spring 5.28)
//   https://generatorsource.com/tools-info/power-consumption-chart
//   https://mrelectric.com/blog/2015/september/power-tools-how-much-power-do-they-need
// xTool MetalFab
//   https://www.xtool.com/collections/metalfab/products/xtool-metalfab-laser-welder-and-cnc-cutters
//   https://uk.xtool.com/products/xtool-metalfab-laser-welder-and-cnc-cutter
//   https://support.xtool.com/article/2017  (MetalFab welder safety: Class 4, OD6+ at 1080 nm, -10 C to 40 C)
//   https://support.xtool.com/article/2025  (CNC cutter safety)
//   https://www.atomm.com/de/blog/2537-what-is-xtool-metalfab  (xTool community: specs, US prices July 2026)
// Safety, rules, other hobbies
//   https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.252  (welding fire prevention, 35 ft rule)
//   https://revisor.mn.gov/rules/1300.0120/  (MN: detached accessory building 200 sf or less exempt from building permit)
//   https://hermantownmn.com/wp-content/uploads/2026/01/ZONING-CHAPTER-18-HOME-OCCUPATIONS-AND-ADUS.pdf
//   https://extension.umn.edu/small-scale-poultry/caring-chickens-cold-weather
//   https://hort.extension.wisc.edu/articles/extending-garden-season/
//   https://library.crossfit.com/free/pdf/cfjissue1_Sep02.pdf  (CrossFit Journal: the garage gym)
(()=>{
  const ID='hobbies';

  // ---------- data ----------
  const SIZES={
    s12x16:{label:'12x16 shed', w:12, l:16, h:8},
    s16x24:{label:'16x24 shop', w:16, l:24, h:9},
    s24x30:{label:'24x30 garage-style', w:24, l:30, h:10},
    s30x40:{label:'30x40 pole building', w:30, l:40, h:12}
  };
  // Shell $/sf (low, high) and foundation $/sf
  const BUILDS={
    prefab:{label:'Prefab shed', shell:[25,60], found:[3,6], foundName:'Gravel pad or skids', note:'Prefab sheds rarely come bigger than about 16x24. For bigger sizes look at garage kits.'},
    stick:{label:'Stick-built', shell:[40,80], found:[6,12], foundName:'Concrete slab with frost footing'},
    pole:{label:'Pole barn', shell:[20,40], found:[6,12], foundName:'Concrete slab'},
    steel:{label:'Steel kit', shell:[15,35], found:[6,12], foundName:'Concrete slab and footings'}
  };
  // U values (BTU/h per sf per F) walls, ceiling; slab edge F per ft; air changes per hour; install $/sf of envelope
  const INSUL={
    none:{label:'None', uw:0.25, uc:0.20, fe:0.8, ach:1.0, cost:[0,0]},
    basic:{label:'Basic (R-13 walls, R-30 ceiling)', uw:0.08, uc:0.035, fe:0.6, ach:0.5, cost:[1,2.5]},
    good:{label:'Good (R-21+, R-49, air sealed)', uw:0.05, uc:0.022, fe:0.4, ach:0.25, cost:[2.5,5]}
  };
  const POWERS={
    grid:{label:'Grid subpanel from house'},
    solar:{label:'Solar + battery (off-grid)'},
    hybrid:{label:'Hybrid: small solar + generator'}
  };
  const HEATS={
    minisplit:{label:'Ductless mini-split heat pump'},
    propane:{label:'Propane unit heater (vented)'},
    natgas:{label:'Natural gas unit heater (vented)'},
    wood:{label:'Wood stove'},
    radiant:{label:'Radiant floor (propane boiler)'},
    electric:{label:'Electric heater or radiant panels'}
  };
  const COOLS={
    fans:{label:'Fans + exhaust fan only'},
    minisplit:{label:'Mini-split (cools too)'}
  };
  const KEEP=[40,50,60];
  const SEASONS={summer:{label:'Summer',k:6.84}, spring:{label:'Spring',k:5.28}, fall:{label:'Fall',k:3.42}, winter:{label:'Winter',k:2.32}};

  // Typical running watts. Always check the nameplate.
  const TOOLS=[
    {id:'tsaw', name:'Table saw (3 HP cabinet)', w:3000, v:'240V', need:true},
    {id:'bsaw', name:'Bandsaw, 14 in', w:1200, v:'120V', need:false},
    {id:'planer', name:'Planer, 13 in benchtop', w:1800, v:'120V', need:false},
    {id:'jointer', name:'Jointer, 6 to 8 in', w:1200, v:'120V (8 in often 240V)', need:false},
    {id:'dc', name:'Dust collector, 1.5 to 2 HP', w:1800, v:'120V or 240V', need:false},
    {id:'comp', name:'Air compressor, 60 gal 2+ HP', w:2000, v:'240V', need:true},
    {id:'mig', name:'MIG welder, 180 to 210 A class', w:5500, v:'240V', need:true},
    {id:'tig', name:'TIG welder, 200 A AC/DC', w:6000, v:'240V', need:true},
    {id:'plasma', name:'Plasma cutter, 45 A', w:6500, v:'240V', need:true},
    {id:'grinder', name:'Angle grinder, 4.5 in', w:1000, v:'120V', need:false},
    {id:'dpress', name:'Drill press', w:600, v:'120V', need:false},
    {id:'mband', name:'Metal-cutting bandsaw', w:800, v:'120V', need:false},
    {id:'lights', name:'LED shop lights', w:300, v:'120V', need:false, always:true},
    {id:'msplit', name:'Mini-split running in cold weather', w:1500, v:'240V', need:true, always:true},
    {id:'metalfab', name:'xTool MetalFab 1200W (max draw)', w:4200, v:'240V, 21 A+ circuit', need:true},
    {id:'engraver', name:'Desktop laser engraver + exhaust fan', w:400, v:'120V', need:false}
  ];

  function st(){
    if(!S[ID]) S[ID]={};
    const d={size:'s24x30', build:'pole', insul:'basic', power:'grid', heat:'minisplit', cool:'fans',
      keep:50, useHrs:10, elec:0.18, propane:2.00, ngas:1.10, cord:300,
      tools:{tsaw:1,dc:1,mig:1,grinder:1,lights:1,metalfab:1}, atOnce:2, shopHrs:10, season:'winter', days:2};
    for(const k in d) if(S[ID][k]===undefined) S[ID][k]=(typeof d[k]==='object')?JSON.parse(JSON.stringify(d[k])):d[k];
    return S[ID];
  }

  const num=(v,def)=>{const n=parseFloat(v); return isFinite(n)?n:def;};
  const r0=n=>Math.round(n).toLocaleString('en-US');
  const r1=n=>(Math.round(n*10)/10).toLocaleString('en-US');

  // ---------- power helper math ----------
  function powerCalc(h){
    const sel=TOOLS.filter(t=>h.tools[t.id]);
    const always=sel.filter(t=>t.always);
    const big=sel.filter(t=>!t.always).sort((a,b)=>b.w-a.w);
    const n=Math.max(1,Math.min(4,h.atOnce|0));
    const top=big.slice(0,n);
    const peak=always.reduce((s,t)=>s+t.w,0)+top.reduce((s,t)=>s+t.w,0);
    // average draw while working: tools cycle on and off, so about 35% of the peak; lights and heat count fully
    const avg=always.reduce((s,t)=>s+t.w,0)+0.35*top.reduce((s,t)=>s+t.w,0);
    const kwhWeek=avg*Math.max(0,h.shopHrs)/1000;
    const daily=kwhWeek/7;
    const k=SEASONS[h.season]?SEASONS[h.season].k:2.32;
    const arrayKw=daily/(k*0.85); // 15% battery and inverter losses
    const perSession=h.shopHrs>0?kwhWeek/Math.max(1,Math.ceil(h.shopHrs/4)):0; // about 4 h per session
    const battKwh=Math.max(perSession, daily*Math.max(1,h.days))/0.8; // keep 20% in reserve
    const invKw=peak*1.25/1000;
    const needs240=sel.filter(t=>t.need);
    const heavy=sel.some(t=>['mig','tig','plasma','metalfab'].includes(t.id));
    const reasons=[];
    if(peak>6000) reasons.push('Peak load is over 6 kW. Off-grid inverters and batteries that big get expensive fast.');
    if(heavy) reasons.push('Welders, plasma cutters and the MetalFab pull 4 to 7 kW each, often with surges.');
    if(h.tools.msplit && h.season==='winter') reasons.push('Running electric heat from solar in a Minnesota winter is not practical. Winter sun gives about a third of summer output.');
    if(arrayKw>4) reasons.push('The array would be over 4 kW, which needs a lot of roof or ground space.');
    return {sel, top, always, peak, avg, kwhWeek, daily, arrayKw, battKwh, invKw, needs240, heavy, reasons, k, amps240:peak/240};
  }

  // ---------- planner math ----------
  function plannerCalc(h){
    const sz=SIZES[h.size]||SIZES.s24x30, b=BUILDS[h.build]||BUILDS.pole, ins=INSUL[h.insul]||INSUL.basic;
    const area=sz.w*sz.l, perim=2*(sz.w+sz.l), wallA=perim*sz.h, vol=area*sz.h, env=wallA+area;
    const UA=wallA*ins.uw+area*ins.uc+perim*ins.fe+0.018*vol*ins.ach; // BTU/h per F
    const designLoad=UA*(60-(-20)); // BTU/h at -20 F outside, 60 F inside
    const items=[];
    const add=(name,lo,hi,note)=>items.push({name,lo,hi,note});
    add(`${b.label} shell, ${sz.label} (${r0(area)} sq ft)`, area*b.shell[0], area*b.shell[1], b.note||'');
    add(b.foundName, area*b.found[0], area*b.found[1], h.build==='prefab'?'':'Minnesota frost depth can add cost for footings.');
    if(ins.cost[1]>0) add(`Insulation: ${ins.label}`, env*ins.cost[0], env*ins.cost[1], 'Mineral wool is nonflammable, a plus in a shop.');
    const pc=powerCalc(h);
    const wiring=[area*1.5, area*4];
    if(h.power==='grid'){
      add('Feeder trench, wire and 60 to 100 A subpanel', 2000, 6000, 'Depends on distance from the house and your main panel size.');
      add('Inside wiring, outlets, 240V circuits, lights', wiring[0], wiring[1], 'Licensed electrician and permit.');
    } else {
      const f=h.power==='hybrid'?0.5:1;
      const kw=Math.max(0.4,pc.arrayKw*f), kwh=Math.max(2,pc.battKwh*f), inv=Math.max(1, (h.power==='hybrid'?Math.min(pc.invKw,3):pc.invKw));
      add(`Solar array about ${r1(kw)} kW`, kw*1000*2.0, kw*1000*3.5, 'Low is DIY panels and racking, high is installed. No federal 25D credit after 2025.');
      add(`Battery about ${r1(kwh)} kWh`, kwh*400, kwh*1200, 'Low is DIY LiFePO4, high is installed home battery.');
      add(`Inverter/charger about ${r1(inv)} kW`, 800+inv*300, 1500+inv*700, 'Must handle motor start surges.');
      if(h.power==='hybrid') add('240V generator (7 to 10 kW) for welding days', 1500, 6000, 'Never run it inside or near the shop door. CO risk.');
      add('Inside wiring, outlets, lights', wiring[0], wiring[1], 'Still needs a permit and inspection.');
    }
    // heating
    const units=Math.max(1,Math.ceil(designLoad/20000));
    const msCost=[units*3500, units*7000];
    if(h.heat==='minisplit') add(`Cold-climate mini-split (${units} unit${units>1?'s':''})`, msCost[0], msCost[1], `Sized for about ${r0(designLoad)} BTU/h at -20 F.`);
    if(h.heat==='propane') add('Propane unit heater, venting, gas line, tank set', 2000, 5500, 'Use a vented or sealed-combustion unit. Tank is often leased.');
    if(h.heat==='natgas') add('Natural gas unit heater, venting, gas line', 1800, 5000, 'Only if gas service reaches the shop.');
    if(h.heat==='wood') add('Wood stove with insulated chimney', 1500, 4500, 'Check with your insurer first. Many charge more or decline.');
    if(h.heat==='radiant') add('Radiant floor tubing + boiler', area*8, area*15, h.build==='prefab'?'Needs a slab. Not a fit for a prefab shed on skids.':'Must be poured with the slab. Plan it before the concrete.');
    if(h.heat==='electric') add('Electric heater(s) on 240V', 600*units, 1500*units, 'Cheap to buy, costly to run.');
    if(h.cool==='fans') add('Ceiling fan + wall exhaust fan', 200, 900, 'Exhaust fan also helps clear welding fumes.');
    if(h.cool==='minisplit' && h.heat!=='minisplit') add(`Mini-split for cooling (${units} unit${units>1?'s':''})`, msCost[0], msCost[1], 'Also gives backup heat.');
    add('Permits, plans, survey', 200+area*0.5, 1000+area*1.5, 'Varies a lot by city and county.');
    const sub=items.reduce((s,i)=>[s[0]+i.lo,s[1]+i.hi],[0,0]);
    items.push({name:'Contingency (10% to 15%)', lo:sub[0]*0.10, hi:sub[1]*0.15, note:'Surprises always happen.'});
    const tot=items.reduce((s,i)=>[s[0]+i.lo,s[1]+i.hi],[0,0]);

    // January heat cost
    const janOut=16.2, hrsMonth=730, useWk=Math.max(0,h.useHrs);
    const keep=num(h.keep,50);
    const btu=UA*Math.max(0,keep-janOut)*hrsMonth + UA*Math.max(0,62-keep)*useWk*4.33;
    let fuel='', cost=0;
    const elec=num(h.elec,0.18), lp=num(h.propane,2), ng=num(h.ngas,1.1), cord=num(h.cord,300);
    if(h.heat==='minisplit'){const kwh=btu/3412/2.0; cost=kwh*elec; fuel=`${r0(kwh)} kWh at an average COP of 2 (lower on the coldest nights)`;}
    if(h.heat==='propane'){const g=btu/(91500*0.8); cost=g*lp; fuel=`${r0(g)} gallons propane at 80% efficiency`;}
    if(h.heat==='radiant'){const g=btu/(91500*0.9); cost=g*lp; fuel=`${r0(g)} gallons propane at 90% boiler efficiency`;}
    if(h.heat==='natgas'){const t=btu/(100000*0.8); cost=t*ng; fuel=`${r0(t)} therms natural gas at 80% efficiency`;}
    if(h.heat==='wood'){const c=btu/(20000000*0.6); cost=c*cord; fuel=`${r1(c)} cords of hardwood at 60% efficiency`;}
    if(h.heat==='electric'){const kwh=btu/3412; cost=kwh*elec; fuel=`${r0(kwh)} kWh of resistance heat`;}
    return {sz,b,ins,items,tot,UA,designLoad,btu,cost,fuel,pc,area};
  }

  // ---------- render pieces ----------
  function seg(key,opts,cur){
    return `<div class="seg" role="group">${Object.entries(opts).map(([k,o])=>{
      const on=String(cur)===String(k);
      return `<button type="button" class="btn sm${on?' on':''}" aria-pressed="${on}" data-hb-set="${key}" data-val="${k}">${esc(o.label||o)}</button>`;
    }).join('')}</div>`;
  }

  function plannerOut(h){
    const p=plannerCalc(h);
    const rows=p.items.map(i=>`<tr><td>${esc(i.name)}${i.note?`<div class="small muted">${esc(i.note)}</div>`:''}</td><td class="num">${money0(i.lo)}</td><td class="num">${money0(i.hi)}</td></tr>`).join('');
    const warns=[];
    if(h.build==='prefab' && (h.size==='s24x30'||h.size==='s30x40')) warns.push('A prefab shed this big is unusual. Price it as a garage kit or pole building.');
    if(h.heat==='wood') warns.push('Wood stove in a wood shop: fine dust and finish fumes near an open flame are a real fire risk. Many insurers ask about it or charge more. Clean dust daily and keep the stove far from sanding and finishing.');
    if((h.heat==='propane'||h.heat==='natgas'||h.heat==='radiant'||h.heat==='wood')) warns.push('Fuel-burning heat: put in a CO alarm and a smoke alarm. Never use an unvented "torpedo" heater in a closed shop.');
    if(h.power==='solar' && h.heat!=='propane' && h.heat!=='natgas' && h.heat!=='wood' && h.heat!=='radiant') warns.push('Off-grid solar cannot carry electric heat in a Minnesota winter. Pair off-grid with propane, gas or wood heat, or pick grid power.');
    if(h.insul==='none') warns.push('An uninsulated shop in Minnesota burns a lot of fuel. One Fine Woodworking editor used a 60 gallon propane tank in under a month before insulating.');
    return `
      <div class="tiles">
        <div class="tile"><div class="eyebrow-s">Build cost, low</div><div class="tbig">${fmtK(p.tot[0])}</div><div class="small muted">rough 2026 range</div></div>
        <div class="tile"><div class="eyebrow-s">Build cost, high</div><div class="tbig">${fmtK(p.tot[1])}</div><div class="small muted">includes contingency</div></div>
        <div class="tile"><div class="eyebrow-s">January heat</div><div class="tbig">${money0(p.cost)}/mo</div><div class="small muted">kept at ${esc(String(h.keep))} F, ${esc(String(h.useHrs))} h/wk at 62 F</div></div>
        <div class="tile"><div class="eyebrow-s">Heat loss</div><div class="tbig">${r0(p.designLoad/1000)}k</div><div class="small muted">BTU/h needed at -20 F</div></div>
      </div>
      <div class="tbl-wrap"><table class="mtbl"><thead><tr><th>Item</th><th class="num">Low</th><th class="num">High</th></tr></thead>
      <tbody>${rows}<tr><td><b>Total</b></td><td class="num"><b>${money0(p.tot[0])}</b></td><td class="num"><b>${money0(p.tot[1])}</b></td></tr></tbody></table></div>
      <p class="small muted">January heat estimate: ${esc(p.fuel)}. Uses the Twin Cities January normal of 16.2 F and a simple heat-loss model (walls, ceiling, slab edge, air leaks). Real bills depend on doors, windows, wind and how often the big door is open. Spring and fall months run about a third to half of January.</p>
      ${warns.length?`<div class="warnbox small"><ul class="small">${warns.map(w=>`<li>${esc(w)}</li>`).join('')}</ul></div>`:''}`;
  }

  function powerOut(h){
    const p=powerCalc(h);
    const topNames=p.top.map(t=>t.name).join(', ')||'none';
    const grid=p.reasons.length>0;
    return `
      <div class="tiles">
        <div class="tile"><div class="eyebrow-s">Peak running load</div><div class="tbig">${r1(p.peak/1000)} kW</div><div class="small muted">about ${r0(p.amps240)} A at 240V</div></div>
        <div class="tile"><div class="eyebrow-s">Energy per week</div><div class="tbig">${r1(p.kwhWeek)} kWh</div><div class="small muted">${esc(String(h.shopHrs))} shop hours</div></div>
        <div class="tile"><div class="eyebrow-s">Solar array (${esc(SEASONS[h.season].label.toLowerCase())})</div><div class="tbig">${r1(p.arrayKw)} kW</div><div class="small muted">${p.k} kWh/day per kW in MN</div></div>
        <div class="tile"><div class="eyebrow-s">Battery</div><div class="tbig">${r1(p.battKwh)} kWh</div><div class="small muted">inverter at least ${r1(p.invKw)} kW</div></div>
      </div>
      <p class="small">Counted at once: always-on items plus your top ${esc(String(h.atOnce))} tools: ${esc(topNames)}. Motors can surge 2 to 3 times their running watts for a second at start.</p>
      ${p.needs240.length?`<p class="small"><b>Needs 240V:</b> ${esc(p.needs240.map(t=>t.name).join(', '))}.</p>`:''}
      ${grid?`<div class="warnbox small"><b>Grid power looks more practical here.</b><ul class="small">${p.reasons.map(r=>`<li>${esc(r)}</li>`).join('')}</ul>A common middle path: grid subpanel for the big tools and heat, plus a small solar setup for lights and battery chargers.</div>`
        :`<div class="goodbox small">This load is small enough that off-grid solar is realistic, at least outside winter.</div>`}`;
  }

  function view(){
    const h=st();
    const P=(title,body,extra)=>`<section class="panel money"${extra||''}><h2>${title}</h2>${body}</section>`;

    const examples=[
      {t:'Solar-powered work shed, Augsburg University (Minneapolis)', src:'Open Rivers, Univ. of Minnesota, 2023', u:'https://openrivers.lib.umn.edu/article/solar-shed',
       d:'Students and a professor built an 8x8 ft outdoor maker shed in summer 2022 for building boats, benches and paddles. Six 320 W Renogy panels sit on a 45 degree roof, feeding a 24V battery bank and a 4,000 W pure sine inverter that runs corded power tools. No heat; it is a three-season space. About $9,000 in materials, with the solar part about $5,500 to $6,100. A good Minnesota proof that small off-grid tool use works.'},
      {t:'Prefab Tuff Shed turned solar workshop', src:'The Home Depot, project guide', u:'https://www.homedepot.com/c/ap/transforming-a-pre-fabricated-tuff-shed-into-a-solar-powered-workshop/9ba683603be9fa5395fab9011574fa07',
       d:'A 10x12 Tuff Shed (assembled by a crew in 3 to 4 hours) with a 400 W off-grid kit, charge controller, four 6V golf-cart style batteries and an inverter feeding two outlets. Its main job is charging 18V and 40V cordless tool batteries and running light power tools. No heat or cooling, and no total cost given. Shows what a "starter" solar shed can and cannot do.'},
      {t:'"Big Shed" off-grid test with welders', src:'Hunting for George blog', u:'https://www.huntingforgeorge.com/blog/inside-the-big-shed-project-can-i-run-it-off-grid/',
       d:'A large steel shed (about 33x49 ft, tall walls, planned mezzanine) in Victoria, Australia, running welders, drop saws, table saws and LED high bays from an EcoFlow Delta Pro 3 with 12 kWh of battery and three 400 W panels to start. The owner tops up from mains now and then. Mild climate and no heating, so it is a best case. In Minnesota the same setup would struggle in winter.'},
      {t:'"The Gunner Garage" detached shop (Lino Lakes, MN)', src:'Garage Journal forum build thread', u:'https://www.garagejournal.com/forum/threads/the-gunner-garage.393507/',
       d:'A Minnesota homeowner built a 28x32 ft detached shop with 10 ft walls about 30 ft from the house, doing most work with family and neighbors and hiring out shingles and siding. Fully insulated and drywalled, with in-floor (PEX radiant) heat poured into the slab. Photo-heavy thread, good for seeing a cold-climate build step by step. No costs posted.'},
      {t:'Turn your garage into a real workshop', src:'Fine Woodworking (Michael Pekovich)', u:'https://www.finewoodworking.com/2010/10/28/turn-your-garage-into-a-real-workshop',
       d:'A Fine Woodworking editor turned his two-car Connecticut garage into a year-round shop on a tight budget. His first propane heater could not keep up with the uninsulated roof, walls and cold slab; he burned through a 60 gallon tank in under a month. Insulating walls, ceiling and floor and adding drywall fixed it. Lesson: insulate before you buy a bigger heater. (Part of the article is paywalled.)'},
      {t:'Cold-weather woodworking', src:'Fine Woodworking, 2025', u:'https://www.finewoodworking.com/2025/01/15/cold-weather-woodworking-part-1',
       d:'A furniture maker working in an early-1900s farmhouse shop heats with a pellet stove and insulated ceilings, walls and floors with mineral wool, which is nonflammable and quieter. She covers windows with marine vinyl in winter and adds 2 in foam to a drafty barn door. Practical tips for glue and finish temperatures too.'},
      {t:'Separating metalworking from woodworking in one shop', src:'Garage Journal forum thread', u:'https://www.garagejournal.com/forum/threads/separating-metal-working-from-other-areas.556869/',
       d:'Shop owners share how they keep grinding sparks and welding away from wood: welding blankets or curtains hung from pipe or door tracks, a separate walled bay with an exhaust fan, tools on wheels to roll outside for dirty work, and putting wood and metal at opposite ends of a larger shop. One notes plasma and grinding make far more mess than sawdust.'},
      {t:'Pole barn workshop with radiant floor', src:'Sawmill Creek forum thread', u:'https://sawmillcreek.org/threads/new-pole-barn-workshop.188708/',
       d:'An Indiana builder compared quotes from several pole barn companies for a 24x50 building split between horse barn and shop, and priced hot-water in-floor heat run from a gas water heater. Replies stress a closed radiant loop, a backup heater, and bigger electrical service: one member outgrew 100 amps after adding larger tools.'}
    ];

    const tiers={
      wood:[
        {n:'Essentials', r:'$1,500 to $3,500', items:'Jobsite or contractor table saw ($400 to $900), miter saw ($250 to $700), circular or track saw ($150 to $700), drill/driver set ($150 to $350), random orbit sander ($80 to $200), router ($150 to $350), clamps ($200 to $500), shop vac with dust separator ($150 to $300), safety glasses, hearing protection, push sticks.'},
        {n:'Next', r:'$3,000 to $7,000', items:'14 in bandsaw ($900 to $1,800), benchtop planer ($500 to $900), jointer ($400 to $1,500), 1.5 to 2 HP dust collector ($400 to $1,200), drill press ($300 to $1,000), air filtration box ($300 to $500), workbench and outfeed table (DIY lumber $300 to $800).'},
        {n:'Dream', r:'$10,000 to $25,000+', items:'3 HP cabinet saw with flesh-sensing brake ($3,500 to $4,500), jointer/planer combo ($3,000 to $6,000), cyclone dust collection with ducting ($2,000 to $4,000), CNC router ($2,000 to $8,000), lathe ($1,000 to $4,000).'}
      ],
      metal:[
        {n:'Essentials', r:'$1,500 to $3,500', items:'Multi-process 120/240V MIG welder ($600 to $1,500), auto-darkening helmet ($100 to $300), leather gloves and FR jacket ($100 to $200), two or three angle grinders with flap and cut-off discs ($150 to $400), steel welding table or cart ($300 to $1,200), clamps and magnets ($150 to $300), abrasive or cold-cut chop saw ($200 to $500).'},
        {n:'Next', r:'$2,500 to $6,000', items:'45 A plasma cutter ($600 to $2,000), metal-cutting bandsaw ($300 to $1,500), AC/DC TIG welder for aluminum ($1,200 to $3,000), bench grinder and belt sander ($200 to $600), fume extractor or exhaust fan ($300 to $1,500).'},
        {n:'Dream', r:'$15,000 to $40,000+', items:'xTool MetalFab laser welder and CNC cutter ($4,700 to $18,000+ by bundle), metal lathe ($2,000 to $8,000), mill ($3,000 to $10,000), CNC plasma table ($5,000 to $15,000), sheet metal brake and roller ($1,000 to $4,000).'}
      ]
    };
    const tierHtml=(arr,title)=>`<div class="panel-in"><h3>${title}</h3>${arr.map(t=>`<details><summary><b>${t.n}</b> <span class="muted small">${t.r}</span></summary><p class="small">${t.items}</p></details>`).join('')}</div>`;

    const toolRows=TOOLS.map(t=>`<tr><td><label><input type="checkbox" data-hb-tool="${t.id}" ${h.tools[t.id]?'checked':''}> ${esc(t.name)}</label>${t.always?' <span class="small muted">(counts as always on)</span>':''}</td><td class="num">${r0(t.w)}</td><td>${esc(t.v)}</td><td>${t.need?'<b>Yes</b>':'No'}</td></tr>`).join('');

    const hobbies=[
      {t:'Small hobby farm or animal shelter', u:'https://extension.umn.edu/small-scale-poultry/caring-chickens-cold-weather', s:'UMN Extension',
       d:'Backyard chickens are the easiest start. University of Minnesota Extension says to insulate and seal the coop but keep it ventilated so moisture and ammonia do not cause frostbite, and to use heated waterers. Heat lamps cause coop fires; use caged poultry lamps and have an electrician wire any permanent power. Check your city rules: many limit hens and ban roosters.'},
      {t:'Garden, cold frames and a hoop house', u:'https://hort.extension.wisc.edu/articles/extending-garden-season/', s:'UW-Madison Extension',
       d:'In a short northern season, cold frames are the most useful add-on for early greens and hardening off seedlings, and a plastic hoop house can add roughly six to eight weeks. Vent them on sunny days so plants do not cook. A shop wall facing south is a great spot for a lean-to cold frame.'},
      {t:'Home gym (CrossFit style)', u:'https://library.crossfit.com/free/pdf/cfjissue1_Sep02.pdf', s:'CrossFit Journal, 2002',
       d:'The very first CrossFit Journal issue was about building a garage gym: rubber stall mats, a bar and bumper plates, a rack, pull-up bar, rings, rower, kettlebells and boxes. About 400 sq ft works and some fit in under 200. A bay in a 24x30 shop or one stall of the garage can do it, but keep it separate from welding dust and sawdust.'}
    ];

    return `<div class="stack">
      ${P('Hobbies and property', `
        <p>Ideas for setting up your property for hobbies after you retire from the Army: a heated backyard shop for woodworking and metalworking, power options, the xTool MetalFab, and a few other setups. Everything here is general and educational. All prices are <b>rough 2026 planning ranges</b>, not quotes. Get local bids before you commit.</p>
        <p class="small muted">Sources: Univ. of Minnesota Open Rivers, Fine Woodworking, Garage Journal, Sawmill Creek, Home Depot, Bob Vila, ThePricer, Summertown Metals, Budget Heating, Woodcraft, EnergySage, NRG Clean Power, EIA, YCharts, MN DNR, ProfileSolar, xTool and xTool Support, OSHA, MN Revisor, City of Hermantown, UMN Extension, UW Extension, CrossFit (2022 to 2026).</p>`)}

      ${P('Examples from other people', `<div class="grid2">${examples.map(e=>`<div class="panel-in"><h3>${esc(e.t)}</h3><p class="small muted">${esc(e.src)}</p><p class="small">${esc(e.d)}</p><a class="small" href="${e.u}" target="_blank" rel="noopener">Read it</a></div>`).join('')}</div>`)}

      ${P('Workshop planner', `
        <div class="stack">
          <div><div class="eyebrow-s">Building size</div>${seg('size',SIZES,h.size)}</div>
          <div><div class="eyebrow-s">Build type</div>${seg('build',BUILDS,h.build)}</div>
          <div><div class="eyebrow-s">Insulation</div>${seg('insul',INSUL,h.insul)}</div>
          <div><div class="eyebrow-s">Power</div>${seg('power',POWERS,h.power)}</div>
          <div><div class="eyebrow-s">Winter heat</div>${seg('heat',HEATS,h.heat)}</div>
          <div><div class="eyebrow-s">Summer cooling</div>${seg('cool',COOLS,h.cool)}</div>
          <div><div class="eyebrow-s">Keep the shop at (when not in use)</div>${seg('keep',Object.fromEntries(KEEP.map(k=>[k,{label:k+' F'}])),h.keep)}</div>
          <div class="fields">
            <label class="f">Hours per week you work in it (heated to 62 F)<input type="number" min="0" max="80" step="1" data-hb-num="useHrs" value="${esc(String(h.useHrs))}"></label>
            <label class="f">Electricity, $ per kWh<input type="number" min="0" step="0.01" data-hb-num="elec" value="${esc(String(h.elec))}"></label>
            <label class="f">Propane, $ per gallon<input type="number" min="0" step="0.05" data-hb-num="propane" value="${esc(String(h.propane))}"></label>
            <label class="f">Natural gas, $ per therm<input type="number" min="0" step="0.05" data-hb-num="ngas" value="${esc(String(h.ngas))}"></label>
            <label class="f">Firewood, $ per cord<input type="number" min="0" step="10" data-hb-num="cord" value="${esc(String(h.cord))}"></label>
          </div>
          <p class="small muted">Defaults: Minneapolis electricity about 18 cents/kWh (EnergySage, Oct 2026), Minnesota propane about $1.90/gal (YCharts, Oct 2026, often higher mid-winter), gas about $1.06/therm (EIA 2025). Firewood price is a guess; free if you cut your own.</p>
          <div id="hb-plan-out">${plannerOut(h)}</div>
          <details><summary>How each heat choice compares</summary><ul class="small">
            <li><b>Mini-split heat pump:</b> heats and cools, no flame, no fumes. Cold-climate models keep working well below zero but get less efficient. Keep the indoor head away from sawdust or filter often.</li>
            <li><b>Propane or natural gas unit heater:</b> cheap to buy and fast to heat. Use a vented or sealed-combustion model so sawdust and finish fumes never reach an open flame. Natural gas is usually cheaper to run if a line can reach the shop.</li>
            <li><b>Wood stove:</b> lowest fuel cost if you have wood, but it is an open flame in a dusty room. Talk to your insurer first; many ask about it or charge more. Never burn sawdust or scraps unless the stove is rated for it.</li>
            <li><b>Radiant floor:</b> the most comfortable heat for standing on concrete. About $12 per sq ft (Woodcraft) and it must go in with the slab. Slow to warm up, so it runs all winter.</li>
            <li><b>Electric heater or panels:</b> cheapest to install, most expensive to run. Fine for a small insulated shed used a few hours a week.</li>
          </ul></details>`)}

      ${P('Power sizing helper', `
        <p class="small">Check the tools you plan to have. Running watts are typical values; always check the nameplate on your actual tool.</p>
        <div class="tbl-wrap"><table class="mtbl"><thead><tr><th>Tool</th><th class="num">Running W</th><th>Voltage</th><th>Needs 240V</th></tr></thead><tbody>${toolRows}</tbody></table></div>
        <div class="fields">
          <label class="f">Big tools running at the same time<select data-hb-sel="atOnce">${[1,2,3,4].map(n=>`<option value="${n}" ${+h.atOnce===n?'selected':''}>${n}</option>`).join('')}</select></label>
          <label class="f">Shop hours per week<input type="number" min="0" max="80" step="1" data-hb-num="shopHrs" value="${esc(String(h.shopHrs))}"></label>
          <label class="f">Season to size for<select data-hb-sel="season">${Object.entries(SEASONS).map(([k,s])=>`<option value="${k}" ${h.season===k?'selected':''}>${s.label} (${s.k} kWh/day per kW)</option>`).join('')}</select></label>
          <label class="f">Days of battery backup (cloudy days)<select data-hb-sel="days">${[1,2,3,4].map(n=>`<option value="${n}" ${+h.days===n?'selected':''}>${n}</option>`).join('')}</select></label>
        </div>
        <div id="hb-pw-out">${powerOut(h)}</div>
        <p class="small muted">Sun figures are Minneapolis output per kW of panels at a good tilt (ProfileSolar). Winter gives about a third of summer. Average draw assumes tools run about 35% of the time you are in the shop. Battery holds the bigger of one work session or your chosen backup days, with 20% kept in reserve.</p>
        <div class="warnbox small"><b>Electrician and permits.</b> A shop feeder, subpanel, 240V welder or MetalFab circuit, and any solar or battery system need an electrical permit and inspection in Minnesota. Minnesota lets homeowners do some wiring on their own home with a permit, but for a detached shop with welders, hire a licensed electrician. Solar and batteries also need a permit and, if tied to the grid, utility approval.</div>`)}

      ${P('xTool MetalFab: laser welder and CNC cutter', `
        <div class="grid2">
          <div class="panel-in"><h3>What it is</h3><ul class="small">
            <li>A handheld <b>fiber laser welder</b> (800 W or 1200 W) that also does <b>laser cleaning</b> (rust, paint) and handheld cutting, plus an optional <b>CNC cutter</b> bed the welder plugs into.</li>
            <li>Welds steel and stainless up to about 5 mm (1200 W) or 4 mm (800 W). Wire feeder for filler wire. Swap between welding and cutting in about 30 seconds.</li>
            <li>CNC cutting, burr-free: 1200 W cuts about 10 mm carbon steel, 5 mm stainless, 4 mm aluminum, 3 mm brass; up to 12 mm mild steel with some dross.</li>
            <li>Aluminum and brass are mostly cut and marked, not welded, per xTool's community guide, though xTool sells 6061 aluminum wire. Ask xTool about aluminum welding before you count on it.</li>
            <li>This is a different class of machine from your existing xTool desktop laser. That one engraves and cuts thin material inside a box; MetalFab is an open-beam industrial laser.</li>
          </ul></div>
          <div class="panel-in"><h3>Price (US, rough, mid 2026)</h3><div class="pl-list small">
            <div class="pl-row"><span>800 W welder</span><span class="amt">about $4,700</span></div>
            <div class="pl-row"><span>1200 W welder</span><span class="amt">about $8,000</span></div>
            <div class="pl-row"><span>CNC cutter add-on (needs welder)</span><span class="amt">about $9,000</span></div>
            <div class="pl-row"><span>1200 W welder + cutter</span><span class="amt">$14,000 to $16,000</span></div>
            <div class="pl-row"><span>All-in-one with safety bundle</span><span class="amt">about $18,000+</span></div>
            <div class="pl-row"><span>Plus: argon/nitrogen, extraction, curtains, 240V circuit</span><span class="amt">$1,500 to $5,000</span></div>
          </div><p class="small muted">xTool runs frequent sales and stock changes. Check xtool.com for today's price.</p></div>
          <div class="panel-in"><h3>Power and space</h3><ul class="small">
            <li>Welder: <b>200 to 240V</b>. 1200 W needs a <b>21 A or larger</b> circuit (up to 4,200 W draw); 800 W needs 15 A or more (up to 3,000 W). US plugs listed as NEMA 50 A or 30 A style, so plan a dedicated 240V circuit.</li>
            <li>CNC cutter runs on 100 to 240V.</li>
            <li>Shielding gas: argon or nitrogen at 99.99% purity, 15 to 30 L/min for welding. Cutting uses 600 to 800 kPa (about 87 to 116 psi) gas or air. Cleaning can use compressed air.</li>
            <li>Operating range is -10 C to 40 C (14 F to 104 F), so the shop must be heated in a Minnesota winter.</li>
            <li>Plan a dedicated metal bay, roughly 8x10 ft or more (our estimate), with a metal table, gas cylinder chained to the wall, and no wood nearby.</li>
          </ul></div>
          <div class="panel-in"><h3>Safety needs</h3><ul class="small">
            <li>The working laser is <b>Class 4</b> at 1080 nm. Everyone in the area needs laser goggles or a face shield rated for 1080 nm at <b>OD 6+</b>. Welding helmets alone are not enough unless laser-rated.</li>
            <li>xTool says to set up a <b>laser controlled area</b> with an interlock, keep untrained people, kids and pets out, and not to use it in residential or public areas. In a backyard shop that means a closed room, laser-rated curtains, covered windows and a locked door.</li>
            <li>Fire: CO2 extinguisher on hand, flammables kept far away (xTool says 10 m), never leave it running, clean chips after each job.</li>
            <li>Fumes: welding, cutting and cleaning make toxic fumes and ozone. Use exhaust and fume extraction. Never cut PVC, vinyl or unknown coatings; galvanized steel needs extra ventilation.</li>
            <li>xTool sells a SafetyPro bundle and a fire safety kit; check exactly what they include.</li>
          </ul></div>
        </div>
        <div class="panel-in"><h3>What it would let you make</h3><p class="small">Steel and stainless projects with clean, thin welds and little grinding: fire pits and camp grills, shelf brackets and scrollwork, signs and wall art, custom shop tools like welding squares, brackets and mounts for trucks and trailers, garden gates and planters, steel-and-wood furniture bases that pair with your woodworking. xTool's own gallery shows a folding fire pit, a stainless camping grill, and a steampunk desk lamp.</p></div>`)}

      ${P('Starter tool lists', `
        <div class="grid2">${tierHtml(tiers.wood,'Woodworking')}${tierHtml(tiers.metal,'Metalworking')}</div>
        <p class="small muted">Price ranges are rough 2026 retail ranges for hobby-grade to prosumer tools. Used tools from estate sales and Facebook Marketplace often cost half.</p>
        <div class="panel-in"><h3>Shop safety basics</h3><ul class="small">
          <li><b>Fire extinguishers:</b> a 10 lb ABC dry chemical by each door. Add a CO2 unit near the laser and electronics. Add a Class D extinguisher only if you grind or machine magnesium or titanium. Never use water on a metal or electrical fire.</li>
          <li><b>Never weld near sawdust.</b> OSHA's welding rule is to move combustibles 35 ft away or shield them with fire-resistant covers. Sweep before every metal session and keep a fire watch for 30 minutes after hot work.</li>
          <li><b>Dust collection:</b> a dust collector or shop vac at every machine, plus an air filter. Fine dust is both a lung and a fire hazard. Keep separate collection for wood and metal (sparks in a wood dust bin can start a fire).</li>
          <li><b>Welding fumes:</b> exhaust fan that pulls fumes away from your face, plus a fume extractor or respirator for galvanized or stainless work.</li>
          <li><b>CO and smoke alarms:</b> required in practice with any propane, gas or wood heater. Use vented heaters only.</li>
          <li>Eye and ear protection always, auto-darkening helmet for arc welding, laser-rated eyewear for any laser, no loose sleeves around spinning tools.</li>
        </ul></div>`)}

      ${P('Other hobby setups on your property', `<div class="grid3">${hobbies.map(x=>`<div class="panel-in"><h3>${esc(x.t)}</h3><p class="small">${esc(x.d)}</p><a class="small" href="${x.u}" target="_blank" rel="noopener">${esc(x.s)}</a></div>`).join('')}</div>`)}

      ${P('Minnesota rules to check', `<ul class="small">
        <li><b>Building permit:</b> Minnesota's state building code exempts a one-story detached accessory building of <b>200 sq ft or less</b> (a 12x16 is 192) from a building permit. Electrical, plumbing and mechanical permits are still required. Bigger buildings need a building permit and inspections.</li>
        <li><b>Zoning still applies to every size:</b> setbacks from lot lines and the house, maximum total accessory building area, wall and roof height, how many accessory buildings you can have, and sometimes siding that matches the house.</li>
        <li><b>Who to call:</b> your city planning office if you are in a city; if in a township, ask the township and the county, since many townships use county zoning. Shoreland and floodplain areas have extra rules.</li>
        <li><b>Home business in the shop:</b> selling what you make can count as a "home occupation." Some cities limit or ban it in detached garages (Hermantown, for example, caps garage use and bans outdoor storage and signs). It can also change your homeowner's insurance; tell your insurer and ask about a business rider.</li>
        <li>Call Gopher State One Call (811) before you trench for power or set posts.</li>
      </ul>`)}
    </div>`;
  }

  function refresh(){
    const h=st();
    const a=$('#hb-plan-out'); if(a) a.innerHTML=plannerOut(h);
    const b=$('#hb-pw-out'); if(b) b.innerHTML=powerOut(h);
  }

  function bind(){
    const h=st();
    $$('[data-hb-set]').forEach(btn=>btn.addEventListener('click',()=>{
      const k=btn.dataset.hbSet; let v=btn.dataset.val;
      if(k==='keep') v=+v;
      h[k]=v; save(); render();
    }));
    $$('[data-hb-num]').forEach(inp=>{
      inp.addEventListener('input',()=>{ const k=inp.dataset.hbNum; h[k]=Math.max(0,num(inp.value,0)); refresh(); });
      inp.addEventListener('change',()=>{ save(); });
    });
    $$('[data-hb-sel]').forEach(sel=>sel.addEventListener('change',()=>{
      const k=sel.dataset.hbSel; h[k]=(k==='season')?sel.value:+sel.value; save(); refresh();
    }));
    $$('[data-hb-tool]').forEach(cb=>cb.addEventListener('change',()=>{
      h.tools[cb.dataset.hbTool]=cb.checked?1:0; save(); refresh();
    }));
  }

  TABS2.push({id:ID, name:'Hobbies & property', order:50, view, bind});
})();
