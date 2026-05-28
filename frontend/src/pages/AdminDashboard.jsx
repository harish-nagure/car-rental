import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function AdminDashboard() {
  const [tab, setTab] = useState("cars");
  const [cars, setCars] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  // Forms
  const [carForm, setCarForm] = useState({
    name: "", nameplate: "", acPrice: "", nonAcPrice: "",
    acPricePerDay: "", nonAcPricePerDay: "", image: null
  });
  const [driverForm, setDriverForm] = useState({
    name: "", dlNumber: "", phone: "", address: "", gender: "male"
  });

  const loadAll = async () => {

    const [c, d, b, f] = await Promise.all([
      api.get("/cars/mine"),
      api.get("/drivers/all"),
      api.get("/bookings"),
      api.get("/feedback")
    ]);

    setCars(c.data);
    setDrivers(d.data);
    setBookings(b.data);
    setFeedbacks(f.data);

  };

  useEffect(() => { loadAll(); }, []);

  const addCar = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(carForm).forEach(([k, v]) => v != null && fd.append(k, v));
    await api.post("/cars", fd, { headers: { "Content-Type": "multipart/form-data" } });
    setCarForm({ name: "", nameplate: "", acPrice: "", nonAcPrice: "", acPricePerDay: "", nonAcPricePerDay: "", image: null });
    loadAll();
  };

  const deleteCar = async (id) => {
    if (!confirm("Delete this car?")) return;
    await api.delete(`/cars/${id}`); loadAll();
  };

  const addDriver = async (e) => {
    e.preventDefault();
    await api.post("/drivers", driverForm);
    setDriverForm({ name: "", dlNumber: "", phone: "", address: "", gender: "male" });
    loadAll();
  };

  const markReturned = async (id) => {
    await api.put(`/bookings/${id}/return`); loadAll();
  };

  const cancelBooking =
