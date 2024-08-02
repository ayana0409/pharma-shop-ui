import CartSelectionList from "../../components/ui/CartSelectionList";
import { useEffect, useState } from "react";
import * as request from "../../utils/request";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const size = 12;

  const loadMoreItems = () => {
    const json = JSON.stringify({
      pageIndex: currentPage,
      pageSize: size,
      Keyword: "",
    });
    const formData = new FormData();
    formData.append("request", json);

    request.post("cart/getitems", formData).then((response) => {
      const newItems = response.datas;
      if (!newItems.length) {
        setHasMoreItems(false);
      } else {
        setCartItems((prevItems) => [...prevItems, ...newItems]);
        setTotal(response.total);
        setCurrentPage(currentPage + 1);
      }
    });
  };

  useEffect(() => {
    const items = [];
    setCartItems(items);
  }, []);

  const handleItemSelect = (item) => {
    console.log("Selected item:", item);
  };

  const handleItemDelete = (item) => {
    setCartItems(cartItems.filter((i) => i.id !== item.id));
  };

  const handleQuantityChange = (item, newQuantity) => {
    setCartItems(
      cartItems.map((i) =>
        i.id === item.id ? { ...i, quantity: newQuantity } : i
      )
    );
  };

  const handleLoadMore = async () => {
    if (hasMoreItems) loadMoreItems();
  };

  return (
    <>
      <h1>Cart</h1>
      <CartSelectionList
        items={cartItems}
        loadMoreItems={handleLoadMore}
        onItemSelect={handleItemSelect}
        onItemDelete={handleItemDelete}
        onQuantityChange={handleQuantityChange}
      />
    </>
  );
};

export default Cart;
