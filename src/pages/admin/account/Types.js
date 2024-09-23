import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent } from "@mui/material";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

import * as request from "../../../utils/request";
import { Button, Input } from "../../../components/ui";

const Types = () => {
  const columns = [
    { field: "name", headerName: "Name" },
    { field: "point", headerName: "Point", type: "number", width: 100 },
    { field: "discount", headerName: "Discount", type: "number", width: 130 },
    { field: "maxDiscount", headerName: "Max", type: "number", width: 130 },
  ];
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [point, setPoint] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [maxDiscount, setMaxDiscount] = useState(0);
  const lable = useRef();

  const getData = () => {
    request
      .get("types")
      .then((response) => {
        setRows(response);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  useEffect(getData, []);

  const handleRowClick = (params) => {
    setSelectedRow(params.row.id === selectedRow ? null : params.row.id);

    const row =
      params.row.id === selectedRow
        ? {
            discount: 0,
            id: 0,
            maxDiscount: 0,
            name: "",
            point: 0,
          }
        : params.row;
    lable.current.innerText = row.name;

    setName(row.name);
    setMaxDiscount(row.maxDiscount);
    setDiscount(row.discount);
    setPoint(row.point);
  };

  const handleAddData = () => {
    if (!name || !point || !discount || !maxDiscount) {
      toast.error("Please enter require field");
      return;
    }

    if (point < 0 || discount < 0 || maxDiscount < 0) {
      toast.error("Point, discount, max discount must be larger than -1");
      return;
    }

    request
      .post("types", {
        name,
        point,
        discount,
        maxDiscount,
      })
      .then(() => {
        setName("");
        setMaxDiscount(0);
        setDiscount(0);
        setPoint(0);
        toast.success("Create successfully.");

        getData();
        deselect();
      })
      .catch((error) => {
        console.log(error);

        toast.error(error.message);
      });
  };

  const deselect = () => {
    setSelectedRow(null);
    lable.current.innerText = "";
    setName("");
    setMaxDiscount(0);
    setDiscount(0);
    setPoint(0);
  };

  const handleUpdateData = () => {
    if (!name || !point || !discount || !maxDiscount) {
      toast.error("Please enter require field");
      return;
    }

    if (point < 0 || discount < 0 || maxDiscount < 0) {
      toast.error("Point, discount, max discount must be larger than -1");
      return;
    }

    request
      .put(`types/${selectedRow}`, {
        id: selectedRow,
        name,
        point,
        discount,
        maxDiscount,
      })
      .then(() => {
        setName("");
        setMaxDiscount(0);
        setDiscount(0);
        setPoint(0);
        toast.success("Update successfully.");

        getData();
        deselect();
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleDeleteData = () => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to delete this account?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            request
              .remove(`types/${selectedRow}`)
              .then(() => {
                toast.success("Delete successfully.");

                getData();
                deselect();
              })
              .catch((error) => {
                toast.error(error);
              });
          },
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  return (
    <>
      <h1 className="font-bold text-3xl text-green-800 mb-8">TYPES</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 w-full border-solid border-2 border-green-300 rounded-lg p-4">
        <Card>
          <CardContent style={{ height: "80%", width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              selectionModel={selectedRow}
              onRowClick={handleRowClick}
              className="max-h-4/5"
            />
          </CardContent>
          <div className="grid grid-cols-4 mx-4 mb-2">
            <label className="text-green-900 float-start m-auto">
              Selected:
            </label>

            <div className="border-solid border-2 border-grey-500 rounded-lg grid grid-cols-5 col-span-2 w-full">
              <span
                className="rounded-l-lg px-1 col-span-4 text-center justify-center m-auto"
                ref={lable}
              />
              <Button
                className="w-auto text-red-500 font-bold bg-gray-100"
                onClick={deselect}
                disabled={selectedRow == null}
              >
                X
              </Button>
            </div>
            <Button
              className=" bg-green-200 float-end m-auto rounded-lg"
              onClick={getData}
            >
              Refresh
            </Button>
          </div>
        </Card>
        <div>
          <div className="mx-4 mb-2">
            <label className="text-green-900 text-xl float-start">Name</label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-solid border-2 border-green-500 rounded-lg w-full"
            />
          </div>
          <div className="mx-4 mb-2">
            <label className="text-green-900 text-xl float-start">Point</label>
            <Input
              type="text"
              value={point}
              min={0}
              onChange={(e) => setPoint(e.target.value)}
              className="border-solid border-2 border-green-500 rounded-lg w-full"
            />
          </div>
          <div className="mx-4 mb-2">
            <label className="text-green-900 text-xl float-start">
              Discount (%)
            </label>
            <Input
              type="text"
              value={discount}
              min={0}
              onChange={(e) => setDiscount(e.target.value)}
              className="border-solid border-2 border-green-500 rounded-lg w-full"
            />
          </div>
          <div className="mx-4 mb-2">
            <label className="text-green-900 text-xl float-start">
              Max discount
            </label>
            <Input
              type="text"
              value={maxDiscount}
              min={0}
              onChange={(e) => setMaxDiscount(e.target.value)}
              className="border-solid border-2 border-green-500 rounded-lg w-full"
            />
          </div>
          <div className="mx-2 float-start">
            <Button
              primary
              onClick={handleAddData}
              className="rounded-lg mb-2 ml-2"
            >
              Add
            </Button>
            <Button
              primary
              disabled={selectedRow == null}
              onClick={handleUpdateData}
              className="rounded-lg float-end disabled:bg-green-300 mb-2 ml-2"
            >
              Update
            </Button>
          </div>
          <div className="mx-4 mb-2 ml-2">
            <Button
              primary
              disabled={selectedRow == null}
              onClick={handleDeleteData}
              className="rounded-lg float-end bg-red-600 disabled:bg-red-300 hover:bg-red-400 mb-2 ml-2"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Types;
