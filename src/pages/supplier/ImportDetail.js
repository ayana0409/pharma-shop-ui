import ProductListModal from "../../components/common/ProductListModal";
import { Card, CardContent } from "@mui/material";
import { useState, useEffect, useRef, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import * as request from "../../utils/request";
import { Button, Input } from "../../components/ui";
import { formatDate } from "../../utils/format";

const ImportDetail = () => {
  const { importId } = useParams();
  const navigate = useNavigate()

  const [importDate, setImportDate] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [status, setStatus] = useState("");

  const labelTotalCost = useRef();
  const labelStatus = useRef();

  const columns = [
    { field: "productId", headerName: "ID" },
    { field: "productName", headerName: "Name", width: 200 },
    { field: "batchNumber", headerName: "BatchNumber", width: 100 },
    { field: "manufactureDate", headerName: "ManufactureDate", width: 100 },
    { field: "expiry", headerName: "Ex", type: "number" },
    { field: "quantity", headerName: "Quantity", type: "number" },
    { field: "cost", headerName: "Cost", type: "number", width: 100 },
  ];
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);

  const [productName, setProductName] = useState("");
  const [batchNumber, setBatchNumber] = useState("");
  const [manufactureDate, setManufactureDate] = useState("");
  const [expiry, setExpiry] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [cost, setCost] = useState(0);

  const getImport = useCallback((importId) => {
    if (!importId || importId === 0) {
      return;
    }

    request
      .get(`import/get/${importId}`)
      .then((response) => {
        setImportDate(formatDate(response.importDate));
        setTotalCost(response.totalCost);
        setStatus(response.status);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getDetail = useCallback((importId) => {
    if (!importId || importId === 0) {
      return;
    }
    request
      .get(`import/getdetails/${importId}`)
      .then((response) => {
        setRows(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleRowClick = (params) => {
    if (status === "New")
      setSelectedRow(params.row === selectedRow ? null : params.row);
  };

  const handleAddDetail = useCallback(
    (productId) => {
      const json = JSON.stringify({
        importId,
        productId,
        batchNumber: "",
        manufactureDate: "2000/01/01",
        expiry: 0,
        quantity: 0,
        cost: 0,
      });
      const formData = new FormData();
      formData.append("request", json);
      request
        .post("import/adddetail", formData)
        .then(() => {
          getDetail(importId);
          toast.success("Add successfuly.");
        })
        .catch((error) => {
          toast.error(error.response);
        });
    },
    [getDetail, importId]
  );

  const handlerUpdateDetail = () => {
    if (selectedRow == null) {
      toast.error("Please chose a detail");
      return;
    }
    const formData = new FormData();

    const json = JSON.stringify({
      importId,
      productId: selectedRow.productId,
      batchNumber,
      manufactureDate,
      expiry,
      cost,
      quantity,
    });
    formData.append("data", json);

    request
      .put("import/updatedetail", formData)
      .then((response) => {
        setSelectedRow(null);
        getDetail(importId);
        toast.success(response.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response ?? error.message);
      });
  };

  const handlerRemoveDetail = () => {
    if (selectedRow == null) {
      toast.error("Please chose a detail");
      return;
    }
    const formData = new FormData();

    formData.append("importId", importId);
    formData.append("productId", selectedRow.productId);

    request
      .put("import/removedetail", formData)
      .then((response) => {
        setSelectedRow(null);
        getDetail(importId);
        toast.success(response.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response ?? error.message);
      });
  };

  const handlerDelete = () => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to delete this import?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            request
            .remove(`import/delete/${importId}`)
              .then((response) => {
                toast.success(response.message);
                navigate("/supplier/importlist");
              })
              .catch((error) => {
                toast.error(error.message || "Error deleting the import");
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

  const handlerSubmit = () => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to complete this import?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            request
            .put(`import/complete/${importId}`)
              .then((response) => {
                toast.success(response.message);
                navigate("/supplier/importlist");
              })
              .catch((error) => {
                console.log(error)
                toast.error(error.message || "Error comleting the import");
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

  useEffect(() => {
    labelTotalCost.current.innerText = `Total cost: ${totalCost}`;
    labelStatus.current.innerText = `Status: ${status}`;
  }, [totalCost, status]);

  useEffect(() => {
    getImport(importId);
    getDetail(importId);
  }, [importId, getImport, getDetail]);

  useEffect(() => {
    setProductName(selectedRow ? selectedRow.productName : null);
    setBatchNumber(selectedRow ? selectedRow.batchNumber : null);
    setExpiry(selectedRow ? selectedRow.expiry : null);
    setManufactureDate(selectedRow ? selectedRow.manufactureDate : null);
    setQuantity(selectedRow ? selectedRow.quantity : null);
    setCost(selectedRow ? selectedRow.cost : null);
  }, [selectedRow]);

  useEffect(() => {
    let total = 0;

    rows.map((row) => (total += row.quantity * row.cost));

    setTotalCost(total);
  }, [rows]);

  return (
    <>
      <h1 className="font-bold text-3xl text-green-800 mb-4">
        <Link to="/supplier/importlist" className="float-left top-0 text-xl">
          Back
        </Link>
        IMPORT DETAILS
      </h1>
      <Card>
        <CardContent style={{ height: 300, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            selectionModel={selectedRow}
            onRowClick={handleRowClick}
            getRowId={(row) => row.productId}
            className="max-h-4/5"
          />
        </CardContent>
        <div className="grid grid-cols-4 mx-4 mb-2">
          <Button
            className=" bg-green-200 float-end m-auto rounded-lg"
            onClick={() => {
              getImport(importId);
            }}
          >
            Refresh
          </Button>
          <ProductListModal
            onClickAdd={handleAddDetail}
            children="Add product"
            disabled={status !== "New"}
            className="rounded-lg disabled:bg-gray-600"
          />
        </div>
      </Card>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <div className="mb-2">
            <label className="text-green-900 text-xl float-start">Name</label>
            <Input type="text" defaultValue={productName || ""} disabled />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-green-900 text-xl float-start">
                *Manufacture date
              </label>
              <Input
                type="date"
                value={manufactureDate || ""}
                disabled={selectedRow == null}
                onChange={(e) => {
                  setManufactureDate(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="text-green-900 text-xl float-start">
                *Expiry (month)
              </label>
              <Input
                type="number"
                value={expiry || 0}
                disabled={selectedRow == null}
                onChange={(e) => {
                  setExpiry(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="text-green-900 text-xl float-start">
                *Quantity
              </label>
              <Input
                type="number"
                value={quantity || 0}
                disabled={selectedRow == null}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="text-green-900 text-xl float-start">
                *Cost
              </label>
              <Input
                type="number"
                value={cost || 0}
                disabled={selectedRow == null}
                onChange={(e) => {
                  setCost(e.target.value);
                }}
              />
            </div>
            <div>
              <label className="text-green-900 text-xl float-start">
                *Batch code
              </label>
              <Input
                type="text"
                value={batchNumber || ""}
                disabled={selectedRow == null}
                onChange={(e) => {
                  setBatchNumber(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col justify-end h-full ">
              <div className="w-full">
                <Button
                  primary
                  disabled={selectedRow == null}
                  className="rounded-lg mx-1 disabled:bg-gray-600"
                  onClick={handlerUpdateDetail}
                >
                  Save
                </Button>
                <Button
                  primary
                  disabled={selectedRow == null}
                  className="rounded-lg text-white bg-red-600 mx-2 disabled:bg-gray-600"
                  onClick={handlerRemoveDetail}
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-start"
            style={{ height: "72px" }}
          >
            <label
              ref={labelTotalCost}
              className="text-green-900 text-xl flex flex-col justify-end h-full py-2"
            >
              Status:
            </label>
            <label
              ref={labelStatus}
              className="text-green-900 text-xl flex flex-col justify-end h-full py-2"
            >
              Total:
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            <div>
              <label className="text-green-900 text-xl float-start">
                Create date
              </label>
              <Input
                type="date"
                value={importDate}
                onChange={(e) => setImportDate(e.target.value)}
                disabled
                className="border-solid border-2 border-green-500 rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col justify-end h-full mb-2">
              <div className="w-full">
                <Button
                  primary
                  className="rounded-lg mx-1 disabled:bg-gray-600"
                  onClick={handlerSubmit}
                  disabled={status !== "New"}
                >
                  Submit
                </Button>
                <Button
                  primary
                  className="rounded-lg text-white bg-red-600 mx-2 disabled:bg-gray-600"
                  onClick={handlerDelete}
                  disabled={status !== "New"}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportDetail;
