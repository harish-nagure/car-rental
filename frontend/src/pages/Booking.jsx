import { useEffect, useState } from "react";

import {
  useParams,
  useNavigate,
  Navigate
} from "react-router-dom";

import api from "../api/axios.js";

import { useAuth }
  from "../context/AuthContext.jsx";

import {
  PayPalButtons
} from "@paypal/react-paypal-js";

export default function Booking() {

  const { carId } = useParams();

  const navigate = useNavigate();

  const { user } = useAuth();

  const [car, setCar] =
    useState(null);

  const [drivers, setDrivers] =
    useState([]);

  const [paymentMethod,
    setPaymentMethod] =
    useState("paypal");

  const [loading,
    setLoading] =
    useState(false);

  const [paymentSuccess,
    setPaymentSuccess] =
    useState(false);

  const [form, setForm] =
    useState({

      driverId: "",

      rentStartDate: "",

      rentEndDate: "",

      chargeType: "days",

      distance: "",

      ac: "yes"

    });

  const isBookingValid = () => {
    if (!form.rentStartDate || !form.rentEndDate) {
     
      return false;
    }

    if (
      form.chargeType === "km" &&
      (!form.distance || Number(form.distance) <= 0)
    ) {
      return false;
    }

    if (
      new Date(form.rentEndDate) <
      new Date(form.rentStartDate)
    ) {
      return false;
    }

    return true;
  };
  const [confirm,
    setConfirm] =
    useState(null);

  useEffect(() => {

    api.get(`/cars/${carId}`)
      .then(({ data }) =>
        setCar(data)
      )
      .catch((err) =>
        console.error(err)
      );

    api.get(`/drivers`)
      .then(({ data }) =>
        setDrivers(data)
      )
      .catch((err) =>
        console.error(err)
      );

  }, [carId]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!car) {
    return <p>Loading...</p>;
  }

  // CALCULATE TOTAL AMOUNT
  const calculateAmount = () => {

    let total = 0;

    // KM BASED
    if (form.chargeType === "km") {

      const perKmPrice =

        form.ac === "yes"

          ? Number(car.acPrice)

          : Number(car.nonAcPrice);

      const distance =
        Number(form.distance) || 0;

      total =
        perKmPrice * distance;

    }

    // DAY BASED
    else {

      const perDayPrice =

        form.ac === "yes"

          ? Number(car.acPricePerDay)

          : Number(car.nonAcPricePerDay);

      const start =
        new Date(form.rentStartDate);

      const end =
        new Date(form.rentEndDate);

      const diffTime =

        end.getTime() -
        start.getTime();

      let days = Math.ceil(

        diffTime /

        (1000 * 60 * 60 * 24)

      ) || 1;

      // Minimum 1 day
      if (days <= 0) {
        days = 1;
      }

      total =
        perDayPrice * days;

    }

    return total.toFixed(2);

  };

  // CALCULATE DAYS
  const calculateDays = () => {

    if (
      !form.rentStartDate ||
      !form.rentEndDate
    ) {

      return 1;

    }

    const start =
      new Date(form.rentStartDate);

    const end =
      new Date(form.rentEndDate);

    const diffTime =

      end.getTime() -
      start.getTime();

    let days = Math.ceil(

      diffTime /

      (1000 * 60 * 60 * 24)

    );

    if (days <= 0) {
      days = 1;
    }

    return days;

  };

  const submit = async (

    paymentStatus = "pending",

    transactionId = null,

    paymentDetails = {}

  ) => {

    if (
      !form.rentStartDate ||
      !form.rentEndDate
    ) {

      alert(
        "Please select dates"
      );

      return;
    }

    if (
      form.chargeType === "km"
      &&
      !form.distance
    ) {

      alert(
        "Please enter distance"
      );

      return;
    }

    if (

      new Date(form.rentEndDate)

      <

      new Date(form.rentStartDate)

    ) {

      alert(
        "Return date cannot be before start date"
      );

      return;

    }

    setLoading(true);

    try {

      console.log(
        "BOOKING SUBMIT DATA:",
        {

          carId,

          userId:
            user?._id,

          amount:
            calculateAmount(),

          currency: "USD",

          paymentMethod,

          paymentStatus,

          transactionId,

          payerEmail:
            paymentDetails.email,

          payerName:
            paymentDetails.name,

          payerPhone:
            paymentDetails.phone

        }
      );

      const { data } =
        await api.post(

          "/bookings",

          {

            carId,

            driverId:
              form.driverId || null,

            rentStartDate:
              form.rentStartDate,

            rentEndDate:
              form.rentEndDate,

            chargeType:
              form.chargeType,

            ac:
              form.ac,

            distance:

              form.chargeType === "km"

                ? Number(
                  form.distance
                )

                : null,

            fare:
              calculateAmount(),

            currency: "USD",

            paymentMethod,

            paymentStatus,

            transactionId,

            payerEmail:
              paymentDetails.email
              || null,

            payerName:
              paymentDetails.name
              || null,

            payerPhone:
              paymentDetails.phone
              || null

          }

        );

      console.log(
        "BOOKING SUCCESS:",
        data
      );

      setConfirm(data);

    }

    catch (err) {

      console.error(
        "BOOKING ERROR:"
      );

      console.error(err);

      console.error(

        JSON.stringify(
          err,
          null,
          2
        )

      );

      alert(

        err.response?.data
          ?.message ||

        "Booking failed"

      );

    }

    finally {

      setLoading(false);

    }

  };

  // CONFIRMATION PAGE
  if (confirm) {

    // return (

    //   <div
    //     className="card"
    //     style={{
    //       maxWidth: 500,
    //       margin: "0 auto"
    //     }}
    //   >

    //     <h2>
    //       ✅ Booking Confirmed!
    //     </h2>

    //     <p>

    //       <strong>
    //         Car:
    //       </strong>

    //       {car.name}

    //     </p>

    //     <p>

    //       <strong>
    //         From:
    //       </strong>

    //       {

    //         new Date(
    //           confirm.rentStartDate
    //         ).toLocaleDateString()

    //       }

    //     </p>

    //     <p>

    //       <strong>
    //         To:
    //       </strong>

    //       {

    //         new Date(
    //           confirm.rentEndDate
    //         ).toLocaleDateString()

    //       }

    //     </p>

    //     <p>

    //       <strong>
    //         Total:
    //       </strong>

    //       ${confirm.totalAmount.toFixed(2)}

    //     </p>

    //     <p>

    //       <strong>
    //         Payment:
    //       </strong>

    //       {

    //         paymentMethod ===
    //           "paypal"

    //           ? "Paid Online"

    //           : "Cash Payment"

    //       }

    //     </p>

    //     <button

    //       className="btn"

    //       onClick={() =>

    //         navigate(
    //           "/dashboard"
    //         )

    //       }

    //     >

    //       Go to My Bookings

    //     </button>

    //   </div>

    // );

    return (
  <div className="success-page">

    <div className="success-header">

      <div className="success-circle">
        ✓
      </div>

      <h1>Booking Confirmed</h1>

      <p>
        Your vehicle has been reserved successfully.
      </p>

    </div>

    <div className="success-car-card">

      <img
        src={
          car.image
            ? `https://car-rental-xays.onrender.com/uploads/${car.image}`
            : "/uploads/placeholder.jpg"
        }
        alt={car.name}
      />

      <div>

        <h2>{car.name}</h2>

        <span>
          {car.nameplate}
        </span>

      </div>

    </div>

    <div className="success-summary">

      <div className="summary-row">
        <span>Pickup Date</span>
        <strong>
          {new Date(
            confirm.rentStartDate
          ).toLocaleDateString()}
        </strong>
      </div>

      <div className="summary-row">
        <span>Return Date</span>
        <strong>
          {new Date(
            confirm.rentEndDate
          ).toLocaleDateString()}
        </strong>
      </div>

      <div className="summary-row">
        <span>Payment</span>

        <strong className="success-paid">
          {
            paymentMethod === "paypal"
              ? "Paid Online"
              : "Cash Payment"
          }
        </strong>
      </div>

      <div className="summary-row total-row">
        <span>Total Amount</span>

        <strong>
          ₹{confirm.totalAmount.toFixed(2)}
        </strong>
      </div>

    </div>

    <button
      className="success-btn"
      onClick={() =>
        navigate("/dashboard")
      }
    >
      View My Bookings
    </button>

  </div>
);
  }

  return (

    <div className="booking-layout">

      {/* LEFT SIDE */}

      <div className="booking-info-card">

        <img

          src={

            car.image

              ? `/uploads/${car.image}`

              : "/uploads/placeholder.jpg"

          }

          alt={car.name}

          className="booking-car-image"

        />

        <div className="booking-car-content">

          <h2>
            {car.name}
          </h2>

          <p className="booking-plate">

            {car.nameplate}

          </p>

          <div className="booking-price-box">

            <div>

              <span>

                {

                  form.chargeType ===
                    "km"

                    ? "AC / KM"

                    : "AC / Day"

                }

              </span>

              <strong>

                ₹{

                  form.chargeType ===
                    "km"

                    ? car.acPrice

                    : car.acPricePerDay

                }

              </strong>

            </div>

            <div>

              <span>

                {

                  form.chargeType ===
                    "km"

                    ? "Non-AC / KM"

                    : "Non-AC / Day"

                }

              </span>

              <strong>

                ₹{

                  form.chargeType ===
                    "km"

                    ? car.nonAcPrice

                    : car.nonAcPricePerDay

                }

              </strong>

            </div>

          </div>

        </div>

      </div>

      {/* RIGHT SIDE */}

      <div className="booking-form-card">

        <h2>
          Complete Your Booking
        </h2>

        {

          paymentSuccess && (

            <div
              className="success-box"
            >

              ✅ Payment Successful

            </div>

          )

        }

        <form
          className="modern-booking-form"
        >

          {/* DRIVER */}

          <label>
            Pick a Driver
          </label>

          <select

            value={form.driverId}

            onChange={(e) =>

              setForm({

                ...form,

                driverId:
                  e.target.value

              })

            }

          >

            <option value="">
              Self Drive
            </option>

            {

              drivers.map((d) => (

                <option

                  key={d._id}

                  value={d._id}

                >

                  {d.name}
                  ({d.phone})

                </option>

              ))

            }

          </select>

          {/* AC */}

          <label>
            AC Type
          </label>

          <select

            value={form.ac}

            onChange={(e) =>

              setForm({

                ...form,

                ac:
                  e.target.value

              })

            }

          >

            <option value="yes">
              AC
            </option>

            <option value="no">
              Non-AC
            </option>

          </select>

          {/* CHARGE TYPE */}

          <label>
            Charge Type
          </label>

          <select

            value={form.chargeType}

            onChange={(e) =>

              setForm({

                ...form,

                chargeType:
                  e.target.value

              })

            }

          >

            <option value="days">
              Per Day
            </option>

            <option value="km">
              Per KM
            </option>

          </select>

          {/* KM INPUT */}

          {

            form.chargeType === "km"

            && (

              <input

                type="number"

                placeholder="Estimated distance"

                value={form.distance}

                onChange={(e) =>

                  setForm({

                    ...form,

                    distance:
                      e.target.value

                  })

                }

              />

            )

          }

          {/* DATES */}

          <div className="date-grid">

            <div>

              <label>
                Start Date
              </label>

              <input

                type="date"

                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }

                value={
                  form.rentStartDate
                }

                onChange={(e) =>

                  setForm({

                    ...form,

                    rentStartDate:
                      e.target.value

                  })

                }

                required

              />

            </div>

            <div>

              <label>
                Return Date
              </label>

              <input

                type="date"

                min={

                  form.rentStartDate ||

                  new Date()
                    .toISOString()
                    .split("T")[0]

                }

                value={
                  form.rentEndDate
                }

                onChange={(e) =>

                  setForm({

                    ...form,

                    rentEndDate:
                      e.target.value

                  })

                }

                required

              />

            </div>

          </div>

          {/* PAYMENT METHOD */}

          <label>
            Payment Method
          </label>

          <select

            value={paymentMethod}

            onChange={(e) =>

              setPaymentMethod(
                e.target.value
              )

            }

          >

            <option value="paypal">
              PayPal
            </option>

            <option value="cash">
              Cash Payment
            </option>

          </select>

          {/* PAYPAL */}

          {

            paymentMethod ===
            "paypal"

            && (

              <div
                className="payment-box"
              >

                <div
                  className="payment-header"
                >

                  <h3>
                    Secure Online
                    Payment
                  </h3>

                  <p>

                    Pay safely using
                    PayPal or Cards

                  </p>

                </div>

                <div
                  className="payment-total"
                >

                  <span>
                    Total Amount
                  </span>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      marginTop: "5px"
                    }}
                  >

                    {

                      form.chargeType ===
                        "km"

                        ? (

                          <>
                            ₹

                            {

                              form.ac === "yes"

                                ? car.acPrice

                                : car.nonAcPrice

                            }

                            {" "}×{" "}

                            {form.distance || 0}

                            km
                          </>

                        )

                        : (

                          <>
                            ₹

                            {

                              form.ac === "yes"

                                ? car.acPricePerDay

                                : car.nonAcPricePerDay

                            }

                            {" "}×{" "}

                            {calculateDays()}

                            day(s)
                          </>

                        )

                    }

                  </p>

                  <h2>

                    ₹

                    {

                      calculateAmount()

                    }

                  </h2>

                </div>

                <PayPalButtons

                  disabled={!isBookingValid()}
                  style={{

                    layout:
                      "vertical",

                    color:
                      "blue",

                    shape:
                      "pill",

                    label:
                      "paypal",

                    height: 48

                  }}

                  forceReRender={[
                    calculateAmount()
                  ]}

                  // createOrder={(
                  //   data,
                  //   actions
                  // ) => {

                  //   console.log(
                  //     "CREATING ORDER"
                  //   );

                  //   return actions
                  //     .order
                  //     .create({

                  //       purchase_units: [

                  //         {

                  //           description:
                  //             `${car.name} Booking`,

                  //           amount: {



                  //             value:
                  //               calculateAmount()

                  //           }

                  //         }

                  //       ]

                  //     });

                  // }}

                  // onApprove={async (
                  //   data,
                  //   actions
                  // ) => {

                  //   try {

                  //     console.log(
                  //       "PAYMENT APPROVED"
                  //     );

                  //     if (
                  //       !actions.order
                  //     ) {

                  //       alert(
                  //         "Order not found"
                  //       );

                  //       return;

                  //     }

                  //     console.log("Capturing Order ID:", data.orderID);


                  //     alert("Capturing order...");
                  //     const details =

                  //       await actions
                  //         .order
                  //         .capture();

                  //     console.log(
                  //       "PAYMENT SUCCESS:",
                  //       details
                  //     );

                  //     setPaymentSuccess(
                  //       true
                  //     );

                  //     await submit(

                  //       "paid",

                  //       details.id,

                  //       {

                  //         email:

                  //           details?.payer
                  //             ?.email_address ||

                  //           null,

                  //         name:

                  //           `${details?.payer
                  //             ?.name
                  //             ?.given_name || ""

                  //           } ${details?.payer
                  //             ?.name
                  //             ?.surname || ""

                  //           }`,

                  //         phone:

                  //           details?.payer
                  //             ?.phone
                  //             ?.phone_number
                  //             ?.national_number ||

                  //           "Not Provided"

                  //       }

                  //     );

                  //   }

                  //   catch (err) {

                  //     console.error(
                  //       "PAYMENT ERROR:"
                  //     );

                  //     console.error(
                  //       err
                  //     );

                  //     console.error(

                  //       JSON.stringify(
                  //         err,
                  //         null,
                  //         2
                  //       )

                  //     );

                  //     alert(
                  //       "Payment failed"
                  //     );

                  //   }

                  // }}

                  createOrder={(data, actions) => {
                    const amount = Number(
                      calculateAmount()
                    ).toFixed(2);

                    console.log(
                      "CREATING ORDER:",
                      amount
                    );

                   if (!isBookingValid()) {
  alert(
    "Please complete all booking details before payment."
  );
  throw new Error("Invalid booking details");
}


                    return actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [
                        {
                          description: `${car.name} Booking`,
                          amount: {
                            currency_code: "USD",
                            value: amount,
                          },
                        },
                      ],
                    });
                  }}

                  onApprove={async (data, actions) => {
                    try {
                      console.log("PAYMENT APPROVED");

                      if (!actions?.order) {
                        alert("Order not found");
                        return;
                      }

                      console.log("Capturing Order ID:", data.orderID);

                      const details = await actions.order.capture();

                      console.log("PAYMENT SUCCESS");
                      console.log(details);

                      if (details.status !== "COMPLETED") {
                        throw new Error(
                          `Payment status: ${details.status}`
                        );
                      }

                      setPaymentSuccess(true);

                      await submit(
                        "paid",
                        details.id,
                        {
                          email:
                            details?.payer?.email_address || null,

                          name:
                            `${details?.payer?.name?.given_name || ""}
           ${details?.payer?.name?.surname || ""}`,

                          phone:
                            details?.payer?.phone
                              ?.phone_number
                              ?.national_number ||
                            "Not Provided",
                        }
                      );

                      alert(
                        "Payment successful"
                      );

                    } catch (err) {
                      console.error("PAYMENT ERROR");
                      console.error(err);

                      if (err?.details) {
                        console.table(err.details);
                      }

                      alert(
                        err?.message ||
                        "Payment failed"
                      );
                    }
                  }}

                  onCancel={(data) => {

                    console.warn(
                      "PAYMENT CANCELLED:"
                    );

                    console.warn(
                      data
                    );

                    alert(
                      "Payment cancelled"
                    );

                  }}

                  onError={(err) => {

                    console.error(
                      "PAYPAL ERROR:"
                    );

                    console.error(
                      err
                    );

                    console.error(

                      JSON.stringify(
                        err,
                        null,
                        2
                      )

                    );

                    alert(
                      "PayPal payment failed"
                    );

                  }}

                />

              </div>

            )

          }

          {/* CASH PAYMENT */}

          {

            paymentMethod ===
            "cash"

            && (

              <div
                className="payment-box"
              >

                <h3>
                  Cash Payment
                </h3>

                <p>

                  Pay directly at
                  pickup time.

                </p>

                <div
                  className="payment-total"
                >

                  <span>
                    Total Amount
                  </span>

                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      marginTop: "5px"
                    }}
                  >

                    {

                      form.chargeType ===
                        "km"

                        ? (

                          <>
                            ₹

                            {

                              form.ac === "yes"

                                ? car.acPrice

                                : car.nonAcPrice

                            }

                            {" "}×{" "}

                            {form.distance || 0}

                            km
                          </>

                        )

                        : (

                          <>
                            ₹

                            {

                              form.ac === "yes"

                                ? car.acPricePerDay

                                : car.nonAcPricePerDay

                            }

                            {" "}×{" "}

                            {calculateDays()}

                            day(s)
                          </>

                        )

                    }

                  </p>

                  <h2>

                    ₹

                    {

                      calculateAmount()

                    }

                  </h2>

                </div>
                <button

                  type="button"

                  className="booking-submit-btn"

                  disabled={loading}

                  onClick={() =>

                    submit(
                      "pending",
                      null
                    )

                  }

                >

                  {

                    loading

                      ? "Processing..."

                      : "Confirm Booking"

                  }

                </button>

              </div>

            )

          }

        </form>

      </div>

    </div>

  );

}