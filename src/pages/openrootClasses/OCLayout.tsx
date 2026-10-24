import { Outlet } from "react-router-dom";

// Shared wrapper for every page under /openroot-classes.
// It renders no header: the header belongs to the main Openroot Classes
// page only (see OCHome.tsx). Banner pages open without it.
export default function OCLayout() {
  return <Outlet />;
}