import { useState, useEffect } from "react";
import {
  User,
  Calendar,
  MapPin,
  Package,
  PawPrint,
  LogOut,
  CreditCard,
  AlertTriangle,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: string;
  breed: string | null;
  age: number | null;
  weight: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

interface Transaction {
  id: string;
  paymentMethod: string;
  paymentStatus: string;
  amount: string;
  currency: string;
  transactionId: string | null;
  referenceId: string | null;
  paymentDate: string | null;
  createdAt: string;
}

interface Order {
  id: string;
  status: string;
  totalAmount: string;
  deliveryStatus: string;
  deliveryAddress: string;
  createdAt: string;
  items: OrderItem[];
  transaction: Transaction | null;
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

interface ProfileData {
  orders: Order[];
  addresses: Address[];
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [pets, setPets] = useState<Pet[]>([]);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoadingProfileData, setIsLoadingProfileData] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [appointmentFilter, setAppointmentFilter] = useState<
    "all" | "scheduled" | "completed" | "cancelled" | "confirmed"
  >("all");
  const [isCancellingAppointment, setIsCancellingAppointment] = useState(false);
  const [isLoadingPets, setIsLoadingPets] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/profile" } });
      return;
    }

    const fetchProfileData = async () => {
      setIsLoadingProfileData(true);
      setProfileError(null);
      try {
        const response = await axios.get<ProfileData>(
          "http://localhost:3000/api/users/me",
          {
            withCredentials: true,
          }
        );
        setProfileData(response.data);
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setProfileError(
          "Could not load your profile information. Please try again later."
        );
      } finally {
        setIsLoadingProfileData(false);
      }
    };

    fetchProfileData();
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAppointments = async () => {
      setIsLoadingAppointments(true);
      try {
        const response = await axios.get(
          "http://localhost:3000/api/appointments/user/appointments",
          { withCredentials: true }
        );
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        toast.error("Failed to load appointments");
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    if (activeTab === "appointments") {
      fetchAppointments();
    }
  }, [activeTab, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setIsLoadingPets(true);
    const fetchUserPets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/appointments/user/pets",
          {
            withCredentials: true,
          }
        );
        setPets(response.data.pets);
      } catch (error) {
        console.error("Failed to fetch pets:", error);
      } finally {
        setIsLoadingPets(false);
      }
    };
    fetchUserPets();
  }, [isAuthenticated]);

  const formatDate = (
    dateString: string | null,
    includeTime: boolean = true
  ) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    // existing logic
    setIsCancellingAppointment(true);
    try {
      await axios.delete(
        `http://localhost:3000/api/appointments/${appointmentId}/cancel`,
        { withCredentials: true }
      );
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, status: "cancelled" } : a
        )
      );
      toast.success("Appointment cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      toast.error("Failed to cancel appointment");
    } finally {
      setIsCancellingAppointment(false);
    }
  };

  const memberSince = user?.createdAt
    ? formatDate(user.createdAt, false)
    : "N/A";
  const isLoading = isLoadingProfileData;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (profileError && !profileData) {
    return (
      <div className="container mx-auto p-6 text-center">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md"
          role="alert"
        >
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
            <div>
              <p className="font-bold text-xl">Loading Error</p>
              <p className="text-md">{profileError}</p>
            </div>
          </div>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  const orders = profileData?.orders || [];
  const filteredAppointments =
    appointmentFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === appointmentFilter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50">
      <div className="container mx-auto px-2 sm:px-4 py-8">
        <div className="md:flex gap-8">
          {/* Sidebar Navigation */}
          <div className="md:w-1/4 mb-8 md:mb-0">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-8">
              <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user?.fullName || "U"
                  )}&background=random&color=fff&size=96&bold=true&font-size=0.4`}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-white shadow-lg"
                />
                <h2 className="text-xl font-bold truncate">{user?.fullName}</h2>
                <p className="text-sm text-blue-200 truncate">{user?.email}</p>
                <p className="text-xs text-blue-300 mt-1">
                  Member since {memberSince}
                </p>
              </div>

              <nav className="p-3">
                {[
                  { name: "Profile", tab: "profile", icon: User },
                  { name: "My Pets", tab: "pets", icon: PawPrint },
                  { name: "My Orders", tab: "orders", icon: Package },
                  { name: "Appointments", tab: "appointments", icon: Calendar },
                ].map((item) => (
                  <button
                    key={item.tab}
                    onClick={() => setActiveTab(item.tab)}
                    className={`flex items-center w-full text-left p-3 my-1 rounded-lg transition-all duration-200 ease-in-out group hover:shadow-md ${
                      activeTab === item.tab
                        ? "bg-blue-500 text-white shadow-lg scale-105"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    <item.icon
                      size={20}
                      className={`mr-3 transition-transform duration-200 ${
                        activeTab === item.tab ? "" : "group-hover:scale-110"
                      }`}
                    />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
                <div className="border-t my-3"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left p-3 rounded-lg text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-200 ease-in-out group"
                >
                  <LogOut
                    size={20}
                    className="mr-3 group-hover:scale-110 transition-transform"
                  />
                  <span className="font-medium">Log Out</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 min-h-[600px]">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">
                    Personal Information
                  </h2>
                  <div className="space-y-6">
                    {[
                      { label: "Full Name", value: user?.fullName },
                      { label: "Email Address", value: user?.email },
                      { label: "Account ID", value: user?.id, mono: true },
                      { label: "Member Since", value: memberSince },
                    ].map(
                      (item) =>
                        item.value && (
                          <div key={item.label}>
                            <label className="block text-sm font-medium text-gray-500 mb-1">
                              {item.label}
                            </label>
                            <div
                              className={`p-3 bg-gray-100 rounded-lg text-gray-700 ${
                                item.mono ? "font-mono text-xs" : ""
                              }`}
                            >
                              {item.value}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              )}

              {activeTab === "pets" && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">
                      My Pets
                    </h2>
                  </div>
                  {isLoadingPets ? (
                    <p>Loading pets...</p>
                  ) : pets.length === 0 ? (
                    <div className="text-center py-12">
                      <PawPrint
                        size={60}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Pets Yet
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Add your furry, scaly, or feathery friends to manage
                        their details.
                      </p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {pets.map((pet) => (
                        <div
                          key={pet.id}
                          className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                        >
                          <div
                            className={`h-36 ${
                              pet.imageUrl
                                ? ""
                                : "bg-gradient-to-r from-indigo-400 to-pink-400"
                            } relative flex items-center justify-center`}
                          >
                            {pet.imageUrl ? (
                              <img
                                src={pet.imageUrl}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <PawPrint
                                size={48}
                                className="text-white opacity-70"
                              />
                            )}
                          </div>
                          <div className="p-5">
                            <h3 className="text-xl font-bold text-gray-800">
                              {pet.name}
                            </h3>
                            <div className="mt-3 space-y-1 text-sm">
                              <p>
                                <strong className="text-gray-600">
                                  Species:
                                </strong>{" "}
                                {pet.species}
                              </p>
                              <p>
                                <strong className="text-gray-600">
                                  Breed:
                                </strong>{" "}
                                {pet.breed || "N/A"}
                              </p>
                              <p>
                                <strong className="text-gray-600">Age:</strong>{" "}
                                {pet.age ? `${pet.age} years` : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-8">
                    My Orders
                  </h2>
                  {isLoadingProfileData ? (
                    <p>Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <ShoppingBag
                        size={60}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Orders Yet
                      </h3>
                      <p className="text-gray-500 mb-6">
                        You haven't placed any orders. Explore our products and
                        services!
                      </p>
                      <Link
                        to="/products"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {orders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-white p-5 rounded-lg shadow-lg border border-gray-200 hover:border-blue-300 transition-all"
                        >
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 pb-4 border-b border-gray-200">
                            <div className="mb-3 sm:mb-0">
                              <p className="text-xs text-gray-500">ORDER ID</p>
                              <p className="font-mono text-sm font-medium text-gray-800">
                                {order.id}
                              </p>
                              <p className="text-xs text-gray-500 mt-1.5">
                                PLACED ON
                              </p>
                              <p className="font-medium text-sm text-gray-700">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="text-2xl font-bold text-blue-600">
                                NPR {parseFloat(order.totalAmount).toFixed(2)}
                              </p>
                              <span
                                className={`mt-1 inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                                  order.status === "COMPLETED"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "PENDING_PAYMENT" ||
                                      order.status === "PENDING"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : order.status
                                        .toUpperCase()
                                        .includes("FAILED") ||
                                      order.status
                                        .toUpperCase()
                                        .includes("CANCELLED")
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {order.status.replace(/_/g, " ").toUpperCase()}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-semibold text-gray-700 mb-2 text-md">
                              Items ({order.items.length}):
                            </h4>
                            <ul className="space-y-2">
                              {order.items.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex justify-between items-center text-sm p-3 bg-gray-50 rounded-md border border-gray-100"
                                >
                                  <div className="flex-grow pr-2">
                                    <span className="font-medium text-gray-800">
                                      {item.productName}
                                    </span>
                                    <span className="text-gray-500 text-xs ml-2">
                                      {" "}
                                      (Qty: {item.quantity} @ NPR{" "}
                                      {parseFloat(item.unitPrice).toFixed(2)})
                                    </span>
                                  </div>
                                  <span className="text-gray-700 font-semibold">
                                    NPR {parseFloat(item.totalPrice).toFixed(2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {order.transaction && (
                            <div className="mb-4 pt-4 border-t border-gray-200">
                              <h4 className="font-semibold text-gray-700 mb-2 text-md flex items-center">
                                <CreditCard
                                  size={20}
                                  className="mr-2 text-gray-500"
                                />{" "}
                                Transaction Details:
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
                                <p>
                                  Status:
                                  <span
                                    className={`font-medium ml-1 ${
                                      order.transaction.paymentStatus ===
                                      "COMPLETE"
                                        ? "text-green-700"
                                        : "text-yellow-700"
                                    }`}
                                  >
                                    {order.transaction.paymentStatus.toUpperCase()}
                                  </span>
                                </p>
                                <p>
                                  Method:{" "}
                                  <span className="font-medium text-gray-800">
                                    {order.transaction.paymentMethod.toUpperCase()}
                                  </span>
                                </p>
                                {order.transaction.transactionId && (
                                  <p className="sm:col-span-2">
                                    eSewa Txn ID:{" "}
                                    <span className="font-mono text-xs text-gray-800">
                                      {order.transaction.transactionId}
                                    </span>
                                  </p>
                                )}
                                {order.transaction.paymentDate && (
                                  <p>
                                    Payment Date:{" "}
                                    <span className="font-medium text-gray-800">
                                      {formatDate(
                                        order.transaction.paymentDate
                                      )}
                                    </span>
                                  </p>
                                )}
                                <p>
                                  Amount:{" "}
                                  <span className="font-medium text-gray-800">
                                    NPR{" "}
                                    {parseFloat(
                                      order.transaction.amount
                                    ).toFixed(2)}
                                  </span>
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="pt-4 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-700 mb-1 text-md">
                              Delivery Address:
                            </h4>
                            <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed bg-gray-50 p-3 rounded-md">
                              {order.deliveryAddress}
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                              Delivery Status:{" "}
                              <span className="font-semibold text-gray-800">
                                {order.deliveryStatus
                                  .replace(/_/g, " ")
                                  .toUpperCase()}
                              </span>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "appointments" && (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3 sm:mb-0">
                      My Appointments
                    </h2>
                    <button
                      onClick={() => navigate("/bookAppointment")}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center shadow-sm hover:shadow-md transition-all"
                    >
                      <Calendar size={18} className="mr-2" />
                      Book New Appointment
                    </button>
                  </div>
                  {isLoadingAppointments ? (
                    <p>Loading appointments...</p>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <Calendar
                        size={60}
                        className="mx-auto text-gray-300 mb-4"
                      />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        No Appointments Scheduled
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Ready for a check-up or need expert advice? Book an
                        appointment today.
                      </p>
                      <button
                        onClick={() => navigate("/bookAppointment")}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                      >
                        Book an Appointment
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <div className="p-2 sm:p-6">
                        <div className="flex flex-wrap gap-2 mb-6">
                          {(
                            [
                              "all",
                              "scheduled",
                              "completed",
                              "cancelled",
                            ] as const
                          ).map((filter) => (
                            <button
                              key={filter}
                              onClick={() => setAppointmentFilter(filter)}
                              className={`px-4 py-2 text-sm rounded-full font-medium transition-colors ${
                                appointmentFilter === filter
                                  ? "bg-blue-600 text-white shadow-md"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                          ))}
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {[
                                  "Pet & Service",
                                  "Date & Time",
                                  "Veterinarian",
                                  "Status",
                                  "Actions",
                                ].map((header) => (
                                  <th
                                    key={header}
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredAppointments.map((appointment) => (
                                <tr
                                  key={appointment.id}
                                  className="hover:bg-gray-50 transition-colors"
                                >
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ring-2 ring-blue-200">
                                        <PawPrint size={20} />
                                      </div>
                                      <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">
                                          {appointment.pet.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {appointment.service.name}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      {formatDate(appointment.date, false)}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {new Date(
                                        appointment.date
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                      Dr. {appointment.veterinarian.fullName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {appointment.veterinarian.speciality ||
                                        "General Vet"}
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        appointment.status === "scheduled"
                                          ? "bg-blue-100 text-blue-800"
                                          : appointment.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : appointment.status === "cancelled"
                                          ? "bg-red-100 text-red-800"
                                          : "bg-yellow-100 text-yellow-800"
                                      }`}
                                    >
                                      {appointment.status
                                        .charAt(0)
                                        .toUpperCase() +
                                        appointment.status.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                                    {appointment.status === "scheduled" && (
                                      <button
                                        onClick={() =>
                                          handleCancelAppointment(
                                            appointment.id
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                                        disabled={isCancellingAppointment}
                                      >
                                        {isCancellingAppointment
                                          ? "Cancelling..."
                                          : "Cancel"}
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          success: { style: { background: "green", color: "white" } },
          error: { style: { background: "red", color: "white" } },
        }}
      />
    </div>
  );
}
