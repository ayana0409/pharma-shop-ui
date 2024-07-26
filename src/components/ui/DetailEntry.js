import { useEffect, useState } from "react";
import Input from "./Input";
import Button from "./Button";

function DetailEntry({
  id,
  index,
  initialName,
  initialContent,
  onDetailChange,
  onDelete,
}) {
  const [name, setName] = useState(initialName || "");
  const [content, setContent] = useState(initialContent || "");

  const handleNameChange = (event) => {
    setName(event.target.value);
    onDetailChange(index, { id, name: event.target.value, content });
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
    onDetailChange(index, { id, name, content: event.target.value });
  };

  const handleDelete = () => {
    onDelete(index);
  };

  useEffect(() => {
    setName(initialName);
    setContent(initialContent);
  },[initialName, initialContent]);

  return (
    <div
      key={index}
      className="rounded-lg border-solid border-2 border-green-800 p-2"
    >
      <div>
        <label className="w-full inline-flex text-green-900 text-xl float-start">
          *Name
        </label>
        <Input
          value={name}
          onChange={handleNameChange}
          className=" focus:bg-blue-100 w-full rounded-lg border-solid border-2 border-green-500"
        />
      </div>
      <div className="w-full">
        <label className="text-green-900 text-xl float-start">*Content</label>
        <textarea
          type="text"
          value={content}
          onChange={handleContentChange}
          className="border-solid border-2 border-green-500 rounded-lg w-full px-4 min-h-28 focus:bg-blue-100"
        />
      </div>
      <Button
        className="rounded-full font-bold border-solid border-2 border-red-500 text-red-500 hover:bg-red-200 focus:bg-red-200"
        onClick={handleDelete}
      >
        X
      </Button>
    </div>
  );
}

export default DetailEntry;
