const socket = io();


socket.emit("connection", "connected");

$("#addTask").submit(function (e) {
  e.preventDefault();
  socket.emit("name", $("#name").val());
  socket.emit("desc", $("#desc").val());
  socket.emit("start", $("#start").val());
  socket.emit("end", $("#end").val());
  socket.emit("percentageProgress", $("#percentageProgress").val());
  socket.emit("color", $("#color").val());
  socket.emit("linkedTask", $("#linkedTask").val());
  socket.emit("ressources", $("#ressources").val());
  return false;
});

$("#suppressionTache").submit(function (e) {
  e.preventDefault();
  let suppressionId = $("input[name='suppressionTache']:checked").val();
  socket.emit("suppressionId", suppressionId);
});

socket.on("desc", data => $("#gantt_desc").append($("<li>").text(data)));
socket.on("radioId", data => $("#gantt_task").append($('<li><input type="radio" name="suppressionTache" value="' + data +'"> ')))
socket.on("task", data =>
  $("#gantt_task")
    .append($("<li class=\"text-chacher\">").text(chars = data.split(",")))
    .append($("<li>").text(chars[0]))
    .append($("<li class=\"progress-bar\" role=\"progressbar\" style=\"width:"+chars[2]+"%;color: white; position: absolute;\" aria-valuenow="+chars[2]+"; aria-valuemin=\"0\" aria-valuemax=\"100\">").text(chars[2]+"%/100%"))
    .append($("<li class=\"progress-bar\" role=\"progressbar\" style=\"width: 100%;background-color: gray;color: gray;\" aria-valuenow=\"25\" aria-valuemin=\"0\" aria-valuemax=\"100\">").text("..."))
    .append($("</li><button class=\"btn btn-danger btn-js\">Supprimer</button>"))
    .append($("<li>").text(data))
);
/*
socket.on("taskId", data =>
  $("#gantt_task")
    .append($("</li><button class=\"supprimer\" id=\"" + data + "\">Supprimer</button>"))
);*/
