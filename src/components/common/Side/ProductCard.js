import Slider from "react-slick";
import { Button } from "../../ui";
import { Link } from "react-router-dom";
import * as request from "../../../utils/request";
import { toast } from "react-toastify";

const ProductCard = ({ product }) => {
  const datas = product;

  const settings = {
    dots: true,
    infinite: true,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleAddToCart = (e) => {
    e.preventDefault();

    request
      .post("cart/additem", { 
        productId: datas.id, 
        quantity: 1 
      })
      .then(() => {
        toast.success("Add successfuly")
      })
      .catch((error) => {
        console.log(error);
        toast.error("Add error, please try again");
      });
  };

  return (
    <Link
      to={`/products/details/${product.id}`}
      className="max-w-sm overflow-hidden shadow-lg bg-white rounded-lg"
    >
      <Slider {...settings}>
        {datas.imagesUrl.map((image, index) => (
          <div key={index}>
            <img
              className="w-full h-48 object-cover"
              src={image}
              alt={`Product ${index + 1}`}
            />
          </div>
        ))}
      </Slider>
      <div className="px-6 py-4">
        <div className="font-bold text-lg mb-2 truncate-multiline-2">
          {datas.name}
        </div>
        <p className="font-bold text-sm mb-2">{datas.packaging}</p>
        {datas.isActive ? (
          <>
            <p className="text-gray-700 text-base">
              {datas.requirePrescription
                ? "This product requires a prescription"
                : ""}
            </p>
            <div hidden={datas.requirePrescription}>
              <p className="text-gray-700 text-base">
                {datas.quantity > 0 ? "In stock" : "Out of stock"}
              </p>
              <p className="text-gray-900 text-lg font-semibold">
                {datas.price}
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-900 text-lg font-semibold">
              Non-commercial products
            </p>
          </>
        )}
      </div>
      <div className="px-6 pb-2">
        <Button
          hidden={!datas.isActive || datas.requirePrescription}
          disabled={datas.quantity <= 0}
          primary
          className="text-sm"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </Link>
  );
};

export default ProductCard;
