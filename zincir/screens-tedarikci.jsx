
// ─── INCOMING ORDERS ─────────────────────────────────────────────────────────
const SUPPLIER_ORDERS = [
  {
    id: '#S-1042', customer: 'Türk Döner', date: '28 Nis 2025 · 09:14',
    products: [
      { name: 'Dana Döner Eti', qty: 15, unit: 'kg' },
      { name: 'Acı Sos', qty: 6, unit: 'lt' },
      { name: 'Sarımsaklı Sos', qty: 3, unit: 'lt' },
    ],
    note: 'Teslimat 09:00 olsun lütfen',
  },
  {
    id: '#S-1041', customer: 'Milano Kebap', date: '28 Nis 2025 · 08:42',
    products: [
      { name: 'Tavuk Döner Eti', qty: 20, unit: 'kg' },
      { name: 'Karışık Döner', qty: 10, unit: 'kg' },
    ],
    note: '',
  },
  {
    id: '#S-1040', customer: 'Pamukkale Döner', date: '28 Nis 2025 · 08:05',
    products: [
      { name: 'Dana Döner Eti', qty: 8, unit: 'kg' },
      { name: 'Karışık Döner', qty: 5, unit: 'kg' },
    ],
    note: 'Sabah erken hazır olsun',
  },
  {
    id: '#S-1039', customer: 'İstanbul Lezzet', date: '27 Nis 2025 · 16:30',
    products: [
      { name: 'Karışık Döner', qty: 12, unit: 'kg' },
    ],
    note: '',
  },
  {
    id: '#S-1038', customer: 'Boğaz Döner', date: '27 Nis 2025 · 14:18',
    products: [
      { name: 'Dana Döner Eti', qty: 10, unit: 'kg' },
      { name: 'Tavuk Döner Eti', qty: 8, unit: 'kg' },
      { name: 'Acı Sos', qty: 4, unit: 'lt' },
    ],
    note: '',
  },
  {
    id: '#S-1037', customer: 'Karadeniz Et', date: '27 Nis 2025 · 11:02',
    products: [
      { name: 'Dana Döner Eti', qty: 25, unit: 'kg' },
    ],
    note: '',
  },
  {
    id: '#S-1036', customer: 'Ankara Döner', date: '26 Nis 2025 · 17:45',
    products: [
      { name: 'Tavuk Döner Eti', qty: 12, unit: 'kg' },
      { name: 'Sarımsaklı Sos', qty: 4, unit: 'lt' },
    ],
    note: '',
  },
  {
    id: '#S-1035', customer: 'Türk Döner', date: '24 Nis 2025 · 09:30',
    products: [
      { name: 'Dana Döner Eti', qty: 12, unit: 'kg' },
      { name: 'Tavuk Döner Eti', qty: 8, unit: 'kg' },
      { name: 'Sarımsaklı Sos', qty: 3, unit: 'lt' },
    ],
    note: '',
  },
  {
    id: '#S-1034', customer: 'Türk Döner', date: '20 Nis 2025 · 08:50',
    products: [
      { name: 'Dana Döner Eti', qty: 18, unit: 'kg' },
      { name: 'Acı Sos', qty: 5, unit: 'lt' },
    ],
    note: '',
  },
  {
    id: '#S-1033', customer: 'Milano Kebap', date: '23 Nis 2025 · 09:10',
    products: [
      { name: 'Tavuk Döner Eti', qty: 15, unit: 'kg' },
    ],
    note: '',
  },
];

const CUSTOMERS_DATA = [
  { name: 'Türk Döner',       firstOrder: '12 Şub 2024', contact: '+39 02 1234567', address: 'Via Roma 12, Milano' },
  { name: 'Milano Kebap',     firstOrder: '04 Mar 2024', contact: '+39 02 9876543', address: 'Corso Buenos Aires 45, Milano' },
  { name: 'Pamukkale Döner',  firstOrder: '21 Mar 2024', contact: '+39 02 4567890', address: 'Via Padova 88, Milano' },
  { name: 'İstanbul Lezzet',  firstOrder: '08 Nis 2024', contact: '+39 02 3456789', address: 'Viale Monza 14, Milano' },
  { name: 'Boğaz Döner',      firstOrder: '17 Nis 2024', contact: '+39 02 7654321', address: 'Via Lecco 5, Milano' },
  { name: 'Karadeniz Et',     firstOrder: '02 May 2024', contact: '+39 02 5678901', address: 'Via Tortona 22, Milano' },
  { name: 'Ankara Döner',     firstOrder: '19 May 2024', contact: '+39 02 6789012', address: 'Via Solari 71, Milano' },
  { name: 'Marmara Lezzet',   firstOrder: '07 Haz 2024', contact: '+39 02 8901234', address: 'Via Savona 33, Milano' },
];

