import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";

import UserAddressModal from "../../components/common/Side/UserAddressModal";
import { Input, Button, LoadingScreen } from "../../components/ui";
import * as request from "../../utils/request";
import { useStore, actions } from "../../store";

const Order = () => {
  const [addressId, setAddressId] = useState(0);
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentTotal, setPaymentTotal] = useState(0);

  const [isFilledInfo, setIsFilledInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };

  const [state, dispatch] = useStore();
  const { cartItemsCount, userDiscount, userMaxDiscount } = state;

  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState(1);

  const submitOrder = () => {
    setLoading(true);
    request
      .post("orders", {
        addressId,
        fullName,
        phoneNumber,
        address,
        email,
        cartItems: selectedItems,
        totalPrice: paymentTotal,
        paymentMethod,
      })
      .then(() => {
        toast.success("Create order successfuly.");
        dispatch(
          actions.setCartItemsCount(cartItemsCount - selectedItems.length)
        );
        navigate("/ordersuccess");
      })
      .catch((error) => {
        toast.error("Error on create order.");
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(parseInt(event.target.value));
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: paymentTotal.toFixed(2),
          },
        },
      ],
    });
  };

  const onApprove = async (data, actions) => {
    await actions.order.capture();
    submitOrder();
  };

  const handleSelectedAddress = (address) => {
    if (address.id) {
      setAddressId(address.id);
      setFullName(address.fullName);
      setAddress(address.address);
      setphoneNumber(address.phoneNumber);
      setEmail(address.email);
    }
  };

  const checkInfo = () => {
    if (!fullName || !address || !phoneNumber) {
      setIsFilledInfo(false);
      toast.warning("Please fill require field.");
    } else {
      setIsFilledInfo(true);
    }
  };

  useEffect(() => {
    if (!selectedItems || selectedItems.length === 0) {
      navigate("/");
    }

    const price = selectedItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    setTotalPrice(price);

    const discount =
      (price * userDiscount) / 100 > userMaxDiscount
        ? userMaxDiscount
        : (price * userDiscount) / 100;

    setDiscount(discount);
    setPaymentTotal(price - discount);
  }, [selectedItems, userMaxDiscount, userDiscount, navigate]);

  return (
    <>
      {loading && <LoadingScreen />}
      <div className="mx-2 sm:mx-4">
        <div className="overflow-x-auto mb-8">
          <h1 className="text-3xl font-bold text-green-700 my-2">
            ORDER DETAILS
          </h1>
          <table className="min-w-full bg-white border-2 border-green-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">Image</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Quantity</th>
                <th className="py-2 px-4 border-b">Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">
                    {product.id}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <img
                      className="w-16 h-16 object-cover mx-auto"
                      src={product.imageUrl}
                      alt={product.productName}
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-left">
                    {product.productName}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {product.quantity}
                  </td>
                  <td className="py-2 px-4 border-b text-right">
                    ${product.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            <h3>Total: {totalPrice}</h3>
            <h3>Discount: {discount}</h3>
            <h3>Payment total: {paymentTotal}</h3>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 border-4 border-solid border-green-800 p-4 rounded-lg">
          {isFilledInfo || (
            <div>
              <h1 className="text-3xl font-bold text-green-700 my-2">
                DELIVERY INFO
              </h1>
              <div>
                <label className="text-green-900 text-xl float-start">
                  *Full name
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full focus:bg-blue-100"
                  disabled={addressId !== 0}
                />
              </div>
              <div>
                <label className="text-green-900 text-xl float-start">
                  *Address
                </label>
                <Input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full focus:bg-blue-100"
                  disabled={addressId !== 0}
                />
              </div>
              <div>
                <label className="text-green-900 text-xl float-start">
                  *Phone number
                </label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setphoneNumber(e.target.value)}
                  className="w-full focus:bg-blue-100"
                  disabled={addressId !== 0}
                />
              </div>
              <div>
                <label className="text-green-900 text-xl float-start">
                  Email
                </label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full focus:bg-blue-100"
                  disabled={addressId !== 0}
                />
              </div>
              <div>
                <UserAddressModal
                  onSelect={handleSelectedAddress}
                  children="Select address"
                  className="rounded-lg disabled:bg-gray-600 my-4"
                />
                <label className="text-green-500 text-lg hover:underline hover:text-green-800" hidden={addressId === 0} onClick={() => setAddressId(0)}>
                  Orther address?
                </label>
              </div>
              <div className="text-right">
                <Button primary onClick={() => checkInfo()}>
                  Next
                </Button>
              </div>
            </div>
          )}

          {!isFilledInfo || (
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Select Payment Method</h3>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="paymentMethod"
                    value={1}
                    checked={paymentMethod === 1}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="ml-2">Cash on Delivery (COD)</span>
                </label>
              </div>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio"
                    name="paymentMethod"
                    value={2}
                    checked={paymentMethod === 2}
                    onChange={handlePaymentMethodChange}
                  />
                  <span className="ml-2">PayPal</span>
                </label>
              </div>
              {paymentMethod === 2 && (
                <div className="flex justify-center items-center m-8">
                  <PayPalScriptProvider
                    options={{
                      "client-id":
                        "Abgt6pmDPCgXwGtIqwTFINrc-_VaJTlyXPnFmcKa6gAczmQHCD4COnE2uDe-BeN0Ilri57ZyuZygKKuA",
                    }}
                  >
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                    />
                  </PayPalScriptProvider>
                </div>
              )}
              <div className="float-start">
                <Button primary onClick={() => setIsFilledInfo(!isFilledInfo)}>
                  Back
                </Button>
              </div>
              {paymentMethod === 2 || (
                <div className="float-end">
                  <Button primary onClick={() => submitOrder()}>
                    Submit
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Order;
