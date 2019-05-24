function loginByEmail(email, callback) {
  const request = require("request");

  request.get(
    {
      url:
        "https://55qba5ujfh.execute-api.eu-west-1.amazonaws.com/default/get-user/" +
        email
    },
    function(err, response, body) {
      if (err) {
        console.log("Error when retrieving user data from AWS", err);
        return callback(err);
      }
      if (response.statusCode === 401) return callback();

      const user = JSON.parse(body);

      if (!user) {
        console.log("No user data returned from AWS.");
        return callback();
      }

      callback(null, {
        user_id: user._id,
        nickname: user.name,
        email: user.emailAddress
      });
    }
  );
}