// ═══ A4 PRINTABLE INVOICE / ORDER SHEET ═══════════════════════════════════════
const PrintableOrder = ({ order, supplier, onClose }) => {
  const sup = supplier || {};
  const supplierName = (sup.company || 'Devran Döner').toUpperCase();
  const supplierAddress = sup.address || 'Milano, IT';
  const supplierVat = sup.vat || '—';
  const supplierEmail = sup.email || '—';
  const supplierPhone = sup.phone || '—';

  React.useEffect(() => {
    document.body.classList.add('printing-mode');
    return () => document.body.classList.remove('printing-mode');
  }, []);

  const handlePrint = () => window.print();

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)', zIndex: 500,
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      overflowY: 'auto', padding: '20px 0',
    }}>
      {/* Print-only stylesheet */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          .printable-sheet, .printable-sheet * { visibility: visible !important; }
          .printable-sheet {
            position: absolute !important;
            left: 0 !important; top: 0 !important;
            width: 210mm !important; min-height: 297mm !important;
            margin: 0 !important; padding: 18mm !important;
            box-shadow: none !important; background: #fff !important;
            color: #1a1a1a !important;
          }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>

      {/* Toolbar */}
      <div className="no-print" style={{
        display: 'flex', gap: 10, marginBottom: 16, marginTop: 8,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '8px 10px',
      }}>
        <Btn variant="secondary" icon="x" onClick={onClose}>Kapat</Btn>
        <Btn icon="check" onClick={handlePrint}>Yazdır / PDF Olarak Kaydet</Btn>
      </div>

      {/* A4 sheet */}
      <div className="printable-sheet" style={{
        width: '210mm', minHeight: '297mm',
        background: '#fff', color: '#1a1a1a',
        padding: '18mm', boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 30, borderBottom: '2px solid #1a1a1a', paddingBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {sup.logo && (
              <img src={sup.logo} alt="" style={{
                width: 64, height: 64, borderRadius: 10,
                objectFit: 'cover', border: '1px solid #ddd', background: '#fff',
              }} />
            )}
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.04em' }}>
                {supplierName}
              </div>
              <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
                Et Ürünleri & Tedarik · {supplierAddress}
              </div>
              <div style={{ fontSize: 10, color: '#777', marginTop: 2 }}>
                VAT: {supplierVat} · {supplierEmail} · {supplierPhone}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
              Sipariş Föyü
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 600, color: '#1a1a1a' }}>
              {order.id}
            </div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>{order.date}</div>
          </div>
        </div>

        {/* Customer block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 9, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Müşteri</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{order.customer}</div>
            <div style={{ fontSize: 11, color: '#555' }}>{order.address || '—'}</div>
            {order.contact && <div style={{ fontSize: 11, color: '#555' }}>{order.contact}</div>}
          </div>
          <div>
            <div style={{ fontSize: 9, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Sipariş Bilgisi</div>
            <div style={{ fontSize: 11, color: '#555', lineHeight: 1.7 }}>
              <div><strong>Sipariş No:</strong> {order.id}</div>
              <div><strong>Tarih:</strong> {order.date}</div>
              <div><strong>Toplam Kalem:</strong> {order.products.length}</div>
            </div>
          </div>
        </div>

        {/* Products table */}
        <div style={{ marginBottom: 30 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ background: '#f4f1ec', color: '#1a1a1a' }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a', width: 50 }}>#</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a' }}>Ürün</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a', width: 110 }}>Miktar</th>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', borderBottom: '1px solid #1a1a1a', width: 70 }}>Birim</th>
              </tr>
            </thead>
            <tbody>
              {order.products.map((p, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #e6e1d8' }}>
                  <td style={{ padding: '12px', color: '#888' }}>{i + 1}</td>
                  <td style={{ padding: '12px', color: '#1a1a1a', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '12px', color: '#1a1a1a', textAlign: 'right', fontWeight: 600 }}>{p.qty}</td>
                  <td style={{ padding: '12px', color: '#555' }}>{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Note */}
        {order.note && (
          <div style={{ background: '#faf6ee', border: '1px solid #e6dfc9', borderRadius: 6, padding: '12px 16px', marginBottom: 30 }}>
            <div style={{ fontSize: 9, color: '#888', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 4 }}>Müşteri Notu</div>
            <div style={{ fontSize: 12, color: '#1a1a1a', lineHeight: 1.5 }}>{order.note}</div>
          </div>
        )}

        {/* Signature block */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, marginTop: 60 }}>
          <div>
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 6, fontSize: 10, color: '#555' }}>
              Hazırlayan İmza
            </div>
          </div>
          <div>
            <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: 6, fontSize: 10, color: '#555' }}>
              Teslim Alan İmza
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'absolute', bottom: '12mm', left: '18mm', right: '18mm', textAlign: 'center', fontSize: 9, color: '#999', borderTop: '1px solid #e6e1d8', paddingTop: 8 }}>
          ZİNCİR · {sup.company || 'Devran Döner'} · Tedarik Yönetim Sistemi · {new Date().toLocaleDateString('tr-TR')}
        </div>
      </div>
    </div>
  );
};

