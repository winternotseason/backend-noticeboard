const mongoose = require("mongoose");

const connect = () => {
  if (process.env.NODE_ENV !== "production") {
    mongoose.set("debug", true);
  }
  mongoose
    .connect("mongodb://root:winter@localhost:27017/admin", {
      dbName: "users",
    })
    .then(console.log("몽고디비 연결 성공"))
    .catch((error) => {
      console.log(error, "몽고디비 연결 에러");
    });
};

mongoose.connection.on("error", (error) => {
  console.error("연결 에러");
});

mongoose.connection.on("disconnected", () => {
  console.error("몽고디비 연결이 끊어졌습니다. 연결을 재시도 합니다");
  connect();
});

module.exports = connect;
