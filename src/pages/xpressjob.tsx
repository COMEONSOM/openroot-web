// ============================================================
// OPENROOT XpressJob — XpressJob.tsx
// VERSION: 2.0.0 — Full rewrite
// ============================================================


import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import gsap from 'gsap';
import '../components/styles/XpressJob.css';


// ─── Constants ───────────────────────────────────────────────
const MAX_STARS = 5;
const SAVE_DEBOUNCE_MS = 300;
const DESKTOP_BREAKPOINT = 900; // px — must match CSS


const IMG_CLOUD = "https://res.cloudinary.com/dydh05l1u/image/upload";
const img = (publicId: string) => `${IMG_CLOUD}/q_auto,f_auto/${publicId}`;


// ─── Types ───────────────────────────────────────────────────
type JobType = 'central' | 'state' | 'psu';
type FilterType = 'all' | JobType;


interface CardData {
  id: string;
  url: string;
  imgSrc: string;
  imgAlt: string;
  isLive?: boolean;
  jobType?: JobType;
}


// ─── Section Data ─────────────────────────────────────────────
const ITI_CARDS: CardData[] = [
  { id: 'iti-1', url: 'https://admission-tetsd.wb.gov.in/', imgSrc: img('assets-rh/common_foq6po'), imgAlt: 'ITI admission' },
  { id: 'iti-2', url: 'https://www.skillindiadigital.gov.in/home', imgSrc: img('assets-rh/skillindia_ubhpv1'), imgAlt: 'Skill India' },
  { id: 'iti-3', url: 'https://webscte.co.in/', imgSrc: img('assets-rh/diploma_hgwjew'), imgAlt: 'WEBSCTE' },
  { id: 'iti-4', url: 'https://minemountain.in/website/mining_e_library/', imgSrc: img('assets-rh/mining_ufhv7s'), imgAlt: 'Mining books' },
];


const UGPG_CARDS: CardData[] = [
  { id: 'ugpg-1', url: 'https://makaut1.ucanapply.com/smartexam/public/student', imgSrc: img('assets-rh/makaut_pnoufn'), imgAlt: 'MAKAUT-UG' },
  { id: 'ugpg-2', url: 'https://svmcm.wb.gov.in/', imgSrc: img('assets-rh/svmcm_wguoxv'), imgAlt: 'SVMCM' },
  { id: 'ugpg-3', url: 'https://www.nism.ac.in/', imgSrc: img('assets-rh/nism_okw994'), imgAlt: 'NISM' },
  { id: 'ugpg-4', url: 'https://admissionju.jadavpuruniversity.in/fengadmission/', imgSrc: img('assets-rh/ju_r2vgcv'), imgAlt: 'Jadavpur University' },
  { id: 'ugpg-5', url: 'https://makautwb.ac.in/', imgSrc: img('production-images/makaut_pg_upvyyk'), imgAlt: 'MAKAUT-PG' },
];


const GOVT_CARDS: CardData[] = [
  { id: 'govt-1', url: 'https://uidai.gov.in/', imgSrc: img('assets-rh/uidai_xwbq1i'), imgAlt: 'UIDAI' },
  { id: 'govt-2', url: 'https://voters.eci.gov.in/', imgSrc: img('assets-rh/voters_zvsfda'), imgAlt: 'Voter Registration' },
  { id: 'govt-3', url: 'https://unifiedportal-mem.epfindia.gov.in/', imgSrc: img('assets-rh/unifiedportal_rmfgqt'), imgAlt: 'Unified Portal' },
  { id: 'govt-4', url: 'https://passbook.epfindia.gov.in/MemberPassBook/login', imgSrc: img('assets-rh/PFpassbook_gjxnhk'), imgAlt: 'PFpassbook' },
  { id: 'govt-5', url: 'https://portal.esic.gov.in/EmployeePortal/login.aspx', imgSrc: img('assets-rh/esic_jd3ynx'), imgAlt: 'ESIC' },
  { id: 'govt-6', url: 'https://food.wb.gov.in/', imgSrc: img('production-images/wb-ration-services_w56oi1'), imgAlt: 'WB Ration Services' },
  { id: 'govt-7', url: 'https://socialsecurity.wb.gov.in/login', imgSrc: img('production-images/annapurna-portal_jtvfxa'), imgAlt: 'Annapurna Portal' },
  { id: 'govt-8', url: 'https://wb.gov.in/', imgSrc: img('production-images/wbgov_ncoxlb'), imgAlt: 'West Bengal Government' },
];


