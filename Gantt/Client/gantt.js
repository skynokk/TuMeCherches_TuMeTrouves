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
  let suppressionId = $("input[name='tache']:checked").val();
  socket.emit("suppressionId", suppressionId);
});

$("#modificationTache").submit(function (e) {
  e.preventDefault();
  let modificationId = $("input[name='tache']:checked").val();
  socket.emit("modificationId", modificationId);
});

socket.on("desc", data => $("#gantt_desc").append($("<li>").text(data)));
socket.on("radioId", data => $("#gantt_task").append($('<li><input type="radio" name="tache" value="' + data +'"> ')))
socket.on("task", data =>
  $("#gantt_task")
    .append($("<li class=\"text-chacher\">").text(chars = data.split(",")))
    .append($("<li>").text(chars[0]))
    .append($("<li class=\"progress-bar\" role=\"progressbar\" style=\"width:"+chars[2]+"%;color: white; position: absolute;\" aria-valuenow="+chars[2]+"; aria-valuemin=\"0\" aria-valuemax=\"100\">").text(chars[2]+"%/100%"))
    .append($("<li class=\"progress-bar\" role=\"progressbar\" style=\"width: 100%;background-color: gray;color: gray;\" aria-valuenow=\"25\" aria-valuemin=\"0\" aria-valuemax=\"100\">").text("..."))
    .append($("<li>").text(data))
);
/*
socket.on("taskId", data =>
  $("#gantt_task")
    .append($("</li><button class=\"supprimer\" id=\"" + data + "\">Supprimer</button>"))
);*/
