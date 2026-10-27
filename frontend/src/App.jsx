
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emptyEmployee = {
  employeeId: "",
  fullName: "",
  gender: "Nam",
  dateOfBirth: "",
  department: "",
  position: "",
  email: "",
  phone: "",
  hireDate: "",
  status: "Đang làm việc",
};

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  async function loadEmployees(keyword = search) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/employees?search=${encodeURIComponent(keyword)}`
      );
      if (!response.ok) throw new Error("Không tải được danh sách nhân viên");

      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError("Không thể kết nối Backend. Hãy kiểm tra API và kết nối mạng.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEmployees("");
  }, []);

  function openAddForm() {
    setForm({ ...emptyEmployee });
    setEditingId(null);
    setShowForm(true);
    setMessage("");
  }

  function openEditForm(employee) {
    setForm({
      ...emptyEmployee,
      ...employee,
      dateOfBirth: employee.dateOfBirth?.slice(0, 10) || "",
      hireDate: employee.hireDate?.slice(0, 10) || "",
    });
    setEditingId(employee._id);
    setShowForm(true);
    setMessage("");
  }

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function saveEmployee(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const url = editingId
        ? `${API_URL}/employees/${editingId}`
        : `${API_URL}/employees`;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Không lưu được nhân viên");
      }

      setShowForm(false);
      setMessage(editingId ? "Cập nhật nhân viên thành công!" : "Thêm nhân viên thành công!");
      await loadEmployees();
    } catch (err) {
      setError(err.message || "Lỗi khi lưu nhân viên");
    }
  }

  async function deleteEmployee(employee) {
    if (!window.confirm(`Bạn có chắc muốn xóa nhân viên ${employee.fullName}?`)) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(`${API_URL}/employees/${employee._id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || "Xóa thất bại");

      setMessage("Xóa nhân viên thành công!");
      await loadEmployees();
    } catch (err) {
      setError(err.message || "Lỗi khi xóa nhân viên");
    }
  }

  function searchEmployees(event) {
    event.preventDefault();
    loadEmployees(search);
  }

  return (
    <main className="app">
      <header className="topbar">
        <div>
          <div className="brand">HR<span>Cloud</span></div>
          <p>HỆ THỐNG QUẢN LÝ NHÂN SỰ</p>
        </div>
        <button className="primary" onClick={openAddForm}>+ Thêm nhân viên</button>
      </header>

      <section className="welcome">
        <p className="eyebrow">BẢNG ĐIỀU KHIỂN</p>
        <h1>Quản lý nhân sự</h1>
        <p>Quản lý hồ sơ nhân viên tập trung và thuận tiện.</p>
      </section>

      <section className="stats">
        <article className="stat-card">
          <span>Tổng nhân viên</span>
          <strong>{employees.length}</strong>
        </article>
        <article className="stat-card">
          <span>Đang làm việc</span>
          <strong>{employees.filter(e => e.status === "Đang làm việc").length}</strong>
        </article>
        <article className="stat-card">
          <span>Phòng ban</span>
          <strong>{new Set(employees.map(e => e.department)).size}</strong>
        </article>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2>Danh sách nhân viên</h2>
            <p>Thông tin nhân sự trong hệ thống</p>
          </div>
          <form className="search" onSubmit={searchEmployees}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm mã nhân viên hoặc họ tên..."
            />
            <button type="submit">Tìm kiếm</button>
          </form>
        </div>

        {message && <div className="notice success">{message}</div>}
        {error && <div className="notice error">{error}</div>}
        {loading && <p className="state">Đang tải dữ liệu nhân viên...</p>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Mã nhân viên</th>
                <th>Họ và tên</th>
                <th>Phòng ban</th>
                <th>Chức vụ</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {!loading && employees.length === 0 && (
                <tr><td colSpan="8" className="state">Không có dữ liệu nhân viên.</td></tr>
              )}
              {employees.map(employee => (
                <tr key={employee._id}>
                  <td><strong>{employee.employeeId}</strong></td>
                  <td>{employee.fullName}</td>
                  <td>{employee.department}</td>
                  <td>{employee.position}</td>
                  <td>{employee.email}</td>
                  <td>{employee.phone}</td>
                  <td>
                    <span className={`status ${employee.status === "Đang làm việc" ? "active" : "inactive"}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="small" onClick={() => setViewing(employee)}>Xem</button>
                      <button className="small edit" onClick={() => openEditForm(employee)}>Sửa</button>
                      <button className="small delete" onClick={() => deleteEmployee(employee)}>Xóa</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {showForm && (
        <div className="modal-backdrop">
          <form className="modal" onSubmit={saveEmployee}>
            <div className="modal-heading">
              <h2>{editingId ? "Cập nhật nhân viên" : "Thêm nhân viên"}</h2>
              <button type="button" className="close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <div className="form-grid">
              {[
                ["employeeId", "Mã nhân viên", "text"],
                ["fullName", "Họ và tên", "text"],
                ["dateOfBirth", "Ngày sinh", "date"],
                ["department", "Phòng ban", "text"],
                ["position", "Chức vụ", "text"],
                ["email", "Email", "email"],
                ["phone", "Số điện thoại", "tel"],
                ["hireDate", "Ngày vào làm", "date"],
              ].map(([name, label, type]) => (
                <label key={name}>
                  {label}
                  <input
                    name={name}
                    type={type}
                    value={form[name] || ""}
                    onChange={changeField}
                    required
                  />
                </label>
              ))}
              <label>
                Giới tính
                <select name="gender" value={form.gender} onChange={changeField}>
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </label>
              <label>
                Trạng thái
                <select name="status" value={form.status} onChange={changeField}>
                  <option>Đang làm việc</option>
                  <option>Đã nghỉ việc</option>
                  <option>Tạm nghỉ</option>
                </select>
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary" onClick={() => setShowForm(false)}>Hủy</button>
              <button className="primary" type="submit">Lưu nhân viên</button>
            </div>
          </form>
        </div>
      )}

      {viewing && (
        <div className="modal-backdrop">
          <section className="modal detail">
            <div className="modal-heading">
              <h2>Thông tin nhân viên</h2>
              <button className="close" onClick={() => setViewing(null)}>×</button>
            </div>
            {[
              ["Mã nhân viên", viewing.employeeId],
              ["Họ và tên", viewing.fullName],
              ["Giới tính", viewing.gender],
              ["Ngày sinh", viewing.dateOfBirth?.slice(0, 10)],
              ["Phòng ban", viewing.department],
              ["Chức vụ", viewing.position],
              ["Email", viewing.email],
              ["Số điện thoại", viewing.phone],
              ["Ngày vào làm", viewing.hireDate?.slice(0, 10)],
              ["Trạng thái", viewing.status],
            ].map(([label, value]) => (
              <p className="detail-row" key={label}><strong>{label}:</strong> {value || "—"}</p>
            ))}
            <button className="primary" onClick={() => setViewing(null)}>Đóng</button>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
