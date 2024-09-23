import { useNavigate, useParams } from "react-router-dom";
import * as request from "../../../utils/request";
import { useEffect, useState } from "react";
import { Input, Button, LoadingScreen } from "../../../components/ui";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";

const ManagerAccountDetails = () => {
  const regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
  const [loading, setLoading] = useState(false);

  const [roles, setRoles] = useState([]);

  const { accountId } = useParams();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [accountRoles, setAccountRoles] = useState([]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [selectedRoles, setSelectedRoles] = useState([]);

  const navigate = useNavigate();

  const handleRoleChange = (roleName) => {
    setSelectedRoles((prevSelectedRoles) =>
      prevSelectedRoles.includes(roleName)
        ? prevSelectedRoles.filter((name) => name !== roleName)
        : [...prevSelectedRoles, roleName]
    );
  };

  const handleUpdate = () => {
    if (phone && !regex.test(phone)) {
      toast.warn("Invalid phone number format.");
      return;
    }

    if (password && password !== confirmPassword) {
      toast.warn("Incorrect re-entered password.");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    if (selectedRoles.length === 0) {
      toast.warn("Select at least 1 role.");
      return;
    }

    setLoading(true);
    request
      .put(`accounts/${accountId}`, {
        id: accountId,
        username,
        name,
        email,
        phone,
        newPassword: password,
        roles: selectedRoles,
      })
      .then(() => {
        toast.success("Update successfuly.");
        navigate("/admin/managers");
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 500) {
          toast.error("Server error");
        }
        if (error.response.status === 400) {
          toast.error(error.response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCreate = () => {
    if (!username || !name || !password) {
      toast.warn("Please fill require field.");
      return;
    }

    if (phone && !regex.test(phone)) {
      toast.warn("Invalid phone number format.");
      return;
    }

    if (password !== confirmPassword) {
      toast.warn("Incorrect re-entered password.");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    if (selectedRoles.length === 0) {
      toast.warn("Select at least 1 role.");
      return;
    }

    setLoading(true);
    request
      .post("accounts", {
        id: accountId,
        username,
        name,
        email,
        phone,
        newPassword: password,
        roles: selectedRoles,
      })
      .then(() => {
        toast.success("Create successfuly.");
        navigate("/admin/managers");
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 500) {
          toast.error("Server error");
        }
        if (error.response.status === 400) {
          toast.error(error.response.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    confirmAlert({
      title: "Confirm to submit",
      message: "Are you sure you want to delete this account?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setLoading(true);

            request
              .remove(`accounts/${accountId}`)
              .then((response) => {
                setLoading(false);
                toast.success("Delete successfuly.");
                navigate("/admin/managers");
              })
              .catch((error) => {
                setLoading(false);
                toast.error(error.message || "Error deleting the account");
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

  useEffect(() => {
    request
      .get("accounts/roles")
      .then((response) => {
        setRoles(response);
      })
      .catch((error) => {
        if (error.response.status === 403) {
          navigate("/");
        }
        console.log(error);
      });
  }, [navigate]);

  useEffect(() => {
    if (accountId) {
      request
        .get(`accounts/${accountId}`)
        .then((response) => {
          setUsername(response.username);
          setName(response.name);
          setEmail(response.email);
          setPhone(response.phone);
          setAccountRoles(response.roles);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [accountId]);

  useEffect(() => {
    const initialSelectedRoles = roles
      .filter((role) => accountRoles.includes(role.roleName))
      .map((role) => role.roleName);
    setSelectedRoles(initialSelectedRoles);
  }, [roles, accountRoles]);

  return (
    <div className="m-4">
      {loading && <LoadingScreen />}
      <h1 className="font-bold text-3xl text-green-800 mb-4">
        {accountId ? "DETAILS" : "CREATE ACCOUNT"}
      </h1>
      <h3 className="font-bold text-xl text-left text-green-800 mb-4">
        Information
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-green-900 text-xl float-start">
            *Username
          </label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full focus:bg-blue-100"
          />
        </div>
        <div>
          <label className="text-green-900 text-xl float-start">*Name</label>
          <Input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full focus:bg-blue-100"
          />
        </div>
        <div>
          <label className="text-green-900 text-xl float-start">*Email</label>
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full focus:bg-blue-100"
          />
        </div>
        <div>
          <label className="text-green-900 text-xl float-start">*Phone</label>
          <Input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full focus:bg-blue-100"
          />
        </div>
      </div>
      <span className="block border-solid border-2 border-green-900 w-full m-0 my-8" />
      {accountId ? (
        <>
          <h3 className="font-bold text-xl text-left text-green-800">
            Set a new password
          </h3>
          <h3 className="font-thin text-lg text-left text-green-800 mb-4">
            Fill in only when you need to change your password
          </h3>
        </>
      ) : (
        <>
          <h3 className="font-bold text-xl text-left text-green-800 mb-4">
            Password
          </h3>
        </>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="text-green-900 text-xl float-start">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full focus:bg-blue-100"
          />
        </div>
        <div>
          <label className="text-green-900 text-xl float-start">
            Confirm password
          </label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border-solid border-2 border-green-500 rounded-lg w-full focus:bg-blue-100"
          />
        </div>
        <Button
          primary
          className="max-w-20 bg-red-600 hover:bg-red-400 disabled:bg-red-200"
          disabled={!(password || confirmPassword)}
          onClick={() => {
            setPassword("");
            setConfirmPassword("");
          }}
        >
          Clear
        </Button>
      </div>
      <span className="block border-solid border-2 border-green-900 w-full m-0 my-8" />
      <div className="my-4">
        <h3 className="font-bold text-xl text-left text-green-800  mb-4">
          Roles
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {roles.map((role) => (
            <div
              key={role.roleId}
              className="grid grid-cols-[auto,1fr] items-center border-2 border-gray-300 p-2 rounded-lg"
            >
              <input
                type="checkbox"
                id={role.roleId}
                checked={selectedRoles.includes(role.roleName)}
                onChange={() => handleRoleChange(role.roleName)}
                className="w-6 h-6"
              />
              <label
                className="text-lg text-gray-600 m-2"
                htmlFor={role.roleId}
              >
                {role.roleName}
              </label>
            </div>
          ))}
        </div>
      </div>
      {accountId ? (
        <>
          <Button primary onClick={handleUpdate} className="mx-2">
            Update
          </Button>
          <Button
            primary
            onClick={handleDelete}
            className="mx-2 bg-red-600 hover:bg-red-400 disabled:bg-red-200"
          >
            Delete
          </Button>
        </>
      ) : (
        <Button primary onClick={handleCreate}>
          Create
        </Button>
      )}
    </div>
  );
};

export default ManagerAccountDetails;
