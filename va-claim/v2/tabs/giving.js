// Giving tab: ways to use money, time and skills for good. Educational only, not advice.
// Sources (checked October 2026):
// - 2026 charitable rules (non-itemizer $1,000/$2,000, 0.5% AGI floor, 35% cap, QCD $111,000):
//   https://www.cpapracticeadvisor.com/2026/02/18/planning-for-charitable-contributions-in-2026/178317/
//   https://www.desmoinesfoundation.org/about-us/news/a-checklist-for-charitable-tax-rules-in-2026
//   https://www.berrydunn.com/news-detail/obbba-is-now-law-what-it-means-for-nonprofits
// - QCD cannot come from TSP/401(k); roll to an IRA first:
//   https://www.fedsmith.com/2022/04/05/valuable-tax-benefits-for-ira-owners-who-give-to-charities/
// - Minnesota charitable subtraction for non-itemizers: https://www.revenue.state.mn.us/mndor-pp/1216?type=html
// - DAF minimums and fees: https://www.daffy.org/comparison
//   https://www.minneapolisfoundation.org/wp-content/uploads/2025/03/DAF-policies-2025.pdf
//   https://spmcf.org/advisors/charitable-fund-fees
// - Scholarship minimums and payout: https://give.umn.edu/giving/endowment (UMN: $50,000 minimum, 4.5% payout)
//   https://www.nwmf.org/ways-to-give/scholarships/ ($25,000 scholarship endowment minimum)
//   https://www.winonahealth.org/phyllis-a-mcclenathan-nursing-scholarship/
// - Charitable remainder trusts: https://www.law.cornell.edu/wex/charitable_remainder_trust
// - Starting a Minnesota nonprofit (fees, AG filings, $750,000 audit threshold):
//   https://www.minnesotanonprofits.org/resources-tools/starting-a-nonprofit/forms-fees-publications
//   https://minnesotanonprofits.org/maintaining-a-nonprofit/state-compliance
//   https://www.harborcompliance.com/minnesota-nonprofit-compliance
//   https://www.mjcpa.com/nonprofit-start-ups-form-1023-or-1023-ez/
// - Private foundation tax increase dropped from final 2025 law (rate stays 1.39%):
//   https://www.berrydunn.com/news-detail/obbba-is-now-law-what-it-means-for-nonprofits
// - Conservation easements: https://www.honkamp.com/protect-your-land-and-get-a-deduction/
//   https://mnland.org/2019/06/11/protecting-the-family-farm
// - Estate tax 2026 (MN $3M, federal $15M): https://www.farrishlaw.com/minnesota-estate-tax-exemption-2026-what-you-need-to-know/
// - Charity checks: https://smartgivers.org/standards
// - Team Rubicon in Minnesota, 2026: https://www.valleynewslive.com/2026/07/15/veteran-led-disaster-response-team-helps-detroit-lakes-homeowners-after-tornado/
(()=>{
  const DEF={award:2000, payout:4.5, ret:7, infl:2.5, monthly:150, lump:0,
    stock:10000, basis:4000, bracket:22, cg:15, done:{}};
  function st(){
    if(!S.giving||typeof S.giving!=='object') S.giving={};
    for(const k in DEF) if(S.giving[k]===undefined) S.giving[k]=(k==='done'?{}:DEF[k]);
    return S.giving;
  }
  const num=(v,d)=>{const n=parseFloat(v); return isFinite(n)?n:d;};
  const a=(href,txt)=>`<a href="${href}" target="_blank" rel="noopener">${txt}</a>`;

  // ---------- Vehicle cards ----------
  const CARDS=[
    {k:'money', icon:'💵', t:'Direct gifts and monthly giving', tag:'Start here. Any amount.',
     how:'Give cash, a check or a card gift straight to a charity. A monthly "sustainer" gift (like the public TV membership you may already have) is easy to budget and charities love it because it is steady.',
     cost:'No minimum. No setup cost. Card fees are usually small and paid by the charity.',
     tax:`<b>New for 2026:</b> if you take the standard deduction, you can deduct up to <b>$1,000</b> (single) or <b>$2,000</b> (married filing jointly) of <b>cash</b> gifts to public charities. Gifts to donor-advised funds and private foundations do not count for this. <b>If you itemize:</b> only the part of your gifts above <b>0.5% of your AGI</b> is deductible (example: AGI $100,000, the first $500 does not count). Top-bracket (37%) itemizers get a benefit capped at 35%. Minnesota also has its own subtraction for non-itemizers who give more than $500.`,
     pros:['Simple and immediate','Builds a habit and a relationship with the charity','Now deductible even without itemizing (cash only)'],
     cons:['Little tax help for small gifts if you itemize, because of the 0.5% floor','Many small gifts to many charities spread your impact thin'],
     ex:'Minnesota\'s statewide giving day, Give to the Max Day (GiveMN), happens each November and many gifts get matched. A $15 a month public TV membership is $180 a year of steady support.',
     extra:`<div class="small"><b>Check a charity before you give:</b> ${a('https://www.charitynavigator.org','Charity Navigator')} (ratings), ${a('https://www.guidestar.org','Candid / GuideStar')} (Form 990s and profiles), ${a('https://smartgivers.org','Minnesota Charities Review Council')} (Minnesota "Meets Standards" seal), and the ${a('https://www.ag.state.mn.us/Charity/','Minnesota Attorney General charity search')}. Keep a receipt; any single gift of $250 or more needs a written acknowledgment from the charity.</div>`},
    {k:'money', icon:'🗂️', t:'Donor-advised fund (DAF)', tag:'A "charity savings account".',
     how:'You put cash or investments into a DAF account at a sponsor. You get the tax deduction the year you put money in. The money can be invested and grow tax-free. Later, at your own pace, you recommend grants to any qualified charity.',
     cost:'National sponsors: Fidelity Charitable and Schwab DAFgiving360 have $0 to open, $50 minimum grant, about 0.60% a year admin fee (Fidelity: at least $100/year). Vanguard Charitable: $25,000 to open. Local: Minneapolis Foundation and Saint Paul & Minnesota Foundation start at $10,000, with higher fees but local know-how.',
     tax:'Deduction only if you itemize (subject to the 2026 0.5%-of-AGI floor). Cash gifts deductible up to 60% of AGI, appreciated stock up to 30%. Give stock held over a year and you skip the capital gains tax and deduct full market value. DAF gifts do <b>not</b> count for the new non-itemizer deduction. Many people "bunch" several years of giving into one DAF year to clear the standard deduction.',
     pros:['Give appreciated stock with no capital gains tax','One receipt; the sponsor handles paperwork','Can name your kids as successor advisors to teach giving'],
     cons:['Gift is permanent; you cannot take it back','Annual fees','Cannot pay for tickets, dinners or personal benefits','Not eligible for QCDs'],
     ex:'Someone with $10,000 of index-fund shares bought years ago for $4,000 moves them to a DAF in a high-income year, deducts $10,000, pays no tax on the $6,000 gain, and then grants $1,000 a year to favorite charities. See the calculator below.'},
    {k:'money', icon:'🏦', t:'Qualified charitable distribution (QCD)', tag:'For later: age 70½ and up.',
     how:'Once you are 70½, your IRA custodian can send money straight from your IRA to a charity. The money never counts as your income. After your required minimum distributions (RMDs) start, a QCD also counts toward your RMD.',
     cost:'No setup cost. Just a form at your IRA custodian. The check must go directly to the charity.',
     tax:'<b>2026 limit: $111,000</b> per person (each spouse can do their own). There is also a one-time QCD of up to $55,000 into a charitable remainder trust or charitable gift annuity. No deduction on top (the income was never counted). Helpful for people who take the standard deduction. <b>Not allowed from the TSP, a 401(k) or 403(b).</b> You would roll TSP money into an IRA first. Cannot go to a DAF or private foundation.',
     pros:['Lowers taxable income, which can help with Medicare premiums and Social Security taxation','Works even if you do not itemize'],
     cons:['Only from IRAs, only at 70½+','Paperwork must be right: get a receipt and tell your tax preparer'],
     ex:'A 74-year-old has a $6,000 RMD. She sends $3,000 of it as a QCD to her church and a food shelf. Only $3,000 shows up as income.'},
    {k:'study', icon:'🎓', t:'Scholarships', tag:'Help a student become a nurse, or help a military kid.',
     how:'You create a fund at a school (college foundation) or at a community foundation. A committee picks students using your criteria (for example: nursing students, or children of service members, from a certain county). You usually cannot pick the winner yourself, which keeps the tax deduction.',
     cost:'<b>Annual (pass-through):</b> you give the award money each year, often $1,000 to $5,000; no big minimum. <b>Endowed:</b> one fund that lasts forever. Examples: University of Minnesota $50,000 minimum; many community foundations $25,000 (Northwest Minnesota Foundation; Saint Paul & Minnesota Foundation designated education funds). Many let you build to the minimum over about 5 years.',
     tax:'Deductible as a gift to a public charity (same rules as direct gifts or a DAF). <b>How payout works:</b> an endowment spends a set percent each year, often 4% to 5% (UMN uses 4.5%). The rest of the return stays in the fund so the award can grow with inflation. $50,000 at 4.5% gives about $2,250 a year.',
     pros:['Lasting, personal legacy (can carry your name or honor someone)','Directly grows the nursing or military-family pipeline'],
     cons:['Endowed funds need a lot of money for a modest award','You give up control over who is chosen','Pass-through stops when you stop giving'],
     ex:'The Phyllis A. McClenathan Nursing Scholarship at the Winona Health Foundation: a husband created an endowment in memory of his wife, a registered nurse. It pays a $1,000 scholarship each year to a nursing student entering the final year.'},
    {k:'money', icon:'📜', t:'Trusts, wills and beneficiary forms', tag:'Give later, sometimes with income now.',
     how:`<ul class="small">
       <li><b>Charitable remainder trust (CRT):</b> you move assets in; the trust pays you (or others) income for life or up to 20 years (5% to 50% a year); at least 10% of the starting value must be left for charity at the end.</li>
       <li><b>Charitable lead trust (CLT):</b> the reverse. Charity gets payments for a set time, then what is left goes to your family. Mostly used to cut gift or estate tax on large estates.</li>
       <li><b>Will or revocable living trust bequest:</b> one sentence leaves a dollar amount, a percent, or what is left to a charity. You keep full control while alive.</li>
       <li><b>Beneficiary designation:</b> name a charity on an IRA, TSP, life insurance or bank account (payable on death). Retirement money is often the best asset to leave to charity because a charity pays no income tax on it, while your heirs would.</li></ul>`,
     cost:'Beneficiary form: free. Will or trust update: often a few hundred to a few thousand dollars with an attorney. CRT or CLT: legal and admin costs usually make them worth it only for six figures and up (often $250,000+, commonly cited, varies).',
     tax:'CRT/CLT: partial income-tax deduction now, based on IRS tables. A CRT can sell appreciated property without paying capital gains up front. Bequests are fully deductible for estate tax. 2026 estate tax: federal exemption $15 million per person; <b>Minnesota estate tax starts at $3 million</b>, so a farm share plus other assets could matter. Charitable gifts lower a taxable estate.',
     pros:['Bequests and beneficiary forms cost nothing now and can be changed','CRT gives lifetime income plus a gift'],
     cons:['CRT and CLT are irrevocable and complex','Rules depend on the farm trust and family; get professional help'],
     ex:'Example language: "I give 10% of my residuary estate to [charity name, EIN]." Using a percent keeps the gift in balance if your wealth changes.',
     extra:'<div class="warnbox small">Trusts are legal documents. Talk to a Minnesota estate planning attorney and a fee-only (fiduciary) financial advisor before setting one up. Do not change anything about the family farm trust without the trustee and your siblings.</div>'},
    {k:'money', icon:'🏛️', t:'Starting a nonprofit (501(c)(3))', tag:'Biggest workload. Consider the alternatives first.',
     how:`<ol class="small">
       <li>Choose a name and a board (Minnesota needs at least 3 directors under Minn. Stat. 317A).</li>
       <li>File Articles of Incorporation with the Minnesota Secretary of State ($70 by mail, $90 online).</li>
       <li>Get an EIN from the IRS (free) and write bylaws and a conflict of interest policy.</li>
       <li>Apply for 501(c)(3) status: Form 1023-EZ ($275) if you expect under $50,000 a year in revenue and under $250,000 in assets, otherwise Form 1023 ($600).</li>
       <li>Register with the Minnesota Attorney General ($25) once you raise over $25,000 a year or use paid fundraisers.</li>
       <li>Every year: Secretary of State renewal by Dec 31 (free), IRS Form 990/990-EZ/990-N, and the Attorney General annual report ($25, due July 15 for a calendar year). Audit required above $750,000 revenue.</li></ol>`,
     cost:'About $400 to $1,000 in fees to start, plus your time. Many people pay a lawyer or accountant $1,000 to $5,000. Ongoing: bookkeeping, insurance, board meetings, filings, fundraising. Plan on many hours a month.',
     tax:'Donors to your 501(c)(3) can deduct gifts. You, as founder, can deduct your own cash gifts, but not the value of your time.',
     pros:['Full control of a mission you care about','Can apply for grants'],
     cons:['Ongoing work for years; many small nonprofits close within a few years','It is not yours: it belongs to the public and is run by a board'],
     ex:'Team Rubicon was started in 2010 by two Marine veterans after the Haiti earthquake and now has thousands of veteran volunteers. It started small.',
     extra:'<div class="goodbox small"><b>Easier alternatives:</b> <b>Fiscal sponsorship</b> (an existing nonprofit holds your project and does the paperwork for a fee, often 5% to 10%) or a <b>named fund at a community foundation</b> (they handle the legal side). You can test an idea this way before forming a nonprofit.</div>'},
    {k:'money', icon:'🏰', t:'Private foundation', tag:'For large, multi-generation giving.',
     how:'A separate legal charity that you and your family control. It invests its money and makes grants. It can hire family (at fair pay) and run for generations.',
     cost:'Advisors often suggest $1 million or more because of legal, accounting and filing costs (several thousand dollars a year). Must pay out at least 5% of assets each year.',
     tax:'1.39% excise tax on net investment income (a proposed increase was dropped from the final 2025 tax law). Donor deduction limits are lower: cash up to 30% of AGI, stock up to 20%. Files Form 990-PF, which is public. Strict "self-dealing" rules.',
     pros:['Most control','Family legacy and a place to involve children'],
     cons:['Most cost and rules','Public filings show assets and grants','A DAF does most of the same for far less'],
     ex:'The Bush Foundation in Saint Paul was started in 1953 by 3M executive Archibald Bush and his wife Edyth and still makes grants across Minnesota and the Dakotas.'},
    {k:'money', icon:'🌾', t:'Land and the farm', tag:'Ideas only. Every family and trust is different.',
     how:`<ul class="small">
       <li><b>Conservation easement:</b> the owner keeps the land (and can keep farming it) but gives up the right to develop it, forever. A land trust such as the ${a('https://mnland.org','Minnesota Land Trust')} holds the easement.</li>
       <li><b>Donate land</b> (or a share) to a land trust, college, or church. Some charities also accept land in a will.</li>
       <li><b>Farm-to-community:</b> rent a few acres to beginning farmers or a community garden, donate crops to food shelves, host farm visits for schools or veterans' farming programs.</li></ul>`,
     cost:'Easements need an appraisal, survey, baseline study and legal work, often several thousand dollars, and many land trusts ask for a stewardship gift. Some public programs buy easements instead.',
     tax:'A donated easement is a charitable gift equal to the lost value. Deduction up to 50% of AGI (100% for qualified farmers and ranchers), with 15 years to use any carryover. Can also lower estate value. The IRS watches easement deals closely, so use a qualified appraiser.',
     pros:['Keeps the land as farmland for good','Can lower estate tax for the next generation'],
     cons:['Permanent; it binds every future owner','All owners or trustees must agree','Can lower the land\'s sale value'],
     ex:'Bob and Michelle Scanlan put a conservation easement on 98 acres of their family farm in Houston County with the Minnesota Land Trust. It keeps the farm in the family for cattle grazing and protects Wildcat Creek.'},
    {k:'duty', icon:'🎖️', t:'Giving time: veteran skills', tag:'Free, and often the most needed gift.',
     how:`<ul class="small">
       <li>${a('https://teamrubiconusa.org','Team Rubicon')}: veteran-led disaster response (cleanup, repairs, planning).</li>
       <li>${a('https://www.volunteer.va.gov','VA Voluntary Service')} at the Minneapolis VA or a clinic: drivers, escorts, honor guards, events.</li>
       <li>Mentor newer veterans or JROTC/ROTC cadets; be an Honor Flight guardian; serve on a veterans nonprofit board.</li></ul>`,
     cost:'Free, apart from time and mileage. Some roles need a background check or short training.',
     tax:'Time is not deductible. Unpaid out-of-pocket costs while volunteering for a charity can be (for example, 14 cents a mile for charity driving, set by law), if you itemize.',
     pros:['Uses leadership and logistics skills you already have','Connection with other veterans'],
     cons:['Disaster deployments can take days away','Pick one or two places to avoid burnout'],
     ex:'In July 2026 about 30 Team Rubicon volunteers cleared debris and made repairs for free in Detroit Lakes, Minnesota, after an EF-2 tornado.'},
    {k:'study', icon:'🩺', t:'Giving time: nursing skills', tag:'Your future license is a gift too.',
     how:`<ul class="small">
       <li>Free and community clinics (check with the Minnesota Association of Community Health Centers or local free clinics).</li>
       <li>${a('https://www.health.state.mn.us/communities/ep/mnresponds/','MN Responds Medical Reserve Corps')}: health volunteers for emergencies and vaccine clinics.</li>
       <li>Red Cross shelter or blood-drive nursing; blood-pressure and flu-shot events.</li>
       <li>Mentor or tutor nursing students once you are licensed, or guest-speak at a nursing program.</li></ul>`,
     cost:'Free. Keep your license active; some roles need an orientation. Check that the group carries volunteer liability coverage.',
     tax:'Time is not deductible. Unreimbursed supplies and mileage for a charity can be, if you itemize.',
     pros:['Keeps clinical skills sharp and builds your network','Fills real gaps in rural and low-income care'],
     cons:['Hard to fit in while in school and working shifts','Some volunteer roles need an active license first'],
     ex:'Minnesota Medical Reserve Corps units (MN Responds) call on nurse volunteers to staff emergency shelters and vaccination clinics.'}
  ];
  function list(arr){ return `<ul class="small">${arr.map(x=>`<li>${x}</li>`).join('')}</ul>`; }
  function card(c){
    return `<div class="panel ${c.k}">
      <div class="eyebrow-s">${c.icon} ${c.tag}</div>
      <h3>${c.t}</h3>
      <div class="small"><b>How it works.</b> ${c.how}</div>
      <div class="small"><b>Minimum and cost.</b> ${c.cost}</div>
      <div class="small"><b>Taxes (2026).</b> ${c.tax}</div>
      <details><summary>Pros, cons and a real example</summary>
        <div class="grid2"><div><div class="eyebrow-s pos">Pros</div>${list(c.pros)}</div>
        <div><div class="eyebrow-s neg">Cons</div>${list(c.cons)}</div></div>
        <div class="small"><b>Example.</b> ${c.ex}</div>
      </details>
      ${c.extra||''}
    </div>`;
  }

  // ---------- Endowment model ----------
  function model(g){
    const p=Math.max(0.1,g.payout)/100, r=g.ret/100, i=g.infl/100;
    const need=g.award/p;                     // today's dollars
    // Build phase: month by month until the fund reaches the inflation-grown target.
    let bal=g.lump, m=0;
    const rm=Math.pow(1+r,1/12)-1;
    const target=mm=>need*Math.pow(1+i,mm/12);
    if(bal<target(0)){
      if(g.monthly<=0 && (rm<=0 || bal<=0)) m=Infinity;
      else { while(bal<target(m) && m<600){ bal=bal*(1+rm)+g.monthly; m++; } if(m>=600) m=Infinity; }
    }
    const yrs=m/12;
    // 30-year path: contribute until target reached, then pay out each year.
    const labels=[], balS=[], paidS=[], gaveS=[]; let b=g.lump, paid=0, gave=g.lump, firstAward=null, lastAward=0;
    for(let y=0;y<=30;y++){
      labels.push(y===0?'Now':'Yr '+y);
      balS.push(Math.round(b)); paidS.push(Math.round(paid)); gaveS.push(Math.round(gave));
      if(y===30) break;
      const building = !(isFinite(yrs) && y>=Math.ceil(yrs));
      if(building){ for(let k=0;k<12;k++){ b=b*(1+rm)+g.monthly; gave+=g.monthly; } }
      else { const aw=b*p; if(firstAward===null) firstAward={y, aw}; lastAward=aw; paid+=aw; b=(b-aw)*(1+r); }
    }
    const realLast = lastAward/Math.pow(1+i,30);
    return {need, yrs, labels, balS, paidS, gaveS, firstAward, lastAward, realLast, paid, gave, real:(r-p-i)};
  }
  function modelHTML(){
    const g=st(), o=model(g);
    const yrsTxt = o.yrs===0 ? 'Already there' : isFinite(o.yrs) ? (o.yrs<1?'Under 1 year':o.yrs.toFixed(1)+' years') : 'Not reached in 50 yrs';
    const chart=lineChart({labels:o.labels, yfmt:fmtK, height:260, series:[
      {name:'Fund balance', values:o.balS, color:'var(--accent)', fill:true},
      {name:'Total scholarships paid', values:o.paidS, color:'var(--study)'},
      {name:'Total you put in', values:o.gaveS, color:'var(--s3)', dash:true}]});
    return `<div class="tiles">
      <div class="tile"><div class="eyebrow-s">Endowment needed (today's $)</div><div class="tbig">${money0(o.need)}</div><div class="small muted">${money0(g.award)} a year at ${pct1(g.payout/100)} payout</div></div>
      <div class="tile"><div class="eyebrow-s">Time to build it</div><div class="tbig">${yrsTxt}</div><div class="small muted">${money0(g.monthly)}/mo + ${money0(g.lump)} lump, target grows with inflation</div></div>
      <div class="tile"><div class="eyebrow-s">Scholarships paid by year 30</div><div class="tbig">${money0(o.paid)}</div><div class="small muted">you put in ${money0(o.gave)}${o.firstAward?`; first award about ${money0(o.firstAward.aw)} in year ${o.firstAward.y+1}`:''}</div></div>
      <div class="tile"><div class="eyebrow-s">Year-30 award in today's $</div><div class="tbig">${o.lastAward?money0(o.realLast):'n/a'}</div><div class="small muted">${o.lastAward?money0(o.lastAward)+' in future dollars':'fund still building'}</div></div>
    </div>
    ${chart}
    ${o.real<0?`<div class="warnbox small">Return minus payout (${pct1((g.ret-g.payout)/100)}) is below inflation (${pct1(g.infl/100)}), so the award will slowly lose buying power. That is why many endowments pay 4% to 5%.</div>`:`<div class="goodbox small">Return minus payout covers inflation, so the award should keep its buying power on average. Real markets go up and down.</div>`}
    <div class="small muted">Pass-through instead: giving ${money0(g.award)} a year directly helps a student right away and costs ${money0(g.award*30)} over 30 years, but stops when you stop.</div>`;
  }

  // ---------- DAF vs cash example ----------
  function dafHTML(){
    const g=st(), v=Math.max(0,g.stock), basis=Math.min(Math.max(0,g.basis),v), gain=v-basis;
    const cgTax=gain*g.cg/100, cashGift=v-cgTax;
    const A={charity:cashGift, cg:cgTax, ded:cashGift*g.bracket/100};
    const B={charity:v, cg:0, ded:v*g.bracket/100};
    A.cost=v-A.ded; B.cost=v-B.ded;
    const row=(l,x,y,f)=>`<tr><td>${l}</td><td class="num">${f(x)}</td><td class="num">${f(y)}</td></tr>`;
    return `<div class="tbl-wrap"><table class="mtbl"><thead><tr><th></th><th class="num">Sell stock, give cash</th><th class="num">Give stock (DAF or charity)</th></tr></thead><tbody>
      ${row('Capital gains tax you pay',A.cg,B.cg,money0)}
      ${row('Charity receives',A.charity,B.charity,money0)}
      ${row('Federal tax saved by deduction',A.ded,B.ded,money0)}
      ${row('Net cost to you (stock value minus tax saved)',A.cost,B.cost,money0)}
    </tbody></table></div>
    <div class="goodbox small">Giving the shares directly: the charity gets <b>${money0(B.charity-A.charity)}</b> more and you save <b>${money0(B.ded-A.ded)}</b> more in tax.</div>`;
  }

  // ---------- Checklist ----------
  const STEPS=[
    ['monthly','Set up one small monthly gift to a charity you already trust (check it on Charity Navigator or Smart Givers).','Easiest'],
    ['time','Pick one volunteer role: VA Voluntary Service, Team Rubicon, a free clinic or MN Responds.','Easy'],
    ['benef','Name a charity as a partial beneficiary on an IRA, life insurance or bank account (payable on death).','Easy, free'],
    ['will','Write or update a will (and health care directive) and include a charity, even a small percent.','Some effort'],
    ['daf','Open a donor-advised fund, especially in a year with a big bonus or a stock gain.','Some effort'],
    ['schol','Start a pass-through scholarship, or a named fund at a community foundation you build over 5 years.','More effort'],
    ['farm','With family and the trustee, learn about farm conservation and legacy options. Meet an estate attorney.','More effort'],
    ['npo','Start a project under fiscal sponsorship, and only then consider your own nonprofit.','Most effort']];
  function checklistHTML(){
    const d=st().done; const n=STEPS.filter(s=>d[s[0]]).length;
    return `<div class="small muted" id="gv-count">${n} of ${STEPS.length} done</div>
    <div class="pl-list">${STEPS.map((s,ix)=>`<label class="pl-row"><span><input type="checkbox" data-gv-step="${s[0]}" ${d[s[0]]?'checked':''}> ${ix+1}. ${s[1]}</span><span class="amt small muted">${s[2]}</span></label>`).join('')}</div>`;
  }

  function field(k,label,step,min){
    const g=st();
    return `<label class="f">${label}<input type="number" inputmode="decimal" step="${step}" min="${min==null?0:min}" data-gv="${k}" value="${esc(String(g[k]))}"></label>`;
  }

  function view(){
    st();
    return `<div class="stack">
      <div class="panel money">
        <div class="eyebrow-s">🟨 Giving</div>
        <h2>Using what you have for good</h2>
        <p class="small">You do not need to be rich to be generous. People give three things: <b>time</b>, <b>talent</b> (skills like nursing or leadership), and <b>treasure</b> (money and property). A $10 monthly gift, an afternoon at a free clinic, or one line in a will all count. Start small, learn what you care about, and grow your giving as your income and assets grow. The tools below go roughly from simplest to most complex.</p>
        <div class="small muted">Educational only, not tax or legal advice. Rules shown are for 2026 and can change. For trusts, land or large gifts, talk with a fee-only (fiduciary) financial advisor, a CPA, and a Minnesota estate attorney.</div>
      </div>

      <h3>Ways to give</h3>
      <div class="grid2">${CARDS.map(card).join('')}</div>

      <div class="panel study">
        <div class="eyebrow-s">🟦 Model</div>
        <h3>Scholarship / endowment calculator</h3>
        <p class="small">How big a fund pays a yearly scholarship forever, and how long to build it. Example numbers; change them.</p>
        <div class="fields">
          ${field('award','Yearly scholarship ($)',100)}
          ${field('payout','Payout rate (%)',0.1,0.1)}
          ${field('ret','Expected return (%/yr)',0.1,-10)}
          ${field('infl','Inflation (%/yr)',0.1,0)}
          ${field('monthly','You add per month ($)',25)}
          ${field('lump','Lump sum now ($)',500)}
        </div>
        <div id="gv-model">${modelHTML()}</div>
        <div class="small muted">Assumes steady returns, contributions until the target is reached, then a yearly payout of the payout rate times the balance. Fund fees (often 0.5% to 1.5%) are not included; lower the return to account for them.</div>
      </div>

      <div class="panel money">
        <div class="eyebrow-s">🟨 Example only (made-up numbers)</div>
        <h3>DAF with stock vs giving cash</h3>
        <p class="small">Say you own shares worth more than you paid, held over one year, and you itemize (and already clear the 0.5% floor). Compare selling them and donating the cash with giving the shares themselves.</p>
        <div class="fields">
          ${field('stock','Stock value today ($)',500)}
          ${field('basis','What you paid (cost basis $)',500)}
          ${field('bracket','Federal tax bracket (%)',1)}
          ${field('cg','Capital gains rate (%)',1)}
        </div>
        <div id="gv-daf">${dafHTML()}</div>
        <div class="small muted">Federal only. Minnesota taxes capital gains as ordinary income, so the state savings from giving shares would add to this. If you take the standard deduction, a DAF gives no deduction; only cash gifts straight to charities count for the new $1,000/$2,000 deduction.</div>
      </div>

      <div class="panel money">
        <div class="eyebrow-s">🟨 Where to start</div>
        <h3>Checklist, easiest first</h3>
        ${checklistHTML()}
      </div>

      <div class="small muted">Sources (2026): CPA Practice Advisor, Community Foundation of Greater Des Moines, BerryDunn (2025 tax law); FedSmith (QCD and TSP); MN Dept. of Revenue; Daffy DAF comparison, Minneapolis Foundation, Saint Paul &amp; Minnesota Foundation; University of Minnesota Foundation, Northwest Minnesota Foundation, Winona Health Foundation; Cornell LII (CRTs); Minnesota Council of Nonprofits, Harbor Compliance, MJCPA (nonprofit filings); Honkamp, Minnesota Land Trust (easements); Farrish Law (estate tax); Charities Review Council; Valley News Live (Team Rubicon).</div>
    </div>`;
  }

  function bind(){
    $$('[data-gv]').forEach(el=>{
      el.addEventListener('input',()=>{
        const g=st(), k=el.dataset.gv; g[k]=num(el.value,g[k]);
        save();
        const m=$('#gv-model'); if(m) m.innerHTML=modelHTML();
        const d=$('#gv-daf'); if(d) d.innerHTML=dafHTML();
      });
    });
    $$('[data-gv-step]').forEach(el=>{
      el.addEventListener('change',()=>{
        const d=st().done; d[el.dataset.gvStep]=el.checked; save();
        const c=$('#gv-count'); if(c) c.textContent=`${STEPS.filter(s=>d[s[0]]).length} of ${STEPS.length} done`;
      });
    });
  }

  TABS2.push({id:'giving', name:'Giving', order:90, view, bind});
})();