const AI_CARDS: CardData[] = [
  { id: 'ai-1',  url: 'https://app.flowcv.com/resumes',          imgSrc: img('assets-rh/resume_hw2yh7'),          imgAlt: 'resume' },
  { id: 'ai-2',  url: 'https://playground.com/',                  imgSrc: img('assets-rh/playground_zco9cz'),      imgAlt: 'Playground' },
  { id: 'ai-3',  url: 'https://icons8.com/',                      imgSrc: img('assets-rh/icons8_sxvnp8'),          imgAlt: 'icons8' },
  { id: 'ai-4',  url: 'https://www.widecanvas.ai/',               imgSrc: img('assets-rh/wide_mggcdb'),       imgAlt: 'WideCanvas' },
  { id: 'ai-5',  url: 'https://squoosh.app/',                     imgSrc: img('assets-rh/squoosh_dwhzif'),         imgAlt: 'squoosh' },
  { id: 'ai-6', url: 'https://imresizer.com/',                     imgSrc: img('production-images/imresizer_dx4cs9'),      imgAlt: 'Imresizer' },
  { id: 'ai-7',  url: 'https://animegenius.live3d.io/',           imgSrc: img('assets-rh/anime_eevsei'),           imgAlt: 'Anime Maker' },
  { id: 'ai-8',  url: 'https://www.oxaam.com/',                   imgSrc: img('assets-rh/oxii_pizjy7'),            imgAlt: 'ox' },
  { id: 'ai-9',  url: 'https://lottiefiles.com/',                 imgSrc: img('assets-rh/lottie_onkqtq'),          imgAlt: 'lottie' },
  { id: 'ai-10',  url: 'https://reactbits.dev/',                   imgSrc: img('assets-rh/reactbits_k3mckb'),       imgAlt: 'reactbits' },
  { id: 'ai-11', url: 'https://gradienty.codes/',                 imgSrc: img('assets-rh/gradienty_lrfznd'),       imgAlt: 'gradienty' },
  { id: 'ai-12', url: 'https://spline.design/',                   imgSrc: img('assets-rh/spline_kcutlx'),          imgAlt: 'spline' },
  { id: 'ai-13', url: 'https://www.cloudflare.com/en-in/',        imgSrc: img('assets-rh/cloudflare_bnfm30'),      imgAlt: 'Cloudflare' },
  { id: 'ai-14', url: 'https://console.cloud.google.com/',        imgSrc: img('assets-rh/google-console_rjtqct'), imgAlt: 'console.cloud.google' },
  { id: 'ai-15', url: 'https://skillshop.withgoogle.com/',        imgSrc: img('assets-rh/google-skillshop_oqqxw1'), imgAlt: 'skillshop.withgoogle' },
];


const INVEST_CARDS: CardData[] = [
  { id: 'inv-1', url: 'https://zerodha.com/brokerage-calculator/',              imgSrc: img('assets-rh/zerodha_xqjzvf'),       imgAlt: 'deductions' },
  { id: 'inv-2', url: 'https://klasterme.in/upcoming-dividends',                imgSrc: img('assets-rh/dividendstock_wwfkh3'), imgAlt: 'dividends', isLive: true },
  { id: 'inv-3', url: 'https://zerodha.com/ipo/',                               imgSrc: img('assets-rh/ipo_whvx3z'),           imgAlt: 'ipos',      isLive: true },
  { id: 'inv-4', url: 'https://www.investorgain.com/report/live-ipo-gmp/331/',  imgSrc: img('assets-rh/gmp_p3eyet'),           imgAlt: 'gmp',       isLive: true },
  { id: 'inv-5', url: 'https://www.nseindia.com/',                              imgSrc: img('assets-rh/nse_wpjy53'),           imgAlt: 'nse',       isLive: true },
  { id: 'inv-6', url: 'https://tradingeconomics.com/united-states/stock-market',imgSrc: img('assets-rh/nasdaq_rin9vo'),        imgAlt: 'nasdaq',    isLive: true },
];


