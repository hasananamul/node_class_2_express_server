import http from "http"
import dotenv from "dotenv"
import {readFileSync, writeFileSync} from "fs";

// Environment Init
dotenv.config();

const PORT = process.env.SERVER_PORT;

http.createServer((req,res) => {
      let student_json = readFileSync("./data/student.json").toString();
      let student_obj = JSON.parse(student_json);
      let finding_id = Number(req.url.split('/')[2]);
      let url_id = req.url.match(/\/students\/[0-9]{1,}/);
      let new_id = Number(student_obj[student_obj.length - 1].id) + 1

      if(req.url === "/students" && req.method === "GET"){
            res.writeHead(200,{"Content-Type" : "application/json"})
            res.end(student_json)
      } else if (url_id && req.method === "GET"){
            if(student_obj.some(data => data.id == finding_id)){

                  res.writeHead(200,{"Content-Type" : "application/json"})
                  res.end(JSON.stringify(student_obj.find(data => data.id == finding_id)))      

            }else{
                  res.writeHead(200,{"Content-Type" : "application/json"})
                  res.end("Data not found !")
            }
      
      } else if(req.url == "/students" && req.method == "POST"){

            let data = '';
            req.on('data', (chunk) => data += chunk.toString())
            req.on('end', () => {   
                  let {name,age,skill,location} = JSON.parse(data);
                  student_obj.push({
                        id : new_id,
                        name : name,
                        age : age,
                        skill : skill,
                        location : location
                  })
                  writeFileSync("./data/student.json", JSON.stringify(student_obj))
            })
            res.writeHead(200,{"Content-Type" : "application/json"})
            res.end("Data added is successfully")

      } else if(url_id && req.method == "DELETE"){
            if(student_obj.some(data => data.id == finding_id)){
                  let delete_data = student_obj.filter(data => data.id != finding_id);
                  writeFileSync("./data/student.json",JSON.stringify(delete_data))
                  res.writeHead(200,{"Content-Type" : "application/json"})
                  res.end("Data delete is successful") 
            } else{
                  res.writeHead(200,{"Content-Type" : "application/json"})
                  res.end("Data not found !") 
            }

      } else if(url_id && req.method == "PUT" || url_id && req.method == "PATCH"){
            if(student_obj.some( data => data.id == finding_id)){
                  let new_data = '';
                  req.on("data", (chunk) => {
                        new_data += chunk.toString()
                  })
                  req.on("end", () => {
                        let update_data = JSON.parse(new_data);
                        student_obj[student_obj.findIndex(data => data.id == finding_id)] = {
                              id : finding_id,
                              ...update_data
                        }
                        console.log(student_obj);
                        writeFileSync("./data/student.json", JSON.stringify(student_obj))
                  })
                  res.writeHead(200,{"Content-Type" : "application/json"})
                  res.end("Data update is successfull !")
            }else{
                  res.writeHead(200,{"Content-Type" : "application/json"})
                  res.end("Data not found !") 
            }
      } else{
            res.writeHead(200,{"Content-Type" : "application/json"})
            res.end("Invalid request !") 
      }
      
}).listen(PORT, () => console.log(`This server is running on ${PORT} port`))

