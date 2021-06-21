const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDbAndServer = async () => {
  try {
      db = await open({
          filename:dbPath,
          driver:sqlite3.Database,
      });
      app.listen(3000,() =>{
          console.log("Server Running at http://localhost:3000/")
      });
      catch(e){
          console.log(`DB Error:${e.message}`);
          process.exit(1)
      }
  }
}

initializeDbAndServer()

const convertDbObjectToResponseObject = (dbObject) => {
    return {
        id:dbObject.id,
        todo:dbObject.todo,
        category:dbObject.category,
        priority:dbObject.priority,
        status:dbObject.status,
        dueDate:dbObject.dueDate
    }
}

app.get("/todos/",async (request,response) =>{
    const {status} = request.body
    const getTodoQuery = `
    SELECT 
        *
    FROM
        Todo_Application
    WHERE
        status = ${status}`
    const todo = await db.all(getTodoQuery)
    response.send(convertDbObjectToResponseObject(todo))
})
module.exports = app