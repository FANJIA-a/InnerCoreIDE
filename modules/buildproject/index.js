const fs = require("fs-extra");
const path = require("path");
const projects = require(path.resolve(__dirname, "../../setting/projects.json"));



module.exports = class {
  constructor( projectDir ) {
    this.projectDir = projectDir;
    this.data = {};
  }
  Create() {
    console.log(this.projectDir);
    fs.copy(path.resolve(__dirname, "../../ModFile"), this.projectDir, function (err) {
      if (err) return console.error(err);
    });
  }
  setData( modinfo, project ) {
    this.data.modinfo = modinfo;
    fs.writeFile(path.resolve(this.projectDir, "./mod.info"), JSON.stringify(this.data.modinfo, undefined, 2), err => {
      if (err) return console.log(err);
    })
    this.data.project = projects;
    this.data.project.projects.push(project);
    fs.writeFile(path.resolve(__dirname, "../../setting/projects.json"), JSON.stringify(this.data.project, undefined, 2), err => {
      if (err) return console.log(err);
    });
  }
}