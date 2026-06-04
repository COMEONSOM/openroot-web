import "../components/styles/MaintenancePage.css";

const MaintenancePage = () => {
  return (
    <div className="maintenance-page">
      <div className="maintenance-overlay" />

      <div className="maintenance-content">
        <div className="loader" />

        <h1>Site Under Maintenance</h1>

        <div className="divider" />

        <p>
          We are currently performing scheduled maintenance.
          <br />
          Please check back shortly.
        </p>

        <span className="status-text">
          Updating Openroot Systems...
        </span>
      </div>
    </div>
  );
};

export default MaintenancePage;