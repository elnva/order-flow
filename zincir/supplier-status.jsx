
// ═══ ORDER STATUS MODELİ ══════════════════════════════════════════════════════
//   3 durum: bekliyor · onaylandi · iptal
//   - useOrderStatuses: localStorage-backed durum haritası
//   - canEditOrder: 2 saat kuralı + status kontrolü
//   - STATUS_META: renk/etiket/ikon kataloğu

const EDIT_WINDOW_MS = 2 * 60 * 60 * 1000; // 2 saat

// Mock "şu an" — gerçek dünyada Date.now(); demo için son siparişten 30dk sonra
const getMockNow = () => {
  try {
    return new Date(TODAY_BASE.getTime() + 30 * 60 * 1000);
  } catch {
    return new Date();
  }
};

const STATUS_META = {
  bekliyor: {
    label: 'Bekliyor',
    color: '#c9a84c',
    bg: 'rgba(201,168,76,0.12)',
    border: 'rgba(201,168,76,0.3)',
    iconPath: 'M12 6v6l4 2', // saat
  },
  onaylandi: {
    label: 'Onaylandı',
    color: '#7bc49a',
    bg: 'rgba(123,196,154,0.12)',
    border: 'rgba(123,196,154,0.3)',
    iconPath: 'M20 6L9 17l-5-5', // check
  },
  iptal: {
    label: 'İptal Edildi',
    color: '#c87a7a',
    bg: 'rgba(200,122,122,0.12)',
    border: 'rgba(200,122,122,0.3)',
    iconPath: 'M18 6L6 18M6 6l12 12', // x
  },
};

