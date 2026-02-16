export default function Inventory() {
  return (
    <>
      {/* top bar */}
      <header className="top-bar inv-topbar">
        <h1 className="page-title">Inventory</h1>

        <div className="inv-actions">
          <div className="search-wrap">
            <img src="/assets/images/search.png" alt="search" />
            <input type="text" placeholder="Search for Item Name or Category" />
          </div>


        </div>
      </header>

      {/* table card */}
      <section className="inv-card">
        <div className="inv-table-wrap">
          <table className="inv-table">
            <colgroup>
              <col style={{ width: "170px" }} />
              <col style={{ width: "230px" }} />
              <col style={{ width: "200px" }} />
              <col style={{ width: "220px" }} />
              <col style={{ width: "140px" }} />
              <col style={{ width: "190px" }} />
              <col style={{ width: "80px" }} />
            </colgroup>

            <thead>
              <tr>
                <th>Inventory ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Standard Cost</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>I0001</td>
                <td>Safeguard</td>
                <td>Toiletries</td>
                <td>Soap</td>
                <td>3</td>
                <td>70</td>
                <td className="td-action">
                  <img
                    src="/assets/images/stock.png"
                    alt="stock"
                    className="row-icon"
                  />
                </td>
              </tr>

              <tr>
                <td>I0002</td>
                <td>Nature’s Spring</td>
                <td>Amenities</td>
                <td>Bottled Water</td>
                <td>4</td>
                <td>150</td>
                <td className="td-action">
                  <img
                    src="/assets/images/stock.png"
                    alt="stock"
                    className="row-icon"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* bottom right button */}
      <button className="btn primary new-item-btn" type="button">
        + New Item
      </button>
    </>
  );
}
