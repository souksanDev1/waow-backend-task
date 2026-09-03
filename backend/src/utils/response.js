const success = (res, data = {}, status = 200, headers = {}) => {
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  return res.status(status).json({
    error: false,
    code: 0,
    message: 'Success',
    data,
  });
};

const fail = (res, code, message, status = 400, data = {}) =>
  res.status(status).json({
    error: true,
    code,
    message,
    data,
  });

module.exports = { success, fail };
