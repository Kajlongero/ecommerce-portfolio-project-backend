const WhereId = (id) => ({
  where: {
    id: id,
  },
});

/** Simple where name object for Prisma ORM
 * @param {string } name
 * @returns {object}
 */
const WhereName = (name) => ({
  where: {
    name: {
      equals: name,
    },
  },
});

const WhereUserId = (id) => ({
  where: {
    userId: id,
  },
});

module.exports = { WhereId, WhereName, WhereUserId };
