const fs = require("fs");
const path = require("path");
const remote = require("electron").remote;
const Dialog = remote.dialog;
const browserWindow = remote.BrowserWindow;

const language = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../setting/language.json"), "utf8"));
const projects = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../setting/projects.json"), "utf8")).projects;



document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("close").addEventListener("click", () => {
    remote.getCurrentWindow().close();
  });
  setLanguage();
  setProjectList();
  createProject();
});



function setLanguage() {
  const lang = document.querySelectorAll(".lang");
  lang.forEach(element => {
      const key = element.dataset.lang;
      element.textContent = language.startup[key][navigator.language] || "en";
      // element.textContent = language.startup[key]["ja"];
  });
}

function setProjectList() {
    let html = "";
    projects.forEach(element => {
        html += `
        <div class="project-item">
            <div class="image">
              <img src="${element.directory}\\mod_icon.png" />
            </div>
            <div class="info">
              <div class="data">
                <div class="name">${element["projects-name"]}</div>
              <div class="date">${element.date}</div>
              </div>
              <div class="dir">${element.directory}</div>
            </div>
          </div>
        `;
    });
    document.getElementById("project-list").innerHTML = html;
}


function createProject() {
  document.getElementById("projects-dir").addEventListener("click", () => {
    Dialog.showOpenDialog(null, {
      properties: ["openDirectory"],
      title: "select for workspace",
      defaultPath: "."
    }).then((data) => {
      document.getElementById("projects-dir").value = data.filePaths[0] || "";
    });
  });

  document.getElementById("create-button").addEventListener("click", () => {
    const test = require("../modules/buildproject");
    const name = document.getElementById("projects-name").value;
    const dir = document.getElementById("projects-dir").value;
    const username = document.getElementById("projects-username").value;
    const description = document.getElementById("projects-description").value;

    if( !name || !dir || !username || !description ) return false;

    const sa = new test(dir);
    sa.Create();
    sa.setData({
      "name": name,
      "author": username,
      "version": "1.0.0",
      "description": description
    }, {
      "projects-name": name,
      "directory": dir,
      "date": getNowYMD()
    });
  });
}

function getNowYMD(){
  var dt = new Date();
  var y = dt.getFullYear();
  var m = ("00" + (dt.getMonth()+1)).slice(-2);
  var d = ("00" + dt.getDate()).slice(-2);
  var result = y + "/" + m + "/" + d;
  return result;
}