// ═══ DATE HELPERS ════════════════════════════════════════════════════════════
const TR_MONTHS = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
const parseTrDate = (str) => {
  if (!str) return new Date(0);
  const [datePart, timePart] = String(str).split('·').map(s => s.trim());
  const parts = datePart.split(' ');
  if (parts.length < 3) return new Date(0);
  const [day, monName, year] = parts;
  const month = TR_MONTHS.indexOf(monName);
  let hours = 0, mins = 0;
  if (timePart) { const [h, m] = timePart.split(':').map(Number); hours = h; mins = m; }
  return new Date(Number(year), month, Number(day), hours || 0, mins || 0);
};

// SupplierOrdersScreen placeholder — will be defined in supplier-orders.jsx
const SupplierOrdersScreen = ({ supplier }) => (
  <div style={{ padding: 40, color: 'var(--text-soft)' }}>Yükleniyor…</div>
);

// ═══ PRODUCT CATALOG (sekreterin foto+fiyat eklediği) ═══════════════════════
// Tedarikçi seçilebilir — her firmanın kendi ürün havuzu var
const SUPPLIER_FIRMS = [
  { id: 'devran',    name: 'Devran Döner',  desc: 'Et ürünleri & soslar' },
  { id: 'mirva',     name: 'Mirva',         desc: 'Patates & sos' },
  { id: 'baklavaci', name: 'Baklavacı',     desc: 'Tatlı' },
  { id: 'kervan',    name: 'Kervan Food',   desc: 'Ekmek & sebze' },
];

const DEFAULT_FIRM_PRODUCTS = {
  devran: [],
  mirva: [],
  baklavaci: [
    { id: 1, name: 'Antep Fıstıklı Baklava', price: 65, unit: 'tepsi', img: 'img/antep-fistikli.png' },
    { id: 2, name: 'Cevizli Baklava', price: 38, unit: 'tepsi', img: 'img/cevizli-baklava.png' },
    { id: 3, name: 'Antep Havuç Dilimi Baklava', price: 55, unit: 'tepsi', img: 'img/antep-havuc-dilimi.png' },
    { id: 4, name: 'Antep Kuru Baklava', price: 50, unit: 'tepsi', img: 'img/antep-kuru-baklava.png' },
    { id: 5, name: 'Fıstık Sarması', price: 68, unit: 'tepsi', img: 'img/fistik-sarmasi.png' },
    { id: 6, name: 'Bülbül Yuvası', price: 60, unit: 'tepsi', img: 'img/bulbul-yuvasi.png' },
    { id: 7, name: 'Şöbiyet', price: 62, unit: 'tepsi', img: 'img/sobiyet.png' },
    { id: 8, name: 'Midye Baklava', price: 48, unit: 'tepsi', img: 'img/midye-baklava-new.png' },
    { id: 9, name: 'Sütlü Nuriye', price: 32, unit: 'tepsi', img: 'img/sutlu-nuriye.png' },
    { id: 10, name: 'Soğuk Baklava', price: 58, unit: 'tepsi', img: 'img/soguk-baklava.png' },
    { id: 11, name: 'Ev Baklavası', price: 42, unit: 'tepsi', img: 'img/ev-baklavasi.png' },
    { id: 12, name: 'Çikolatalı Kakaolu Baklava', price: 52, unit: 'tepsi', img: 'img/cikolatali-baklava.png' },
  ],
  kervan: [],
};

