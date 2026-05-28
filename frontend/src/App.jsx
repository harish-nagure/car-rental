import { Routes, Route }
from "react-router-dom";

import { useEffect, useState }
from "react";

import {
  PayPalScriptProvider
} from "@paypal/react-paypal-js";

import Navbar
from "./components/Navbar.jsx";

import ProtectedRoute
from "./components/ProtectedRoute.jsx";

import Home
from "./pages/Home.jsx";

import Login
from "./pages/Login.jsx";

import Register
from "./pages/Register.jsx";

import CarList
from "./pages/CarList.jsx";

import CarDetails
from "./pages/CarDetails.jsx";

import Booking
from "./pages/Booking.jsx";

import CustomerDashboard
from "./pages/CustomerDashboard.jsx";

import AdminDashboard
from "./pages/AdminDashboard.jsx";

import DriverDashboard
from "./pages/DriverDashboard.jsx";

import DriverRegister
from "./pages/DriverRegister.jsx";

import DriverLogin
from "./pages/DriverLogin.jsx";

export default function App() {

  const [darkMode,
    setDarkMode] =
    useState(

      localStorage.getItem(
        "theme"
      ) === "dark"

    );

  useEffect(() => {

    if (darkMode) {

      document.body.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );

    }

    else {

      document.body.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );

    }

  }, [darkMode]);

  return (

    <>

      <PayPalScriptProvider

        options={{

          "client-id":

          "AbuitPCGgyp7P3gj7l6d1qVix_ddZYfUozDH6q6xeZV1_WSVmuYs6pMNR3z4MHpOytv2s-KCjvUx77lf"

        }}

      >

        <Navbar

          darkMode={darkMode}

          setDarkMode={
            setDarkMode
          }

        />

        <div className="container">

          <Routes>

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/cars"
              element={<CarList />}
            />

            <Route
              path="/cars/:id"
              element={<CarDetails />}
            />

            <Route

              path="/driver-register"

              element={
                <DriverRegister />
              }

            />

            <Route

              path="/driver-login"

              element={
                <DriverLogin />
              }

            />

            <Route

              path="/driver-dashboard"

              element={

                <ProtectedRoute role="driver">

                  <DriverDashboard />

                </ProtectedRoute>

              }

            />

            <Route

              path="/booking/:carId"

              element={

                <ProtectedRoute role="customer">

                  <Booking />

                </ProtectedRoute>

              }

            />

            <Route

              path="/dashboard"

              element={

                <ProtectedRoute role="customer">

                  <CustomerDashboard />

                </ProtectedRoute>

              }

            />

            <Route

              path="/admin"

              element={

                <ProtectedRoute role="admin">

                  <AdminDashboard />

                </ProtectedRoute>

              }

            />

          </Routes>

        </div>

      </PayPalScriptProvider>

    </>

  );

}