async (id) => {

  try {

    await api.put(
      `/bookings/${id}/cancel`
    );

    loadAll();

  }

  catch (err) {

    console.log(err);

  }

};
  return (
    <>
      <h2>Admin Dashboard</h2>
      <div style={{ margin: "16px 0" }}>
        <button className="btn btn-secondary" onClick={() => setTab("cars")}>Cars ({cars.length})</button>{" "}
        <button className="btn btn-secondary" onClick={() => setTab("drivers")}>Drivers ({drivers.length})</button>{" "}
        <button className="btn btn-secondary" onClick={() => setTab("bookings")}>Bookings ({bookings.length})</button>
        {" "}
        <button
          className="btn btn-secondary"
          onClick={() => setTab("feedback")}
        >
          Feedback ({feedbacks.length})
        </button>
      </div>

      {tab === "cars" && (
        <>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3>Add Car</h3>
            {/* <form onSubmit={addCar} className="row">
              <input placeholder="Name" value={carForm.name} onChange={(e) => setCarForm({ ...carForm, name: e.target.value })} required />
              <input placeholder="Number Plate" value={carForm.nameplate} onChange={(e) => setCarForm({ ...carForm, nameplate: e.target.value })} required />
              <input type="number" placeholder="AC ₹/km" value={carForm.acPrice} onChange={(e) => setCarForm({ ...carForm, acPrice: e.target.value })} required />
              <input type="number" placeholder="Non-AC ₹/km" value={carForm.nonAcPrice} onChange={(e) => setCarForm({ ...carForm, nonAcPrice: e.target.value })} required />
              <input type="number" placeholder="AC ₹/day" value={carForm.acPricePerDay} onChange={(e) => setCarForm({ ...carForm, acPricePerDay: e.target.value })} required />
              <input type="number" placeholder="Non-AC ₹/day" value={carForm.nonAcPricePerDay} onChange={(e) => setCarForm({ ...carForm, nonAcPricePerDay: e.target.value })} required />
              <input type="file" accept="image/*" onChange={(e) => setCarForm({ ...carForm, image: e.target.files[0] })} />
              <button className="btn">Add Car</button>
            </form> */}

            <form
              onSubmit={addCar}
              className="add-car-form"
            >

              <div className="add-car-form-grid">

                <div className="add-car-input-group">

                  <label>
                    Car Name
                  </label>

                  <input
                    className="add-car-input"
                    placeholder="Enter car name"
                    value={carForm.name}
                    onChange={(e) =>

                      setCarForm({

                        ...carForm,

                        name:
                          e.target.value

                      })

                    }

                    required
                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    Number Plate
                  </label>

                  <input

                    className="add-car-input"

                    placeholder="MH-01-AB-1234"

                    value={carForm.nameplate}

                    onChange={(e) =>

                      setCarForm({

                        ...carForm,

                        nameplate:
                          e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    AC Price / KM
                  </label>

                  <input

                    className="add-car-input"

                    type="number"

                    placeholder="₹ per km"

                    value={carForm.acPrice}

                    onChange={(e) =>

                      setCarForm({

                        ...carForm,

                        acPrice:
                          e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    Non-AC Price / KM
                  </label>

                  <input

                    className="add-car-input"

                    type="number"

                    placeholder="₹ per km"

                    value={carForm.nonAcPrice}

                    onChange={(e) =>

                      setCarForm({

                        ...carForm,

                        nonAcPrice:
                          e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    AC Price / Day
                  </label>

                  <input

                    className="add-car-input"

                    type="number"

                    placeholder="₹ per day"

                    value={carForm.acPricePerDay}

                    onChange={(e) =>

                      setCarForm({

                        ...carForm,

                        acPricePerDay:
                          e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    Non-AC Price / Day
                  </label>

                  <input

                    className="add-car-input"

                    type="number"

                    placeholder="₹ per day"

                    value={carForm.nonAcPricePerDay}

                    onChange={(e) =>

                      setCarForm({

                        ...carForm,

                        nonAcPricePerDay:
                          e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div
                  className="add-car-input-group add-car-full-width"
                >

                  <label>
                    Upload Car Image
                  </label>

                  <input

                    className="add-car-file-input"

                    type="file"

                    accept="image/*"

                    onChange={(e) =>

                      setCarForm({

                        ...carForm,

                        image:
                          e.target.files[0]

                      })

                    }

                  />

                </div>

              </div>

              <button
                className="add-car-btn"

                
              >

                Add Car

              </button>

            </form>
          </div>

          <table className="table">
            <thead><tr><th>Name</th><th>Plate</th><th>₹/day (AC)</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {cars.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td><td>{c.nameplate}</td><td>₹{c.acPricePerDay}</td>
                  <td><span className={`badge badge-${c.availability}`}>{c.availability}</span></td>
                  <td><button className="btn btn-danger" onClick={() => deleteCar(c._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === "drivers" && (

        <>

          <div
            className="card"
            style={{
              marginBottom: "20px"
            }}
          >

            <h3
              style={{
                marginBottom: "20px"
              }}
            >
              Add Driver
            </h3>

            <form

              onSubmit={addDriver}

              className="add-car-form"

            >

              <div className="add-car-form-grid">

                <div className="add-car-input-group">

                  <label>
                    Username
                  </label>

                  <input

                    className="add-car-input"

                    placeholder="Username"

                    value={driverForm.username}

                    onChange={(e) =>

                      setDriverForm({

                        ...driverForm,

                        username:
                        e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    Password
                  </label>

                  <input

                    type="password"

                    className="add-car-input"

                    placeholder="Password"

                    value={driverForm.password}

                    onChange={(e) =>

                      setDriverForm({

                        ...driverForm,

                        password:
                        e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    Driver Name
                  </label>

                  <input

                    className="add-car-input"

                    placeholder="Driver Name"

                    value={driverForm.name}

                    onChange={(e) =>

                      setDriverForm({

                        ...driverForm,

                        name:
                        e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    Phone
                  </label>

                  <input

                    className="add-car-input"

                    placeholder="Phone"

                    value={driverForm.phone}

                    onChange={(e) =>

                      setDriverForm({

                        ...driverForm,

                        phone:
                        e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    DL Number
                  </label>

                  <input

                    className="add-car-input"

                    placeholder="DL Number"

                    value={driverForm.dlNumber}

                    onChange={(e) =>

                      setDriverForm({

                        ...driverForm,

                        dlNumber:
                        e.target.value

                      })

                    }

                    required

                  />

                </div>

                <div className="add-car-input-group">

                  <label>
                    Gender
                  </label>

                  <select

                    className="add-car-input"

                    value={driverForm.gender}

                    onChange={(e) =>

                      setDriverForm({

                        ...driverForm,

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

                </div>

                <div
                  className="add-car-input-group add-car-full-width"
                >

                  <label>
                    Address
                  </label>

                  <textarea

                    className="add-car-input"

                    placeholder="Address"

                    value={driverForm.address}

                    onChange={(e) =>

                      setDriverForm({

                        ...driverForm,

                        address:
                        e.target.value

                      })

                    }

                    required

                  />

                </div>

              </div>

              <button className="add-car-btn">

                Add Driver

              </button>

            </form>

          </div>

          <div

            style={{

              display: "grid",

              gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",

              gap: "20px"

            }}

          >

            {/* {drivers.map((d) => (

              <div

                key={d._id}

                className="card"

                style={{
                  padding: "20px"
                }}

              >
                <h3>
                  {d.name}
                </h3>

                <p>
                  Username:
                  {" "}
                  {d.username}
                </p>

                <p>
                  Phone:
                  {" "}
                  {d.phone}
                </p>

                <p>
                  DL Number:
                  {" "}
                  {d.dlNumber}
                </p>

                <p>
                  Gender:
                  {" "}
                  {d.gender}
                </p>

                <p>
                  Availability:
                  {" "}
                  {d.availability}
                </p>

              </div>

            ))} */}

<div className="admin-driver-grid">

  {

    drivers.map((d) => (

      <div

        key={d._id}

        className="admin-driver-card"

      >

        {/* TOP */}

        <div className="admin-driver-top">

          <div className="admin-driver-avatar">

            {

              d.name
                ?.charAt(0)
                ?.toUpperCase()

            }

          </div>

          <div>

            <h3>
              {d.name}
            </h3>

            <p>
              @{d.username}
            </p>

          </div>

        </div>

        {/* DETAILS */}

        <div className="admin-driver-details">

          <div className="admin-driver-detail-item">

            <span>
              Phone
            </span>

            <strong>
              {d.phone}
            </strong>

          </div>

          <div className="admin-driver-detail-item">

            <span>
              DL Number
            </span>

            <strong>
              {d.dlNumber}
            </strong>

          </div>

          <div className="admin-driver-detail-item">

            <span>
              Gender
            </span>

            <strong
              style={{
                textTransform:
                  "capitalize"
              }}
            >

              {d.gender}

            </strong>

          </div>

          <div className="admin-driver-detail-item">

            <span>
              Availability
            </span>

            <div

              className={`admin-driver-status ${

                d.availability ===
                "yes"

                  ? "available"

                  : "busy"

              }`}

            >

              {

                d.availability ===
                "yes"

                  ? "Available"

                  : "Busy"

              }

            </div>

          </div>

        </div>

      </div>

    ))

  }

</div>
          </div>

        </>

      )}

      {tab === "bookings" && (
        <table className="table">
          <thead><tr><th>Customer</th><th>Car</th><th>Start</th><th>End</th><th>Total</th>
            <th>Payment</th>
            <th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.customerUsername}</td>
                <td>{b.car?.name}</td>
                <td>{new Date(b.rentStartDate).toLocaleDateString()}</td>
                <td>{new Date(b.rentEndDate).toLocaleDateString()}</td>
                <td>₹{b.totalAmount}</td>
                <td>


                  <div
                    className="driver-payment-info"
                  >

                    <span>

                      {

                        b.paymentMethod

                      }

                    </span>

                    <small>

                      {

                        b.paymentStatus

                      }

                    </small>
                  </div>
                </td>


                <td>
                  <span
                    className={`badge badge-${b.returnStatus === "returned"
                      ? "yes"
                      : "no"
                      }`}
                  >
                    {
                      b.returnStatus === "returned"
                        ? "Returned"
                      : b.returnStatus === "cancelled"
                        ? "Cancelled"
                        : "Active Booking"
                    }
                  </span>
                </td>

                {/* <td>
                  {b.returnStatus !== "returned" && (
                    <button className="btn" onClick={() => markReturned(b._id)}>Mark Returned</button>
                  )}
                </td> */}


<td>

  <div className="booking-action-group">

    {/* MARK RETURNED */}

    {

      b.returnStatus !== "returned"

      &&

      b.returnStatus !== "cancelled"

      &&

      b.paymentStatus === "paid"

      && (

        <button

          className="booking-return-btn"

          onClick={() =>
            markReturned(
              b._id
            )
          }

        >

          Mark Returned

        </button>

      )

    }

    {/* CANCEL BOOKING */}

    {

      b.returnStatus !== "returned"

      &&

      b.returnStatus !== "cancelled"

      &&

      b.paymentStatus === "pending"

      && (

        <button

          className="booking-cancel-btn"

          onClick={() =>
            cancelBooking(
              b._id
            )
          }

        >

          Cancel Booking

        </button>

      )

    }

  </div>

</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {tab === "feedback" && (
        <div className="card">

          <h3 style={{ marginBottom: 20 }}>
            Customer Feedback
          </h3>

          {feedbacks.length === 0 ? (

            <p>No feedback available.</p>

          ) : (

            <table className="table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                </tr>
              </thead>

              <tbody>

                {feedbacks.map((f) => (
                  <tr key={f._id}>
                    <td>{f.name}</td>
                    <td>{f.email}</td>
                    <td>{f.message}</td>
                  </tr>
                ))}

              </tbody>

            </table>

          )}

        </div>
      )}
    </>
  );
}
