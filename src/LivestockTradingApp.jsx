// src/LivestockTradingApp.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Heart,
  MessageCircle,
  Star,
  Upload,
  Phone,
  Mail,
  Shield,
  Eye,
  MapPin,
  Bell,
  Menu,
  X,
  Camera
} from "lucide-react";

/**
 * Single-file LivestockTradingApp
 * - Shows Home / Listings / Sell / Contact plus Login / Register
 * - Connects to backend at VITE_API_BASE or http://localhost:4000
 * - Stores token in localStorage and fetches /api/me
 *
 * Paste this file into src/ (replace your existing LivestockTradingApp.jsx)
 */

const LivestockTradingApp = () => {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  // view state
  const [currentView, setCurrentView] = useState("home"); // home, listings, sell, contact, detail, login, register
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [offers, setOffers] = useState([]);
  const [newOfferAmount, setNewOfferAmount] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // auth
  const [user, setUser] = useState(null);

  // sample data (demo)
  const [animals] = useState([
    {
      id: 1,
      name: "Premium Holstein Cow",
      breed: "Holstein",
      age: "3 years",
      price: 45000,
      location: "Punjab, India",
      seller: "Rajesh Farms",
      sellerPhone: "+91 98765 43210",
      sellerEmail: "rajesh@farms.com",
      rating: 4.8,
      images: ["/uploads/sample-cow-1.jpg"],
      description: "High milk yield, vaccinated, healthy",
      verified: true,
      category: "dairy"
    },
    {
      id: 2,
      name: "Strong Bull Ox",
      breed: "Gir",
      age: "4 years",
      price: 35000,
      location: "Gujarat, India",
      seller: "Patel Livestock",
      sellerPhone: "+91 91234 56789",
      sellerEmail: "patel@livestock.com",
      rating: 4.6,
      images: ["/uploads/sample-bull-1.jpg"],
      description: "Perfect for farming, well-trained",
      verified: true,
      category: "draft"
    }
  ]);

  const notifications = [
    { id: 1, type: "offer", message: "New offer received for Holstein Cow - ₹42,000", time: "2 mins ago" },
    { id: 2, type: "accepted", message: "Your offer of ₹30,000 was accepted!", time: "1 hour ago" }
  ];

  // read token and fetch current user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.user) setUser(data.user);
        else {
          localStorage.removeItem("token");
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  // ---------- UI subcomponents ----------

  const NavBar = () => (
    <div className="bg-green-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="text-2xl">🐄</div>
        <h1 className="text-xl font-bold cursor-pointer" onClick={() => setCurrentView("home")}>LiveStock Trade</h1>
      </div>

      <div className="hidden md:flex items-center space-x-6">
        <button onClick={() => setCurrentView("home")} className={`px-3 py-1 rounded ${currentView === "home" ? "bg-green-700" : "hover:bg-green-700"}`}>Home</button>
        <button onClick={() => setCurrentView("listings")} className={`px-3 py-1 rounded ${currentView === "listings" ? "bg-green-700" : "hover:bg-green-700"}`}>Browse</button>
        <button onClick={() => setCurrentView("sell")} className={`px-3 py-1 rounded ${currentView === "sell" ? "bg-green-700" : "hover:bg-green-700"}`}>Sell</button>
        <button onClick={() => setCurrentView("contact")} className={`px-3 py-1 rounded ${currentView === "contact" ? "bg-green-700" : "hover:bg-green-700"}`}>Contact</button>

        <div className="relative">
          <Bell size={20} className="cursor-pointer hover:text-green-200" onClick={() => setShowNotifications(!showNotifications)} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
        </div>

        {user ? (
          <>
            <span className="text-sm">Hi, {user.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
                setCurrentView("home");
              }}
              className="px-3 py-1 rounded bg-red-500 hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setCurrentView("login")} className="px-3 py-1 rounded bg-white text-green-600 hover:bg-gray-100">Login</button>
            <button onClick={() => setCurrentView("register")} className="px-3 py-1 rounded bg-white text-green-600 hover:bg-gray-100">Register</button>
          </>
        )}
      </div>

      <button className="md:hidden" onClick={() => setShowMobileMenu(!showMobileMenu)}>
        {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
      </button>
    </div>
  );

  const MobileMenu = () =>
    showMobileMenu && (
      <div className="bg-green-600 text-white p-4 md:hidden">
        <div className="flex flex-col space-y-2">
          <button onClick={() => { setCurrentView("home"); setShowMobileMenu(false); }}>Home</button>
          <button onClick={() => { setCurrentView("listings"); setShowMobileMenu(false); }}>Browse</button>
          <button onClick={() => { setCurrentView("sell"); setShowMobileMenu(false); }}>Sell</button>
          <button onClick={() => { setCurrentView("contact"); setShowMobileMenu(false); }}>Contact</button>
          {user ? (
            <div className="mt-2 flex items-center gap-2">
              <span>Hi, {user.name}</span>
              <button onClick={() => { localStorage.removeItem("token"); setUser(null); setCurrentView("home"); }} className="px-2 py-1 bg-red-500 rounded">Logout</button>
            </div>
          ) : (
            <div className="mt-2 flex items-center gap-2">
              <button onClick={() => { setCurrentView("login"); setShowMobileMenu(false); }} className="px-2 py-1 bg-white text-green-600 rounded">Login</button>
              <button onClick={() => { setCurrentView("register"); setShowMobileMenu(false); }} className="px-2 py-1 bg-white text-green-600 rounded">Register</button>
            </div>
          )}
        </div>
      </div>
    );

  const NotificationPanel = () =>
    showNotifications && (
      <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 w-80 z-50">
        <h3 className="font-bold mb-3 text-gray-800">Notifications</h3>
        {notifications.map((notif) => (
          <div key={notif.id} className="border-b py-2 last:border-b-0">
            <p className="text-sm text-gray-700">{notif.message}</p>
            <span className="text-xs text-gray-500">{notif.time}</span>
          </div>
        ))}
      </div>
    );

  const HomeView = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Buy & Sell Quality Livestock</h2>
          <p className="text-xl mb-8">Connect with verified farmers and traders across the country</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search for cows, oxen, bulls..."
              className="flex-1 px-4 py-3 rounded-lg text-gray-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100" onClick={() => setCurrentView("listings")}>
              <Search size={20} className="inline mr-2" /> Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose LiveStock Trade?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <Shield size={48} className="mx-auto mb-4 text-green-600" />
            <h4 className="text-xl font-semibold mb-2">Secure Transactions</h4>
            <p className="text-gray-600">Escrow system ensures safe payments for both buyers and sellers</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <Eye size={48} className="mx-auto mb-4 text-green-600" />
            <h4 className="text-xl font-semibold mb-2">Verified Sellers</h4>
            <p className="text-gray-600">KYC verification and rating system for trusted transactions</p>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <MessageCircle size={48} className="mx-auto mb-4 text-green-600" />
            <h4 className="text-xl font-semibold mb-2">Easy Negotiation</h4>
            <p className="text-gray-600">Built-in chat and offer system for seamless price negotiations</p>
          </div>
        </div>
      </div>
    </div>
  );

  const AnimalCard = ({ animal }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center text-6xl">
        {animal.images && animal.images[0] ? <span className="text-6xl">🐄</span> : <span className="text-4xl">No image</span>}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{animal.name}</h3>
          {animal.verified && (
            <div className="flex items-center text-green-600 text-sm">
              <Shield size={16} className="mr-1" />
              Verified
            </div>
          )}
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <div>Breed: {animal.breed} • Age: {animal.age}</div>
          <div className="flex items-center mt-1"><MapPin size={14} className="mr-1" />{animal.location}</div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">₹{animal.price.toLocaleString()}</span>
          <div className="flex items-center text-sm"><Star size={16} className="text-yellow-500 mr-1" />{animal.rating}</div>
        </div>

        <div className="text-sm text-gray-600 mb-3">Seller: {animal.seller}</div>

        <button
          onClick={() => {
            setSelectedAnimal(animal);
            setCurrentView("detail");
          }}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );

  const ListingsView = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Browse Livestock</h2>

        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select className="border rounded-lg px-3 py-2">
              <option>All Categories</option>
              <option>Dairy Cows</option>
              <option>Draft Animals</option>
            </select>
            <select className="border rounded-lg px-3 py-2">
              <option>All Locations</option>
              <option>Punjab</option>
              <option>Gujarat</option>
            </select>
            <select className="border rounded-lg px-3 py-2">
              <option>Price Range</option>
              <option>Below ₹30,000</option>
              <option>₹30,000 - ₹50,000</option>
            </select>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><Filter size={20} className="inline mr-2" />Apply</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animals.map((a) => <AnimalCard key={a.id} animal={a} />)}
        </div>
      </div>
    </div>
  );

  const AnimalDetailView = () => {
    if (!selectedAnimal) return <div>Animal not found</div>;

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setCurrentView("listings")} className="mb-4 text-green-600 hover:text-green-700 font-medium">← Back to Listings</button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-96 bg-gray-200 flex items-center justify-center text-8xl">🐄</div>

              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold">{selectedAnimal.name}</h1>
                  {selectedAnimal.verified && <div className="flex items-center text-green-600"><Shield size={20} className="mr-1" />Verified</div>}
                </div>

                <div className="space-y-3 mb-6">
                  <div><strong>Breed:</strong> {selectedAnimal.breed}</div>
                  <div><strong>Age:</strong> {selectedAnimal.age}</div>
                  <div><strong>Location:</strong> {selectedAnimal.location}</div>
                  <div><strong>Seller:</strong> {selectedAnimal.seller}</div>
                </div>

                <p className="text-gray-600 mb-6">{selectedAnimal.description}</p>

                <div className="text-3xl font-bold text-green-600 mb-6">₹{selectedAnimal.price.toLocaleString()}</div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input type="number" placeholder="Enter your offer" className="flex-1 border rounded-lg px-3 py-2" value={newOfferAmount} onChange={(e) => setNewOfferAmount(e.target.value)} />
                    <button onClick={() => { if (newOfferAmount) { setOffers(prev => [...prev, { amount: newOfferAmount, animal: selectedAnimal.id }]); setNewOfferAmount(''); alert('Offer sent'); } }} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Make Offer</button>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => setCurrentView("contact")} className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"><MessageCircle size={20} className="inline mr-2" />Contact Seller</button>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50"><Heart size={20} /></button>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Seller Contact</h4>
                    <div className="flex items-center mb-2"><Phone size={16} className="mr-2 text-green-600" /><span>{selectedAnimal.sellerPhone}</span></div>
                    <div className="flex items-center"><Mail size={16} className="mr-2 text-green-600" /><span>{selectedAnimal.sellerEmail}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const SellView = () => {
    const fileInputId = "animalPhotosInput";

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">List Your Animal</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={(e) => { e.preventDefault(); alert("Submitted (demo)"); }}>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Animal Photos</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-2">Click to upload photos or drag and drop</p>

                    <input id={fileInputId} type="file" accept="image/*" multiple className="hidden" onChange={() => { alert('Use image uploader connected to backend'); }} />
                    <button type="button" onClick={() => document.getElementById(fileInputId).click()} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"><Upload size={20} className="inline mr-2" />Upload Photos</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Animal Type</label>
                    <select className="w-full border rounded-lg px-3 py-2">
                      <option>Select Type</option>
                      <option>Dairy Cow</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Breed</label>
                    <input type="text" className="w-full border rounded-lg px-3 py-2" placeholder="e.g., Holstein" />
                  </div>
                </div>

                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="text-sm">I confirm this animal is healthy and all information is accurate</label>
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">List Animal for Sale</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const ContactView = () => (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Contact Us</h2>
        <p className="text-gray-600 mb-4">We provide contact details for buyers and sellers to connect directly. If you need help, reach us using the details below.</p>

        <div className="space-y-6 mt-6">
          <div className="flex items-center bg-gray-100 p-4 rounded-lg">
            <Phone size={28} className="text-green-600 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Phone Support</h4>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-4 rounded-lg">
            <Mail size={28} className="text-green-600 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Email</h4>
              <p className="text-gray-600">support@livestocktrade.com</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 p-4 rounded-lg">
            <MapPin size={28} className="text-green-600 mr-4" />
            <div>
              <h4 className="text-lg font-semibold">Office Address</h4>
              <p className="text-gray-600">Bengaluru, Karnataka, India</p>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg">
          <h4 className="font-bold text-green-700 mb-2">Note</h4>
          <p className="text-gray-700">For each animal listing, contact details will be available directly on the animal page. We do not handle payments — all transactions happen directly between buyer and seller.</p>
        </div>
      </div>
    </div>
  );

  // ---------- Auth views (inline) ----------

  const RegisterView = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function doRegister(e) {
      e?.preventDefault();
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, phone, password }),
        });
        const data = await res.json();
        if (!res.ok) throw data;
        if (data.token) {
          localStorage.setItem("token", data.token);
          setUser(data.user || null);
        }
        alert("Registered successfully");
        setCurrentView("home");
      } catch (err) {
        alert(err?.message || (err && err.message) || "Registration failed");
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="min-h-screen flex items-start justify-center p-8 bg-gray-50">
        <form onSubmit={doRegister} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl mb-4">Create Account</h2>
          <input className="input mb-3 w-full border rounded px-3 py-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="input mb-3 w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input mb-3 w-full border rounded px-3 py-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <input type="password" className="input mb-4 w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? "Saving..." : "Register"}</button>
            <button type="button" onClick={() => setCurrentView("login")} className="px-4 py-2 border rounded">Already have an account?</button>
          </div>
        </form>
      </div>
    );
  };

  const LoginView = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function doLogin(e) {
      e?.preventDefault();
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw data;
        if (data.token) {
          localStorage.setItem("token", data.token);
          setUser(data.user || null);
        }
        alert("Login successful");
        setCurrentView("home");
      } catch (err) {
        alert(err?.message || (err && err.message) || "Login failed");
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="min-h-screen flex items-start justify-center p-8 bg-gray-50">
        <form onSubmit={doLogin} className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl mb-4">Login</h2>
          <input className="input mb-3 w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" className="input mb-4 w-full border rounded px-3 py-2" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded">{loading ? "Signing..." : "Login"}</button>
            <button type="button" onClick={() => setCurrentView("register")} className="px-4 py-2 border rounded">Create account</button>
          </div>
        </form>
      </div>
    );
  };

  // ---------- main render ----------
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <MobileMenu />
      <NotificationPanel />

      {currentView === "home" && <HomeView />}
      {currentView === "listings" && <ListingsView />}
      {currentView === "detail" && <AnimalDetailView />}
      {currentView === "sell" && <SellView />}
      {currentView === "contact" && <ContactView />}

      {currentView === "login" && <LoginView />}
      {currentView === "register" && <RegisterView />}
    </div>
  );
};

export default LivestockTradingApp;
