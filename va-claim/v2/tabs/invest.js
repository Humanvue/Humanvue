// Investing tab: a learning tab about account types, with practice models that use dummy numbers.
// General education only. Not personal tax, legal or investment advice.
//
// Sources: (checked October 2026)
// - IRS newsroom, "401(k) limit increases to $24,500 for 2026, IRA limit increases to $7,500":
//   https://www.irs.gov/newsroom/401k-limit-increases-to-24500-for-2026-ira-limit-increases-to-7500
// - IRS Notice 2025-67 analysis (415(c) $72,000; Roth catch-up wage threshold $150,000; TSP and 457(b) $24,500):
//   https://www.currentfederaltaxdevelopments.com/blog/2025/11/13/annual-adjustments-to-retirement-plan-limitations-analysis-of-notice-2025-67-for-2026
// - 2026 HSA limits (Rev. Proc. 2025-19), Thomson Reuters:
//   https://tax.thomsonreuters.com/news/irs-announces-2026-hsa-and-ebhra-contribution-limits-hdhp-minimum-deductibles-and-hdhp-out-of-pocket-maximums/
// - OBBBA HSA changes for 2026 (bronze, catastrophic, direct primary care), IRS Notice 2026-05 summary:
//   https://www.cpapracticeadvisor.com/?p=174769
// - MOAA, "Do HSAs Work With TRICARE?": https://www.moaa.org/content/publications-and-media/moaa-blog/do-hsas-work-with-tricare-/
// - Minnesota Dept. of Revenue, 2026 Schedule M1529 (draft) and 2025 Schedule M1529 instructions:
//   https://www.revenue.state.mn.us/sites/default/files/2026-08/m1529-26-grid.pdf
//   https://www.revenue.state.mn.us/sites/default/files/2025-12/m1529-25.pdf
// - 529 changes for 2026 (K-12 $20,000, credentials; 529 to Roth rollover), Janney:
//   https://www.janney.com/detail/education/2026/04/29/the-changing-landscape-of-529-plans
// - TSP Rule of 55 and public safety age 50, FedSmith (Aug 2026):
//   https://www.fedsmith.com/2026/08/12/how-federal-employees-can-tap-their-tsp-early-without-irs-penalties/
// - TSP in-plan Roth conversions launched Jan 28, 2026; Roth TSP has no RMDs, FedSmith:
//   https://www.fedsmith.com/2026/01/28/federal-employees-gain-powerful-new-tsp-feature-roth-in-plan-conversions-officially-launch/
// - RMD age 73 (born 1951 to 1959) and 75 (born 1960 or later): https://ustax.tools/tax-insights/rmd-age-73-vs-75-secure-2-timeline/
// - 2026 capital gains brackets and NIIT: https://ustax.tools/capital-gains-tax-rates-2026/
// - I bond $10,000 yearly limit, paper tax-refund bonds ended: https://rethinking65.com/you-can-no-longer-buy-paper-inflation-bonds-with-your-tax-refund/
// - I bond and TIPS rates: https://treasurydirect.gov/savings-bonds/i-bonds/i-bonds-interest-rates/
// - Roth IRA 5-year rules: https://www.kitces.com/understanding-the-two-5-year-rules-for-roth-ira-contributions-and-conversions
// - Stock/bond mix history 1926 to 2019 (Vanguard data), Visual Capitalist:
//   https://www.visualcapitalist.com/90-years-stock-and-bond-portfolio-performance/
(()=>{
  const ID = 'invest';

  // ---------- state ----------
  const DEF = {
    g:{start:10000, monthly:500, years:25, ret:7, fee:0.5},
    c:{yearly:6000, years:25, ret:7, taxNow:22, taxLater:15, cg:15},
    w:{amount:20000, age:46, acct:'tradira', fed:22, state:6.8, sep55:false, separated:true, medical:false, five:false, balance:30000, basis:20000},
    r:{stocks:70},
    open:{}
  };
  function st(){
    if(!S[ID] || typeof S[ID]!=='object') S[ID]={};
    const o=S[ID];
    for(const k of Object.keys(DEF)){
      if(!o[k] || typeof o[k]!=='object') o[k]=JSON.parse(JSON.stringify(DEF[k]));
      else for(const j of Object.keys(DEF[k])) if(o[k][j]===undefined) o[k][j]=DEF[k][j];
    }
    return o;
  }
  const num = v => { const n = parseFloat(v); return isFinite(n) ? n : 0; };
  const clamp = (n,a,b) => Math.min(b, Math.max(a, n));
  const p1 = n => (Math.round(n*10)/10).toFixed(1) + '%';

  // ---------- account cards (general, 2026 rules) ----------
  const CARDS = [
    {id:'tsp', cls:'duty', icon:'🎖️', title:'TSP (Thrift Savings Plan): traditional and Roth',
     what:'The federal and military 401(k)-style plan. You choose traditional (pre-tax) or Roth (after-tax) for each paycheck, or a mix. Very low fees.',
     who:'Federal civilian employees and the uniformed services, including Guard and Reserve and AGR. You can only add new paycheck money while you are serving or federally employed.',
     limits:'2026: $24,500 employee limit. Catch-up age 50+: $8,000 more. Ages 60 to 63: $11,250 catch-up instead of $8,000. Total of all money going in (your money, match, tax-exempt combat zone pay) caps at $72,000. The $24,500 is ONE limit shared with any 401(k) or 403(b) you also use that year.',
     taxIn:'Traditional: not taxed now (lowers taxable pay). Roth: taxed now.',
     taxGrow:'Tax-deferred (traditional) or tax-free (Roth).',
     taxOut:'Traditional: taxed as ordinary income. Roth: tax-free if 5 years since first Roth TSP contribution AND age 59½ (or disability or death).',
     benefits:['Some of the lowest fees anywhere (well under 0.1% a year).','Blended Retirement System (BRS) members get 1% automatic plus up to 4% match (5% total). Legacy High-3 members get no match.','You can keep the account for life after you separate. No need to move it.','Since January 28, 2026 you can do Roth conversions inside the TSP.','Roth TSP has no required minimum distributions (RMDs) during your life (since 2024).'],
     risks:['Only 5 core funds plus L funds. C, S and I funds can drop 30% to 50% in a bad year.','Leaving everything in the G Fund is "safe" from losses but may not beat inflation over decades.'],
     restrict:['10% early-withdrawal penalty before 59½, unless you separate in or after the calendar year you turn 55 (Rule of 55). Separating at 45 does not count, even if you wait until 55 to withdraw.','The Rule of 55 only protects money that stays in the TSP. Roll it to an IRA and the 59½ rule applies.','RMDs on traditional money start at 73 (born 1951 to 1959) or 75 (born 1960 or later).','Roth IRA money cannot be rolled into the TSP.','In-plan Roth conversions cannot be undone, and tax is not withheld: pay it from outside cash.'],
     tips:['The funds: G = special US Treasury fund, cannot lose principal. F = US bond index. C = S&P 500 (big US companies). S = small and mid-size US companies. I = international stocks (developed plus some emerging markets since 2024, not China or Hong Kong). L = "lifecycle" target-date mixes that get safer as the date gets closer.','You CAN roll old 401(k), 403(b), 457(b) and traditional IRA money INTO the TSP to keep fees low.','Combat zone pay put into traditional TSP goes in tax-free, but the earnings are taxed later. Roth TSP with combat pay can be tax-free going in AND coming out.','Starting 2026, if you are 50+ and earned over $150,000 in FICA wages the prior year, catch-ups must go in as Roth.','In the year you switch from military to a hospital job, add up TSP plus 403(b) deferrals so the total stays under $24,500.']},

    {id:'b403', cls:'study', icon:'🏥', title:'403(b): the hospital and school 401(k)',
     what:'A workplace retirement plan for nonprofits (most hospitals), public schools and universities. Works like a 401(k), traditional and often Roth.',
     who:'Employees of nonprofit hospitals and health systems, public schools, colleges and some churches.',
     limits:'2026: $24,500 employee limit (shared with TSP and any 401(k) that year). Catch-up 50+: $8,000. Ages 60 to 63: $11,250. Total with employer money: $72,000.',
     taxIn:'Traditional: pre-tax. Roth 403(b): after-tax.',
     taxGrow:'Tax-deferred or tax-free (Roth).',
     taxOut:'Traditional taxed as income. Roth tax-free if 5 years and 59½.',
     benefits:['Automatic payroll saving.','Often comes with an employer match (free money).','Rule of 55 works here too (leave the job in or after the year you turn 55).'],
     risks:['Some 403(b) menus are full of high-fee annuities or funds. Look for index funds with expense ratios under 0.2%.','Salespeople sometimes visit hospitals and schools to sell annuity products inside the 403(b).'],
     restrict:['10% penalty before 59½ unless an exception applies (Rule of 55, disability, and others).','RMDs at 73 or 75 for traditional money. Roth 403(b) has no lifetime RMDs.','The employer match may have a vesting schedule.'],
     tips:['Many hospitals offer BOTH a 403(b) and a 457(b). Those limits are separate, so you could save $24,500 in each.','Ask HR: "What is the match formula and the vesting schedule?" before you pick a start or leave date.','Some long-time employees get a special extra 403(b) catch-up (15 years with the same employer). Ask the plan.']},

    {id:'b457', cls:'study', icon:'🏛️', title:'457(b): no 10% penalty after you leave the job',
     what:'A deferred compensation plan for state and local governments (county or state hospitals, public universities) and some nonprofits.',
     who:'Government employees and some nonprofit hospital staff.',
     limits:'2026: $24,500, SEPARATE from the 403(b)/401(k)/TSP limit. Catch-up 50+: $8,000; 60 to 63: $11,250. Special "last 3 years before normal retirement age" catch-up can allow up to double the limit (you use either this or the age 50 catch-up, not both).',
     taxIn:'Traditional pre-tax; many governmental plans also offer Roth.',
     taxGrow:'Tax-deferred or tax-free (Roth).',
     taxOut:'Taxed as income (traditional). No 10% early-withdrawal penalty once you separate from that employer, at any age.',
     benefits:['The best "bridge" account if you might stop working before 59½.','Doubles how much you can shelter when paired with a 403(b).'],
     risks:['NON-governmental 457(b) plans (some private nonprofit hospitals) are different: the money legally belongs to the employer until paid out and could be lost if the employer goes bankrupt. They also cannot be rolled into an IRA.'],
     restrict:['You usually cannot take money out while you still work there (except small or emergency cases).','Money rolled INTO a 457(b) from an IRA or 401(k) keeps its 10% penalty.','RMDs at 73 or 75 for traditional money.'],
     tips:['Ask HR: "Is our 457(b) governmental or non-governmental?" It changes the risk a lot.','Rolling a governmental 457(b) to an IRA throws away the no-penalty feature. Leave it in place if you might need it before 59½.']},

    {id:'match', cls:'study', icon:'🤝', title:'Employer match and vesting',
     what:'Money your employer adds when you contribute, for example "100% of the first 4% of pay."',
     who:'Anyone whose plan offers it (BRS members in the TSP, many hospital 403(b) plans).',
     limits:'The match does not count toward your $24,500, but it does count toward the $72,000 total.',
     taxIn:'Usually pre-tax (traditional), even if your own money is Roth. Since 2023 a plan may offer a Roth match.',
     taxGrow:'Tax-deferred.',
     taxOut:'Taxed as income.',
     benefits:['An instant 50% to 100% return on the money you put in to get it.'],
     risks:['Leaving before you are vested can forfeit some or all of the match.'],
     restrict:['Vesting schedules: "cliff" (all at once after, say, 3 years) or "graded" (for example 20% per year).'],
     tips:['First goal at any job: contribute at least enough to get the full match.','TSP matching for BRS members vests after 2 years of service.']},

    {id:'tira', cls:'money', icon:'🧾', title:'Traditional IRA',
     what:'An individual retirement account you open yourself at a brokerage. You pick the investments.',
     who:'Anyone with earned income (wages or self-employment). A military pension is NOT earned income for IRA purposes, so you need a paycheck or 1099 income to contribute.',
     limits:'2026: $7,500, plus $1,100 catch-up at 50+. This is one limit shared with your Roth IRA.',
     taxIn:'Deductible if you have no workplace plan. If you DO have one, the deduction phases out in 2026 between $81,000 and $91,000 (single) or $129,000 and $149,000 (married filing jointly). Above that it still works, just not deductible.',
     taxGrow:'Tax-deferred.',
     taxOut:'Taxed as income (except any non-deductible "basis").',
     benefits:['Huge investment choice and you control fees.','The usual landing spot for rollovers from old workplace plans.'],
     risks:['Easy to pick high-fee funds or trade too much.'],
     restrict:['10% penalty before 59½ (some exceptions: disability, first home up to $10,000, higher education, certain medical costs). No Rule of 55 for IRAs.','RMDs at 73 or 75.'],
     tips:['Having a big pre-tax IRA balance makes a backdoor Roth messy (pro-rata rule). Keeping pre-tax money in the TSP or 403(b) instead avoids that.']},

    {id:'rira', cls:'money', icon:'🌱', title:'Roth IRA (including backdoor and 5-year rules)',
     what:'An IRA funded with after-tax money that grows tax-free.',
     who:'Anyone with earned income under the income limit. 2026 phase-out: $153,000 to $168,000 (single), $242,000 to $252,000 (married filing jointly).',
     limits:'2026: $7,500 plus $1,100 catch-up at 50+ (shared with the traditional IRA).',
     taxIn:'No deduction. You pay tax now.',
     taxGrow:'Tax-free.',
     taxOut:'Your contributions can come out any time, tax-free and penalty-free. Earnings are tax-free once you are 59½ AND your first Roth IRA is at least 5 tax years old.',
     benefits:['No RMDs for the owner, ever.','Contributions work as a backup emergency fund.','Tax-free money in retirement can keep your taxable income (and taxes on other income) lower.'],
     risks:['If tax rates in retirement are lower than today, traditional would have been better.'],
     restrict:['Withdrawal order: contributions first, then conversions, then earnings.','Earnings taken early can be taxed and hit with 10%.','Each conversion has its own 5-year clock for the 10% penalty if you are under 59½.'],
     tips:['Backdoor Roth: if your income is too high, put money in a traditional IRA (non-deductible) and convert it. File Form 8606. The pro-rata rule counts ALL your pre-tax IRA, SEP and SIMPLE balances.','Open one early, even with a small amount, to start the 5-year clock.','Military retired pay alone does not let you contribute; nursing pay does.']},

    {id:'hsa', cls:'money', icon:'🩺', title:'HSA (Health Savings Account)',
     what:'A medical savings account that can also be invested. The only account with a triple tax break.',
     who:'Only people covered by a qualifying High Deductible Health Plan (HDHP) and NO other disqualifying coverage. Starting 2026, bronze and catastrophic marketplace plans and some direct primary care arrangements also qualify.',
     limits:'2026: $4,400 self-only, $8,750 family, plus $1,000 catch-up at 55+.',
     taxIn:'Pre-tax (no FICA either if through payroll).',
     taxGrow:'Tax-free.',
     taxOut:'Tax-free for qualified medical costs. Non-medical before 65: income tax plus 20% penalty. After 65: non-medical is taxed like a traditional IRA, no penalty.',
     benefits:['Triple tax advantage: in free, grows free, out free (for medical).','No "use it or lose it". No RMDs.','You can pay medical bills out of pocket now, save receipts, and reimburse yourself years later.'],
     risks:['If invested, the balance can drop right when you need it for a bill.'],
     restrict:['⚠️ TRICARE is NOT an HDHP. If you are covered by TRICARE (active or retiree plans), you generally CANNOT contribute to an HSA, even if your hospital job also gives you an HDHP.','Enrolling in Medicare also ends new contributions.'],
     tips:['A military retiree who is NOT enrolled in any TRICARE plan and has only an employer HDHP may qualify. That is a real trade-off (TRICARE is very cheap). Check with a tax pro before contributing.','If you cannot use an HSA, a health FSA through your employer is the common alternative for out-of-pocket costs.','Money already in an HSA stays yours and can still be spent tax-free even after you lose eligibility.']},

    {id:'taxable', cls:'money', icon:'📈', title:'Taxable brokerage account',
     what:'A regular investment account at a brokerage. No special tax wrapper.',
     who:'Anyone.',
     limits:'No limits.',
     taxIn:'After-tax money.',
     taxGrow:'Dividends and interest are taxed each year. Gains are taxed only when you sell.',
     taxOut:'Long-term gains (held over 1 year) use lower federal rates: 0%, 15% or 20%. In 2026 the 0% rate applies to taxable income up to $49,450 (single) or $98,900 (married filing jointly). Short-term gains are taxed like wages. 3.8% NIIT applies above $200,000 (single) or $250,000 (joint) income.',
     benefits:['No age rules, no penalties, total flexibility.','Broad, low-cost index funds (total US market, S&P 500, total world) are very tax-efficient.','Heirs get a "step-up" in cost basis at death.'],
     risks:['Market losses. Yearly tax on dividends ("tax drag").'],
     restrict:['Wash sale rule: if you sell at a loss and buy the same or a "substantially identical" fund within 30 days before or after, the loss is disallowed for now.'],
     tips:['Tax-loss harvesting: sell a fund that is down to lock in a loss, then buy a similar (not identical) fund. Losses offset gains and up to $3,000 a year of regular income.','Minnesota taxes capital gains as regular income (no special lower state rate).','Good for goals before 59½ once tax-advantaged accounts are used.']},

    {id:'sep', cls:'money', icon:'🧑‍🏫', title:'SEP-IRA (for 1099 income)',
     what:'A simple retirement account for self-employed income, such as 1099 adjunct teaching or PRN contract nursing.',
     who:'Anyone with self-employment income (even a side gig on top of a W-2 job).',
     limits:'2026: up to 25% of compensation, which works out to about 20% of net self-employment earnings for a sole proprietor, capped at $72,000. No catch-up.',
     taxIn:'Pre-tax (deduction).',
     taxGrow:'Tax-deferred.',
     taxOut:'Taxed as income. Same 59½ and RMD rules as a traditional IRA.',
     benefits:['Very easy to open. You can open and fund it up to your tax filing deadline (with extensions).','It uses a different limit than your W-2 plan deferrals (TSP, 403(b)), so it adds room on top.'],
     risks:['Only pre-tax for most providers.'],
     restrict:['Counts as an IRA for the pro-rata rule, which can spoil a backdoor Roth.','If you later hire employees, you must contribute for them too.'],
     tips:['If you teach as a W-2 part-time adjunct instead, you would use the school\'s 403(b) or 457(b), not a SEP.']},

    {id:'solo', cls:'money', icon:'💼', title:'Solo 401(k) (for 1099 income)',
     what:'A 401(k) for a business with no employees other than you (and a spouse).',
     who:'Self-employed people with no other employees.',
     limits:'2026: "employee" deferral up to $24,500 (BUT shared with any TSP, 403(b) or 401(k) deferrals that year) plus "employer" profit sharing of about 20% of net self-employment earnings, total capped at $72,000 plus catch-ups.',
     taxIn:'Pre-tax or Roth (if the provider offers Roth).',
     taxGrow:'Tax-deferred or tax-free.',
     taxOut:'Same as a 401(k).',
     benefits:['Can beat a SEP when side income is modest because of the employee deferral piece.','Does not count for the backdoor Roth pro-rata rule.','Often allows loans and Roth.'],
     risks:['A little more paperwork than a SEP.'],
     restrict:['File Form 5500-EZ once plan assets pass $250,000.','If your W-2 job already uses the full $24,500, only the employer part is left.'],
     tips:['A 457(b) at your main job does NOT share the $24,500 with a solo 401(k), but a 403(b) does.']},

    {id:'save', cls:'money', icon:'🏦', title:'Safe savings tools (emergency fund and short-term goals)',
     what:'Places for money you need in the next few years, where you want low risk more than growth.',
     who:'Anyone.',
     limits:'I bonds: $10,000 per person per calendar year, electronic only through TreasuryDirect (paper bonds with tax refunds ended in 2025). Others: no limit.',
     taxIn:'After-tax money.',
     taxGrow:'Interest taxed yearly for savings, CDs and money market funds. Treasury interest (T-bills, I bonds, TIPS) is free of STATE tax. I bond interest can wait until you cash out.',
     taxOut:'See below.',
     benefits:[],risks:[],restrict:[],tips:[],
     extra:`<div class="tbl-wrap"><table class="mtbl"><thead><tr><th>Tool</th><th>How it works</th><th>Watch out for</th></tr></thead><tbody>
       <tr><td>High-yield savings</td><td>Online bank savings. FDIC-insured up to $250,000. Take money out any time.</td><td>Rate changes whenever the bank wants.</td></tr>
       <tr><td>CDs</td><td>Lock money for 3 months to 5 years at a fixed rate. FDIC-insured.</td><td>Early-withdrawal penalty (often several months of interest).</td></tr>
       <tr><td>Treasury bills</td><td>Short-term US government debt (4 to 52 weeks). No state income tax. Buy at TreasuryDirect or a brokerage.</td><td>Must hold to maturity or sell at market price.</td></tr>
       <tr><td>I bonds</td><td>Rate = fixed part + inflation part, reset every May and November. Cannot lose value.</td><td>Locked for 1 year. Lose last 3 months of interest if cashed before 5 years.</td></tr>
       <tr><td>TIPS</td><td>Treasury bonds whose principal rises with inflation. Held at TreasuryDirect or a brokerage.</td><td>Market price moves if sold early. Inflation boost is taxed yearly in a taxable account.</td></tr>
       <tr><td>Money market funds</td><td>Mutual funds holding very short-term debt. Most brokerages use them for cash.</td><td>Not FDIC-insured (very low risk, but not zero). Yield moves with rates.</td></tr>
       </tbody></table></div>
       <p class="small muted">Current I bond and TIPS rates: check TreasuryDirect.gov, they change twice a year.</p>`},

    {id:'529', cls:'money', icon:'🎓', title:'529 education savings plan',
     what:'A state-sponsored investment account for education costs: college, graduate school (like a DNP or PMHNP program), trade school, K-12 tuition, and some licenses and credentials.',
     who:'Anyone can open one for anyone, including yourself.',
     limits:'No federal yearly limit (large gifts can use gift-tax rules). Each state sets a lifetime cap.',
     taxIn:'No federal deduction. Minnesota 2026: subtract up to $1,500 (single) or $3,000 (married filing jointly) of contributions, OR take a credit of up to $500 if your income is lower (the credit phases out as income rises; you cannot take both). See Schedule M1529.',
     taxGrow:'Tax-free.',
     taxOut:'Tax-free for qualified education costs. Other uses: earnings taxed plus 10% penalty.',
     benefits:['2026: K-12 tuition and related costs up to $20,000 a year per student (was $10,000).','Now can cover career credentials, licensing tests and required continuing education (check your plan).','Up to $10,000 lifetime per person toward student loans.','Unused money can roll to the beneficiary\'s Roth IRA: account open 15+ years, $35,000 lifetime, within yearly Roth limits.'],
     risks:['If invested in stocks, the value can drop right before tuition is due. Many plans offer age-based options that get safer over time.'],
     restrict:['Non-education withdrawals: tax on earnings plus 10% (waived for scholarships, death, disability, or attendance at a US military academy, up to that amount).','Minnesota can "recapture" its tax benefit on non-qualified withdrawals.'],
     tips:['Paired with the GI Bill: a 529 can cover what the GI Bill does not (or fund a family member\'s school if benefits were transferred).','Change the beneficiary to another family member any time without tax.','Minnesota\'s own plan is the Minnesota College Savings Plan; check M1529 instructions for which plans qualify for the state break.']},

    {id:'annuity', cls:'money', icon:'🧮', title:'Annuities (be careful)',
     what:'An insurance contract: you give money to an insurer, and it promises payments or growth. Types: immediate (income starts now), deferred, fixed, variable, and indexed.',
     who:'Anyone. Often sold, rarely bought on purpose.',
     limits:'No limits for non-qualified annuities.',
     taxIn:'Usually after-tax (unless inside an IRA or 403(b)).',
     taxGrow:'Tax-deferred.',
     taxOut:'Earnings taxed as ordinary income (never the lower capital gains rate). 10% penalty on earnings before 59½.',
     benefits:['A simple immediate annuity can turn savings into guaranteed lifetime income, like a pension.'],
     risks:['Fees on variable and indexed annuities can top 2% a year.','Surrender charges for 7 to 10 years if you want out.','Sales commissions, complex "caps" and "participation rates".','Fixed payments lose buying power to inflation.','Backed only by the insurance company (and limited state guaranty funds).'],
     restrict:['Hard to undo. Most have a short "free look" period (often 10 to 30 days) to cancel.'],
     tips:['A military pension with COLA is already an inflation-adjusted lifetime annuity, which most people would pay a lot for. Many retirees with a pension do not need another one.','Buying an annuity inside an IRA or 403(b) adds cost for a tax break you already have.','Ask: "What are ALL the yearly fees, and what is the surrender schedule?" Get it in writing.']},

    {id:'realestate', cls:'money', icon:'🏘️', title:'Real estate and rental property basics',
     what:'Owning property that earns rent and may rise in value. Or owning REITs (real estate investment trusts) through a fund.',
     who:'Anyone with a down payment and time (or anyone with a brokerage account for REITs).',
     limits:'None.',
     taxIn:'After-tax money.',
     taxGrow:'Depreciation can shelter rental income from tax.',
     taxOut:'Rent is taxed. Gains on sale are taxed, plus "depreciation recapture" (up to 25%).',
     benefits:['Rent can rise with inflation.','Leverage: a loan magnifies gains.','VA home loan for a home you live in, including up to 4 units if you live in one ("house hacking").'],
     risks:['Leverage also magnifies losses.','Vacancies, repairs, bad tenants, property taxes and insurance hikes.','Hard to sell quickly. A lot of your money in one property in one town.','It is a part-time job, or you pay a manager about 8% to 10% of rent.'],
     restrict:['Rental losses usually only offset other income if your income is under certain levels (passive loss rules).'],
     tips:['REIT index funds give real estate exposure with no landlord work. Their dividends are taxed as regular income, so they fit well in an IRA or TSP-style account.','Run the numbers with a 10% vacancy and 10% repairs reserve before buying.']}
  ];

  const ROW = (k,v) => `<div class="pl-row"><span><b>${k}</b></span><span class="amt" style="text-align:left;max-width:68%">${v}</span></div>`;
  const UL = (a) => a.length ? `<ul class="small">${a.map(x=>`<li>${x}</li>`).join('')}</ul>` : '';
  function card(c, open){
    const sec = (t,a) => a.length ? `<div><div class="eyebrow-s">${t}</div>${UL(a)}</div>` : '';
    return `<details class="panel ${c.cls}" data-card="${c.id}"${open?' open':''}>
      <summary><b>${c.icon} ${c.title}</b></summary>
      <div class="stack" style="margin-top:10px">
        <p class="small">${c.what}</p>
        <div class="pl-list small">
          ${ROW('Who can use it', c.who)}
          ${ROW('2026 limits', c.limits)}
          ${ROW('Tax going in', c.taxIn)}
          ${ROW('Tax while growing', c.taxGrow)}
          ${ROW('Tax coming out', c.taxOut)}
        </div>
        ${c.extra||''}
        <div class="grid2">
          ${sec('✅ Benefits', c.benefits)}
          ${sec('⚠️ Risks', c.risks)}
          ${sec('🚧 Restrictions', c.restrict)}
          ${sec('💡 Good to know', c.tips)}
        </div>
      </div>
    </details>`;
  }

  // ---------- model math ----------
  function growth(g){
    const yrs = clamp(Math.round(num(g.years)),1,60);
    const run = (annual) => {
      let b = num(g.start); const out=[b]; const rm = annual/100/12;
      for(let y=1;y<=yrs;y++){ for(let m=0;m<12;m++) b = b*(1+rm) + num(g.monthly); out.push(b); }
      return out;
    };
    const gross = run(num(g.ret)), net = run(num(g.ret)-num(g.fee));
    const contrib = num(g.start) + num(g.monthly)*12*yrs;
    return {yrs, gross, net, contrib};
  }
  function compare(c){
    const n = clamp(Math.round(num(c.years)),1,60), r = num(c.ret)/100, E = num(c.yearly);
    const tN = clamp(num(c.taxNow),0,60)/100, tL = clamp(num(c.taxLater),0,60)/100, cg = clamp(num(c.cg),0,40)/100;
    let fv=0; for(let i=0;i<n;i++) fv = (fv + E)*(1+r);   // pre-tax dollars invested at start of each year
    const trad = fv*(1-tL);
    const roth = fv*(1-tN);
    const tBasis = E*(1-tN)*n, tVal = fv*(1-tN);
    const taxable = tVal - Math.max(0,tVal-tBasis)*cg;
    const hsa = fv, hsaNon = fv*(1-tL);
    return {n, trad, roth, taxable, hsa, hsaNon, tN, tL};
  }
  function withdraw(w){
    const A = Math.max(0,num(w.amount)), age = num(w.age), t = (clamp(num(w.fed),0,50)+clamp(num(w.state),0,15))/100;
    const under = age < 59.5;
    let taxable = A, penRate = under ? 0.10 : 0, notes = [];
    const r55 = w.sep55 && age >= 55;
    if(w.sep55 && age < 55 && (w.acct==='plan' || w.acct==='rothplan')) notes.push('You checked the Rule of 55 box, but you cannot have left in the year you turned 55 if you are younger than 55 now, so it is not applied.');
    switch(w.acct){
      case 'tradira':
        notes.push('IRAs have no Rule of 55. Other exceptions (disability, first home up to $10,000, higher education, some medical bills, 72(t) equal payments) may apply.');
        break;
      case 'plan':
        if(under && r55){ penRate = 0; notes.push('Rule of 55: you left this employer in or after the year you turned 55, so no 10% penalty on money still in this plan.'); }
        else if(under) notes.push('Rule of 55 only works if you leave the job in or after the calendar year you turn 55 (and the money stays in that plan).');
        notes.push('Plans usually withhold 20% for federal tax on cash-outs. That is a prepayment, not the final tax.');
        break;
      case 'g457':
        if(w.separated){ penRate = 0; notes.push('Governmental 457(b): no 10% penalty after you leave that employer, at any age.'); }
        else { notes.push('While you still work there, a 457(b) usually does not allow withdrawals before 59½ (except small balance or emergency cases).'); }
        break;
      case 'rothira': {
        const basis = Math.max(0,num(w.basis));
        const fromBasis = Math.min(A, basis), earn = A - fromBasis;
        const qualified = !under && w.five;
        taxable = qualified ? 0 : earn;
        penRate = under ? 0.10 : 0;
        notes.push(`${money0(fromBasis)} comes out first as your own contributions: no tax, no penalty.`);
        if(earn>0) notes.push(qualified ? 'The rest is earnings, tax-free because you are 59½+ and passed the 5-year rule.' : `The remaining ${money0(earn)} is earnings and is taxed${under?' and penalized':''}.`);
        notes.push('Converted money has its own 5-year penalty clock (not modeled here).');
        break; }
      case 'rothplan': {
        const bal = Math.max(1,num(w.balance)), basis = clamp(num(w.basis),0,bal);
        const qualified = !under && w.five;
        const earnShare = 1 - basis/bal;
        taxable = qualified ? 0 : A*earnShare;
        if(under && r55) penRate = 0;
        notes.push(qualified ? 'Qualified: 59½+ and 5 years, so all tax-free.' : `Roth TSP/401(k)/403(b) withdrawals are pro-rata: about ${p1(earnShare*100)} of each dollar counts as earnings.`);
        if(under && r55) notes.push('Rule of 55 removes the 10% penalty on the earnings part.');
        break; }
      case 'hsa':
        penRate = 0;
        if(w.medical){ taxable = 0; notes.push('Used for qualified medical costs: no tax, no penalty.'); }
        else if(age < 65){ penRate = 0.20; notes.push('Non-medical before 65: income tax plus a 20% penalty.'); }
        else notes.push('Non-medical at 65+: income tax only, like a traditional IRA.');
        break;
    }
    const tax = taxable*t, pen = taxable*penRate;
    return {A, tax, pen, net: A - tax - pen, taxable, notes};
  }

  // Vanguard data via Visual Capitalist, 1926 to 2019 (stocks %, avg, best, worst)
  const HIST = [[0,5.3,32.6,-8.1],[10,6.0,31.2,-8.2],[20,6.6,29.8,-10.1],[30,7.2,28.4,-14.2],[40,7.8,27.9,-18.4],[50,8.3,32.3,-22.5],[60,8.8,36.7,-26.6],[70,9.2,41.1,-30.7],[80,9.6,45.4,-34.9],[90,10.0,49.8,-39.0],[100,10.3,54.2,-43.1]];
  function mix(s){
    s = clamp(num(s),0,100); const i = Math.min(9, Math.floor(s/10)), f = (s - i*10)/10, a = HIST[i], b = HIST[i+1];
    const L = k => a[k] + (b[k]-a[k])*f;
    return {s, avg:L(1), best:L(2), worst:L(3)};
  }

  // ---------- output renderers ----------
  function outGrowth(){
    const g = st().g, r = growth(g), fin = r.gross[r.yrs], finN = r.net[r.yrs];
    const labels = r.gross.map((_,i)=> String(i));
    return `<div class="tiles">
        <div class="tile"><div class="eyebrow-s">Final balance</div><div class="tbig">${money0(fin)}</div><div class="small muted">no fee</div></div>
        <div class="tile"><div class="eyebrow-s">With ${p1(num(g.fee))} fee</div><div class="tbig">${money0(finN)}</div><div class="small muted neg">fee cost ${money0(fin-finN)}</div></div>
        <div class="tile"><div class="eyebrow-s">You put in</div><div class="tbig">${money0(r.contrib)}</div><div class="small muted">start + monthly</div></div>
        <div class="tile"><div class="eyebrow-s">Growth</div><div class="tbig pos">${money0(fin-r.contrib)}</div><div class="small muted">compounding at work</div></div>
      </div>
      ${lineChart({labels, series:[{name:'No fee', values:r.gross, color:'var(--accent)', fill:true},{name:`With ${p1(num(g.fee))} fee`, values:r.net, color:'var(--bad)', dash:true}], yfmt:fmtK, height:240})}
      <p class="small muted">X axis = years. A fee that sounds tiny takes ${p1(fin>0?(fin-finN)/fin*100:0)} of the final balance here.</p>`;
  }
  function outCompare(){
    const c = st().c, r = compare(c);
    const rows = [['Roth (pay tax now)', r.roth, 'var(--s1)'],['Traditional (pay tax later)', r.trad, 'var(--s2)'],['Taxable brokerage', r.taxable, 'var(--s3)'],['HSA, used for medical', r.hsa, 'var(--good)']];
    const max = Math.max(...rows.map(x=>x[1]), 1);
    const best = rows.slice(0,3).reduce((a,b)=> b[1]>a[1]?b:a);
    let why;
    if(Math.abs(r.tN - r.tL) < 0.0005) why = 'With the same tax rate now and later, Roth and Traditional end up exactly equal; the taxable account trails because gains are taxed, and an HSA used for medical costs beats them all because it is never taxed.';
    else if(r.tL < r.tN) why = `Traditional wins over Roth here because your tax rate later (${p1(r.tL*100)}) is lower than now (${p1(r.tN*100)}); the HSA still comes out on top if the money goes to medical bills.`;
    else why = `Roth wins over Traditional here because your tax rate later (${p1(r.tL*100)}) is higher than now (${p1(r.tN*100)}); the HSA still comes out on top if the money goes to medical bills.`;
    return `<div class="stack">
      ${rows.map(([n,v,col])=>`<div><div class="row" style="justify-content:space-between"><span class="small">${n}${n===best[0]?' <b>(best of the 3 retirement options)</b>':''}</span><b>${money0(v)}</b></div>
        <div style="height:10px;background:color-mix(in srgb, ${col} 18%, transparent);border-radius:6px"><div style="height:10px;width:${(v/max*100).toFixed(1)}%;background:${col};border-radius:6px"></div></div></div>`).join('')}
      <div class="goodbox small">${why}</div>
      <p class="small muted">HSA spent on non-medical things after 65: ${money0(r.hsaNon)} (same as Traditional). Simple model: ignores yearly tax on dividends in the taxable account, state rules, and FICA savings on payroll HSA. Remember: TRICARE coverage usually blocks HSA contributions.</p>
    </div>`;
  }
  function outWithdraw(){
    const w = st().w, r = withdraw(w);
    return `<div class="tiles">
        <div class="tile"><div class="eyebrow-s">Taken out</div><div class="tbig">${money0(r.A)}</div><div class="small muted">taxable part ${money0(r.taxable)}</div></div>
        <div class="tile"><div class="eyebrow-s">Income tax (est.)</div><div class="tbig neg">${money0(r.tax)}</div><div class="small muted">federal + state rate</div></div>
        <div class="tile"><div class="eyebrow-s">Penalty</div><div class="tbig ${r.pen>0?'neg':'pos'}">${money0(r.pen)}</div><div class="small muted">${r.pen>0?'early withdrawal':'none'}</div></div>
        <div class="tile"><div class="eyebrow-s">You keep</div><div class="tbig">${money0(r.net)}</div><div class="small muted">${p1(r.A>0?r.net/r.A*100:0)} of it</div></div>
      </div>
      <ul class="small">${r.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ul>`;
  }
  function outMix(){
    const m = mix(st().r.stocks);
    const lo=-45, hi=55, X = v => ((v-lo)/(hi-lo)*100).toFixed(1);
    return `<div class="tiles">
        <div class="tile"><div class="eyebrow-s">Mix</div><div class="tbig">${Math.round(m.s)} / ${100-Math.round(m.s)}</div><div class="small muted">stocks / bonds</div></div>
        <div class="tile"><div class="eyebrow-s">Long-run average</div><div class="tbig">${p1(m.avg)}</div><div class="small muted">per year, 1926 to 2019</div></div>
        <div class="tile"><div class="eyebrow-s">Best year</div><div class="tbig pos">+${p1(m.best)}</div></div>
        <div class="tile"><div class="eyebrow-s">Worst year</div><div class="tbig neg">${p1(m.worst)}</div><div class="small muted">on ${money0(100000)}: ${money0(100000*(1+m.worst/100))} left</div></div>
      </div>
      <svg viewBox="0 0 100 14" width="100%" height="44" role="img" aria-label="Range from worst to best year">
        <line x1="0" y1="7" x2="100" y2="7" stroke="currentColor" stroke-opacity=".2" stroke-width=".6"/>
        <line x1="${X(0)}" y1="2" x2="${X(0)}" y2="12" stroke="currentColor" stroke-opacity=".4" stroke-width=".3"/>
        <rect x="${X(m.worst)}" y="4.5" width="${(X(m.best)-X(m.worst)).toFixed(1)}" height="5" rx="2" fill="var(--accent)" fill-opacity=".35"/>
        <circle cx="${X(m.avg)}" cy="7" r="2" fill="var(--accent)"/>
      </svg>
      <p class="small muted">Bar = worst to best single year. Dot = long-run average. Line = 0%.</p>`;
  }
  const OUT = {g:outGrowth, c:outCompare, w:outWithdraw, r:outMix};
  function refresh(group){
    const el = document.getElementById('inv-out-'+group);
    if(el) el.innerHTML = OUT[group]();
  }

  // ---------- inputs ----------
  function fld(group, key, label, opts={}){
    const v = st()[group][key];
    const step = opts.step ?? 'any';
    return `<label class="f"${opts.show?` data-show="${opts.show}"`:''}>${label}<input type="number" inputmode="decimal" step="${step}" ${opts.min!==undefined?`min="${opts.min}"`:''} data-inv="${group}.${key}" value="${esc(String(v))}"></label>`;
  }
  function chk(group, key, label, show){
    return `<label class="f"${show?` data-show="${show}"`:''}><span><input type="checkbox" data-inv="${group}.${key}" ${st()[group][key]?'checked':''} style="width:auto;margin-right:6px">${label}</span></label>`;
  }
  const ACCTS = [['tradira','Traditional IRA (or SEP-IRA)'],['plan','Traditional TSP / 401(k) / 403(b)'],['g457','Governmental 457(b)'],['rothira','Roth IRA'],['rothplan','Roth TSP / Roth 401(k) / Roth 403(b)'],['hsa','HSA']];
  function syncShow(){
    const a = st().w.acct;
    $$('#inv-w-fields [data-show]').forEach(el=>{
      el.style.display = el.getAttribute('data-show').split(' ').includes(a) ? '' : 'none';
    });
  }

  const GLOSS = [
    ['Expense ratio','The yearly fee a fund charges, as a % of your money. 0.05% = $5 per $10,000. Lower is better; it comes out whether the fund does well or not.'],
    ['Index fund','A fund that simply owns everything in a market index (like the S&P 500) instead of trying to pick winners. Low cost, broad, hard to beat over time.'],
    ['Compounding','Earning returns on your past returns. It is why starting early matters more than starting big.'],
    ['RMD','Required Minimum Distribution. The IRS makes you start taking money out of pre-tax accounts at 73 (born 1951 to 1959) or 75 (born 1960 or later). Roth IRAs, Roth TSP and Roth 401(k)s have no lifetime RMDs.'],
    ['Vesting','When employer money becomes truly yours. Your own contributions are always 100% vested.'],
    ['Rollover','Moving retirement money from one account to another (for example, old 403(b) to the TSP or an IRA) without paying tax. A direct rollover (trustee to trustee) is safest.'],
    ['Diversification','Spreading money across many companies, types of investments and countries so one bad apple cannot sink you.'],
    ['Basis','The money you already paid tax on. It is not taxed again when it comes out.'],
    ['Marginal tax rate','The rate on your next (or last) dollar of income. This is the rate that matters for Roth vs Traditional choices.']
  ];

  // ---------- view ----------
  function view(){
    const s = st(), g=s.g, w=s.w;
    const quick = [
      ['TSP / 403(b) / 401(k)','$24,500 (shared)','+$8,000 at 50; $11,250 at 60 to 63'],
      ['457(b)','$24,500 (separate)','+$8,000 at 50; $11,250 at 60 to 63'],
      ['Total plan additions (415(c))','$72,000','catch-ups on top'],
      ['IRA (traditional + Roth)','$7,500','+$1,100 at 50'],
      ['HSA','$4,400 self / $8,750 family','+$1,000 at 55'],
      ['SEP-IRA','~20% of net SE earnings, max $72,000','none'],
      ['I bonds','$10,000 per person per year','']
    ];
    return `<div class="stack">
      <div class="panel money">
        <div class="eyebrow-s">Learning tab · 🟨 money</div>
        <h2>Investing: how the accounts work</h2>
        <p class="small">Open any card to see who can use the account, the 2026 limits, how it is taxed, and the catches. Then practice with the models below using made-up numbers. Nothing here is advice for your exact situation; it is a study guide.</p>
        <div class="tbl-wrap"><table class="mtbl"><thead><tr><th>Account</th><th>2026 limit</th><th>Catch-up</th></tr></thead>
          <tbody>${quick.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('')}</tbody></table></div>
        <p class="small muted">Color code: 🟩 green border = military (TSP). 🟦 blue border = nursing and school jobs (403(b), 457(b), match). 🟨 gold = everything else.</p>
        <div class="row"><button class="btn sm" data-inv-all="1">Open all cards</button><button class="btn sm" data-inv-all="0">Close all cards</button></div>
      </div>

      <h3>Account types</h3>
      ${CARDS.map(c=>card(c, !!s.open[c.id])).join('')}

      <details class="panel money" data-card="world"${s.open.world?' open':''}>
        <summary><b>🌍 Around the world: international investing</b></summary>
        <div class="stack" style="margin-top:10px">
          <p class="small">The US is the biggest stock market, but roughly a third or more of the world's stock market value is in other countries. A "total world" or "total international" index fund (or the TSP I Fund) spreads money across thousands of foreign companies.</p>
          <div class="grid2">
            <div><div class="eyebrow-s">✅ Why own some</div><ul class="small"><li>Diversification: US and foreign markets take turns leading, sometimes for a decade or more.</li><li>Developed markets (Europe, Japan, Canada, Australia) are large, stable economies.</li><li>Emerging markets (India, Brazil, Taiwan, and others) have faster-growing economies.</li></ul></div>
            <div><div class="eyebrow-s">⚠️ Risks</div><ul class="small"><li>Currency risk: if the dollar gets stronger, foreign returns shrink when converted back (and the reverse).</li><li>Political risk: wars, sanctions, capital controls, or a government seizing companies. Emerging markets carry more of this.</li><li>Higher swings and slightly higher fees, especially emerging markets.</li></ul></div>
          </div>
          <p class="small muted">Good to know: a broad index fund is the simple way in; picking single countries is a bet. The TSP I Fund excludes China and Hong Kong.</p>
        </div>
      </details>

      <h3>Practice models (dummy numbers)</h3>

      <div class="panel money">
        <h3>1. Growth calculator</h3>
        <p class="small muted">How a starting amount plus monthly saving grows, and what a yearly fee costs you.</p>
        <div class="fields">
          ${fld('g','start','Starting balance ($)',{min:0})}
          ${fld('g','monthly','Monthly contribution ($)',{min:0})}
          ${fld('g','years','Years',{min:1,step:1})}
          ${fld('g','ret','Expected yearly return (%)')}
          ${fld('g','fee','Yearly fee (%)',{min:0})}
        </div>
        <div id="inv-out-g">${outGrowth()}</div>
      </div>

      <div class="panel money">
        <h3>2. Account comparison: what you keep at retirement</h3>
        <p class="small muted">Same slice of your paycheck each year (before tax), same return. Roth and taxable pay tax first, so less goes in. Traditional and HSA go in whole.</p>
        <div class="fields">
          ${fld('c','yearly','Paycheck dollars per year ($, before tax)',{min:0})}
          ${fld('c','years','Years',{min:1,step:1})}
          ${fld('c','ret','Yearly return (%)')}
          ${fld('c','taxNow','Tax rate now (%)',{min:0})}
          ${fld('c','taxLater','Tax rate in retirement (%)',{min:0})}
          ${fld('c','cg','Capital gains rate (%)',{min:0})}
        </div>
        <div id="inv-out-c">${outCompare()}</div>
      </div>

      <div class="panel money">
        <h3>3. Early-withdrawal what-if</h3>
        <p class="small muted">Estimated tax and penalty if you take money out. Rough estimate only.</p>
        <div class="fields" id="inv-w-fields">
          <label class="f">Account type<select data-inv="w.acct">${ACCTS.map(([v,t])=>`<option value="${v}"${w.acct===v?' selected':''}>${t}</option>`).join('')}</select></label>
          ${fld('w','amount','Amount to take out ($)',{min:0})}
          ${fld('w','age','Your age at withdrawal',{min:18,step:0.5})}
          ${fld('w','fed','Federal tax bracket (%)',{min:0})}
          ${fld('w','state','State tax rate (%)',{min:0})}
          ${fld('w','balance','Roth account balance ($)',{min:0,show:'rothplan'})}
          ${fld('w','basis','Your Roth contributions so far ($)',{min:0,show:'rothira rothplan'})}
          ${chk('w','five','First Roth contribution 5+ years ago','rothira rothplan')}
          ${chk('w','sep55','Left this employer in or after the year I turned 55','plan rothplan')}
          ${chk('w','separated','I no longer work for this employer','g457')}
          ${chk('w','medical','Used for qualified medical costs','hsa')}
        </div>
        <div id="inv-out-w">${outWithdraw()}</div>
      </div>

      <div class="panel money">
        <h3>4. Risk and return mix</h3>
        <p class="small muted">Slide to change the share in stocks vs bonds and see how a mix like that behaved in the past.</p>
        <label class="f">Stocks: <b id="inv-mix-lbl">${s.r.stocks}%</b> · Bonds: <b id="inv-mix-lbl2">${100-s.r.stocks}%</b>
          <input type="range" min="0" max="100" step="5" data-inv="r.stocks" value="${esc(String(s.r.stocks))}" aria-label="Percent in stocks"></label>
        <div id="inv-out-r">${outMix()}</div>
        <div class="warnbox small">Past returns do not predict the future. These are yearly returns for US stock and bond mixes from 1926 to 2019, before fees, taxes and inflation (Vanguard data, as shown by Visual Capitalist). In-between mixes are estimated. A real bad stretch can last several years in a row.</div>
      </div>

      <div class="panel money">
        <h3>Glossary</h3>
        <div class="pl-list small">${GLOSS.map(([t,d])=>`<div class="pl-row"><span><b>${t}</b></span><span class="amt" style="text-align:left;max-width:72%">${d}</span></div>`).join('')}</div>
      </div>

      <p class="small muted">Sources: IRS (2026 limits, Notice 2025-67), Rev. Proc. 2025-19 via Thomson Reuters, IRS Notice 2026-05 via CPA Practice Advisor, MOAA, Minnesota Dept. of Revenue Schedule M1529 (2026), TreasuryDirect, FedSmith (TSP 2026), Kitces, Janney (529, 2026), Vanguard data via Visual Capitalist. Checked October 2026. Rules change; confirm with the plan or a tax professional before acting.</p>
    </div>`;
  }

  // ---------- bind ----------
  function bind(){
    const s = st();
    syncShow();
    $$('[data-inv]').forEach(el=>{
      const [grp,key] = el.getAttribute('data-inv').split('.');
      const ev = (el.tagName==='SELECT' || el.type==='checkbox') ? 'change' : 'input';
      el.addEventListener(ev, ()=>{
        let v;
        if(el.type==='checkbox') v = el.checked;
        else if(el.tagName==='SELECT') v = el.value;
        else { if(el.value.trim()==='' ) return; v = num(el.value); }
        s[grp][key] = v;
        save();
        if(grp==='w' && key==='acct') syncShow();
        if(grp==='r'){ const a=$('#inv-mix-lbl'), b=$('#inv-mix-lbl2'); if(a) a.textContent=v+'%'; if(b) b.textContent=(100-v)+'%'; }
        refresh(grp);
      });
    });
    $$('details[data-card]').forEach(d=>{
      d.addEventListener('toggle', ()=>{ s.open[d.getAttribute('data-card')] = d.open; save(); });
    });
    $$('[data-inv-all]').forEach(b=>{
      b.addEventListener('click', ()=>{
        const open = b.getAttribute('data-inv-all')==='1';
        $$('details[data-card]').forEach(d=>{ d.open = open; s.open[d.getAttribute('data-card')] = open; });
        save();
      });
    });
  }

  TABS2.push({id:ID, name:'Investing', order:40, view, bind});
})();
