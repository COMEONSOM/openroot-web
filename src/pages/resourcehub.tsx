// ============================================================
// OPENROOT ResourceHub — ResourceHub.tsx
// VERSION: 2.0.0 — Full rewrite
// Changes from 1.4.1:
//   • Hamburger: pure CSS animation (no GSAP timeline, no refs)
//   • saveTimer: moved from module-level to useRef (HMR safe)
//   • Outside-click: pointerdown instead of deferred click
//   • Auto-close: MediaQueryList closes menu at ≥900px
//   • Dropdown: inert attribute blocks AT/keyboard when hidden
//   • GSAP: magnetic hover only, overwrite:'auto' added
//   • Removed: unused Link import, closeMenu useCallback
// ============================================================

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react';
import gsap from 'gsap';
import '../components/styles/ResourceHub.css';

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
  { id: 'ugpg-1', url: 'https://makaut1.ucanapply.com/smartexam/public/student', imgSrc: img('assets-rh/makaut_pnoufn'), imgAlt: 'MAKAUT' },
  { id: 'ugpg-2', url: 'https://svmcm.wb.gov.in/', imgSrc: img('assets-rh/svmcm_wguoxv'), imgAlt: 'SVMCM' },
  { id: 'ugpg-3', url: 'https://www.nism.ac.in/', imgSrc: img('assets-rh/nism_okw994'), imgAlt: 'NISM' },
  { id: 'ugpg-4', url: 'https://admissionju.jadavpuruniversity.in/fengadmission/', imgSrc: img('assets-rh/ju_r2vgcv'), imgAlt: 'Jadavpur University' },
];

const GOVT_CARDS: CardData[] = [
  { id: 'govt-1', url: 'https://uidai.gov.in/', imgSrc: img('assets-rh/uidai_xwbq1i'), imgAlt: 'UIDAI' },
  { id: 'govt-2', url: 'https://voters.eci.gov.in/', imgSrc: img('assets-rh/voters_zvsfda'), imgAlt: 'Voter Registration' },
  { id: 'govt-3', url: 'https://unifiedportal-mem.epfindia.gov.in/', imgSrc: img('assets-rh/unifiedportal_rmfgqt'), imgAlt: 'Unified Portal' },
  { id: 'govt-4', url: 'https://passbook.epfindia.gov.in/MemberPassBook/login', imgSrc: img('assets-rh/PFpassbook_gjxnhk'), imgAlt: 'PFpassbook' },
  { id: 'govt-5', url: 'https://portal.esic.gov.in/EmployeePortal/login.aspx', imgSrc: img('assets-rh/esic_jd3ynx'), imgAlt: 'ESIC' },
];

