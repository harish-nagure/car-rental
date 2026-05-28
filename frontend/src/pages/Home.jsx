import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useState, useEffect } from "react";

export default function Home() {
  const [feedback, setFeedback] = useState({
  name: "",
  email: "",
  message: "",
  driver: "",
  rating: 5
});
const [drivers, setDrivers] = useState([]);
  const [sent, setSent] = useState(false);
useEffect(() => {

  api.get("/drivers")
    .then(({ data }) => setDrivers(data));

}, []);
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/feedback", feedback);
      setSent(true);
      setFeedback({
  name: "",
  email: "",
  message: "",
  driver: "",
  rating: 5
});
    } catch { alert("Could not send feedback"); }
  };

  return (
  <>
    <section className="modern-hero">

      <div className="hero-overlay">

        <div className="hero-content">

          <p className="hero-tag">
            PREMIUM CAR RENTAL EXPERIENCE
          </p>

          <h1>
            Drive Your Dream Car Today
          </h1>

          <p className="hero-subtitle">
            Luxury cars with professional drivers available across the city.
            Fast booking. Premium comfort. Affordable pricing.
          </p>

          <div className="hero-buttons">

            <Link to="/cars" className="hero-btn primary-btn">
              Browse Cars
            </Link>

            
          </div>

        </div>

      </div>

    </section>

    <section className="feedback-section">

      <div className="feedback-card">

        <div className="feedback-header">
          <h2>Customer Feedback</h2>

          <p>
            Share your experience with our premium rental service.
          </p>
        </div>

        {sent && (
          <div className="alert alert-success">
            Thanks for your feedback!
          </div>
        )}

        <form onSubmit={submit} className="modern-form">

          <input
            placeholder="Your name"
            value={feedback.name}
            onChange={(e) =>
              setFeedback({
                ...feedback,
                name: e.target.value
              })
            }
            required
          />

          <input
            placeholder="Email address"
            type="email"
            value={feedback.email}
            onChange={(e) =>
              setFeedback({
                ...feedback,
                email: e.target.value
              })
            }
            required
          />
<select
className="modern-select"
  value={feedback.driver}
  onChange={(e) =>
    setFeedback({
      ...feedback,
      driver: e.target.value
    })
  }
  required
>

  <option value="">
    Select Driver
  </option>

  {drivers.map((d) => (
    <option key={d._id} value={d._id}>
      {d.name}
    </option>
  ))}

</select>
<select
className="modern-select"
  value={feedback.rating}
  onChange={(e) =>
    setFeedback({
      ...feedback,
      rating: e.target.value
    })
  }
>

  <option value="5">⭐⭐⭐⭐⭐</option>
  <option value="4">⭐⭐⭐⭐</option>
  <option value="3">⭐⭐⭐</option>
  <option value="2">⭐⭐</option>
  <option value="1">⭐</option>

</select>
          <textarea
            placeholder="Write your feedback..."
            rows="4"
            value={feedback.message}
            onChange={(e) =>
              setFeedback({
                ...feedback,
                message: e.target.value
              })
            }
            required
          />

          <button className="modern-submit-btn">
            Send Feedback
          </button>

        </form>

      </div>

    </section>
  </>
);
}
