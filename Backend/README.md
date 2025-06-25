# Stock Watchlist App - Backend API

A Node.js/Express backend API for a daily stocks watchlist application that allows users to search for stocks, get real-time quotes, view historical data, and manage a personal watchlist.

## 🚀 Features

- **Stock Search**: Search for stocks by company name or symbol using Alpha Vantage API
- **Real-time Quotes**: Get current stock prices and market data
- **Historical Data**: View 7-day price history for any stock
- **Watchlist Management**: Add, view, and remove stocks from your personal watchlist
- **Caching**: Built-in caching system to optimize API calls and reduce rate limiting
- **MongoDB Integration**: Persistent storage for watchlist data
- **CORS Enabled**: Ready for frontend integration

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Axios** - HTTP client for API calls
- **Node-Cache** - In-memory caching
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## 📋 Prerequisites

- Node.js (v22 or higher)
- MongoDB database
- Alpha Vantage API key

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/TheAuror11/stock-app
   cd Backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the server**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

The server will start on `http://localhost:8000` (or the port specified in your `.env` file).

## 📚 API Endpoints

### Stock Search

**GET** `/stocks/search?query={search_term}`

Search for stocks by company name or symbol.

**Query Parameters:**

- `query` (required): Company name or stock symbol to search for

**Example:**

```bash
GET /stocks/search?query=Apple
```

**Response:**

```json
[
  {
    "1. symbol": "AAPL",
    "2. name": "Apple Inc",
    "3. type": "Equity",
    "4. region": "United States",
    "5. marketOpen": "09:30",
    "6. marketClose": "16:00",
    "7. timezone": "UTC-04",
    "8. currency": "USD",
    "9. matchScore": "1.0000"
  }
]
```

### Stock Details

**GET** `/stocks/{symbol}`

Get real-time quote information for a specific stock symbol.

**Path Parameters:**

- `symbol` (required): Stock symbol (e.g., AAPL, GOOGL)

**Example:**

```bash
GET /stocks/AAPL
```

**Response:**

```json
{
  "01. symbol": "AAPL",
  "02. open": "150.0000",
  "03. high": "152.5000",
  "04. low": "149.8000",
  "05. price": "151.2000",
  "06. volume": "12345678",
  "07. latest trading day": "2024-01-15",
  "08. previous close": "149.5000",
  "09. change": "1.7000",
  "10. change percent": "1.1371%"
}
```

### Stock History

**GET** `/stocks/{symbol}/history`

Get 7-day price history for a specific stock symbol.

**Path Parameters:**

- `symbol` (required): Stock symbol (e.g., AAPL, GOOGL)

**Example:**

```bash
GET /stocks/AAPL/history
```

**Response:**

```json
[
  {
    "date": "2024-01-15",
    "price": "151.2000"
  },
  {
    "date": "2024-01-14",
    "price": "149.5000"
  }
]
```

### Watchlist Management

#### Add to Watchlist

**POST** `/watchlist`

Add a stock to your personal watchlist.

**Request Body:**

```json
{
  "symbol": "AAPL"
}
```

**Example:**

```bash
POST /watchlist
Content-Type: application/json

{
  "symbol": "AAPL"
}
```

#### Get Watchlist

**GET** `/watchlist`

Retrieve all stocks in your watchlist.

**Example:**

```bash
GET /watchlist
```

#### Remove from Watchlist

**DELETE** `/watchlist/{symbol}`

Remove a stock from your watchlist.

**Path Parameters:**

- `symbol` (required): Stock symbol to remove

**Example:**

```bash
DELETE /watchlist/AAPL
```

## 🔧 Error Handling

The API includes comprehensive error handling for common scenarios:

- **400 Bad Request**: Missing required parameters
- **404 Not Found**: Stock symbol not found
- **429 Too Many Requests**: API rate limit exceeded
- **500 Internal Server Error**: Server-side errors

**Error Response Format:**

```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```
