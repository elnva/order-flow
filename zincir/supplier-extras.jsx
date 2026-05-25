
// ═══ MÜŞTERİLER, BORÇLAR, SEKRETER CEVAPLARI ═══════════════════════════════════
//   - SupplierCustomersScreen (ekle / düzenle / sil)
//   - SupplierDebtScreen (3 kutu özet + per-customer defter + manuel ödeme)
//   - useSecretaryReplies hook (sipariş notuna sekreter cevabı, kilitli)
//   - countTodayOrders helper (sidebar rozeti için)


// ── Hook: sekreter cevapları (localStorage) ──────────────────────────────────
const useSecretaryReplies = () => {
  const [replies, setReplies] = React.useState(() => {
    try {
      const saved = localStorage.getItem('zincir-secretary-replies');
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const setReply = (orderId, text) => {
    const next = { ...replies, [orderId]: { text, sentAt: new Date().toISOString() } };
    setReplies(next);
    try { localStorage.setItem('zincir-secretary-replies', JSON.stringify(next)); } catch {}
  };
  return [replies, setReply];
};

// ── Helper: bugünkü sipariş sayısı (sidebar rozeti) ───────────────────────────
const countTodayOrders = () => {
  try {
    const all = (typeof readLiveOrders === 'function' ? readLiveOrders() : []).concat(ALL_ORDERS);
    const sorted = [...all].sort((a, b) => parseTrDate(b.date) - parseTrDate(a.date));
    const today = sorted[0] ? parseTrDate(sorted[0].date) : new Date();
    return all.filter(o => isSameDay(parseTrDate(o.date), today)).length;
  } catch { return 0; }
};

// ═══ MÜŞTERİLER EKRANI ════════════════════════════════════════════════════════
const SupplierCustomersScreen = () => {
  const isMobile = useIsMobile();
  const [customers, setCustomers] = React.useState(() => {
    try {
      const saved = localStorage.getItem('zincir-customers');
      if (saved) return JSON.parse(saved);
    } catch {}
    return CUSTOMERS_DATA.map(c => ({ ...c, id: c.name }));
  });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [savedFlash, setSavedFlash] = React.useState('');

  const persist = (next) => {
    setCustomers(next);
    try { localStorage.setItem('zincir-customers', JSON.stringify(next)); } catch {}
  };

  const openNew = () => {
    setEditing({ name: '', contact: '', address: '', firstOrder: '', _new: true });
    setDrawerOpen(true);
  };
  const openEdit = (c) => { setEditing({ ...c, _new: false }); setDrawerOpen(true); };

  const handleSave = () => {
    if (!editing.name?.trim()) return;
    const today = new Date();
    const firstOrder = editing.firstOrder
      || `${today.getDate()} ${TR_MONTHS[today.getMonth()]} ${today.getFullYear()}`;
    if (editing._new) {
      const id = editing.name + '-' + Date.now();
      persist([{ id, name: editing.name.trim(), contact: editing.contact, address: editing.address, firstOrder }, ...customers]);
      setSavedFlash(`${editing.name} eklendi`);
    } else {
      persist(customers.map(c => c.id === editing.id ? { ...editing } : c));
      setSavedFlash(`${editing.name} güncellendi`);
    }
    setDrawerOpen(false);
    setTimeout(() => setSavedFlash(''), 2500);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Bu müşteriyi silmek istediğinize emin misiniz?')) return;
    persist(customers.filter(c => c.id !== id));
  };

  const filtered = customers.filter(c =>
    !search
      || c.name.toLowerCase().includes(search.toLowerCase())
      || (c.contact || '').toLowerCase().includes(search.toLowerCase())
      || (c.address || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="fade-up" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 22, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
            Müşteriler
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>
            {customers.length} dönerci · yeni müşteri ekleyin, bilgilerini güncelleyin
          </p>
        </div>
        <Btn icon="plus" onClick={openNew}>Yeni Müşteri Ekle</Btn>
      </div>

      {savedFlash && (
        <div className="fade-in" style={{
          background: 'var(--blue-dim)', border: '1px solid rgba(249,115,22,0.3)',
          color: 'var(--blue-light)', padding: '10px 14px', borderRadius: 10,
          marginBottom: 14, fontSize: 12, fontWeight: 500,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Icon name="check" size={14} color="currentColor" />
          {savedFlash}
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: 16, maxWidth: 380 }}>
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

      {!isMobile && (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        {/* header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '52px 1.2fr 1fr 1.5fr 130px',
          gap: 14, padding: '12px 20px', borderBottom: '1px solid var(--border)',
          fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
        }}>
          <span></span>
          <span>Firma</span>
          <span>Telefon</span>
          <span>Adres</span>
          <span></span>
        </div>
        {filtered.length === 0 && (
          <div style={{ padding: '40px', textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
            Müşteri bulunamadı.
          </div>
        )}
        {filtered.map((c, i) => (
          <div key={c.id} style={{
            display: 'grid', gridTemplateColumns: '52px 1.2fr 1fr 1.5fr 130px',
            gap: 14, alignItems: 'center', padding: '14px 20px',
            borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <Avatar name={c.name} size={42} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>İlk sipariş · {c.firstOrder || '—'}</div>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.contact || '—'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.address || '—'}</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
              <button onClick={() => openEdit(c)} style={{
                padding: '6px 11px', borderRadius: 7,
                background: 'var(--blue-dim)', border: '1px solid rgba(249,115,22,0.25)',
                color: 'var(--blue-light)', fontSize: 11, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer',
              }}>Düzenle</button>
              <button onClick={() => handleDelete(c.id)} style={{
                padding: '6px 10px', borderRadius: 7,
                background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)',
                color: '#e08a8a', fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer',
              }}>Sil</button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Cards (mobile) */}
      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', fontSize: 13, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14 }}>
              Müşteri bulunamadı.
            </div>
          )}
          {filtered.map((c) => (
            <div key={c.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '14px 16px',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={c.name} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>İlk sipariş · {c.firstOrder || '—'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 12, color: 'var(--text-soft)' }}>
                <div style={{ display: 'flex', gap: 6 }}><Icon name="phone" size={12} color="var(--muted)" /> {c.contact || '—'}</div>
                <div style={{ display: 'flex', gap: 6 }}><Icon name="home" size={12} color="var(--muted)" /> {c.address || '—'}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => openEdit(c)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 8,
                  background: 'var(--blue-dim)', border: '1px solid rgba(249,115,22,0.25)',
                  color: 'var(--blue-light)', fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer',
                }}>Düzenle</button>
                <button onClick={() => handleDelete(c.id)} style={{
                  flex: 1, padding: '9px 0', borderRadius: 8,
                  background: 'rgba(200,80,80,0.1)', border: '1px solid rgba(200,80,80,0.25)',
                  color: '#e08a8a', fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer',
                }}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={editing?._new ? 'Yeni Müşteri Ekle' : 'Müşteri Düzenle'}
        width={380}
      >
        {editing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FieldInput label="Firma / Dönerci Adı" value={editing.name} onChange={v => setEditing({ ...editing, name: v })} placeholder="ör. Türk Döner" />
            <FieldInput label="Telefon" value={editing.contact} onChange={v => setEditing({ ...editing, contact: v })} placeholder="+39 02 0000000" type="tel" />
            <FieldInput label="Adres" value={editing.address} onChange={v => setEditing({ ...editing, address: v })} placeholder="Via Roma 12, Milano" />
            {!editing._new && (
              <FieldInput label="İlk Sipariş Tarihi" value={editing.firstOrder} onChange={v => setEditing({ ...editing, firstOrder: v })} placeholder="12 Şub 2024" />
            )}
            <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
              <Btn variant="secondary" onClick={() => setDrawerOpen(false)} style={{ flex: 1 }}>İptal</Btn>
              <Btn onClick={handleSave} style={{ flex: 2 }} icon="check">
                {editing._new ? 'Müşteri Ekle' : 'Kaydet'}
              </Btn>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

// ═══ BORÇ & ÖDEME TAKİBİ ══════════════════════════════════════════════════════
const DEFAULT_PAYMENTS = [
  { id: 1, customer: 'Türk Döner',      amount: 12000, date: '15 Nis 2025', method: 'Banka', note: 'Mart-Nisan ara ödeme' },
  { id: 2, customer: 'Türk Döner',      amount: 5000,  date: '22 Nis 2025', method: 'Nakit', note: '' },
  { id: 3, customer: 'Milano Kebap',    amount: 8500,  date: '18 Nis 2025', method: 'Banka', note: '' },
  { id: 4, customer: 'Pamukkale Döner', amount: 3000,  date: '20 Nis 2025', method: 'Nakit', note: '' },
  { id: 5, customer: 'Boğaz Döner',     amount: 4500,  date: '25 Nis 2025', method: 'Çek',   note: 'Mayıs vadeli' },
  { id: 6, customer: 'Karadeniz Et',    amount: 18000, date: '23 Nis 2025', method: 'Banka', note: '' },
];

const PAYMENT_METHODS = ['Nakit', 'Banka', 'Çek', 'Kart'];

const SupplierDebtScreen = () => {
  const isMobile = useIsMobile();
  const [payments, setPayments] = React.useState(() => {
    try {
      const saved = localStorage.getItem('zincir-payments');
      return saved ? JSON.parse(saved) : DEFAULT_PAYMENTS;
    } catch { return DEFAULT_PAYMENTS; }
  });
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [selectedCustomer, setSelectedCustomer] = React.useState(null);

  const persist = (next) => {
    setPayments(next);
    try { localStorage.setItem('zincir-payments', JSON.stringify(next)); } catch {}
  };

  // Müşteri başına toplam alacak (sipariş) & tahsil (ödeme)
  const customerTotals = {};
  ALL_ORDERS.forEach(o => {
    if (!customerTotals[o.customer]) customerTotals[o.customer] = { invoiced: 0, paid: 0, orders: 0, lastOrder: null };
    customerTotals[o.customer].invoiced += orderTotal(o);
    customerTotals[o.customer].orders += 1;
    const d = parseTrDate(o.date);
    if (!customerTotals[o.customer].lastOrder || d > customerTotals[o.customer].lastOrder) {
      customerTotals[o.customer].lastOrder = d;
    }
  });
  payments.forEach(p => {
    if (!customerTotals[p.customer]) customerTotals[p.customer] = { invoiced: 0, paid: 0, orders: 0, lastOrder: null };
    customerTotals[p.customer].paid += p.amount;
  });

  const totalInvoiced = Object.values(customerTotals).reduce((s, c) => s + c.invoiced, 0);
  const totalPaid     = Object.values(customerTotals).reduce((s, c) => s + c.paid, 0);
  const totalRemaining = totalInvoiced - totalPaid;

  const customerRows = Object.entries(customerTotals)
    .map(([name, t]) => ({ name, ...t, remaining: t.invoiced - t.paid }))
    .sort((a, b) => b.remaining - a.remaining);

  const openNewPayment = (customer) => {
    const today = new Date();
    const dateStr = `${today.getDate()} ${TR_MONTHS[today.getMonth()]} ${today.getFullYear()}`;
    setEditing({ customer: customer || '', amount: '', date: dateStr, method: 'Nakit', note: '' });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!editing.customer || !editing.amount) return;
    const amount = parseFloat(editing.amount);
    if (isNaN(amount) || amount <= 0) return;
    const id = Math.max(0, ...payments.map(p => p.id)) + 1;
    persist([{ ...editing, id, amount }, ...payments]);
    setDrawerOpen(false);
  };

  const handleDeletePayment = (id) => {
    if (!window.confirm('Ödemeyi silmek istediğinize emin misiniz?')) return;
    persist(payments.filter(p => p.id !== id));
  };

  // ── Müşteri detayı ────────────────────────────────────────────────────────
  if (selectedCustomer) {
    const customerPayments = payments
      .filter(p => p.customer === selectedCustomer)
      .sort((a, b) => parseTrDate(b.date) - parseTrDate(a.date));
    const t = customerTotals[selectedCustomer] || { invoiced: 0, paid: 0 };
    const remaining = t.invoiced - t.paid;

    return (
      <div className="fade-in">
        <button onClick={() => setSelectedCustomer(null)} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: 'var(--text-soft)', fontSize: 12, fontFamily: 'DM Sans',
          padding: '4px 0', marginBottom: 18,
        }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-flex' }}>
            <Icon name="chevron" size={12} color="currentColor" />
          </span>
          Borç & Ödeme Takibi
        </button>

        <div className="fade-up" style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '22px 24px', marginBottom: 22,
          display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap',
        }}>
          <Avatar name={selectedCustomer} size={56} active />
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
              {selectedCustomer}
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 4 }}>
              {customerPayments.length} ödeme kaydı · {t.orders || 0} sipariş
            </p>
          </div>
          <Btn icon="plus" onClick={() => openNewPayment(selectedCustomer)}>Ödeme Ekle</Btn>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Toplam Alacak', value: t.invoiced, color: 'var(--text)' },
            { label: 'Tahsil Edilen', value: t.paid, color: '#7bc49a' },
            { label: 'Kalan Bakiye',  value: remaining, color: remaining > 0 ? 'var(--blue-light)' : '#7bc49a' },
          ].map((b, i) => (
            <div key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '18px 20px',
            }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.13em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 8 }}>{b.label}</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700, color: b.color }}>{fmtTRY(b.value)}</div>
            </div>
          ))}
        </div>

        <SectionLabel style={{ marginBottom: 10 }}>Ödeme Geçmişi</SectionLabel>
        {!isMobile && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '120px 100px 1fr 130px 50px',
            gap: 12, padding: '10px 18px', borderBottom: '1px solid var(--border)',
            fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
          }}>
            <span>Tarih</span>
            <span>Yöntem</span>
            <span>Not</span>
            <span style={{ textAlign: 'right' }}>Tutar</span>
            <span></span>
          </div>
          {customerPayments.length === 0 && (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: 13, color: 'var(--muted)' }}>
              Henüz ödeme kaydı yok. <button onClick={() => openNewPayment(selectedCustomer)} style={{ background: 'none', border: 'none', color: 'var(--blue-light)', cursor: 'pointer', textDecoration: 'underline', fontSize: 13 }}>Yeni ödeme ekleyin</button>.
            </div>
          )}
          {customerPayments.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '120px 100px 1fr 130px 50px',
              gap: 12, padding: '13px 18px', alignItems: 'center',
              borderBottom: i < customerPayments.length - 1 ? '1px solid var(--border)' : 'none',
              fontSize: 12,
            }}>
              <span style={{ color: 'var(--text-soft)' }}>{p.date}</span>
              <span>
                <span style={{ padding: '3px 9px', borderRadius: 5, background: 'var(--surface2)', fontSize: 11, color: 'var(--text)', border: '1px solid var(--border)' }}>{p.method}</span>
              </span>
              <span style={{ color: 'var(--text-soft)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.note || '—'}</span>
              <span style={{ textAlign: 'right', color: '#7bc49a', fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700 }}>
                +{fmtTRY(p.amount)}
              </span>
              <button onClick={() => handleDeletePayment(p.id)} title="Sil" style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#e08a8a'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}
              >
                <Icon name="x" size={14} color="currentColor" />
              </button>
            </div>
          ))}
        </div>
        )}

        {/* Ödeme geçmişi — cards (mobile) */}
        {isMobile && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {customerPayments.length === 0 && (
              <div style={{ padding: '32px', textAlign: 'center', fontSize: 13, color: 'var(--muted)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                Henüz ödeme kaydı yok. <button onClick={() => openNewPayment(selectedCustomer)} style={{ background: 'none', border: 'none', color: 'var(--blue-light)', cursor: 'pointer', textDecoration: 'underline', fontSize: 13 }}>Yeni ödeme ekleyin</button>.
              </div>
            )}
            {customerPayments.map((p) => (
              <div key={p.id} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ padding: '3px 9px', borderRadius: 5, background: 'var(--surface2)', fontSize: 11, color: 'var(--text)', border: '1px solid var(--border)' }}>{p.method}</span>
                  <span style={{ color: '#7bc49a', fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700 }}>+{fmtTRY(p.amount)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>{p.date}</span>
                  <button onClick={() => handleDeletePayment(p.id)} style={{
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    color: 'var(--muted)', fontSize: 11, fontFamily: 'DM Sans',
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                  }}>
                    <Icon name="x" size={13} color="currentColor" /> Sil
                  </button>
                </div>
                {p.note && <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{p.note}</div>}
              </div>
            ))}
          </div>
        )}

        <PaymentDrawer
          open={drawerOpen} onClose={() => setDrawerOpen(false)}
          editing={editing} setEditing={setEditing} onSave={handleSave}
          customers={Object.keys(customerTotals)}
        />
      </div>
    );
  }

  // ── Ana liste ─────────────────────────────────────────────────────────────
  return (
    <div className="fade-in">
      <div className="fade-up" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        marginBottom: 22, flexWrap: 'wrap', gap: 12,
      }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
            Borç & Ödeme Takibi
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>
            Sade defter — toplam alacak, tahsil edilen ve kalan bakiyeyi takip edin
          </p>
        </div>
        <Btn icon="plus" onClick={() => openNewPayment(null)}>Ödeme Ekle</Btn>
      </div>

      {/* 3 kutu özet */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Toplam Alacak',  value: totalInvoiced,  hint: `${customerRows.length} müşteri`, color: 'var(--text)', accent: 'rgba(255,255,255,0.04)' },
          { label: 'Tahsil Edilen',  value: totalPaid,      hint: `${payments.length} ödeme kaydı`, color: '#7bc49a', accent: 'rgba(123,196,154,0.08)' },
          { label: 'Kalan Bakiye',   value: totalRemaining, hint: 'tahsil edilmemiş', color: 'var(--blue-light)', accent: 'rgba(249,115,22,0.08)' },
        ].map((b, i) => (
          <div key={i} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '22px 24px', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -30, right: -30, width: 110, height: 110,
              borderRadius: '50%', background: b.accent, pointerEvents: 'none',
            }} />
            <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 10, position: 'relative' }}>
              {b.label}
            </div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 700, color: b.color, marginBottom: 6, position: 'relative' }}>
              {fmtTRY(b.value)}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', position: 'relative' }}>{b.hint}</div>
          </div>
        ))}
      </div>

      <SectionLabel style={{ marginBottom: 10 }}>Müşteri Bakiyeleri</SectionLabel>
      {!isMobile && (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '52px 1fr 110px 110px 130px 40px',
          gap: 14, padding: '12px 20px', borderBottom: '1px solid var(--border)',
          fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600,
        }}>
          <span></span>
          <span>Müşteri</span>
          <span style={{ textAlign: 'right' }}>Alacak</span>
          <span style={{ textAlign: 'right' }}>Tahsil</span>
          <span style={{ textAlign: 'right' }}>Kalan</span>
          <span></span>
        </div>
        {customerRows.map((c, i) => (
          <div key={c.name}
            onClick={() => setSelectedCustomer(c.name)}
            style={{
              display: 'grid', gridTemplateColumns: '52px 1fr 110px 110px 130px 40px',
              gap: 14, padding: '14px 20px', alignItems: 'center',
              borderBottom: i < customerRows.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Avatar name={c.name} size={42} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{c.orders} sipariş</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{fmtTRY(c.invoiced)}</div>
            <div style={{ textAlign: 'right', fontSize: 13, color: '#7bc49a', fontWeight: 500 }}>{fmtTRY(c.paid)}</div>
            <div style={{
              textAlign: 'right', fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700,
              color: c.remaining > 0 ? 'var(--blue-light)' : '#7bc49a',
            }}>
              {fmtTRY(c.remaining)}
            </div>
            <div style={{ textAlign: 'right', color: 'var(--muted)', display: 'flex', justifyContent: 'flex-end' }}>
              <Icon name="chevron" size={14} color="currentColor" />
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Müşteri bakiyeleri — cards (mobile) */}
      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {customerRows.map((c) => (
            <div key={c.name}
              onClick={() => setSelectedCustomer(c.name)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '14px 16px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={c.name} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{c.orders} sipariş</div>
                </div>
                <Icon name="chevron" size={16} color="var(--muted)" />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Alacak</div>
                  <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, marginTop: 2 }}>{fmtTRY(c.invoiced)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Tahsil</div>
                  <div style={{ fontSize: 13, color: '#7bc49a', fontWeight: 500, marginTop: 2 }}>{fmtTRY(c.paid)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Kalan</div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginTop: 2, color: c.remaining > 0 ? 'var(--blue-light)' : '#7bc49a' }}>{fmtTRY(c.remaining)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <PaymentDrawer
        open={drawerOpen} onClose={() => setDrawerOpen(false)}
        editing={editing} setEditing={setEditing} onSave={handleSave}
        customers={Object.keys(customerTotals)}
      />
    </div>
  );
};

// ── Ödeme drawer'ı ─────────────────────────────────────────────────────────────
const PaymentDrawer = ({ open, onClose, editing, setEditing, onSave, customers }) => (
  <Drawer open={open} onClose={onClose} title="Yeni Ödeme Girişi" width={380}>
    {editing && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={{
            display: 'block', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.13em', textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: 6, fontFamily: 'DM Sans',
          }}>Müşteri</label>
          <select
            value={editing.customer || ''}
            onChange={e => setEditing({ ...editing, customer: e.target.value })}
            style={{
              width: '100%', padding: '11px 14px', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: 10,
              color: 'var(--text)', fontSize: 13, fontFamily: 'DM Sans', outline: 'none', cursor: 'pointer',
            }}
          >
            <option value="" style={{ background: '#141414' }}>Seçin…</option>
            {customers.map(c => <option key={c} value={c} style={{ background: '#141414' }}>{c}</option>)}
          </select>
        </div>

        <FieldInput label="Tutar (€)" value={editing.amount} onChange={v => setEditing({ ...editing, amount: v })} placeholder="0.00" type="number" />
        <FieldInput label="Tarih" value={editing.date} onChange={v => setEditing({ ...editing, date: v })} placeholder="28 Nis 2025" />

        <div>
          <label style={{
            display: 'block', fontSize: 10, fontWeight: 600,
            letterSpacing: '0.13em', textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: 6, fontFamily: 'DM Sans',
          }}>Yöntem</label>
          <div style={{ display: 'flex', gap: 6 }}>
            {PAYMENT_METHODS.map(m => (
              <button key={m} onClick={() => setEditing({ ...editing, method: m })} style={{
                flex: 1, padding: '9px 0', borderRadius: 8,
                background: editing.method === m ? 'var(--blue-dim)' : 'var(--surface2)',
                border: editing.method === m ? '1px solid rgba(249,115,22,0.4)' : '1px solid var(--border)',
                color: editing.method === m ? 'var(--blue-light)' : 'var(--text-soft)',
                fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer',
                transition: 'all 0.15s',
              }}>{m}</button>
            ))}
          </div>
        </div>

        <FieldInput label="Not (opsiyonel)" value={editing.note} onChange={v => setEditing({ ...editing, note: v })} placeholder="ör. Mayıs vadeli çek" />

        <div style={{ display: 'flex', gap: 10, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
          <Btn variant="secondary" onClick={onClose} style={{ flex: 1 }}>İptal</Btn>
          <Btn onClick={onSave} style={{ flex: 2 }} icon="check">Ödemeyi Kaydet</Btn>
        </div>
      </div>
    )}
  </Drawer>
);

Object.assign(window, {
  SupplierCustomersScreen, SupplierDebtScreen,
  useSecretaryReplies, countTodayOrders,
});
