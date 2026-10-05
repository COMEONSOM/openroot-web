// ============================================================
// OPENROOT NewsLetter — NewsLetter.tsx
// VERSION: 3.0.0 — redesigned to match the About / modal system.
// Logic is unchanged: SEO injection, starred cards (per user, per
// section), job filters, toast, cross-tab UID sync, mobile menu.
// Changes: cards are now real links (crawlable, keyboard friendly),
// the logo and the GSAP magnetic hover are gone.
// ============================================================

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import '../components/styles/NewsLetter.css';

// ─── Constants ───────────────────────────────────────────────
const MAX_STARS = 5;
const SAVE_DEBOUNCE_MS = 300;
const DESKTOP_BREAKPOINT = 900; // px — must match CSS

const IMG_CLOUD = 'https://res.cloudinary.com/dydh05l1u/image/upload';
const img = (publicId: string) => `${IMG_CLOUD}/q_auto,f_auto/${publicId}`;

// ─── Types ───────────────────────────────────────────────────
type JobType = 'central' | 'state' | 'psu';
type FilterType = 'all' | JobType;
type Accent = 'white' | 'blue' | 'cyan' | 'green' | 'purple' | 'gold' | 'pink';

interface CardData {
  id: string;
  url: string;
  imgSrc: string;
  imgAlt: string;
  isLive?: boolean;
  jobType?: JobType;
}

// ─── Navigation (shared by desktop bar and mobile menu) ──────
const NAV_ITEMS: Array<{ label: string; href: string; accent: Accent; isHome?: boolean }> = [
  { label: 'Home', href: '#', accent: 'white', isHome: true },
  { label: 'Jobs', href: '#jobs-section', accent: 'pink' },
  { label: 'Govt Sites', href: '#govt-websites-section', accent: 'green' },
  { label: 'UG/PG', href: '#ugpg-section', accent: 'cyan' },
  { label: 'ITI/Diploma', href: '#iti-section', accent: 'blue' },
  { label: 'Invest', href: '#invest-section', accent: 'gold' },
  { label: 'PB Sites', href: '#ai-section', accent: 'purple' },
];

// ─── Section Data ─────────────────────────────────────────────
const ITI_CARDS: CardData[] = [
  { id: 'iti-1', url: 'https://admission-tetsd.wb.gov.in/', imgSrc: img('assets-rh/common_foq6po'), imgAlt: 'ITI admission' },
  { id: 'iti-2', url: 'https://www.skillindiadigital.gov.in/home', imgSrc: img('assets-rh/skillindia_ubhpv1'), imgAlt: 'Skill India' },
  { id: 'iti-3', url: 'https://webscte.co.in/', imgSrc: img('assets-rh/diploma_hgwjew'), imgAlt: 'WEBSCTE' },
  { id: 'iti-4', url: 'https://minemountain.in/website/mining_e_library/', imgSrc: img('assets-rh/mining_ufhv7s'), imgAlt: 'Mining books' },
  { id: 'iti-5', url: 'https://bharatskills.gov.in/Home/CTS', imgSrc: img('production-images/cts_uwhhfl'), imgAlt: 'CTS' },
];

const UGPG_CARDS: CardData[] = [
  { id: 'ugpg-1', url: 'https://makaut1.ucanapply.com/smartexam/public/student', imgSrc: img('assets-rh/makaut_pnoufn'), imgAlt: 'MAKAUT-UG' },
  { id: 'ugpg-2', url: 'https://svmcm.wb.gov.in/', imgSrc: img('assets-rh/svmcm_wguoxv'), imgAlt: 'SVMCM' },
  { id: 'ugpg-3', url: 'https://www.nism.ac.in/', imgSrc: img('assets-rh/nism_okw994'), imgAlt: 'NISM' },
  { id: 'ugpg-4', url: 'https://admissionju.jadavpuruniversity.in/fengadmission/', imgSrc: img('assets-rh/ju_r2vgcv'), imgAlt: 'Jadavpur University' },
  { id: 'ugpg-5', url: 'https://makautwb.ac.in/', imgSrc: img('production-images/makaut_pg_upvyyk'), imgAlt: 'MAKAUT-PG' },
  { id: 'ugpg-6', url: 'https://www.caluniv.ac.in/admission/admission.html', imgSrc: img('production-images/cuadmission_prrddk'), imgAlt: 'CU' },
];

