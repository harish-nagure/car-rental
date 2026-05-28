import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  Link
} from "react-router-dom";

import api from "../api/axios.js";

import {
  useAuth
} from "../context/AuthContext.jsx";

const imgUrl = (img) =>

  img && img !== "NA"

    ? `/uploads/${img}`

    : "/uploads/placeholder.jpg";

export default function CarDetails() {

  const { id } = useParams();

  const [car, setCar] =
    useState(null);

  const { user } =
    useAuth();

  useEffect(() => {

    api.get(`/cars/${id}`)
      .then(({ data }) =>
        setCar(data)
      )
      .catch((err) =>
        console.error(err)
      );

  }, [id]);

  if (!car) {

    return (

      <div className="details-loading">

        <div className="loader" />

        <p>
          Loading Car Details...
        </p>

      </div>

    );

  }

  return (

    <div className="car-details-page">

      <div className="car-details-card">

        {/* IMAGE SECTION */}

        <div className="car-image-section">

          <div
            className={`car-status-badge ${

              car.availability ===
              "yes"

                ? "available"

                : "booked"

            }`}
          >

            {

              car.availability ===
              "yes"

                ? "Available"

                : "Booked"

            }

          </div>

          <img

            src={imgUrl(car.image)}

            alt={car.name}

            className="details-car-image"

            onError={(e) => {

              e.target.src =
                "/uploads/placeholder.jpg";

            }}

          />

        </div>

        {/* CONTENT */}

        <div className="car-details-content">

          {/* HEADER */}

          <div className="details-header">

            <div>

              <h1>
                {car.name}
              </h1>

              <p className="plate-text">

                {car.nameplate}

              </p>

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="details-description">

            <p>

              Experience smooth,
              comfortable and
              reliable rides with
              premium pricing
              options for both
              daily and kilometer
              based bookings.

            </p>

          </div>

          {/* PRICE GRID */}

          <div className="pricing-section">

            {/* AC */}

            <div className="pricing-card">

              <div className="pricing-top">

                <div>

                  <h3>
                    AC Pricing
                  </h3>

                  <span>
                    Premium Comfort
                  </span>

                </div>

                <div className="green-dot" />

              </div>

              <div className="pricing-values">

                <div>

                  <h2>

                    ₹
                    {car.acPricePerDay}

                  </h2>

                  <p>
                    Per Day
                  </p>

                </div>

                <div>

                  <h2>

                    ₹
                    {car.acPrice}

                  </h2>

                  <p>
                    Per KM
                  </p>

                </div>

              </div>

            </div>

            {/* NON AC */}

            <div className="pricing-card secondary">

              <div className="pricing-top">

                <div>

                  <h3>
                    Non-AC Pricing
                  </h3>

                  <span>
                    Budget Friendly
                  </span>

                </div>

                <div className="gray-dot" />

              </div>

              <div className="pricing-values">

                <div>

                  <h2>

                    ₹
                    {car.nonAcPricePerDay}

                  </h2>

                  <p>
                    Per Day
                  </p>

                </div>

                <div>

                  <h2>

                    ₹
                    {car.nonAcPrice}

                  </h2>

                  <p>
                    Per KM
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* FEATURES */}

          <div className="feature-grid">

            <div className="feature-item">

              <h4>
                Booking Options
              </h4>

              <p>
                Per Day & KM
              </p>

            </div>

            <div className="feature-item">

              <h4>
                Car Status
              </h4>

              <p>

                {

                  car.availability ===
                  "yes"

                    ? "Ready to Ride"

                    : "Already Reserved"

                }

              </p>

            </div>

            <div className="feature-item">

              <h4>
                Support
              </h4>

              <p>
                24×7 Assistance
              </p>

            </div>

            <div className="feature-item">

              <h4>
                Payment
              </h4>

              <p>
                Online & Cash
              </p>

            </div>

          </div>

          {/* ACTION */}

          <div className="details-action-section">

            {

              car.availability ===
              "yes"

              ? (

                user?.role ===
                "customer"

                ? (

                  <Link

                    to={`/booking/${car._id}`}

                    className="premium-book-btn"

                  >

                    Book This Car

                  </Link>

                )

                : (

                  <Link

                    to="/login"

                    className="premium-book-btn"

                  >

                    Login as Customer

                  </Link>

                )

              )

              : (

                <button

                  className="premium-book-btn disabled"

                  disabled

                >

                  Currently Booked

                </button>

              )

            }

          </div>

        </div>

      </div>

    </div>

  );

}