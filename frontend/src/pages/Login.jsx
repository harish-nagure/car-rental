import { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext.jsx";

export default function Login() {

  const { login } =
    useAuth();

  const navigate =
    useNavigate();

  const [role, setRole] =
    useState("customer");

  const [form, setForm] =
    useState({

      username: "",

      password: ""

    });

  const [err, setErr] =
    useState("");

  const submit = async (e) => {

    e.preventDefault();

    setErr("");

    try {

      await login(

        role,

        form.username,

        form.password

      );

      if (role === "admin") {

        navigate("/admin");

      }

      else if (
        role === "driver"
      ) {

        navigate(
          "/driver-dashboard"
        );

      }

      else {

        navigate("/dashboard");

      }

    }

    catch (e) {

      setErr(

        e.response?.data?.message ||

        "Login failed"

      );

    }

  };

  return (

    <div className="form card">

      <h2>
        Login
      </h2>

      {

        err && (

          <div className="alert alert-error">

            {err}

          </div>

        )

      }

      <form onSubmit={submit}>

        <select

          value={role}

          onChange={(e) =>
            setRole(e.target.value)
          }

        >

          <option value="customer">
            Customer
          </option>

          <option value="driver">
            Driver
          </option>

          <option value="admin">
            Admin
          </option>

        </select>

        <input

          placeholder="Username"

          value={form.username}

          onChange={(e) =>

            setForm({

              ...form,

              username:
                e.target.value

            })

          }

          required

        />

        <input

          placeholder="Password"

          type="password"

          value={form.password}

          onChange={(e) =>

            setForm({

              ...form,

              password:
                e.target.value

            })

          }

          required

        />

        <button className="btn btn-block">

          Login

        </button>

      </form>

      <p style={{ marginTop: 12 }}>

        No account?

        {" "}

        <Link to="/register">

          Register

        </Link>

      </p>

    </div>

  );

}