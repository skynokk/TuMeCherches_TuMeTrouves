const socket = io();

socket.emit("connection", "connected");

socket.on("gantt", data => $("#gantt").append($("<li>").text(data)));

socket.on("init gantt");
