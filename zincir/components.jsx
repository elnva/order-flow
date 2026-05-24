
// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = 'currentColor', style = {} }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    invoice: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    package: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>,
    cart: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    chevron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    chevronDown: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    arrowRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    list: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    wallet: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    truck: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
    phone: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.61 4.34 2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  };
  return <span style={{ display: 'inline-flex', alignItems: 'center', ...style }}>{icons[name] || null}</span>;
};

// ─── BADGE ────────────────────────────────────────────────────────────────────
const Badge = ({ status, children }) => {
  const styles = {
    beklemede: { background: 'rgba(201,168,76,0.12)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.25)' },
    onaylandi: { background: 'rgba(91,143,168,0.12)', color: '#7aadca', border: '1px solid rgba(91,143,168,0.25)' },
    tamamlandi: { background: 'rgba(143,168,154,0.12)', color: '#8fa89a', border: '1px solid rgba(143,168,154,0.2)' },
    hazirlaniyor: { background: 'rgba(201,168,76,0.08)', color: '#e2c06a', border: '1px solid rgba(201,168,76,0.2)' },
  };
  const s = styles[status] || styles.beklemede;
  return (
    <span style={{
      ...s,
      padding: '2px 10px',
      borderRadius: 20,
      fontSize: 11,
      fontFamily: 'DM Sans, sans-serif',
      fontWeight: 500,
      whiteSpace: 'nowrap',
      letterSpacing: '0.02em',
    }}>{children}</span>
  );
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, size = 32, active = false, round = false, logo = null }) => {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?';
  // Deterministic color from name (5 brand-tinted palette options)
  const hashCode = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const palette = [
    { bg: 'linear-gradient(135deg, #f97316, #ea580c)', border: 'rgba(249,115,22,0.4)' },
    { bg: 'linear-gradient(135deg, #5b8fa8, #3d6f87)', border: 'rgba(91,143,168,0.4)' },
    { bg: 'linear-gradient(135deg, #c9a84c, #a88a2f)', border: 'rgba(201,168,76,0.4)' },
    { bg: 'linear-gradient(135deg, #7bc49a, #4f9670)', border: 'rgba(123,196,154,0.4)' },
    { bg: 'linear-gradient(135deg, #b06d8a, #8a4d6a)', border: 'rgba(176,109,138,0.4)' },
    { bg: 'linear-gradient(135deg, #6d7eb0, #4d5e8a)', border: 'rgba(109,126,176,0.4)' },
  ];
  const tone = palette[hashCode % palette.length];

  if (logo) {
    return (
      <div style={{
        width: size, height: size,
        borderRadius: round ? '50%' : 8,
        overflow: 'hidden', flexShrink: 0,
        border: `1px solid ${active ? tone.border : 'var(--border)'}`,
        background: 'var(--surface2)',
      }}>
        <img src={logo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size,
      borderRadius: round ? '50%' : 8,
      background: active ? tone.bg : tone.bg,
      border: `1px solid ${tone.border}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36,
      fontWeight: 700,
      color: '#fff',
      fontFamily: 'Syne, sans-serif',
      flexShrink: 0,
      letterSpacing: '0.01em',
      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
    }}>{initials}</div>
  );
};

// ─── BUTTON ───────────────────────────────────────────────────────────────────
const Btn = ({ variant = 'primary', children, onClick, icon, fullWidth, size = 'md', style: extraStyle = {}, disabled }) => {
  const [pressed, setPressed] = React.useState(false);
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    gap: 8, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'DM Sans, sans-serif', fontWeight: 500,
    letterSpacing: '0.02em', border: 'none', outline: 'none',
    transition: 'all 0.18s ease',
    borderRadius: 10, whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : 'auto',
    transform: pressed ? 'scale(0.98)' : 'scale(1)',
    opacity: disabled ? 0.45 : 1,
  };
  const sizes = {
    sm: { padding: '8px 14px', fontSize: 11 },
    md: { padding: '11px 22px', fontSize: 12 },
    lg: { padding: '14px 28px', fontSize: 13 },
  };
  const variants = {
    primary: { background: 'var(--blue)', color: '#fff' },
    secondary: { background: 'transparent', color: 'var(--blue)', border: '1px solid var(--blue)' },
    ghost: { background: 'transparent', color: 'var(--text-soft)' },
    gold: { background: 'var(--gold)', color: '#0b1210' },
    danger: { background: 'rgba(168,91,91,0.15)', color: '#c87a7a', border: '1px solid rgba(168,91,91,0.25)' },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{ ...base, ...sizes[size], ...variants[variant], ...extraStyle }}
    >
      {icon && <Icon name={icon} size={14} color="currentColor" />}
      {children}
    </button>
  );
};

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
const SectionLabel = ({ children, style = {} }) => (
  <div style={{
    fontFamily: 'DM Sans, sans-serif',
    fontSize: 9.5, fontWeight: 600,
    letterSpacing: '0.17em',
    color: 'var(--muted)',
    textTransform: 'uppercase',
    ...style,
  }}>{children}</div>
);

// ─── LOGO ─────────────────────────────────────────────────────────────────────
const Logo = ({ collapsed = false }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
    {/* Mark: two flow arrows */}
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" rx="10" fill="var(--blue)" opacity="0.13"/>
      <path d="M8 13h13M18 9l4 4-4 4" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M28 23H15M18 27l-4-4 4-4" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
    </svg>
    {!collapsed && (
      <div style={{ lineHeight: 1 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 15, fontWeight: 800,
          letterSpacing: '-0.02em',
          color: 'var(--text)',
          display: 'flex', alignItems: 'baseline', gap: 0,
        }}>
          Order<span style={{ color: 'var(--blue)', marginLeft: 4 }}>Flow</span>
        </div>
        <div style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 9, fontWeight: 400,
          letterSpacing: '0.14em',
          color: 'var(--muted)',
          textTransform: 'uppercase',
          marginTop: 4,
        }}>Tedarik Yönetimi</div>
      </div>
    )}
  </div>
);

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const FIRMS = [
  { id: 'mirva', name: 'Mirva', badge: 2, emoji: 'M' },
  { id: 'devran', name: 'Devran Döner', badge: 0, emoji: 'D' },
  { id: 'baklavaci', name: 'Baklavacı', badge: 1, emoji: 'B' },
  { id: 'kervan', name: 'Kervan Food', badge: 0, emoji: 'K' },
];

const Sidebar = ({ activeFirm, onFirmSelect, currentScreen, onScreenChange, role, open, onClose, supplierBadges = {} }) => {
  const [hoveredFirm, setHoveredFirm] = React.useState(null);

  const navItems = role === 'donerci'
    ? [
        { id: 'home', label: 'Anasayfa', icon: 'home' },
        { id: 'orders', label: 'Siparişlerim', icon: 'list' },
        { id: 'debt', label: 'Toplam Borcum', icon: 'wallet' },
      ]
    : [
        { id: 'supplier-orders',    label: 'Gelen Siparişler',  icon: 'list',    badge: supplierBadges['supplier-orders'] || 0 },
        { id: 'supplier-customers', label: 'Müşteriler',        icon: 'users' },
        { id: 'supplier-debt',      label: 'Borç & Ödeme',      icon: 'wallet' },
        { id: 'supplier-products',  label: 'Ürün Kataloğu',     icon: 'package' },
      ];

  const sidebarStyle = {
    width: 'var(--sidebar-w)',
    minHeight: '100vh',
    background: 'var(--bg2)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    flexShrink: 0,
    zIndex: 10,
  };

  const mobileSidebarStyle = {
    ...sidebarStyle,
    position: 'fixed',
    top: 0, left: 0, bottom: 0,
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.28s ease',
    zIndex: 200,
  };

  const isDesktop = window.innerWidth >= 768;

  return (
    <>
      {/* Mobile overlay */}
      {!isDesktop && open && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)', zIndex: 199,
        }} />
      )}
      <aside style={isDesktop ? sidebarStyle : mobileSidebarStyle}>
        {/* Sidebar right glow */}
        <div style={{
          position: 'absolute', right: -1, top: '20%', bottom: '20%',
          width: 1,
          background: 'linear-gradient(to bottom, transparent, rgba(91,143,168,0.25), transparent)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
          <Logo />
        </div>



        {/* Firms (donerci only) */}
        {role === 'donerci' && (
          <div style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
            <SectionLabel style={{ padding: '8px 10px 6px' }}>Firmalarım</SectionLabel>
            {FIRMS.map(firm => {
              const active = activeFirm === firm.id;
              const hovered = hoveredFirm === firm.id;
              return (
                <div key={firm.id} style={{ marginBottom: 2 }}>
                  {/* Firm row */}
                  <button
                    onClick={() => {
                      if (active) { onFirmSelect(null); }
                      else { onFirmSelect(firm.id); }
                    }}
                    onMouseEnter={() => setHoveredFirm(firm.id)}
                    onMouseLeave={() => setHoveredFirm(null)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 10px', borderRadius: 8, border: 'none',
                      background: active ? 'var(--blue-dim)' : hovered ? 'var(--surface2)' : 'transparent',
                      cursor: 'pointer', transition: 'all 0.18s ease',
                      position: 'relative',
                    }}
                  >
                    {active && (
                      <div style={{
                        position: 'absolute', left: 0, top: '15%', bottom: '15%',
                        width: 2, borderRadius: 2, background: 'var(--blue)',
                      }} />
                    )}
                    <Avatar name={firm.name} size={28} active={active} />
                    <span style={{
                      flex: 1, textAlign: 'left', fontSize: 13,
                      fontFamily: 'DM Sans, sans-serif',
                      color: active ? 'var(--blue-light)' : 'var(--text)',
                      fontWeight: active ? 500 : 400,
                    }}>{firm.name}</span>
                    {firm.badge > 0 && (
                      <span style={{
                        background: 'var(--blue)', color: '#fff',
                        borderRadius: 10, padding: '1px 6px',
                        fontSize: 10, fontWeight: 600, fontFamily: 'DM Sans',
                      }}>{firm.badge}</span>
                    )}
                    <div style={{
                      transform: active ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      display: 'flex', alignItems: 'center',
                    }}>
                      <Icon name="chevron" size={12} color="var(--muted)" />
                    </div>
                  </button>

                  {/* Expanded sub-actions */}
                  <div style={{
                    maxHeight: active ? 100 : 0,
                    overflow: 'hidden',
                    transition: 'max-height 0.25s ease',
                  }}>
                    <div style={{ padding: '4px 10px 6px 48px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[
                        { label: 'Sipariş Ver', icon: 'cart', screen: 'new-order' },
                        { label: 'Faturalarım', icon: 'invoice', screen: 'orders' },
                      ].map(item => (
                        <button key={item.screen}
                          onClick={() => { onFirmSelect(firm.id); onScreenChange(item.screen); onClose && onClose(); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '7px 10px', borderRadius: 7, border: 'none',
                            background: currentScreen === item.screen && activeFirm === firm.id
                              ? 'rgba(249,115,22,0.1)' : 'transparent',
                            color: currentScreen === item.screen && activeFirm === firm.id
                              ? 'var(--blue-light)' : 'var(--text-soft)',
                            cursor: 'pointer', fontSize: 12,
                            fontFamily: 'DM Sans, sans-serif', fontWeight: 400,
                            transition: 'all 0.15s ease', textAlign: 'left',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.color = 'var(--text)'; }}
                          onMouseLeave={e => {
                            e.currentTarget.style.background = currentScreen === item.screen && activeFirm === firm.id ? 'rgba(249,115,22,0.1)' : 'transparent';
                            e.currentTarget.style.color = currentScreen === item.screen && activeFirm === firm.id ? 'var(--blue-light)' : 'var(--text-soft)';
                          }}
                        >
                          <Icon name={item.icon} size={12} color="currentColor" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Supplier nav */}
        {role === 'tedarikci' && (
          <div style={{ padding: '12px 10px', flex: 1, overflowY: 'auto' }}>
            <SectionLabel style={{ padding: '8px 10px 6px' }}>Menü</SectionLabel>
            {navItems.map(item => {
              const active = currentScreen === item.id;
              return (
                <button key={item.id}
                  onClick={() => { onScreenChange(item.id); onClose && onClose(); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 8, border: 'none',
                    background: active ? 'var(--blue-dim)' : 'transparent',
                    color: active ? 'var(--blue-light)' : 'var(--text)',
                    cursor: 'pointer', textAlign: 'left',
                    fontSize: 13, fontFamily: 'DM Sans, sans-serif',
                    fontWeight: active ? 500 : 400,
                    marginBottom: 2, position: 'relative',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface2)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
                >
                  {active && (
                    <div style={{
                      position: 'absolute', left: 0, top: '15%', bottom: '15%',
                      width: 2, borderRadius: 2, background: 'var(--blue)',
                    }} />
                  )}
                  <Icon name={item.icon} size={15} color="currentColor" />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge > 0 && (
                    <span style={{
                      background: 'var(--blue)', color: '#fff',
                      borderRadius: 10, padding: '2px 7px',
                      fontSize: 10, fontWeight: 700, fontFamily: 'DM Sans',
                      letterSpacing: '0.02em',
                      animation: active ? 'none' : 'pulse 2.4s ease-in-out infinite',
                    }}>{item.badge} yeni</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
          <button style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '9px 10px', borderRadius: 8, border: 'none',
            background: 'transparent', color: 'var(--muted)',
            cursor: 'pointer', fontSize: 13, fontFamily: 'DM Sans, sans-serif',
            transition: 'all 0.18s ease',
          }}>
            <Icon name="logout" size={15} color="currentColor" />
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
};

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
const ThemeToggle = ({ theme, onToggle }) => {
  const isDark = theme === 'dark';
  return (
    <button
      onClick={onToggle}
      title={isDark ? 'Açık moda geç' : 'Koyu moda geç'}
      style={{
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '7px 12px', borderRadius: 10,
        background: 'var(--surface)', border: '1px solid var(--border)',
        color: 'var(--text-soft)', cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 500,
        transition: 'all 0.18s ease', flexShrink: 0,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.color = 'var(--blue)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-soft)'; }}
    >
      {isDark ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
      {isDark ? 'Açık' : 'Koyu'}
    </button>
  );
};

// ─── TOPBAR ───────────────────────────────────────────────────────────────────
const Topbar = ({ role, activeFirmName, onMenuToggle, theme, onToggleTheme, profile, onProfileClick }) => {
  const companyName = profile?.company || (role === 'donerci' ? 'Türk Döner' : 'Devran Döner');
  const greeting = `Hoş geldiniz, ${companyName}`;
  const subtitle = role === 'donerci' ? 'Tedarik sürecinizi kolayca yönetin.' : 'Gelen siparişleri takip edin.';
  const displayName = companyName;
  return (
    <header style={{
      height: 'var(--topbar-h)',
      background: 'var(--bg2)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 24px', gap: 16,
      position: 'relative', zIndex: 5,
      flexShrink: 0,
    }}>
      <button onClick={onMenuToggle} className="mobile-menu-btn" style={{
        background: 'none', border: 'none',
        color: 'var(--text-soft)', cursor: 'pointer', padding: 4,
      }}>
        <Icon name="menu" size={18} color="currentColor" />
      </button>

      <div className="topbar-greeting" style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 15, fontWeight: 600,
          color: 'var(--text)', letterSpacing: '0.01em',
        }}>{greeting}</div>
        <div style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 1 }}>{subtitle}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />

        <button style={{
          position: 'relative', background: 'none', border: 'none',
          color: 'var(--text-soft)', cursor: 'pointer', padding: 6,
          borderRadius: 8, transition: 'all 0.18s ease',
        }}>
          <Icon name="bell" size={18} color="currentColor" />
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--blue)',
            animation: 'pulse 2s infinite',
            border: '1.5px solid var(--bg2)',
          }} />
        </button>

        <div
          onClick={onProfileClick}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '6px 10px',
            cursor: 'pointer', transition: 'all 0.18s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--blue)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <Avatar name={displayName} size={26} active round />
          <span style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{displayName}</span>
          <Icon name="chevronDown" size={12} color="var(--muted)" />
        </div>
      </div>
    </header>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    height: 44, background: 'var(--bg2)',
    borderTop: '1px solid var(--border)',
    display: 'flex', alignItems: 'center',
    padding: '0 24px', flexShrink: 0,
    justifyContent: 'space-between',
  }}>
    <span style={{ fontSize: 11, color: 'var(--muted)' }}>© 2025 Zincir. Tüm hakları saklıdır.</span>
    <div style={{ display: 'flex', gap: 20 }}>
      {['Destek', 'İletişim'].map(l => (
        <a key={l} href="#" style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}>{l}</a>
      ))}
    </div>
  </footer>
);

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ message, visible, type = 'success' }) => (
  <div style={{
    position: 'fixed', bottom: 24, right: 24,
    background: 'var(--surface)',
    border: `1px solid ${type === 'success' ? 'rgba(91,143,168,0.3)' : 'rgba(201,168,76,0.3)'}`,
    borderRadius: var_radius(12),
    padding: '14px 20px',
    display: 'flex', alignItems: 'center', gap: 12,
    zIndex: 1000,
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
    transform: visible ? 'translateY(0)' : 'translateY(100px)',
    opacity: visible ? 1 : 0,
    transition: 'all 0.3s ease',
    pointerEvents: visible ? 'auto' : 'none',
    maxWidth: 360,
  }}>
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      background: type === 'success' ? 'var(--blue-dim)' : 'var(--gold-dim)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <Icon name="check" size={14} color={type === 'success' ? 'var(--blue-light)' : 'var(--gold)'} />
    </div>
    <span style={{ fontSize: 13, color: 'var(--text)' }}>{message}</span>
  </div>
);
function var_radius(n) { return n + 'px'; }

// ─── DRAWER ───────────────────────────────────────────────────────────────────
const Drawer = ({ open, onClose, title, children, width = 420 }) => {
  React.useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  return (
    <>
      {open && (
        <div onClick={onClose} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 300,
        }} />
      )}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: Math.min(width, window.innerWidth - 32),
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)',
        zIndex: 301,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease-out',
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 40px rgba(0,0,0,0.3)',
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 20, fontWeight: 600, color: 'var(--text)',
          }}>{title}</div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-soft)',
            cursor: 'pointer', padding: 4, borderRadius: 6,
            display: 'flex', alignItems: 'center',
          }}>
            <Icon name="x" size={18} color="currentColor" />
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {children}
        </div>
      </div>
    </>
  );
};

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
const EmptyState = ({ icon = 'package', title, desc, ctaLabel, onCta }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: 16, padding: '80px 24px',
    textAlign: 'center',
  }}>
    <div style={{
      width: 72, height: 72, borderRadius: 20,
      background: 'var(--blue-dim)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      opacity: 0.7,
    }}>
      <Icon name={icon} size={32} color="var(--blue)" />
    </div>
    <div>
      <div style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8,
      }}>{title}</div>
      <div style={{ fontSize: 13, color: 'var(--text-soft)', maxWidth: 280 }}>{desc}</div>
    </div>
    {ctaLabel && <Btn onClick={onCta}>{ctaLabel}</Btn>}
  </div>
);

// ─── SKELETON ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: '28px 24px',
  }}>
    <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 20 }} />
    <div className="skeleton" style={{ width: '60%', height: 14, borderRadius: 4, marginBottom: 10 }} />
    <div className="skeleton" style={{ width: '80%', height: 12, borderRadius: 4, marginBottom: 6 }} />
    <div className="skeleton" style={{ width: '50%', height: 12, borderRadius: 4 }} />
  </div>
);

// Export all shared components
Object.assign(window, {
  Icon, Badge, Avatar, Btn, SectionLabel, Logo, Sidebar, Topbar, Footer,
  Toast, Drawer, EmptyState, SkeletonCard, FIRMS,
});
