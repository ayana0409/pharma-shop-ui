import { useState, useEffect, useCallback } from "react";
import clsx from "clsx";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Select,
  MenuItem,
  Collapse,
  Box,
  Typography,
  FormControlLabel,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { confirmAlert } from "react-confirm-alert";

import ProductDetails from "../../components/common/ProductDetails";
import { Input, Button, LoadingScreen } from "../../components/ui";
import * as request from "../../utils/request";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const { productId } = useParams("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState(0);
  const [tax, setTax] = useState(0);
  const [unit, setUnit] = useState("");
  const [packaging, setPackaging] = useState("");
  const [bigUnit, setBigUnit] = useState(1);
  const [mediumUnit, setMediumUnit] = useState(0);
  const [smallUnit, setSmallUnit] = useState(0);
  const [bigUnitPrice, setBigUnitPrice] = useState(0);
  const [mediumUnitPrice, setMediumUnitPrice] = useState(0);
  const [smallUnitPrice, setSmallUnitPrice] = useState(0);
  const [requirePrescription, setRequirePrescription] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);
  const [details, setDetails] = useState([]);

  const navigate = useNavigate();

  const setInitValue = useCallback((productId) => {
    if (productId) {
      request
        .get(`product/getforupdate/?id=${productId}`)
        .then(async (response) => {
          setName(response.name);
          setRequirePrescription(response.requirePrescription);
          setBrand(response.brand);
          setCategory(response.categoryId);
          setPackaging(response.packaging);
          setUnit(response.unit);
          setTax(response.taxing);
          setBigUnit(response.bigUnit);
          setBigUnitPrice(response.bigUnitPrice);
          setMediumUnit(response.mediumUnit);
          setMediumUnitPrice(response.mediumUnitPrice);
          setSmallUnit(response.smallUnit);
          setSmallUnitPrice(response.smallUnitPrice);
          setDescription(response.description);
          setDetails(response.details);
          setPreviewUrls(response.images);

          const imageBlobs = [];

          await fetchImages(response.images, imageBlobs);

          setImageFiles(imageBlobs);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  },[]);

  const handleToggleDetails = () => {
    setOpenDetails(!openDetails);
  };
  const handleAddDetail = () => {
    if (details.length >= 9) {
      toast.warning("The maximum number of details is 9");
      return;
    }

    const newDetails = [...details, { id: 0, name: "", content: "" }];
    setDetails(newDetails);
  };

  const handleDetailChange = (index, updatedDetail) => {
    const newDetails = [...details];
    newDetails[index] = updatedDetail;
    setDetails(newDetails);
  };

  const handleDeleteDetail = (index) => {
    const newDetails = [...details];
    newDetails.splice(index, 1);
    setDetails(newDetails);
  };

  const [openImages, setOpenImages] = useState(false);
  const handleToggleImages = () => {
    setOpenImages(!openImages);
  };

  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];
    const validPreviewUrls = [];

    if (imageFiles.length >= 6) {
      toast.warning("The maximum number of images is 6");
      return;
    }

    files.forEach((file) => {
      if (file.size <= 5 * 1024 * 1024) {
        validFiles.push(file);
        validPreviewUrls.push(URL.createObjectURL(file));
      } else {
        toast.warning(`${file.name} must be smaller than 5MB.`);
      }
    });

    setImageFiles([...imageFiles, ...validFiles]);
    setPreviewUrls([...previewUrls, ...validPreviewUrls]);
  };

  const handleDeleteImage = (index) => {
    const newImageFiles = [...imageFiles];
    const newPreviewUrls = [...previewUrls];

    newImageFiles.splice(index, 1);
    newPreviewUrls.splice(index, 1);

    setImageFiles(newImageFiles);
    setPreviewUrls(newPreviewUrls);
  };

  useEffect(() => {
    request
      .get("category/categorytable")
      .then((response) => {
        setCategories(response);
      })
      .catch((error) => {
        const message = error.response.message ?? error.message;

        console.log(message);
        toast.error(message);
        
        navigate("/");
      });
    setInitValue(productId);
  }, [productId, setInitValue, navigate]);

  async function fetchImages(urls, imageBlobs) {
    for (const url of urls) {
      try {
        const response = await axios({
          method: "get",
          url: url,
          responseType: "blob",
        });
        imageBlobs.push(response.data);
      } catch (error) {
        console.error(`Error fetching image from ${url}:`, error);
      }
    }
  }

  const handleSubmit = () => {
    const formData = new FormData();

    const json = JSON.stringify({
      name: name,
      brand: brand,
      categoryId: category,
      description: description,
      taxing: tax,
      unit: unit,
      packaging: packaging,
      bigUnit: bigUnit,
      mediumUnit: mediumUnit,
      smallUnit: smallUnit,
      bigUnitPrice: bigUnitPrice,
      mediumUnitPrice: mediumUnit > 0 ? mediumUnitPrice : 0,
      smallUnitPrice: smallUnit > 0 ? smallUnitPrice : 0,
      requirePrescription: requirePrescription,
      details: details,
    });
    formData.append("data", json);

    if (imageFiles) {
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });
    }

    setLoading(true);

    if (!productId) {
      request
        .post("product/add", formData)
        .then((response) => {
          toast.success(response.message);
          setLoading(false);
          navigate("/admin/product");
        })
        .catch((error) => {
          console.log(error);
          toast.error(error.response.data ?? error.message);
          setLoading(false);
        });
    } else {
      if (previewUrls) {
        formData.append("imageUrls", JSON.stringify(previewUrls));
        formData.append("id", productId);

        request
          .put(`product/update/${productId}`, formData)
          .then((response) => {
            toast.success(response.message);
            setLoading(false);
            navigate("/admin/product");
          })
          .catch((error) => {
            console.log(error);
            toast.error(error.response.data ?? error.message);
            setLoading(false);
          });
      }
    }
  };

  const handlerDelete = () => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to delete this product?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setLoading(true);

            request
              .remove(`product/delete/${productId}`)
              .then((response) => {
                setLoading(false);
                toast.success(response.message);
                navigate("/admin/product");
              })
              .catch((error) => {
                setLoading(false);
                toast.error(error.message || "Error deleting the product");
              });
          },
        },
        {
          label: "No",
          onClick: () => {
          },
        },
      ],
    });
  };
  
  return (
    <div className="p-4 shadow-2xl border-solid border-2 border-green-900 bg-orange-50 rounded-lg">
      {loading && <LoadingScreen />}
      <h1 className="font-bold text-3xl text-green-800 mb-4">
        <Link to="/admin/product" className="float-left top-0 text-xl">
          Back
        </Link>
        {productId ? "UPDATE PRODUCT" : "ADD PRODUCT"}
      </h1>
      <div className="w-full">
        <label className="text-green-900 text-xl float-start">*Name</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-solid border-2 border-green-500 rounded-lg w-full focus:bg-blue-100"
        />
      </div>
      <div className="text-green-900 text-xl text-start">
        <FormControlLabel
          control={
            <Checkbox
              checked={requirePrescription}
              onChange={() => setRequirePrescription(!requirePrescription)}
            />
          }
          label="Require prescription"
        />
      </div>
      <span className="block border-solid border-2 border-green-900 w-full m-0 my-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-green-900 text-xl float-start">*Brand</label>
          <Input
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full focus:bg-blue-100"
          />
        </div>
        <div>
          <label className="text-green-900 text-xl float-start">
            *Category
          </label>
          <Select
            className="border-solid border-2  border-green-500 w-full text-start bg-white"
            value={category}
            size="small"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="text-green-900 text-xl float-start">
            *Packaging
          </label>
          <Input
            type="text"
            value={packaging}
            onChange={(e) => setPackaging(e.target.value)}
            className="w-full focus:bg-blue-100"
          />
        </div>
        <div>
          <label className="text-green-900 text-xl float-start">*Unit</label>
          <Input
            type="text"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full focus:bg-blue-100"
          />
        </div>
        <div>
          <label className="text-green-900 text-xl float-start">*Tax</label>
          <Input
            type="number"
            value={tax}
            min="0"
            onChange={(e) => setTax(e.target.value)}
            className="w-full focus:bg-blue-100"
          />
        </div>
      </div>
      <span className="block border-solid border-2 border-green-900 w-full m-0 my-8" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div>
          <label className="text-green-900 text-xl float-start">
            *Big unit (box, bottle, kit,...)
          </label>
          <Input
            type="number"
            min="1"
            value={bigUnit}
            onChange={(e) => setBigUnit(e.target.value)}
            className="w-full focus:bg-blue-100"
          />
          <label className="text-green-900 text-xl float-start">
            Big unit price
          </label>
          <Input
            type="number"
            min="0"
            value={bigUnitPrice}
            onChange={(e) => setBigUnitPrice(e.target.value)}
            className="w-full focus:bg-blue-100"
          />
        </div>
        <div>
          <label className="text-green-900 text-xl float-start">
            Medium unit (blister,...)
          </label>
          <Input
            type="number"
            value={mediumUnit}
            min="0"
            onChange={(e) => setMediumUnit(parseInt(e.target.value, 10))}
            className="w-full focus:bg-blue-100"
          />
          <label className="text-green-900 text-xl float-start">
            Medium unit price
          </label>
          <Input
            type="number"
            value={mediumUnitPrice}
            min="0"
            disabled={mediumUnit === 0}
            onChange={(e) => setMediumUnitPrice(e.target.value)}
            className="w-full disabled:bg-blue-50 focus:bg-blue-100 disabled:border-gray-300"
          />
        </div>
        <div>
          <label className="text-green-900 text-xl float-start">
            Small unit (pill, packet,...)
          </label>
          <Input
            type="number"
            value={smallUnit}
            min="0"
            onChange={(e) => setSmallUnit(parseInt(e.target.value, 10))}
            className="w-full"
          />
          <label className="text-green-900 text-xl float-start">
            Small unit price
          </label>
          <Input
            type="number"
            value={smallUnitPrice}
            min="0"
            disabled={smallUnit === 0}
            onChange={(e) => setSmallUnitPrice(e.target.value)}
            className="w-full disabled:bg-blue-50 focus:bg-blue-100 disabled:border-gray-300"
          />
        </div>
      </div>

      <span className="block border-solid border-2 border-green-900 w-full m-0 my-8" />
      <div className="w-full">
        <label className="text-green-900 text-xl float-start">
          Description
        </label>
        <textarea
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-solid border-2 border-green-500 rounded-lg w-full px-2 min-h-40 focus:bg-blue-100"
        />
      </div>
      <div>
        <Button
          onClick={handleToggleDetails}
          primary
          className={clsx("rounded-lg m-1", openDetails ? "bg-green-900" : "")}
        >
          Details
        </Button>
        <Button
          onClick={handleToggleImages}
          primary
          className={clsx("rounded-lg m-1", openImages ? "bg-green-900" : "")}
        >
          Images
        </Button>
      </div>
      <div>
        <div>
          <ProductDetails
            openDetails={openDetails}
            handleAddDetail={handleAddDetail}
            details={details}
            handleDetailChange={handleDetailChange}
            handleDelete={handleDeleteDetail}
          />
        </div>
        <div>
          <Collapse in={openImages}>
            <Box
              sx={{
                margin: "20px 0",
                padding: "20px",
                border: "1px solid #ccc",
              }}
            >
              <div>
                <Typography variant="h6" className="text-green-900 font-bold">
                  IMAGES
                </Typography>
                <h3>Image size must be smaller than 5MB</h3>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  id="fileInput"
                  className="hidden"
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer inline-block bg-green-700 text-white p-2 m-4  w-10 h-10 rounded-lg font-bold"
                >
                  +
                </label>
                <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        className="object-cover w-full h-full rounded-lg"
                        alt={`preview ${index}`}
                      />
                      <button
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 w-10 h-10 font-bold"
                        onClick={() => handleDeleteImage(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </Box>
          </Collapse>
        </div>
      </div>
      <div className="w-full text-right">
        <Button onClick={handleSubmit} primary className="rounded-lg mx-2">
          {productId ? "UPDATE PRODUCT" : "ADD PRODUCT"}
        </Button>
        <Button
          onClick={handlerDelete}
          primary
          className={clsx(
            "rounded-lg text-white bg-red-600 mx-2",
            !productId ? "hidden" : ""
          )}
        >
          DELETE
        </Button>
      </div>
    </div>
  );
};

export default AddProduct;
