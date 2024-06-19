import { getOrders } from "@/lib/actions/actions";
// import { useUser } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const Orders = async () => {
  const { userId } = auth();
  const orders = await getOrders(userId!);

  return (
    <div className="sm:px-10 py-5 max-sm:px-3  min-h-[90vh]">
      <p className="text-heading3-bold my-10">Your Orders</p>
      {!orders || (orders.length === 0 && (
        <p className="text-body-bold my-5">You have no orders yet.</p>
      ))}

      <div className="flex flex-col gap-10">
        {orders?.map((order: OrderType) => (
          <div key={order._id} className="flex flex-col gap-8 p-2 sm:p-4 hover:bg-grey-1">
            <div className="flex gap-20 max-md:flex-col max-md:gap-3">
              {/* <p className="text-base-bold">Order ID: {order._id}</p> */}
              <p className="text-base-bold">
                Total Amount: ${order.totalAmount}
              </p>
              <p className="text-base-bold">
                Status: {order.status}
              </p>
              <p className="text-base-bold">
                Ordered On: {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {order.products.map((orderItem: OrderItemType, i) => (
                <div key={i} className="flex gap-4">
                  {orderItem.product ? (
                    <>
                      <Image
                        src={orderItem.product.media[0]}
                        alt={orderItem.product.title}
                        width={100}
                        height={100}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex flex-col justify-between">
                        <p className="text-small-medium">
                          Title:{" "}
                          <span className="text-small-bold">
                            <Link href={`/products/${orderItem.product._id}`}>
                              {orderItem.product.title}
                            </Link>
                          </span>
                        </p>
                        <p className="text-small-medium">
                        shippingRate:{" "}
                          <span className="text-small-bold">
                            {order.shippingRate==="shr_1PBuy1BxsJkAdKVPWZgtJcuW"?"Free Delivery":order.shippingRate}
                          </span>
                        </p>
                        <p className="text-small-medium">
                          Unit price:{" "}
                          <span className="text-small-bold">
                            {orderItem.product.price}
                          </span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col justify-between">
                      <p className="text-small-medium text-red-500">
                        This product has been deleted from the Website .
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col justify-between">

                    <p className="text-small-medium">
                      Color:{" "}
                      <span className="text-small-bold">
                        {orderItem.color ? orderItem.color : "N/A"}
                      </span>
                    </p>
                    <p className="text-small-medium">
                      Size:{" "}
                      <span className="text-small-bold">
                        {orderItem.size ? orderItem.size : "N/A"}

                      </span>
                    </p>
                    <p className="text-small-medium">
                      Quantity:{" "}
                      <span className="text-small-bold">
                        {orderItem.quantity}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};

export const dynamic = "force-dynamic";
export default Orders;

