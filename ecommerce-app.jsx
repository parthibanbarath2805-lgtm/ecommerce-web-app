import { useState, useReducer, createContext, useContext } from "react";

// ─── Theme & Design Tokens ───────────────────────────────────────────────────
const COLORS = {
  ink: "#0D0D0D",
  slate: "#1E2A3A",
  steel: "#2D4A6B",
  sky: "#3B82F6",
  skyLight: "#EFF6FF",
  emerald: "#10B981",
  emeraldLight: "#ECFDF5",
  crimson: "#EF4444",
  amber: "#F59E0B",
  mist: "#F8FAFC",
  cloud: "#E2E8F0",
  silver: "#94A3B8",
  white: "#FFFFFF",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", price: 2499, category: "Electronics", stock: 15, rating: 4.8, reviews: 234, image: "🎧", description: "Premium sound with 30hr battery life and active noise cancellation." },
  { id: 2, name: "Mechanical Gaming Keyboard", price: 3999, category: "Electronics", stock: 8, rating: 4.6, reviews: 189, image: "⌨️", description: "RGB backlit, tactile switches, full N-key rollover for gaming." },
  { id: 3, name: "4K Webcam Pro", price: 5499, category: "Electronics", stock: 5, rating: 4.7, reviews: 92, image: "📷", description: "Crystal-clear 4K streaming with auto-focus and low-light correction." },
  { id: 4, name: "Ergonomic Office Chair", price: 12999, category: "Furniture", stock: 3, rating: 4.9, reviews: 411, image: "🪑", description: "Lumbar support, adjustable armrests, breathable mesh back." },
  { id: 5, name: "Standing Desk (Electric)", price: 18999, category: "Furniture", stock: 2, rating: 4.8, reviews: 167, image: "🪵", description: "Motorized height adjustment, memory presets, cable management." },
  { id: 6, name: "Smart LED Desk Lamp", price: 1299, category: "Home", stock: 22, rating: 4.5, reviews: 308, image: "💡", description: "Touch dimming, USB charging port, eye-care mode, warm/cool light." },
  { id: 7, name: "Portable SSD 1TB", price: 4299, category: "Electronics", stock: 11, rating: 4.9, reviews: 556, image: "💾", description: "540MB/s read speed, shock-resistant, USB-C compatible." },
  { id: 8, name: "Bamboo Phone Stand", price: 699, category: "Home", stock: 30, rating: 4.4, reviews: 203, image: "📱", description: "Eco-friendly, adjustable angle, fits phones and small tablets." },
];

const CATEGORIES = ["All", "Electronics", "Furniture", "Home"];

// ─── Cart Reducer ─────────────────────────────────────────────────────────────
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD": {
      const exists = state.find(i => i.id === action.product.id);
      if (exists) return state.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case "REMOVE": return state.filter(i => i.id !== action.id);
    case "INC": return state.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case "DEC": return state.map(i => i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i);
    case "CLEAR": return [];
    default: return state;
  }
};

// ─── Auth & Cart Context ──────────────────────────────────────────────────────
const AppContext = createContext();

