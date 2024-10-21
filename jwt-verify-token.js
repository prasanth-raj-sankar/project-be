import jwt from "jsonwebtoken";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoicHJhc2FudGgiLCJhZ2UiOjQwLCJyb2xlIjoiZGV2ZWxvcGVyIiwiaWF0IjoxNzI2OTA4MzE0LCJleHAiOjE3MjY5OTQ3MTR9.k3GbI4yojdt_Pri3wbd-pez2-B6gxwu_7r6eBCz1AHE";

jwt.verify(token, "fsd58we-t-secret", (err, decodedPayload) => {
  if (err) {
    console.log(err);
  } else {
    console.log(decodedPayload);
  }
});


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiSGVtYW50aCIsImFnZSI6NDAsInJvbGUiOiJkZXZlbG9wZXIiLCJpYXQiOjE3MjY5MDY5MDksImV4cCI6MTcyNjkwNjkxNH0.LwEbhTdwVXlJ9NUCE8dAr-oKm-cc8W3Q3dP3RdmkQz0