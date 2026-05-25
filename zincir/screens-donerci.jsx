
// ─── SCREEN: PROFİL ────────────────────────────────────────────────────────────
const ProfileScreen = ({ profile, onSave }) => {
  const [form, setForm] = React.useState({ ...profile });
  const [saved, setSaved] = React.useState(false);
  const [avatarHov, setAvatarHov] = React.useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setSaved(false); };

  const handleSave = () => {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const fieldLabel = (label) => (
    <label style={{
      display: 'block', fontSize: 10, fontWeight: 600,
      letterSpacing: '0.13em', color: 'var(--muted)',
      textTransform: 'uppercase', marginBottom: 6,
      fontFamily: 'DM Sans, sans-serif',
    }}>{label}</label>
  );

  const inputStyle = (focused) => ({
    width: '100%', padding: '11px 14px',
    background: 'var(--bg)', border: `1px solid ${focused ? 'var(--blue)' : 'var(--border)'}`,
    boxShadow: focused ? '0 0 0 3px var(--blue-dim)' : 'none',
    borderRadius: 10, color: 'var(--text)', fontSize: 13,
    fontFamily: 'DM Sans, sans-serif', outline: 'none',
    transition: 'all 0.18s ease',
  });

  return (
    <div className="fade-in" style={{ maxWidth: 600 }}>
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 32 }}>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700,
          color: 'var(--text)', marginBottom: 6,
        }}>Profilim</h1>
        <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>Hesap bilgilerinizi güncelleyin.</p>
      </div>

      {/* Avatar card */}
      <div className="fade-up-1" style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '28px 28px 24px',
        marginBottom: 16, display: 'flex', alignItems: 'center', gap: 24,
        flexWrap: 'wrap',
      }}>
        <label
          onMouseEnter={() => setAvatarHov(true)}
          onMouseLeave={() => setAvatarHov(false)}
          style={{ position: 'relative', cursor: form.role === 'tedarikci' ? 'pointer' : 'default', flexShrink: 0, display: 'block' }}
        >
          {form.logo ? (
            <img src={form.logo} alt="" style={{
              width: 72, height: 72, borderRadius: '50%',
              objectFit: 'cover', border: '3px solid var(--border)',
              background: '#fff',
              transition: 'all 0.18s ease',
              boxShadow: avatarHov ? '0 0 0 3px var(--blue-dim)' : 'none',
            }} />
          ) : (
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--blue) 0%, #c05a0a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 700,
              color: '#fff', border: '3px solid var(--border)',
              transition: 'all 0.18s ease',
              boxShadow: avatarHov ? '0 0 0 3px var(--blue-dim)' : 'none',
            }}>
              {form.company ? form.company[0].toUpperCase() : (form.name ? form.name[0].toUpperCase() : '?')}
            </div>
          )}
          {form.role === 'tedarikci' && avatarHov && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: 'rgba(0,0,0,0.55)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
          )}
          {form.role === 'tedarikci' && (
            <input
              type="file" accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => set('logo', ev.target.result);
                reader.readAsDataURL(file);
              }}
              style={{ display: 'none' }}
            />
          )}
        </label>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{
            fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)',
          }}>
            {form.company || (form.role === 'tedarikci' ? 'Tedarikçi' : 'Dönerci')}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 4 }}>{form.name || '—'} · {form.email || '—'}</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 10, flexWrap: 'wrap' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px',
              background: 'var(--blue-dim)', borderRadius: 20,
              border: '1px solid rgba(249,115,22,0.25)',
              fontSize: 11, color: 'var(--blue-light)', fontWeight: 500,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)' }} />
              {form.role === 'tedarikci' ? 'Tedarikçi' : 'Dönerci'}
            </div>
            {form.role === 'tedarikci' && (
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                {form.logo ? 'Logo yüklü · A4 föyünde görünür' : 'Logo eklenmedi'}
              </span>
            )}
          </div>
          {form.role === 'tedarikci' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file'; input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => set('logo', ev.target.result);
                    reader.readAsDataURL(file);
                  };
                  input.click();
                }}
                style={{
                  padding: '6px 12px', borderRadius: 7,
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  color: 'var(--text)', fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer',
                }}>
                {form.logo ? 'Logoyu Değiştir' : 'Logo Yükle'}
              </button>
              {form.logo && (
                <button onClick={() => set('logo', null)} style={{
                  padding: '6px 12px', borderRadius: 7,
                  background: 'transparent', border: '1px solid var(--border)',
                  color: 'var(--muted)', fontSize: 11, fontFamily: 'DM Sans', cursor: 'pointer',
                }}>Kaldır</button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Form card */}
      <div className="fade-up-2" style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '28px',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)', paddingBottom: 14 }}>
          Kişisel Bilgiler
        </div>

        {/* Name */}
        <FieldInput label={form.role === 'tedarikci' ? 'Yetkili Adı' : 'Ad Soyad'} value={form.name} onChange={v => set('name', v)} placeholder="ör. Ahmet Yılmaz" />

        {/* Email */}
        <FieldInput label="E-posta Adresi" value={form.email} onChange={v => set('email', v)} placeholder="ornek@email.com" type="email" />

        {/* Phone */}
        <FieldInput label="Telefon" value={form.phone} onChange={v => set('phone', v)} placeholder="+39 02 0000000" type="tel" />

        {/* Company */}
        <FieldInput label={form.role === 'tedarikci' ? 'Tedarikçi / Fabrika Adı' : 'Dönerci Firma Adı'} value={form.company} onChange={v => set('company', v)} placeholder="Firmanızın adı" />

        {/* Address */}
        <FieldInput label="Adres" value={form.address} onChange={v => set('address', v)} placeholder="ör. Via Roma 12, Milano" />

        {/* VAT — sadece tedarikçi */}
        {form.role === 'tedarikci' && (
          <FieldInput label="Vergi No (VAT)" value={form.vat} onChange={v => set('vat', v)} placeholder="IT12345678901" />
        )}

        {/* Save */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 4, borderTop: '1px solid var(--border)' }}>
          {saved && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontSize: 13, color: 'var(--blue)', fontWeight: 500,
              animation: 'fadeIn 0.2s ease',
            }}>
              <Icon name="check" size={14} color="currentColor" />
              Kaydedildi
            </div>
          )}
          <Btn onClick={handleSave} icon="check">Değişiklikleri Kaydet</Btn>
        </div>
      </div>

      {/* Danger zone */}
      <div className="fade-up-3" style={{
        background: 'var(--surface)', border: '1px solid rgba(168,91,91,0.2)',
        borderRadius: 14, padding: '20px 28px',
        marginTop: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Hesabı Sil</div>
          <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>Tüm verileriniz kalıcı olarak silinir.</div>
        </div>
        <Btn variant="danger" size="sm">Hesabı Sil</Btn>
      </div>
    </div>
  );
};