const JOB_CARDS: CardData[] = [
  { id: 'job-1', url: 'https://rrbrecruitmentstaging.net/#/auth/landing',   imgSrc: img('assets-rh/rrb_nv0pt4'),          imgAlt: 'RRB',                        jobType: 'central' },
  { id: 'job-2', url: 'https://drdo.gov.in/drdo/',                          imgSrc: img('assets-rh/DRDO_tny47z'),         imgAlt: 'DRDO',                       jobType: 'central' },
  { id: 'job-3', url: 'https://wbpsc.gov.in',                               imgSrc: img('assets-rh/wbpsc_jx06od.png'),    imgAlt: 'WBPSC',                      jobType: 'state'   },
  { id: 'job-4', url: 'https://www.grse.in/career/',                        imgSrc: img('assets-rh/grse-logo_cw8xcg'),    imgAlt: 'GRSE',                       jobType: 'psu'     },
  { id: 'job-5', url: 'https://careers.bhel.in/index.jsp',                  imgSrc: img('assets-rh/bhel_iv3bdc'),         imgAlt: 'BHEL',                       jobType: 'psu'     },
  { id: 'job-6', url: 'https://iocl.com/latest-job-opening',                imgSrc: img('assets-rh/iocllogo_qpttuz'),     imgAlt: 'IOCL',                       jobType: 'psu'     },
  { id: 'job-7', url: 'https://madrasfert.co.in/resources/recruitment/',    imgSrc: img('assets-rh/madras-fert_nnks9s'),  imgAlt: 'Madras-Fertilizers-Limited', jobType: 'psu'     },
  { id: 'job-8', url: 'https://sbi.bank.in/web/careers',                    imgSrc: img('production-images/sbi_careers_uxcxi2'),                  imgAlt: 'SBI Careers',       jobType: 'psu'     },
  { id: 'job-9', url: 'https://cdn.digialm.com/EForms/configuredHtml/1258/97495/Index.html', imgSrc: img('production-images/coalindia_reerav'),   imgAlt: 'Coal India',        jobType: 'psu'     },
  { id: 'job-10', url: 'https://careers.meconlimited.co.in/',               imgSrc: img('production-images/mecon_lbpwxq'),                        imgAlt: 'MECON',             jobType: 'psu'     },
  { id: 'job-11', url: 'https://www.nbccindia.in/webEnglish/jobs',          imgSrc: img('production-images/nbcc_w1ul1g'),                         imgAlt: 'NBCC',              jobType: 'psu'     },
  { id: 'job-12', url: 'https://www.ecil.co.in/jobopenings',                imgSrc: img('production-images/ecil_u56e4u'),                         imgAlt: 'ECIL',              jobType: 'psu'     },
  { id: 'job-13', url: 'https://mudira.nalcoindia.co.in/rec_portal/default.aspx',            imgSrc: img('production-images/nalco_nqcifw'),       imgAlt: 'Nalco',             jobType: 'psu'     },
  { id: 'job-14', url: 'https://www.joinindiannavy.gov.in/en/account/account/state',         imgSrc: img('production-images/indian-navy_jffv8f'), imgAlt: 'Indian Navy',       jobType: 'central' },
  { id: 'job-15', url: 'https://www.cdac.in/index.aspx?id=current_jobs',                     imgSrc: img('production-images/cdac_t3owh1'),        imgAlt: 'CDAC',              jobType: 'psu'     },
  { id: 'job-16', url: 'https://csc.gov.in/careers',                        imgSrc: img('production-images/csc_ncnfb1'),                          imgAlt: 'CSC',               jobType: 'central' },
  { id: 'job-17', url: 'https://www.meity.gov.in/offerings/vacancies?page=1',                imgSrc: img('production-images/meity_u8srdj'),       imgAlt: 'MEITY',             jobType: 'central' },
];


// ─── SEO ──────────────────────────────────────────────────────
// ─── SEO helpers ─────────────────────────────────────────────
// Idempotent: sets a <meta> by name/property, reusing an existing
// element so Helmet/React-Helmet is NOT required.
function setMeta(attr: 'name' | 'property', value: string, content: string): void {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${value}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, value);
    document.head.appendChild(el);
  }
  el.content = content;
}

function setLink(rel: string, href: string): void {
  let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }
  el.href = href;
}

