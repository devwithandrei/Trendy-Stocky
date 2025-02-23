"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Container from "@/components/ui/container";
import { Order, OrderStatus, OrderStatusColors } from "@/types";
import axios from "axios";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

const OrdersPage = () => {
  const { user } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const response = await axios.get(`/api/users/${user.id}/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <Container>
        <div className="flex items-center justify-center h-96">
          <p className="text-neutral-500">Please sign in to view your orders.</p>
        </div>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-black" />
        </div>
      </Container>
    );
  }

  return (
    <div className="bg-white">
      <Container>
        <div className="px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-black">Order History</h1>
          <div className="mt-8">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-neutral-500">No orders found.</p>
                <a 
                  href="/"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Continue Shopping
                </a>
              </div>
            ) : (
              <div className="space-y-8">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-6 bg-gray-50 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-gray-600">
                          Order placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                        </p>
                        <p className="text-sm text-gray-600">Order #{order.id}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${OrderStatusColors[order.status]}`}
                        >
                          {order.status}
                        </span>
                          <p className="text-lg font-semibold">
                            {order.formattedTotal}
                          </p>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="py-4 flex items-center">
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="h-20 w-20 object-cover rounded"
                          />
                          <div className="ml-4 flex-1">
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </h3>
                            <div className="mt-1 text-sm text-gray-500 space-y-1">
                              <p>Quantity: {item.quantity}</p>
                              {item.product.selectedSize && (
                                <p>Size: {item.product.selectedSize.name}</p>
                              )}
                              {item.product.selectedColor && (
                                <p>Color: {item.product.selectedColor.name}</p>
                              )}
                              {item.product.category && (
                                <p>Category: {item.product.category.name}</p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            ${Number(item.product.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <p className="font-medium">Shipping Details</p>
                        <div className="text-right">
                          <p>{order.customerDetails.name}</p>
                          <p>{order.customerDetails.address.line1}</p>
                          <p>{order.customerDetails.address.city}, {order.customerDetails.address.postal_code}</p>
                          <p>{order.customerDetails.address.country}</p>
                          <p>{order.customerDetails.phone}</p>
                          <p>{order.customerDetails.email}</p>
                        </div>
                      </div>
                      {order.trackingNumber && (
                        <div className="flex justify-between text-sm text-gray-600">
                          <p className="font-medium">Tracking Number</p>
                          <p>{order.trackingNumber}</p>
                        </div>
                      )}
                      
                      {order.status === ('SHIPPED' as OrderStatus) && !order.trackingNumber && (
                        <div className="text-sm text-gray-600 italic">
                          Tracking information will be available soon
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default OrdersPage;
