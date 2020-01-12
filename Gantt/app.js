const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const path = require("path");

app.use(express.static(path.join(__dirname, "Client")));

const MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/gantt";

const bdd = {
  name: "Gantt",
  desc: "Ce projet a pour but d'afficher un diagramme de Gantt",
  daysOff: {
    Mo: true,
    Tu: true,
    We: true,
    Th: true,
    Fr: true,
    Sa: false,
    Su: false
  },
  workingHours: { start: 1491680626329, end: 1491684607029 },
  task: [
    {
      id: 0,
      name: "Creation projet",
      desc: "Creer le back",
      start: 1491680626329,
      end: 1491684607029,
      percentageProgress: 75,
      color: "#fc0202",
      linkedTask: [],
      ressources: []
    },
    {
      id: 1,
      name: "Affichage projet",
      desc: "Creer le front",
      start: 1491680627829,
      end: 1491684608529,
      percentageProgress: 50,
      color: "#fc4545",
      linkedTask: [],
      ressources: []
    }
  ],
  groupTask: [{ name: "Back", start: Date.now(), end: Date.now() }],
  resources: [{ name: "Valentin", cost: 10, type: "humain" }],
  milestones: [{ name: "Jalon1", date: Date.now() }]
}

const gantt =  {
  nameService : "TuMeCherches_TuMeTrouves",
  projects : [{
  name: "Gantt",
  desc: "Ce projet a pour but d'afficher un diagramme de Gantt",
  daysOff: {
    Mo: true,
    Tu: true,
    We: true,
    Th: true,
    Fr: true,
    Sa: false,
    Su: false
  },
  workingHours: { start: 1491680626329, end: 1491684607029 },
  task: [
    {
      id: 0,
      name: "Creation projet",
      desc: "Creer le back",
      start: 1491680626329,
      end: 1491684607029,
      percentageProgress: 75,
      color: "#fc0202",
      linkedTask: [],
      ressources: []
    },
    {
      id: 1,
      name: "Affichage projet",
      desc: "Creer le front",
      start: 1491680627829,
      end: 1491684608529,
      percentageProgress: 50,
      color: "#fc4545",
      linkedTask: [],
      ressources: []
    }
  ],
  groupTask: [{ name: "Back", start: Date.now(), end: Date.now() }],
  resources: [{ name: "Valentin", cost: 10, type: "humain" }],
  milestones: [{ name: "Jalon1", date: Date.now() }]
} ]
};

// const taskData = bdd["task"][0];
// console.log(taskData);

