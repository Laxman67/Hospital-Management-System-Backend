export const generateToken = (user, message, statusCode, res) => {
  const token = user.generateJsonWebToken();
  const cookieName = user.role === 'Admin' ? 'adminToken' : 'patientToken';

  res
    .status(statusCode) // Status Code
    .cookie(cookieName, token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ), // 10 days
      httpOnly: true,
      // Theses Two Lines are mandatory if you're planning to render on third party hpsting like render
      secure: process.env.NODE_ENV === 'production', //Only use HTTPS in production
      sameSite: 'none', // Allows cross-site requests ✅
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