const productsKey = (firmId) => `zincir-supplier-products-${firmId}`;
const CATALOG_VERSION_KEY = 'zincir-catalog-version';
const CATALOG_VERSION = 'reset-2026-05-23-eur-tepsi';
// Yeni katalog sürümünde (tüm ürünler temizlendi) eski cache'i sil
try {
  if (localStorage.getItem(CATALOG_VERSION_KEY) !== CATALOG_VERSION) {
    SUPPLIER_FIRMS.forEach(f => localStorage.removeItem(productsKey(f.id)));
    localStorage.setItem(CATALOG_VERSION_KEY, CATALOG_VERSION);
  }
} catch {}

const SupplierProductsScreen = () => {
  const [activeFirm, setActiveFirm] = React.useState('devran');
  const [productsByFirm, setProductsByFirm] = React.useState(() => {
    const init = {};
    SUPPLIER_FIRMS.forEach(f => {
      try {
        const saved = localStorage.getItem(productsKey(f.id));
        const defaults = DEFAULT_FIRM_PRODUCTS[f.id] || [];
        if (saved) {
          const list = JSON.parse(saved);
          // Default kataloğa sonradan eklenen ürünleri (isme göre) otomatik ekle.
          const existingNames = new Set(list.map(p => (p.name || '').trim().toLowerCase()));
          const missing = defaults.filter(d => !existingNames.has((d.name || '').trim().toLowerCase()));
          if (missing.length) {
            let nextId = Math.max(0, ...list.map(p => p.id || 0));
            const merged = [...list, ...missing.map(m => ({ ...m, id: ++nextId }))];
            init[f.id] = merged;
            try { localStorage.setItem(productsKey(f.id), JSON.stringify(merged)); } catch {}
          } else {
            init[f.id] = list;
          }
        } else {
          init[f.id] = defaults;
        }
      } catch { init[f.id] = DEFAULT_FIRM_PRODUCTS[f.id] || []; }
    });
    return init;
  });
  const products = productsByFirm[activeFirm] || [];
  const [editing, setEditing] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const persist = (next) => {
    const nextByFirm = { ...productsByFirm, [activeFirm]: next };
    setProductsByFirm(nextByFirm);
    try { localStorage.setItem(productsKey(activeFirm), JSON.stringify(next)); } catch {}
    try { window.dispatchEvent(new CustomEvent('zincir-supplier-products-changed', { detail: { firmId: activeFirm } })); } catch {}
  };

  const openNew = () => { setEditing({ name: '', price: '', unit: 'kg', img: null }); setDrawerOpen(true); };
  const openEdit = (p) => { setEditing({ ...p }); setDrawerOpen(true); };
  const handleSave = () => {
    if (!editing.name || editing.price === '') return;
    const price = parseFloat(editing.price);
    if (isNaN(price)) return;
    if (editing.id) {
      persist(products.map(p => p.id === editing.id ? { ...editing, price } : p));
    } else {
      const id = Math.max(0, ...products.map(p => p.id)) + 1;
      persist([...products, { ...editing, id, price }]);
    }
    setDrawerOpen(false);
  };
  const handleDelete = (id) => persist(products.filter(p => p.id !== id));

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Resize the image to keep storage small — orijinal boyutlar localStorage'ı doldurabilir.
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const ratio = Math.min(1, MAX / Math.max(img.width, img.height));
        const w = Math.round(img.width * ratio);
        const h = Math.round(img.height * ratio);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const resized = canvas.toDataURL('image/jpeg', 0.82);
        setEditing(prev => ({ ...prev, img: resized }));
      };
      img.onerror = () => setEditing(prev => ({ ...prev, img: ev.target.result }));
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fade-in">
      <div className="fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
            Ürün Kataloğu
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>
            {products.length} ürün · {SUPPLIER_FIRMS.find(f => f.id === activeFirm)?.name} · sekreter fotoğraf ve fiyat ekleyebilir
          </p>
        </div>
        <Btn icon="plus" onClick={openNew}>Yeni Ürün Ekle</Btn>
      </div>

      {/* Tedarikçi seçici tab'lar */}
      <div style={{
        display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap',
        background: 'var(--surface)', padding: 4, borderRadius: 12,
        border: '1px solid var(--border)', alignSelf: 'flex-start', width: 'fit-content',
        maxWidth: '100%', overflowX: 'auto',
      }}>
        {SUPPLIER_FIRMS.map(f => {
          const active = activeFirm === f.id;
          const count = (productsByFirm[f.id] || []).length;
          return (
            <button key={f.id} onClick={() => setActiveFirm(f.id)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 8, border: 'none',
              background: active ? 'var(--blue)' : 'transparent',
              color: active ? '#fff' : 'var(--text-soft)',
              fontSize: 12, fontFamily: 'DM Sans', fontWeight: active ? 600 : 500,
              cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--surface2)'; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Avatar name={f.name} size={20} active={active} />
              {f.name}
              <span style={{
                fontSize: 10, padding: '1px 7px', borderRadius: 9,
                background: active ? 'rgba(255,255,255,0.2)' : 'var(--surface2)',
                color: active ? '#fff' : 'var(--muted)', fontWeight: 600,
              }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {products.map(p => (
          <div key={p.id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, overflow: 'hidden', transition: 'all 0.18s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ aspectRatio: '1 / 1', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {p.img ? (
                <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2">
                  <rect x="3" y="3" width="18" height="18" rx="3"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              )}
            </div>
            <div style={{ padding: '12px 14px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4, fontFamily: 'Syne, sans-serif' }}>{p.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--blue-light)' }}>
                  € {p.price.toLocaleString('tr-TR')}
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>/ {p.unit}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(p)} style={{
                  flex: 1, padding: '7px 0', borderRadius: 7,
                  background: 'var(--blue-dim)', border: '1px solid rgba(91,143,168,0.25)',
                  color: 'var(--blue-light)', fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer',
                }}>Düzenle</button>
                <button onClick={() => handleDelete(p.id)} style={{
                  padding: '7px 10px', borderRadius: 7,
                  background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)',
                  color: '#e08a8a', fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer',
                }}>Sil</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/edit drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={editing?.id ? 'Ürün Düzenle' : 'Yeni Ürün'} width={380}>
        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Photo */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'DM Sans' }}>
                Ürün Fotoğrafı
              </label>
              <label style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                aspectRatio: '1 / 1', maxWidth: 200, margin: '0 auto',
                background: '#fff', border: '2px dashed var(--border)',
                borderRadius: 10, cursor: 'pointer', overflow: 'hidden',
              }}>
                {editing.img ? (
                  <img src={editing.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ textAlign: 'center', color: '#aaa', fontSize: 11, padding: 16 }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.4" style={{ marginBottom: 6 }}>
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <div>Fotoğraf yükle</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onClick={e => { e.target.value = ''; }}
                  onChange={handlePhoto}
                  style={{ display: 'none' }}
                />
              </label>
              {editing.img && (
                <button onClick={() => setEditing(prev => ({ ...prev, img: null }))} style={{
                  display: 'block', margin: '8px auto 0', background: 'none', border: 'none',
                  color: 'var(--text-soft)', cursor: 'pointer', fontSize: 11, fontFamily: 'DM Sans',
                }}>Fotoğrafı Kaldır</button>
              )}
            </div>

            {/* Name */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'DM Sans' }}>
                Ürün Adı
              </label>
              <input
                value={editing.name}
                onChange={e => setEditing(prev => ({ ...prev, name: e.target.value }))}
                placeholder="ör. Dana Döner Eti"
                style={{
                  width: '100%', padding: '10px 12px', background: 'var(--bg)',
                  border: '1px solid var(--border)', borderRadius: 10,
                  color: 'var(--text)', fontSize: 13, fontFamily: 'DM Sans', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Price + Unit */}
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'DM Sans' }}>
                  Fiyat (€)
                </label>
                <input
                  type="number" min="0" step="0.01"
                  value={editing.price}
                  onChange={e => setEditing(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  style={{
                    width: '100%', padding: '10px 12px', background: 'var(--bg)',
                    border: '1px solid var(--border)', borderRadius: 10,
                    color: 'var(--text)', fontSize: 13, fontFamily: 'DM Sans', outline: 'none',
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 6, fontFamily: 'DM Sans' }}>
                  Birim
                </label>
                <select
                  value={editing.unit}
                  onChange={e => setEditing(prev => ({ ...prev, unit: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 12px', background: 'var(--bg)',
                    border: '1px solid var(--border)', borderRadius: 10,
                    color: 'var(--text)', fontSize: 13, fontFamily: 'DM Sans', outline: 'none', cursor: 'pointer',
                  }}
                >
                  {['kg', 'lt', 'adet', 'paket', 'koli'].map(u => (
                    <option key={u} value={u} style={{ background: '#141414' }}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <Btn variant="secondary" onClick={() => setDrawerOpen(false)} style={{ flex: 1 }}>İptal</Btn>
              <Btn onClick={handleSave} style={{ flex: 2 }} icon="check">
                {editing.id ? 'Kaydet' : 'Ürün Ekle'}
              </Btn>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

Object.assign(window, {
  SupplierOrdersScreen, SupplierProductsScreen,
  SUPPLIER_ORDERS, CUSTOMERS_DATA, parseTrDate, TR_MONTHS,
});