const AI_CARDS: CardData[] = [
  { id: 'ai-1',  url: 'https://app.flowcv.com/resumes',          imgSrc: img('assets-rh/resume_hw2yh7'),          imgAlt: 'resume' },
  { id: 'ai-2',  url: 'https://playground.com/',                  imgSrc: img('assets-rh/playground_zco9cz'),      imgAlt: 'Playground' },
  { id: 'ai-3',  url: 'https://icons8.com/',                      imgSrc: img('assets-rh/icons8_sxvnp8'),          imgAlt: 'icons8' },
  { id: 'ai-4',  url: 'https://www.widecanvas.ai/',               imgSrc: img('assets-rh/wide_mggcdb.avif'),            imgAlt: 'WideCanvas' },
  { id: 'ai-5',  url: 'https://squoosh.app/',                     imgSrc: img('assets-rh/squoosh_dwhzif'),         imgAlt: 'squoosh' },
  { id: 'ai-6',  url: 'https://animegenius.live3d.io/',           imgSrc: img('assets-rh/anime_eevsei'),           imgAlt: 'Anime Maker' },
  { id: 'ai-7',  url: 'https://www.oxaam.com/',                   imgSrc: img('assets-rh/oxii_pizjy7'),            imgAlt: 'ox' },
  { id: 'ai-8',  url: 'https://lottiefiles.com/',                 imgSrc: img('assets-rh/lottie_onkqtq'),          imgAlt: 'lottie' },
  { id: 'ai-9',  url: 'https://reactbits.dev/',                   imgSrc: img('assets-rh/reactbits_k3mckb'),       imgAlt: 'reactbits' },
  { id: 'ai-10', url: 'https://gradienty.codes/',                 imgSrc: img('assets-rh/gradienty_lrfznd'),       imgAlt: 'gradienty' },
  { id: 'ai-11', url: 'https://spline.design/',                   imgSrc: img('assets-rh/spline_kcutlx'),          imgAlt: 'spline' },
  { id: 'ai-12', url: 'https://www.cloudflare.com/en-in/',        imgSrc: img('assets-rh/cloudflare_bnfm30'),      imgAlt: 'Cloudflare' },
  { id: 'ai-13', url: 'https://console.cloud.google.com/',        imgSrc: img('assets-rh/google-console_rjtqct'), imgAlt: 'console.cloud.google' },
  { id: 'ai-14', url: 'https://skillshop.withgoogle.com/',        imgSrc: img('assets-rh/google-skillshop_oqqxw1'), imgAlt: 'skillshop.withgoogle' },
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
  { id: 'job-1', url: 'https://rrbrecruitmentstaging.net/#/auth/landing',   imgSrc: img('assets-rh/rrb_nv0pt4'),         imgAlt: 'RRB',                       jobType: 'central' },
  { id: 'job-2', url: 'https://drdo.gov.in/drdo/',                          imgSrc: img('assets-rh/DRDO_tny47z'),   imgAlt: 'DRDO',                      jobType: 'central' },
  { id: 'job-3', url: 'https://wbpsc.gov.in',                               imgSrc: img('assets-rh/wbpsc_jx06od.png'),       imgAlt: 'WBPSC',                     jobType: 'state' },
  { id: 'job-4', url: 'https://www.grse.in/career/',                        imgSrc: img('assets-rh/grse-logo_cw8xcg'),   imgAlt: 'GRSE',                      jobType: 'psu' },
  { id: 'job-5', url: 'https://careers.bhel.in/index.jsp',                  imgSrc: img('assets-rh/bhel_iv3bdc'),       imgAlt: 'BHEL',                      jobType: 'psu' },
  { id: 'job-6', url: 'https://iocl.com/latest-job-opening',                imgSrc: img('assets-rh/iocllogo_qpttuz'),    imgAlt: 'IOCL',                      jobType: 'psu' },
  { id: 'job-7', url: 'https://madrasfert.co.in/resources/recruitment/',    imgSrc: img('assets-rh/madras-fert_nnks9s'),imgAlt: 'Madras-Fertilizers-Limited', jobType: 'psu' },
];

// ─── Storage helpers ──────────────────────────────────────────
function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const s = window[type];
    const k = '__rh_test__';
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
    const cached  = safeGet('openroot_current_uid');
    const uid     = fromUrl ? decodeURIComponent(fromUrl) : (fromMain ?? cached ?? 'guest_user');
    if (uid !== cached) safeSet('openroot_current_uid', uid);
    return uid;
  } catch { return 'guest_user'; }
}

function storageKey(uid: string): string { return `starredCards_${uid}`; }

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
      className={`star-btn${isStarred ? ' starred' : ''}`}
      aria-pressed={isStarred}
      aria-label={isStarred ? 'Unstar card' : 'Star card'}
      onClick={handleStar}
    >
      {isStarred ? '★' : '☆'}
    </button>
  );

  return (
    <article
      className={`card${isJobCard ? ' job-card' : ''}${hidden ? ' hidden' : ''}`}
      data-url={card.url}
      data-type={card.jobType}
      role="button"
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden ? true : undefined}
      onClick={() => !hidden && onCardClick(card.url)}
      onKeyDown={handleKeyDown}
    >
      {isJobCard ? (
        <div className="img-wrapper">
          {starBtn}
          <img src={card.imgSrc} alt={card.imgAlt} loading="lazy" decoding="async" />
        </div>
      ) : (
        <>
          {starBtn}
          {card.isLive && <p className="live" aria-label="Live data">LIVE</p>}
          <div className="img-wrapper">
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
    } catch { console.warn('[ResourceHub] Blocked invalid URL:', url); }
  }, []);

  const sorted = useMemo(() => {
    const starred   = cards.filter(c =>  starredIds.has(c.id));
    const unstarred = cards.filter(c => !starredIds.has(c.id));
    return [...starred, ...unstarred];
  }, [cards, starredIds]);

  return (
    <div className="card-grid" data-segment={segId}>
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
  <div className="rh-toast" role="alert" aria-live="assertive" aria-atomic="true">
    {message}
  </div>
));
Toast.displayName = 'Toast';

