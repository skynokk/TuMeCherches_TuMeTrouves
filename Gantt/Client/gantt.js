const socket = io();

socket.emit("connection", "connected");

socket.on("desc", data => $("#gantt_desc").append($("<li>").text(data)));
socket.on("task", data => $("#gantt_task").append($("<li>").text(data)));