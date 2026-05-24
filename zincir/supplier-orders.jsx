
// ═══ NEW SUPPLIER ORDERS SCREEN — Customer-grouped today list + detail page ══

// ── Extra mock orders to fill out timeline groups ─────────────────────────────
const EXTRA_ORDERS = [
  // BUGÜN (28 Nis 2025) — already covered: #1042, #1041, #1040
  // Add more today orders to make the list richer
  { id: '#S-1043', customer: 'Türk Döner', date: '28 Nis 2025 · 11:30',
    products: [{ name: 'Karışık Döner', qty: 6, unit: 'kg' }], note: '' },
  { id: '#S-1044', customer: 'İstanbul Lezzet', date: '28 Nis 2025 · 10:08',
    products: [{ name: 'Tavuk Döner Eti', qty: 10, unit: 'kg' }], note: '' },
  { id: '#S-1045', customer: 'Boğaz Döner', date: '28 Nis 2025 · 12:42',
    products: [{ name: 'Dana Döner Eti', qty: 14, unit: 'kg' }, { name: 'Sarımsaklı Sos', qty: 5, unit: 'lt' }], note: '' },

  // DAHA ÖNCE (genişletilmiş geçmiş)
  { id: '#S-1029', customer: 'Türk Döner', date: '25 Nis 2025 · 10:00',
    products: [{ name: 'Dana Döner Eti', qty: 12, unit: 'kg' }], note: '' },
  { id: '#S-1025', customer: 'Türk Döner', date: '24 Nis 2025 · 09:15',
    products: [{ name: 'Tavuk Döner Eti', qty: 8, unit: 'kg' }], note: '' },
  { id: '#S-1015', customer: 'Türk Döner', date: '20 Nis 2025 · 11:00',
    products: [{ name: 'Karışık Döner', qty: 15, unit: 'kg' }], note: '' },
  { id: '#S-1011', customer: 'Türk Döner', date: '18 Nis 2025 · 09:45',
    products: [{ name: 'Dana Döner Eti', qty: 10, unit: 'kg' }], note: '' },
  { id: '#S-1003', customer: 'Türk Döner', date: '12 Nis 2025 · 10:30',
    products: [{ name: 'Dana Döner Eti', qty: 14, unit: 'kg' }, { name: 'Acı Sos', qty: 3, unit: 'lt' }], note: '' },

  { id: '#S-1027', customer: 'Milano Kebap', date: '25 Nis 2025 · 09:55',
    products: [{ name: 'Tavuk Döner Eti', qty: 18, unit: 'kg' }], note: '' },
  { id: '#S-1018', customer: 'Milano Kebap', date: '21 Nis 2025 · 10:10',
    products: [{ name: 'Dana Döner Eti', qty: 22, unit: 'kg' }], note: '' },

  { id: '#S-1024', customer: 'Pamukkale Döner', date: '24 Nis 2025 · 08:30',
    products: [{ name: 'Karışık Döner', qty: 10, unit: 'kg' }], note: '' },
  { id: '#S-1014', customer: 'Pamukkale Döner', date: '19 Nis 2025 · 09:00',
    products: [{ name: 'Dana Döner Eti', qty: 8, unit: 'kg' }], note: '' },
];

// Statik mock listesi (geçmiş)
const MOCK_ORDERS = [...SUPPLIER_ORDERS, ...EXTRA_ORDERS];

// Dönerci panelinden gelen canlı siparişleri okur ve tedarikçi formatına çevirir
const readLiveOrders = () => {
  try {
    const saved = localStorage.getItem('zincir-orders');
    if (!saved) return [];
    const list = JSON.parse(saved);
    return list
      .filter(o => o.firmId === 'devran') // sadece bu tedarikçiye gelenler
      .map(o => ({
        id: o.id,
        customer: o.customer || o.firm || 'Bilinmeyen Müşteri',
        donerciFirmId: o.firmId,
        date: o.date,
        products: (o.items || []).map(it => ({
          name: it.name, qty: it.qty, unit: it.unit, price: it.price,
        })),
        note: o.note || '',
        _live: true,
      }));
  } catch { return []; }
};

