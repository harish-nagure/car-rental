import { useState } from "react";

import {
  useNavigate,
  Link
} from "react-router-dom";

import {
  useAuth
} from "../context/AuthContext.jsx";

export default function Register() {

  const { register } = useAuth();

  const navigate = useNavigate();

  const [role, setRole] =
    useState("customer");

  const [form, setForm] =
    useState({

      username: "",

      name: "",

      phone: "",

      email: "",

      address: "",

      password: "",

      dlNumber: "",

      gender: "male"

    });

  const [err, setErr] =
    useState("");

  const submit = async (e) => {

    e.preventDefault();

    setErr("");

    try {

      await register(
        role,
        form
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

        navigate(
          "/dashboard"
        );

      }

    }

    catch (e) {

      setErr(

        e.response?.data?.message

        || "Registration failed"

      );

    }

  };

  return (

    <div className="form card">

      <h2>
        Register
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
            Client / Admin
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

          placeholder="Full name"

          value={form.name}

          onChange={(e) =>

            setForm({

              ...form,

              name:
                e.target.value

            })

          }

          required

        />

        <input

          placeholder="Phone"

          value={form.phone}

          onChange={(e) =>

            setForm({

              ...form,

              phone:
                e.target.value

            })

          }

          required

        />

        <input

          placeholder="Email"

          type="email"

          value={form.email}

          onChange={(e) =>

            setForm({

              ...form,

              email:
                e.target.value

            })

          }

          required

        />

        <input

          placeholder="Address"

          value={form.address}

          onChange={(e) =>

            setForm({

              ...form,

              address:
                e.target.value

            })

          }

          required

        />

        {

          role === "driver"

          && (

            <>

              <input

                placeholder="Driving License Number"

                value={form.dlNumber}

                onChange={(e) =>

                  setForm({

                    ...form,

                    dlNumber:
                      e.target.value

                  })

                }

                required

              />

              <select

                value={form.gender}

                onChange={(e) =>

                  setForm({

                    ...form,

                    gender:
                      e.target.value

                  })

                }

              >

                <option value="male">
                  Male
                </option>

                <option value="female">
                  Female
                </option>

                <option value="other">
                  Other
                </option>

              </select>

            </>

          )

        }

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

          Create account

        </button>

      </form>

      <p style={{ marginTop: 12 }}>

        Already have an account?

        {" "}

        <Link to="/login">

          Login

        </Link>

      </p>

    </div>

  );

}