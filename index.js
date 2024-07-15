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

const loadPosts = async () =>{
    try{
        const dataBuffer = await fs.promises.readFile(dataFilePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    }
    catch (e){
        return [];
    }
}

let postInfo;
const init = async () => {
    postInfo = await loadPosts();
};

init();

const savePosts = async (posts) =>{
    const dataJSON = JSON.stringify(posts);
    await fs.promises.writeFile(dataFilePath, dataJSON);
}

function createPostContent(title = '', text = '', id = ''){
    return{
        title: title,
        text: text,
        id: id
    };
}

app.delete('/delete/:id', async (req, res) => {
    const id = parseInt(req.params.id, 10); 
    const postToDelete = postInfo.find(post => post.id === id);

    if(!postToDelete){
        return res.status(404).json({
            status: 'fail',
            message: 'no movie object with id of ' + id + ' is found'
        })
    }

    const index = postInfo.indexOf(postToDelete);
    postInfo.splice(index, 1);

    try {
        await fs.promises.writeFile(dataFilePath, JSON.stringify(postInfo));
        res.redirect("/");
    } catch (error) {

        return res.status(500).json({
            status: "Error",
            message: "Internal server error",
        });
    }
});

app.put("/edit/:id", async (req, res) => {
    const id = parseInt(req.params.id, 10);
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
    await savePosts(postInfo);

    res.status(200).json({
        status: 'success',
        message: 'Post updated successfully',
        post: postInfo 
    });
})

app.post("/submit-form", async (req, res) => {
    const postTitle = req.body["postTitle"];
    const postText = req.body["postText"];
    console.log(postText, postTitle);
    if(postTitle === '' || postText === ''){
        console.log("Empty title or text, not adding to postInfo");
        return res.status(400).json({
            status: 'fail',
            message: 'Title and text cannot be empty'
        })
    }

    let postId = postInfo.length === 0 ? 1 : postInfo[postInfo.length - 1].id + 1;

    const newPost = (createPostContent(postTitle, postText, postId));
    if(newPost.text && newPost.text){
        //try to get rid of the double submit issue

        //try to change code to send post object to the front-end
        //so it can preappend a post without have to rerender the whole page
            postInfo.push(newPost);
            await savePosts(postInfo);
            res.redirect("/");
    }
 
});



app.get("/", (req, res) => {
    res.render("index.ejs", {
        posts: postInfo
    });
})

app.listen(port, () => {
    console.log(`listening on port ${port}`);
})