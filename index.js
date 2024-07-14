import express from "express"
import bodyParser from "body-parser"
import fs from "fs"
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 3000;
const dataFilePath = path.join(__dirname, "data", "posts.json");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

const loadPosts = () =>{
    try{
        const dataBuffer = fs.readFileSync(dataFilePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    }
    catch (e){
        return [];
    }
}

let postInfo = loadPosts();

const savePosts = (posts) =>{
    const dataJSON = JSON.stringify(posts);
    fs.writeFileSync(dataFilePath, dataJSON);
}

function createPostContent(title = '', text = '', id = ''){
    return{
        title: title,
        text: text,
        id: id
    };
}

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id * 1;
    const postToDelete = postInfo.find(post => post.id === id);
    if(!postToDelete){
        return res.status(404).json({
            status: 'fail',
            message: 'no movie object with id of ' + id + ' is found'
        })
    }

    const index = postInfo.indexOf(postToDelete);
    postInfo.splice(index, 1);

    fs.writeFile(dataFilePath, JSON.stringify(postInfo), (err) => {
        if (err) {
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
            });
        }
        res.redirect("/");
    });
});

app.put("/edit/:id", (req, res) => {
    const id = req.params.id * 1;
    const title = req.body["title"];
    const text = req.body["text"];
    console.log('Title:', title);
    console.log('Text:', text); 
    const postToEdit = postInfo.find(post => post.id === id);
    if(!postToEdit){
        return res.status(404).json({
            status: 'fail',
            message: 'no movie object with id of ' + id + ' is found'
        })
    }
    
    const index = postInfo.indexOf(postToEdit);
    postInfo[index].title = title;
    postInfo[index].text = text;
    savePosts(postInfo);

    res.status(200).json({
        status: 'success',
        message: 'Post updated successfully',
        post: postInfo 
    });
})

app.post("/submit-form", (req, res) => {
    const postTitle = req.body["postTitle"];
    const postText = req.body["postText"];
    let postId;
    if(postInfo.length === 0){
      postId = 1;
    }
    else{
        postId = postInfo[postInfo.length - 1]["id"] + 1;
    }
    console.log(postText, postTitle);
    if(postTitle === '' || postText === ''){
        console.log("Empty title or text, not adding to postInfo");
    }

    else{
    const newPost = (createPostContent(postTitle, postText, postId));
        if(newPost.title && newPost.text){ //check if they have actual values like this and not checking the key value you dolt
            postInfo.push(newPost);
            savePosts(postInfo);
         }
        else{
        console.log("createNewPost added empty object. Not adding to postInfo");
        }  
    }
    
    res.redirect("/");
});

app.post("/create", (req, res) => {
    res.render("index.ejs", {
        posts: postInfo
    });
})

app.get("/", (req, res) => {
    res.render("index.ejs", {
        posts: postInfo
    });
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})