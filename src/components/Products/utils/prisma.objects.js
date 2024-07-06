const SelectProduct = {
  select: {
    id: true,
    name: true,
    price: true,
    description: true,
    stock: true,
    weight: true,
    dimensions: true,
    votes: true,
    votesAverage: true,
    createdAt: true,
    Images: {
      select: {
        id: true,
        uri: true,
      },
    },
  },
};

const SearchWithFilters = (filters) => ({
  AND: [
    { active: true },
    { name: { search: query } },
    { color: { contains: filters.color } },
    { price: { gte: filters.price } },
    { votesAverage: { gte: filters.votes } },
    { stock: { gte: filters.stock } },
    {
      createdAt: {
        gte: filters.initialDate,
        lte: filters.lastDate,
      },
    },
  ],
});

module.exports = { SelectProduct, SearchWithFilters };