const GOVT_CARDS: CardData[] = [
  { id: 'govt-1', url: 'https://myaadhaarbeta.uidai.gov.in/', imgSrc: img('assets-rh/uidai_xwbq1i'), imgAlt: 'UIDAI' },
  { id: 'govt-2', url: 'https://voters.eci.gov.in/', imgSrc: img('assets-rh/voters_zvsfda'), imgAlt: 'Voter Registration' },
  { id: 'govt-3', url: 'https://unifiedportal-mem.epfindia.gov.in/', imgSrc: img('assets-rh/unifiedportal_rmfgqt'), imgAlt: 'Unified Portal' },
  { id: 'govt-4', url: 'https://passbook.epfindia.gov.in/MemberPassBook/login', imgSrc: img('assets-rh/PFpassbook_gjxnhk'), imgAlt: 'PFpassbook' },
  { id: 'govt-5', url: 'https://portal.esic.gov.in/EmployeePortal/login.aspx', imgSrc: img('assets-rh/esic_jd3ynx'), imgAlt: 'ESIC' },
  { id: 'govt-6', url: 'https://food.wb.gov.in/', imgSrc: img('production-images/wb-ration-services_w56oi1'), imgAlt: 'WB Ration Services' },
  { id: 'govt-7', url: 'https://socialregistry.wb.gov.in/', imgSrc: img('production-images/annapurna-portal_jtvfxa'), imgAlt: 'Annapurna Portal' },
  { id: 'govt-8', url: 'https://wb.gov.in/', imgSrc: img('production-images/wbgov_ncoxlb'), imgAlt: 'West Bengal Government' },
];

const AI_CARDS: CardData[] = [
  { id: 'ai-1', url: 'https://app.flowcv.com/resumes', imgSrc: img('assets-rh/resume_hw2yh7'), imgAlt: 'resume' },
  { id: 'ai-2', url: 'https://playground.com/', imgSrc: img('assets-rh/playground_zco9cz'), imgAlt: 'Playground' },
  { id: 'ai-3', url: 'https://icons8.com/', imgSrc: img('assets-rh/icons8_sxvnp8'), imgAlt: 'icons8' },
  { id: 'ai-4', url: 'https://www.widecanvas.ai/', imgSrc: img('assets-rh/wide_mggcdb'), imgAlt: 'WideCanvas' },
  { id: 'ai-5', url: 'https://squoosh.app/', imgSrc: img('assets-rh/squoosh_dwhzif'), imgAlt: 'squoosh' },
  { id: 'ai-6', url: 'https://imresizer.com/', imgSrc: img('production-images/imresizer_dx4cs9'), imgAlt: 'Imresizer' },
  { id: 'ai-7', url: 'https://animegenius.live3d.io/', imgSrc: img('assets-rh/anime_eevsei'), imgAlt: 'Anime Maker' },
  { id: 'ai-8', url: 'https://www.oxaam.com/', imgSrc: img('assets-rh/oxii_pizjy7'), imgAlt: 'ox' },
  { id: 'ai-9', url: 'https://lottiefiles.com/', imgSrc: img('assets-rh/lottie_onkqtq'), imgAlt: 'lottie' },
  { id: 'ai-10', url: 'https://reactbits.dev/', imgSrc: img('assets-rh/reactbits_k3mckb'), imgAlt: 'reactbits' },
  { id: 'ai-11', url: 'https://gradienty.codes/', imgSrc: img('assets-rh/gradienty_lrfznd'), imgAlt: 'gradienty' },
  { id: 'ai-12', url: 'https://spline.design/', imgSrc: img('assets-rh/spline_kcutlx'), imgAlt: 'spline' },
  { id: 'ai-13', url: 'https://www.cloudflare.com/en-in/', imgSrc: img('assets-rh/cloudflare_bnfm30'), imgAlt: 'Cloudflare' },
  { id: 'ai-14', url: 'https://console.cloud.google.com/', imgSrc: img('assets-rh/google-console_rjtqct'), imgAlt: 'console.cloud.google' },
  { id: 'ai-15', url: 'https://skillshop.withgoogle.com/', imgSrc: img('assets-rh/google-skillshop_oqqxw1'), imgAlt: 'skillshop.withgoogle' },
];

