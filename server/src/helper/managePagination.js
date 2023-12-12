const setPagination = (count, limit, page) => {
    const pagination = {
        total: Math.ceil(count / limit),
        current: page,
        previous: page - 1 > 0 ? page - 1 : null,
        next: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
      };
    return pagination;
}

module.exports = {setPagination};