io.on("connection", client => {
  client.on("connection", data => console.log(data));
  client.on("disconnect", function () {
    console.log("user disconnected");
  });


  const socket = require("socket.io-client");
  let clientProject = socket.connect("http://51.15.137.122:18000/", { reconnect: true });

  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    let dbo = db.db("gantt");
    let count = dbo
      .collection("TuMeCherches_TuMeTrouves")
      .find({})
      .count();
    dbo.createCollection("TuMeCherches_TuMeTrouves", function (err, res) {
      if (err) throw err;
    });

    // Ajout d'une collection

    //dbo.collection("TuMeCherches_TuMeTrouves").insertOne(bdd);

    // Création d'une promise pour compter le nombre de task en base de données
    let myPromise = () => {
      return new Promise((resolve, reject) => {
        let count = dbo
          .collection("TuMeCherches_TuMeTrouves")
          .find({})
          .toArray(function (err, data) {
            err ? reject(err) : resolve(data[0]);
          });
      });
    };

    let callMyPromise = async () => {
      let result = await myPromise();
      return result;
    };

    callMyPromise().then(function (result) {
      let tasks = result.task;
      tasks = tasks.length;
    });


    // Recherche du nom et de la description puis envoi vers le front
    dbo
      .collection("TuMeCherches_TuMeTrouves")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        result.forEach(element =>
          io.emit("desc", element.name + " : " + element.desc)
        );
      });


    // Recherche de toutes les données sur les tâches puis envoi vers le front
    callMyPromise().then(function (result) {
      let tasks = result.task;
      tasks = tasks.length;
      dbo
        .collection("TuMeCherches_TuMeTrouves")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          for (let i = 0; i < tasks; i++) {
            result.forEach(element =>
              io.emit(
                "radioId",
                element.task[i].id
              )
            );
            result.forEach(element =>
              io.emit(
                "task",
                element.task[i].name +
                " : " +
                element.task[i].desc +
                ", " +
                element.task[i].start +
                " / " +
                element.task[i].end +
                ", " +
                element.task[i].percentageProgress +
                ", " +
                element.task[i].color
              )
            );/*
            result.forEach(element =>
              io.emit(
                "taskId",
                element.task[i].name
              )
            );*/
          }
        });
    });


    // Ajout d'une tâche dans la bdd
    callMyPromise().then(function (result) {
      let tasks = result.task;
      tasks = tasks.length;
      const taskData = result["task"];
      client.on("name", dataName => {
        client.on("desc", dataDesc => {
          client.on("start", dataStart => {
            client.on("end", dataEnd => {
              client.on("percentageProgress", dataPercentageProgress => {
                client.on("color", dataColor => {
                  client.on("linkedTask", dataLinkedTask => {
                    client.on("ressources", dataRessources => {
                      MongoClient.connect(url, function (err, db) {
                        if (err) throw err;
                        let dataId = tasks;
                        let taskInsert = {
                          id: dataId,
                          name: dataName,
                          desc: dataDesc,
                          start: dataStart,
                          end: dataEnd,
                          percentageProgress: dataPercentageProgress,
                          color: dataColor,
                          linkedTask: dataLinkedTask,
                          ressources: dataRessources
                        };
                        dbo
                          .collection("TuMeCherches_TuMeTrouves")
                          .updateOne(
                            { name: "Gantt" },
                            { $push: { task: taskInsert } }
                          );
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });


    // Modification d'une tâche dans la bdd
    client.on("modificationId", data => {
      console.log(data);
      MongoClient.connect(url, function (err, db) {
        if (err) console.log("Erreur lors de la modification");
        const taskData = bdd["task"][data];
        console.log(taskData);

        /*dbo.collection("TuMeCherches_TuMeTrouves").deleteOne({ "task": taskData }, function(err, res){
          if(err) console.log("Erreur lors de la modification");
          console.log("modification efffectuée");
        })*/
      });
    });


    // Supression d'une tâche dans la bdd
    client.on("suppressionId", data => {
      console.log(data);
      MongoClient.connect(url, function (err, db) {
        if (err) console.log("Erreur lors de la suppression");
        const taskData = bdd["task"][data];
        dbo.collection("TuMeCherches_TuMeTrouves").deleteOne({ "task": taskData }, function(err, res){
          if(err) console.log("Erreur lors de la suppression");
          console.log("Suppression efffectuée");
        })
      });
    });
  });

  clientProject.on('connect', () => {
    console.log('connected')

    // client.emit('needHelp');
    // client.on('info', data => console.log(data));
    clientProject.emit('getServices');
    clientProject.on('servicies', data => console.log(data));
    clientProject.emit('sendUpdate', gantt);
    clientProject.on('projectUpdated ', data => console.log(data));
    // client.on('errorOnProjectUpdate', data => console.log(data));

    clientProject.on('projectUpdated', dataProject =>
    {
        dataProject.forEach(element => { for (let i = 0; i < element.projects[0].task.length; i++) {
          io.emit(
            "taskProject",
            element.projects[0].task[i].name +
            " : " +
            element.projects[0].task[i].desc +
            ", " +
            element.projects[0].task[i].start +
            " / " +
            element.projects[0].task[i].end +
            ", " +
            element.projects[0].task[i].percentageProgress
          )
        }});
    });
  });
});

http.listen(3000);
