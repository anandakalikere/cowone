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
  Camera,
} from "lucide-react";

/**
 * LivestockTradingApp
 * - Home / Listings / Sell / Contact + Login / Register
 * - Uses backend at VITE_API_BASE or http://localhost:4000
 * - Auth via /api/login, /api/register, /api/me
 * - Listings via /api/animals
 * - Image/Video upload via /api/upload
 */

const LivestockTradingApp = () => {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  // view state  ✅ start at home if token exists, else login
  const [currentView, setCurrentView] = useState(() =>
    localStorage.getItem("token") ? "home" : "login"
  );
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [offers, setOffers] = useState([]);
  const [newOfferAmount, setNewOfferAmount] = useState("");
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // auth
  const [user, setUser] = useState(null);

  // animals from backend
  const [animals, setAnimals] = useState([]);

  // real notifications (in-memory for now)
  const [notifications, setNotifications] = useState([]);

  // helper: safe navigation (block pages when not logged in)
  const go = (view) => {
    const protectedViews = ["home", "listings", "sell", "contact", "detail"];
    if (!user && protectedViews.includes(view)) {
      alert("Please login to access this page.");
      setCurrentView("login");
      return;
    }
    setCurrentView(view);
  };

  // read token and fetch current user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setCurrentView("login");
      return;
    }

    fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.user) {
          setUser(data.user);
          setCurrentView("home"); // auto-go home if already logged in
        } else {
          localStorage.removeItem("token");
          setUser(null);
          setCurrentView("login");
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setCurrentView("login");
      });
  }, [API_BASE]);

  // fetch animals from backend
  useEffect(() => {
    async function loadAnimals() {
      try {
        const res = await fetch(`${API_BASE}/api/animals`);
        const data = await res.json();
        if (res.ok && data.ok) {
          setAnimals(data.animals || []);
        } else {
          console.error("Failed to load animals:", data.message);
        }
      } catch (err) {
        console.error("Animals fetch error:", err);
      }
    }
    loadAnimals();
  }, [API_BASE]);

  // ---------- UI subcomponents ----------

  const NavBar = () =>
    user && (
      <div className="bg-green-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🐄</div>
          <h1
            className="text-xl font-bold cursor-pointer"
            onClick={() => go("home")}
          >
            LiveStock Trade
          </h1>
        </div>

        <div className="hidden md:flex items-center space-x-6">
          <button
            onClick={() => go("home")}
            className={`px-3 py-1 rounded ${
              currentView === "home" ? "bg-green-700" : "hover:bg-green-700"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => go("listings")}
            className={`px-3 py-1 rounded ${
              currentView === "listings"
                ? "bg-green-700"
                : "hover:bg-green-700"
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => go("sell")}
            className={`px-3 py-1 rounded ${
              currentView === "sell" ? "bg-green-700" : "hover:bg-green-700"
            }`}
          >
            Sell
          </button>
          <button
            onClick={() => go("contact")}
            className={`px-3 py-1 rounded ${
              currentView === "contact"
                ? "bg-green-700"
                : "hover:bg-green-700"
            }`}
          >
            Contact
          </button>

          <div className="relative">
            <Bell
              size={20}
              className="cursor-pointer hover:text-green-200"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>

          <span className="text-sm">Hi, {user.name}</span>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
              setCurrentView("login");
            }}
            className="px-3 py-1 rounded bg-red-500 hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    );

  const MobileMenu = () =>
    user &&
    showMobileMenu && (
      <div className="bg-green-600 text-white p-4 md:hidden">
        <div className="flex flex-col space-y-2">
          <button
            onClick={() => {
              go("home");
              setShowMobileMenu(false);
            }}
          >
            Home
          </button>
          <button
            onClick={() => {
              go("listings");
              setShowMobileMenu(false);
            }}
          >
            Browse
          </button>
          <button
            onClick={() => {
              go("sell");
              setShowMobileMenu(false);
            }}
          >
            Sell
          </button>
          <button
            onClick={() => {
              go("contact");
              setShowMobileMenu(false);
            }}
          >
            Contact
          </button>
          <div className="mt-2 flex items-center gap-2">
            <span>Hi, {user.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setUser(null);
                setCurrentView("login");
              }}
              className="px-2 py-1 bg-red-500 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );

  const NotificationPanel = () =>
    showNotifications && user && (
      <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-4 w-80 z-50">
        <h3 className="font-bold mb-3 text-gray-800">Notifications</h3>
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((notif) => (
            <div key={notif.id} className="border-b py-2 last:border-b-0">
              <p className="text-sm text-gray-700">{notif.message}</p>
              <span className="text-xs text-gray-500">{notif.time}</span>
            </div>
          ))
        )}
      </div>
    );

  // ---------- HOME VIEW (with your collage image) ----------

    // ---------- HOME VIEW (your collage as background) ----------

  const HomeView = () => {
    const userName = user?.name || "Farmer";

    return (
      <div
        className="min-h-screen bg-cover bg-center relative"
        style={{ backgroundImage: "url('/cow-banner.jpg')" }}
      >
        {/* dark overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-green-900/40" />

        <div className="relative max-w-6xl mx-auto px-4 py-16">
          {/* LEFT: TEXT + SEARCH */}
          <div className="max-w-xl space-y-5 text-white">
            <p className="text-sm font-semibold text-green-200 uppercase tracking-wide">
              Simple livestock marketplace
            </p>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Buy &amp; sell cows
              <span className="text-green-300"> directly</span> from farmers.
            </h2>

            <p className="text-sm md:text-base text-gray-100">
              LiveStock Trade lets farmers upload photos, age, breed, price and
              location of their cows. Buyers can browse all animals in one
              place, see clear details and contact the seller directly – no
              middleman.
            </p>

            <ul className="text-sm md:text-base text-gray-100 space-y-2">
              <li>• Sellers add photos / videos and full details of the animal.</li>
              <li>• Buyers compare price, location, age and breed before calling.</li>
              <li>• Final deal happens directly between buyer and seller.</li>
            </ul>

            <div className="mt-4 flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="text"
                placeholder="Search for cows, bulls, oxen..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300/60 bg-white/90 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-transform transform hover:-translate-y-0.5"
                onClick={() => go("listings")}
              >
                <Search size={20} className="inline mr-2" />
                Browse
              </button>
            </div>

            {user && (
              <p className="text-xs md:text-sm text-gray-100">
                Logged in as <span className="font-semibold">{userName}</span>.{" "}
                Go to the <span className="font-semibold">Sell</span> page to
                list your own animals.
              </p>
            )}
          </div>
        </div>

        {/* WHY section on white background at bottom */}
        <div className="relative bg-white/95 backdrop-blur-sm mt-8">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
              Why use LiveStock Trade?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <Shield size={36} className="mx-auto mb-3 text-green-600" />
                <h4 className="text-lg font-semibold mb-1">Safe &amp; clear</h4>
                <p className="text-gray-600 text-sm">
                  See real photos, basic details and price before you visit the
                  farm.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <Eye size={36} className="mx-auto mb-3 text-green-600" />
                <h4 className="text-lg font-semibold mb-1">
                  All details in one place
                </h4>
                <p className="text-gray-600 text-sm">
                  Age, breed, milk purpose or draft, and location are shown for
                  each animal.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-md">
                <MessageCircle
                  size={36}
                  className="mx-auto mb-3 text-green-600"
                />
                <h4 className="text-lg font-semibold mb-1">Direct contact</h4>
                <p className="text-gray-600 text-sm">
                  Buyers call or message the seller directly – you both control
                  the deal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // ---------- LISTINGS ----------

  const AnimalCard = ({ animal }) => {
    const title = animal.title || animal.name;
    const photoPath =
      (animal.photos && animal.photos[0]) ||
      (animal.images && animal.images[0]);
    const photoUrl = photoPath
      ? photoPath.startsWith("http")
        ? photoPath
        : `${API_BASE}${photoPath}`
      : null;

    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={title}
              className="w-full h-48 object-cover"
            />
          ) : (
            <span className="text-4xl">No image</span>
          )}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            {animal.verified && (
              <div className="flex items-center text-green-600 text-sm">
                <Shield size={16} className="mr-1" />
                Verified
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600 mb-2">
            <div>
              Breed: {animal.breed} • Age: {animal.age}
            </div>
            <div className="flex items-center mt-1">
              <MapPin size={14} className="mr-1" />
              {animal.location}
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-2xl font-bold text-green-600">
              ₹{Number(animal.price || 0).toLocaleString()}
            </span>
            <div className="flex items-center text-sm">
              <Star size={16} className="text-yellow-500 mr-1" />
              {animal.rating || 4.5}
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-3">
            Seller: {animal.sellerName || animal.seller || "Farmer"}
          </div>

          <button
            onClick={() => {
              setSelectedAnimal(animal);
              go("detail");
            }}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    );
  };

  const ListingsView = () => {
    const filteredAnimals = animals.filter((a) => {
      if (!searchTerm.trim()) return true;
      const t = searchTerm.toLowerCase();
      return (
        (a.title && a.title.toLowerCase().includes(t)) ||
        (a.breed && a.breed.toLowerCase().includes(t)) ||
        (a.location && a.location.toLowerCase().includes(t))
      );
    });

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Browse Livestock
          </h2>

          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select className="border rounded-lg px-3 py-2">
                <option>All Categories</option>
                <option>Dairy Cows</option>
                <option>Draft Animals</option>
              </select>
              <select className="border rounded-lg px-3 py-2">
                <option>All Locations</option>
                <option>Karnataka</option>
                <option>Bengaluru</option>
                <option>Mysuru</option>
                <option>Mandya</option>
              </select>
              <select className="border rounded-lg px-3 py-2">
                <option>Price Range</option>
                <option>Below ₹30,000</option>
                <option>₹30,000 - ₹50,000</option>
              </select>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                <Filter size={20} className="inline mr-2" />
                Apply
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimals.map((a) => (
              <AnimalCard key={a._id || a.id} animal={a} />
            ))}
            {filteredAnimals.length === 0 && (
              <p className="text-gray-600">No animals listed yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ---------- DETAIL VIEW (with delete / mark as sold) ----------

  const AnimalDetailView = () => {
    if (!selectedAnimal) return <div>Animal not found</div>;

    const title = selectedAnimal.title || selectedAnimal.name;
    const photoPath =
      (selectedAnimal.photos && selectedAnimal.photos[0]) ||
      (selectedAnimal.images && selectedAnimal.images[0]);
    const photoUrl = photoPath
      ? photoPath.startsWith("http")
        ? photoPath
        : `${API_BASE}${photoPath}`
      : null;

    const handleDeleteListing = async () => {
      const id = selectedAnimal._id || selectedAnimal.id;
      if (!id) {
        alert("No ID found for this listing");
        return;
      }

      const confirmDelete = window.confirm(
        "Are you sure this cow is sold? This will delete the listing."
      );
      if (!confirmDelete) return;

      try {
        const res = await fetch(`${API_BASE}/api/animals/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Failed to delete listing");
        }

        setAnimals((prev) => prev.filter((a) => (a._id || a.id) !== id));
        alert("Listing deleted / marked as sold.");
        go("listings");
      } catch (err) {
        console.error("Delete listing error:", err);
        alert(err.message || "Failed to delete listing");
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => go("listings")}
            className="mb-4 text-green-600 hover:text-green-700 font-medium"
          >
            ← Back to Listings
          </button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 h-64 md:h-96 bg-gray-200 flex items-center justify-center">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-8xl">🐄</span>
                )}
              </div>

              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl font-bold">{title}</h1>
                  {selectedAnimal.verified && (
                    <div className="flex items-center text-green-600">
                      <Shield size={20} className="mr-1" />
                      Verified
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div>
                    <strong>Animal Type:</strong>{" "}
                    {selectedAnimal.animalType || "Cow"}
                  </div>
                  <div>
                    <strong>Breed:</strong> {selectedAnimal.breed}
                  </div>
                  <div>
                    <strong>Age:</strong> {selectedAnimal.age}
                  </div>
                  <div>
                    <strong>Location:</strong> {selectedAnimal.location}
                  </div>
                  <div>
                    <strong>Seller:</strong>{" "}
                      {selectedAnimal.sellerName || selectedAnimal.seller}
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {selectedAnimal.description}
                </p>

                <div className="text-3xl font-bold text-green-600 mb-6">
                  ₹{Number(selectedAnimal.price || 0).toLocaleString()}
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Enter your offer"
                      className="flex-1 border rounded-lg px-3 py-2"
                      value={newOfferAmount}
                      onChange={(e) => setNewOfferAmount(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (newOfferAmount) {
                          setOffers((prev) => [
                            ...prev,
                            {
                              amount: newOfferAmount,
                              animal: selectedAnimal._id || selectedAnimal.id,
                            },
                          ]);

                          // add local notification
                          const msg = `Offer of ₹${newOfferAmount} sent for ${title}`;
                          setNotifications((prev) => [
                            {
                              id: Date.now(),
                              type: "offer",
                              message: msg,
                              time: "Just now",
                            },
                            ...prev,
                          ]);

                          setNewOfferAmount("");
                          alert("Offer sent");
                        }
                      }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Make Offer
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => go("contact")}
                      className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                    >
                      <MessageCircle size={20} className="inline mr-2" />
                      Contact Seller
                    </button>
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Heart size={20} />
                    </button>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Seller Contact</h4>
                    <div className="flex items-center mb-2">
                      <Phone size={16} className="mr-2 text-green-600" />
                      <span>
                        {selectedAnimal.sellerPhone || "+91 98765 43210"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-green-600" />
                      <span>
                        {selectedAnimal.sellerEmail ||
                          "support@livestocktrade.com"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleDeleteListing}
                    className="mt-3 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-semibold"
                  >
                    Mark as Sold / Delete Listing
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ---------- SELL VIEW (login required) ----------

  const SellView = () => {
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-3">Login Required</h2>
            <p className="text-gray-600 mb-4">
              Please login to upload photos and list your animal for sale.
            </p>
            <button
              onClick={() => setCurrentView("login")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    const fileInputId = "animalMediaInput";

    const [photos, setPhotos] = useState([]);
    const [photoPreviews, setPhotoPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const [title, setTitle] = useState("");
    const [animalType, setAnimalType] = useState("");
    const [breed, setBreed] = useState("");
    const [age, setAge] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    // upload files to backend
    const uploadFiles = async (filesToUpload) => {
      if (!filesToUpload.length) {
        alert("Please select at least one file.");
        return;
      }

      try {
        setUploading(true);
        const formData = new FormData();
        filesToUpload.forEach((file) => formData.append("photos", file));

        const token = localStorage.getItem("token");

        const options = {
          method: "POST",
          body: formData,
        };
        if (token) {
          options.headers = { Authorization: `Bearer ${token}` };
        }

        const res = await fetch(`${API_BASE}/api/upload`, options);
        const data = await res.json();

        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Upload failed");
        }

        setUploadedFiles(data.files || []);
        alert("Media uploaded successfully!");
      } catch (err) {
        console.error("Upload error:", err);
        alert(err.message || "Failed to upload");
      } finally {
        setUploading(false);
      }
    };

    // when user selects files, preview & auto-upload
    const handleFileChange = async (e) => {
      const files = Array.from(e.target.files || []);
      if (!files.length) return;

      setPhotos(files);
      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      setPhotoPreviews(imageFiles.map((f) => URL.createObjectURL(f)));

      await uploadFiles(files);
    };

    const handleSubmitListing = async (e) => {
      e.preventDefault();

      if (!uploadedFiles.length) {
        alert("Please upload at least one photo/video before listing.");
        return;
      }

      try {
        const photoUrls = uploadedFiles.map((f) => f.url);

        const body = {
          title,
          animalType,
          breed,
          age,
          price: Number(price),
          location,
          description,
          photos: photoUrls,
          sellerName: user?.name || "",
          sellerPhone: user?.phone || "",
          sellerEmail: user?.email || "",
        };

        const res = await fetch(`${API_BASE}/api/animals`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.message || "Failed to create listing");
        }

        setAnimals((prev) => [data.animal, ...prev]);

        // add simple notification
        setNotifications((prev) => [
          {
            id: Date.now(),
            type: "listing",
            message: "Your animal listing was created successfully.",
            time: "Just now",
          },
          ...prev,
        ]);

        alert("Animal listed successfully!");
        setTitle("");
        setAnimalType("");
        setBreed("");
        setAge("");
        setPrice("");
        setLocation("");
        setDescription("");
        setPhotos([]);
        setPhotoPreviews([]);
        setUploadedFiles([]);
        go("listings");
      } catch (err) {
        console.error("Create listing error:", err);
        alert(err.message || "Failed to create listing");
      }
    };

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            List Your Animal
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmitListing}>
              <div className="space-y-6">
                {/* Photos & Videos */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Animal Photos / Videos
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-500 mb-2">
                      Click the button below to upload photos or videos
                    </p>

                    <input
                      id={fileInputId}
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        document.getElementById(fileInputId).click()
                      }
                      disabled={uploading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-60"
                    >
                      {uploading ? "Uploading..." : "Upload Photos & Videos"}
                    </button>

                    {/* small previews for images */}
                    {photoPreviews.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        {photoPreviews.map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-24 object-cover rounded-md border"
                          />
                        ))}
                      </div>
                    )}

                    {/* uploaded file URLs from server */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 text-left text-sm text-gray-600">
                        <p className="font-semibold mb-1">
                          Uploaded files (server URLs):
                        </p>
                        <ul className="list-disc list-inside">
                          {uploadedFiles.map((f) => (
                            <li key={f.filename}>{f.url}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* listing details */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Listing Title
                  </label>
                  <input
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., Premium Holstein Cow"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Animal Type
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2"
                      value={animalType}
                      onChange={(e) => setAnimalType(e.target.value)}
                    >
                      <option value="">Select Type</option>
                      <option value="Dairy Cow">Dairy Cow</option>
                      <option value="Bull">Bull</option>
                      <option value="Ox">Ox</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Breed
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="e.g., Gir"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Age
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="e.g., 3 years"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="45000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="e.g., Bengaluru, Karnataka"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2"
                    rows="3"
                    placeholder="Health, vaccination, milk yield, temperament..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <label className="text-sm">
                    I confirm this animal is healthy and all information is
                    accurate
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold"
                >
                  List Animal for Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // ---------- CONTACT VIEW (uses registered user details; login required) ----------

  const ContactView = () => {
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-3">Login Required</h2>
            <p className="text-gray-600 mb-4">
              Please login to view your contact details.
            </p>
            <button
              onClick={() => setCurrentView("login")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      );
    }

    const userEmail = user.email;
    const userPhone = user.phone;
    const userName = user.name;

    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-3xl mx-auto bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Contact</h2>

          <p className="text-gray-600 mb-4">
            You are logged in as{" "}
            <span className="font-semibold">{userName}</span>. These are your
            registered contact details from your account.
          </p>

          <div className="space-y-6 mt-6">
            <div className="flex items-center bg-gray-100 p-4 rounded-lg">
              <Phone size={28} className="text-green-600 mr-4" />
              <div>
                <h4 className="text-lg font-semibold">Your Registered Phone</h4>
                <p className="text-gray-600">{userPhone || "Not set"}</p>
              </div>
            </div>

            <div className="flex items-center bg-gray-100 p-4 rounded-lg">
              <Mail size={28} className="text-green-600 mr-4" />
              <div>
                <h4 className="text-lg font-semibold">Your Registered Email</h4>
                <p className="text-gray-600">{userEmail || "Not set"}</p>
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
            <p className="text-gray-700">
              For each animal listing, the seller&apos;s contact details (phone
              &amp; email) are shown directly on the animal page. We do not
              handle payments — all transactions happen directly between buyer
              and seller.
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ---------- AUTH VIEWS ----------

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
        alert(err?.message || "Registration failed");
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="min-h-screen flex items-start justify-center p-8 bg-gray-50">
        <form
          onSubmit={doRegister}
          className="bg-white p-6 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl mb-4">Create Account</h2>
          <input
            className="mb-3 w-full border rounded px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="mb-3 w-full border rounded px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="mb-3 w-full border rounded px-3 py-2"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            className="mb-4 w-full border rounded px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Register"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentView("login")}
              className="px-4 py-2 border rounded"
            >
              Already have an account?
            </button>
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
        alert(err?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }

    return (
      <div className="min-h-screen flex items-start justify-center p-8 bg-gray-50">
        <form
          onSubmit={doLogin}
          className="bg-white p-6 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl mb-4">Login</h2>
          <input
            className="mb-3 w-full border rounded px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            className="mb-4 w-full border rounded px-3 py-2"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Signing..." : "Login"}
            </button>
            <button
              type="button"
              onClick={() => setCurrentView("register")}
              className="px-4 py-2 border rounded"
            >
              Create account
            </button>
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

      {currentView === "login" && <LoginView />}
      {currentView === "register" && <RegisterView />}

      {currentView === "home" && user && <HomeView />}
      {currentView === "listings" && user && <ListingsView />}
      {currentView === "detail" && user && <AnimalDetailView />}
      {currentView === "sell" && <SellView />}
      {currentView === "contact" && <ContactView />}
    </div>
  );
};

export default LivestockTradingApp;
