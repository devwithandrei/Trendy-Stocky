"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import axios from "axios";
import { format } from "date-fns";
import { OrderStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/currency";
import { toast } from "react-hot-toast";
import useCart from "@/hooks/use-cart";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";

interface Order {
  id: string;
  status: OrderStatus;
  isPaid: boolean;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  createdAt: string;
  orderItems: {
    id: string;
    product: {
      id: string;
      name: string;
      price: number;
      images: {
        url: string;
      }[];
    };
    size?: {
      id: string;
      name: string;
    };
    color?: {
      id: string;
      name: string;
    };
    quantity: number;
  }[];
}

const OrdersPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();
  const cart = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    
    if (!isSignedIn) {
      toast.error("Please sign in to view your orders");
      openSignIn();
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/users/orders", {
          params: {
            include: 'size,color' // Request size and color information
          }
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const canceled = urlParams.get('canceled');
    const paymentIntent = urlParams.get('payment_intent');

    const loadOrders = async () => {
      if (success && paymentIntent) {
        try {
          await axios.post("/api/payment-success", { paymentIntentId: paymentIntent });
          toast.success("Payment completed successfully!");
        } catch (error) {
          console.error("Error updating order status:", error);
          toast.error("Error updating order status");
        }
        window.history.replaceState({}, '', '/orders');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      if (canceled) {
        toast.error("Payment was canceled or failed.");
        window.history.replaceState({}, '', '/orders');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      fetchOrders();
    };

    loadOrders();
  }, [isSignedIn, isLoaded, openSignIn]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock className="w-6 h-6" />;
      case "PAID":
        return <Package className="w-6 h-6" />;
      case "SHIPPED":
        return <Truck className="w-6 h-6" />;
      case "DELIVERED":
        return <CheckCircle className="w-6 h-6" />;
      case "CANCELLED":
        return <XCircle className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500";
      case "PAID":
        return "bg-blue-500";
      case "SHIPPED":
        return "bg-purple-500";
      case "DELIVERED":
        return "bg-green-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusMessage = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Order is being processed";
      case "PAID":
        return "Order confirmed and being prepared";
      case "SHIPPED":
        return "Your order is on its way!";
      case "DELIVERED":
        return "Order delivered successfully";
      case "CANCELLED":
        return "Order was cancelled";
      default:
        return "";
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  const activeOrders = orders.filter(order => 
    ["PAID", "SHIPPED", "DELIVERED"].includes(order.status)
  );

  const cancelledOrders = orders.filter(order => 
    order.status === "CANCELLED"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            My Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
            <Package className="w-4 h-4 text-blue-500" />
            <span className="text-gray-600 dark:text-gray-400">Active Orders: {activeOrders.length}</span>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
            <XCircle className="w-4 h-4 text-red-500" />
            <span className="text-gray-600 dark:text-gray-400">Cancelled: {cancelledOrders.length}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Active Orders - Takes up more space */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-500" />
              Active Orders
            </h2>
            <div className="space-y-6">
              <AnimatePresence>
                {activeOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-6"
                  >
                    <p className="text-gray-500 text-lg">No active orders found.</p>
                  </motion.div>
                ) : (
                  activeOrders.map((order: Order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-gray-800 border-0 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(order.createdAt), "MMMM d, yyyy 'at' HH:mm")}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className={`p-2 rounded-full ${getStatusColor(order.status)}`}
                            >
                              {getStatusIcon(order.status)}
                            </motion.div>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{getStatusMessage(order.status)}</p>
                        <Separator className="my-4" />
                        <div className="space-y-4">
                          {order.orderItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded overflow-hidden">
                                  <Image
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    src={item.product.images[0]?.url || '/placeholder.png'}
                                    alt={item.product.name}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                    {item.size && ` • Size: ${item.size.name}`}
                                    {item.color && ` • Color: ${item.color.name}`}
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium">
                                {formatCurrency(item.product.price * item.quantity)}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Total</p>
                          <p className="font-bold">{formatCurrency(order.amount)}</p>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          <p>Shipping Address: {order.address}</p>
                          <p>City: {order.city}</p>
                          <p>Country: {order.country}</p>
                          <p>Postal Code: {order.postalCode}</p>
                          <p>Contact: {order.phone}</p>
                        </div>
                        {order.status === "DELIVERED" && (
                          <div className="mt-4">
                            <Button
                              onClick={() => {
                                order.orderItems.forEach(item => {
                                  cart.addItem({
                                    id: item.product.id,
                                    name: item.product.name,
                                    price: item.product.price.toString(),
                                    quantity: item.quantity,
                                    images: []
                                  });
                                });
                                router.push('/cart');
                                toast.success('Items added to cart');
                              }}
                              className="w-full"
                            >
                              Buy Again
                            </Button>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Canceled Orders - Takes up less space */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-500" />
              Cancelled
            </h2>
            <div className="space-y-6">
              <AnimatePresence>
                {cancelledOrders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-6"
                  >
                    <p className="text-gray-500 text-lg">No canceled orders found.</p>
                  </motion.div>
                ) : (
                  cancelledOrders.map((order: Order) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white dark:bg-gray-800 border-0 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-gray-500">
                              {format(new Date(order.createdAt), "MMMM d, yyyy 'at' HH:mm")}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="p-2 rounded-full bg-red-500"
                            >
                              <XCircle className="w-6 h-6" />
                            </motion.div>
                            <Badge className="bg-red-500">
                              CANCELLED
                            </Badge>
                          </div>
                        </div>
                        <Separator className="my-4" />
                        <div className="space-y-4">
                          {order.orderItems.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16 rounded overflow-hidden">
                                  <Image
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    src={item.product.images[0]?.url || '/placeholder.png'}
                                    alt={item.product.name}
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{item.product.name}</p>
                                  <p className="text-sm text-gray-500">
                                    Quantity: {item.quantity}
                                    {item.size && ` • Size: ${item.size.name}`}
                                    {item.color && ` • Color: ${item.color.name}`}
                                  </p>
                                </div>
                              </div>
                              <p className="font-medium">
                                {formatCurrency(item.product.price * item.quantity)}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Total</p>
                          <p className="font-bold">{formatCurrency(order.amount)}</p>
                        </div>
                        <div className="mt-4">
                          <div className="text-sm text-gray-500 mb-4">
                            <p>Shipping Address: {order.address}</p>
                            <p>City: {order.city}</p>
                            <p>Country: {order.country}</p>
                            <p>Postal Code: {order.postalCode}</p>
                            <p>Contact: {order.phone}</p>
                          </div>
                          <Button
                            onClick={() => {
                              order.orderItems.forEach(item => {
                                cart.addItem({
                                  id: item.product.id,
                                  name: item.product.name,
                                  price: item.product.price.toString(),
                                  quantity: item.quantity,
                                  images: []
                                });
                              });
                              router.push('/cart');
                              toast.success('Items added back to cart');
                            }}
                            className="w-full"
                          >
                            Try Again
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="lg:col-span-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
            >
              <div className="flex flex-col items-center gap-4">
                <Package className="w-16 h-16 text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No orders found.</p>
                <Button
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                >
                  Continue Shopping
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