// ─── Styles ───────────────────────────────────────────────────────────────────
const S = {
  app: { fontFamily: "'Inter', sans-serif", background: COLORS.mist, minHeight: "100vh", color: COLORS.ink },
  nav: { background: COLORS.slate, padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.15)" },
  navLogo: { color: COLORS.white, fontWeight: 800, fontSize: 22, letterSpacing: -1 },
  navLogoAccent: { color: COLORS.sky },
  navLinks: { display: "flex", gap: 8, alignItems: "center" },
  navBtn: (active) => ({ background: active ? COLORS.sky : "transparent", color: COLORS.white, border: "none", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }),
  cartBadge: { background: COLORS.crimson, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 11, display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 4, fontWeight: 700 },
  main: { maxWidth: 1100, margin: "0 auto", padding: "28px 16px" },
  hero: { background: `linear-gradient(135deg, ${COLORS.slate} 0%, ${COLORS.steel} 100%)`, borderRadius: 16, padding: "40px 36px", marginBottom: 32, color: COLORS.white },
  heroTag: { background: COLORS.sky, color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, letterSpacing: 1, display: "inline-block", marginBottom: 14 },
  heroTitle: { fontSize: 32, fontWeight: 800, lineHeight: 1.2, marginBottom: 10 },
  heroSub: { color: COLORS.cloud, fontSize: 16, marginBottom: 22 },
  heroBtn: { background: COLORS.sky, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 16, fontWeight: 700, cursor: "pointer" },
  filterBar: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap", alignItems: "center" },
  filterBtn: (active) => ({ background: active ? COLORS.sky : COLORS.white, color: active ? "#fff" : COLORS.slate, border: `1.5px solid ${active ? COLORS.sky : COLORS.cloud}`, padding: "8px 18px", borderRadius: 20, cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s" }),
  searchInput: { flex: 1, padding: "10px 16px", borderRadius: 20, border: `1.5px solid ${COLORS.cloud}`, fontSize: 14, outline: "none", minWidth: 180, background: COLORS.white },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 },
  card: { background: COLORS.white, borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: `1px solid ${COLORS.cloud}`, display: "flex", flexDirection: "column", gap: 10 },
  cardEmoji: { fontSize: 52, textAlign: "center", background: COLORS.skyLight, borderRadius: 10, padding: "16px 0" },
  cardCat: { fontSize: 11, color: COLORS.sky, fontWeight: 700, letterSpacing: 1 },
  cardName: { fontWeight: 700, fontSize: 15, lineHeight: 1.3, color: COLORS.ink },
  cardDesc: { fontSize: 13, color: COLORS.silver, lineHeight: 1.5 },
  cardFooter: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" },
  cardPrice: { fontWeight: 800, fontSize: 18, color: COLORS.slate },
  cardRating: { fontSize: 12, color: COLORS.amber, fontWeight: 600 },
  addBtn: { background: COLORS.sky, color: "#fff", border: "none", padding: "9px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14, transition: "all 0.2s" },
  stockBadge: (low) => ({ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: low ? "#FEF3C7" : COLORS.emeraldLight, color: low ? "#92400E" : "#065F46", fontWeight: 600 }),
  // Cart
  cartPanel: { maxWidth: 700, margin: "0 auto" },
  cartEmpty: { textAlign: "center", padding: 60, color: COLORS.silver },
  cartItem: { background: COLORS.white, borderRadius: 12, padding: "16px 20px", marginBottom: 12, display: "flex", alignItems: "center", gap: 16, border: `1px solid ${COLORS.cloud}` },
  cartItemEmoji: { fontSize: 36, background: COLORS.skyLight, borderRadius: 8, padding: "8px 12px" },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontWeight: 700, fontSize: 15, color: COLORS.ink },
  cartItemPrice: { fontSize: 13, color: COLORS.silver, marginTop: 2 },
  qtyControl: { display: "flex", alignItems: "center", gap: 8 },
  qtyBtn: { background: COLORS.mist, border: `1.5px solid ${COLORS.cloud}`, width: 30, height: 30, borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  qtyNum: { fontWeight: 700, minWidth: 24, textAlign: "center" },
  removeBtn: { background: "none", border: "none", color: COLORS.crimson, cursor: "pointer", fontWeight: 700, fontSize: 20 },
  orderSummary: { background: COLORS.white, borderRadius: 12, padding: 20, border: `1px solid ${COLORS.cloud}`, marginTop: 20 },
  summaryRow: { display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 14, color: COLORS.silver, borderBottom: `1px solid ${COLORS.mist}` },
  summaryTotal: { display: "flex", justifyContent: "space-between", padding: "12px 0 0", fontSize: 18, fontWeight: 800, color: COLORS.slate },
  checkoutBtn: { width: "100%", background: COLORS.emerald, color: "#fff", border: "none", padding: 16, borderRadius: 10, fontSize: 16, fontWeight: 800, cursor: "pointer", marginTop: 16 },
  // Auth
  authWrap: { maxWidth: 400, margin: "60px auto", background: COLORS.white, borderRadius: 16, padding: 36, boxShadow: "0 4px 24px rgba(0,0,0,0.10)", border: `1px solid ${COLORS.cloud}` },
  authTitle: { fontWeight: 800, fontSize: 24, marginBottom: 6, color: COLORS.slate },
  authSub: { color: COLORS.silver, fontSize: 14, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: 600, color: COLORS.slate, display: "block", marginBottom: 6 },
  input: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1.5px solid ${COLORS.cloud}`, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 16 },
  authBtn: { width: "100%", background: COLORS.sky, color: "#fff", border: "none", padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 4 },
  authSwitch: { textAlign: "center", marginTop: 18, fontSize: 13, color: COLORS.silver },
  authSwitchLink: { color: COLORS.sky, cursor: "pointer", fontWeight: 600 },
  // Admin
  adminHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  adminTable: { background: COLORS.white, borderRadius: 12, border: `1px solid ${COLORS.cloud}`, overflow: "hidden", width: "100%" },
  th: { background: COLORS.slate, color: "#fff", padding: "12px 16px", textAlign: "left", fontSize: 13, fontWeight: 700 },
  td: { padding: "12px 16px", fontSize: 14, borderBottom: `1px solid ${COLORS.mist}`, color: COLORS.ink },
  badge: (color) => ({ background: color === "green" ? COLORS.emeraldLight : color === "amber" ? "#FEF3C7" : "#FEE2E2", color: color === "green" ? "#065F46" : color === "amber" ? "#92400E" : "#991B1B", padding: "3px 10px", borderRadius: 6, fontSize: 12, fontWeight: 700 }),
  pageTitle: { fontWeight: 800, fontSize: 24, color: COLORS.slate, marginBottom: 4 },
  pageSub: { color: COLORS.silver, fontSize: 14, marginBottom: 24 },
  // Order success
  successBox: { textAlign: "center", padding: "60px 24px", background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.cloud}`, maxWidth: 500, margin: "0 auto" },
};

// ─── Components ───────────────────────────────────────────────────────────────

function StarRating({ rating }) {
  return <span style={S.cardRating}>{"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))} {rating} </span>;
}

function Navbar({ page, setPage, cart, user, setUser }) {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  return (
    <nav style={S.nav}>
      <span style={S.navLogo} onClick={() => setPage("shop")} className="cursor-pointer">
        Shop<span style={S.navLogoAccent}>Nexus</span>
      </span>
      <div style={S.navLinks}>
        <button style={S.navBtn(page === "shop")} onClick={() => setPage("shop")}>🛍 Shop</button>
        <button style={S.navBtn(page === "cart")} onClick={() => setPage("cart")}>
          🛒 Cart{total > 0 && <span style={S.cartBadge}>{total}</span>}
        </button>
        {user ? (
          <>
            {user.role === "admin" && (
              <button style={S.navBtn(page === "admin")} onClick={() => setPage("admin")}>⚙️ Admin</button>
            )}
            {page === "orders" ? null : (
              <button style={S.navBtn(page === "orders")} onClick={() => setPage("orders")}>📦 Orders</button>
            )}
            <button style={{ ...S.navBtn(false), background: "#ffffff22" }} onClick={() => { setUser(null); setPage("shop"); }}>
              👤 {user.name.split(" ")[0]} · Logout
            </button>
          </>
        ) : (
          <button style={S.navBtn(page === "login")} onClick={() => setPage("login")}>Login</button>
        )}
      </div>
    </nav>
  );
}

function ProductCard({ product, onAdd }) {
  const low = product.stock <= 5;
  return (
    <div style={S.card}>
      <div style={S.cardEmoji}>{product.image}</div>
      <div>
        <div style={S.cardCat}>{product.category.toUpperCase()}</div>
        <div style={S.cardName}>{product.name}</div>
      </div>
      <div style={S.cardDesc}>{product.description}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <StarRating rating={product.rating} />
        <span style={{ fontSize: 12, color: COLORS.silver }}>({product.reviews})</span>
      </div>
      <div style={S.cardFooter}>
        <div>
          <div style={S.cardPrice}>₹{product.price.toLocaleString()}</div>
          <span style={S.stockBadge(low)}>{low ? `⚠ Only ${product.stock} left` : `✓ In Stock`}</span>
        </div>
        <button style={S.addBtn} onClick={() => onAdd(product)}>+ Add</button>
      </div>
    </div>
  );
}

function ShopPage({ cart, dispatch, user }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = PRODUCTS.filter(p =>
    (cat === "All" || p.category === cat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={S.hero}>
        <div style={S.heroTag}>NEW ARRIVALS 2026</div>
        <div style={S.heroTitle}>Tech & Home Essentials<br />Delivered Fast</div>
        <div style={S.heroSub}>Premium products. Honest prices. No gimmicks.</div>
        <button style={S.heroBtn}>Explore All →</button>
      </div>
      <div style={S.filterBar}>
        <input style={S.searchInput} placeholder="🔍  Search products…" value={search} onChange={e => setSearch(e.target.value)} />
        {CATEGORIES.map(c => (
          <button key={c} style={S.filterBtn(cat === c)} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: COLORS.silver }}>No products found for "{search}"</div>
      ) : (
        <div style={S.grid}>
          {filtered.map(p => (
            <ProductCard key={p.id} product={p} onAdd={product => dispatch({ type: "ADD", product })} />
          ))}
        </div>
      )}
    </div>
  );
}

function CartPage({ cart, dispatch, setPage, user }) {
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  if (cart.length === 0) return (
    <div style={S.cartEmpty}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 8, color: COLORS.slate }}>Your cart is empty</div>
      <div>Add some products to get started!</div>
    </div>
  );

  return (
    <div style={S.cartPanel}>
      <div style={S.pageTitle}>Your Cart</div>
      <div style={S.pageSub}>{cart.length} item{cart.length > 1 ? "s" : ""} in your bag</div>
      {cart.map(item => (
        <div key={item.id} style={S.cartItem}>
          <div style={S.cartItemEmoji}>{item.image}</div>
          <div style={S.cartItemInfo}>
            <div style={S.cartItemName}>{item.name}</div>
            <div style={S.cartItemPrice}>₹{item.price.toLocaleString()} each</div>
          </div>
          <div style={S.qtyControl}>
            <button style={S.qtyBtn} onClick={() => dispatch({ type: "DEC", id: item.id })}>−</button>
            <span style={S.qtyNum}>{item.qty}</span>
            <button style={S.qtyBtn} onClick={() => dispatch({ type: "INC", id: item.id })}>+</button>
          </div>
          <div style={{ fontWeight: 700, minWidth: 80, textAlign: "right" }}>₹{(item.price * item.qty).toLocaleString()}</div>
          <button style={S.removeBtn} onClick={() => dispatch({ type: "REMOVE", id: item.id })}>×</button>
        </div>
      ))}
      <div style={S.orderSummary}>
        <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12, color: COLORS.slate }}>Order Summary</div>
        <div style={S.summaryRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
        <div style={S.summaryRow}><span>Shipping</span><span>{shipping === 0 ? "FREE 🎉" : `₹${shipping}`}</span></div>
        <div style={S.summaryRow}><span>GST (18%)</span><span>₹{tax.toLocaleString()}</span></div>
        <div style={S.summaryTotal}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        {shipping > 0 && <div style={{ fontSize: 12, color: COLORS.sky, marginTop: 8 }}>Add ₹{(5000 - subtotal).toLocaleString()} more for free shipping!</div>}
        <button style={S.checkoutBtn} onClick={() => user ? setPage("checkout") : setPage("login")}>
          {user ? "Proceed to Checkout →" : "Login to Checkout →"}
        </button>
      </div>
    </div>
  );
}

