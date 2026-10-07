const fs=require("fs"),path=require("path"),os=require("os");
function projectRoot(){return process.cwd()}
function pick(cs){for(const c of cs){try{fs.mkdirSync(c,{recursive:true});fs.accessSync(c,fs.constants.W_OK);return c}catch{}}return null}
function dataDir(){return process.env.DATA_DIR?.trim()?path.resolve(process.env.DATA_DIR):pick([path.join(process.cwd(),"data"),path.join(os.homedir(),".shadowborne","data"),path.join(os.tmpdir(),"shadowborne-data")])||path.join(os.tmpdir(),"shadowborne-data")}
function sessionDir(){return process.env.SESSION_DIR?.trim()?path.resolve(process.env.SESSION_DIR):pick([path.join(process.cwd(),"sessions"),path.join(os.homedir(),".shadowborne","sessions"),path.join(os.tmpdir(),"shadowborne-sessions")])||path.join(os.tmpdir(),"shadowborne-sessions")}
function ensureDir(d){fs.mkdirSync(d,{recursive:true});return d}
module.exports={projectRoot,dataDir,sessionDir,ensureDir};
