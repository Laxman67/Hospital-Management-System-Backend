export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

  res
    .status(statusCode)
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      sameSite: 'none',
  secure: true, // Ensures it's only sent over HTTPS
  httpOnly: true, // Prevents JavaScript access to the cookie

    })
    .json({
      success: true,
      message,
      user,
      token,
    });
};