function injectJsonLd(id: string, data: object): void {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

// ─── SEO configuration ───────────────────────────────────────
const SEO_TITLE =
  'XpressJob — Govt Job Updates 2026 | Central, State & PSU Jobs India | ITI, UG/PG Admissions';

const SEO_DESCRIPTION =
  'Find the latest government job vacancies 2026 — RRB, DRDO, WBPSC, BHEL, IOCL & more. Central, State & PSU recruitment, ITI/Diploma admissions, UG/PG college portals, investment tools, and productivity platforms — all in one place.';

// Primary + long-tail + LSI keyword bank targeting high-traffic Indian job searches
const SEO_KEYWORDS = [
  // ── Highest-volume govt job keywords ──────────────────────
  'government job 2026',
  'sarkari naukri 2026',
  'govt job vacancy India',
  'latest government jobs',
  'central government jobs',
  'state government jobs',
  'PSU jobs 2026',
  'public sector jobs India',
  'sarkari result 2026',
  // ── Specific org / portal keywords ────────────────────────
  'RRB recruitment 2026',
  'DRDO recruitment 2026',
  'WBPSC jobs West Bengal',
  'BHEL recruitment 2026',
  'IOCL recruitment 2026',
  'GRSE recruitment 2026',
  'Madras Fertilizers recruitment',
  // ── Education / admission keywords ────────────────────────
  'ITI admission 2026',
  'diploma admission West Bengal',
  'MAKAUT admission 2026',
  'Jadavpur University admission',
  'SVMCM scholarship',
  'Skill India digital',
  'NISM certification',
  // ── Job type + fresher keywords ───────────────────────────
  'fresher government job 2026',
  'engineering jobs India 2026',
  'railway jobs 2026',
  'defence jobs India',
  'bank jobs 2026',
  'SSC jobs 2026',
  'UPSC 2026',
  'police jobs India',
  'teacher recruitment 2026',
  'jobs for 10th pass 2026',
  'jobs for 12th pass 2026',
  'ITI pass government job',
  'diploma holder government job',
  // ── Investing / finance keywords ───────────────────────────
  'upcoming IPO 2026 India',
  'IPO GMP today',
  'NSE stock market India',
  'stock market live India',
  'zerodha brokerage calculator',
  'upcoming dividends India',
  // ── Productivity / tools keywords ─────────────────────────
  'free resume builder India',
  'online productivity tools 2026',
  'AI tools for students India',
  // ── Geo-targeted keywords ──────────────────────────────────
  'government jobs West Bengal',
  'sarkari naukri Kolkata',
  'WB govt job 2026',
  'Bengal PSC recruitment',
  // ── Intent / action keywords ───────────────────────────────
  'apply government job online 2026',
  'latest job notification India',
  'job alert 2026',
  'government job portal India',
  'online job portal India',
].join(', ');

// Schema.org WebSite + SearchAction (enables Google Sitelinks Search Box)
const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'XpressJob by Openroot Systems',
  url: 'https://openroot.in/xpressjob',
  description: SEO_DESCRIPTION,
  inLanguage: ['en-IN', 'en'],
  publisher: {
    '@type': 'Organization',
    name: 'Openroot Systems',
    url: 'https://openroot.in',
    logo: {
      '@type': 'ImageObject',
      url: 'https://openroot.in/assets/openroot-white-nobg.png',
    },
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://openroot.in/xpressjob?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

// Schema.org ItemList — signals structured job/resource categories to Google
const ITEMLIST_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Government Job Portals & Resources India 2026',
  description:
    'Curated list of official recruitment portals for Central, State, and PSU government jobs in India, plus admission portals, investment tools, and productivity platforms.',
  numberOfItems: JOB_CARDS.length,
  itemListElement: JOB_CARDS.map((card, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: card.imgAlt,
    url: card.url,
  })),
};

// Schema.org BreadcrumbList — helps Google understand page hierarchy
const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home',       item: 'https://openroot.in' },
    { '@type': 'ListItem', position: 2, name: 'XpressJob',  item: 'https://openroot.in/xpressjob' },
  ],
};

// ─── Storage helpers ──────────────────────────────────────────
function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const s = window[type];
    const k = '__xj_test__';
    s.setItem(k, '1');
    s.removeItem(k);
    return true;
  } catch { return false; }
}


const HAS_LOCAL   = isStorageAvailable('localStorage');
const HAS_SESSION = isStorageAvailable('sessionStorage');


function safeGet(key: string): string | null {
  try {
    if (HAS_LOCAL)   return localStorage.getItem(key);
    if (HAS_SESSION) return sessionStorage.getItem(key);
  } catch {}
  return null;
}


function safeSet(key: string, value: string): void {
  try {
    if (HAS_LOCAL)   { localStorage.setItem(key, value); return; }
    if (HAS_SESSION)   sessionStorage.setItem(key, value);
  } catch {}
}


