export const success = (res, data, statusCode = 200, message = 'Success') =>
  res.status(statusCode).json({ success: true, message, data });

export const fail = (res, message, statusCode = 400, code = 'BAD_REQUEST') =>
  res.status(statusCode).json({ success: false, code, message });

export const paginate = (res, data, total, page, limit) =>
  res.status(200).json({
    success: true,
    data,
    meta: {
      total,
      page:  +page,
      limit: +limit,
      pages: Math.ceil(total / limit),
    },
  });
