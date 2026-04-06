import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout.jsx";
import { LandingPage } from "./pages/LandingPage.jsx";
import { SearchResultsPage } from "./pages/SearchResultsPage.jsx";
import { FlightDetailsPage } from "./pages/FlightDetailsPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { PassengerDetailsPage } from "./pages/PassengerDetailsPage.jsx";
import { SeatSelectionPage } from "./pages/SeatSelectionPage.jsx";
import { PaymentPage } from "./pages/PaymentPage.jsx";
import { BookingConfirmationPage } from "./pages/BookingConfirmationPage.jsx";
import { MyTripsPage } from "./pages/MyTripsPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";

export const router = createBrowserRouter([
    {
        element: <Layout />,
        children: [
            { path: "/", element: <LandingPage /> },
            { path: "/search", element: <SearchResultsPage /> },
            { path: "/flight/:id", element: <FlightDetailsPage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/passenger-details", element: <PassengerDetailsPage /> },
            { path: "/seat-selection", element: <SeatSelectionPage /> },
            { path: "/payment", element: <PaymentPage /> },
            { path: "/booking-confirmation", element: <BookingConfirmationPage /> },
            { path: "/my-trips", element: <MyTripsPage /> },
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);