// Reusable controlled field
const FieldInput = ({ label, value, onChange, placeholder, type = 'text' }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 10, fontWeight: 600,
        letterSpacing: '0.13em', color: 'var(--muted)',
        textTransform: 'uppercase', marginBottom: 6,
        fontFamily: 'DM Sans, sans-serif',
      }}>{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', padding: '11px 14px',
          background: 'var(--bg)',
          border: `1px solid ${focused ? 'var(--blue)' : 'var(--border)'}`,
          boxShadow: focused ? '0 0 0 3px var(--blue-dim)' : 'none',
          borderRadius: 10, color: 'var(--text)', fontSize: 13,
          fontFamily: 'DM Sans, sans-serif', outline: 'none',
          transition: 'all 0.18s ease',
        }}
      />
    </div>
  );
};

Object.assign(window, { ProfileScreen, FieldInput });

// ─── SCREEN 1: DÖNERCI ANASAYFA ───────────────────────────────────────────────
const HomeScreen = ({ onNavigate, onFirmSelect }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: 'var(--blue-dim)', border: '1px solid rgba(249,115,22,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
            <rect width="36" height="36" rx="10" fill="transparent"/>
            <path d="M8 13h13M18 9l4 4-4 4" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28 23H15M18 27l-4-4 4-4" stroke="var(--blue)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.55"/>
          </svg>
        </div>
        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700,
          color: 'var(--text)', marginBottom: 8,
        }}>Order Flow'a hoş geldiniz</h1>
        <p style={{ fontSize: 13, color: 'var(--text-soft)', maxWidth: 280, margin: '0 auto' }}>
          Sol menüden bir tedarikçi seçerek sipariş verin veya faturalarınızı görüntüleyin.
        </p>
      </div>
    </div>
  );
};

// ─── SCREEN 2: TEDARİKÇİ / ÜRÜN LİSTESİ ──────────────────────────────────────
const STATIC_PRODUCTS = {
  devran: [],
  mirva: [],
  baklavaci: [
    { id: 30, name: 'Antep Fıstıklı Baklava', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 65, category: 'Baklava', img: 'img/antep-fistikli.png' },
    { id: 31, name: 'Cevizli Baklava', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 38, category: 'Baklava', img: 'img/cevizli-baklava.png' },
    { id: 32, name: 'Antep Havuç Dilimi Baklava', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 55, category: 'Baklava', img: 'img/antep-havuc-dilimi.png' },
    { id: 33, name: 'Antep Kuru Baklava', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 50, category: 'Baklava', img: 'img/antep-kuru-baklava.png' },
    { id: 34, name: 'Fıstık Sarması', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 68, category: 'Baklava', img: 'img/fistik-sarmasi.png' },
    { id: 35, name: 'Bülbül Yuvası', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 60, category: 'Baklava', img: 'img/bulbul-yuvasi.png' },
    { id: 36, name: 'Şöbiyet', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 62, category: 'Baklava', img: 'img/sobiyet.png' },
    { id: 37, name: 'Midye Baklava', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 48, category: 'Baklava', img: 'img/midye-baklava-new.png' },
    { id: 38, name: 'Sütlü Nuriye', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 32, category: 'Baklava', img: 'img/sutlu-nuriye.png' },
    { id: 39, name: 'Soğuk Baklava', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 58, category: 'Baklava', img: 'img/soguk-baklava.png' },
    { id: 40, name: 'Ev Baklavası', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 42, category: 'Baklava', img: 'img/ev-baklavasi.png' },
    { id: 41, name: 'Çikolatalı Kakaolu Baklava', brand: 'Baklavacı', pack: 'tepsi', unit: 'tepsi', price: 52, category: 'Baklava', img: 'img/cikolatali-baklava.png' },
  ],
  kervan: [],
};

