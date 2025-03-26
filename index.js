const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// app.get('/',function(req,res){
//   res.send("hello");
// });

app.get('/',function(req,res){
  fs.readdir(`./files`,function(err,file){
    res.render('index' ,{files:file});
  })
})

app.get('/delete/:filename', function(req, res) {
  const filePath = `./files/${req.params.filename}`;

  fs.unlink(filePath, function(err) {
      if (err) {
          console.error("Failed to delete file:", err);
          return res.status(500).send("Error deleting file");
      }
      console.log("File deleted successfully");
      res.redirect('/');
  });
});


app.get('/complete/:filename', function(req, res) {
  const oldPath = `./files/${req.params.filename}`;
  const newPath = `./files/${req.params.filename.replace('.txt', '')} - Completed.txt`;

  fs.rename(oldPath, newPath, function(err) {
      if (err) {
          console.error("Failed to mark as complete:", err);
          return res.status(500).send("Error marking file as complete");
      }
      
      res.redirect('/');
  });
});


app.get('/files/:filename',function(req,res){
  fs.readFile(`./files/${req.params.filename}` , "utf-8",function(err,filedata){
    
    res.render('show' , {filename: req.params.filename , filedata: filedata});
  })
})

app.get('/edit/:filename',function(req,res){
 
    res.render('edit', {filename:req.params.filename});

})

app.post('/edit',function(req,res){
    
   fs.rename(`./files/${req.body.previous}`, `./files/${req.body.new}.txt`, function(err){
    res.redirect("/");
   });

})


app.post('/create',function(req,res){
  fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details , function(err){
    res.redirect('/');
  });
})


app.listen(3000,()=>{
  console.log('server working');
});