import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Tabs,
  Tab,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
  MenuItem,
} from "@mui/material";
import axios from "axios";

const AdminDashboard = () => {
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [subs, setSubs] = useState([]);
  const [booksUploaded, setBooksUploaded] = useState(0);
  const [sellCount, setSellCount] = useState(0);
  const [buyCount, setBuyCount] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const [editSeller, setEditSeller] = useState(null);
  const [editBuyer, setEditBuyer] = useState(null);
  const [open, setOpen] = useState(false);
  const [booksSold, setBooksSold] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [openBookDialog, setOpenBookDialog] = useState(false);

  // Fetch all data from the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          sellersRes,
          buyersRes,
          booksCountRes,
          sellersCountRes,
          buyersCountRes,
          subsRes,
          booksSoldRes,
          revenueRes,
          booksRes,
        ] = await Promise.all([
          axios.get("http://localhost:5000/sellers"),
          axios.get("http://localhost:5000/buyers"),
          axios.get("http://localhost:5000/books/count"),
          axios.get("http://localhost:5000/countSellers"),
          axios.get("http://localhost:5000/countBuyers"),
          axios.get("http://localhost:5000/subscription"),
          axios.get("http://localhost:5000/books/sold"),
          axios.get("http://localhost:5000/revenue"),
          axios.get("http://localhost:5000/admin/books"),
        ]);

        setSellers(sellersRes.data);
        setBuyers(buyersRes.data);
        setBooksUploaded(booksCountRes.data.count);
        setSellCount(sellersCountRes.data.count);
        setBuyCount(buyersCountRes.data.count);
        setSubs(subsRes.data);
        setBooksSold(booksSoldRes.data);
        setRevenueData(revenueRes.data);
        setBooks(booksRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Data for charts
  const userData = [
    { name: "Sellers", value: parseInt(sellCount) },
    { name: "Buyers", value: parseInt(buyCount) },
  ];

  const subscriptionData = [
    { name: "Free", value: subs.filter(sub => sub.plan === "free").length },
    { name: "Starter", value: subs.filter(sub => sub.plan === "starter").length },
    { name: "Premium", value: subs.filter(sub => sub.plan === "premium").length },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditClick = (person, type) => {
    if (type === 'seller') {
      setEditSeller(person);
    } else if (type === 'buyer') {
      setEditBuyer(person);
    }
    setOpen(true);
  };
  

  const handleDeleteClickSeller = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/sellers/${id}`);
      setSellers(sellers.filter((seller) => seller.id !== id));
    } catch (err) {
      console.error("Error deleting seller:", err);
    }
  };

  const handleDeleteClickBuyer = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/buyers/${id}`);
      setBuyers(buyers.filter((buyer) => buyer.id !== id));
    } catch (err) {
      console.error("Error deleting seller:", err);
    }
  };

  const handleSaveSeller = async () => {
    try {
      await axios.put(
        `http://localhost:5000/sellers/${editSeller.id}`,
        editSeller
      );
      setSellers(
        sellers.map((seller) =>
          seller.id === editSeller.id ? editSeller : seller
        )
      );
      setOpen(false);
      setEditSeller(null);
    } catch (err) {
      console.error("Error saving seller:", err);
    }
  };

  const handleSaveBuyer = async () => {
    try {
      await axios.put(
        `http://localhost:5000/buyers/${editBuyer.id}`,
        editBuyer
      );
      setBuyers(
        buyers.map((buyer) =>
          buyer.id === editBuyer.id ? editBuyer : buyer
        )
      );
      setOpen(false);
      setEditSeller(null);
    } catch (err) {
      console.error("Error saving seller:", err);
    }
  };

  const handleEditBook = (book) => {
    setEditBook(book);
    setOpenBookDialog(true);
  };

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (err) {
      console.error("Error deleting book:", err);
    }
  };

  const handleSaveBook = async () => {
    try {
      await axios.put(
        `http://localhost:5000/admin/books/${editBook.id}`,
        editBook
      );
      setBooks(
        books.map((book) =>
          book.id === editBook.id ? editBook : book
        )
      );
      setOpenBookDialog(false);
      setEditBook(null);
    } catch (err) {
      console.error("Error saving book:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/admin/logout");
      window.location.href = "/adminLogin"; // Redirect to admin login page
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <>
      <div className="flex justify-between items-center p-4">
        <h2 className="text-2xl tracking-tight font-extrabold text-[#FFD369]">
          Admin Dashboard
        </h2>
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleLogout}
          sx={{ backgroundColor: "#FF4B4B" }}
        >
          Logout
        </Button>
      </div>
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#222831",
          color: "#EEEEEE",
          padding: "2rem",
        }}
      >
        <Grid container spacing={3}>
          {/* Analytics Overview Cards */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: "#393E46",
                color: "#EEEEEE",
                height: "100%",
              }}
            >
              <Typography variant="h6" color="#FFD369">
                Total Books
              </Typography>
              <Typography variant="h4">{booksUploaded}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: "#393E46",
                color: "#EEEEEE",
                height: "100%",
              }}
            >
              <Typography variant="h6" color="#FFD369">
                Total Users
              </Typography>
              <Typography variant="h4">{sellCount + buyCount}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: "#393E46",
                color: "#EEEEEE",
                height: "100%",
              }}
            >
              <Typography variant="h6" color="#FFD369">
                Active Subscriptions
              </Typography>
              <Typography variant="h4">{subs.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: "#393E46",
                color: "#EEEEEE",
                height: "100%",
              }}
            >
              <Typography variant="h6" color="#FFD369">
                Books Sold
              </Typography>
              <Typography variant="h4">{booksSold.length}</Typography>
            </Paper>
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: "#393E46",
                color: "#EEEEEE",
                height: "400px",
              }}
            >
              <Typography variant="h6" color="#FFD369" gutterBottom>
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {userData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: "#393E46",
                color: "#EEEEEE",
                height: "400px",
              }}
            >
              <Typography variant="h6" color="#FFD369" gutterBottom>
                Subscription Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 2,
                backgroundColor: "#393E46",
                color: "#EEEEEE",
                height: "400px",
              }}
            >
              <Typography variant="h6" color="#FFD369" gutterBottom>
                Revenue Over Time
              </Typography>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#FFD369"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Existing Tabs Section */}
        <Box sx={{ width: "100%", marginTop: "20px" }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Sellers" sx={{ color: "#FFFFFF" }} />
            <Tab label="Buyers" sx={{ color: "#FFFFFF" }} />
            <Tab label="Subscriptions" sx={{ color: "#FFFFFF" }} />
            <Tab label="Books" sx={{ color: "#FFFFFF" }} />
          </Tabs>
          <TabPanel value={activeTab} index={0}>
            <h4 style={{ color: "#FFD369" }}>Sellers Information</h4>
            <table
              style={{
                width: "100%",
                color: "#EEE",
                marginTop: "10px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "left",
                      width: "20%",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "left",
                      width: "30%",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "left",
                      width: "30%",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "center",
                      width: "20%",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller) => (
                  <tr key={seller.id}>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                      {seller.id}
                    </td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                      {seller.username}
                    </td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                      {seller.email}
                    </td>
                    <td
                      style={{
                        border: "1px solid #EEE",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleEditClick(seller,'seller')}
                        sx={{ padding: "4px", marginRight: "8px" }} // Add margin here
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteClickSeller(seller.id)}
                        sx={{ padding: "4px" }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <h4 style={{ color: "#FFD369" }}>Buyers Information</h4>
            <table
              style={{
                width: "100%",
                color: "#EEE",
                marginTop: "10px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "left",
                      width: "20%",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "left",
                      width: "30%",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "left",
                      width: "30%",
                    }}
                  >
                    Email
                  </th>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "center",
                      width: "20%",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {buyers.map((buyer) => (
                  <tr key={buyer.id}>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                      {buyer.id}
                    </td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                      {buyer.username}
                    </td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                      {buyer.email}
                    </td>
                    <td
                      style={{
                        border: "1px solid #EEE",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        onClick={() => handleEditClick(buyer, 'buyer')}
                        sx={{ padding: "4px", marginRight: "8px" }} // Add margin here
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteClickBuyer(buyer.id)}
                        sx={{ padding: "4px" }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <h4 style={{ color: "#FFD369" }}>Subscriptions</h4>
            <table
              style={{
                width: "100%",
                color: "#EEE",
                marginTop: "10px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "left",
                      width: "20%",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "left",
                      width: "30%",
                    }}
                  >
                    Seller ID
                  </th>
                  <th
                    style={{
                      border: "1px solid #EEE",
                      padding: "8px",
                      textAlign: "left",
                      width: "30%",
                    }}
                  >
                    Plan
                  </th>
                </tr>
              </thead>
              <tbody>
                {subs.map((sub) => (
                  <tr key={sub.id}>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                      {sub.id}
                    </td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                      {sub.userId}
                    </td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>
                      {sub.plan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>
          <TabPanel value={activeTab} index={3}>
            <h4 style={{ color: "#FFD369" }}>Books Management</h4>
            <table
              style={{
                width: "100%",
                color: "#EEE",
                marginTop: "10px",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #EEE", padding: "8px", textAlign: "left" }}>ID</th>
                  <th style={{ border: "1px solid #EEE", padding: "8px", textAlign: "left" }}>Title</th>
                  <th style={{ border: "1px solid #EEE", padding: "8px", textAlign: "left" }}>Seller</th>
                  <th style={{ border: "1px solid #EEE", padding: "8px", textAlign: "left" }}>Price</th>
                  <th style={{ border: "1px solid #EEE", padding: "8px", textAlign: "left" }}>Status</th>
                  <th style={{ border: "1px solid #EEE", padding: "8px", textAlign: "left" }}>Type</th>
                  <th style={{ border: "1px solid #EEE", padding: "8px", textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id}>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>{book.id}</td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>{book.bookName}</td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>{book.seller_name}</td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>₹{book.price}</td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>{book.status}</td>
                    <td style={{ border: "1px solid #EEE", padding: "8px" }}>{book.listingType}</td>
                    <td style={{ border: "1px solid #EEE", padding: "8px", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        onClick={() => handleEditBook(book)}
                        sx={{ padding: "4px", marginRight: "8px" }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDeleteBook(book.id)}
                        sx={{ padding: "4px" }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TabPanel>
        </Box>

        {/* Edit Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>
            {editSeller ? "Edit Seller" : editBuyer ? "Edit Buyer" : "Edit"}
          </DialogTitle>
          <DialogContent>
            {/* Form for editing seller */}
            {editSeller && (
              <>
                <TextField
                  label="Username"
                  fullWidth
                  margin="normal"
                  value={editSeller?.username || ""}
                  onChange={(e) =>
                    setEditSeller({ ...editSeller, username: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  value={editSeller?.email || ""}
                  onChange={(e) =>
                    setEditSeller({ ...editSeller, email: e.target.value })
                  }
                />
                {/* Additional fields for seller if needed */}
              </>
            )}

            {/* Form for editing buyer */}
            {editBuyer && (
              <>
                <TextField
                  label="Username"
                  fullWidth
                  margin="normal"
                  value={editBuyer?.username || ""}
                  onChange={(e) =>
                    setEditBuyer({ ...editBuyer, username: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  value={editBuyer?.email || ""}
                  onChange={(e) =>
                    setEditBuyer({ ...editBuyer, email: e.target.value })
                  }
                />
                {/* Additional fields for buyer if needed */}
              </>
            )}
          </DialogContent>

          <DialogActions>
            {editSeller && (
              <Button onClick={handleSaveSeller} color="primary">
                Save Seller
              </Button>
            )}
            {editBuyer && (
              <Button onClick={handleSaveBuyer} color="primary">
                Save Buyer
              </Button>
            )}
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Book Edit Dialog */}
        <Dialog open={openBookDialog} onClose={() => setOpenBookDialog(false)}>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogContent>
            {editBook && (
              <>
                <TextField
                  label="Book Name"
                  fullWidth
                  margin="normal"
                  value={editBook.bookName || ""}
                  onChange={(e) =>
                    setEditBook({ ...editBook, bookName: e.target.value })
                  }
                />
                <TextField
                  label="Price"
                  fullWidth
                  margin="normal"
                  type="number"
                  value={editBook.price || ""}
                  onChange={(e) =>
                    setEditBook({ ...editBook, price: e.target.value })
                  }
                />
                <TextField
                  label="Address"
                  fullWidth
                  margin="normal"
                  value={editBook.address || ""}
                  onChange={(e) =>
                    setEditBook({ ...editBook, address: e.target.value })
                  }
                />
                <TextField
                  label="Pincode"
                  fullWidth
                  margin="normal"
                  value={editBook.pincode || ""}
                  onChange={(e) =>
                    setEditBook({ ...editBook, pincode: e.target.value })
                  }
                />
                <TextField
                  select
                  label="Status"
                  fullWidth
                  margin="normal"
                  value={editBook.status || "AVAILABLE"}
                  onChange={(e) =>
                    setEditBook({ ...editBook, status: e.target.value })
                  }
                >
                  <MenuItem value="AVAILABLE">Available</MenuItem>
                  <MenuItem value="SOLD">Sold</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Listing Type"
                  fullWidth
                  margin="normal"
                  value={editBook.listingType || "sell"}
                  onChange={(e) =>
                    setEditBook({ ...editBook, listingType: e.target.value })
                  }
                >
                  <MenuItem value="sell">Sell</MenuItem>
                  <MenuItem value="rent">Rent</MenuItem>
                </TextField>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveBook} color="primary">
              Save
            </Button>
            <Button onClick={() => setOpenBookDialog(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default AdminDashboard;