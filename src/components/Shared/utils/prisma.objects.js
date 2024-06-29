/** Simple where id object for Prisma ORM
 * @param {string} id
 * @returns {{
 *  where: {
 *    id: string
 *  }
 * }}
 */
const WhereId = (id) => ({
  where: {
    id: id,
  },
});

/** Simple where name is equal object for Prisma ORM
 * @param {string } name
 * @returns {{
 *  where: {
 *    name: {
 *      equals: string
 *    }
 *  }
 * }}
 */
const WhereName = (name) => ({
  where: {
    name: {
      equals: name,
    },
  },
});

/** Simple where userId object for Prisma ORM
 * @param {string} id
 * @returns {{
 *  where: {
 *    userId: string
 *  }
 * }}
 */
const WhereUserId = (id) => ({
  where: {
    userId: id,
  },
});

module.exports = { WhereId, WhereName, WhereUserId };