// Hook: canlı siparişleri dinler (aynı sekme + diğer sekmeler)
const useAllOrders = () => {
  const [live, setLive] = React.useState(readLiveOrders);
  React.useEffect(() => {
    const refresh = () => setLive(readLiveOrders());
    window.addEventListener('zincir-orders-changed', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('zincir-orders-changed', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return [...live, ...MOCK_ORDERS];
};

// Yardımcı: müşterinin profil aramasını uyumlu kılmak için iki türü de eşle
const matchesCustomer = (order, name) => {
  if (!order || !name) return false;
  if (order.customer === name) return true;
  // "Türk Döner" / "Türk Döner Ltd." gibi varyasyonlar
  const a = order.customer.toLowerCase().replace(/\s+(ltd|a\.?ş\.?|s\.?r\.?l\.?)\.?$/i, '').trim();
  const b = name.toLowerCase().replace(/\s+(ltd|a\.?ş\.?|s\.?r\.?l\.?)\.?$/i, '').trim();
  return a === b;
};

// Geri-uyumluluk: bazı yerlerde ALL_ORDERS değişkeni okunuyor olabilir
const ALL_ORDERS = MOCK_ORDERS;

// ── Fiyatlar (KDV dahil, €/birim) ─────────────────────────────────────────────
const PRICE_MAP = {
  'Dana Döner Eti': 145,
  'Tavuk Döner Eti': 110,
  'Karışık Döner': 150,
  'Acı Sos': 45,
  'Sarımsaklı Sos': 40,
};
const priceFor = (name, override) => {
  if (typeof override === 'number' && !isNaN(override) && override > 0) return override;
  return PRICE_MAP[name] ?? 0;
};
const fmtTRY = (n) => '€ ' + Math.round(n).toLocaleString('tr-TR');

const lineTotal = (p) => priceFor(p.name, p.price) * p.qty;
const orderTotal = (o) => o.products.reduce((s, p) => s + lineTotal(p), 0);
const orderSubtotal = (o) => orderTotal(o) / 1.2;
const orderVat = (o) => orderTotal(o) - orderSubtotal(o);

// ── Bugünün tarihi (canlı + mock siparişlerden en yenisi) ─────────────────────
const getTodayBase = () => {
  const all = [...readLiveOrders(), ...MOCK_ORDERS];
  const sorted = all.sort((a, b) => parseTrDate(b.date) - parseTrDate(a.date));
  return sorted[0] ? parseTrDate(sorted[0].date) : new Date();
};
// Modül seviyesinde başlangıç değeri (geri uyumluluk için tutulur)
let TODAY_BASE = getTodayBase();
const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// ── Excel/CSV indir ────────────────────────────────────────────────────────────
const exportCustomerCsv = (customer, orders) => {
  const bom = '\uFEFF';
  const rows = [['Tarih', 'Sipariş No', 'Ürün', 'Miktar', 'Birim Fiyat (KDV hariç)', 'KDV', 'Toplam']];
  orders.forEach(o => {
    o.products.forEach((p, i) => {
      const price = priceFor(p.name);
      const lineKDVDahil = price * p.qty;
      const lineKDVHaric = lineKDVDahil / 1.2;
      const lineKDV = lineKDVDahil - lineKDVHaric;
      rows.push([
        i === 0 ? o.date : '',
        i === 0 ? o.id : '',
        p.name, p.qty + ' ' + p.unit,
        (price / 1.2).toFixed(2).replace('.', ','),
        lineKDV.toFixed(2).replace('.', ','),
        lineKDVDahil.toFixed(2).replace('.', ','),
      ]);
    });
  });
  const csv = bom + rows.map(r => r.map(c => {
    const s = String(c);
    return s.includes(';') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(';')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${customer.toLowerCase().replace(/\s+/g, '-')}-siparisler.csv`;
  document.body.appendChild(link); link.click(); document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ── Yazdırılabilir müşteri raporu (PDF) ───────────────────────────────────────
const printCustomerReport = (customer, orders, supplier) => {
  const w = window.open('', '_blank', 'width=900,height=1100');
  if (!w) { alert('Lütfen pop-up engelleyiciyi devre dışı bırakın'); return; }
  const supName = supplier?.company || 'Devran Döner';
  const supAddr = supplier?.address || 'Milano, IT';
  const supVat = supplier?.vat || '—';
  const supLogo = supplier?.logo || '';
  const rowsHtml = orders.map(o => `
    <tr style="background:#f8f6f0;font-weight:600">
      <td colspan="6" style="padding:8px 10px;border-top:1px solid #999;color:#333">
        ${o.date} &nbsp; · &nbsp; <span style="font-family:monospace">${o.id}</span>
      </td>
    </tr>
    ${o.products.map(p => `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #eee">${p.name}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right">${p.qty}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee">${p.unit}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right">€ ${(priceFor(p.name)/1.2).toFixed(2)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right">€ ${(priceFor(p.name)*p.qty*0.2/1.2).toFixed(2)}</td>
        <td style="padding:8px 10px;border-bottom:1px solid #eee;text-align:right;font-weight:600">€ ${(priceFor(p.name)*p.qty).toFixed(2)}</td>
      </tr>
    `).join('')}
  `).join('');
  const grandTotal = orders.reduce((s, o) => s + orderTotal(o), 0);
  const grandSubtotal = grandTotal / 1.2;
  const grandVat = grandTotal - grandSubtotal;

  w.document.write(`<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8">
    <title>${customer} — Sipariş Raporu</title>
    <style>
      body { font-family: -apple-system, system-ui, sans-serif; color: #1a1a1a; padding: 28mm 18mm; max-width: 210mm; margin: 0 auto; }
      h1 { font-size: 22px; margin: 0 0 4px; letter-spacing: 0.04em; }
      .meta { font-size: 11px; color: #555; margin-bottom: 24px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; }
      thead th { background: #1a1a1a; color: #fff; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; }
      thead th.r { text-align: right; }
      .totals { display: flex; justify-content: flex-end; gap: 40px; padding-top: 16px; border-top: 2px solid #1a1a1a; font-size: 12px; }
      .totals strong { font-size: 18px; }
      @media print { body { padding: 18mm; } }
    </style></head><body>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;border-bottom:2px solid #1a1a1a;padding-bottom:14px">
      <div style="display:flex;align-items:center;gap:14px">
        ${supLogo ? `<img src="${supLogo}" alt="" style="width:56px;height:56px;border-radius:10px;object-fit:cover;border:1px solid #ddd;background:#fff" />` : ''}
        <div>
          <h1 style="text-transform:uppercase">${supName}</h1>
          <div class="meta">${supAddr} · VAT: ${supVat}</div>
        </div>
      </div>
      <div style="text-align:right">
        <div style="font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#888">Müşteri Raporu</div>
        <div style="font-size:18px;font-weight:600;margin-top:4px">${customer}</div>
        <div class="meta">${orders.length} sipariş · ${new Date().toLocaleDateString('tr-TR')}</div>
      </div>
    </div>
    <table>
      <thead><tr>
        <th>Ürün</th><th class="r">Miktar</th><th>Birim</th>
        <th class="r">Birim Fiyat (KDV hariç)</th><th class="r">KDV</th><th class="r">Toplam</th>
      </tr></thead>
      <tbody>${rowsHtml}</tbody>
    </table>
    <div class="totals">
      <div style="text-align:right;color:#555">
        <div>Ara Toplam: € ${grandSubtotal.toFixed(2)}</div>
        <div>KDV (%20): € ${grandVat.toFixed(2)}</div>
        <div style="margin-top:8px;color:#1a1a1a"><strong>TOPLAM: € ${grandTotal.toFixed(2)}</strong></div>
      </div>
    </div>
    <script>window.onload = () => setTimeout(() => window.print(), 300);</script>
  </body></html>`);
  w.document.close();
};

// ── Sekreter cevabı bloğu (kilitlenebilir) ────────────────────────────────────
const SecretaryReplyBlock = ({ order, replies, setReply }) => {
  const existing = replies[order.id];
  const [draft, setDraft] = React.useState('');
  const [showInput, setShowInput] = React.useState(false);

  if (!order.note && !existing) return null;

  const hasReply = !!existing;
  const handleSend = () => {
    if (!draft.trim()) return;
    setReply(order.id, draft.trim());
    setDraft('');
    setShowInput(false);
  };

  return (
    <div style={{
      marginTop: 14, background: 'var(--surface)',
      border: '1px solid var(--border)', borderRadius: 10,
      overflow: 'hidden',
    }}>
      {/* Müşteri notu */}
      {order.note && (
        <div style={{ padding: '12px 16px', borderBottom: hasReply || showInput ? '1px solid var(--border)' : 'none' }}>
          <div style={{
            fontSize: 9, color: 'var(--muted)', letterSpacing: '0.14em',
            textTransform: 'uppercase', fontWeight: 600, marginBottom: 6,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Icon name="phone" size={10} color="currentColor" />
            Müşteri Notu
          </div>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{order.note}"
          </div>
        </div>
      )}

      {/* Mevcut cevap */}
      {hasReply && (
        <div style={{
          padding: '12px 16px',
          background: 'var(--blue-dim)',
          borderLeft: '3px solid var(--blue)',
        }}>
          <div style={{
            fontSize: 9, color: 'var(--blue-light)', letterSpacing: '0.14em',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 6,
            display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between',
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Icon name="check" size={10} color="currentColor" />
              Sekreter Cevabı
            </span>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 9, color: 'var(--muted)', letterSpacing: '0.06em',
              fontWeight: 500, textTransform: 'none',
            }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              kilitli
            </span>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>
            {existing.text}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 6 }}>
            {new Date(existing.sentAt).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      )}

      {/* Cevap yazma (sadece müşteri notu varsa) */}
      {order.note && !hasReply && !showInput && (
        <div style={{ padding: '10px 16px' }}>
          <button onClick={() => setShowInput(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: 'none', color: 'var(--blue-light)',
            cursor: 'pointer', fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500,
            padding: 0,
          }}>
            <Icon name="plus" size={12} color="currentColor" />
            Sekreter olarak cevap yaz
          </button>
        </div>
      )}

      {/* Cevap inputu */}
      {showInput && !hasReply && (
        <div style={{ padding: '12px 16px' }}>
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="ör. Anlaşıldı, 09:00'a kadar hazır olacak."
            rows={2}
            autoFocus
            style={{
              width: '100%', padding: '10px 12px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 9, color: 'var(--text)', fontSize: 13,
              fontFamily: 'DM Sans', resize: 'vertical', minHeight: 56,
              outline: 'none', lineHeight: 1.5,
            }}
            onFocus={e => e.target.style.borderColor = 'var(--blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Gönderildikten sonra düzenlenemez
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { setShowInput(false); setDraft(''); }} style={{
                padding: '6px 12px', borderRadius: 7, background: 'transparent',
                border: '1px solid var(--border)', color: 'var(--text-soft)',
                fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer',
              }}>İptal</button>
              <button onClick={handleSend} disabled={!draft.trim()} style={{
                padding: '6px 14px', borderRadius: 7,
                background: draft.trim() ? 'var(--blue)' : 'var(--surface2)',
                border: 'none', color: draft.trim() ? '#fff' : 'var(--muted)',
                fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600,
                cursor: draft.trim() ? 'pointer' : 'not-allowed',
              }}>Cevabı Gönder</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Müşteri Detay Sayfası ─────────────────────────────────────────────────────
const CustomerDetailView = ({ customer, orders, supplier, onBack, showToast, todayBase }) => {
  const [expandedOrderId, setExpandedOrderId] = React.useState(null);
  const [replies, setReply] = useSecretaryReplies();
  const { getStatus, getStatusMeta, setStatus } = useOrderStatuses();
  const TODAY = todayBase || TODAY_BASE;
  const customerMeta = CUSTOMERS_DATA.find(c => c.name === customer) || {};
  const phone = customerMeta.contact || '';
  const address = customerMeta.address || '—';

  // Group orders by time window
  const groups = { bugun: [], dun: [], buHafta: [], gecenHafta: [], dahaOnce: [] };
  orders.forEach(o => {
    const d = parseTrDate(o.date);
    const diffDays = Math.floor((TODAY - d) / (1000 * 60 * 60 * 24));
    if (isSameDay(d, TODAY)) groups.bugun.push(o);
    else if (diffDays === 1) groups.dun.push(o);
    else if (diffDays <= 7) groups.buHafta.push(o);
    else if (diffDays <= 14) groups.gecenHafta.push(o);
    else groups.dahaOnce.push(o);
  });

  const sectionTitles = [
    ['bugun',       `BUGÜN (${TODAY.getDate()} ${TR_MONTHS[TODAY.getMonth()]} ${TODAY.getFullYear()})`],
    ['dun',         'DÜN'],
    ['buHafta',     'BU HAFTA'],
    ['gecenHafta',  'GEÇEN HAFTA'],
    ['dahaOnce',    'DAHA ÖNCE'],
  ];

  // WhatsApp link
  const waNumber = phone.replace(/\D/g, '');
  const waMsg = encodeURIComponent(`Merhaba ${customer}, ${supplier?.company || 'Devran Döner'} olarak siparişiniz hakkında bilgi vermek istiyoruz.`);
  const waLink = waNumber ? `https://wa.me/${waNumber}?text=${waMsg}` : '#';

  const actionBtn = (label, icon, onClick, color = 'var(--blue-light)') => (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '9px 14px', borderRadius: 10,
      background: 'var(--surface)', border: '1px solid var(--border)',
      color, fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600,
      cursor: 'pointer', transition: 'all 0.15s ease',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <span style={{ fontSize: 14 }}>{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="fade-in">
      {/* Geri */}
      <button onClick={onBack} style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'transparent', border: 'none', cursor: 'pointer',
        color: 'var(--text-soft)', fontSize: 12, fontFamily: 'DM Sans',
        padding: '4px 0', marginBottom: 18,
      }}>
        <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
          <Icon name="chevron" size={12} color="currentColor" />
        </span>
        Gelen Siparişler
      </button>

      {/* Müşteri başlığı + eylemler */}
      <div className="fade-up" style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '22px 24px', marginBottom: 22,
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 18,
      }}>
        <Avatar name={customer} size={56} active />
        <div style={{ flex: 1, minWidth: 220 }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>
            {customer}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 12, color: 'var(--text-soft)' }}>
            {phone && (
              <a href={`tel:${phone.replace(/\s/g,'')}`} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5, color: 'var(--blue-light)',
                textDecoration: 'none', padding: '4px 10px', borderRadius: 7,
                background: 'var(--blue-dim)', border: '1px solid rgba(91,143,168,0.25)',
              }}>
                <Icon name="phone" size={11} color="currentColor" />
                {phone} <span style={{ color: 'var(--text-soft)', marginLeft: 4 }}>Ara</span>
              </a>
            )}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Icon name="home" size={11} color="currentColor" />
              {address}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {actionBtn('PDF İndir', '📄', () => printCustomerReport(customer, orders, supplier))}
          {actionBtn('Excel\'e Aktar', '📊', () => exportCustomerCsv(customer, orders), '#7bc49a')}
          {actionBtn('Yazdır', '🖨', () => printCustomerReport(customer, orders, supplier))}
          {waNumber && (
            <a href={waLink} target="_blank" rel="noopener" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 14px', borderRadius: 10,
              background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)',
              color: '#25d366', fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.15s ease',
            }}>
              <span style={{ fontSize: 14 }}>💬</span>
              Geri Bildirim
            </a>
          )}
        </div>
      </div>

      {/* Zaman çizelgesi */}
      {sectionTitles.map(([key, title]) => {
        const list = groups[key];
        if (!list.length) return null;
        return (
          <div key={key} style={{ marginBottom: 22 }}>
            <div style={{
              fontFamily: 'DM Sans, sans-serif', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.16em', color: 'var(--muted)', textTransform: 'uppercase',
              marginBottom: 10, paddingLeft: 4,
            }}>
              {title}
            </div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {list.sort((a, b) => parseTrDate(b.date) - parseTrDate(a.date)).map((o, i) => {
                const isExpanded = expandedOrderId === o.id;
                const total = orderTotal(o);
                const sub = orderSubtotal(o);
                const vat = orderVat(o);
                const summary = `${o.products[0].qty} ${o.products[0].unit} ${o.products[0].name}${o.products.length > 1 ? `, +${o.products.length - 1}` : ''}`;
                const isToday = isSameDay(parseTrDate(o.date), TODAY);
                const timeOrDate = isToday
                  ? o.date.split('·')[1]?.trim()
                  : o.date.split('·')[0]?.trim();
                const orderStatus = getStatus(o.id);
                const orderStatusMeta = getStatusMeta(o.id);
                return (
                  <div key={o.id} style={{
                    borderBottom: i < list.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <div style={{
                      display: 'grid', gridTemplateColumns: '95px 78px 1fr 120px 100px 88px',
                      alignItems: 'center', gap: 10,
                      padding: '13px 18px',
                      transition: 'background 0.15s ease',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{o.id}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>{timeOrDate}</span>
                      <span style={{ fontSize: 12, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {summary}
                      </span>
                      <StatusBadge status={orderStatus} size="sm" />
                      <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600, fontFamily: 'Syne, sans-serif' }}>
                        {fmtTRY(total)}
                      </span>
                      <button onClick={() => setExpandedOrderId(isExpanded ? null : o.id)} style={{
                        padding: '6px 12px', borderRadius: 8,
                        background: isExpanded ? 'var(--blue)' : 'var(--blue-dim)',
                        border: '1px solid rgba(91,143,168,0.25)',
                        color: isExpanded ? '#fff' : 'var(--blue-light)',
                        fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}>
                        {isExpanded ? 'Kapat' : 'Detay'}
                      </button>
                    </div>

                    {isExpanded && (
                      <div style={{
                        background: 'var(--bg)', padding: '16px 22px 20px',
                        borderTop: '1px solid var(--border)',
                      }}>
                        <div style={{
                          display: 'grid', gridTemplateColumns: '1fr 80px 60px 130px 130px',
                          padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 10,
                          color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
                        }}>
                          <span>Ürün</span>
                          <span style={{ textAlign: 'right' }}>Miktar</span>
                          <span>Birim</span>
                          <span style={{ textAlign: 'right' }}>Birim Fiyat (KDV dh.)</span>
                          <span style={{ textAlign: 'right' }}>Satır Toplamı</span>
                        </div>
                        {o.products.map((p, pi) => (
                          <div key={pi} style={{
                            display: 'grid', gridTemplateColumns: '1fr 80px 60px 130px 130px',
                            padding: '10px 0', borderBottom: '1px solid var(--border)',
                            alignItems: 'center', fontSize: 12,
                          }}>
                            <span style={{ color: 'var(--text)' }}>{p.name}</span>
                            <span style={{ textAlign: 'right', color: 'var(--text-soft)' }}>{p.qty}</span>
                            <span style={{ color: 'var(--text-soft)' }}>{p.unit}</span>
                            <span style={{ textAlign: 'right', color: 'var(--text-soft)' }}>{fmtTRY(priceFor(p.name))}</span>
                            <span style={{ textAlign: 'right', color: 'var(--text)', fontWeight: 600 }}>
                              {fmtTRY(lineTotal(p))}
                            </span>
                          </div>
                        ))}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: 12, gap: 32 }}>
                          <div style={{ textAlign: 'right', fontSize: 12 }}>
                            <div style={{ color: 'var(--text-soft)', marginBottom: 4 }}>Ara Toplam: <span style={{ color: 'var(--text)', marginLeft: 8 }}>{fmtTRY(sub)}</span></div>
                            <div style={{ color: 'var(--text-soft)', marginBottom: 8 }}>KDV (%20): <span style={{ color: 'var(--text)', marginLeft: 8 }}>{fmtTRY(vat)}</span></div>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--blue-light)' }}>
                              TOPLAM: {fmtTRY(total)}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
                          <button onClick={() => printCustomerReport(`${customer} — ${o.id}`, [o], supplier)} style={{
                            padding: '7px 12px', borderRadius: 8, background: 'var(--surface)',
                            border: '1px solid var(--border)', color: 'var(--blue-light)',
                            fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer',
                          }}>📄 PDF</button>
                          <button onClick={() => exportCustomerCsv(`${customer}-${o.id}`, [o])} style={{
                            padding: '7px 12px', borderRadius: 8, background: 'var(--surface)',
                            border: '1px solid var(--border)', color: '#7bc49a',
                            fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer',
                          }}>📊 Excel</button>
                          <button onClick={() => printCustomerReport(`${customer} — ${o.id}`, [o], supplier)} style={{
                            padding: '7px 12px', borderRadius: 8, background: 'var(--surface)',
                            border: '1px solid var(--border)', color: 'var(--text-soft)',
                            fontSize: 11, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer',
                          }}>🖨 Yazdır</button>
                        </div>

                        {/* Müşteri notu + sekreter cevabı */}
                        <SecretaryReplyBlock order={o} replies={replies} setReply={setReply} />

                        {/* Tedarikçi onay/iptal aksiyonları */}
                        <SupplierOrderActions
                          order={o}
                          status={orderStatus}
                          statusMeta={orderStatusMeta}
                          onApprove={() => {
                            setStatus(o.id, 'onaylandi', 'tedarikci');
                            simulateMail(showToast, { to: customer, subject: `Sipariş ${o.id} onaylandı` });
                          }}
                          onCancel={() => {
                            if (!window.confirm(`${o.id} numaralı siparişi iptal etmek istediğinize emin misiniz?`)) return;
                            setStatus(o.id, 'iptal', 'tedarikci');
                            simulateMail(showToast, { to: customer, subject: `Sipariş ${o.id} iptal edildi` });
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ═══ ANA EKRAN — Bugün sipariş veren müşteriler ═══════════════════════════════
const SupplierOrdersScreenNew = ({ supplier, showToast }) => {
  const allOrdersLive = useAllOrders();
  const todayBase = React.useMemo(() => {
    const sorted = [...allOrdersLive].sort((a, b) => parseTrDate(b.date) - parseTrDate(a.date));
    return sorted[0] ? parseTrDate(sorted[0].date) : new Date();
  }, [allOrdersLive]);

  const [selectedCustomer, setSelectedCustomer] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [viewed, setViewed] = React.useState(() => {
    try {
      const saved = localStorage.getItem('zincir-viewed-customers-' + todayBase.toDateString());
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const markViewed = (customerName) => {
    const next = new Set(viewed);
    next.add(customerName);
    setViewed(next);
    try { localStorage.setItem('zincir-viewed-customers-' + todayBase.toDateString(), JSON.stringify([...next])); } catch {}
  };

  // Bugünkü siparişleri müşteri başına grupla
  const todayOrders = allOrdersLive.filter(o => isSameDay(parseTrDate(o.date), todayBase));
  const grouped = {};
  todayOrders.forEach(o => {
    if (!grouped[o.customer]) grouped[o.customer] = { customer: o.customer, orders: [], total: 0, hasLive: false };
    grouped[o.customer].orders.push(o);
    grouped[o.customer].total += orderTotal(o);
    if (o._live) grouped[o.customer].hasLive = true;
  });
  const customerList = Object.values(grouped)
    .filter(c => c.customer.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.total - a.total);

  if (selectedCustomer) {
    const customerOrders = allOrdersLive
      .filter(o => o.customer === selectedCustomer)
      .sort((a, b) => parseTrDate(b.date) - parseTrDate(a.date));
    return (
      <CustomerDetailView
        customer={selectedCustomer}
        orders={customerOrders}
        supplier={supplier}
        onBack={() => setSelectedCustomer(null)}
        showToast={showToast}
        todayBase={todayBase}
      />
    );
  }
  return (
    <div className="fade-in">
      {/* Başlık */}
      <div className="fade-up" style={{ marginBottom: 22 }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          Gelen Siparişler
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>
          Bugün sipariş veren müşterileri görüntüleyin
        </p>
      </div>

      {/* Arama */}
      <div style={{ position: 'relative', marginBottom: 18, maxWidth: 380 }}>
        <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <Icon name="search" size={14} color="var(--muted)" />
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Müşteri ara…"
          style={{
            width: '100%', padding: '11px 14px 11px 38px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 11, color: 'var(--text)', fontSize: 13,
            fontFamily: 'DM Sans', outline: 'none', transition: 'border 0.18s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--blue)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
      </div>

      {/* Boş durum */}
      {customerList.length === 0 && (
        <div style={{
          background: 'var(--surface)', border: '1px dashed var(--border)',
          borderRadius: 14, padding: '50px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, color: 'var(--text)', marginBottom: 6 }}>
            Bugün henüz sipariş gelmedi
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>
            Yeni siparişler geldiğinde burada görünecek.
          </div>
        </div>
      )}

      {/* Müşteri listesi */}
      {customerList.length > 0 && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, overflow: 'hidden',
        }}>
          {customerList.map((c, i) => {
            const isNew = !viewed.has(c.customer);
            return (
            <button
              key={c.customer}
              onClick={() => { markViewed(c.customer); setSelectedCustomer(c.customer); }}
              style={{
                width: '100%', display: 'grid', gridTemplateColumns: '52px 1fr auto auto auto',
                gap: 16, alignItems: 'center', padding: '16px 20px',
                background: 'transparent', border: 'none',
                borderBottom: i < customerList.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <Avatar name={c.customer} size={44} />
              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>
                    {c.customer}
                  </span>
                  {isNew && (
                    <span style={{
                      background: 'var(--blue)', color: '#fff',
                      borderRadius: 10, padding: '1px 7px',
                      fontSize: 9, fontWeight: 700, fontFamily: 'DM Sans',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>Yeni</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>
                  Bugünkü siparişler
                </div>
              </div>
              <div style={{ textAlign: 'right', minWidth: 90 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {c.orders.length}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>sipariş bugün</div>
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--blue-light)', minWidth: 90, textAlign: 'right' }}>
                {fmtTRY(c.total)}
              </div>
              <div style={{ color: 'var(--muted)', display: 'flex', alignItems: 'center' }}>
                <Icon name="chevron" size={16} color="currentColor" />
              </div>
            </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Overwrite the placeholder
window.SupplierOrdersScreen = SupplierOrdersScreenNew;

Object.assign(window, {
  ALL_ORDERS, TODAY_BASE, isSameDay, parseTrDate, TR_MONTHS,
  orderTotal, orderSubtotal, orderVat, priceFor, fmtTRY, PRICE_MAP,
  printCustomerReport, exportCustomerCsv,
});
