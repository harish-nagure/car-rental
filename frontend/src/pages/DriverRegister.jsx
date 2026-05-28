import { useState }
from "react";

import { useNavigate }
from "react-router-dom";

import api from "../api/axios.js";

export default function DriverRegister() {

  const navigate = useNavigate();

  const [form, setForm] =
    useState({

      username: "",

      password: "",

      name: "",

      dlNumber: "",

      phone: "",

      address: "",

      gender: "male"

    });

  const submit = async (e) => {

    e.preventDefault();

    try {

      await api.post(

        "/auth/driver/register",

        form

      );

      alert(
        "Driver Registered"
      );

      navigate(
        "/driver-login"
      );

    }

    catch (err) {

      alert(

        err.response?.data?.message

        || "Registration failed"

      );

    }

  };

  return (

    <div className="auth-card">

      <h2>
        Driver Register
      </h2>

      <form onSubmit={submit}>

        <input

          placeholder="Full Name"

          required

          onChange={(e) =>

            setForm({

              ...form,

              name:
                e.target.value

            })

          }

        />

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

        <input

          placeholder="Phone"

          required

          onChange={(e) =>

            setForm({

              ...form,

              phone:
                e.target.value

            })

          }

        />

        <input

          placeholder="Driving License Number"

          required

          onChange={(e) =>

            setForm({

              ...form,

              dlNumber:
                e.target.value

            })

          }

        />

        <input

          placeholder="Address"

          required

          onChange={(e) =>

            setForm({

              ...form,

              address:
                e.target.value

            })

          }

        />

        <select

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

        <button>

          Register

        </button>

      </form>

    </div>

  );

}