export const successResponse = (
  data: unknown,
  message = "Success"
) => {
  return {
    success: true,
    message,
    data,
  };
};

export const errorResponse = (
  message = "Something went wrong",
  errors: unknown = null
) => {
  return {
    success: false,
    message,
    errors,
  };
};