var validator = require("validator");
var in_array = require("in_array");
var nodeMailer = require("nodemailer");
const accountSid = "ACfb02facb814d07ce93bb9cc6a3cf646b";
const authToken = "591847b1a33727ad8df642b0c85ed690";
const client = require("twilio")(accountSid, authToken);
var os = require("os");
var path = require("path");
require("dotenv").config();
var uniqid = require("uniqid");

var self = (module.exports = {
  getFileName: function (fileObject) {
    $extension = path.extname(fileObject.name);
    $fileName = uniqid() + "" + $extension;
    return $fileName;
  },
  getUrl: function () {
    return process.env.NODE_URL;
  },
  getUploadsUrl: function () {
    return process.env.NODE_UPLOADS_URL;
  },
  getFrontEndUrl: function () {
    return process.env.REACT_URL;
  },
  getAppPath: function () {
    return path.dirname(require.main.filename);
  },
  registerValidator: function (data) {
    let $errors = {};

    let keys = Object.keys(data);

    let requiredKeys = ["password", "username", "email", "mobile_number"];

    for ($j = 0; $j < requiredKeys.length; $j++) {
      $requiredKey = requiredKeys[$j];

      if (!in_array($requiredKey, keys)) {
        $errors[$requiredKey] = $requiredKey + " is required";
      }
    }

    if (keys.length > 0) {
      for ($i = 0; $i < keys.length; $i++) {
        $key = keys[$i];

        $value = data[$key];

        if ($key == "password" || $key == "username") {
          if (validator.isEmpty($value)) {
            $errors[$key] = $key + " is required";
          }
        }
      }
      return Object.keys($errors).length > 0 ? $errors : false;
    }
  },
  loginValidator: function (data) {
    let $errors = {};

    let keys = Object.keys(data);

    let requiredKeys = ["mobile_number", "email", "password"];

    for ($j = 0; $j < requiredKeys.length; $j++) {
      $requiredKey = requiredKeys[$j];

      if (!in_array($requiredKey, keys)) {
        $errors[$requiredKey] = $requiredKey + " is required";
      }
    }

    if (keys.length > 0) {
      for ($i = 0; $i < keys.length; $i++) {
        $key = keys[$i];
        $value = data[$key];

        switch ($key) {
          case "password":
            if (validator.isEmpty($value)) {
              $errors[$key] = $key + " is required";
            }
            break;

          default:
            break;
        }
      }
      return Object.keys($errors).length > 0 ? $errors : false;
    }
  },

  forgotValidator(data) {
    let $errors = {};

    let keys = Object.keys(data);

    let requiredKeys = ["email", "mobile_number"];

    for ($j = 0; $j < requiredKeys.length; $j++) {
      $requiredKey = requiredKeys[$j];

      if (!in_array($requiredKey, keys)) {
        $errors[$requiredKey] = $requiredKey + " is required";
      }
    }

    return Object.keys($errors).length > 0 ? $errors : false;
  },
  resetValidator(data) {
    let $errors = {};

    let keys = Object.keys(data);

    let requiredKeys = ["user_id", "password", "password_confirmation", "otp"];

    for ($j = 0; $j < requiredKeys.length; $j++) {
      $requiredKey = requiredKeys[$j];

      if (!in_array($requiredKey, keys)) {
        $errors[$requiredKey] = $requiredKey + " is required";
      }
    }

    if (keys.length > 0) {
      for ($i = 0; $i < keys.length; $i++) {
        $key = keys[$i];

        $value = data[$key];

        if (validator.isEmpty($value)) {
          $errors[$key] = $key + " is required";
        }
      }
      return Object.keys($errors).length > 0 ? $errors : false;
    }
  },
  generateOTP() {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  },
  otpValidator(data) {
    let $errors = {};

    let keys = Object.keys(data);

    let requiredKeys = ["mobile_number"];

    for ($j = 0; $j < requiredKeys.length; $j++) {
      $requiredKey = requiredKeys[$j];

      if (!in_array($requiredKey, keys)) {
        $errors[$requiredKey] = $requiredKey + " is required";
      }
    }

    if (keys.length > 0) {
      for ($i = 0; $i < keys.length; $i++) {
        $key = keys[$i];

        $value = data[$key];

        if ($key == "mobile_number") {
          if (!validator.isMobilePhone($value, "en-US")) {
            $errors[$key] = $key + " is not valid";
          }
        }
      }
      return Object.keys($errors).length > 0 ? $errors : false;
    }
  },
  otpV2Validator(data) {
    let $errors = {};

    let keys = Object.keys(data);

    let requiredKeys = ["user_id", "otp"];

    for ($j = 0; $j < requiredKeys.length; $j++) {
      $requiredKey = requiredKeys[$j];

      if (!in_array($requiredKey, keys)) {
        $errors[$requiredKey] = $requiredKey + " is required";
      }
    }

    if (keys.length > 0) {
      for ($i = 0; $i < keys.length; $i++) {
        $key = keys[$i];

        $value = data[$key];

        if ($key == "user_id") {
          if (validator.isEmpty($value)) {
            $errors[$key] = $key + " is not valid";
          }
        }
        if ($key == "otp") {
          if (validator.isEmpty($value)) {
            $errors[$key] = $key + " is required";
          }
        }
      }
      return Object.keys($errors).length > 0 ? $errors : false;
    }
  },
  isValid(obj) {
    if (obj === null) return false;
    if (obj === undefined) return false;

    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return true;
    }
    return false;
  },

  sendEmail(mailOptions) {
    let transporter = nodeMailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "raghveer07@gmail.com",
        pass: "reavy@143",
      },
    });

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return false;
      }
      return true;
    });
  },
  sendVerificationEmail($user, $otp = 0) {
    $verficationUrl =
      self.getFrontEndUrl() + "/verify/" + $user.verification_code + "/email";

    $html =
      '<table style="width:620px;margin:0 auto;background: #f5f5f5;padding: 20px;font-family: Lato,sans-serif;"><tbody>';
    $html +=
      '<tr><td><h1 style="color: #1f272a !important;margin-bottom: 0px;letter-spacing: 1px;font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;">Hello !</h1></td>';
    $html += "</tr>";
    $html += '<tr style="margin: 5px 0;display: inline-block;">';
    $html +=
      '<td style="font-size:17px;color: #1f272a !important;margin-bottom: 0px;letter-spacing: 1px;font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;"><h1 style = "text-align:center">' +
      $otp +
      "</h1> is your verification code.Do not share with anyone</td>";
    $html += "</tr>";
    $html += '<tr style="margin: 5px 0;display: inline-block;">';
    $html +=
      '<td style="font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color: #1f272a !important;text-align:right;font-size: 17px;color:#999;font-weight:400;">If you already verified your email, no further action is required.</td>';
    $html += "</tr>";
    $html += "<tr>";
    $html +=
      '<td style="font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color: #1f272a !important;text-align:right;font-size: 17px;color:#999;font-weight:400;">Regards,<br>TvLakey</td>';
    $html += "</tr></tbody></table>";

    //$user.email = 'rahul1.eminence@gmail.com';

    $mailOptions = {
      from: '"TvLakay" <info@TvLakay.com>',
      to: $user.email,
      subject: "Verify Email",
      html: $html,
    };
    self.sendEmail($mailOptions);
  },
  sendForgotEmail($token, $email) {
    $html =
      '<table style="width:620px;margin:0 auto;background: #f5f5f5;padding: 20px;font-family: Lato,sans-serif;"><tbody>';
    $html +=
      '<tr><td><h1 style="color: #1f272a !important;margin-bottom: 0px;letter-spacing: 1px;font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;">Hello !</h1></td>';
    $html += "</tr>";
    $html += '<tr style="margin: 5px 0;display: inline-block;">';
    $html +=
      '<td style="font-size:17px;color: #1f272a !important;margin-bottom: 0px;letter-spacing: 1px;font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;"><h1 style = "text-align:center">' +
      $token +
      "</h1> is your verification code.Do not share with anyone</td>";
    $html += "</tr>";
    $html += '<tr style="margin: 5px 0;display: inline-block;">';
    $html +=
      '<td style="font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color: #1f272a !important;text-align:right;font-size: 17px;color:#999;font-weight:400;">If you did not request a password reset, no further action is required.</td>';
    $html += "</tr>";
    $html += "<tr>";
    $html +=
      '<td style="font-family: Google Sans,Roboto,RobotoDraft,Helvetica,Arial,sans-serif;color: #1f272a !important;text-align:right;font-size: 17px;color:#999;font-weight:400;">Regards,<br>TvLakey</td>';
    $html += "</tr></tbody></table>";

    //$email = 'rahul1.eminence@gmail.com';

    $mailOptions = {
      from: '"TvLakay" <info@TvLakay.com>',
      to: $email,
      subject: "Reset Password",
      html: $html,
    };

    self.sendEmail($mailOptions);
  },

  sendMessage($mobileNumber, $otp) {
    client.messages.create(
      {
        body:
          "Your TvLakay one time password is " +
          $otp +
          " .Please do not share with anyone",
        from: "+12054319828",
        //  to: '+16802109685'
        to: `+16${$mobileNumber}`,
      },
      function (err, message) {
        if (err) {
          return err.message;
        } else {
          return message.sid;
        }
      }
    );
  },
  isDefined($string) {
    if ($string !== "undefined" || $string !== "null") {
      return true;
    }
    return false;
  },
  profileValidator(data, $type = 1) {
    switch ($type) {
      case 1:
        var requiredKeys = ["username"];
        break;
      case 2:
        var requiredKeys = ["email"];
        break;
      case 3:
        var requiredKeys = ["email", "otp"];
        break;
      case 4:
        var requiredKeys = ["mobile_number"];
        break;
      case 5:
        var requiredKeys = ["mobile_number", "otp"];
        break;
      case 6:
        var requiredKeys = [
          "old_password",
          "password",
          "password_confirmation",
        ];
        break;
      default:
        break;
    }

    let $errors = {};

    let keys = Object.keys(data);

    for ($j = 0; $j < requiredKeys.length; $j++) {
      $requiredKey = requiredKeys[$j];

      if (!in_array($requiredKey, keys)) {
        $errors[$requiredKey] = $requiredKey + " is required";
      }
    }

    if (keys.length > 0) {
      for ($i = 0; $i < keys.length; $i++) {
        $key = keys[$i];

        $value = data[$key];

        if (validator.isEmpty($value)) {
          $errors[$key] = $key + " is required";
        }
        if ($key == "email") {
          if (!validator.isEmail($value)) {
            $errors[$key] = "Not a valid email address";
          }
        }
        if ($key == "mobile_number") {
          if (!validator.isMobilePhone($value)) {
            $errors[$key] = "Not a valid mobile number";
          }
        }
      }

      return Object.keys($errors).length > 0 ? $errors : false;
    }
  },
  trendingValidator: function (data) {
    let $errors = {};

    let keys = Object.keys(data);

    let requiredKeys = ["channel_id"];

    for ($j = 0; $j < requiredKeys.length; $j++) {
      $requiredKey = requiredKeys[$j];

      if (!in_array($requiredKey, keys)) {
        $errors[$requiredKey] = $requiredKey + " is required";
      }
    }

    if (keys.length > 0) {
      for ($i = 0; $i < keys.length; $i++) {
        $key = keys[$i];

        $value = data[$key];

        if (validator.isEmpty(data[$key])) {
          $errors[$key] = $key + " is required";
        }
      }
      return Object.keys($errors).length > 0 ? $errors : false;
    }
  },
  statValidator: function (data) {
    let $errors = {};

    let keys = Object.keys(data);

    let requiredKeys = ["channel_id", "user_id", "ad_id"];

    for ($j = 0; $j < requiredKeys.length; $j++) {
      $requiredKey = requiredKeys[$j];

      if (!in_array($requiredKey, keys)) {
        $errors[$requiredKey] = $requiredKey + " is required";
      }
    }

    if (keys.length > 0) {
      for ($i = 0; $i < keys.length; $i++) {
        $key = keys[$i];

        $value = data[$key];

        if (validator.isEmpty(data[$key])) {
          $errors[$key] = $key + " is required";
        }
      }
      return Object.keys($errors).length > 0 ? $errors : false;
    }
  },
});