// ─── Main ─────────────────────────────────────────────────────
const ResourceHub: React.FC = () => {
  const userUID = useRef(resolveUID()).current;

  const [starredData, setStarredData] = useState<Record<string, string[]>>(() => loadStarred(userUID));
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [jobFilter,   setJobFilter]   = useState<FilterType>('all');
  const [toast,       setToast]       = useState<string | null>(null);

  const menuBtnRef      = useRef<HTMLButtonElement>(null);
  const menuDropdownRef = useRef<HTMLUListElement>(null);
  const saveTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      catch (e) { console.warn('[ResourceHub] Failed to persist starred cards:', e); }
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
      if (ev.key !== 'openrootUserUID' && ev.key !== 'openroot_current_uid') return;
      if (!ev.newValue || ev.newValue === userUID) return;
      safeSet('openroot_current_uid', ev.newValue);
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
    <div className="resource-hub">
      {toast && <Toast message={toast} />}

      <div className="tech-orb" aria-hidden="true" />
      <div className="tech-orb" aria-hidden="true" />
      <div className="tech-orb" aria-hidden="true" />

      <header className="site-header" role="banner">
        <div className="logo-wrapper">
          <img
            src="/assets/openroot-white-nobg.png"
            alt="Openroot Resource Hub"
            className="site-logo"
            loading="lazy"
            decoding="async"
            width={120}
            height={40}
          />
          <span className="logo-text">#resource_hub</span>
        </div>

        <nav className="navbar" role="navigation" aria-label="Main Navigation">
          {/* Desktop — always visible ≥900px via CSS */}
          <div className="nav-links">
            <a href="#" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Home</a>
            <a href="#iti-section">ITI/Diploma</a>
            <a href="#ugpg-section">UG/PG</a>
            <a href="#govt-websites-section">Govt Sites</a>
            <a href="#ai-section">PB Sites</a>
            <a href="#invest-section">Invest</a>
            <a href="#jobs-section">Jobs</a>
          </div>

          {/* Hamburger — lines animated purely by CSS via .open class */}
          <button
            ref={menuBtnRef}
            className={`menu-toggle${menuOpen ? ' open' : ''}`}
            style={{ isolation: 'isolate', willChange: 'transform' }}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            aria-controls="menuDropdown"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <span className="menu-line" />
            <span className="menu-line" />
            <span className="menu-line" />
          </button>

          {/* Dropdown — visibility+opacity (never display:none fights .open) */}
          <ul
            id="menuDropdown"
            ref={menuDropdownRef}
            className={`menu-dropdown${menuOpen ? ' open' : ''}`}
            role="menu"
            aria-hidden={menuOpen ? undefined : true}
            // inert blocks AT + keyboard when hidden (supported in all modern browsers)
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

      <main className="container" role="main">
        <section className="section-container" id="iti-section" aria-labelledby="iti-title">
          <h2 className="section-title" id="iti-title">ITI / DIPLOMA</h2>
          <CardGrid segId="iti" cards={ITI_CARDS} starredIds={getSet('iti')} onStarClick={handleStarClick} />
        </section>

        <section className="section-container" id="ugpg-section" aria-labelledby="ugpg-title">
          <h2 className="section-title" id="ugpg-title">UG / PG</h2>
          <CardGrid segId="ugpg" cards={UGPG_CARDS} starredIds={getSet('ugpg')} onStarClick={handleStarClick} />
        </section>

        <section className="section-container" id="govt-websites-section" aria-labelledby="govt-title">
          <h2 className="section-title" id="govt-title">GOVT WEBSITES</h2>
          <CardGrid segId="govt" cards={GOVT_CARDS} starredIds={getSet('govt')} onStarClick={handleStarClick} />
        </section>

        <section className="section-container" id="ai-section" aria-labelledby="ai-title">
          <h2 className="section-title" id="ai-title">PRODUCTIVITY BOOSTER PLATFORMS</h2>
          <CardGrid segId="ai" cards={AI_CARDS} starredIds={getSet('ai')} onStarClick={handleStarClick} />
        </section>

        <section className="section-container" id="invest-section" aria-labelledby="invest-title">
          <h2 className="section-title" id="invest-title">INVESTING RELATED WEBSITES</h2>
          <CardGrid segId="invest" cards={INVEST_CARDS} starredIds={getSet('invest')} onStarClick={handleStarClick} />
        </section>

        <section className="section-container" id="jobs-section" aria-labelledby="jobs-title">
          <h2 className="section-title" id="jobs-title">GOVT. JOB UPDATES</h2>
          <div className="job-filters" role="toolbar" aria-label="Filter Jobs">
            {(['all', 'central', 'state', 'psu'] as FilterType[]).map(f => (
              <button
                key={f}
                className={`filter-btn${jobFilter === f ? ' active' : ''}`}
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

      <footer className="site-footer" role="contentinfo">
        <div className="footer-bottom">
          <p>&copy; 2026 Openroot Systems. All rights reserved.</p>
          <p>Made with ❤️ for students and job seekers.</p>
        </div>
        <div className="version-label" aria-hidden="true">Version 2026.2</div>
      </footer>
    </div>
  );
};

export default ResourceHub;