const INVEST_CARDS: CardData[] = [
  { id: 'inv-1', url: 'https://zerodha.com/brokerage-calculator/', imgSrc: img('assets-rh/zerodha_xqjzvf'), imgAlt: 'deductions' },
  { id: 'inv-2', url: 'https://klasterme.in/upcoming-dividends', imgSrc: img('assets-rh/dividendstock_wwfkh3'), imgAlt: 'dividends', isLive: true },
  { id: 'inv-3', url: 'https://zerodha.com/ipo/', imgSrc: img('assets-rh/ipo_whvx3z'), imgAlt: 'ipos', isLive: true },
  { id: 'inv-4', url: 'https://www.investorgain.com/report/live-ipo-gmp/331/', imgSrc: img('assets-rh/gmp_p3eyet'), imgAlt: 'gmp', isLive: true },
  { id: 'inv-5', url: 'https://www.nseindia.com/', imgSrc: img('assets-rh/nse_wpjy53'), imgAlt: 'nse', isLive: true },
  { id: 'inv-6', url: 'https://tradingeconomics.com/united-states/stock-market', imgSrc: img('assets-rh/nasdaq_rin9vo'), imgAlt: 'nasdaq', isLive: true },
];

const JOB_CARDS: CardData[] = [
  { id: 'job-1', url: 'https://rrbrecruitmentstaging.net/#/auth/landing', imgSrc: img('assets-rh/rrb_nv0pt4'), imgAlt: 'RRB', jobType: 'central' },
  { id: 'job-2', url: 'https://drdo.gov.in/drdo/', imgSrc: img('assets-rh/DRDO_tny47z'), imgAlt: 'DRDO', jobType: 'central' },
  { id: 'job-3', url: 'https://wbpsc.gov.in', imgSrc: img('assets-rh/wbpsc_jx06od.png'), imgAlt: 'WBPSC', jobType: 'state' },
  { id: 'job-4', url: 'https://www.grse.in/career/', imgSrc: img('assets-rh/grse-logo_cw8xcg'), imgAlt: 'GRSE', jobType: 'psu' },
  { id: 'job-5', url: 'https://careers.bhel.in/index.jsp', imgSrc: img('assets-rh/bhel_iv3bdc'), imgAlt: 'BHEL', jobType: 'psu' },
  { id: 'job-6', url: 'https://iocl.com/latest-job-opening', imgSrc: img('assets-rh/iocllogo_qpttuz'), imgAlt: 'IOCL', jobType: 'psu' },
  { id: 'job-7', url: 'https://madrasfert.co.in/resources/recruitment/', imgSrc: img('assets-rh/madras-fert_nnks9s'), imgAlt: 'Madras-Fertilizers-Limited', jobType: 'psu' },
  { id: 'job-8', url: 'https://sbi.bank.in/web/careers', imgSrc: img('production-images/sbi_careers_uxcxi2'), imgAlt: 'SBI Careers', jobType: 'psu' },
  { id: 'job-9', url: 'https://cdn.digialm.com/EForms/configuredHtml/1258/97495/Index.html', imgSrc: img('production-images/coalindia_reerav'), imgAlt: 'Coal India', jobType: 'psu' },
  { id: 'job-10', url: 'https://careers.meconlimited.co.in/', imgSrc: img('production-images/mecon_lbpwxq'), imgAlt: 'MECON', jobType: 'psu' },
  { id: 'job-11', url: 'https://www.nbccindia.in/webEnglish/jobs', imgSrc: img('production-images/nbcc_w1ul1g'), imgAlt: 'NBCC', jobType: 'psu' },
  { id: 'job-12', url: 'https://www.ecil.co.in/jobopenings', imgSrc: img('production-images/ecil_u56e4u'), imgAlt: 'ECIL', jobType: 'psu' },
  { id: 'job-13', url: 'https://mudira.nalcoindia.co.in/rec_portal/default.aspx', imgSrc: img('production-images/nalco_nqcifw'), imgAlt: 'Nalco', jobType: 'psu' },
  { id: 'job-14', url: 'https://www.joinindiannavy.gov.in/en/account/account/state', imgSrc: img('production-images/indian-navy_jffv8f'), imgAlt: 'Indian Navy', jobType: 'central' },
  { id: 'job-15', url: 'https://www.cdac.in/index.aspx?id=current_jobs', imgSrc: img('production-images/cdac_t3owh1'), imgAlt: 'CDAC', jobType: 'psu' },
  { id: 'job-16', url: 'https://csc.gov.in/careers', imgSrc: img('production-images/csc_ncnfb1'), imgAlt: 'CSC', jobType: 'central' },
  { id: 'job-17', url: 'https://www.meity.gov.in/offerings/vacancies?page=1', imgSrc: img('production-images/meity_u8srdj'), imgAlt: 'MEITY', jobType: 'central' },
  { id: 'job-18', url: 'https://wbprms.in/', imgSrc: img('production-images/wbprms_tpbn7u'), imgAlt: 'WBPRMS', jobType: 'state' },
];

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
  'NewsLetter — Govt Job Updates 2026 | Central, State & PSU Jobs India | ITI, UG/PG Admissions';

