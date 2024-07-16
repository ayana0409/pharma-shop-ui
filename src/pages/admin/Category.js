import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardContent, Select, MenuItem, InputLabel } from "@mui/material";
import { toast } from "react-toastify";

import request from "../../utils/request";
import { Button, Input } from "../../components/ui";

const Category = () => {
  const columns = [
    { field: "name", headerName: "Name", width: 300 },
    { field: "parentName", headerName: "Parent", type: "number", width: 200 },
  ];
  const [selectedRow, setSelectedRow] = useState(null);
  const [rows, setRows] = useState([]);
  const [parentId, setParent] = useState(0);
  const [name, setName] = useState("");
  const lable = useRef();

  const getData = () => {
    request
      .get("Category/categorytable")
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  useEffect(getData, []);

  const handleSelect = (event) => {
    const selectedId = event.target.value;
    setParent(selectedId);
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleRowClick = (params) => {
    const selectedName = params.row.id === selectedRow ? "" : params.row.name;
    const selectedParentId =
      params.row.parentId === selectedRow ? 0 : params.row.parentId;

    setSelectedRow(params.row.id === selectedRow ? null : params.row.id);
    setParent(selectedParentId);
    setName(selectedName);
    lable.current.innerText = selectedName;
  };

  const handleAddData = () => {
    request
      .post("category/addcategory", { id: 0, name, parentId })
      .then((response) => {
        getData();
        setParent(0);
        setName("");
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const deselect = () => {
    setSelectedRow(null);
    lable.current.innerText = "";
  };

  const handleUpdateData = () => {
    request
      .put("category/update", { id: selectedRow, name, parentId })
      .then((response) => {
        getData();
        setParent(0);
        setName("");
        setSelectedRow(null);
        lable.current.innerText = "";
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  const handleDeleteData = () => {
    request
      .delete(`category/delete/${selectedRow}`)
      .then((response) => {
        getData();
        setParent(0);
        setName("");
        setSelectedRow(null);
        lable.current.innerText = "";
        toast.success(response.data.message);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <>
    <h1 className="font-bold text-3xl text-green-800 mb-8">Category</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 w-full border-solid border-2 border-green-300 rounded-lg p-4">
      <Card >
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
          <label className="text-green-900 float-start m-auto">Selected:</label>

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
            onChange={handleChange}
            className="border-solid border-2 border-green-500 rounded-lg w-full"
          />
        </div>
        <div className="mx-4 mb-2">
          <InputLabel
            className="text-green-900 text-xl float-start"
            id="select-label"
          >
            Parent
          </InputLabel>
          <Select
            labelId="select-label"
            id="demo-simple-select"
            className="border-solid border-2 border-green-500 rounded-lg w-full text-start"
            value={parentId}
            size="small"
            onChange={handleSelect}
          >
            <MenuItem value={0}>
              <em>None</em>
            </MenuItem>
            {rows.map((row) => (
              <MenuItem key={row.id} value={row.id}>
                {row.name}
              </MenuItem>
            ))}
          </Select>
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

export default Category;
