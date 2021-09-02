const {app,
BrowserWindow,dialog, ipcRenderer} = require('electron');
const { ipcMain }     = require('electron/main');
const os              = require('os');
const fs              = require('fs');
const path            = require("path"); 
const fileModel       = require("./models/files"); 
const mongoose        = require("mongoose");
const conn            = require("./config/db").con;
const { monitorEventLoopDelay } = require('perf_hooks');

//db connection
mongoose.connect(conn,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log("connected to db"))
.catch((err)=>{
  console.log('connection error',err)
})


let main = null;

app.on('ready',()=>{
   let mainWindow = new BrowserWindow({
       height:720,
       width:480,
       webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true
      },
      // frame:false
   });
   mainWindow.loadFile("index.html");
   
   //
   mainWindow.webContents.on('did-finish-load',()=>{
     fileModel.find({},{},{sort:{"_id":-1}},(err,fdata)=>{
         if(err){
           console.log(err);
         }
         else{
           fdata = JSON.stringify(fdata);
          mainWindow.webContents.send("getData",fdata);
          }
      });
    });
 });

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

ipcMain.on('getImage',(event,arg)=>{

      dialog.showOpenDialog({properties:['openFile']})
       .then((data)=>{
         if(data.canceled){
           console.log("dialogbox Closed")
         }
         else{
          const filePath = data.filePaths[0];
          event.sender.send("showImage",filePath);             
           }
        })
       .catch((err)=>{
         console.log(err);
       }) 
    });

 ipcMain.on("saveData",(event,arg)=>{
  let imgPath;
  // console.log('s23',arg);   
       const pathh    = path.resolve(__dirname,'uploads');
       const fileName = path.basename(arg.imagePath);
              imgPath = path.join(pathh,fileName);
            // console.log('df34',fileName,imgPath)         

           //copy the image from actual location to upload folder
           fs.copyFile(arg.imagePath, imgPath, (err) => {
            if (err){
              throw err;
            }
            else{
                //save img in db
              let fileData = new fileModel({
                  name:arg.namee,
                  filee : imgPath
              });
              fileData.save((err,dat)=>{
                   if(err){
                     console.log(err);
                   }
                   else{
                     getAllData((err,gdata)=>{
                       if(err){
                         console.log(err);
                       }
                       else{
                         gdata = JSON.stringify(gdata);
                         event.sender.send("getData",gdata);
                       }
                     });
                  }
                });   
              }
            });
 });


 function getAllData(cb){
     fileModel.find({},{},{sort:{"_id":-1}},(err,fdata)=>{
           if(err){
              cb(err,null);
           }
           else if(fdata){
                cb(null,fdata);
           }
           else{
              cb('no data found',null);
           }
     });
 }