function CheckoutPage({ cart, dispatch, setPage, setOrders, user }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "", phone: "", address: "", city: "", pincode: "", payment: "card" });
  const [ordered, setOrdered] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal > 5000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const handleOrder = () => {
    const order = {
      id: "ORD" + Date.now(),
      items: cart,
      total,
      address: `${form.address}, ${form.city} - ${form.pincode}`,
      payment: form.payment,
      status: "Processing",
      date: new Date().toLocaleDateString("en-IN"),
    };
    setOrders(prev => [order, ...prev]);
    dispatch({ type: "CLEAR" });
    setOrdered(true);
  };

  if (ordered) return (
    <div style={S.successBox}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
      <div style={{ fontWeight: 800, fontSize: 26, color: COLORS.emerald, marginBottom: 8 }}>Order Placed!</div>
      <div style={{ color: COLORS.silver, marginBottom: 24 }}>Your order has been confirmed and is being processed.</div>
      <button style={S.checkoutBtn} onClick={() => setPage("orders")}>Track My Order →</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 540, margin: "0 auto" }}>
      <div style={S.pageTitle}>Checkout</div>
      <div style={S.pageSub}>Fill in your details to complete the order</div>

      <div style={{ background: COLORS.white, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.cloud}`, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: COLORS.slate, marginBottom: 16 }}>📦 Shipping Details</div>
        {[["Full Name", "name", "text"], ["Email", "email", "email"], ["Phone", "phone", "tel"], ["Address", "address", "text"], ["City", "city", "text"], ["PIN Code", "pincode", "text"]].map(([label, key, type]) => (
          <div key={key}>
            <label style={S.label}>{label}</label>
            <input style={S.input} type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={`Enter ${label.toLowerCase()}`} />
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.white, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.cloud}`, marginBottom: 16 }}>
        <div style={{ fontWeight: 700, color: COLORS.slate, marginBottom: 16 }}>💳 Payment Method</div>
        {[["card", "💳 Credit / Debit Card"], ["upi", "📱 UPI"], ["cod", "💵 Cash on Delivery"]].map(([val, label]) => (
          <label key={val} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, cursor: "pointer" }}>
            <input type="radio" value={val} checked={form.payment === val} onChange={() => setForm({ ...form, payment: val })} />
            <span style={{ fontWeight: 600 }}>{label}</span>
          </label>
        ))}
      </div>

      <div style={S.orderSummary}>
        <div style={S.summaryRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
        <div style={S.summaryRow}><span>Shipping</span><span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span></div>
        <div style={S.summaryRow}><span>GST</span><span>₹{tax.toLocaleString()}</span></div>
        <div style={S.summaryTotal}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        <button style={S.checkoutBtn} onClick={handleOrder}>✓ Confirm Order</button>
      </div>
    </div>
  );
}

