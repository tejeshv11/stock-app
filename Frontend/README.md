# Stock Tracker App

A React Native/Expo app for tracking stocks, managing watchlists, and viewing real-time stock data with interactive charts.

## 🚀 Features

- **Stock Search**: Search for stocks by symbol or company name
- **Watchlist Management**: Add/remove stocks from your personal watchlist
- **Real-time Stock Data**: View current prices, changes, and percentage changes
- **Interactive Charts**: Visualize stock price history with line charts
- **Cross-platform**: Works on iOS, Android, and Web

## 📱 Pages & Navigation

- **Home Tab** (`/`): Main dashboard with stock search and watchlist
- **Explore Tab** (`/explore`): Additional exploration features
- **Stock Detail Page** (`/stock/[symbol]`): Detailed view for individual stocks

## 🔧 API Endpoints

The app connects to a backend server running on `localhost:9000`.

### Stock Search

- **GET** `/api/stocks/search?query={symbol}` - Search for stocks

### Stock Details

- **GET** `/api/stocks/{symbol}/details` - Get current stock data
- **GET** `/api/stocks/{symbol}/history` - Get historical price data

### Watchlist Management

- **GET** `/api/watchlist` - Retrieve user's watchlist
- **POST** `/api/watchlist` - Add stock to watchlist
- **DELETE** `/api/watchlist/{symbol}` - Remove stock from watchlist

## 🛠️ Technology Stack

- **Frontend**: React Native with Expo
- **Routing**: Expo Router (file-based routing)
- **Charts**: react-native-chart-kit
- **State Management**: React Hooks

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ (recommended: Node.js 24)
- Backend server running on localhost:9000

### Installation Steps

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm start
   ```

3. **Run on your preferred platform**
   - **Web**: Press `w` or visit `http://localhost:8082`
   - **iOS**: Press `i` (requires iOS Simulator)
   - **Android**: Press `a` (requires Android Emulator)
   - **Mobile**: Scan QR code with Expo Go app

## 🎯 Usage Guide

### Searching for Stocks

1. Open the app and go to the Home tab
2. Enter a stock symbol (e.g., "AAPL", "GOOGL") in the search box
3. Press "Search" or hit Enter
4. View search results and add stocks to your watchlist

### Managing Watchlist

1. **Add to Watchlist**: Click "Add" button next to any stock in search results
2. **View Watchlist**: Your watchlist appears below the search section
3. **Remove from Watchlist**: Click "Remove" button next to any watchlist item
4. **View Stock Details**: Tap on any watchlist item to see detailed view

### Viewing Stock Details

1. Navigate to a stock detail page (from watchlist or direct URL)
2. View current price and change information
3. Scroll down to see the interactive price history chart
4. Chart shows the last 7 days of price data

## Troubleshooting

### Common Issues

1. **"Connection Error" messages**

   - Ensure your backend server is running on `localhost:9000`

2. **"Unmatched Route" errors**

   - Make sure you're using Node.js 22+
   - Restart the development server after making changes
