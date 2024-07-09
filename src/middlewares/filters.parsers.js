const LimitOffsetQueryParser = (req, res, next) => {
  const { l, o } = req.query;

  const obj = {
    limit: parseInt(l ?? 30),
    offset: parseInt(o ?? 0),
  };

  req.filters = { ...req.filters, ...obj };
  next();
};

const validPrices = [0.0, 25.0, 50.0, 100.0, 250.0, 500.0, 1000.0];
const validStocks = [0, 25, 50, 100, 250, 1000];

const SearchQueryParser = (req, res, next) => {
  const { q, c, p, v, s, mnd } = req.query;

  const price = p ? (p > 1000.0 ? 1000.0 : p < 0.0 ? 0.0 : p) : 0.0;
  const votes = v ? (v >= 5.0 ? 4.0 : v <= 0.0 ? 0.0 : v) : 0.0;
  const stock = s ? (s >= 1000 ? 1000 : s <= 0 ? 0 : s) : 0;

  const obj = {
    query: q ?? "",
    color: c ?? "",
    price: validPrices.includes(parseFloat(price)) ? parseFloat(price) : 0.0,
    stock: validStocks.includes(parseInt(stock)) ? parseInt(stock) : 0,
    votes: Math.round(votes),
    initialDate: new Date(mnd ?? new Date().getFullYear()).toISOString(),
  };

  req.filters = { ...req.filters, ...obj };

  next();
};

module.exports = {
  LimitOffsetQueryParser,
  SearchQueryParser,
};
