const { ipcRenderer } = require("electron");
const  $ = require('jquery'); 

// will be called on app load
ipcRenderer.on("getData",(event,arg)=>{
     
     arg = JSON.parse(arg);
     console.log('sd',arg);   
});


ipcRenderer.on("showImage",(event,arg)=>{
     console.log(arg);
     // arg = JSON.parse(arg);
     var x = $("#image");
     x.html('<img src="'+arg+'" style="width:250px; height:200px">');
  });


// upload file
function image(e){
   ipcRenderer.send('getImage');
}