// Hook: tüm firmaların ürün listesi (sekreterin eklediği ürünler dahil)
const useFirmProducts = (firmId) => {
  const [override, setOverride] = React.useState(null);
  React.useEffect(() => {
    const read = () => {
      try {
        const saved = localStorage.getItem(`zincir-supplier-products-${firmId}`);
        if (!saved) { setOverride(null); return; }
        const list = JSON.parse(saved);
        const supplierMap = new Map(list.map(p => [p.id, p]));
        const base = STATIC_PRODUCTS[firmId] || [];
        // Tedarikçinin yüklediği foto/fiyat/isim ORİJİNAL ürünün üstüne biner.
        const merged = base.map(p => {
          const s = supplierMap.get(p.id);
          if (!s) return p;
          return {
            ...p,
            name: s.name || p.name,
            price: typeof s.price === 'number' ? s.price : p.price,
            unit: s.unit || p.unit,
            img: s.img != null ? s.img : p.img,
          };
        });
        // Tedarikçi tarafında YENİ eklenmiş (statik listede olmayan) ürünleri sona ekle.
        list.forEach(s => {
          if (!base.some(p => p.id === s.id)) {
            merged.push({
              id: 'sup-' + firmId + '-' + s.id,
              name: s.name,
              brand: FIRM_NAMES[firmId] || '',
              pack: s.unit,
              unit: s.unit,
              price: s.price,
              category: s.category || 'Tedarikçi Ürünleri',
              img: s.img || null,
            });
          }
        });
        setOverride(merged);
      } catch { setOverride(null); }
    };
    read();
    const handler = (e) => {
      // Sadece bu firma için tetiklendi mi diye bak (yoksa hepsini yenile)
      if (!e?.detail?.firmId || e.detail.firmId === firmId) read();
    };
    window.addEventListener('zincir-supplier-products-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('zincir-supplier-products-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, [firmId]);
  // Eğer sekreter düzenlediyse onun listesini göster, yoksa statiği
  return override !== null ? override : (STATIC_PRODUCTS[firmId] || []);
};

// Geri uyumluluk: doğrudan PRODUCTS[id] kullanımı için
const PRODUCTS = STATIC_PRODUCTS;
const FIRM_NAMES = { devran: 'Devran Döner', mirva: 'Mirva', baklavaci: 'Baklavacı', kervan: 'Kervan Food' };
const FIRM_DESCS = {
  devran: 'Devran Döner ile son 30 günde 12 sipariş verdiniz.',
  mirva: 'Mirva ile son 30 günde 7 sipariş verdiniz.',
  baklavaci: 'Baklavacı ile son 30 günde 4 sipariş verdiniz.',
  kervan: 'Kervan Food ile son 30 günde 9 sipariş verdiniz.',
};

const SupplierScreen = ({ firmId, onNavigate, cartItems, setCartItems }) => {
  const [activeCategory, setActiveCategory] = React.useState('Tümü');
  const [viewMode, setViewMode] = React.useState('grid');
  const products = useFirmProducts(firmId);
  const categories = ['Tümü', ...new Set(products.map(p => p.category))];
  const filtered = activeCategory === 'Tümü' ? products : products.filter(p => p.category === activeCategory);
  const totalInCart = cartItems.reduce((s, i) => s + i.qty, 0);

  const addToCart = (product) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const removeFromCart = (id) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === id);
      if (!ex) return prev;
      if (ex.qty <= 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            {FIRM_NAMES[firmId]}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>{FIRM_DESCS[firmId]}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Cart button */}
          {totalInCart > 0 && (
            <button onClick={() => onNavigate('new-order')} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--blue)', border: 'none',
              borderRadius: 10, padding: '9px 16px', cursor: 'pointer',
              color: '#fff', fontSize: 13, fontFamily: 'DM Sans', fontWeight: 500,
              transition: 'all 0.18s ease',
            }}>
              <Icon name="cart" size={14} color="currentColor" />
              Sepete Git ({totalInCart})
            </button>
          )}
        </div>
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 7, marginBottom: 20, flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: '5px 13px', borderRadius: 20,
            background: activeCategory === cat ? 'var(--blue-dim)' : 'var(--surface)',
            border: `1px solid ${activeCategory === cat ? 'rgba(249,115,22,0.35)' : 'var(--border)'}`,
            color: activeCategory === cat ? 'var(--blue-light)' : 'var(--text-soft)',
            fontSize: 12, fontFamily: 'DM Sans', cursor: 'pointer',
            transition: 'all 0.18s ease',
          }}>{cat}</button>
        ))}
      </div>

      {/* ── GRID VIEW ── */}
      <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 14,
        }}>
          {filtered.map((product) => {
            const inCart = cartItems.find(c => c.id === product.id);
            const qty = inCart ? inCart.qty : 0;
            return (
              <div key={product.id} style={{
                background: 'var(--surface)',
                border: `1px solid ${qty > 0 ? 'rgba(249,115,22,0.3)' : 'var(--border)'}`,
                borderRadius: 12, overflow: 'hidden',
                transition: 'all 0.18s ease', position: 'relative',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.22)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {/* Photo area */}
                <div style={{
                  height: 140, background: 'var(--surface2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {product.img ? (
                    <img src={product.img} alt={product.name} style={{
                      width: '100%', height: '100%', objectFit: 'cover',
                    }} />
                  ) : (
                    <>
                      {/* Subtle grid pattern */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }} />
                      <div style={{ position: 'relative', textAlign: 'center' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="3"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    </>
                  )}

                  {/* Qty badge top-right */}
                  {qty > 0 && (
                    <div style={{
                      position: 'absolute', top: 8, right: 8,
                      background: 'var(--blue)', color: '#fff',
                      borderRadius: '50%', width: 22, height: 22,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}>{qty}</div>
                  )}
                </div>

                {/* Bottom info bar */}
                <div style={{
                  padding: '10px 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  gap: 8,
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 12, fontWeight: 500, color: 'var(--text)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>{product.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--blue-light)', fontWeight: 600, marginTop: 2 }}>
                      € {product.price.toFixed(2)}
                      <span style={{ color: 'var(--muted)', fontWeight: 400 }}> /{product.unit}</span>
                    </div>
                  </div>

                  {/* +/- controls */}
                  {qty === 0 ? (
                    <button onClick={() => addToCart(product)} style={{
                      width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                      background: 'var(--blue)', border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', transition: 'opacity 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <Icon name="plus" size={14} color="#fff" />
                    </button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => removeFromCart(product.id)} style={{
                        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                        background: 'var(--surface2)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}>
                        <Icon name="minus" size={10} color="var(--text-soft)" />
                      </button>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', minWidth: 16, textAlign: 'center' }}>{qty}</span>
                      <button onClick={() => addToCart(product)} style={{
                        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
                        background: 'var(--blue)', border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                      }}>
                        <Icon name="plus" size={10} color="#fff" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
};

// ─── SCREEN 3: YENİ SİPARİŞ ───────────────────────────────────────────────────
const NewOrderScreen = ({ firmId, cartItems, setCartItems, onNavigate, showToast, addOrder, customerName }) => {
  const isMobile = useIsMobile();
  const [search, setSearch] = React.useState('');
  const [note, setNote] = React.useState('');
  const [activeCategory, setActiveCategory] = React.useState('Tümü');
  const [viewMode, setViewMode] = React.useState('grid2');
  const safeFirmId = firmId || 'mirva';
  const products = useFirmProducts(safeFirmId);
  const categories = ['Tümü', ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'Tümü' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const addToCart = (product) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === product.id);
      if (ex) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  };
  const removeOne = (id) => {
    setCartItems(prev => {
      const ex = prev.find(i => i.id === id);
      if (!ex) return prev;
      if (ex.qty <= 1) return prev.filter(i => i.id !== id);
      return prev.map(i => i.id === id ? { ...i, qty: i.qty - 1 } : i);
    });
  };
  const removeAll = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  const subtotal = cartItems.reduce((s, i) => s + (i.price * i.qty), 0);
  const total = subtotal;
  const fmt = (n) => '€ ' + n.toLocaleString('tr-TR', { maximumFractionDigits: 0 });

  // Card-level qty selector state per product
  const QtyControl = ({ product }) => {
    const [qty, setQty] = React.useState(1);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14 }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 9, padding: 2,
        }}>
          <button onClick={() => setQty(Math.max(1, qty - 1))} style={{
            width: 26, height: 26, border: 'none', background: 'transparent',
            color: 'var(--text-soft)', cursor: 'pointer', fontSize: 14,
          }}>−</button>
          <span style={{ minWidth: 22, textAlign: 'center', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{qty}</span>
          <button onClick={() => setQty(qty + 1)} style={{
            width: 26, height: 26, border: 'none', background: 'transparent',
            color: 'var(--text-soft)', cursor: 'pointer', fontSize: 14,
          }}>+</button>
        </div>
        <button onClick={() => { for (let i = 0; i < qty; i++) addToCart(product); showToast && showToast(`${product.name} sepete eklendi`); }} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          padding: '7px 10px', borderRadius: 9,
          background: 'var(--blue)', border: 'none', color: '#fff',
          fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer',
          transition: 'opacity 0.15s',
        }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <Icon name="cart" size={12} color="currentColor" />
          Sepete Ekle
        </button>
      </div>
    );
  };

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0,1fr) 340px', gap: 24, alignItems: 'start' }}>
      {/* ── LEFT: products column ── */}
      <div style={{ minWidth: 0 }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14, fontSize: 12, color: 'var(--text-soft)' }}>
          <span>Dönerci</span>
          <Icon name="chevron" size={11} color="var(--muted)" />
          <span>{FIRM_NAMES[firmId] || 'Tedarikçi'}</span>
          <Icon name="chevron" size={11} color="var(--muted)" />
          <span style={{ color: 'var(--text)' }}>Sipariş Ver</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>Sipariş Ver</h1>
              <p style={{ fontSize: 13, color: 'var(--text-soft)' }}>{FIRM_NAMES[firmId] || 'Tedarikçi'} — Tedarikçinizden ürün seçin</p>
            </div>
            {/* Görünüm seçici */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Görünüm</span>
              <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 3, gap: 2 }}>
                {[
                  { mode: 'grid2', title: '2 Sütun', d: 'M3 4h8v16H3zM13 4h8v16h-8z' },
                  { mode: 'grid3', title: '3 Sütun', d: 'M3 4h5v16H3zM10 4h4v16h-4zM16 4h5v16h-5z' },
                  { mode: 'list',  title: 'Liste',   d: 'M3 6h18M3 12h18M3 18h18' },
                ].map(opt => {
                  const active = viewMode === opt.mode;
                  return (
                    <button key={opt.mode} onClick={() => setViewMode(opt.mode)} title={opt.title} style={{
                      width: 34, height: 30, borderRadius: 7, border: 'none',
                      background: active ? 'var(--blue)' : 'transparent',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s ease',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={active ? '#fff' : 'var(--muted)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={opt.d}/>
                      </svg>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 18 }}>
          <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'flex' }}>
            <Icon name="search" size={16} color="currentColor" />
          </div>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ürün adı ile ara... (örn. patates, sos)"
            style={{
              width: '100%', padding: '14px 16px 14px 44px',
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, color: 'var(--text)', fontSize: 14,
              fontFamily: 'DM Sans, sans-serif', outline: 'none',
              transition: 'border-color 0.18s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--blue)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Category chips */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '7px 16px', borderRadius: 22,
              background: activeCategory === cat ? 'var(--blue)' : 'var(--surface)',
              border: `1px solid ${activeCategory === cat ? 'var(--blue)' : 'var(--border)'}`,
              color: activeCategory === cat ? '#fff' : 'var(--text-soft)',
              fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}>{cat}</button>
          ))}
        </div>

        {/* Product grid / list */}
        {viewMode === 'list' ? (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
            {filtered.map((product, i) => (
              <div key={product.id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px',
                borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{ width: 56, height: 56, flexShrink: 0, background: '#fff', borderRadius: 8, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {product.img ? <img src={product.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {product.brand && <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 2 }}>{product.brand}</div>}
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>{product.name}</div>
                  {product.pack && <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>{product.pack}</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{fmt(product.price)}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>/ {product.unit}</div>
                </div>
                <button onClick={() => { addToCart(product); showToast && showToast(`${product.name} sepete eklendi`); }} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 9,
                  background: 'var(--blue)', border: 'none', color: '#fff',
                  fontSize: 12, fontFamily: 'DM Sans', fontWeight: 600, cursor: 'pointer',
                }}>
                  <Icon name="cart" size={12} color="currentColor" />
                  Sepete Ekle
                </button>
              </div>
            ))}
          </div>
        ) : (
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, minmax(0,1fr))' : (viewMode === 'grid3' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)'), gap: isMobile ? 12 : 18 }}>
          {filtered.map(product => (
            <div key={product.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, overflow: 'hidden',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.28)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {/* Photo */}
              <div style={{
                aspectRatio: '1 / 1', background: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {product.img ? (
                  <img src={product.img} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.2">
                    <rect x="3" y="3" width="18" height="18" rx="3"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                )}
              </div>

              {/* Body */}
              <div style={{ padding: '14px 14px 16px' }}>
                {product.brand && (
                  <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>{product.brand}</div>
                )}
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6, fontFamily: 'Syne, sans-serif', lineHeight: 1.25 }}>{product.name}</div>
                {product.pack && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-soft)', marginBottom: 10 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                    {product.pack}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{fmt(product.price)}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>/ {product.unit}</span>
                </div>

                <QtyControl product={product} />
              </div>
            </div>
          ))}
        </div>
        )}

        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Aramanıza uygun ürün bulunamadı.
          </div>
        )}
      </div>

      {/* ── RIGHT: sticky cart panel ── */}
      <aside style={{
        position: isMobile ? 'static' : 'sticky', top: 16,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 14, padding: 18,
        maxHeight: isMobile ? 'none' : 'calc(100vh - 32px)',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Cart header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>Sepetim</h2>
          {cartItems.length > 0 && (
            <span style={{
              background: 'var(--blue)', color: '#fff',
              borderRadius: 999, padding: '2px 9px',
              fontSize: 11, fontWeight: 700, fontFamily: 'DM Sans',
            }}>{cartItems.length}</span>
          )}
        </div>

        {/* Empty / Items */}
        {cartItems.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 8px', color: 'var(--muted)' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <Icon name="cart" size={22} color="var(--muted)" />
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-soft)', maxWidth: 220, lineHeight: 1.5 }}>
              Sepetiniz boş. Soldan ürün ekleyerek başlayın.
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginRight: -8, paddingRight: 8 }}>
              {cartItems.map(item => (
                <div key={item.id} style={{
                  display: 'flex', gap: 10, alignItems: 'center',
                  background: 'var(--surface2)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: 8,
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8, background: '#fff',
                    flexShrink: 0, overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {item.img ? <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 2 }}>{item.qty} {item.unit} · {fmt(item.price * item.qty)}</div>
                  </div>
                  <button onClick={() => removeAll(item.id)} title="Sil" style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: 'transparent', border: '1px solid var(--border)',
                    color: 'var(--muted)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)'; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>TOPLAM</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>{fmt(total)}</span>
              </div>

              {/* Note to supplier */}
              <div style={{ marginBottom: 12 }}>
                <label style={{
                  display: 'block', fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--muted)', marginBottom: 6, fontFamily: 'DM Sans',
                }}>Tedarikçiye Not (İsteğe Bağlı)</label>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="ör. Sabah 09:00'a kadar teslim, az yağlı olsun…"
                  rows={3}
                  style={{
                    width: '100%', padding: '10px 12px',
                    background: 'var(--surface2)', border: '1px solid var(--border)',
                    borderRadius: 9, color: 'var(--text)', fontSize: 12,
                    fontFamily: 'DM Sans', resize: 'vertical', minHeight: 56,
                    outline: 'none', transition: 'border 0.18s ease',
                    lineHeight: 1.45,
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--blue)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <button onClick={() => {
                const now = new Date();
                const months = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
                const dateStr = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} · ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
                const orderId = '#' + String(Math.floor(1000 + Math.random() * 9000));
                const newOrder = {
                  id: orderId,
                  firm: FIRM_NAMES[firmId] || 'Tedarikçi',
                  firmId: firmId,
                  customer: customerName || 'Müşteri',
                  date: dateStr,
                  amount: total,
                  status: 'bekliyor',
                  items: cartItems.map(c => ({ name: c.name, qty: c.qty, unit: c.unit, price: c.price })),
                  note: note.trim(),
                };
                addOrder && addOrder(newOrder);
                setCartItems([]);
                setNote('');
                showToast && showToast('Sipariş gönderildi · tedarikçi onayı bekleniyor');
                onNavigate && onNavigate('orders');
              }} style={{
                width: '100%', padding: '13px 0', borderRadius: 11,
                background: 'var(--blue)', border: 'none', color: '#fff',
                fontSize: 14, fontFamily: 'DM Sans', fontWeight: 700,
                cursor: 'pointer', transition: 'opacity 0.15s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <Icon name="check" size={14} color="#fff" />
                Siparişi Tamamla
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

// ─── SCREEN 4: SİPARİŞ GEÇMİŞİ / FATURALAR ──────────────────────────────────
const ORDERS_DATA = [
  { id: '#0042', firm: 'Devran Döner', firmId: 'devran', date: '28 Nis 2025 · 12:30', amount: 340.50, status: 'bekliyor', items: [{ name: 'Dana Döner Eti', qty: 10, unit: 'kg', price: 18.5 }, { name: 'Acı Sos', qty: 5, unit: 'lt', price: 4.5 }], note: 'Teslimat 09:00' },
  { id: '#0041', firm: 'Mirva', firmId: 'mirva', date: '27 Nis 2025', amount: 190.00, status: 'onaylandi', items: [{ name: 'Kuzulu Et', qty: 8, unit: 'kg', price: 22.0 }, { name: 'Özel Sos', qty: 2, unit: 'lt', price: 5.5 }], note: '' },
  { id: '#0040', firm: 'Baklavacı', firmId: 'baklavaci', date: '26 Nis 2025', amount: 85.00, status: 'onaylandi', items: [{ name: 'Fıstıklı Baklava', qty: 2, unit: 'kg', price: 35.0 }, { name: 'Kadayıf', qty: 1, unit: 'kg', price: 22.0 }], note: '' },
  { id: '#0039', firm: 'Kervan Food', firmId: 'kervan', date: '25 Nis 2025', amount: 62.00, status: 'iptal', items: [{ name: 'Lavash Ekmeği', qty: 50, unit: 'adet', price: 0.8 }, { name: 'Domates', qty: 10, unit: 'kg', price: 2.5 }], note: 'Sabah erken' },
  { id: '#0038', firm: 'Devran Döner', firmId: 'devran', date: '24 Nis 2025', amount: 222.00, status: 'onaylandi', items: [{ name: 'Tavuk Döner Eti', qty: 12, unit: 'kg', price: 11.0 }, { name: 'Sarımsaklı Sos', qty: 6, unit: 'lt', price: 4.0 }], note: '' },
];

// Eski statü değerlerini 3-statü modeline normalize et
const normalizeStatus = (s) => {
  if (s === 'beklemede') return 'bekliyor';
  if (s === 'tamamlandi') return 'onaylandi';
  if (s === 'hazirlaniyor') return 'bekliyor';
  return s || 'bekliyor';
};

const OrdersScreen = ({ onNavigate, firmId, orders, showToast }) => {
  const isMobile = useIsMobile();
  const [selectedOrder, setSelectedOrder] = React.useState(null);
  const { getStatus, getStatusMeta, setStatus } = useOrderStatuses();
  const allOrders = orders || ORDERS_DATA;
  const filtered = firmId ? allOrders.filter(o => o.firmId === firmId) : allOrders;
  const firmName = FIRM_NAMES[firmId] || '';

  // Bir siparişin canlı durumunu hesapla
  const liveStatus = (order) => {
    const override = getStatusMeta(order.id);
    if (override) return override.status;
    return normalizeStatus(order.status);
  };

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="fade-up" style={{ marginBottom: 22 }}>
        <SectionLabel style={{ marginBottom: 6 }}>Faturalarım</SectionLabel>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
          {firmName}
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', marginTop: 4 }}>
          {filtered.length} sipariş — yeniden eskiye sıralanmış
        </p>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 12, padding: '40px 24px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, color: 'var(--text-soft)' }}>
            Bu firmaya ait sipariş bulunmuyor.
          </div>
        </div>
      )}

      {/* Table (desktop) */}
      {filtered.length > 0 && !isMobile && (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '90px 1fr 90px 100px 110px 80px',
          padding: '10px 18px', borderBottom: '1px solid var(--border)',
        }}>
          {['Tarih', 'Tedarikçi', 'No', 'Tutar', 'Durum', 'Detay'].map(h => (
            <SectionLabel key={h} style={{ justifySelf: h === 'Tutar' ? 'end' : h === 'Detay' ? 'center' : 'start' }}>{h}</SectionLabel>
          ))}
        </div>
        {filtered.map((order, i) => (
          <div key={order.id}
            onClick={() => setSelectedOrder(order)}
            style={{
              display: 'grid', gridTemplateColumns: '90px 1fr 90px 100px 110px 80px',
              padding: '13px 18px', alignItems: 'center',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer', transition: 'background 0.18s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>{order.date}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={order.firm} size={26} />
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{order.firm}</span>
            </div>
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{order.id}</span>
            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, justifySelf: 'end' }}>€ {order.amount.toFixed(2)}</span>
            <div>
              <StatusBadge status={liveStatus(order)} size="sm" />
            </div>
            <div style={{ justifySelf: 'center' }}>
              <Btn variant="ghost" size="sm" icon="eye"></Btn>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Cards (mobile) */}
      {filtered.length > 0 && isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map((order) => (
            <div key={order.id}
              onClick={() => setSelectedOrder(order)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '14px 16px', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={order.firm} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>{order.firm}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{order.id} · {order.date}</div>
                </div>
                <StatusBadge status={liveStatus(order)} size="sm" />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>€ {order.amount.toFixed(2)}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--blue-light)', fontWeight: 500 }}>
                  <Icon name="eye" size={13} color="currentColor" /> Detay
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order detail drawer */}
      <Drawer open={!!selectedOrder} onClose={() => setSelectedOrder(null)} title={`Sipariş ${selectedOrder?.id}`}>
        {selectedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Avatar name={selectedOrder.firm} size={40} active />
              <div>
                <div style={{ fontSize: 15, color: 'var(--text)', fontWeight: 500 }}>{selectedOrder.firm}</div>
                <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>{selectedOrder.date}</div>
              </div>
            </div>
            <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '16px', border: '1px solid var(--border)' }}>
              <SectionLabel style={{ marginBottom: 12 }}>Ürünler</SectionLabel>
              {selectedOrder.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < selectedOrder.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div>
                    <div style={{ fontSize: 13, color: 'var(--text)' }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{item.qty} {item.unit} × € {item.price.toFixed(2)}</div>
                  </div>
                  <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>€ {(item.qty * item.price).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, marginTop: 4 }}>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, color: 'var(--text)' }}>Toplam</span>
                <span style={{ fontSize: 15, color: 'var(--blue-light)', fontWeight: 600 }}>€ {selectedOrder.amount.toFixed(2)}</span>
              </div>
            </div>
            {selectedOrder.note && (
              <div style={{ background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 10, padding: '12px 16px' }}>
                <SectionLabel style={{ marginBottom: 6 }}>Not</SectionLabel>
                <p style={{ fontSize: 13, color: 'var(--text)' }}>{selectedOrder.note}</p>
              </div>
            )}

            {/* 2sa kilit/iptal bandı */}
            <DonerciOrderLockBanner
              order={selectedOrder}
              status={liveStatus(selectedOrder)}
              statusMeta={getStatusMeta(selectedOrder.id)}
              showToast={showToast}
              onCancel={() => {
                if (!window.confirm(`${selectedOrder.id} numaralı siparişi iptal etmek istediğinize emin misiniz?`)) return;
                setStatus(selectedOrder.id, 'iptal', 'donerci');
                simulateMail(showToast, { to: selectedOrder.firm, subject: `Sipariş ${selectedOrder.id} müşteri tarafından iptal edildi` });
                setSelectedOrder(null);
              }}
            />
          </div>
        )}
      </Drawer>
    </div>
  );
};

// ─── SCREEN 7: TOPLAM BORÇ ────────────────────────────────────────────────────
const DebtScreen = () => {
  const isMobile = useIsMobile();
  const debts = [
    { firm: 'Devran Döner', firmId: 'devran', amount: 1240, max: 1500, due: '05 May 2025', overdue: false },
    { firm: 'Mirva', firmId: 'mirva', amount: 580, max: 1000, due: '01 May 2025', overdue: false },
    { firm: 'Baklavacı', firmId: 'baklavaci', amount: 320, max: 600, due: '29 Nis 2025', overdue: true },
    { firm: 'Kervan Food', firmId: 'kervan', amount: 140, max: 400, due: '10 May 2025', overdue: false },
  ];
  const total = debts.reduce((s, d) => s + d.amount, 0);

  const openInvoices = [
    { id: '#INV-091', firm: 'Devran Döner', amount: 340.50, date: '15 Nis 2025', due: '30 Nis 2025', overdue: false },
    { id: '#INV-090', firm: 'Baklavacı', amount: 85.00, date: '12 Nis 2025', due: '27 Nis 2025', overdue: true },
    { id: '#INV-089', firm: 'Mirva', amount: 190.00, date: '10 Nis 2025', due: '25 Nis 2025', overdue: true },
    { id: '#INV-088', firm: 'Kervan Food', amount: 62.00, date: '08 Nis 2025', due: '03 May 2025', overdue: false },
  ];

  return (
    <div className="fade-in">
      {/* Big total */}
      <div className="fade-up" style={{ marginBottom: 36, textAlign: 'center' }}>
        <SectionLabel style={{ marginBottom: 10, textAlign: 'center' }}>Toplam Açık Borç</SectionLabel>
        <div style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: 52, fontWeight: 600,
          color: 'var(--blue-light)', letterSpacing: '-0.01em', lineHeight: 1,
        }}>€ {total.toLocaleString('tr-TR')}</div>
        <div style={{ fontSize: 13, color: 'var(--text-soft)', marginTop: 8 }}>4 tedarikçiye toplam borç</div>
      </div>

      {/* Debt breakdown cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 36 }}>
        {debts.map((d, i) => (
          <div key={d.firmId} className={`fade-up-${i + 1}`} style={{
            background: 'var(--surface)', border: `1px solid ${d.overdue ? 'rgba(201,168,76,0.25)' : 'var(--border)'}`,
            borderRadius: 12, padding: '18px 18px 16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <Avatar name={d.firm} size={32} active={d.overdue} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{d.firm}</div>
                <div style={{ fontSize: 11, color: d.overdue ? 'var(--gold)' : 'var(--text-soft)', marginTop: 1 }}>
                  Vade: {d.due} {d.overdue && '⚠'}
                </div>
              </div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>
                € {d.amount.toLocaleString('tr-TR')}
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 4, background: 'var(--surface2)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', width: `${(d.amount / d.max) * 100}%`,
                background: d.overdue ? 'var(--gold)' : 'var(--blue)',
                borderRadius: 4, transition: 'width 0.8s ease',
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--muted)' }}>
              <span>€ {d.amount.toLocaleString()}</span>
              <span>Limit: € {d.max.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Open invoices */}
      <SectionLabel style={{ marginBottom: 12 }}>Açık Faturalar</SectionLabel>
      {!isMobile && (
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 90px 90px 100px', padding: '10px 18px', borderBottom: '1px solid var(--border)' }}>
          {['No', 'Firma', 'Tutar', 'Tarih', 'Vade'].map(h => (
            <SectionLabel key={h} style={{ justifySelf: h === 'Tutar' ? 'end' : 'start' }}>{h}</SectionLabel>
          ))}
        </div>
        {openInvoices.map((inv, i) => (
          <div key={inv.id} style={{
            display: 'grid', gridTemplateColumns: '80px 1fr 90px 90px 100px',
            padding: '12px 18px', alignItems: 'center',
            borderBottom: i < openInvoices.length - 1 ? '1px solid var(--border)' : 'none',
            transition: 'background 0.18s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{inv.id}</span>
            <span style={{ fontSize: 13, color: 'var(--text)' }}>{inv.firm}</span>
            <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, justifySelf: 'end' }}>€ {inv.amount.toFixed(2)}</span>
            <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>{inv.date}</span>
            <div>
              {inv.overdue
                ? <Badge status="beklemede">Vadesi Geçti</Badge>
                : <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>{inv.due}</span>
              }
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Open invoices — cards (mobile) */}
      {isMobile && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {openInvoices.map((inv) => (
            <div key={inv.id} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px 16px',
              display: 'flex', flexDirection: 'column', gap: 8,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>{inv.firm}</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>€ {inv.amount.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{inv.id} · {inv.date}</span>
                {inv.overdue
                  ? <Badge status="beklemede">Vadesi Geçti</Badge>
                  : <span style={{ fontSize: 11, color: 'var(--text-soft)' }}>Vade: {inv.due}</span>
                }
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Export all donerci screens
Object.assign(window, {
  HomeScreen, SupplierScreen, NewOrderScreen, OrdersScreen, DebtScreen,
  PRODUCTS, FIRM_NAMES, FIRM_DESCS, ORDERS_DATA,
});
