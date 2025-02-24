"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { format } from "date-fns";
import { OrderStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/currency";

interface Order {
  id: string;
  status: OrderStatus;
  isPaid: boolean;
  phone: string;
  address: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  createdAt: string;
  orderItems: {
    id: string;
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
}

const OrdersPage = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/users/orders");
        // Only show paid orders
        const paidOrders = response.data.filter((order: Order) => order.isPaid);
        setOrders(paidOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isLoaded, router]);

  if (!isLoaded || loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      <div className="space-y-6">
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          orders.map((order: Order) => (
            <Card key={order.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(order.createdAt), "MMMM d, yyyy 'at' HH:mm")}
                  </p>
                </div>
                <Badge className={getStatusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>
              <Separator className="my-4" />
              <div className="space-y-4">
                {order.orderItems.map((item: Order['orderItems'][0]) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between items-center">
                <p className="font-medium">Total</p>
                <p className="font-bold">{formatCurrency(order.amount)}</p>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Shipping Address: {order.address}</p>
                <p>Contact: {order.phone}</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
