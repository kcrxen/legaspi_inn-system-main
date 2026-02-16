import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "transactions";
const SALES_KEY = "purchased_by_trans";

function pad(num) {
  return String(num).padStart(4, "0");
}
function getIdNumber(id) {
  const n = parseInt(String(id || "").replace(/^T/i, ""), 10);
  return Number.isNaN(n) ? null : n;
}
function formatDateTimeParts(dtLocal) {
  if (!dtLocal) return { date: "", time: "" };
  const [date, time] = dtLocal.split("T");
  return { date: date || "", time: time || "" };
}

export default function Transactions() {
  // ----- table data -----
  const initialRows = [
    {
      trans_id: "T0001",
      guest_name: "Jill Santiago",
      username: "Jeson",
      room_num: "101",
      checkin: "2025-01-25T12:25:03",
      checkout: "2025-01-25T03:25:03",
      amount: "80",
      date_created: "2025-01-25",
    },
    {
      trans_id: "T0002",
      guest_name: "Mart Santiago",
      username: "Jeson",
      room_num: "101",
      checkin: "2025-01-25T12:25:03",
      checkout: "2025-01-25T03:25:03",
      amount: "80",
      date_created: "2025-01-25",
    },
    {
      trans_id: "T0003",
      guest_name: "Ann Flores",
      username: "Jeson",
      room_num: "107",
      checkin: "2025-01-25T07:40:56",
      checkout: "2025-01-25T03:40:56",
      amount: "200",
      date_created: "2025-01-25",
    },
  ];

  const [transactions, setTransactions] = useState(initialRows);
  const [search, setSearch] = useState("");

  // ----- New Transaction modal -----
  const [txOpen, setTxOpen] = useState(false);

  const [txForm, setTxForm] = useState({
    trans_id: "",
    guest_name: "",
    username: "",
    room_num: "",
    checkin: "",
    checkout: "",
    amount: "",
    date_created: "",
  });

  // ----- Sales modal -----
  const [salesOpen, setSalesOpen] = useState(false);
  const [salesForm, setSalesForm] = useState({
    trans_id: "",
    guest: "",
    item: "",
    cost: "",
    qty: 1,
    subtotal: "0.00",
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (Array.isArray(saved) && saved.length) {
      // Merge initialRows + saved, avoid duplicates by trans_id
      const map = new Map();
      [...initialRows, ...saved].forEach((t) => map.set(t.trans_id, t));
      setTransactions(Array.from(map.values()));
    }
  }, []);

  // Generate next ID based on existing + saved
  const nextId = useMemo(() => {
    let max = 3;
    transactions.forEach((t) => {
      const n = getIdNumber(t.trans_id);
      if (n !== null) max = Math.max(max, n);
    });
    return `T${pad(max + 1)}`;
  }, [transactions]);

  // When opening New Tx modal, prefill ID
  useEffect(() => {
    if (txOpen) {
      setTxForm((prev) => ({
        ...prev,
        trans_id: prev.trans_id || nextId,
        date_created: prev.date_created || new Date().toISOString().slice(0, 10),
      }));
    }
  }, [txOpen, nextId]);

  // Search filter (Guest Name like your placeholder)
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return transactions;
    return transactions.filter((t) =>
      (t.guest_name || "").toLowerCase().includes(q)
    );
  }, [search, transactions]);

  // Helpers
  function openTxModal() {
    setTxOpen(true);
  }
  function closeTxModal() {
    setTxOpen(false);
  }

  function saveTransactionsToStorage(list) {
    // Only save transactions that are not part of initialRows? (optional)
    // For now: save everything EXCEPT the initial sample rows is also ok.
    const onlyUserAdded = list.filter(
      (t) => getIdNumber(t.trans_id) !== null && getIdNumber(t.trans_id) > 3
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(onlyUserAdded));
  }

  function handleTxSubmit(e) {
    e.preventDefault();

    const inVal = txForm.checkin;
    const outVal = txForm.checkout;

    if (inVal && outVal) {
      const inDate = new Date(inVal);
      const outDate = new Date(outVal);
      if (outDate <= inDate) {
        alert("Check-out must be after Check-in.");
        return;
      }
    }

    const newTx = {
      ...txForm,
      trans_id: (txForm.trans_id || "").trim() || nextId,
      guest_name: (txForm.guest_name || "").trim(),
      username: (txForm.username || "").trim(),
      room_num: (txForm.room_num || "").trim(),
      amount: txForm.amount,
      date_created: txForm.date_created,
    };

    setTransactions((prev) => {
      // avoid duplicates by trans_id
      const map = new Map(prev.map((t) => [t.trans_id, t]));
      map.set(newTx.trans_id, newTx);
      const updated = Array.from(map.values());
      saveTransactionsToStorage(updated);
      return updated;
    });

    // reset form
    setTxForm({
      trans_id: "",
      guest_name: "",
      username: "",
      room_num: "",
      checkin: "",
      checkout: "",
      amount: "",
      date_created: "",
    });
    closeTxModal();
  }

  // SALES modal logic
  function computeSubtotal(cost, qty) {
    const c = Number(cost || 0);
    const q = Number(qty || 0);
    return (c * q).toFixed(2);
  }

  function openSalesModal(trans_id, guest_name) {
    setSalesForm({
      trans_id,
      guest: guest_name || "",
      item: "",
      cost: "",
      qty: 1,
      subtotal: "0.00",
    });
    setSalesOpen(true);
  }

  function closeSalesModal() {
    setSalesOpen(false);
  }

  function handleSalesChange(next) {
    setSalesForm((prev) => {
      const merged = { ...prev, ...next };
      const sub = computeSubtotal(merged.cost, merged.qty);
      return { ...merged, subtotal: sub };
    });
  }

  function handleSalesSubmit(e) {
    e.preventDefault();

    const trans_id = (salesForm.trans_id || "").trim();
    const guest = (salesForm.guest || "").trim();
    const item = salesForm.item;
    const cost = Number(salesForm.cost || 0);
    const qty = Number(salesForm.qty || 0);
    const subtotal = cost * qty;

    if (!trans_id || !guest || !item || qty <= 0 || cost < 0) {
      alert("Please complete the form.");
      return;
    }

    const data = JSON.parse(localStorage.getItem(SALES_KEY) || "{}");
    const list = Array.isArray(data[trans_id]) ? data[trans_id] : [];

    list.push({
      trans_id,
      guest,
      item,
      qty,
      cost: Number(cost.toFixed(2)),
      subtotal: Number(subtotal.toFixed(2)),
      date: new Date().toISOString(),
    });

    data[trans_id] = list;
    localStorage.setItem(SALES_KEY, JSON.stringify(data));

    // reset but keep trans + guest
    setSalesForm((prev) => ({
      ...prev,
      item: "",
      cost: "",
      qty: 1,
      subtotal: "0.00",
    }));

    closeSalesModal();
    alert(`Saved sale for ${trans_id}!`);
  }

  return (
    <>
      {/* top bar */}
      <header className="top-bar tx-topbar">
        <h1 className="page-title">Transactions</h1>

        <div className="tx-actions">
          <div className="search-wrap">
            <img src="/assets/images/search.png" alt="search" />
            <input
              type="text"
              placeholder="Search by Guest Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>


        </div>
      </header>

      {/* table card */}
      <section className="tx-card">
        <div className="tx-table-wrap">
          <table className="tx-table">
            <colgroup>
              <col style={{ width: "55px" }} />
              <col style={{ width: "140px" }} />
              <col style={{ width: "190px" }} />
              <col style={{ width: "120px" }} />
              <col style={{ width: "90px" }} />
              <col style={{ width: "160px" }} />
              <col style={{ width: "160px" }} />
              <col style={{ width: "90px" }} />
              <col style={{ width: "140px" }} />
            </colgroup>

            <thead>
              <tr>
                <th className="col-icon"></th>
                <th>Transaction ID</th>
                <th>Guest Name</th>
                <th>Username</th>
                <th>Room #</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Amount</th>
                <th>Date Created</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t) => {
                const ci = formatDateTimeParts(t.checkin);
                const co = formatDateTimeParts(t.checkout);

                return (
                  <tr key={t.trans_id}>
                    <td className="col-icon">
                      <button
                        className="sales-btn"
                        type="button"
                        onClick={() => openSalesModal(t.trans_id, t.guest_name)}
                        title="Sales"
                      >
                        <img
                          className="row-icon"
                          src="/assets/images/sales.png"
                          alt="sales"
                        />
                      </button>
                    </td>

                    <td>{t.trans_id}</td>
                    <td>{t.guest_name}</td>
                    <td>{t.username}</td>
                    <td>{t.room_num}</td>

                    <td className="td-center">
                      {ci.date}
                      <br />
                      <span className="muted">{ci.time}</span>
                    </td>

                    <td className="td-center">
                      {co.date}
                      <br />
                      <span className="muted">{co.time}</span>
                    </td>

                    <td className="td-center">{t.amount}</td>
                    <td className="td-center">{t.date_created}</td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="td-center">
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* floating button */}
      <button className="new-tx-btn" type="button" onClick={openTxModal}>
        <span className="plus">＋</span>
        New Transaction
      </button>

      {/* NEW TRANSACTION MODAL */}
      <div
        className={`tx-overlay ${txOpen ? "show" : ""}`}
        aria-hidden={txOpen ? "false" : "true"}
        onClick={(e) => {
          if (e.target.classList.contains("tx-overlay")) closeTxModal();
        }}
      >
        <div className="tx-modal" role="dialog" aria-modal="true">
          <button className="tx-close" type="button" onClick={closeTxModal}>
            ✕
          </button>

          <h2 className="tx-title">New Transaction</h2>

          <form id="txForm" onSubmit={handleTxSubmit}>
            <label className="field">
              <span>Transaction ID</span>
              <input
                id="trans_id"
                type="text"
                placeholder={nextId}
                value={txForm.trans_id}
                onChange={(e) =>
                  setTxForm((p) => ({ ...p, trans_id: e.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Guest Name</span>
              <input
                id="guest_name"
                type="text"
                placeholder="Juan Dela Cruz"
                value={txForm.guest_name}
                onChange={(e) =>
                  setTxForm((p) => ({ ...p, guest_name: e.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Username</span>
              <input
                id="username"
                type="text"
                placeholder="Jason"
                value={txForm.username}
                onChange={(e) =>
                  setTxForm((p) => ({ ...p, username: e.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Room #</span>
              <input
                id="room_num"
                type="text"
                placeholder="101"
                value={txForm.room_num}
                onChange={(e) =>
                  setTxForm((p) => ({ ...p, room_num: e.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Check-in</span>
              <input
                id="checkin"
                type="datetime-local"
                value={txForm.checkin}
                onChange={(e) =>
                  setTxForm((p) => ({ ...p, checkin: e.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Check-out</span>
              <input
                id="checkout"
                type="datetime-local"
                value={txForm.checkout}
                onChange={(e) =>
                  setTxForm((p) => ({ ...p, checkout: e.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Amount</span>
              <input
                id="amount"
                type="number"
                step="0.01"
                placeholder="80"
                value={txForm.amount}
                onChange={(e) =>
                  setTxForm((p) => ({ ...p, amount: e.target.value }))
                }
                required
              />
            </label>

            <label className="field">
              <span>Date Created</span>
              <input
                id="date_created"
                type="date"
                value={txForm.date_created}
                onChange={(e) =>
                  setTxForm((p) => ({ ...p, date_created: e.target.value }))
                }
                required
              />
            </label>

            <div className="modal-actions">
              <button
                className="btn secondary"
                type="button"
                onClick={closeTxModal}
              >
                Cancel
              </button>
              <button className="btn primary" type="submit">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* PURCHASED / SALES MODAL */}
      <div
        className={`sales-overlay ${salesOpen ? "show" : ""}`}
        aria-hidden={salesOpen ? "false" : "true"}
        onClick={(e) => {
          if (e.target.classList.contains("sales-overlay")) closeSalesModal();
        }}
      >
        <div className="sales-card" role="dialog" aria-modal="true">
          <button
            className="sales-close"
            type="button"
            onClick={closeSalesModal}
            aria-label="Close"
          >
            ✕
          </button>

          <h2 className="sales-title">Sales</h2>

          <form id="salesForm" className="sales-form" onSubmit={handleSalesSubmit}>
            <input type="hidden" value={salesForm.trans_id} readOnly />

            <div className="sales-grid">
              <label className="sfield">
                <span>Guest Name</span>
                <input
                  id="sales_guest"
                  type="text"
                  placeholder="Guest name"
                  value={salesForm.guest}
                  onChange={(e) => handleSalesChange({ guest: e.target.value })}
                  required
                />
              </label>

              <label className="sfield">
                <span>Cost</span>
                <div className="money">
                  <span>₱</span>
                  <input
                    id="sales_cost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={salesForm.cost}
                    onChange={(e) => handleSalesChange({ cost: e.target.value })}
                    required
                  />
                </div>
              </label>

              <label className="sfield">
                <span>Select Item</span>
                <select
                  id="sales_item"
                  value={salesForm.item}
                  onChange={(e) => {
                    const item = e.target.value;
                    // dataset-cost like your HTML options
                    const cost =
                      e.target.selectedOptions?.[0]?.dataset?.cost ?? "";
                    handleSalesChange({ item, cost });
                  }}
                  required
                >
                  <option value="" disabled>
                    Select item
                  </option>
                  <option value="Nature’s Spring" data-cost="20">
                    Nature’s Spring
                  </option>
                  <option value="Safeguard" data-cost="15">
                    Safeguard
                  </option>
                  <option value="Towel" data-cost="50">
                    Towel
                  </option>
                </select>
              </label>

              <label className="sfield">
                <span>Quantity</span>
                <input
                  id="sales_qty"
                  type="number"
                  min="1"
                  step="1"
                  value={salesForm.qty}
                  onChange={(e) => handleSalesChange({ qty: e.target.value })}
                  required
                />
              </label>

              <label className="sfield">
                <span>Subtotal</span>
                <div className="money">
                  <span>₱</span>
                  <input
                    id="sales_subtotal"
                    type="text"
                    value={salesForm.subtotal}
                    readOnly
                  />
                </div>
              </label>
            </div>

            <div className="sales-actions">
              <button
                className="sbtn ghost"
                type="button"
                onClick={closeSalesModal}
              >
                Cancel
              </button>
              <button className="sbtn primary" type="submit">
                Confirm Sale
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
