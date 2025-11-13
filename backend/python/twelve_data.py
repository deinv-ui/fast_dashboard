import requests
import pandas as pd
import time
import os
from dotenv import load_dotenv

load_dotenv()  

API_KEY = os.getenv("TWELVE_DATA_API_KEY")

def get_malaysian_stocks():
    """Fetch all Malaysian stock symbols from Twelve Data."""
    url = f"https://api.twelvedata.com/stocks?exchange=MYX&apikey={API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    
    if "data" not in data:
        print("No stock data returned:", data)
        return pd.DataFrame()
    
    df = pd.DataFrame(data["data"])
    return df[["symbol"]]

def fetch_price(symbol: str):
    """Fetch latest stock price."""
    url = f"https://api.twelvedata.com/price?symbol={symbol}&apikey={API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    
    if "price" not in data:
        print(f"Error fetching price for {symbol}: {data}")
        return None
    
    return float(data["price"])

def fetch_dividends(symbol: str):
    """Fetch historical dividend data."""
    url = f"https://api.twelvedata.com/dividends?symbol={symbol}&apikey={API_KEY}"
    resp = requests.get(url)
    data = resp.json()
    
    if "dividends" not in data:
        return pd.DataFrame()
    
    df = pd.DataFrame(data["dividends"])
    return df

if __name__ == "__main__":
    # Step 1: Get all Malaysian stock symbols
    df_stocks = get_malaysian_stocks()
    symbols = df_stocks["symbol"].tolist()
    print(f"Found {len(symbols)} KLSE stocks.")

    # Step 2: Fetch price, latest dividend, and calculate dividend yield
    all_data = []
    for i, symbol in enumerate(symbols, start=1):
        print(f"[{i}/{len(symbols)}] Processing {symbol}...")
        price = fetch_price(symbol)
        dividends = fetch_dividends(symbol)
        latest_div = None
        latest_date = None
        div_yield = None
        
        if not dividends.empty and price:
            # Sort by date descending and take latest dividend
            dividends_sorted = dividends.sort_values("date", ascending=False)
            latest_div = float(dividends_sorted.iloc[0]["dividend"])
            latest_date = dividends_sorted.iloc[0]["date"]
            # Calculate dividend yield (%)
            div_yield = round((latest_div / price) * 100, 2)

        all_data.append({
            "symbol": symbol,
            "price": price,
            "latest_dividend": latest_div,
            "dividend_date": latest_date,
            "dividend_yield_%": div_yield
        })
        
        # Sleep 0.5s between requests to avoid hitting rate limits
        time.sleep(0.5)

    # Step 3: Convert to DataFrame and sort by dividend yield descending
    df_result = pd.DataFrame(all_data)
    df_result = df_result.sort_values(by="dividend_yield_%", ascending=False)
    
    print("\n=== KLSE DivTracker (Sorted by Dividend Yield) ===")
    print(df_result.head(20))  # show first 20 rows

    # Step 4: Save to CSV
    df_result.to_csv("klse_divtracker.csv", index=False)
    print("\nSaved data to klse_divtracker.csv")
