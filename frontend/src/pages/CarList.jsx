import { useEffect, useState } from "react";

import {
  Link
} from "react-router-dom";

import api from "../api/axios.js";

// Helper to resolve car image
console.log("api:", api," fd ",);
const imgUrl = (img) =>
  
  img && img !== "NA"

    // ? `/uploads/${img}`
    // ? `/uploads/${img}`
    ? `https://car-rental-xays.onrender.com/uploads/${img}`

    : "/uploads/placeholder.jpg";
    


export default function CarList() {

  const [cars, setCars] =
    useState([]);

  const [q, setQ] =
    useState("");

  const load = async (
    search = ""
  ) => {

    try {

      const { data } =
        await api.get(

          `/cars${
            search
              ? `?q=${encodeURIComponent(search)}`
              : ""
          }`

        );

      setCars(data);

    }

    catch (err) {

      console.error(err);

    }

  };

  useEffect(() => {

    load();

  }, []);

  return (

    <div className="carlist-page">

      {/* HEADER */}

      <div className="carlist-header">

        <div>

          <h1>
            Explore Cars
          </h1>

          <p>
            Book premium cars
            at best prices
          </p>

        </div>

      </div>

      {/* SEARCH */}

      <form

        className="modern-search-bar"

        onSubmit={(e) => {

          e.preventDefault();

          load(q);

        }}

      >

        <input

          placeholder="Search by car name or number plate..."

          value={q}

          onChange={(e) =>

            setQ(
              e.target.value
            )

          }

        />

        <button
          className="search-btn"
        >

          Search

        </button>

      </form>

      {/* EMPTY */}

      {

        cars.length === 0

        && (

          <div
            className="empty-box"
          >

            <h3>
              No Cars Found
            </h3>

            <p>
              Try another search
            </p>

          </div>

        )

      }

      {/* GRID */}

      <div className="modern-grid">

        {

          cars?.map((c) => (

            <Link

              to={`/cars/${c._id}`}

              key={c._id}

              className="premium-card"

            >

              {/* IMAGE */}

              <div className="image-wrapper">

                <img

                  src={imgUrl(c.image)}

                  alt={c.name}

                  className="premium-car-image"

                  onError={(e) => {

                    e.target.src =
                      "/uploads/placeholder.jpg";

                  }}

                />

                <div
                  className={`status-badge ${

                    c.availability ===
                    "yes"

                      ? "available"

                      : "booked"

                  }`}
                >

                  {

                    c.availability ===
                    "yes"

                      ? "Available"

                      : "Booked"

                  }

                </div>

              </div>

              {/* BODY */}

              <div className="premium-card-body">

                <div className="card-top">

                  <div>

                    <h2>
                      {c.name}
                    </h2>

                    <p className="plate">

                      {c.nameplate}

                    </p>

                  </div>

                </div>

                {/* PRICING */}

                <div className="pricing-grid">

                  {/* AC */}

                  <div
                    className="price-card"
                  >

                    <div className="price-head">

                      <span>
                        AC
                      </span>

                      <div
                        className="dot green"
                      />

                    </div>

                    <div className="price-details">

                      <p>

                        ₹

                        {
                          c.acPricePerDay
                        }

                        <span>
                          /day
                        </span>

                      </p>

                      <small>

                        ₹

                        {
                          c.acPrice
                        }

                        /km

                      </small>

                    </div>

                  </div>

                  {/* NON AC */}

                  <div
                    className="price-card secondary"
                  >

                    <div className="price-head">

                      <span>
                        Non-AC
                      </span>

                      <div
                        className="dot gray"
                      />

                    </div>

                    <div className="price-details">

                      <p>

                        ₹

                        {
                          c.nonAcPricePerDay
                        }

                        <span>
                          /day
                        </span>

                      </p>

                      <small>

                        ₹

                        {
                          c.nonAcPrice
                        }

                        /km

                      </small>

                    </div>

                  </div>

                </div>

                {/* FOOTER */}

                <div className="card-footer">

                  <button
                    className="book-btn"
                  >

                    View Details

                  </button>

                </div>

              </div>

            </Link>

          ))

        }

      </div>

    </div>

  );

}