// ─── UID helpers ──────────────────────────────────────────────
function resolveUID(): string {
  try {
    const p       = new URLSearchParams(window.location.search);
    const fromUrl = p.get('uid') ?? p.get('user');
    const fromMain= safeGet('openrootUserUID');
    const cached  = safeGet('xpressjob_current_uid');
    const uid     = fromUrl ? decodeURIComponent(fromUrl) : (fromMain ?? cached ?? 'guest_user');
    if (uid !== cached) safeSet('xpressjob_current_uid', uid);
    return uid;
  } catch { return 'guest_user'; }
}


function storageKey(uid: string): string { return `xj_starredCards_${uid}`; }


function loadStarred(uid: string): Record<string, string[]> {
  try {
    const raw = safeGet(storageKey(uid));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const valid: Record<string, string[]> = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (Array.isArray(v) && v.every(x => typeof x === 'string')) valid[k] = v;
    }
    return valid;
  } catch { return {}; }
}


// ─── Card ─────────────────────────────────────────────────────
interface CardProps {
  card: CardData;
  isStarred: boolean;
  hidden?: boolean;
  onStarClick: (id: string) => void;
  onCardClick: (url: string) => void;
}


const Card: React.FC<CardProps> = React.memo(({ card, isStarred, hidden, onStarClick, onCardClick }) => {
  const handleStar = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onStarClick(card.id);
  }, [card.id, onStarClick]);


  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCardClick(card.url); }
  }, [card.url, onCardClick]);


  const isJobCard = Boolean(card.jobType);


  const starBtn = (
    <button
      className={`xj-star-btn${isStarred ? ' xj-starred' : ''}`}
      aria-pressed={isStarred}
      aria-label={isStarred ? 'Unstar card' : 'Star card'}
      onClick={handleStar}
    >
      {isStarred ? '★' : '☆'}
    </button>
  );


  return (
    <article
      className={`xj-card${isJobCard ? ' xj-job-card' : ''}${hidden ? ' xj-hidden' : ''}`}
      data-url={card.url}
      data-type={card.jobType}
      role="button"
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden ? true : undefined}
      onClick={() => !hidden && onCardClick(card.url)}
      onKeyDown={handleKeyDown}
    >
      {isJobCard ? (
        <div className="xj-img-wrapper">
          {starBtn}
          <img src={card.imgSrc} alt={card.imgAlt} loading="lazy" decoding="async" />
        </div>
      ) : (
        <>
          {starBtn}
          {card.isLive && <p className="xj-live" aria-label="Live data">LIVE</p>}
          <div className="xj-img-wrapper">
            <img src={card.imgSrc} alt={card.imgAlt} loading="lazy" decoding="async" />
          </div>
        </>
      )}
    </article>
  );
});
Card.displayName = 'Card';


// ─── CardGrid ─────────────────────────────────────────────────
interface CardGridProps {
  segId: string;
  cards: CardData[];
  starredIds: Set<string>;
  jobFilter?: FilterType;
  onStarClick: (segId: string, cardId: string) => void;
}


