// Work and retirement reference data for the planner tabs.
// General public facts only, checked October 2026. Numbers change every year; confirm before acting.
// Each fact is {text, source}. Items marked uncertain: true need confirmation (for military items, with the HRO).

const WORKDATA = {
  checked: "2026-10",

  // 1. Teaching nursing part time later in life
  adjunct: {
    requirements: {
      rule: "Minnesota Rules 6301.2340 (Board of Nursing nursing program approval), subpart 3",
      facts: [
        {
          text: "Practical nursing (PN/LPN) programs: faculty need a baccalaureate or graduate degree in nursing from an accredited school. A BSN is enough to teach in a PN program, both classroom and clinical.",
          source: "https://www.revisor.mn.gov/rules/6301.2340/version/2016-12-22T10:14:41-06:00"
        },
        {
          text: "Professional (RN) programs (ADN and BSN): full-time faculty must have a graduate degree, and the majority of part-time faculty must have a graduate degree. If the graduate degree is not in nursing, the faculty member must also have a BSN.",
          source: "https://www.revisor.mn.gov/rules/6301.2340/version/2016-12-22T10:14:41-06:00"
        },
        {
          text: "Because only a majority of part-time RN-program faculty must hold a graduate degree, some part-time clinical instructor jobs in ADN and BSN programs accept a BSN (for example Minnesota State Mankato pre-licensure clinical adjunct and Bethel BSN adjunct clinical postings listed a BSN minimum, master's preferred).",
          source: "https://admin.mnsu.edu/globalassets/human-resources/media/job-postings/adjunct-pre-licensure-nursing-program-clinical-instructor.pdf"
        },
        {
          text: "The rule does not set different degree levels for didactic (classroom) versus clinical teaching. All nursing faculty must hold a current unencumbered Minnesota RN license. Teaching with high-fidelity simulation requires documented simulation training.",
          source: "https://www.revisor.mn.gov/rules/6301.2340/version/2016-12-22T10:14:41-06:00"
        },
        {
          text: "Program directors (PN and RN) must have a graduate degree in nursing.",
          source: "https://www.revisor.mn.gov/rules/6301.2340/version/2016-12-22T10:14:41-06:00"
        },
        {
          text: "Minnesota State colleges add their own minimums. A 2026 St. Cloud Technical and Community College adjunct practical nursing posting required a BSN, an unencumbered Minnesota RN license, and 2 years of full-time RN experience (1 within the last 5 years).",
          source: "https://www.stcloudshines.com/jobs/adjunct-practical-nursing-instructor-field-500040-2/"
        },
        {
          text: "Practical upshot: with a BSN plus 2 or more years of RN experience you can teach PN courses and clinicals and some RN-program clinicals. A DNP (planned around 2030) qualifies you for classroom and clinical teaching in ADN, BSN and graduate programs.",
          source: "https://www.revisor.mn.gov/rules/6301.2340/version/2016-12-22T10:14:41-06:00"
        }
      ]
    },

    pay: {
      perCredit: {
        unit: "USD per semester credit",
        low: 1650,
        typical: 1844,
        high: 1888,
        facts: [
          {
            text: "Minnesota State universities (IFO contract, includes Winona State and Minnesota State Mankato): adjunct (community faculty) minimum is $1,844 per credit in FY2026 and $1,888 per credit in FY2027.",
            source: "https://www.ifo.org/ifo-updates/2025/10/7/contract-settlement-info"
          },
          {
            text: "Minnesota State Mankato posted $1,819 per credit for an adjunct pre-licensure clinical instructor in 2024 (before the 2025-2027 raises).",
            source: "https://admin.mnsu.edu/globalassets/human-resources/media/job-postings/adjunct-pre-licensure-nursing-program-clinical-instructor.pdf"
          },
          {
            text: "Minnesota State colleges (MSCF contract, 2025-2027): adjunct pay is set by the master agreement salary schedule. A September 2026 St. Cloud Technical and Community College adjunct practical nursing posting paid $1,650 per credit, up to 4 credits.",
            source: "https://www.stcloudshines.com/jobs/adjunct-practical-nursing-instructor-field-500040-2/"
          },
          {
            text: "Rough per-course math: a 3-credit course pays about $4,950 at $1,650 per credit and about $5,530 at $1,844 per credit.",
            source: "https://www.ifo.org/ifo-updates/2025/10/7/contract-settlement-info"
          }
        ]
      },
      clinicalHourly: {
        unit: "USD per hour",
        low: 37,
        typical: 42.45,
        high: 57.25,
        facts: [
          {
            text: "ZipRecruiter (2026): most Minnesota clinical nursing instructor jobs pay about $37 to $50 per hour, median $42.45.",
            source: "https://www.ziprecruiter.com/Jobs/Clinical-Nursing-Instructor/--in-Minnesota"
          },
          {
            text: "Private schools: 2026 Twin Cities postings for part-time clinical nursing faculty (Chamberlain University, Concordia St. Paul ABSN) showed about $39.50 to $57.25 per hour (some are ZipRecruiter estimates, not employer-posted).",
            source: "https://www.ziprecruiter.com/Jobs/Clinical-Nursing-Instructor/--in-Minnesota"
          }
        ]
      },
      fullTimeBenchmark: {
        unit: "USD per year",
        minnesotaMedian: 81280,
        nationalMedian: 80250,
        facts: [
          {
            text: "BLS OEWS May 2025, nursing instructors and teachers, postsecondary: Minnesota median $81,280 per year; U.S. median $80,250 (full-time benchmark, not adjunct pay).",
            source: "https://wagedex.com/jobs/nursing-instructors-and-teachers-postsecondary"
          },
          {
            text: "Minnesota State college full-time nursing faculty postings in 2025-2026 listed about $43,900 to $95,500 per year depending on education and experience.",
            source: "https://ridgewater.edu/wp-content/uploads/2025/10/Vacany-Notice-Practical-Nursing-Instructor-10.2025.pdf"
          }
        ]
      }
    },

    schools: [
      { name: "Dakota County Technical College", city: "Rosemount", programs: ["PN"], teachesWithBsn: true, note: "Practical nursing program: a BSN meets the Board rule. Closest to Hastings.", url: "https://www.dctc.edu" },
      { name: "Inver Hills Community College", city: "Inver Grove Heights", programs: ["ADN"], teachesWithBsn: false, note: "RN program: master's usually expected; part-time clinical with a BSN is possible but not guaranteed.", url: "https://www.inverhills.edu" },
      { name: "Minnesota State College Southeast (Red Wing campus)", city: "Red Wing", programs: ["PN", "ADN"], teachesWithBsn: true, note: "BSN is enough for the PN side; ADN side usually wants a master's.", url: "https://www.southeastmn.edu" },
      { name: "Rochester Community and Technical College", city: "Rochester", programs: ["PN", "ADN"], teachesWithBsn: true, note: "BSN works for PN courses and clinicals; full-time ADN faculty hold an MSN.", url: "https://www.rctc.edu" },
      { name: "Winona State University (Rochester campus)", city: "Rochester", programs: ["BSN", "DNP"], teachesWithBsn: false, note: "University BSN and graduate programs: plan on a graduate degree; BSN clinical adjunct is occasionally possible.", url: "https://www.winona.edu" },
      { name: "University of Minnesota School of Nursing", city: "Minneapolis and Rochester", programs: ["BSN", "Entry-level MN", "DNP"], teachesWithBsn: false, note: "Research university: graduate degree expected; DNP incl. psychiatric mental health NP track.", url: "https://nursing.umn.edu" },
      { name: "Saint Paul College", city: "St. Paul", programs: ["PN"], teachesWithBsn: true, note: "Practical nursing program: BSN qualifies.", url: "https://www.saintpaul.edu" },
      { name: "Hennepin Technical College", city: "Eden Prairie and Brooklyn Park", programs: ["PN"], teachesWithBsn: true, note: "Practical nursing program: BSN qualifies.", url: "https://www.hennepintech.edu" },
      { name: "Minneapolis College", city: "Minneapolis", programs: ["ADN"], teachesWithBsn: false, note: "RN program: master's usually expected.", url: "https://minneapolis.edu" },
      { name: "Herzing University (Minneapolis campus)", city: "St. Louis Park", programs: ["PN", "BSN", "MSN"], teachesWithBsn: true, note: "BSN can teach the PN program; BSN and MSN tracks generally want a master's.", url: "https://www.herzing.edu" },
      { name: "Rasmussen University (Eagan campus)", city: "Eagan", programs: ["PN", "BSN"], teachesWithBsn: true, note: "PN program accepts BSN faculty under the rule; BSN program usually wants MSN.", url: "https://www.rasmussen.edu" },
      { name: "Metropolitan State University", city: "St. Paul", programs: ["BSN", "Entry-level MSN", "DNP"], teachesWithBsn: false, note: "University programs: graduate degree expected.", url: "https://www.metrostate.edu" },
      { name: "St. Catherine University", city: "St. Paul", programs: ["BSN", "Entry-level master's", "DNP"], teachesWithBsn: false, note: "Graduate degree expected; BSN clinical adjunct sometimes possible.", url: "https://www.stkate.edu" },
      { name: "Bethel University", city: "St. Paul", programs: ["BSN", "graduate nursing"], teachesWithBsn: true, note: "2023 BSN adjunct clinical posting required a BSN (master's preferred) plus 5 years clinical experience.", url: "https://www.bethel.edu" },
      { name: "Concordia University St. Paul", city: "St. Paul", programs: ["ABSN"], teachesWithBsn: false, note: "Accelerated BSN with part-time clinical faculty postings; check each posting for degree minimum.", url: "https://www.csp.edu" }
    ],
    schoolsSource: "https://mn.gov/boards/nursing/education/approved-professional-nursing-programs and https://mn.gov/boards/nursing/education/approved-practical-nursing-programs",

    whereToFind: [
      { text: "Minnesota State careers site lists adjunct and full-time faculty openings for all state colleges and universities (DCTC, Inver Hills, Southeast, RCTC, Winona State, Metro State and more).", source: "https://careers.minnstate.edu" },
      { text: "HigherEdJobs lists faculty openings at public and private colleges; filter by Minnesota and nursing.", source: "https://www.higheredjobs.com" },
      { text: "Private schools (St. Catherine, Bethel, Herzing, Rasmussen, Concordia, Chamberlain) post on their own HR pages and on general boards such as Indeed and ZipRecruiter.", source: "https://www.ziprecruiter.com/Jobs/Clinical-Nursing-Instructor/--in-Minnesota" },
      { text: "Many adjunct postings stay open until filled as a pool; apply early so you are in the pool when a section opens.", source: "https://admin.mnsu.edu/globalassets/human-resources/media/job-postings/adjunct-pre-licensure-nursing-program-clinical-instructor.pdf" }
    ],

    tips: [
      { text: "Get 2 or more years of full-time RN experience first; most Minnesota postings require it.", source: "https://www.stcloudshines.com/jobs/adjunct-practical-nursing-instructor-field-500040-2/" },
      { text: "Start as a clinical instructor in a practical nursing program (BSN qualifies), then add RN-program clinicals and classroom teaching after the DNP.", source: "https://www.revisor.mn.gov/rules/6301.2340/version/2016-12-22T10:14:41-06:00" },
      { text: "Precepting students and new grads at your job, and nurse educator experience, are listed as assets in adjunct postings.", source: "https://facultycareers-bethel.icims.com/jobs/1843/bsn-program-nursing-adjunct-clinical-faculty/job" },
      { text: "Psych and mental health clinical instructors are in demand; your PMHNP path fits psych clinical rotations.", source: "https://admin.mnsu.edu/globalassets/human-resources/media/job-postings/adjunct-son-plp-mh-clinical-7.pdf" },
      { text: "Minnesota veterans preference (10 points, 15 if disabled) applies to competitive exams for cities, counties, school districts and other political subdivisions. College faculty jobs are generally unclassified and may not use points, so mention your veteran status anyway.", source: "https://www.revisor.mn.gov/statutes/2025/cite/197.455", uncertain: true }
    ]
  },

  // 2. Nurse pay in Minnesota
  nursePay: {
    rn: [
      { area: "Minneapolis-St. Paul-Bloomington MSA", stat: "median", hourly: 49.54, annual: 103040, year: "May 2025", text: "RN median $49.54 per hour, $103,040 per year; 10th percentile $82,180, 90th percentile $133,450.", source: "https://wagedex.com/jobs/registered-nurses/metro/minneapolis-st-paul-bloomington-mn-wi (BLS OEWS May 2025)" },
      { area: "Rochester MN MSA", stat: "mean", hourly: 51.21, annual: 106510, year: "May 2025", text: "RN mean $51.21 per hour, $106,510 per year.", source: "https://www.bls.gov/regions/midwest/news-release/occupationalemploymentandwages_rochestermn.htm" },
      { area: "Rochester MN MSA", stat: "median", hourly: 48.87, annual: 101660, year: "May 2025", text: "RN median $48.87 per hour, $101,660 per year; 10th percentile $81,960.", source: "https://wagedex.com/jobs/registered-nurses/metro/rochester-mn (BLS OEWS May 2025)" },
      { area: "Minnesota statewide", stat: "median", hourly: null, annual: 101510, year: "May 2025", text: "RN median $101,510 per year, about 4% above the U.S. median.", source: "https://wagedex.com/jobs/registered-nurses (BLS OEWS May 2025)" },
      { area: "United States", stat: "median", hourly: 46.90, annual: 97550, year: "May 2025", text: "RN median $46.90 per hour, $97,550 per year (mean $101,420).", source: "https://wagedex.com/jobs/registered-nurses (BLS OEWS May 2025)" }
    ],
    newGrad: [
      { text: "Twin Cities new grad RN pay: about $39 to $49 per hour total pay, median about $44 (Glassdoor 2026, self-reported).", low: 39, typical: 44, high: 49, unit: "USD per hour", source: "https://www.glassdoor.com/Salaries/minneapolis-new-grad-rn-salary-SRCH_IL.0,11_IM567_KO12,23.htm" },
      { text: "Mayo Clinic Rochester nurse residency posting listed a $34.84 to $70.41 per hour range (whole RN scale; new grads start near the bottom).", low: 34.84, high: 70.41, unit: "USD per hour", source: "https://jobs.mayoclinic.org/job/rochester/nurse-residency-rn-incentive-eligible/33647/72798610352" },
      { text: "Minnesota Nurses Association Twin Cities hospital contract ratified July 2025: 10% raises over 3 years for about 15,000 nurses at 13 hospitals (union step scales set new-grad start rates).", source: "https://www.cbsnews.com/amp/minnesota/news/minnesota-nurses-ratify-new-contract" }
    ],
    np: [
      { area: "Minnesota statewide", stat: "median", hourly: 64.07, annual: 133260, year: "May 2025", text: "Nurse practitioner median $64.07 per hour, $133,260 per year; 10th percentile $98,950, 90th percentile $170,140.", source: "https://wagedex.com/jobs/nurse-practitioners/minnesota (BLS OEWS May 2025)" },
      { area: "Rochester MN MSA", stat: "mean", hourly: 57.68, annual: 119980, year: "May 2025", text: "Nurse practitioner mean $57.68 per hour, $119,980 per year.", source: "https://www.bls.gov/regions/midwest/news-release/occupationalemploymentandwages_rochestermn.htm" },
      { area: "United States", stat: "median", hourly: 63.61, annual: 132300, year: "May 2025", text: "Nurse practitioner median $63.61 per hour, $132,300 per year. BLS does not split out psychiatric NPs; PMHNPs are counted here.", source: "https://wagedex.com/jobs/nurse-practitioners (BLS OEWS May 2025)" }
    ],
    partTime: [
      { option: "0.9 to 0.6 FTE", text: "Hospitals post RN jobs by FTE (1.0 = 80 hours per 2 weeks). 0.6 FTE is about 48 hours per 2 weeks (three 8s a week, or two 12s plus). These are usually benefits eligible, with benefits prorated.", source: "https://jobs.mayoclinic.org/job/rochester/nurse-residency-rn-incentive-eligible/33647/72798610352", uncertain: true },
      { option: "0.5 FTE and below", text: "Benefits eligibility cutoffs vary by employer and union contract (often around 0.5 FTE or a set hours-per-week minimum). Check the posting's 'benefits eligible' line.", source: "https://jobs.mayoclinic.org/job/rochester/nurse-residency-rn-incentive-eligible/33647/72798610352", uncertain: true },
      { option: "PRN / casual / per diem", text: "No set hours and usually no benefits; often a higher hourly rate than staff pay. Many employers want 1 to 2 years of experience before PRN, and require a minimum number of shifts per scheduling period. With TRICARE as a military retiree, a no-benefits PRN job can work well.", source: "https://www.glassdoor.com/Salaries/minneapolis-new-grad-rn-salary-SRCH_IL.0,11_IM567_KO12,23.htm", uncertain: true }
    ]
  },

  // 3. Starting a civilian nursing job while on leave before AGR retirement
  workOnLeave: {
    facts: [
      { text: "Terminal (transition) leave is still active service: you stay on orders, keep full military pay and allowances, and remain subject to military rules until your retirement date. NGR 600-5 calls it transition leave and lets AGR soldiers use accrued leave before release or retirement, or sell it.", source: "https://www.ngbpmc.ng.mil/Portals/27/Publications/NGR/NGR%20600-5_20230512.pdf" },
      { text: "Many service members start private-sector civilian jobs during terminal leave and draw both paychecks. Get the leave approved in writing first.", source: "https://www.vetrafi.com/education-articles/terminal-leave-starting-civilian-job" },
      { text: "NGR 600-5 (AGR program) does not itself set an outside-employment approval process. Each state's Adjutant General (TAG) or HRO policy does; for example Hawaii requires TAG approval for AGR off-duty employment. Ask the Minnesota HRO whether a written outside-employment request is needed for ordinary leave and for terminal leave.", source: "https://dod.hawaii.gov/blog/pane-mai-question-02-01-2025-off-duty-employment/", uncertain: true },
      { text: "The DoD Joint Ethics Regulation (DoD 5500.07-R, section 2-206) requires prior written approval for outside employment by people who file financial disclosure reports, and lets commands require approval for others. The job must not conflict with official duties or use government time or equipment.", source: "https://www.nationalsecuritylawfirm.com/ultimate-guide-to-off-duty-employment-approval-for-federal-and-military-personnel/", uncertain: true },
      { text: "Title 32 AGR soldiers fall under the state military code (Minnesota Code of Military Justice, Minn. Stat. ch. 192A) rather than the UCMJ while in Title 32 status. Conduct rules still apply during leave.", source: "https://www.revisor.mn.gov/statutes/cite/192A", uncertain: true },
      { text: "A federal civilian job (for example VA nursing) during terminal leave is allowed by 5 U.S.C. 5534a, which lets a member on terminal leave accept a federal civilian position and be paid for both. Check dual-appointment rules with the hiring HR office.", source: "https://www.law.cornell.edu/uscode/text/5/5534a" },
      { text: "Minnesota lets residents subtract federally taxable active-duty pay for National Guard members under titles 10 and 32 (Schedule M1M). AGR pay, including terminal leave pay, may qualify; AGR is not named on the page.", source: "https://www.revenue.state.mn.us/military-personnel-subtractions-credits-and-extensions-0", uncertain: true }
    ],
    licenseTiming: [
      { text: "Minnesota RN licensure by exam: you can file the Board application before graduation; the school sends a Confirmation of Program Completion after you finish. Fees: $105 application plus $32 criminal background check (fingerprints), plus the NCLEX fee to Pearson VUE.", source: "https://www.minnesota.edu/sites/default/files/2025-10/mn-licensure-by-exam-instructions-25.pdf" },
      { text: "After the Board clears you, Pearson VUE emails an Authorization to Test (ATT) good for 90 days. Results are free on the Board website; the Board mails the license about 10 business days after the exam.", source: "https://www.minnesota.edu/sites/default/files/2025-10/mn-licensure-by-exam-instructions-25.pdf" },
      { text: "Rough timeline for an April 2027 graduation: ATT in May, NCLEX in May or June, license by June or July 2027. Exact timing depends on processing and testing slots.", source: "https://www.minnesota.edu/sites/default/files/2025-10/mn-licensure-by-exam-instructions-25.pdf", uncertain: true },
      { text: "Hospital new-grad residencies hire spring graduates for summer starts (for example Mayo Clinic offered a bonus for 2025 grads starting by August 30). An RN license is required to work as an RN; some employers hire graduate nurses before the license and set a deadline to pass.", source: "https://jobs.mayoclinic.org/job/rochester/nurse-residency-rn-incentive-eligible/33647/72798610352", uncertain: true }
    ],
    practical: [
      { text: "Line up the retirement date, terminal leave start and the residency start so the license arrives before the job starts. Ask the HRO in writing about outside-employment approval.", source: "https://www.ngbpmc.ng.mil/Portals/27/Publications/NGR/NGR%20600-5_20230512.pdf", uncertain: true },
      { text: "Talk to a free military legal assistance attorney (JAG) before accepting a job that overlaps active service.", source: "https://www.vetrafi.com/education-articles/terminal-leave-starting-civilian-job" }
    ]
  },

  // 4. Retirement milestone ages (as of 2026)
  milestones: [
    { age: 50, label: "Catch-up contributions", text: "Extra 401(k)/403(b)/457/TSP contributions of $8,000 in 2026 (regular limit $24,500), and $1,100 extra in an IRA (limit $7,500).", source: "https://www.fox9.com/news/irs-reveals-updated-retirement-contribution-limits-2026" },
    { age: 55, label: "Rule of 55", text: "If you leave an employer in or after the year you turn 55, you can take money from that employer's 401(k)/403(b) or the TSP without the 10% early penalty. It does not apply to IRAs, or to a TSP if you separated before that year (a 2027 Army retirement before 55 does not count).", source: "https://www.tsp.gov/living-in-retirement/" },
    { age: 59.5, label: "Penalty-free withdrawals", text: "No 10% early-withdrawal penalty from IRAs and workplace plans; regular income tax still applies.", source: "https://www.irs.gov/retirement-plans/plan-participant-employee/retirement-topics-tax-on-early-distributions" },
    { age: 60, ageEnd: 63, label: "Super catch-up", text: "Ages 60 to 63 can add $11,250 (instead of $8,000) in 401(k)/403(b)/457/TSP in 2026.", source: "https://www.fox9.com/news/irs-reveals-updated-retirement-contribution-limits-2026" },
    { age: 62, label: "Earliest Social Security", text: "Social Security can start, but permanently reduced (about 30% less if full retirement age is 67).", source: "https://www.ssa.gov/benefits/retirement/planner/agereduction.html" },
    { age: 65, label: "Medicare and TRICARE For Life", text: "Medicare starts. Military retirees must enroll in Medicare Part A and Part B to keep TRICARE coverage (TRICARE For Life).", source: "https://www.tricare.mil/Plans/HealthPlans/TFL" },
    { age: 67, label: "Full retirement age", text: "Full Social Security retirement age for anyone born in 1960 or later.", source: "https://www.ssa.gov/benefits/retirement/planner/ageincrease.html" },
    { age: 70, label: "Max Social Security", text: "Delayed credits (8% a year after full retirement age) stop at 70; no reason to wait longer.", source: "https://www.ssa.gov/benefits/retirement/planner/delayret.html" },
    { age: 70.5, label: "QCDs", text: "Qualified charitable distributions straight from an IRA to charity, up to $111,000 per person in 2026, are tax free and count toward RMDs.", source: "https://www.everycrsreport.com/files/2026-01-15_IF11377_61619926ac55e159b5cbc639d4891481a4c4f0a1.html" },
    { age: 73, label: "RMDs (born 1951-1959)", text: "Required minimum distributions from traditional IRAs and workplace plans start at 73 for people born 1951 through 1959.", source: "https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs" },
    { age: 75, label: "RMDs (born 1960+)", text: "Required minimum distributions start at 75 for people born in 1960 or later (SECURE 2.0).", source: "https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs" }
  ],

  minnesota: [
    { text: "Military retirement pay that is federally taxable (active and reserve component retired pay, and Survivor Benefit Plan payments) can be subtracted from Minnesota taxable income on Schedule M1M. You cannot also take the Credit for Past Military Service.", source: "https://www.revenue.state.mn.us/military-pension-subtraction" },
    { text: "Credit for Past Military Service: up to $750, only if federal AGI is under $37,500 (alternative to the subtraction).", source: "https://www.revenue.state.mn.us/military-personnel-subtractions-credits-and-extensions-0" },
    { text: "Social Security subtraction for tax year 2026: full subtraction up to AGI $110,780 married filing jointly, $86,410 single or head of household; it drops 10% for each $4,000 over.", mfjThreshold: 110780, singleThreshold: 86410, phaseOutStep: 4000, source: "https://clearmoneyguide.com/does-minnesota-tax-social-security/ (Minnesota Department of Revenue, Minn. Stat. 290.0132 subd. 26)" },
    { text: "Tax year 2025 Social Security subtraction thresholds were $108,320 married filing jointly and $84,490 single.", source: "https://clearmoneyguide.com/does-minnesota-tax-social-security/" }
  ]
};

