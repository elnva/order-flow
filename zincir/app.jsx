
const App = () => {
  const [role, setRole] = React.useState('donerci');
  const [currentScreen, setCurrentScreen] = React.useState('home');
  const [activeFirm, setActiveFirm] = React.useState('devran');
  const [cartItems, setCartItems] = React.useState([]);
  const [orders, setOrders] = React.useState(() => (typeof ORDERS_DATA !== 'undefined' ? ORDERS_DATA : []));
  const addOrder = (order) => setOrders(prev => [order, ...prev]);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [toast, setToast] = React.useState({ visible: false, message: '' });

  // ── Profiles (rol başına ayrı) ─────────────────────────────────────────
  const DEFAULT_DONERCI = {
    name: 'Ahmet Yılmaz', email: 'info@turkdoner.com', phone: '+39 02 1234567',
    company: 'Türk Döner Ltd.', address: 'Via Roma 12, Milano',
    vat: '', role: 'donerci',
  };
  const DEFAULT_TEDARIKCI = {
    name: 'Devran Demir', email: 'info@devrandoner.com', phone: '+39 02 0000000',
    company: 'Devran Döner Et Ürünleri', address: 'Via Industriale 45, Milano',
    vat: 'IT12345678901', role: 'tedarikci',
  };

  const [donerciProfile, setDonerciProfile] = React.useState(() => {
    try {
      const saved = localStorage.getItem('zincir-profile-donerci');
      return saved ? { ...DEFAULT_DONERCI, ...JSON.parse(saved) } : DEFAULT_DONERCI;
    } catch { return DEFAULT_DONERCI; }
  });
  const [tedarikciProfile, setTedarikciProfile] = React.useState(() => {
    try {
      const saved = localStorage.getItem('zincir-profile-tedarikci');
      return saved ? { ...DEFAULT_TEDARIKCI, ...JSON.parse(saved) } : DEFAULT_TEDARIKCI;
    } catch { return DEFAULT_TEDARIKCI; }
  });

  const profile = role === 'donerci' ? donerciProfile : tedarikciProfile;
  const saveProfile = (data) => {
    if (role === 'donerci') {
      setDonerciProfile(data);
      try { localStorage.setItem('zincir-profile-donerci', JSON.stringify(data)); } catch {}
    } else {
      setTedarikciProfile(data);
      try { localStorage.setItem('zincir-profile-tedarikci', JSON.stringify(data)); } catch {}
    }
    showToast('Profil güncellendi.');
  };

  // ── Theme ──────────────────────────────────────────────────────────────────
  const [theme, setTheme] = React.useState(() => {
    try { return localStorage.getItem('zincir-theme') || 'dark'; } catch { return 'dark'; }
  });
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('zincir-theme', theme); } catch {}
  }, [theme]);
  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 3500);
  };

  const navigate = (screen) => {
    setCurrentScreen(screen);
    setSidebarOpen(false);
  };

  const switchRole = (newRole) => {
    setRole(newRole);
    setCurrentScreen(newRole === 'donerci' ? 'home' : 'supplier-orders');
    setCartItems([]);
  };

  const renderScreen = () => {
    if (role === 'donerci') {
      switch (currentScreen) {
        case 'home':      return <HomeScreen onNavigate={navigate} onFirmSelect={setActiveFirm} />;
        case 'supplier':  return <SupplierScreen firmId={activeFirm} onNavigate={navigate} cartItems={cartItems} setCartItems={setCartItems} />;
        case 'new-order': return <NewOrderScreen firmId={activeFirm} cartItems={cartItems} setCartItems={setCartItems} onNavigate={navigate} showToast={showToast} addOrder={addOrder} />;
        case 'orders':    return <OrdersScreen onNavigate={navigate} firmId={activeFirm} orders={orders} showToast={showToast} />;
        case 'debt':      return <DebtScreen />;
        case 'profile':   return <ProfileScreen profile={profile} onSave={saveProfile} />;
        default:          return <HomeScreen onNavigate={navigate} />;
      }
    } else {
      switch (currentScreen) {
        case 'supplier-orders':    return <SupplierOrdersScreen supplier={tedarikciProfile} showToast={showToast} />;
        case 'supplier-customers': return <SupplierCustomersScreen />;
        case 'supplier-debt':      return <SupplierDebtScreen />;
        case 'supplier-products':  return <SupplierProductsScreen />;
        case 'profile':            return <ProfileScreen profile={profile} onSave={saveProfile} />;
        default:                   return <SupplierOrdersScreen supplier={tedarikciProfile} showToast={showToast} />;
      }
    }
  };

  const screenTitle = {
    home: 'Anasayfa',
    supplier: FIRM_NAMES[activeFirm] || 'Tedarikçi',
    'new-order': 'Yeni Sipariş',
    orders: 'Siparişlerim',
    debt: 'Toplam Borcum',
    'supplier-orders':    'Gelen Siparişler',
    'supplier-customers': 'Müşteriler',
    'supplier-debt':      'Borç & Ödeme Takibi',
    'supplier-products':  'Ürün Kataloğu',
    'profile':            'Profilim',
  }[currentScreen] || '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Role switcher bar */}
      <div style={{
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center',
        gap: 4, padding: '8px 16px',
        flexShrink: 0, position: 'relative', zIndex: 20,
      }}>
        <div style={{
          display: 'flex', background: 'var(--surface)',
          border: '1px solid var(--border)', borderRadius: 10, padding: 3, gap: 2,
        }}>
          {[['donerci', 'Dönerci Paneli', 'cart'], ['tedarikci', 'Tedarikçi Paneli', 'truck']].map(([r, label, icon]) => (
            <button key={r} onClick={() => switchRole(r)} style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: role === r ? 'var(--blue)' : 'transparent',
              color: role === r ? '#fff' : 'var(--text-soft)',
              fontSize: 12, fontFamily: 'DM Sans', fontWeight: 500,
              transition: 'all 0.18s ease', letterSpacing: '0.01em',
            }}>
              <Icon name={icon} size={13} color="currentColor" />
              {label}
            </button>
          ))}
        </div>
        <div style={{
          position: 'absolute', right: 16,
          fontSize: 10, color: 'var(--muted)', fontFamily: 'DM Sans',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>Prototip</div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        <Sidebar
          activeFirm={activeFirm}
          onFirmSelect={(id) => { setActiveFirm(id); }}
          currentScreen={currentScreen}
          onScreenChange={navigate}
          role={role}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          supplierBadges={role === 'tedarikci' ? { 'supplier-orders': (typeof countTodayOrders !== 'undefined' ? countTodayOrders() : 0) } : {}}
        />

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
          <Topbar
            role={role}
            activeFirmName={FIRM_NAMES[activeFirm]}
            onMenuToggle={() => setSidebarOpen(v => !v)}
            theme={theme}
            onToggleTheme={toggleTheme}
            profile={profile}
            onProfileClick={() => navigate('profile')}
          />

          {/* Breadcrumb */}
          <div style={{
            padding: '8px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg)',
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
          }}>
            <button
              onClick={() => navigate(role === 'donerci' ? 'home' : 'supplier-orders')}
              style={{
                background: 'transparent', border: 'none', padding: '2px 6px',
                fontSize: 11, color: 'var(--muted)', cursor: 'pointer',
                borderRadius: 4, fontFamily: 'DM Sans', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted)'; e.currentTarget.style.background = 'transparent'; }}
            >
              {role === 'donerci' ? 'Dönerci' : 'Tedarikçi'}
            </button>
            {screenTitle && (
              <>
                <Icon name="chevron" size={10} color="var(--muted)" />
                <button
                  onClick={() => navigate(currentScreen)}
                  style={{
                    background: 'transparent', border: 'none', padding: '2px 6px',
                    fontSize: 11, color: 'var(--text-soft)', cursor: 'pointer',
                    borderRadius: 4, fontFamily: 'DM Sans', fontWeight: 500,
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.background = 'var(--surface)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-soft)'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {screenTitle}
                </button>
              </>
            )}
          </div>

          {/* Content area */}
          <main style={{
            flex: 1, overflowY: 'auto', padding: '28px 28px 20px',
            position: 'relative',
          }}>
            {renderScreen()}
            <div style={{ height: 32 }} />
          </main>

          <Footer />
        </div>
      </div>

      {/* Toast */}
      <Toast visible={toast.visible} message={toast.message} type={toast.type} />

      {/* Mobile menu button */}
      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
