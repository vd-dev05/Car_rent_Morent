//Ở BE: npm install socket.io
//Ở FE: npm install socket.io-client

import { Server } from "socket.io";

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL }, //chỉ cho domain này truy cập, muốn tất cả domain có thể truy cập dùng "*"
    //cors: { origin: "*" }, //chỉ cho domain này truy cập, muốn tất cả domain có thể truy cập dùng "*"
  });

  io.on("connection", (socket) => {
    //io.on: ng dùng truy cập
    //user kết nối với socket
    console.log("Người dùng truy cập", socket.id);
    socket.on("join_room", (userId) => {
      //socket.on: Nhận thông tin từ server hoặc client
      socket.join(userId);
      console.log(`User ${userId} đã tham gia phòng`);
    });

    socket.on("disconect_room", () => {
      console.log("User đã ra khỏi phòng", socket.id);
    });
    // ➕ Thêm sự kiện ngắt kết nối mặc định
    socket.on("disconnect", () => {
      console.log("Người dùng đã ngắt kết nối", socket.id);
    });
  });
};

export { io, initSocket };

//socket.on: Nhận thông tin từ server hoặc client
//io.on: bắt đầu sự kiện
//socket.emit: Gửi thông tin tớsi server hoặc client
//io.emit: gửi cho tất cả mọi người trong room
//io.to(id ông A).emit: =socket.emit

//room: idRoom
//A: gửi (socket.emit)
//Bài của mình là server nhận qua socket.on
//B: Nhận tin (socket.on)
//C
//D
