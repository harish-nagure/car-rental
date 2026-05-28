import { useState }
from "react";

import { useNavigate }
from "react-router-dom";

import api from "../api/axios.js";

export default function DriverLogin() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({

      username: "",

      password: ""

    });

  const submit = async (e) => {

    e.preventDefault();

    try {

      const { data } = await api.post(

        "/auth/driver/login",

        form

      );

      localStorage.setItem(

        "token",

        data.token

      );

      localStorage.setItem(

        "user",

        JSON.stringify(data.user)

      );

      alert(
        "Driver Login Successful"
      );

      navigate(
        "/driver-dashboard"
      );

    }

    catch (err) {

      alert(

        err.response?.data?.message

        || "Login failed"

      );

    }

  };

  return (

    <div className="auth-card">

      <h2>
        Driver Login
      </h2>

      <form onSubmit={submit}>

        <input

          placeholder="Username"

          required

          onChange={(e) =>

            setForm({

              ...form,

              username:
                e.target.value

            })

          }

        />

        <input

          type="password"

          placeholder="Password"

          required

          onChange={(e) =>

            setForm({

              ...form,

              password:
                e.target.value

            })

          }

        />

        <button>

          Login

        </button>

      </form>

    </div>

  );

}