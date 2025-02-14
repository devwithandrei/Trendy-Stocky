'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Order } from '@/types';
import Container from '@/components/ui/container';
import Currency from '@/components/ui/currency';
import { format } from 'date-fns';
import Image from 'next/image';

const OrderPage = () => {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!params?.orderId) return;
        
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/${params.orderId}`
        );
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params?.orderId) {
      fetchOrder();
    }
  }, [params?.orderId]);

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center h-full py-16">
          <div className="text-center">Loading order details...</div>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <div className="flex items-center justify-center h-full py-16">
          <div className="text-center">Order not found.</div>
        </div>
      </Container>
    );
  }

  const orderStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const totalPrice = order.orderItems.reduce((total, item) => {
    return total + Number(item.price) * item.quantity;
  }, 0);

  return (
    <Container>
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg">
            {/* Order Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Order Details
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  orderStatusColors[order.status as keyof typeof orderStatusColors]
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Order placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
              </p>
              {order.trackingNumber && (
                <p className="mt-1 text-sm text-gray-600">
                  Tracking Number: {order.trackingNumber}
                </p>
              )}
            </div>

            {/* Order Items */}
            <div className="px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
              <ul className="mt-4 divide-y divide-gray-200">
                {order.orderItems.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        width={100}
                        height={100}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-base font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <Currency value={item.price} />
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.size.value} | Color: {item.color.name}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Summary */}
            <div className="px-6 py-4 bg-gray-50 rounded-b-lg">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <Currency value={totalPrice} />
              </div>
            </div>

            {/* Shipping Information */}
            <div className="px-6 py-4 border-t border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Shipping Information
              </h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Contact Information
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.customerName}
                  </p>
                  <p className="text-sm text-gray-500">{order.customerEmail}</p>
                  <p className="text-sm text-gray-500">{order.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Shipping Address
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {order.address}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.city}, {order.postalCode}
                  </p>
                  <p className="text-sm text-gray-500">{order.country}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrderPage;
