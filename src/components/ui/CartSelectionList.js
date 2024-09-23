import { useRef, useEffect, useCallback } from "react";
import { Button } from "./";
import clsx from "clsx";

const CartSelectionList = ({
  items,
  loadMoreItems,
  onItemSelect,
  onItemDelete,
  onQuantityChange,
  selectedItems,
  hasMoreItems,
}) => {
  const loaderRef = useRef(null);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onItemSelect(items);
    }
    else{
      onItemSelect([]);
    }
  };

  const handleSelect = (item) => {
    const newSelectedList = selectedItems.some((i) => i.id === item.id)
      ? selectedItems.filter((i) => i.id !== item.id)
      : [...selectedItems, item];

    onItemSelect(newSelectedList);
  };

  const handleObserver = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        loadMoreItems();
      }
    },
    [loadMoreItems]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1.0,
    });
    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [handleObserver]);

  useEffect(() => {
    loaderRef.current.hidden = !hasMoreItems;
  }, [hasMoreItems]);

  return (
    <>
      <style>
        {`
          input[type=number]::-webkit-outer-spin-button,
          input[type=number]::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          input[type=number] {
            -moz-appearance: textfield;
          }
        `}
      </style>
      <div className="text-left">
        <input
          type="checkbox"
          className="form-checkbox text-green-600 w-7 h-7"
          onChange={handleSelectAll}
        />
      </div>
      <div className="h-auto max-h-96 overflow-y-auto rounded-lg border-4 border-solid border-green-800">
        {items.map((item, index) => (
          <div
            key={index}
            className={clsx(
              "p-2 flex items-center space-x-4 border border-solid ",
              selectedItems.some((i) => i.id === item.id) ? "bg-green-500 border-gray-700" : "bg-green-200 border-gray-400"
            )}
          >
            <input
              type="checkbox"
              checked={selectedItems.some((i) => i.id === item.id)}
              onChange={() => handleSelect(item)}
              className="form-checkbox text-green-600 w-7 h-7"
            />
            <div className="grid grid-cols-5 w-full items-center  text-left">
              <img className="col-span-1 w-24 max-h-24" src={item.imageUrl} alt={item.imageUrl} />
              <h3 className="sm:text-lg font-semibold col-span-3">
                {item.productName}
              </h3>
              <p className="sm:text-lg text-gray-600 col-span-1">
                ${item.price}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() =>
                  onQuantityChange(item, Math.max(1, item.quantity - 1))
                }
                className="sm:font-bold text-lg p-1"
              >
                -
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  onQuantityChange(
                    item,
                    Math.max(1, parseInt(e.target.value, 10) || 1)
                  )
                }
                className="w-7 sm:w-12 text-center border rounded-lg py-2"
              />
              <button
                onClick={() => onQuantityChange(item, item.quantity + 1)}
                className="sm:font-bold text-lg p-1"
              >
                +
              </button>
            </div>
            <Button
              onClick={() => onItemDelete(item)}
              className="bg-red-400 text-white"
              primary
            >
              X
            </Button>
          </div>
        ))}
        <div ref={loaderRef} className="text-center py-4">
          <span>Loading more items...</span>
        </div>
      </div>
    </>
  );
};

export default CartSelectionList;
