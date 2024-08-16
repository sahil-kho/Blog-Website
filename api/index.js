const express = require('express');
const cors = require('cors');
const { default: mongoose } = require('mongoose');
const User = require('./models/user')
const bcrypt = require('bcrypt');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const upload = multer({dest: 'uploads/'});
const fs = require('fs');
const Post = require('./models/post');

const salt='$2b$10$1Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z';

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,

}));

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'));



mongoose.connect('mongodb://localhost:27017/',{
    dbName: 'blog',
})

app.get('/', (req,res) => {
    res.send('Hello world');
}
);

app.post('/register',async (req, res) => {
    const {username,password} = req.body;
    try{
        const user = await User.create({
            username,
            password:bcrypt.hashSync(password,salt),
        });
        res.json(user);
    }
    catch(e){
        res.status(400).json({error: e});
    }
});

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      // logged in
      jwt.sign({username,id:userDoc._id}, 'secret', {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json({
          id:userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json('wrong credentials');
    }
});

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    jwt.verify(token,'secret', {}, (err,info) => {
      if (err) throw err;
      res.json(info);
    });
  });


app.post('/logout',(req, res) => {
    res.clearCookie('token').json({message: "Logout successful"});
});

app.post('/posts',upload.single('files'),async (req, res) => {
    // res.json(req.file);
    const {originalname} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length-1];
    // res.json({ext});
    fs.renameSync(req.file.path, req.file.path + '.' + ext);

    const {token} = req.cookies;
    // res.json(token);

    jwt.verify(token,'secret', {}, async (err,info) => {
        if (err) throw err;
        // res.json(info);
        const {title,summary,content} = req.body;
        const postDoc = await Post.create({
          title,
          summary,
          content,
          cover: req.file.filename + '.' + ext,
          author: info.id,
        });
        res.json(postDoc);
      });


});


// // this function does not work properly
// app.put('/post',upload.single('file'), async (req,res) => {
//     let newPath = null;
//     if (req.file) {
//       const {originalname,path} = req.file;
//       const parts = originalname.split('.');
//       const ext = parts[parts.length - 1];
//       newPath = path+'.'+ext;
//       fs.renameSync(path, newPath);
//     }

//     const {token} = req.cookies;
//     jwt.verify(token, secret, {}, async (err,info) => {
//       if (err) throw err;
//       const {id,title,summary,content} = req.body;
//       const postDoc = await Post.findById(id);
//       const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
//       if (!isAuthor) {
//         return res.status(400).json('you are not the author');
//       }
//       await postDoc.update({
//         title,
//         summary,
//         content,
//         cover: newPath ? newPath : postDoc.cover,
//       });

//       res.json(postDoc);
//     });

//   });


app.get('/posts',async (req, res) => {
    res.json(await Post.find().
    populate('author',['username'])
    .sort({createdAt: -1})
    .limit(10)
    );
});


app.get('/posts/:id',async (req, res) => {
    const {id} = req.params;
    const postDoc = await Post.findById(id).populate('author',['username']);
    res.json(postDoc);
});




app.listen(4000);

