import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/Home";
import Venues from "../pages/Venues";
import VenueDetails from "../pages/VenueDetails";
import Login from "../pages/Login";
import Register from "../pages/Register";
import CustomerDashboard from "../pages/CustomerDashboard";
import ManagerDashboard from "../pages/ManagerDashboard";
import CreateVenue from "../pages/CreateVenue";
import EditVenue from "../pages/EditVenue";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="venues" element={<Venues />} />
                    <Route path="venues/:id" element={<VenueDetails />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="dashboard" element={<CustomerDashboard />} />
                    <Route path="manager" element={<ManagerDashboard />} />
                    <Route path="manager/create" element={<CreateVenue />} />
                    <Route path="manager/edit/:id" element={<EditVenue />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}