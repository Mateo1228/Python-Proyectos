const SHEET_ID = '1fEuJanrInL978dMx33ORjqLDWDuBRPATY8jrZJBjDzU';

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Portfolio Tracker')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getTrades() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  const headers = data[0];
  return data.slice(1).filter(r => r[0] !== '').map(row => {
    const obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function getPrices() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Prices');
  if (!sheet) return {};
  const data = sheet.getDataRange().getValues();
  const prices = {};
  data.slice(1).forEach(row => { if (row[0]) prices[row[0]] = row[1]; });
  return prices;
}

function addTrade(trade) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sheet1');
  sheet.appendRow([trade.id, trade.ticker, trade.broker, trade.shares, trade.price, trade.type, trade.date]);
  return { success: true };
}

function deleteTrade(id) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Sheet1');
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString() === id.toString()) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false };
}

function updatePrice(ticker, price) {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  let sheet = ss.getSheetByName('Prices');
  if (!sheet) {
    sheet = ss.insertSheet('Prices');
    sheet.appendRow(['ticker', 'price']);
  }
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === ticker) {
      sheet.getRange(i + 1, 2).setValue(price);
      return { success: true };
    }
  }
  sheet.appendRow([ticker, price]);
  return { success: true };
}

// Fetches live prices from Yahoo Finance for all given tickers.
// Returns { prices: {TICKER: price}, liveCount: n, totalCount: n }
function fetchLivePrices(tickers) {
  const prices = {};
  let liveCount = 0;

  tickers.forEach(ticker => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
      const response = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (response.getResponseCode() === 200) {
        const json = JSON.parse(response.getContentText());
        const price = json.chart.result[0].meta.regularMarketPrice;
        if (price && price > 0) {
          prices[ticker] = price;
          liveCount++;
        }
      }
    } catch (e) {
      // Fallback to stored price handled client-side
    }
  });

  return { prices, liveCount, totalCount: tickers.length };
}
