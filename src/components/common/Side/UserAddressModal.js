import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect, useState, useCallback } from "react";
import request from "../../../utils/request";
import { Button } from "../../ui";
import { toast } from "react-toastify";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const UserAddressModal = ({ className, children, onSelect, disabled }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [datas, setDatas] = useState([]);

  const handlerSelect = useCallback(
    (address) => {
      if (onSelect) {
        onSelect(address);
      }
    },
    [onSelect]
  );

  const fetchData = useCallback(() => {
    request
      .get("user/address")
      .then((response) => {
        if (!response.data) {
          return;
        }

        setDatas(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const removeAddress = useCallback(
    (addressId) => {
      request
        .delete(`user/address/${addressId}`)
        .then(() => {
          const newData = datas.filter((data) => data.id !== addressId);
          setDatas(newData);
          toast.success("Removed");
        })
        .catch((error) => {
          toast.error("Remove error:", error);
        });
    },
    [datas]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <Button
        onClick={handleOpen}
        primary
        className={className}
        disabled={disabled}
      >
        {children}
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 className="text-xl font-bold text-center mb-4">Addresses</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {datas.map((data) => (
              <div
                key={data.id}
                onClick={() => {
                  handlerSelect(data);
                }}
                className="max-w-sm overflow-hidden text-center shadow-lg bg-white rounded-lg border-2 border-green-700 p-4 hover:cursor-pointer hover:bg-slate-200"
              >
                <div className="absolute">
                  <button
                    className=" bg-red-500 text-white rounded-full p-1 w-10 h-10 font-bold"
                    onClick={() => removeAddress(data.id)}
                  >
                    X
                  </button>
                </div>

                <h3 className="mb-2 text-lg text-gray-600 font-bold">
                  {data.fullName}
                </h3>
                <h3 className="mb-2 text-gray-600 font-bold">
                  {data.phoneNumber}
                </h3>
                <h3 className="mb-2 text-gray-600 font-bold">{data.address}</h3>
                <h3 className="mb-2 text-gray-600 font-bold">{data.email}</h3>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UserAddressModal;
