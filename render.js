const { ipcRenderer } = require("electron");
const  $ = require('jquery'); 

// will be called on app load
ipcRenderer.on("getData",(event,arg)=>{
     
     arg = JSON.parse(arg);
     console.log('sd',arg); 
     $("#name").val('');
     $("#image").find('img').remove(); 
     $("#dtable tr").remove();
     for(var i=0; i<arg.length;i++){
        $("#dtable").append('<tr>'+'<td>'+arg[i].name+'</td>'+'<td><img src="'+arg[i].filee+'" style="width:200px;height:200px;"/></td>'+'</tr>')
     }
});

//show the selected image
ipcRenderer.on("showImage",(event,arg)=>{
     console.log(arg);
     // arg = JSON.parse(arg);
     var x = $("#image");
     x.html('<img src="'+arg+'" id="upimage" style="width:250px; height:200px">');
  });

//save data
function saveData(e){
  
  var name  = $("#name").val();
  var img   = $("#image").find('img')
  console.log("s",$("#image img").attr('src'));
  if((!name) || (!img.length)){
     console.log("fill all the data in fields");
  }
  else{
   var dataa = {
      namee:name,
      imagePath:$("#image img").attr('src')
   }
  ipcRenderer.send("saveData",dataa);
  }
}


// upload file
function image(e){
   ipcRenderer.send('getImage');
}