function OrdersPage({ orders, user }) {
  if (!user) return <div style={S.cartEmpty}><div style={{ fontSize: 48 }}>🔒</div><div>Please login to view orders.</div></div>;
  if (orders.length === 0) return <div style={S.cartEmpty}><div style={{ fontSize: 48 }}>📦</div><div style={{ fontWeight: 700, marginTop: 12 }}>No orders yet</div></div>;

  const statusColor = { Processing: "amber", Shipped: "green", Delivered: "green", Cancelled: "red" };

  return (
    <div>
      <div style={S.pageTitle}>My Orders</div>
      <div style={S.pageSub}>{orders.length} order{orders.length > 1 ? "s" : ""} placed</div>
      {orders.map(o => (
        <div key={o.id} style={{ background: COLORS.white, borderRadius: 14, padding: 20, marginBottom: 16, border: `1px solid ${COLORS.cloud}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <div style={{ fontWeight: 800, color: COLORS.slate }}>{o.id}</div>
              <div style={{ fontSize: 13, color: COLORS.silver }}>{o.date} · {o.payment.toUpperCase()}</div>
            </div>
            <span style={S.badge(statusColor[o.status] || "amber")}>{o.status}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
            {o.items.map(i => (
              <div key={i.id} style={{ background: COLORS.mist, borderRadius: 8, padding: "6px 12px", fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}>
                <span>{i.image}</span><span>{i.name}</span><span style={{ color: COLORS.silver }}>×{i.qty}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: COLORS.silver }}>📍 {o.address}</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.slate }}>₹{o.total.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuthPage({ setUser, setPage, mode }) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");

  // Demo accounts
  const ACCOUNTS = [
    { name: "Admin User", email: "admin@shopnexus.com", password: "admin123", role: "admin" },
    { name: "Jane Customer", email: "jane@example.com", password: "user123", role: "user" },
  ];

  const handle = () => {
    setError("");
    if (isLogin) {
      const found = ACCOUNTS.find(a => a.email === form.email && a.password === form.password);
      if (found) { setUser(found); setPage("shop"); }
      else setError("Invalid email or password. Try admin@shopnexus.com / admin123");
    } else {
      if (!form.name || !form.email || !form.password) { setError("All fields are required."); return; }
      setUser({ name: form.name, email: form.email, role: "user" });
      setPage("shop");
    }
  };

  return (
    <div style={S.authWrap}>
      <div style={S.authTitle}>{isLogin ? "Welcome back 👋" : "Create account"}</div>
      <div style={S.authSub}>{isLogin ? "Login to track orders and checkout" : "Join ShopNexus — it's free"}</div>

      {!isLogin && (
        <><label style={S.label}>Full Name</label>
        <input style={S.input} placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></>
      )}
      <label style={S.label}>Email</label>
      <input style={S.input} type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <label style={S.label}>Password</label>
      <input style={S.input} type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />

      {error && <div style={{ color: COLORS.crimson, fontSize: 13, marginBottom: 12 }}>{error}</div>}
      <button style={S.authBtn} onClick={handle}>{isLogin ? "Login →" : "Create Account →"}</button>

      {isLogin && (
        <div style={{ marginTop: 14, padding: 12, background: COLORS.skyLight, borderRadius: 8, fontSize: 12, color: COLORS.steel }}>
          <strong>Demo:</strong> admin@shopnexus.com / admin123 (Admin)<br />
          jane@example.com / user123 (User)
        </div>
      )}

      <div style={S.authSwitch}>
        {isLogin ? "New here? " : "Already have an account? "}
        <span style={S.authSwitchLink} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Create account" : "Login"}
        </span>
      </div>
    </div>
  );
}

function AdminPage({ orders, setOrders }) {
  const [tab, setTab] = useState("products");

  const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div>
      <div style={S.pageTitle}>⚙️ Admin Dashboard</div>
      <div style={S.pageSub}>Manage products, view orders, track inventory</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["products", "orders", "stats"].map(t => (
          <button key={t} style={S.filterBtn(tab === t)} onClick={() => setTab(t)}>
            {t === "products" ? "📦 Products" : t === "orders" ? "📋 Orders" : "📊 Stats"}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <table style={S.adminTable}>
          <thead>
            <tr>
              {["#", "Product", "Category", "Price", "Stock", "Rating"].map(h => (
                <th key={h} style={S.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRODUCTS.map((p, i) => (
              <tr key={p.id}>
                <td style={S.td}>{p.image}</td>
                <td style={{ ...S.td, fontWeight: 600 }}>{p.name}</td>
                <td style={S.td}>{p.category}</td>
                <td style={{ ...S.td, fontWeight: 700 }}>₹{p.price.toLocaleString()}</td>
                <td style={S.td}><span style={S.badge(p.stock <= 5 ? "amber" : "green")}>{p.stock} units</span></td>
                <td style={S.td}>★ {p.rating} ({p.reviews})</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === "orders" && (
        orders.length === 0 ? (
          <div style={S.cartEmpty}>No orders yet.</div>
        ) : (
          <table style={S.adminTable}>
            <thead>
              <tr>{["Order ID", "Items", "Total", "Payment", "Status", "Action"].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={{ ...S.td, fontWeight: 700 }}>{o.id}</td>
                  <td style={S.td}>{o.items.map(i => i.name).join(", ").slice(0, 40)}…</td>
                  <td style={{ ...S.td, fontWeight: 700 }}>₹{o.total.toLocaleString()}</td>
                  <td style={S.td}>{o.payment.toUpperCase()}</td>
                  <td style={S.td}><span style={S.badge(o.status === "Delivered" ? "green" : o.status === "Cancelled" ? "red" : "amber")}>{o.status}</span></td>
                  <td style={S.td}>
                    <select value={o.status} onChange={e => setOrders(prev => prev.map(ord => ord.id === o.id ? { ...ord, status: e.target.value } : ord))}
                      style={{ padding: "5px 10px", borderRadius: 6, border: `1.5px solid ${COLORS.cloud}`, fontSize: 13 }}>
                      {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {tab === "stats" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { label: "Total Products", value: PRODUCTS.length, icon: "📦", color: COLORS.sky },
            { label: "Total Orders", value: orders.length, icon: "📋", color: COLORS.emerald },
            { label: "Revenue", value: `₹${orders.reduce((s, o) => s + o.total, 0).toLocaleString()}`, icon: "💰", color: COLORS.amber },
            { label: "Low Stock", value: PRODUCTS.filter(p => p.stock <= 5).length, icon: "⚠️", color: COLORS.crimson },
          ].map(stat => (
            <div key={stat.label} style={{ background: COLORS.white, borderRadius: 14, padding: 24, border: `1px solid ${COLORS.cloud}`, textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: COLORS.silver, marginTop: 4 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("shop");
  const [user, setUser] = useState(null);
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [orders, setOrders] = useState([]);

  return (
    <div style={S.app}>
      <Navbar page={page} setPage={setPage} cart={cart} user={user} setUser={setUser} />
      <div style={S.main}>
        {page === "shop" && <ShopPage cart={cart} dispatch={dispatch} user={user} />}
        {page === "cart" && <CartPage cart={cart} dispatch={dispatch} setPage={setPage} user={user} />}
        {page === "checkout" && <CheckoutPage cart={cart} dispatch={dispatch} setPage={setPage} setOrders={setOrders} user={user} />}
        {page === "orders" && <OrdersPage orders={orders} user={user} />}
        {page === "login" && <AuthPage setUser={setUser} setPage={setPage} mode="login" />}
        {page === "admin" && user?.role === "admin" && <AdminPage orders={orders} setOrders={setOrders} />}
      </div>
    </div>
  );
}