const SEO_DESCRIPTION =
  'Find the latest government job vacancies 2026 — RRB, DRDO, WBPSC, BHEL, IOCL & more. Central, State & PSU recruitment, ITI/Diploma admissions, UG/PG college portals, investment tools, and productivity platforms — all in one place.';

// Primary + long-tail + LSI keyword bank targeting high-traffic Indian job searches
const SEO_KEYWORDS = [
  'government job 2026', 'sarkari naukri 2026', 'govt job vacancy India', 'latest government jobs',
  'central government jobs', 'state government jobs', 'PSU jobs 2026', 'public sector jobs India',
  'sarkari result 2026',
  'RRB recruitment 2026', 'DRDO recruitment 2026', 'WBPSC jobs West Bengal', 'BHEL recruitment 2026',
  'IOCL recruitment 2026', 'GRSE recruitment 2026', 'Madras Fertilizers recruitment',
  'ITI admission 2026', 'diploma admission West Bengal', 'MAKAUT admission 2026',
  'Jadavpur University admission', 'SVMCM scholarship', 'Skill India digital', 'NISM certification',
  'fresher government job 2026', 'engineering jobs India 2026', 'railway jobs 2026',
  'defence jobs India', 'bank jobs 2026', 'SSC jobs 2026', 'UPSC 2026', 'police jobs India',
  'teacher recruitment 2026', 'jobs for 10th pass 2026', 'jobs for 12th pass 2026',
  'ITI pass government job', 'diploma holder government job',
  'upcoming IPO 2026 India', 'IPO GMP today', 'NSE stock market India', 'stock market live India',
  'zerodha brokerage calculator', 'upcoming dividends India',
  'free resume builder India', 'online productivity tools 2026', 'AI tools for students India',
  'government jobs West Bengal', 'sarkari naukri Kolkata', 'WB govt job 2026', 'Bengal PSC recruitment',
  'apply government job online 2026', 'latest job notification India', 'job alert 2026',
  'government job portal India', 'online job portal India',
].join(', ');

// Schema.org WebSite + SearchAction (enables Google Sitelinks Search Box)
const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'NewsLetter by Openroot Systems',
  url: 'https://openroot.in/newsletter',
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
      urlTemplate: 'https://openroot.in/newsletter?q={search_term_string}',
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
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://openroot.in' },
    { '@type': 'ListItem', position: 2, name: 'NewsLetter', item: 'https://openroot.in/newsletter' },
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

