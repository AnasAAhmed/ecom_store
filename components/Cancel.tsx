'use client';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LoaderIcon } from 'lucide-react';
import Modal from './Modal';

type OrderManageProps = {
  order: OrderType;
};

const CancelOrder = ({ order }: OrderManageProps) => {
  const [loadingUp, setLoadingUp] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);

  useEffect(() => {
    setNewStatus(order.status);
  }, [order._id])

  const handleSubmit = async () => {
    if (!newStatus) return;

    try {
      setLoadingUp(true);
      const res = await fetch(`/api/order/${order._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: `Canceled: ${newStatus}` }),
      });

      if (res.ok) {
        setLoadingUp(false);
        window.location.href = `/orders`;
        toast.success('Order Canceled successfully we will Contact you in an hour');
      } else {
        toast.error('Internal server error. Please try again.');
        setLoadingUp(false);
      }
    } catch (err) {
      setLoadingUp(false);
      console.error('Error updating order status:', err); 
      toast.error('Internal server error. Please try again.');
    }
  };

  const cancellationReasons = [
    "Found a better price elsewhere",
    "Changed my mind",
    "Item is no longer needed",
    "Ordered by mistake",
    "Shipping time was too long",
    "Prefer a different product",
    "Issues with payment",
    "Concerns about product quality",
    "Other"
  ];
  const orderCreationTime = new Date(order.createdAt).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = (currentTime - orderCreationTime) / (1000 * 60 * 60);
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Details &rarr;</button>
      <Modal onClose={onClose} isOpen={isOpen} overLay={true}>
        <div className=" animate-modal flex flex-col justify-center items-center space-y-4 bg-gray-100 pb-4 px-4 rounded shadow-md">
          <button className='print:hidden text-[26px] self-end mt-3' onClick={() => setIsOpen(false)}>&times;</button>

          <div className="flex flex-wrap gap-3 items-center pb-3">
            <div className="flex flex-col pb-10 px-10 gap-5">
              <p className="text-base-bold">
                Order ID: <span className="text-base-medium">{order._id}</span>
              </p>
              <p className="text-base-bold">
                Placed order on: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="text-base-bold">
                Currency: <span className="text-base-medium">{order.currency}</span>
              </p>
              <p className="text-base-bold">
                Shipping address: <span className="text-base-medium leading-8">{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}, phone:{order.shippingAddress.phone || "null"}</span>
              </p>
              <p className="text-base-bold">
                Total {!order.status.startsWith('COD')&&'Paid'}: <span className="text-base-medium">${order.totalAmount}</span>
              </p>
              <p className="text-base-bold">
                Shipping rate: <span className="text-base-medium">({order.currency}) {order.shippingRate}</span>
              </p>
              <p className="text-base-bold">
                Status: <span className="text-base-medium ">{order.status}</span>
              </p>
              <p className="text-base-bold">
                Products: <span className="text-base-medium">{order.products.length}</span>
              </p>
              <table>
                <thead className='border'>
                  <th className='border'>Product</th>
                  <th className='border'>size</th>
                  <th className='border'>color</th>
                  <th className='border'>quantity</th>
                </thead>
                  {order.products.map((i)=>(
                <tbody className='border'>
                    <th className='border'>{i.product.title}</th>
                    <th className='border'>{i.size||'N/A'}</th>
                    <th className='border'>{i.color||'N/A'}</th>
                    <th className='border'>{i.quantity}</th>
                </tbody>
                  ))}
              </table>
            </div>
          </div>
          {!order.status.startsWith('Canceled')&& timeDifference <= 12 && (
            <div className='mx-auto print:hidden items-center flex gap-3'>
              <label htmlFor='dd'>Cancel Order:</label>
              <select id='dd' className='h-8' value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {cancellationReasons.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
              {newStatus !== order.status && (
                <button className="bg-blue-500 rounded-md p-3 hover:opacity-55 text-white" onClick={handleSubmit}>
                  {loadingUp ? <LoaderIcon className='mx-[7px] animate-spin' /> : "Confirm"}
                </button>
              )}
            </div>
          )}
          <button className='text-lg bg-black print:hidden text-white rounded-md p-2 self-start' onClick={() => window.print()}>Get Invoice</button>

        </div>
      </Modal>
    </>
  );
};



export default CancelOrder;