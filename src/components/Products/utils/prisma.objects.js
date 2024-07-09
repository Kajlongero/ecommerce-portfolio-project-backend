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
    coverImageId: true,
    Images: {
      select: {
        id: true,
        uri: true,
        width: true,
        height: true,
      },
    },
  },
};

const SearchWithFilters = (filters) => ({
  AND: [
    { active: true },
    { name: { search: filters.query.split(" ").join(" & ") } },
    { color: filters.color ? { contains: filters.color } : undefined },
    { price: { gte: filters.price } },
    { votesAverage: { gte: filters.votes } },
    { stock: { gte: filters.stock } },
    {
      createdAt: {
        gte: filters.initialDate,
      },
    },
  ],
});

module.exports = { SelectProduct, SearchWithFilters };
