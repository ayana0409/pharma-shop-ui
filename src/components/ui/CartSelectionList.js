import { useState, useRef, useEffect, useCallback } from "react";

const CartSelectionList = ({ items, loadMoreItems, onItemSelect, onItemDelete, onQuantityChange }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const loaderRef = useRef(null);

  const handleSelect = (item) => {
    setSelectedItems(prevSelected =>
      prevSelected.includes(item)
        ? prevSelected.filter(i => i !== item)
        : [...prevSelected, item]
    );
    onItemSelect(item);
  };

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      loadMoreItems();
    }
  }, [loadMoreItems]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, { threshold: 1.0 });
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [handleObserver]);

  return (
    <div className="h-96 overflow-y-auto rounded-lg border-4 border-solid border-green-800">
      {items.map((item, index) => (
        <div
          key={index}
          className="bg-green-200 p-2 flex items-center space-x-4 border border-solid border-gray-400"
        >
          <input
            type="checkbox"
            checked={selectedItems.includes(item)}
            onChange={() => handleSelect(item)}
            className="form-checkbox text-green-600"
          />
          <div className="grid grid-cols-5 w-full">
            <img className="col-span-1 w-24" src={item.imageUrl}/>
            <h3 className="text-lg font-semibold col-span-3">{item.productName}</h3>
            <p className="text-sm text-gray-600 col-span-1">Price: ${item.price}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onQuantityChange(item, Math.max(1, item.quantity - 1))}
              className="px-2 py-1 bg-green-300 rounded-md"
            >
              -
            </button>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => onQuantityChange(item, Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-12 text-center border rounded-md"
            />
            <button
              onClick={() => onQuantityChange(item, item.quantity + 1)}
              className="px-2 py-1 bg-green-300 rounded-md"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onItemDelete(item)}
            className="ml-4 px-4 py-2 bg-red-400 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      ))}
      <div ref={loaderRef} className="text-center py-4">
        <span>Loading more items...</span>
      </div>
    </div>
  );
};

  export default CartSelectionList