// Sources:
// https://www.revisor.mn.gov/rules/6301.2340/version/2016-12-22T10:14:41-06:00
// https://mn.gov/boards/nursing/education/approved-practical-nursing-programs
// https://mn.gov/boards/nursing/education/approved-professional-nursing-programs
// https://www.ifo.org/ifo-updates/2025/10/7/contract-settlement-info
// https://www.minnstate.edu/system/working/docs/contracts/mscf-contract.pdf
// https://admin.mnsu.edu/globalassets/human-resources/media/job-postings/adjunct-pre-licensure-nursing-program-clinical-instructor.pdf
// https://www.stcloudshines.com/jobs/adjunct-practical-nursing-instructor-field-500040-2/
// https://ridgewater.edu/wp-content/uploads/2025/10/Vacany-Notice-Practical-Nursing-Instructor-10.2025.pdf
// https://facultycareers-bethel.icims.com/jobs/1843/bsn-program-nursing-adjunct-clinical-faculty/job
// https://www.ziprecruiter.com/Jobs/Clinical-Nursing-Instructor/--in-Minnesota
// https://wagedex.com/jobs/nursing-instructors-and-teachers-postsecondary
// https://www.revisor.mn.gov/statutes/2025/cite/197.455
// https://www.bls.gov/regions/midwest/news-release/occupationalemploymentandwages_rochestermn.htm
// https://wagedex.com/jobs/registered-nurses/metro/minneapolis-st-paul-bloomington-mn-wi
// https://wagedex.com/jobs/registered-nurses/metro/rochester-mn
// https://wagedex.com/jobs/registered-nurses
// https://wagedex.com/jobs/nurse-practitioners/minnesota
// https://wagedex.com/jobs/nurse-practitioners
// https://www.glassdoor.com/Salaries/minneapolis-new-grad-rn-salary-SRCH_IL.0,11_IM567_KO12,23.htm
// https://jobs.mayoclinic.org/job/rochester/nurse-residency-rn-incentive-eligible/33647/72798610352
// https://www.cbsnews.com/amp/minnesota/news/minnesota-nurses-ratify-new-contract
// https://www.ngbpmc.ng.mil/Portals/27/Publications/NGR/NGR%20600-5_20230512.pdf
// https://dod.hawaii.gov/blog/pane-mai-question-02-01-2025-off-duty-employment/
// https://www.nationalsecuritylawfirm.com/ultimate-guide-to-off-duty-employment-approval-for-federal-and-military-personnel/
// https://www.vetrafi.com/education-articles/terminal-leave-starting-civilian-job
// https://www.law.cornell.edu/uscode/text/5/5534a
// https://www.minnesota.edu/sites/default/files/2025-10/mn-licensure-by-exam-instructions-25.pdf
// https://www.fox9.com/news/irs-reveals-updated-retirement-contribution-limits-2026
// https://www.everycrsreport.com/files/2026-01-15_IF11377_61619926ac55e159b5cbc639d4891481a4c4f0a1.html
// https://www.revenue.state.mn.us/military-pension-subtraction
// https://www.revenue.state.mn.us/military-personnel-subtractions-credits-and-extensions-0
// https://clearmoneyguide.com/does-minnesota-tax-social-security/
// https://www.tsp.gov/living-in-retirement/ (Rule of 55 / separation-year rule, general knowledge, not fetched)
// https://www.ssa.gov/benefits/retirement/planner/ageincrease.html (general knowledge, not fetched)
// https://www.tricare.mil/Plans/HealthPlans/TFL (general knowledge, not fetched)
// https://www.irs.gov/retirement-plans/retirement-plan-and-ira-required-minimum-distributions-faqs (general knowledge, not fetched)
