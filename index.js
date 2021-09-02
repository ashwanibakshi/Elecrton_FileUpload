const {app,
BrowserWindow,dialog} = require('electron');
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
        enableRemoteModule: true,
      }
   });
   mainWindow.loadFile("index.html");
   
   //
  //  mainWindow.webContents.on('did-finish-load',()=>{
  //    fileModel.find({},{},{sort:{"filee":-1}},(err,fdata)=>{
  //        if(err){
  //          console.log(err);
  //        }
  //        else{
  //          fdata = JSON.stringify(fdata);
  //         mainWindow.webContents.send("getData",fdata);
  //         }
  //     });
  //   });
 });

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })

ipcMain.on('getImage',(event,arg)=>{

    let imgPath;

      dialog.showOpenDialog({properties:['openFile']})
       .then((data)=>{
         if(data.canceled){
           console.log("dialogbox Closed")
         }
         else{
       
          const filePath = data.filePaths[0];

          event.sender.send("showImage",filePath);


          // const fileName = path.basename(data.filePaths[0]);
          // const pathh    = path.resolve(__dirname,'uploads');

          // imgPath = path.join(pathh,fileName)


          // fs.copyFile(filePath, imgPath, (err) => {
          //   if (err){
          //     throw err;
          //   }
          //   else{
          //       //save img in db
          //     let fileData = new fileModel({
          //         filee : imgPath
          //     });
          //     fileData.save((err,dat)=>{
          //          if(err){
          //            console.log(err);
          //          }
          //          else{
                    
          //            dat = JSON.stringify(dat);
          //            console.log('data',dat);
          //            event.sender.send('showImage',dat);
          //          }
          //       });   
          //     }
          //   });
           }
        })
       .catch((err)=>{
         console.log(err);
       }) 
    });