const HAS_LOCAL = isStorageAvailable('localStorage');
const HAS_SESSION = isStorageAvailable('sessionStorage');

function safeGet(key: string): string | null {
  try {
    if (HAS_LOCAL) return localStorage.getItem(key);
    if (HAS_SESSION) return sessionStorage.getItem(key);
  } catch {}
  return null;
}

function safeSet(key: string, value: string): void {
  try {
    if (HAS_LOCAL) { localStorage.setItem(key, value); return; }
    if (HAS_SESSION) sessionStorage.setItem(key, value);
  } catch {}
}

// ─── UID helpers ──────────────────────────────────────────────
function resolveUID(): string {
  try {
    const p = new URLSearchParams(window.location.search);
    const fromUrl = p.get('uid') ?? p.get('user');
    const fromMain = safeGet('openrootUserUID');
    const cached = safeGet('newsletter_current_uid');
    const uid = fromUrl ? decodeURIComponent(fromUrl) : (fromMain ?? cached ?? 'guest_user');
    if (uid !== cached) safeSet('newsletter_current_uid', uid);
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

// Only plain web links are ever rendered as hrefs.
function safeHref(url: string): string | undefined {
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:' ? url : undefined;
  } catch {
    console.warn('[NewsLetter] Blocked invalid URL:', url);
    return undefined;
  }
}

// ─── Card ─────────────────────────────────────────────────────
interface CardProps {
  card: CardData;
  isStarred: boolean;
  hidden?: boolean;
  onStarClick: (id: string) => void;
}

const Card: React.FC<CardProps> = React.memo(({ card, isStarred, hidden, onStarClick }) => {
  const handleStar = useCallback(() => onStarClick(card.id), [card.id, onStarClick]);

  return (
    <div
      className={`openroot-news__card${card.jobType ? ' is-job' : ''}${hidden ? ' is-hidden' : ''}`}
      data-type={card.jobType}
    >
      {/* the whole card is a real link, so it works with the keyboard and
          can be crawled; the star sits beside it, not inside it */}
      <a
        className="openroot-news__link"
        href={safeHref(card.url)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${card.imgAlt} (opens in a new tab)`}
      >
        <img src={card.imgSrc} alt="" loading="lazy" decoding="async" />
      </a>

      {card.isLive && (
        <span className="openroot-news__live" aria-label="Live data">
          <span className="openroot-news__live-dot" aria-hidden="true" />
          LIVE
        </span>
      )}

      <button
        type="button"
        className={`openroot-news__star${isStarred ? ' is-starred' : ''}`}
        aria-pressed={isStarred}
        aria-label={isStarred ? `Unstar ${card.imgAlt}` : `Star ${card.imgAlt}`}
        onClick={handleStar}
      >
        {isStarred ? '★' : '☆'}
      </button>
    </div>
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

  // starred cards first
  const sorted = useMemo(() => {
    const starred = cards.filter(c => starredIds.has(c.id));
    const unstarred = cards.filter(c => !starredIds.has(c.id));
    return [...starred, ...unstarred];
  }, [cards, starredIds]);

  return (
    <div className="openroot-news__grid" data-segment={segId}>
      {sorted.map(card => {
        const hidden = jobFilter !== undefined && jobFilter !== 'all' && card.jobType !== jobFilter;
        return (
          <Card
            key={card.id}
            card={card}
            isStarred={starredIds.has(card.id)}
            hidden={hidden}
            onStarClick={handleStar}
          />
        );
      })}
    </div>
  );
});
CardGrid.displayName = 'CardGrid';

// ─── Section ──────────────────────────────────────────────────
interface SectionProps {
  id: string;
  titleId: string;
  title: string;
  accent: Accent;
  count: number;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, titleId, title, accent, count, children }) => (
  <section className="openroot-news__section" id={id} aria-labelledby={titleId}>
    <div className="openroot-news__head">
      <span className={`openroot-news__marker openroot-news__marker--${accent}`} aria-hidden="true">
        {count}
      </span>
      <h2 className="openroot-news__h2" id={titleId}>{title}</h2>
    </div>
    {children}
  </section>
);

// ─── Toast ────────────────────────────────────────────────────
const Toast: React.FC<{ message: string }> = React.memo(({ message }) => (
  <div className="openroot-news__toast" role="status" aria-live="polite" aria-atomic="true">
    {message}
  </div>
));
Toast.displayName = 'Toast';

// ─── Main ─────────────────────────────────────────────────────
const NewsLetter: React.FC = () => {
  const userUID = useRef(resolveUID()).current;

  const [starredData, setStarredData] = useState<Record<string, string[]>>(() => loadStarred(userUID));
  const [menuOpen, setMenuOpen] = useState(false);
  const [jobFilter, setJobFilter] = useState<FilterType>('all');
  const [toast, setToast] = useState<string | null>(null);

  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const menuDropdownRef = useRef<HTMLUListElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── SEO injection (runs once on mount) ──────────────────────
  useEffect(() => {
    document.title = SEO_TITLE;

    setMeta('name', 'description', SEO_DESCRIPTION);
    setMeta('name', 'keywords', SEO_KEYWORDS);
    setMeta('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    setMeta('name', 'author', 'Openroot Systems');
    setMeta('name', 'theme-color', '#0b0040');
    setMeta('name', 'application-name', 'NewsLetter');

    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'NewsLetter — Openroot Systems');
    setMeta('property', 'og:title', SEO_TITLE);
    setMeta('property', 'og:description', SEO_DESCRIPTION);
    setMeta('property', 'og:url', 'https://openroot.in/newsletter');
    setMeta('property', 'og:image', 'https://openroot.in/assets/company-icon.png');
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:locale', 'en_IN');

    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', SEO_TITLE);
    setMeta('name', 'twitter:description', SEO_DESCRIPTION);
    setMeta('name', 'twitter:image', 'https://openroot.in/assets/company-icon.png');
    setMeta('name', 'twitter:site', '@OpenrootSystems');

    setMeta('name', 'geo.region', 'IN-WB');
    setMeta('name', 'geo.placename', 'Kolkata, West Bengal, India');
    setMeta('name', 'geo.position', '22.5726;88.3639');
    setMeta('name', 'ICBM', '22.5726, 88.3639');

    setLink('canonical', 'https://openroot.in/newsletter');

    injectJsonLd('xj-schema-website', WEBSITE_SCHEMA);
    injectJsonLd('xj-schema-itemlist', ITEMLIST_SCHEMA);
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

  // ── Save (debounced, ref-scoped) ────────────────────────────
  const persistStarred = useCallback((data: Record<string, string[]>) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try { safeSet(storageKey(userUID), JSON.stringify(data)); }
      catch (e) { console.warn('[NewsLetter] Failed to persist starred cards:', e); }
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
      if (ev.key !== 'openrootUserUID' && ev.key !== 'newsletter_current_uid') return;
      if (!ev.newValue || ev.newValue === userUID) return;
      safeSet('newsletter_current_uid', ev.newValue);
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

  // ── Outside click ───────────────────────────────────────────
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: PointerEvent) => {
      const target = e.target as Node;
      if (menuDropdownRef.current?.contains(target)) return;
      if (menuBtnRef.current?.contains(target)) return;
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

  // ── Cleanup on unmount ──────────────────────────────────────
  useEffect(() => () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  }, []);

  const goHome = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="openroot-news">
      {toast && <Toast message={toast} />}

      <header className="openroot-news__header" role="banner">
        <a className="openroot-news__brand" href="#" onClick={goHome}>
          #NewsLetter
        </a>

        <nav className="openroot-news__nav" aria-label="Main Navigation">
          {/* Desktop links — shown at ≥900px */}
          <div className="openroot-news__links">
            {NAV_ITEMS.map(({ label, href, accent, isHome }) => (
              <a
                key={label}
                href={href}
                className={`openroot-news__navlink openroot-news__navlink--${accent}`}
                onClick={isHome ? goHome : undefined}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Hamburger — shown at ≤899px; lines become an X via the .is-open class */}
          <button
            ref={menuBtnRef}
            type="button"
            className={`openroot-news__toggle${menuOpen ? ' is-open' : ''}`}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-controls="newsMenu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <span className="openroot-news__line" />
            <span className="openroot-news__line" />
            <span className="openroot-news__line" />
          </button>
        </nav>

        <ul
          id="newsMenu"
          ref={menuDropdownRef}
          className={`openroot-news__menu${menuOpen ? ' is-open' : ''}`}
          aria-hidden={menuOpen ? undefined : true}
          inert={!menuOpen || undefined}
        >
          {NAV_ITEMS.map(({ label, href, accent, isHome }) => (
            <li key={label}>
              <a
                href={href}
                className={`openroot-news__menulink openroot-news__menulink--${accent}`}
                onClick={e => {
                  if (isHome) goHome(e);
                  setMenuOpen(false);
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </header>

      <main className="openroot-news__container">
        {/* Hidden SEO content: visible to crawlers and screen readers' context,
            invisible to sighted users. */}
        <div className="openroot-news__sr" aria-hidden="true">
          <h1>NewsLetter — Government Jobs India 2026 | Sarkari Naukri | ITI, UG/PG, PSU Recruitment</h1>
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

        <Section id="jobs-section" titleId="jobs-title" title="Govt. job updates" accent="pink" count={JOB_CARDS.length}>
          <div className="openroot-news__filters" role="toolbar" aria-label="Filter jobs">
            {(['all', 'central', 'state', 'psu'] as FilterType[]).map(f => (
              <button
                key={f}
                type="button"
                className={`openroot-news__filter${jobFilter === f ? ' is-active' : ''}`}
                data-filter={f}
                aria-pressed={jobFilter === f}
                onClick={() => setJobFilter(f)}
              >
                {f === 'all' ? 'All' : f === 'psu' ? 'PSU' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <CardGrid segId="jobs" cards={JOB_CARDS} starredIds={getSet('jobs')} jobFilter={jobFilter} onStarClick={handleStarClick} />
        </Section>

        <Section id="govt-websites-section" titleId="govt-title" title="Govt websites" accent="green" count={GOVT_CARDS.length}>
          <CardGrid segId="govt" cards={GOVT_CARDS} starredIds={getSet('govt')} onStarClick={handleStarClick} />
        </Section>

        <Section id="ugpg-section" titleId="ugpg-title" title="UG / PG" accent="cyan" count={UGPG_CARDS.length}>
          <CardGrid segId="ugpg" cards={UGPG_CARDS} starredIds={getSet('ugpg')} onStarClick={handleStarClick} />
        </Section>

        <Section id="iti-section" titleId="iti-title" title="ITI / Diploma" accent="blue" count={ITI_CARDS.length}>
          <CardGrid segId="iti" cards={ITI_CARDS} starredIds={getSet('iti')} onStarClick={handleStarClick} />
        </Section>

        <Section id="invest-section" titleId="invest-title" title="Investing related websites" accent="gold" count={INVEST_CARDS.length}>
          <CardGrid segId="invest" cards={INVEST_CARDS} starredIds={getSet('invest')} onStarClick={handleStarClick} />
        </Section>

        <Section id="ai-section" titleId="ai-title" title="Productivity booster platforms" accent="purple" count={AI_CARDS.length}>
          <CardGrid segId="ai" cards={AI_CARDS} starredIds={getSet('ai')} onStarClick={handleStarClick} />
        </Section>
      </main>

      <footer className="openroot-news__footer" role="contentinfo">
        <p>&copy; 2026 Openroot Systems. All rights reserved.</p>
        <p>Made for students and job seekers.</p>
        <p className="openroot-news__version" aria-hidden="true">Version 2026.2</p>
      </footer>
    </div>
  );
};

export default NewsLetter;