import { useState, useRef, useEffect, useMemo } from "react";
import Logo from "../assets/logo.png";
import {
  ShoppingCart,
  CircleUser,
  ChevronDown,
  LogOut,
  Menu,
  X,
  Home,
  PawPrint,
  Heart,
  Stethoscope,
  Calendar,
  Info,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";
import { useCart } from "../context/CartContext";
import SupportChatButton from "./support/SupportChatButton";

export interface NavCategory {
  id: string;
  name: string;
}

interface HeaderProps {
  onCartClick: () => void;
  navCategories: NavCategory[];
}

interface DisplayNavItem {
  id: string;
  name: string;
  type: "category" | "link";
  path?: string;
  categoryId?: string;
  icon?: React.ReactNode;
}

interface DisplayNavGroup {
  title: string;
  icon?: React.ReactNode;
  items: DisplayNavItem[];
}

const organizeCategoriesForNav = (
  apiCategories: NavCategory[]
): DisplayNavGroup[] => {
  const groups: DisplayNavGroup[] = [
    {
      title: "For Dogs",
      icon: <PawPrint size={18} />,
      items: [],
    },
    {
      title: "For Cats",
      icon: <PawPrint size={18} />,
      items: [],
    },
    {
      title: "Vet & Health",
      icon: <Stethoscope size={18} />,
      items: [],
    },
  ];

  const dogKeywords = ["dog", "canine"];
  const catKeywords = ["cat", "feline"];
  const vetKeywords = ["vet", "health", "medical", "pharmacy", "veterinary"];

  (apiCategories || []).forEach((cat) => {
    const nameLower = cat.name.toLowerCase();
    const item: DisplayNavItem = {
      id: cat.id,
      name: cat.name,
      type: "category",
      categoryId: cat.id,
    };

    if (dogKeywords.some((kw) => nameLower.includes(kw))) {
      groups[0].items.push(item);
    } else if (catKeywords.some((kw) => nameLower.includes(kw))) {
      groups[1].items.push(item);
    } else if (vetKeywords.some((kw) => nameLower.includes(kw))) {
      groups[2].items.push(item);
    }
  });

  const vetGroup = groups.find((g) => g.title === "Vet & Health");
  if (vetGroup) {
    vetGroup.items.push({
      id: "book-appointment-static-link",
      name: "Book Appointment",
      type: "link",
      path: "/bookAppointment",
      icon: <Calendar size={16} />,
    });
  }

  return groups.filter((group) => group.items.length > 0);
};

const Header = ({ onCartClick, navCategories }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopDropdownKey, setOpenDesktopDropdownKey] = useState<
    string | null
  >(null);
  const [openMobileSubmenuKey, setOpenMobileSubmenuKey] = useState<
    string | null
  >(null);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  const { user, logout, isLoading: authIsLoading } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuContainerRef = useRef<HTMLDivElement>(null);

  const organizedNavData = useMemo(
    () => organizeCategoriesForNav(navCategories),
    [navCategories]
  );

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  const handleUserMenuToggle = () => setUserMenuOpen((prev) => !prev);
  const handleDesktopDropdownEnter = (key: string) =>
    setOpenDesktopDropdownKey(key);
  const handleDesktopDropdownLeave = () => setOpenDesktopDropdownKey(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isMobileMenuOpen) {
      setOpenMobileSubmenuKey(null);
    }
  };

  const toggleMobileSubmenu = (key: string) => {
    setOpenMobileSubmenuKey((prevKey) => (prevKey === key ? null : key));
  };

  const handleNavItemClick = (item: DisplayNavItem) => {
    if (item.type === "category" && item.categoryId) {
      navigate(`/products/categories/${item.categoryId}`);
    } else if (item.type === "link" && item.path) {
      navigate(item.path);
    }
    setIsMobileMenuOpen(false);
    setOpenDesktopDropdownKey(null);
    setOpenMobileSubmenuKey(null);
    setUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        isMobileMenuOpen &&
        mobileMenuContainerRef.current &&
        !mobileMenuContainerRef.current.contains(event.target as Node)
      ) {
        const hamburgerButton = document.querySelector(
          "[data-hamburger-button]"
        );
        if (
          hamburgerButton &&
          !hamburgerButton.contains(event.target as Node)
        ) {
          setIsMobileMenuOpen(false);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const getFirstName = () => user?.fullName?.split(" ")[0] || "";

  return (
    <header className="bg-gradient-to-r from-[#173ba2] to-[#1c49c2] text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="flex-shrink-0 transition-transform hover:scale-105"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
              src={Logo}
              alt="Pets & Vets Logo"
              className="h-8 sm:h-10 md:h-10"
            />
          </Link>

          <div className="hidden md:flex flex-grow justify-center px-6 lg:px-12 max-w-3xl mx-auto">
            <div className="w-full">
              <SearchBar />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <div className="hidden lg:block">
              <SupportChatButton />
            </div>

            {authIsLoading ? (
              <div className="flex items-center gap-2 p-2">
                <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                <span className="text-sm hidden sm:inline">Loading...</span>
              </div>
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center gap-2 py-2 px-3 rounded-md bg-white/15 hover:bg-white/25 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 text-sm"
                >
                  <CircleUser size={20} className="text-white" />
                  <span className="hidden sm:inline font-medium">
                    {getFirstName()}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${
                      userMenuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-1 text-gray-700 ring-1 ring-black ring-opacity-5 transform origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() =>
                        handleNavItemClick({
                          id: "profile",
                          name: "Profile",
                          type: "link",
                          path: "/profile",
                        })
                      }
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors"
                    >
                      <CircleUser size={16} className="text-gray-500" /> My
                      Profile
                    </Link>
                    <div className="my-1 h-px bg-gray-100"></div>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 py-1.5 px-3 bg-white text-[#060464] rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 text-sm font-medium shadow-sm"
              >
                <CircleUser size={18} />
                <span className="hidden sm:inline">Sign In</span>
                <span className="sm:hidden">Sign In</span>
              </Link>
            )}

            <button
              onClick={onCartClick}
              className="relative p-2 rounded-md hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={24} />
              {cartState.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-sm">
                  {cartState.itemCount}
                </span>
              )}
            </button>

            <button
              data-hamburger-button
              className="p-2 rounded-md md:hidden hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/50 transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <div className="md:hidden border-t border-white/10 px-4 py-3 bg-[#173ba2]/90">
        <SearchBar />
      </div>

      <nav className="hidden md:block bg-[#0e3a99] border-t border-white/10 shadow-sm">
        <div className="container mx-auto px-4">
          <ul className="flex items-center gap-1 lg:gap-2 py-2">
            <li>
              <Link
                to="/"
                className="flex items-center gap-1.5 text-sm lg:text-base font-medium py-1.5 px-3 hover:bg-white/15 rounded-md transition-colors"
              >
                <Home size={16} />
                <span>Home</span>
              </Link>
            </li>
            {organizedNavData.map((group) => (
              <li
                key={group.title}
                className="relative"
                onMouseEnter={() => handleDesktopDropdownEnter(group.title)}
                onMouseLeave={handleDesktopDropdownLeave}
              >
                <button
                  className={`flex items-center gap-1.5 text-sm lg:text-base font-medium py-1.5 px-3 rounded-md transition-colors ${
                    openDesktopDropdownKey === group.title
                      ? "bg-white/15"
                      : "hover:bg-white/15"
                  }`}
                  aria-expanded={openDesktopDropdownKey === group.title}
                >
                  {group.icon}
                  <span>{group.title}</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-50 ${
                      openDesktopDropdownKey === group.title ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openDesktopDropdownKey === group.title && (
                  <div className="absolute left-0 w-64 bg-white text-gray-700 py-2 rounded-lg shadow-xl z-50 ring-1 ring-black/5 animate-fadeIn">
                    {group.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleNavItemClick(item)}
                        className="flex items-center w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        {item.icon && (
                          <span className="mr-2.5 text-gray-500">
                            {item.icon}
                          </span>
                        )}
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            ))}
            <li>
              <Link
                to="/about"
                className="flex items-center gap-1.5 text-sm lg:text-base font-medium py-1.5 px-3 hover:bg-white/15 rounded-md transition-colors"
              >
                <Info size={16} />
                <span>About Us</span>
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          ref={mobileMenuContainerRef}
          className="md:hidden fixed inset-0 z-40 flex"
        >
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
            onClick={toggleMobileMenu}
          ></div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-[#1543ac] to-[#0e3a99] text-white pt-5 pb-4 shadow-xl transform transition-all duration-300 ease-in-out">
            <div className="absolute top-3 right-3 -mr-12">
              <button
                type="button"
                className="flex items-center justify-center h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-black/30 transition-colors"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Close sidebar</span>
                <X size={24} aria-hidden="true" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-6">
              <Link to="/" onClick={toggleMobileMenu}>
                <img
                  src={Logo}
                  alt="Pets & Vets Logo"
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            <div className="mt-6 flex-1 h-0 overflow-y-auto px-2">
              <nav className="space-y-1.5">
                <Link
                  to="/"
                  onClick={toggleMobileMenu}
                  className="group flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md hover:bg-white/10"
                >
                  <Home size={20} className="text-white/70" />
                  <span>Home</span>
                </Link>

                {organizedNavData.map((group) => (
                  <div key={group.title}>
                    <button
                      onClick={() => toggleMobileSubmenu(group.title)}
                      className="w-full group flex items-center justify-between px-4 py-3 text-base font-medium rounded-md hover:bg-white/10"
                      aria-expanded={openMobileSubmenuKey === group.title}
                    >
                      <div className="flex items-center gap-3">
                        {group.icon && (
                          <span className="text-white/70">{group.icon}</span>
                        )}
                        <span>{group.title}</span>
                      </div>
                      <ChevronDown
                        size={18}
                        className={`text-white/70 transition-transform duration-200 ${
                          openMobileSubmenuKey === group.title
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </button>
                    {openMobileSubmenuKey === group.title && (
                      <div className="mt-1 pl-4 space-y-0.5 border-l-2 border-white/20 ml-4">
                        {group.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleNavItemClick(item)}
                            className="flex items-center w-full text-left px-4 py-2.5 text-sm font-medium rounded-md hover:bg-white/10"
                          >
                            {item.icon && (
                              <span className="mr-2.5 text-white/70">
                                {item.icon}
                              </span>
                            )}
                            {item.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <Link
                  to="/about"
                  onClick={toggleMobileMenu}
                  className="group flex items-center gap-3 px-4 py-3 text-base font-medium rounded-md hover:bg-white/10"
                >
                  <Info size={20} className="text-white/70" />
                  <span>About Us</span>
                </Link>

                <div className="px-4 py-3 mt-4">
                  <SupportChatButton />
                </div>
              </nav>
            </div>

            <div className="px-4 py-3 border-t border-white/10 mt-auto">
              <div className="flex items-center text-sm text-white/70">
                <Heart size={16} className="mr-2" />
                <span>Made with love for pets</span>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </div>
      )}
    </header>
  );
};

export default Header;
