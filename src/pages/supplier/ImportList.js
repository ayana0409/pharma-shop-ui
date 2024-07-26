import { Link, useNavigate } from "react-router-dom"
import { Button } from "../../components/ui"
import request from "../../utils/request"
import { toast } from "react-toastify"

import { useEffect, useState, useCallback } from "react";
import Table from "../../components/common/Table";

const ImportList = () => {
    const navigate = useNavigate()

 const [pageIndex, setPageIndex] = useState(0);
 const [pageSize, setPageSize] = useState(5);
 const [keyword, setKeyword] = useState("");
 const [data, setData] = useState([]);
 const [totalItems, setTotalItems] = useState(0);

 const fetchData = useCallback((pageSize, pageIndex, keyword) => {
   const json = JSON.stringify({
     pageIndex: pageIndex,
     pageSize: pageSize,
     keyword: keyword,
   });
   const formData = new FormData();
   formData.append("request", json);
   request
     .post("import/getpanigation", formData)
     .then((response) => {
       const data = response.data.datas.map((item) => ({
         ...item,
         action: (
           <Link
             to={`/supplier/importdetail/${item.id}`}
             className="text-blue-500 hover:underline"
           >
             Edit
           </Link>
         ),
       }));
       setData(data);
       setTotalItems(response.data.total);
     })
     .catch((error) => {
       console.log(error);
     });
 }, []);


 const handlerCreateImport = () => {
    request.post('Import/create')
    .then(response => {
        console.log(response)
        toast.success("Create successfuly.")
        navigate(`/supplier/importdetail/${response.data}`)
    })
    .catch(error => {
        console.log(error)
    })
}

 const handlePageChange = (newPageIndex) => {
   setPageIndex(newPageIndex);
 };

 const handlePageSizeChange = (newSize) => {
   setPageSize(newSize);
 };

 const handleKeywordChange = (newKeyword) => {
   setKeyword(newKeyword);
 };

 useEffect(() => {
    fetchData(pageSize, pageIndex, keyword);
  }, [pageIndex, pageSize, keyword, fetchData]);
 

 const columns = [
   {
     Header: "ID",
     accessor: "id",
   },
   {
     Header: "ImportDate",
     accessor: "importDate",
   },
   {
     Header: "TotalCost",
     accessor: "totalCost",
   },
   {
     Header: "Status",
     accessor: "status",
   },
   {
     Header: "#",
     accessor: "action",
   },
 ];
    return (
        <>
        <h1>Import list</h1>
        <Button onClick={handlerCreateImport}>Create</Button>
        <Table
        columns={columns}
        data={data}
        total={totalItems}
        pageIndex={pageIndex}
        pageSize={pageSize}
        keyword={keyword}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onKeywordChange={handleKeywordChange}
      />
        </>
    )
}

export default ImportList