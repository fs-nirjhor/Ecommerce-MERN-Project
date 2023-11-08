const setAccessTokenCookie = (res, accessToken) => {
     res.cookie("access_token", accessToken, {
      maxAge: 5 * 60 * 1000, // 5 minute
      httpOnly: true,
      //TODO: secure is comment out for development purpose. secure cookies not work in postman but work in browser well. need 4 change in this file
      //secure: true, // not include in headers
      sameSite: "none", // call from multiple addresses
    });
}
const setRefreshTokenCookie = (res, refreshToken) => {
     res.cookie("refresh_token", refreshToken, {
       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
       httpOnly: true,
       //secure: true,
       sameSite: "none",
     });
}

module.exports = {setAccessTokenCookie, setRefreshTokenCookie}