const CardGrid: React.FC<CardGridProps> = React.memo(({ segId, cards, starredIds, jobFilter, onStarClick }) => {
  const handleStar = useCallback((id: string) => onStarClick(segId, id), [segId, onStarClick]);


  const handleCardClick = useCallback((url: string) => {
    if (!url) return;
    try {
      const { protocol } = new URL(url);
      if (protocol === 'http:' || protocol === 'https:') {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch { console.warn('[XpressJob] Blocked invalid URL:', url); }
  }, []);


  const sorted = useMemo(() => {
    const starred   = cards.filter(c =>  starredIds.has(c.id));
    const unstarred = cards.filter(c => !starredIds.has(c.id));
    return [...starred, ...unstarred];
  }, [cards, starredIds]);


  return (
    <div className="xj-card-grid" data-segment={segId}>
      {sorted.map(card => {
        const hidden = jobFilter !== undefined && jobFilter !== 'all' && card.jobType !== jobFilter;
        return (
          <Card
            key={card.id}
            card={card}
            isStarred={starredIds.has(card.id)}
            hidden={hidden}
            onStarClick={handleStar}
            onCardClick={handleCardClick}
          />
        );
      })}
    </div>
  );
});
CardGrid.displayName = 'CardGrid';


// ─── Toast ────────────────────────────────────────────────────
const Toast: React.FC<{ message: string }> = React.memo(({ message }) => (
  <div className="xj-toast" role="alert" aria-live="assertive" aria-atomic="true">
    {message}
  </div>
));
Toast.displayName = 'Toast';


// ─── Main ─────────────────────────────────────────────────────
const XpressJob: React.FC = () => {
  const userUID = useRef(resolveUID()).current;


  const [starredData, setStarredData] = useState<Record<string, string[]>>(() => loadStarred(userUID));
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [jobFilter,   setJobFilter]   = useState<FilterType>('all');
  const [toast,       setToast]       = useState<string | null>(null);


  const menuBtnRef      = useRef<HTMLButtonElement>(null);
  const menuDropdownRef = useRef<HTMLUListElement>(null);
  const saveTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);


  // ── SEO injection (runs once on mount) ──────────────────────
  useEffect(() => {
    // ── <title> ─────────────────────────────────────────────
    document.title = SEO_TITLE;

    // ── Standard meta ───────────────────────────────────────
    setMeta('name', 'description',        SEO_DESCRIPTION);
    setMeta('name', 'keywords',           SEO_KEYWORDS);
    setMeta('name', 'robots',             'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMeta('name', 'author',             'Openroot Systems');
    setMeta('name', 'theme-color',        '#0b0040');
    setMeta('name', 'application-name',   'XpressJob');

    // ── Open Graph (Facebook / WhatsApp / LinkedIn previews) ─
    setMeta('property', 'og:type',        'website');
    setMeta('property', 'og:site_name',   'XpressJob — Openroot Systems');
    setMeta('property', 'og:title',       SEO_TITLE);
    setMeta('property', 'og:description', SEO_DESCRIPTION);
    setMeta('property', 'og:url',         'https://openroot.in/xpressjob');
    setMeta('property', 'og:image',       'https://openroot.in/assets/xpressjob-og.png');
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height','630');
    setMeta('property', 'og:locale',      'en_IN');

    // ── Twitter Card ─────────────────────────────────────────
    setMeta('name', 'twitter:card',        'summary_large_image');
    setMeta('name', 'twitter:title',       SEO_TITLE);
    setMeta('name', 'twitter:description', SEO_DESCRIPTION);
    setMeta('name', 'twitter:image',       'https://openroot.in/assets/xpressjob-og.png');
    setMeta('name', 'twitter:site',        '@OpenrootSystems');

    // ── Geo meta (India targeting) ───────────────────────────
    setMeta('name', 'geo.region',          'IN-WB');
    setMeta('name', 'geo.placename',       'Kolkata, West Bengal, India');
    setMeta('name', 'geo.position',        '22.5726;88.3639');
    setMeta('name', 'ICBM',               '22.5726, 88.3639');

    // ── Canonical ────────────────────────────────────────────
    setLink('canonical', 'https://openroot.in/xpressjob');

    // ── JSON-LD structured data ───────────────────────────────
    injectJsonLd('xj-schema-website',    WEBSITE_SCHEMA);
    injectJsonLd('xj-schema-itemlist',   ITEMLIST_SCHEMA);
    injectJsonLd('xj-schema-breadcrumb', BREADCRUMB_SCHEMA);
  }, []);


  // ── Starred sets ────────────────────────────────────────────
  const starredSets = useMemo<Record<string, Set<string>>>(() => {
    const map: Record<string, Set<string>> = {};
    for (const [k, ids] of Object.entries(starredData)) map[k] = new Set(ids);
    return map;
  }, [starredData]);


  const getSet = useCallback(
    (segId: string): Set<string> => starredSets[segId] ?? new Set<string>(),
    [starredSets],
  );


  // ── Save (debounced, ref-scoped — no module-level timer) ────
  const persistStarred = useCallback((data: Record<string, string[]>) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try { safeSet(storageKey(userUID), JSON.stringify(data)); }
      catch (e) { console.warn('[XpressJob] Failed to persist starred cards:', e); }
    }, SAVE_DEBOUNCE_MS);
  }, [userUID]);


  // ── Toast ───────────────────────────────────────────────────
  const showToast = useCallback((msg: string, ms = 2800) => {
    setToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), ms);
  }, []);


  // ── Star toggle ─────────────────────────────────────────────
  const handleStarClick = useCallback((segId: string, cardId: string) => {
    setStarredData(prev => {
      const current = new Set(prev[segId] ?? []);
      if (current.has(cardId)) {
        current.delete(cardId);
      } else {
        if (current.size >= MAX_STARS) {
          const oldest = current.values().next().value as string | undefined;
          if (oldest === undefined) return prev;
          current.delete(oldest);
          showToast(`Max ${MAX_STARS} stars per section — oldest removed.`);
        }
        current.add(cardId);
      }
      const updated = { ...prev, [segId]: Array.from(current) };
      persistStarred(updated);
      return updated;
    });
  }, [persistStarred, showToast]);


  // ── Cross-tab UID sync ──────────────────────────────────────
  useEffect(() => {
    if (!HAS_LOCAL) return;
    const handler = (ev: StorageEvent) => {
      if (ev.key !== 'openrootUserUID' && ev.key !== 'xpressjob_current_uid') return;
      if (!ev.newValue || ev.newValue === userUID) return;
      safeSet('xpressjob_current_uid', ev.newValue);
      setTimeout(() => window.location.reload(), 80);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [userUID]);


  // ── Auto-close menu when viewport hits desktop breakpoint ───
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const handler = (e: MediaQueryListEvent) => { if (e.matches) setMenuOpen(false); };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);


  // ── Outside click (pointerdown — no setTimeout hack needed) ─
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuDropdownRef.current?.contains(target)) return;
      if (menuBtnRef.current?.contains(target))      return;
      setMenuOpen(false);
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, [menuOpen]);


  // ── Escape key ──────────────────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      menuBtnRef.current?.focus();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [menuOpen]);


  // ── GSAP magnetic hover (pointer devices only) ──────────────
  useEffect(() => {
    const btn = menuBtnRef.current;
    if (!btn) return;
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;


    const onMove = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - r.left - r.width  / 2) / 10,
        y: (e.clientY - r.top  - r.height / 2) / 10,
        duration: 0.1,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    };
    const onLeave = () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1,0.5)', overwrite: 'auto' });
    };


    btn.addEventListener('mousemove',  onMove);
    btn.addEventListener('mouseleave', onLeave);
    return () => {
      btn.removeEventListener('mousemove',  onMove);
      btn.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf(btn);
      gsap.set(btn, { clearProps: 'x,y' });
    };
  }, []);


  // ── Cleanup on unmount ──────────────────────────────────────
  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (saveTimerRef.current)  clearTimeout(saveTimerRef.current);
  }, []);


  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="xpressjob">
      {toast && <Toast message={toast} />}


      <div className="xj-tech-orb" aria-hidden="true" />
      <div className="xj-tech-orb" aria-hidden="true" />
      <div className="xj-tech-orb" aria-hidden="true" />


      <header className="xj-site-header" role="banner">
        <div className="xj-logo-wrapper">
          <img
            src="/assets/openroot-white-nobg.png"
            alt="Openroot XpressJob"
            className="xj-site-logo"
            loading="lazy"
            decoding="async"
            width={120}
            height={40}
          />
          <span className="xj-logo-text">#XpressJob</span>
        </div>


        <nav className="xj-navbar" role="navigation" aria-label="Main Navigation">
          {/* Desktop — always visible ≥900px via CSS */}
          <div className="xj-nav-links">
            <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
            <a href="#iti-section">ITI/Diploma</a>
            <a href="#ugpg-section">UG/PG</a>
            <a href="#govt-websites-section">Govt Sites</a>
            <a href="#ai-section">PB Sites</a>
            <a href="#invest-section">Invest</a>
            <a href="#jobs-section">Jobs</a>
          </div>


          {/* Hamburger — lines animated purely by CSS via .xj-open class */}
          <button
            ref={menuBtnRef}
            className={`xj-menu-toggle${menuOpen ? ' xj-open' : ''}`}
            style={{ isolation: 'isolate', willChange: 'transform' }}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-controls="xjMenuDropdown"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <span className="xj-menu-line" />
            <span className="xj-menu-line" />
            <span className="xj-menu-line" />
          </button>


          {/* Dropdown — visibility+opacity (never display:none fights .xj-open) */}
          <ul
            id="xjMenuDropdown"
            ref={menuDropdownRef}
            className={`xj-menu-dropdown${menuOpen ? ' xj-open' : ''}`}
            role="menu"
            aria-hidden={menuOpen ? undefined : true}
            inert={!menuOpen || undefined}
          >
            {[
              { label: 'Home',       href: '#',                    isHome: true },
              { label: 'ITI/Diploma',href: '#iti-section' },
              { label: 'UG/PG',      href: '#ugpg-section' },
              { label: 'Govt Sites', href: '#govt-websites-section' },
              { label: 'PB Sites',   href: '#ai-section' },
              { label: 'Invest',     href: '#invest-section' },
              { label: 'Jobs',       href: '#jobs-section' },
            ].map(({ label, href, isHome }) => (
              <li key={label} role="none">
                <a
                  role="menuitem"
                  href={href}
                  onClick={e => {
                    if (isHome) e.preventDefault();
                    setMenuOpen(false);
                    if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>


      <main className="xj-container" role="main">
        {/*
          Hidden SEO content block — visible to crawlers, invisible to users.
          Provides keyword-rich semantic HTML that feeds into search indexing
          without cluttering the UI. Uses sr-only pattern (position:absolute,
          clip, 1px) so screen readers also benefit from the context.
        */}
        <div
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            whiteSpace: 'nowrap',
          }}
          aria-hidden="true"
        >
          <h1>XpressJob — Government Jobs India 2026 | Sarkari Naukri | ITI, UG/PG, PSU Recruitment</h1>
          <p>
            Find the latest government job vacancies in India 2026. Browse Central Government jobs,
            State Government jobs, PSU recruitment notifications, RRB railway jobs, DRDO defence jobs,
            WBPSC West Bengal jobs, BHEL PSU jobs, IOCL oil sector jobs, and GRSE shipyard recruitment.
            Also access ITI admission portals, Diploma college admissions, MAKAUT UG/PG admissions,
            Jadavpur University admissions, SVMCM scholarship portal, Skill India Digital, NISM certification,
            NSE stock market live data, upcoming IPO listings, IPO GMP today, Zerodha brokerage calculator,
            free online resume builder, and top AI productivity tools for students and job seekers in India.
          </p>
          <p>
            Sarkari naukri 2026 | government job portal India | latest job notification | job alert 2026 |
            central govt jobs | state govt jobs | PSU jobs India | fresher government job | engineering jobs
            India | railway recruitment | defence recruitment | sarkari result 2026 | apply govt job online
          </p>
        </div>

        <section className="xj-section-container" id="iti-section" aria-labelledby="iti-title">
          <h2 className="xj-section-title" id="iti-title">ITI / DIPLOMA</h2>
          <CardGrid segId="iti" cards={ITI_CARDS} starredIds={getSet('iti')} onStarClick={handleStarClick} />
        </section>


        <section className="xj-section-container" id="ugpg-section" aria-labelledby="ugpg-title">
          <h2 className="xj-section-title" id="ugpg-title">UG / PG</h2>
          <CardGrid segId="ugpg" cards={UGPG_CARDS} starredIds={getSet('ugpg')} onStarClick={handleStarClick} />
        </section>


        <section className="xj-section-container" id="govt-websites-section" aria-labelledby="govt-title">
          <h2 className="xj-section-title" id="govt-title">GOVT WEBSITES</h2>
          <CardGrid segId="govt" cards={GOVT_CARDS} starredIds={getSet('govt')} onStarClick={handleStarClick} />
        </section>


        <section className="xj-section-container" id="ai-section" aria-labelledby="ai-title">
          <h2 className="xj-section-title" id="ai-title">PRODUCTIVITY BOOSTER PLATFORMS</h2>
          <CardGrid segId="ai" cards={AI_CARDS} starredIds={getSet('ai')} onStarClick={handleStarClick} />
        </section>


        <section className="xj-section-container" id="invest-section" aria-labelledby="invest-title">
          <h2 className="xj-section-title" id="invest-title">INVESTING RELATED WEBSITES</h2>
          <CardGrid segId="invest" cards={INVEST_CARDS} starredIds={getSet('invest')} onStarClick={handleStarClick} />
        </section>


        <section className="xj-section-container" id="jobs-section" aria-labelledby="jobs-title">
          <h2 className="xj-section-title" id="jobs-title">GOVT. JOB UPDATES</h2>
          <div className="xj-job-filters" role="toolbar" aria-label="Filter Jobs">
            {(['all', 'central', 'state', 'psu'] as FilterType[]).map(f => (
              <button
                key={f}
                className={`xj-filter-btn${jobFilter === f ? ' xj-active' : ''}`}
                data-filter={f}
                aria-pressed={jobFilter === f}
                onClick={() => setJobFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <CardGrid segId="jobs" cards={JOB_CARDS} starredIds={getSet('jobs')} jobFilter={jobFilter} onStarClick={handleStarClick} />
        </section>
      </main>


      <footer className="xj-site-footer" role="contentinfo">
        <div className="xj-footer-bottom">
          <p>&copy; 2026 Openroot Systems. All rights reserved.</p>
          <p>Made with ❤️ for students and job seekers.</p>
        </div>
        <div className="xj-version-label" aria-hidden="true">Version 2026.2</div>
      </footer>
    </div>
  );
};


export default XpressJob;