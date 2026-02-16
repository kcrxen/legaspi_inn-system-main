import { useEffect } from "react";
import Chart from "chart.js/auto";
import "./App.css";

function App() {
  useEffect(() => {
    // 1) Chart.js (run after render)
    const canvas = document.getElementById("roomStatusChart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const roomStatusChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Available", "Occupied", "Reserved", "Maintenance"],
        datasets: [
          {
            data: [12, 3, 2, 1],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        cutout: "70%",
      },
    });

    // 2) Add status dots
    document.querySelectorAll(".room-list li").forEach((li) => {
      const status = li.dataset.status;
      const dot = document.createElement("span");
      dot.classList.add("dot");

      if (status === "available") dot.classList.add("green");
      else if (status === "occupied") dot.classList.add("blue");
      else if (status === "reserved") dot.classList.add("yellow");
      else if (status === "maintenance") dot.classList.add("red");

      li.prepend(dot);
    });

    // cleanup chart on unmount
    return () => roomStatusChart.destroy();
  }, []);

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo">
          <img src="/assets/images/logo.png" alt="Legaspi Inn Logo" />
        </div>

        <nav className="menu">
          <ul>
            <li className="active">
              <a href="index.html">
                <img
                  src="/assets/images/sidebar/dashboard.png"
                  alt="dashboard"
                  className="dashboard"
                />
                Dashboard
              </a>
            </li>

            <li>
              <a href="transaction.html">
                <img
                  src="/assets/images/sidebar/transaction.png"
                  alt="transaction"
                  className="transaction"
                />
                Transactions
              </a>
            </li>

            <li>
              <a href="room.html">
                <img
                  src="/assets/images/sidebar/room.png"
                  alt="room"
                  className="room"
                />
                Room
              </a>
            </li>

            <li>
              <a href="guest.html">
                <img
                  src="/assets/images/sidebar/guest.png"
                  alt="guest"
                  className="guest"
                />
                Guest
              </a>
            </li>

            <li>
              <a href="inventory.html">
                <img
                  src="/assets/images/sidebar/inventory.png"
                  alt="inventory"
                  className="inventory"
                />
                Inventory
              </a>
            </li>
          </ul>
        </nav>

        <div className="employee" id="openUserModal" role="button" tabIndex={0}>
          <img
            src="/assets/images/user.png"
            alt="employee"
            className="employee"
          />
          Employee
        </div>
      </aside>

      <main className="content">
        <header className="top-bar">
          <div className="top-icons">
            <img
              src="/assets/images/calculator.png"
              alt="calculator"
              className="calculator"
              id="openCalc"
              role="button"
              tabIndex={0}
            />
            <img
              src="/assets/images/notification.png"
              alt="notification"
              className="notification"
            />
          </div>
        </header>

        {/* Summary Cards */}
        <section className="summary-cards">
          <a href="room.html" className="card">
            <p>Total Rooms</p>
            <h3>15</h3>
          </a>

          <a href="room.html" className="card">
            <p>Available</p>
            <h3>12</h3>
          </a>

          <a href="transaction.html" className="card">
            <p>Check-ins</p>
            <h3>6</h3>
          </a>

          <a href="transaction.html" className="card">
            <p>Check-outs</p>
            <h3>3</h3>
          </a>
        </section>

        {/* Main Dashboard */}
        <section className="dashboard-main">
          <a href="room.html" className="chart-link">
            <div className="chart-section">
              <h3>Room Status</h3>

              <div className="room-top">
                <ul className="status-legend">
                  <li>
                    <span className="legend-dot green"></span>Available
                  </li>
                  <li>
                    <span className="legend-dot blue"></span>Occupied
                  </li>
                  <li>
                    <span className="legend-dot yellow"></span>Reserved
                  </li>
                  <li>
                    <span className="legend-dot red"></span>Maintenance
                  </li>
                </ul>

                <div className="chart-placeholder">
                  <canvas id="roomStatusChart"></canvas>
                </div>
              </div>

              <div className="room-bottom">
                <ul className="room-list">
                  <li data-status="occupied">
                    R101 <small>Single/3hrs - ₱80</small>
                  </li>
                  <li data-status="reserved">
                    R102 <small>Double/8hrs - ₱400</small>
                  </li>
                  <li data-status="available">R103</li>
                  <li data-status="available">R104</li>
                  <li data-status="available">R105</li>
                  <li data-status="available">R106</li>
                  <li data-status="maintenance">R108</li>
                </ul>
              </div>
            </div>
          </a>

          <div className="tables-section">
            <a href="inventory.html" className="card-link">
              <div className="table-card">
                <h3>Low Stock Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Category</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Soap</td>
                      <td>3</td>
                      <td>Toiletries</td>
                      <td>70</td>
                    </tr>
                    <tr>
                      <td>Bottled Water</td>
                      <td>4</td>
                      <td>Amenities</td>
                      <td>150</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </a>

            <div className="table-card">
              <h3>Damages</h3>
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Bed</td>
                    <td>Furniture</td>
                    <td>Pending</td>
                    <td>
                      <button>guest</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Shoes</td>
                    <td>Booking</td>
                    <td>Pending</td>
                    <td>
                      <button>guest</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Mug</td>
                    <td>Supplies</td>
                    <td>Pending</td>
                    <td>
                      <button>employee</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Matt</td>
                    <td>Furniture</td>
                    <td>Resolved</td>
                    <td>
                      <button>employee</button>
                    </td>
                  </tr>
                  <tr>
                    <td>Bed</td>
                    <td>Furniture</td>
                    <td>Resolved</td>
                    <td>
                      <button>employee</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
