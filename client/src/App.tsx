import { Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";

import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Scheduler from "./pages/Scheduler";
import AIComposer from "./pages/AIcomposer";

import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Dashboard Layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/scheduler" element={<Scheduler />} />
        <Route path="/ai-composer" element={<AIComposer />} />
      </Route>
    </Routes>
  );
}