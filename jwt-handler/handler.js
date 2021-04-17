'use strict';

require("dotenv").config({
  path: process.cwd() + '/.env'
})
const jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;

module.exports = async (event, context) => {
  if (event.method == 'GET' || event.method == 'get') {
    if (event.headers && event.headers.authorization && String(event.headers.authorization).startsWith('Bearer')) {
      try {
        var decoded = jwt.verify(String(event.headers.authorization).split(' ')[1], jwt_secret);
        return context
          .status(200)
          .headers({
            "Content-type": "application/json"
          })
          .succeed({
            status: true,
            message: "JWT Decoded Successfully",
            decoded: decoded
          });
      } catch (err) {
        return context
          .status(422)
          .headers({
            "Content-type": "application/json"
          })
          .succeed({
            status: false,
            message: "Invalid jwt credentials",
          });
      }
    } else {
      return context
        .status(400)
        .headers({
          "Content-type": "application/json"
        })
        .succeed({
          status: false,
          message: "Invalid Authorization header!",
        });
    }
  } else if (event.method == 'POST' || event.method == 'post') {
    if (event.body.data) {
      try {
        const payload = JSON.parse(event.body.data);
        var token = jwt.sign(payload, jwt_secret);
        return context
          .status(200)
          .headers({
            "Content-type": "application/json"
          })
          .succeed({
            status: true,
            message: "JWT Signed Successfully",
            token: token
          });
      } catch (error) {
        return context
          .status(422)
          .headers({
            "Content-type": "application/json"
          })
          .succeed({
            status: false,
            message: "Invalid jwt payload data."
          });
      }
    } else {
      return context
        .status(400)
        .headers({
          "Content-type": "application/json"
        })
        .succeed({
          status: false,
          message: "Please ensure data parameter to encode jwt."
        });
    }
  } else {
    return context
      .status(400)
      .headers({
        "Content-type": "application/json"
      })
      .succeed({
        status: false,
        message: "Invalid request type."
      });
  }
}