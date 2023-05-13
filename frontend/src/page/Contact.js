import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [data, setData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, email, password, confirmPassword } = data;
    if (name && email && message) {
      console.log(data);
      const fetchData = await fetch(
        `${process.env.REACT_APP_SERVER_DOMAIN}/contact`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const dataRes = await fetchData.json();
      console.log(dataRes);
      // alert(dataRes.message);
      toast(dataRes.message);
      if (dataRes.message) {
        navigate("/login");
      } else {
        alert("please give all info");
      }
    } else {
      alert("Please give necessary information");
    }
  };

  return (
    <div className="p-3 md: p-4">
      <div className="w-full max-w-md bg-pink-700 m-auto flex flex-col p-2">
        <div className="flex flex-col">
          <div className=" items-center justify-center text-lg px-20 font-bold ">
            <h2>Contact Us</h2>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label className=" mt-1 mb-2 w-full bg-pink-500 px-2 py-1 rounded focus-within:outline-blue-500">
              Name:
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="w-full mt-1 mb-2 w-full bg-pink-500 px-2 py-1 rounded focus-within:outline-blue-500">
              Email:
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="w-full mt-1 mb-2 w-full bg-pink-300 px-2 py-1 rounded focus-within:outline-blue-500">
              Message:
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </label>
            <button className="w-full max-w-[150px] m-auto bg-red-500 hover:bg-red-800 cursor-pointer text-xl font-medium text-center py-1 rounded-full mt-4">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