// ── Hook: sipariş durumları (localStorage) ────────────────────────────────────
const useOrderStatuses = () => {
  const [statuses, setStatuses] = React.useState(() => {
    try {
      const saved = localStorage.getItem('zincir-order-statuses');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const setStatus = (orderId, status, by) => {
    const next = {
      ...statuses,
      [orderId]: {
        status,
        by, // 'donerci' | 'tedarikci'
        at: new Date().toISOString(),
      },
    };
    setStatuses(next);
    try { localStorage.setItem('zincir-order-statuses', JSON.stringify(next)); } catch {}
  };

  const getStatus = (orderId) => statuses[orderId]?.status || 'bekliyor';
  const getStatusMeta = (orderId) => statuses[orderId] || null;

  return { statuses, getStatus, getStatusMeta, setStatus };
};

// ── 2 saatlik düzenleme penceresi ─────────────────────────────────────────────
const canEditOrder = (order, status) => {
  if (status === 'onaylandi' || status === 'iptal') return false;
  try {
    const orderTime = parseTrDate(order.date);
    const now = getMockNow();
    const elapsed = now - orderTime;
    return elapsed >= 0 && elapsed < EDIT_WINDOW_MS;
  } catch { return false; }
};

const timeLeftToEdit = (order) => {
  try {
    const orderTime = parseTrDate(order.date);
    const now = getMockNow();
    const remaining = EDIT_WINDOW_MS - (now - orderTime);
    if (remaining <= 0) return null;
    const mins = Math.floor(remaining / 60000);
    if (mins < 60) return `${mins} dk kaldı`;
    const hrs = Math.floor(mins / 60);
    const m = mins % 60;
    return `${hrs}sa ${m}dk kaldı`;
  } catch { return null; }
};

// ── 3-durum badge bileşeni ────────────────────────────────────────────────────
const StatusBadge = ({ status, size = 'md' }) => {
  const meta = STATUS_META[status] || STATUS_META.bekliyor;
  const isSm = size === 'sm';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: isSm ? '2px 8px' : '4px 11px',
      borderRadius: 20,
      background: meta.bg,
      border: `1px solid ${meta.border}`,
      color: meta.color,
      fontSize: isSm ? 10 : 11,
      fontWeight: 600,
      fontFamily: 'DM Sans, sans-serif',
      letterSpacing: '0.02em',
      whiteSpace: 'nowrap',
    }}>
      <svg width={isSm ? 10 : 12} height={isSm ? 10 : 12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {status === 'bekliyor' && <><circle cx="12" cy="12" r="9"/><path d={meta.iconPath}/></>}
        {status === 'onaylandi' && <path d={meta.iconPath}/>}
        {status === 'iptal' && <path d={meta.iconPath}/>}
      </svg>
      {meta.label}
    </span>
  );
};

// ── Mail simülasyonu ──────────────────────────────────────────────────────────
const simulateMail = (showToast, { to, subject }) => {
  if (typeof showToast === 'function') {
    showToast(`📧 ${to} adresine bilgilendirme e-postası gönderildi`, 'success');
  }
};

// ── Onay/iptal panel: tedarikçi için sipariş aksiyon barı ─────────────────────
const SupplierOrderActions = ({ order, status, statusMeta, onApprove, onCancel }) => {
  const meta = STATUS_META[status] || STATUS_META.bekliyor;
  const locked = status === 'onaylandi' || status === 'iptal';

  return (
    <div style={{
      marginTop: 14,
      background: locked ? meta.bg : 'var(--surface)',
      border: `1px solid ${locked ? meta.border : 'var(--border)'}`,
      borderRadius: 10,
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 14, flexWrap: 'wrap',
    }}>
      {/* Sol: durum bilgisi */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <StatusBadge status={status} />
        {statusMeta && (
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {statusMeta.by === 'tedarikci' ? 'Tedarikçi tarafından' : 'Dönerci tarafından'}
            {' · '}
            {new Date(statusMeta.at).toLocaleString('tr-TR', {
              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
          </span>
        )}
        {!locked && (
          <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>
            Müşteri henüz onay bekliyor
          </span>
        )}
      </div>

      {/* Sağ: aksiyonlar */}
      {!locked && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onCancel} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: 'transparent', border: '1px solid rgba(200,122,122,0.4)',
            color: '#c87a7a', fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,122,122,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            İptal Et
          </button>
          <button onClick={onApprove} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            background: '#7bc49a', border: 'none',
            color: '#0a1410', fontSize: 12, fontFamily: 'DM Sans', fontWeight: 700,
            cursor: 'pointer', transition: 'opacity 0.15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.9'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Siparişi Onayla
          </button>
        </div>
      )}
    </div>
  );
};

// ── Dönerci için kilit/edit-window banner'ı ───────────────────────────────────
const DonerciOrderLockBanner = ({ order, status, statusMeta, onCancel, showToast }) => {
  const locked = status === 'onaylandi' || status === 'iptal';
  const canEdit = canEditOrder(order, status);
  const timeLeft = canEdit ? timeLeftToEdit(order) : null;

  if (locked) {
    const meta = STATUS_META[status];
    return (
      <div style={{
        marginTop: 14, padding: '12px 14px', borderRadius: 10,
        background: meta.bg, border: `1px solid ${meta.border}`,
        display: 'flex', alignItems: 'center', gap: 10, fontSize: 12,
      }}>
        <StatusBadge status={status} size="sm" />
        <span style={{ color: 'var(--text)', flex: 1 }}>
          {status === 'onaylandi'
            ? 'Tedarikçi siparişinizi onayladı — artık değiştiremezsiniz.'
            : 'Bu sipariş iptal edildi — değişiklik yapamazsınız.'}
        </span>
      </div>
    );
  }

  if (canEdit) {
    return (
      <div style={{
        marginTop: 14, padding: '12px 14px', borderRadius: 10,
        background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-soft)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg>
          <span>Sipariş henüz onay bekliyor · <strong style={{ color: '#c9a84c' }}>{timeLeft}</strong> içinde iptal edebilirsiniz</span>
        </div>
        <button onClick={onCancel} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 7,
          background: 'transparent', border: '1px solid rgba(200,122,122,0.4)',
          color: '#c87a7a', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600,
          cursor: 'pointer',
        }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          Siparişi İptal Et
        </button>
      </div>
    );
  }

  // 2sa geçmiş, hâlâ bekliyor — düzenlenemez
  return (
    <div style={{
      marginTop: 14, padding: '12px 14px', borderRadius: 10,
      background: 'var(--surface2)', border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-soft)',
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span>2 saatlik iptal/düzenleme penceresi doldu · tedarikçi onayı bekleniyor</span>
    </div>
  );
};

Object.assign(window, {
  useOrderStatuses, canEditOrder, timeLeftToEdit, STATUS_META, EDIT_WINDOW_MS,
  StatusBadge, SupplierOrderActions, DonerciOrderLockBanner,
  simulateMail, getMockNow,
});
