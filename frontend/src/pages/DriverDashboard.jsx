import {
  useEffect,
  useState
} from "react";

import api
from "../api/axios";

export default function
DriverDashboard() {

  const [bookings,
    setBookings] =
    useState([]);

  const [feedback,
    setFeedback] =
    useState([]);

  const [activeTab,
    setActiveTab] =
    useState("bookings");

  useEffect(() => {

    fetchBookings();

    fetchFeedback();

  }, []);

  const fetchBookings =
  async () => {

    try {

      const { data } =
      await api.get(
        "/bookings/driver"
      );

      setBookings(data);

    }

    catch (err) {

      console.log(err);

    }

  };

  const fetchFeedback =
  async () => {

    try {

      const { data } =
      await api.get(
        "/feedback/driver"
      );

      setFeedback(data);

    }

    catch (err) {

      console.log(err);

    }

  };

  const receiveCash =
  async (bookingId) => {

    try {

      await api.put(

        `/bookings/${bookingId}/receive-cash`

      );

      fetchBookings();

    }

    catch (err) {

      console.log(err);

    }

  };

  return (

    <div className="driver-dashboard-page">

      {/* HEADER */}

      <div className="driver-dashboard-header">

        <div>

          <h1>
            Driver Dashboard
          </h1>

          <p>
            Manage your assigned
            bookings and customer
            feedback
          </p>

        </div>

      </div>

      {/* TABS */}

      <div className="driver-dashboard-tabs">

        <button

          className={`driver-dashboard-tab-btn ${

            activeTab ===
            "bookings"

              ? "active"

              : ""

          }`}

          onClick={() =>
            setActiveTab(
              "bookings"
            )
          }

        >

          Bookings

          <span>
            {bookings.length}
          </span>

        </button>

        <button

          className={`driver-dashboard-tab-btn ${

            activeTab ===
            "feedback"

              ? "active"

              : ""

          }`}

          onClick={() =>
            setActiveTab(
              "feedback"
            )
          }

        >

          Feedback

          <span>
            {feedback.length}
          </span>

        </button>

      </div>

      {/* BOOKINGS */}

      {

        activeTab ===
        "bookings"

        && (

          <div
            className="driver-dashboard-card"
          >

            <div
              className="driver-dashboard-card-header"
            >

              <h2>
                My Bookings
              </h2>

            </div>

            {

              bookings.length === 0

              ? (

                <div
                  className="driver-dashboard-empty"
                >

                  No bookings assigned.

                </div>

              )

              : (

                <div
                  className="driver-dashboard-table-wrapper"
                >

                  <table
                    className="driver-dashboard-table"
                  >

                    <thead>

                      <tr>

                        <th>
                          Car
                        </th>

                        <th>
                          Customer
                        </th>

                        <th>
                          Start
                        </th>

                        <th>
                          End
                        </th>

                        <th>
                          Amount
                        </th>

                        <th>
                          Payment
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Action
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {

                        bookings.map((b) => (

                          <tr
                            key={b._id}
                          >

                            <td>

                              {

                                b.car?.name ||

                                "N/A"

                              }

                            </td>

                            <td>

                              {

                                b.customerUsername

                              }

                            </td>

                            <td>

                              {

                                new Date(
                                  b.rentStartDate
                                )
                                .toLocaleDateString()

                              }

                            </td>

                            <td>

                              {

                                new Date(
                                  b.rentEndDate
                                )
                                .toLocaleDateString()

                              }

                            </td>

                            <td>

                              ₹
                              {b.totalAmount}

                            </td>

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

                                className={`driver-status-badge ${

                                  b.returnStatus ===
                                  "returned"

                                    ? "returned"
                                      : b.returnStatus === "cancelled"
                                      ? "cancelled"
                                    : "pending"

                                }`}

                              >

                                {

                                  b.returnStatus

                                }

                              </span>

                            </td>

                            {/* <td>

                              {

                                b.paymentMethod ===
                                "cash"

                                &&

                                b.paymentStatus ===
                                "pending"
                                
                                &&
                                
                                b.returnStatus !== "cancelled"


                                ? (

                                  <button

                                    className="driver-cash-btn"

                                    onClick={() =>
                                      receiveCash(
                                        b._id
                                      )
                                    }

                                  >

                                    Receive Cash

                                  </button>

                                )

                                : 
                                (
                                b.returnStatus === "cancelled" && (

                                  <span
                                    className="driver-paid-text"
                                  >

                                    Cancelled

                                  </span>

                                )
                                : (

                                  <span
                                    className="driver-paid-text"
                                  >

                                    Paid

                                  </span>

                                ) 
                              )
                              }

                            </td> */}
<td>

  {

    b.returnStatus ===
    "cancelled"

    ? (

      <span
        className="driver-cancelled-text"
      >

        Cancelled

      </span>

    )

    : (

      b.paymentMethod ===
      "cash"

      &&

      b.paymentStatus ===
      "pending"

      ? (

        <button

          className="driver-cash-btn"

          onClick={() =>
            receiveCash(
              b._id
            )
          }

        >

          Receive Cash

        </button>

      )

      : (

        <span
          className="driver-paid-text"
        >

          Paid

        </span>

      )

    )

  }

</td> 
                          </tr>

                        ))

                      }

                    </tbody>

                  </table>

                </div>

              )

            }

          </div>

        )

      }

      {/* FEEDBACK */}

      {

        activeTab ===
        "feedback"

        && (

          <div
            className="driver-dashboard-card"
          >

            <div
              className="driver-dashboard-card-header"
            >

              <h2>
                Customer Feedback
              </h2>

            </div>

            {

              feedback.length === 0

              ? (

                <div
                  className="driver-dashboard-empty"
                >

                  No feedback available.

                </div>

              )

              : (

                <div
                  className="driver-feedback-grid"
                >

                  {

                    feedback.map((f) => (

                      <div

                        key={f._id}

                        className="driver-feedback-card"

                      >

                        <div
                          className="driver-feedback-top"
                        >

                          <h3>
                            {f.name}
                          </h3>

                          <span>

                            ⭐ {f.rating}/5

                          </span>

                        </div>

                        <p>

                          {f.message}

                        </p>

                      </div>

                    ))

                  }

                </div>

              )

            }

          </div>

        )

      }

    </div>

  );

}