const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api"

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Login failed")
  }
  return data
}

export const registerUser = async (name, email, password) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
    })
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Registration failed")
  }
  return data
}


const getAuthHeaders = () => {

  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}


export const getDashboardSummary = async () => {

  const response = await fetch(`${API_URL}/dashboard/summary`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch dashboard summary")
  }

  return data
}


export const getExpensesByCategory = async () => {

  const response = await fetch(`${API_URL}/dashboard/expense-by-category`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch expense categories")
  }
  return data
}


export const getMonthlySummary = async () => {

  const response = await fetch(`${API_URL}/dashboard/monthly-summary`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch monthly summary")
  }
  return data
}


export const getRecentTransactions = async () => {
  const response = await fetch(`${API_URL}/dashboard/recent-transactions`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recent transactions")
  }
  return data
}


export const createPlaidLinkToken = async () => {

  const response = await fetch(`${API_URL}/plaid/create-link-token`,
    {
      method: "POST",
      headers: getAuthHeaders(),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to create Plaid link token")
  }
  return data
}


export const exchangePlaidPublicToken = async (public_token) => {

  const response = await fetch(`${API_URL}/plaid/exchange-token`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        public_token,
      }),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message ||"Failed to exchange Plaid public token")
  }
  return data
}


export const getAccounts = async () => {

  const response = await fetch(`${API_URL}/accounts`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  )
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch accounts")
  }
  return data
}

export const getTransactions = async () => {

  const response = await fetch(`${API_URL}/transactions`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch transactions")
  }
  return data
}


export const addTransaction = async (transactionData) => {

  const response = await fetch(`${API_URL}/transactions`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(transactionData),
    }
  )

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message ||"Failed to add transaction")
  }
  return data
}


export const updateTransaction = async (transactionId,transactionData) => {

  const response = await fetch(`${API_URL}/transactions/${transactionId}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(transactionData),
    }
  )
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message ||"Failed to update transaction")
  }
  return data
}


export const deleteTransaction = async (transactionId) => {

  const response = await fetch(`${API_URL}/transactions/${transactionId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  )
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.message ||"Failed to delete transaction")
  }
  return data
}


export const getBudget = async (month) => {

  const response = await fetch(`${API_URL}/budgets?month=${month}`, {
    method: "GET",
    headers: getAuthHeaders()
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch budget")
  }
  return data
}

export const saveBudget = async (month, limit) => {

  const response = await fetch(`${API_URL}/budgets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      month,
      limit
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to save budget")
  }
  return data
}

export const deleteBudget = async (budgetId) => {

  const response = await fetch(`${API_URL}/budgets/${budgetId}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete budget")
  }
  return data
}