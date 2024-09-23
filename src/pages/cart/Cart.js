import CartSelectionList from "../../components/ui/CartSelectionList";
import { useEffect, useState, useLayoutEffect } from "react";
import * as request from "../../utils/request";
import { Button } from "../../components/ui";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useStore, actions } from "../../store";

const Cart = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const size = 12;

  const [state, dispatch] = useStore();
  const { cartItemsCount, token } = state;

  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  const loadMoreItems = () => {
    let total = cartItemsCount;
    request
      .get("cart", {
        params: {
          pageIndex: currentPage,
          pageSize: size,
          keyword: "",
        },
      })
      .then((response) => {
        const newItems = response.datas;

        if (!newItems.length) {
          setHasMoreItems(false);
        } else {
          const newCart = [...cartItems, ...newItems];
          setCartItems(newCart);
          total = response.total;
          setCurrentPage(currentPage + 1);
          setHasMoreItems(newCart.length < total);
        }
      })
      .finally(() => {
        dispatch(actions.setCartItemsCount(total));
      });
  };

  useEffect(() => {
    const price = selectedItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    setTotalPrice(price);
  }, [selectedItems]);

  const handleItemSelect = (items) => {
    setSelectedItems(items);
  };

  const handleItemDelete = (item) => {
    request.default
      .delete(`cart/items/${item.id}`)
      .then(() => {
        setCartItems(cartItems.filter((i) => i.id !== item.id));
        setSelectedItems(cartItems.filter((i) => i.id !== item.id));
        dispatch(actions.setCartItemsCount(cartItemsCount - 1));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleQuantityChange = (item, newQuantity) => {
    request
      .put(`cart/items/${item.id}`, { itemId: item.id, quantity: newQuantity })
      .then(() => {
        setCartItems(
          cartItems.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          )
        );
        setSelectedItems(
          selectedItems.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          )
        );
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLoadMore = async () => {
    if (hasMoreItems) loadMoreItems();
  };

  const handleBuy = () => {
    if (!selectedItems || selectedItems.length === 0) {
      toast.warning("Please chose product.");
      return;
    }

    navigate("/order", { state: { selectedItems } });
  };

  return (
    <>
      <h1 className="font-bold text-3xl text-green-800 mb-8">CART</h1>
      <div className="m-4">
        <CartSelectionList
          items={cartItems}
          loadMoreItems={handleLoadMore}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
          onItemDelete={handleItemDelete}
          onQuantityChange={handleQuantityChange}
          hasMoreItems={hasMoreItems}
        />
        <h3 className="font-bold text-green-900 text-right mx-4">
          {cartItems.length} of {cartItemsCount} items
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-2 font-bold text-green-900 mt-8">
        <div>
          <label>Total price: {totalPrice}</label>
        </div>
        <Button primary onClick={handleBuy}>
          Buy now!
        </Button>
      </div>
    </>
  );
};

export default Cart;
