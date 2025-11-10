import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, MapPin, MessageCircle, Calendar } from "lucide-react";
import axiosInstance from "../../utils/axiosConfig";
import Swal from "sweetalert2";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    wantsOffers: false,
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [deliveryDate, setDeliveryDate] = useState("");

  // Delivery points configuration
  const DELIVERY_POINTS = [
    { id: "point_a", name: "Delivery Point A", address: "Dr. Rajarethinam Homeopathic Clinic, Poornam Tower, Neela South Street, Nagapattinam.", freeDelivery: true },
    { id: "point_b", name: "Delivery Point B", address: "Mr. Fit Gym, Public Office Road, Nagapattinam (Near Collector Office).", freeDelivery: true },
    { id: "point_c", name: "Delivery Point C", address: "Arthi Medicals, Public Office Road, Near NDHS School, Velipalayam, Nagapattinam.", freeDelivery: true },
    { id: "home_delivery", name: "Home Delivery", address: "Deliver to my address", freeDelivery: false, charge: 10 }
  ];

  // WhatsApp number for payments
  const WHATSAPP_NUMBER = import.meta.env.VITE_BUSINESS_WHATSAPP_NUMBER;

  useEffect(() => {
    const stored = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    setCartItems(stored);
    
    // Set default delivery date to today
    const today = new Date();
    setDeliveryDate(today.toISOString().split('T')[0]);
  }, []);

  const updateCart = (updated) => {
    setCartItems(updated);
    sessionStorage.setItem("cartItems", JSON.stringify(updated));
  };

  const updateQuantity = (id, change) => {
    const updated = cartItems.map((item) => {
      if (item._id === id) {
        const newQty = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateCart(updated);
  };

  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    updateCart(updated);
  };

  const productTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = productTotal + deliveryCharge;

  const handleDeliveryPointChange = (pointId) => {
    setSelectedDeliveryPoint(pointId);
    const point = DELIVERY_POINTS.find(p => p.id === pointId);
    setDeliveryCharge(point?.freeDelivery ? 0 : (point?.charge || 0));
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  // Format date for display
  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Slider steps for the SweetAlert (updated to include delivery date)
  const getSliderSteps = (orderId, total, selectedPoint, deliveryDate) => {
    return [
      {
        title: "Order Confirmed!",
        content: `
          <div class="text-center space-y-4">
            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 class="font-bold text-green-800 text-xl mb-3">📦 Order Placed Successfully!</h3>
              <p class="text-green-700">Your order has been received and is being processed.</p>
            </div>
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p class="text-blue-800 font-semibold">Order ID: <span class="font-mono">${orderId}</span></p>
              <p class="text-blue-800 font-semibold mt-2">Total Amount: <span class="text-green-600">₹${total}</span></p>
              <p class="text-blue-800 font-semibold mt-1">Delivery Date: <span class="text-purple-600">${formatDeliveryDate(deliveryDate)}</span></p>
            </div>
          </div>
        `
      },
      {
        title: "💳 Payment Method",
        content: `
          <div class="space-y-4">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 class="font-bold text-blue-800 text-lg mb-3">UPI Payment (Any App)</h3>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="font-semibold">Amount to Pay:</span>
                  <span class="font-bold text-green-600">₹${total}</span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="font-semibold">UPI Number:</span>
                  <span class="font-mono text-blue-600 text-right">${WHATSAPP_NUMBER}</span>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        title: "📱 How to Pay",
        content: `
          <div class="space-y-4">
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p class="text-sm text-yellow-800 font-semibold mb-3">Follow these steps:</p>
              <ol class="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
                <li>Open <strong>GPay, PhonePe, Paytm</strong></li>
                <li>Send payment to UPI Number: <strong class="font-mono">${WHATSAPP_NUMBER}</strong></li>
                <li>Enter amount: <strong>₹${total}</strong></li>
                <li>Complete the payment</li>
                <li>Take screenshot of successful payment</li>
              </ol>
            </div>
          </div>
        `
      },
      {
        title: "📋 Order Summary",
        content: `
          <div class="space-y-4">
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 class="font-bold text-gray-800 text-lg mb-3">Order Details</h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span>Order ID:</span>
                  <span class="font-mono">${orderId}</span>
                </div>
                <div class="flex justify-between">
                  <span>Customer Name:</span>
                  <span>${customer.name}</span>
                </div>
                <div class="flex justify-between">
                  <span>Delivery Point:</span>
                  <span>${selectedPoint.name}</span>
                </div>
                <div class="flex justify-between">
                  <span>Delivery Date:</span>
                  <span class="text-purple-600 font-semibold">${formatDeliveryDate(deliveryDate)}</span>
                </div>
                <div class="border-t pt-2 mt-2">
                  <div class="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span class="text-green-600">₹${total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `
      },
      {
        title: "📸 Final Step",
        content: `
          <div class="space-y-4">
            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 class="font-bold text-orange-800 text-lg mb-3">Share Payment Screenshot</h3>
              <p class="text-sm text-orange-700 mb-3">
                After successful payment, share the screenshot on WhatsApp for verification.
              </p>
              <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                <p class="text-xs text-green-800 font-semibold">WhatsApp Number:</p>
                <p class="text-center font-mono text-green-600 text-lg font-bold">${WHATSAPP_NUMBER}</p>
              </div>
            </div>
          </div>
        `
      }
    ];
  };

  const placeOrder = async () => {
    // Validate required fields - add deliveryDate
    if (!customer.name || !customer.phone || !selectedDeliveryPoint || !deliveryDate) {
      await Swal.fire({
        icon: "warning",
        title: "Incomplete Details",
        text: "Please fill name, phone, select delivery point, and choose delivery date to place order.",
        confirmButtonColor: "#FF9800",
      });
      return;
    }

    // Validate phone number
    if (!/^\d{10}$/.test(customer.phone)) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Phone",
        text: "Please enter a valid 10-digit phone number.",
        confirmButtonColor: "#FF9800",
      });
      return;
    }

    // Validate home delivery address
    if (selectedDeliveryPoint === 'home_delivery' && !customer.address.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Address Required",
        text: "Please enter your delivery address for home delivery.",
        confirmButtonColor: "#FF9800",
      });
      return;
    }

    const selectedPoint = DELIVERY_POINTS.find(p => p.id === selectedDeliveryPoint);
    const finalAddress = selectedPoint.id === 'home_delivery' 
      ? customer.address 
      : `${selectedPoint.name}, ${selectedPoint.address}`;

    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const payload = {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || undefined,
      address: finalAddress,
      wantsOffers: customer.wantsOffers,
      products: cartItems.map((ci) => ({
        productId: ci.id || ci._id,
        productName: ci.productName,
        quantity: ci.quantity,
        price: ci.price,
        orderType: ci.orderType,
        packName: ci.packName,
      })),
      totalPrice: Math.round(total),
      deliveryPoint: selectedDeliveryPoint,
      deliveryCharge: deliveryCharge,
      deliveryDate: deliveryDate,
      transactionId: orderId,
    };

    setPlacingOrder(true);
    
    try {
      // Save order to database
      const orderRes = await axiosInstance.post("/api/orders", payload, {
        withCredentials: true,
      });

      if (!(orderRes.status === 200 || orderRes.status === 201)) {
        throw new Error("Order placement failed");
      }

      console.log("Order placed successfully, ID:", orderId);

      // Show slider-style payment instructions
      const steps = getSliderSteps(orderId, total, selectedPoint, deliveryDate);
      let currentStep = 0;

      const showStep = (stepIndex) => {
        const step = steps[stepIndex];
        
        Swal.fire({
          title: step.title,
          html: step.content + `
            <div class="mt-6 flex justify-between items-center">
              <div class="flex items-center space-x-2">
                ${steps.map((_, index) => `
                  <div class="w-2 h-2 rounded-full ${index === stepIndex ? 'bg-green-500' : 'bg-gray-300'}"></div>
                `).join('')}
              </div>
              <div class="flex space-x-2">
                ${stepIndex > 0 ? `
                  <button id="prev-btn" class="px-4 py-2 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    <div class="flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                      Previous
                    </div>
                  </button>
                ` : ''}
                ${stepIndex < steps.length - 1 ? `
                  <button id="next-btn" class="px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    <div class="flex items-center">
                      Next
                      <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </button>
                ` : ''}
              </div>
            </div>
          `,
          showConfirmButton: false,
          showCancelButton: false,
          showCloseButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          width: 600,
          didOpen: () => {
            // Add event listeners for navigation buttons
            if (stepIndex > 0) {
              const prevBtn = document.getElementById('prev-btn');
              prevBtn.addEventListener('click', () => {
                Swal.close();
                currentStep = stepIndex - 1;
                setTimeout(() => showStep(currentStep), 100);
              });
            }

            if (stepIndex < steps.length - 1) {
              const nextBtn = document.getElementById('next-btn');
              nextBtn.addEventListener('click', () => {
                Swal.close();
                currentStep = stepIndex + 1;
                setTimeout(() => showStep(currentStep), 100);
              });
            }
          }
        });
      };

      // Show first step
      showStep(currentStep);

      // After slider completes, show final action buttons
      const checkForFinalStep = setInterval(() => {
        if (currentStep === steps.length - 1) {
          clearInterval(checkForFinalStep);
          // Wait a bit for the final step to be displayed
          setTimeout(() => {
            Swal.fire({
              title: "Almost Done!",
              html: `
                <div class="text-center space-y-4">
                  <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p class="text-green-700 font-semibold">Your order is confirmed!</p>
                    <p class="text-sm text-green-600 mt-2">Complete your payment and share the screenshot.</p>
                  </div>
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p class="text-xs text-blue-700">
                      <strong>UPI Number:</strong> <span class="font-mono">${WHATSAPP_NUMBER}</span><br>
                      <strong>Amount:</strong> <span class="text-green-600">₹${total}</span><br>
                      <strong>Delivery Date:</strong> <span class="text-purple-600">${formatDeliveryDate(deliveryDate)}</span>
                    </p>
                  </div>
                </div>
              `,
              showCancelButton: true,
              confirmButtonText: "Share Screenshot on WhatsApp",
              cancelButtonText: "I'll Pay Later",
              confirmButtonColor: "#25D366",
              cancelButtonColor: "#6b7280",
              showCloseButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
              width: 500,
            }).then(async (result) => {
              if (result.isConfirmed) {
                // Open WhatsApp for sharing screenshot
                const whatsappMessage = encodeURIComponent(
                  `Payment Screenshot for Order #${orderId}\n\nCustomer: ${customer.name}\nOrder Amount: ₹${total}\nDelivery Date: ${formatDeliveryDate(deliveryDate)}\n\nPlease find the payment screenshot attached.`
                );
                
                window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`, '_blank');
                
                await Swal.fire({
                  icon: "success",
                  title: "WhatsApp Opened!",
                  html: `
                    <div class="text-center space-y-3">
                      <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p class="text-sm text-green-700">Please share your payment screenshot in the opened WhatsApp chat.</p>
                      </div>
                      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p class="text-xs text-blue-700">
                          <strong>Remember to:</strong><br>
                          1. Attach the payment screenshot<br>
                          2. Send the message with your order details
                        </p>
                      </div>
                    </div>
                  `,
                  confirmButtonText: "Got it!",
                  confirmButtonColor: "#25D366",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                });
              } else {
                // User chose to pay later
                await Swal.fire({
                  icon: "info",
                  title: "Payment Pending",
                  html: `
                    <div class="text-center space-y-3">
                      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p class="text-yellow-700 font-semibold">Remember to complete your payment!</p>
                      </div>
                      <div class="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p class="text-sm text-gray-700"><strong>Order Details:</strong></p>
                        <div class="text-left space-y-1 mt-2">
                          <div class="flex justify-between text-xs">
                            <span>Amount:</span>
                            <span class="font-bold">₹${total}</span>
                          </div>
                          <div class="flex justify-between text-xs">
                            <span>Delivery Date:</span>
                            <span class="font-semibold text-purple-600">${formatDeliveryDate(deliveryDate)}</span>
                          </div>
                          <div class="flex justify-between text-xs">
                            <span>UPI Number:</span>
                            <span class="font-mono">${WHATSAPP_NUMBER}</span>
                          </div>
                          <div class="flex justify-between text-xs">
                            <span>Order ID:</span>
                            <span class="font-mono">${orderId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  `,
                  confirmButtonColor: "#25D366",
                  allowOutsideClick: false,
                  allowEscapeKey: false,
                });
              }

              // Clear cart and reset form after final action
              sessionStorage.removeItem("cartItems");
              setCartItems([]);
              setShowCustomerForm(false);
              setCustomer({
                name: "",
                phone: "",
                email: "",
                address: "",
                wantsOffers: false,
              });
              setSelectedDeliveryPoint("");
              setDeliveryCharge(0);
              // Reset delivery date to today
              const today = new Date();
              setDeliveryDate(today.toISOString().split('T')[0]);
            });
          }, 100);
        }
      }, 100);

    } catch (err) {
      console.error("Failed to place order:", err);
      
      await Swal.fire({
        icon: "error",
        title: "Order Failed",
        text: "Failed to place order. Please try again.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-10 px-5 md:px-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-8 text-center">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gray-600 text-sm md:text-base text-center py-16"
          >
            Your cart is empty <br />
            <span className="text-orange-500 font-semibold text-sm">
              Add something healthy to your basket!
            </span>
          </motion.p>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              <AnimatePresence>
                {cartItems.map((item, idx) => (
                  <motion.div
                    key={item._id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="py-3"
                  >
                    <div>
                      <div className="flex justify-between items-center text-gray-800 font-medium">
                        <span className="text-sm md:text-base">{item.productName}</span>
                        <span className="text-xs text-gray-500">{item.packName}</span>
                      </div>

                      <div className="flex items-center justify-between py-3 text-xs md:text-sm">
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.orderType === "weeklySubscription" 
                              ? "bg-blue-100 text-blue-800" 
                              : item.orderType === "monthlySubscription"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {item.orderType === "weeklySubscription" 
                              ? "Weekly" 
                              : item.orderType === "monthlySubscription"
                              ? "Monthly"
                              : "Single"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center space-x-2">
                          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-3 py-1 font-semibold text-gray-800 text-xs">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item._id)}
                            className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <span className="font-bold text-gray-900 text-sm md:text-base w-20 text-right">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="mt-6 space-y-2 border-t border-gray-300 pt-4">
              <div className="flex justify-between text-sm">
                <span>Products Total:</span>
                <span>₹{productTotal.toFixed(2)}</span>
              </div>
              {deliveryCharge > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Delivery Charge:</span>
                  <span>₹{deliveryCharge.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2">
                <span>Total Amount:</span>
                <span className="text-orange-600">₹{total.toFixed(2)}</span>
              </div>
            </div>

            <AnimatePresence>
              {showCustomerForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 space-y-4"
                >
                  {/* Customer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs md:text-sm text-gray-700">
                    <input
                      className="border border-gray-300 rounded px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
                      placeholder="Full Name *"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      required
                    />
                    <input
                      className="border border-gray-300 rounded px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
                      placeholder="Phone Number (10 digits) *"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                      maxLength={10}
                      required
                    />
                    <input
                      className="border border-gray-300 rounded px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
                      placeholder="Email (optional)"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    />
                    
                    {/* Delivery Date Field */}
                    <div className="relative">
                      <label className="block text-xs text-gray-600 mb-1 flex items-center gap-1">
                        <Calendar size={14} />
                        Delivery Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full border border-gray-300 rounded px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-orange-400"
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          min={getMinDate()}
                          max={getMaxDate()}
                          required
                        />
                     
                      </div>
                      {deliveryDate && (
                        <p className="text-xs text-purple-600 mt-1 font-medium">
                          {formatDeliveryDate(deliveryDate)}
                        </p>
                      )}
                    </div>

                    <label className="flex items-center gap-2 text-xs md:col-span-2 text-gray-600">
                      <input
                        type="checkbox"
                        checked={customer.wantsOffers}
                        onChange={(e) => setCustomer({ ...customer, wantsOffers: e.target.checked })}
                      />
                      I want to receive offer emails
                    </label>
                  </div>

                  {/* Delivery Points Selection */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <MapPin size={16} />
                      Select Delivery Point *
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {DELIVERY_POINTS.map((point) => (
                        <label
                          key={point.id}
                          className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                            selectedDeliveryPoint === point.id
                              ? "border-green-500 bg-green-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="deliveryPoint"
                            value={point.id}
                            checked={selectedDeliveryPoint === point.id}
                            onChange={(e) => handleDeliveryPointChange(e.target.value)}
                            className="hidden"
                          />
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-sm">{point.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{point.address}</div>
                            </div>
                            <div className="text-right">
                              {point.freeDelivery ? (
                                <span className="text-green-600 text-xs font-bold">FREE</span>
                              ) : (
                                <span className="text-orange-600 text-xs font-bold">₹{point.charge}</span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Home Delivery Address (if selected) */}
                    {selectedDeliveryPoint === 'home_delivery' && (
                      <div className="mt-3">
                        <textarea
                          className="w-full border border-gray-300 rounded px-3 py-2 placeholder-gray-400 focus:ring-2 focus:ring-orange-400 text-sm"
                          placeholder="Enter your complete delivery address with landmark *"
                          rows={3}
                          value={customer.address}
                          onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Payment Information */}
                  <div className="border-t pt-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                      <MessageCircle size={16} className="text-green-600" />
                      Payment Method
                    </h3>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-800">
                        After placing order, you'll receive complete payment instructions in a step-by-step guide.
                        You'll need to send payment via UPI and share the screenshot on WhatsApp for verification.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 text-center">
              {!showCustomerForm ? (
                <motion.button
                  onClick={() => setShowCustomerForm(true)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.03 }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2.5 text-sm md:text-base rounded-lg font-semibold shadow-md transition-all duration-300"
                >
                  Place Order
                </motion.button>
              ) : (
                <motion.button
                  onClick={placeOrder}
                  disabled={placingOrder}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: placingOrder ? 1 : 1.05 }}
                  className={`px-8 py-2.5 text-sm md:text-base rounded-lg font-semibold shadow-md transition-all duration-300 ${
                    placingOrder
                      ? "bg-gray-400 cursor-not-allowed text-white" 
                      : "bg-green-500 hover:bg-green-600 text-white"
                  }`}
                >
                  {placingOrder ? "Placing Order..." : `Confirm Order - ₹${total.toFixed(2)}`}
                </motion.button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}