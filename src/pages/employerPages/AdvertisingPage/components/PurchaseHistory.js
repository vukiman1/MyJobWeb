"use client"


import { useState, useMemo, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Badge,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Pagination,
} from "@mui/material"
import { Search, Receipt, ShoppingCart, CalendarMonth, AttachMoney } from "@mui/icons-material"
import companyService from "../../../../services/companyService"

// Define transaction type



export default function TransactionHistory({ transactions = [] }) {
  // State for filtering and pagination
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [dateFilter, setDateFilter] = useState("all")
  const [historyData, setHistoryData] = useState("")
  const loadData = async () => {
      try {
        const resData = await companyService.getPurchaseHistory()
        console.log(resData.data)
        setHistoryData(resData.data)

      } catch (error) {
        console.error("Error fetching companies:", error)
        // setNotification({
        //   open: true,
        //   message: "Không thể tải danh sách tin tuyển dụng",
        //   severity: "error",
        // })
      }
    }
  useEffect(() => {
      loadData()
    }, [])
  
  // Handle tab change
  const handleTabChange = (event, newValue ) => {
    setTabValue(newValue)
    setPage(1) // Reset to first page when changing tabs
  }

  // Format date to locale string
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  // Filter transactions based on tab, search term, and date filter
  const filteredTransactions = useMemo(() => {
    let filtered = [...historyData]
    // Filter by tab (transaction type)
    if (tabValue === 1) {
      filtered = filtered.filter((t) => t.transactionType === "PURCHASE")
    } else if (tabValue === 2) {
      filtered = filtered.filter((t) => t.transactionType === "DEPOSIT")
    }

    // Filter by search term (ID or payment ID)
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.id.toString().includes(searchTerm) ||
          (t.paymentId && t.paymentId.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Filter by date
    const now = new Date()
    if (dateFilter === "today") {
      filtered = filtered.filter((t) => {
        const date = new Date(t.createAt)
        return date.toDateString() === now.toDateString()
      })
    } else if (dateFilter === "week") {
      const weekAgo = new Date()
      weekAgo.setDate(now.getDate() - 7)
      filtered = filtered.filter((t) => {
        const date = new Date(t.createAt)
        return date >= weekAgo
      })
    } else if (dateFilter === "month") {
      const monthAgo = new Date()
      monthAgo.setMonth(now.getMonth() - 1)
      filtered = filtered.filter((t) => {
        const date = new Date(t.createAt)
        return date >= monthAgo
      })
    }

    return filtered
  }, [transactions, tabValue, searchTerm, dateFilter])

  // Calculate pagination
  const paginatedTransactions = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredTransactions.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredTransactions, page, rowsPerPage])

  // Get transaction type display
  const getTransactionTypeDisplay = (type) => {
    if (type === "PURCHASE") {
      return <Chip icon={<ShoppingCart fontSize="small" />} label="Mua hàng" color="primary" size="small" />
    } else if (type === "DEPOSIT") {
      return <Chip icon={<AttachMoney fontSize="small" />} label="Nạp tiền" color="success" size="small" />
    } else {
      return <Chip label="Không xác định" color="default" size="small" />
    }
  }

  // Get status display
  const getStatusDisplay = (status) => {
    if (status === 1) {
      return <Chip label="Thành công" color="success" size="small" />
    } else {
      return <Chip label="Thất bại" color="error" size="small" />
    }
  }

  return (
    <Card elevation={3}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <Receipt sx={{ mr: 1 }} />
            <Typography variant="h6">Lịch sử giao dịch</Typography>
            <Badge badgeContent={filteredTransactions.length} color="primary" sx={{ ml: 2 }} />
          </Box>
        }
      />

      <CardContent>
        {/* Filters */}
        <Box sx={{ mb: 3, display: "flex", flexWrap: "wrap", gap: 2 }}>
          <TextField
            placeholder="Tìm theo ID hoặc mã thanh toán"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: "200px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: "150px" }}>
            <InputLabel id="date-filter-label">Thời gian</InputLabel>
            <Select
              labelId="date-filter-label"
              value={dateFilter}
              label="Thời gian"
              onChange={(e) => setDateFilter(e.target.value)}
              startAdornment={<CalendarMonth fontSize="small" sx={{ mr: 1 }} />}
            >
              <MenuItem value="all">Tất cả</MenuItem>
              <MenuItem value="today">Hôm nay</MenuItem>
              <MenuItem value="week">7 ngày qua</MenuItem>
              <MenuItem value="month">30 ngày qua</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: "120px" }}>
            <InputLabel id="rows-per-page-label">Hiển thị</InputLabel>
            <Select
              labelId="rows-per-page-label"
              value={rowsPerPage}
              label="Hiển thị"
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Tabs */}
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tab label="Tất cả" />
          <Tab label="Mua hàng" icon={<ShoppingCart fontSize="small" />} iconPosition="start" />
          <Tab label="Nạp tiền" icon={<AttachMoney fontSize="small" />} iconPosition="start" />
        </Tabs>

        {/* Table */}
        <TableContainer component={Paper} variant="outlined">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Loại giao dịch</TableCell>
                <TableCell>Số tiền</TableCell>
                <TableCell>Phương thức</TableCell>
                <TableCell>Mã thanh toán</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell align="center">Trạng thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{getTransactionTypeDisplay(transaction.transactionType)}</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        color: transaction.transactionType === "DEPOSIT" ? "success.main" : "primary.main",
                      }}
                    >
                      {formatCurrency(transaction.price)}
                    </TableCell>
                    <TableCell>{transaction.method || "—"}</TableCell>
                    <TableCell>{transaction.paymentId || "—"}</TableCell>
                    <TableCell>{formatDate(transaction.createAt)}</TableCell>
                    <TableCell align="center">{getStatusDisplay(transaction.status)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      Không tìm thấy giao dịch nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredTransactions.length / rowsPerPage)}
            page={page}
            onChange={(e, newPage) => setPage(newPage)}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      </CardContent>
    </Card>
  )
}
