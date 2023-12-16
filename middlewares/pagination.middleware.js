const paginateResults = (model) => {
  return async (req, res, next) => {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const options = {
      page,
      limit,
    };

    const { docs, totalDocs, hasNextPage, hasPrevPage, nextPage, prevPage } =
      await model.paginate({ user_id: userId }, options);

    const response = {
      totalDocs,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
      results: docs,
    };

    res.paginatedResults = response;
    next();
  };
};

module.exports = paginateResults;
