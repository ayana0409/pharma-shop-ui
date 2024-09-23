import { useNavigate, useParams } from "react-router-dom";
import * as request from "../../utils/request";
import Slider from "react-slick";
import { useLayoutEffect, useState } from "react";
import { Button } from "../../components/ui";
import { toast } from "react-toastify";
import { useStore } from "../../store";

const ProductDetail = () => {
  const [state] = useStore();
  const { token } = state;
  const navigate = useNavigate();

  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useLayoutEffect(() => {
    if (!productId) return;

    request
      .get(`shop/${productId}`, productId)
      .then((response) => {
        setProduct(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [productId]);

  const handleAddToCart = () => {
    if (!token){
      navigate('/login')
      return
    }

    request
      .post("cart/items", {
        productId: productId,
        quantity: 1,
      })
      .then(() => {
        toast.success("Add successfuly");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Add error, please try again");
      });
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-4">
        <div className="border-2 border-solid border-green-500 m-4 rounded-lg">
          <Slider {...settings}>
            {!product.images ||
              product.images.map((image, index) => (
                <div key={index}>
                  <img
                    className="w-full h-full max-h-96 object-cover rounded-lg"
                    src={image}
                    alt={`Product ${index + 1}`}
                  />
                </div>
              ))}
          </Slider>
        </div>
        <div className="text-left bg-slate-200 p-4 rounded-lg">
          <label className="text-3xl font-bold">{product.name}</label>
          <p className="text-lg">ID: {product.id}</p>
          <p className="text-4xl font-bold text-green-700 mx-8 text-center mb-4">
            {product.price}/{product.unit}
          </p>
          <p className="text-xl text-green-500">
            {product.quantity <= 0 || "In Stock"}
          </p>
          <p className="text-xl text-red-500">
            {product.quantity > 0 || "Out of Stock"}
          </p>
          <p className="text-xl text-red-500">
            {!product.requirePrescription ||
              "This product require prescription"}
          </p>
          {product.requirePrescription || product.quantity <= 0 || (
            <div className="grid grid-cols-2 gap-4 my-2">
              <Button onClick={handleAddToCart}>Add to cart</Button>
              <Button>...</Button>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4">
            <p className="text-lg col-span-1">Brand:</p>
            <p className="text-lg col-span-2">{product.brand}</p>
            <p className="text-lg col-span-1">Category:</p>
            <p className="text-lg col-span-2">{product.category}</p>
            <p className="text-lg col-span-1">Unit:</p>
            <p className="text-lg col-span-2">{product.unit}</p>
            <p className="text-lg col-span-1">Packaging:</p>
            <p className="text-lg col-span-2">{product.packaging}</p>
          </div>
        </div>
      </div>
      <div className="text-left mx-4">
        {!product.details ||
          product.details.map((detail, index) => {
            return (
              <div key={index} className="my-4">
                <span className="block border-solid border-2 border-green-900 w-full m-0" />
                <h3 className="text-2xl font-bold text-green-700">
                  {detail.name}
                </h3>
                <div className="text-lg">
                  {detail.content.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default ProductDetail;
