const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const socket = require('socket.io-client');
let client = socket.connect( 'http://51.15.137.122:18000/', {reconnect: true});

const path = require("path");

app.use(express.static(path.join(__dirname, "Client")));

const MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/gantt";

let gantt = {name : "Gantt", 
desc : "Ce projet a pour but d'afficher un diagramme de Gantt", 
daysOff : { Mo : true, Tu : true,  We : true, Th : true, Fr : true, Sa : false, Su : false },
workingHours : { start : 8.30, end : 16.30 }, 
task : [{ id : 0, name : "Creation projet", desc : "Creer le back", start : 1491680626329, end : 1491684607029, percentageProgress : 75, color  : "#fc0202", linkedTask : [], ressources : [] },
{ id : 1, name : "Affichage projet", desc : "Creer le front", start : 1491680627829, end : 1491684608529, percentageProgress : 50, color  : "#fc4545", linkedTask : [], ressources : [] }], 
groupTask : [{ name : "Back", start : Date.now(), end : Date.now() }], 
resources : [{ name : "Valentin", cost : 10, type : "humain" }], 
milestones : [{ name : "Jalon1", date : Date.now() }] };

io.on("connection", client => {
  client.on("connection", data => console.log(data));
  client.on("disconnect", function() {
    console.log("user disconnected");
  });

MongoClient.connect(url, {useUnifiedTopology: true}, function(err, db) {
    if (err) throw err;
    let dbo = db.db("gantt");
    let count = dbo.collection("TuMeCherches_TuMeTrouves").find({}).count();
    dbo.createCollection("TuMeCherches_TuMeTrouves", function(err, res) {
      if (err) throw err;
    });

    // Ajout d'un objet si il n'existe pas

    // dbo.collection("TuMeCherches_TuMeTrouves").find({ name : "Gantt"}).toArray(function(err, result) {
    //   if (err) throw err;
    //   console.log(result);
    //   console.log(gantt.name);
    //   if (result == gantt.name) {console.log("test")}
    //   else{
    // dbo.collection("TuMeCherches_TuMeTrouves").insertOne(gantt);
    // console.log("Objet ajouté");
    // }})

    // Recherche du nom et de la description puis envoi vers le front

      dbo
      .collection("TuMeCherches_TuMeTrouves")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;
        result.forEach(element =>
          io.emit("desc", element.name + " : " + element.desc)
        );
      });

      // Recherche de toutes les données sur les tâches puis envoi vers le front

      dbo
      .collection("TuMeCherches_TuMeTrouves")
      .find({})
      .toArray(function(err, result) {
        if (err) throw err;
        for(let i = 0; i < count; i++){
        result.forEach(element =>
          io.emit("task", element.task[i].name + " : " + element.task[i].desc + ", " + element.task[i].start + " / " + element.task[i].end + ", " + element.task[i].percentageProgress)
        );
      }
      });


      // Ajout d'une tâche dans la bdd

      client.on("name", dataName => {
      client.on("desc", dataDesc => {
      client.on("start", dataStart => {
      client.on("end", dataEnd => {
      client.on("percentageProgress", dataPercentageProgress => {
      client.on("color", dataColor => {
      client.on("linkedTask", dataLinkedTask => {
      client.on("ressources", dataRessources => {
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          let dataId = count;
          let task = { id : dataId, name : dataName, desc: dataDesc, start : dataStart, end : dataEnd, percentageProgress : dataPercentageProgress, color : dataColor, linkedTask : dataLinkedTask, ressources : dataRessources };
          dbo.collection("TuMeCherches_TuMeTrouves").insertOne(task, function(err, res) {
            if (err) throw err;
             console.log("task inserted");
          });
        });
      });});});});});});});});
    
      // db.close();
  });
});


  
// client.on('connect', () => {
//   console.log('connected')

//   client.emit( {
//     nameService : "TuMeCherches_TuMeTrouves", 
//     projects : [
//    { 
//       name : "Gantt", 
//       desc : "Ce projet a pour but d'afficher un diagramme de Gantt", 
//       daysOff : { Mo : true, Tu : true,  We : true, Th : true, Fr : true, Sa : false, Su : false },
//       workingHours : { start : 8.30, end : 16.30 }, 
//       task : [{ id : 0, name : "Creation projet", desc : "Creer le back", start : 1491680626329, end : 1491684607029, percentageProgress : 50, color  : "#fc0202", linkedTask : [], ressources : [] }], 
//       groupTask : [{ name : "Back", start : Date.now(), end : Date.now() }], 
//       resources : [{ name : "Valentin", cost : 10, type : "humain" }], 
//       milestones : [{ name : "Jalon1", date : Date.now() }] 
//      } 
//     ] 
//    });

// client.emit('needHelp');
// client.on('projectUpdated ');
// });

http.listen(3000);