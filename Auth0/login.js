function login(email, password, callback) {
  const request = require("request");
  const bcrypt = require("bcrypt@3.0.0");

  request.get(
    {
      url:
        "https://55qba5ujfh.execute-api.eu-west-1.amazonaws.com/default/get-user/" +
        email
    },
    function(err, response, body) {
      if (err) {
        console.error("Error when retrieving user data from AWS", err);
        return callback(err);
      }
      if (response.statusCode === 401) return callback();
      const user = JSON.parse(body);

      if (!user) {
        console.log("No user data returned from AWS.");
        return callback();
      }

      if (!user.credential) {
        console.log("No credential returned with user");
        return callback();
      }

      bcrypt.compare(password, user.credential).then(function(res) {
        if (res) {
          callback(null, {
            user_id: user._id,
            nickname: user.name,
            email: user.emailAddress
          });
        } else {
          callback();
        }
      });
    }
  );
}
