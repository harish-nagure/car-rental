import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api.get("/bookings/mine").then(({ data }) => setBookings(data));
  }, []);

  console.log("Customer bookings:", bookings);
  return (
    <>
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.length > 0 && (
        <table className="table" style={{ marginTop: 14 }}>
          <thead><tr>
            <th>Car</th><th>Driver</th><th>Start</th><th>End</th><th>Total</th>
            <th>Payment</th>
            <th>Status</th>
          </tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b.car?.name || "—"}</td>
                <td>{b.driver?.name || "Self drive"}</td>
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
                    className={`badge badge-${b.returnStatus === "returned" ? "yes" : "no"
                      }`}
                  >
                    {
                      b.returnStatus === "returned"
                        ? "Completed"
                        : b.returnStatus === "cancelled"
                          ? "Cancelled"
                        : "Active"
                    }
                  </span>
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
