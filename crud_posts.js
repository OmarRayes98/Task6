

const express = require('express');

const { readDataFromFile, writeDataToFile } = require('./utils/databaseFunctions');
const app = express();
const port = 3000;

app.use(express.json()) // for parsing application/json



app.get('/api/posts', (req, res) => {

    try{
        readDataFromFile((dataFromFile)=>{
            res.send({status:"200",data:dataFromFile.posts})
        })
    
    }catch(e){
        res.send({ status: "500", message: 'Internal Server Error' , error:e.message });
    }

})


app.post('/api/posts', (req, res) => {

    try{
        const { title, user } = req.body;

        if (!title || !user) {
            return res.send({
            status:"400",
            message: 'Bad Request: "title" and "user" are required fields.',
            });
        }

        
        readDataFromFile((dataFromFile) => {

        const newPost = {
                id: dataFromFile.counterPostsId + 1,
                title: req.body?.title,
                description: req.body?.description,
                user: req.body?.user,
        };

        dataFromFile.counterPostsId +=1;
        
        dataFromFile.posts.push(newPost);

        writeDataToFile(dataFromFile, () => {

        res.send({status:"201",message:'Data saved successfully'})

        });
    });
    }
    catch(e){
        res.send({ status: "500", message: 'Internal Server Error' , error:e.message });
    }
    
})

app.put('/api/posts/:id', (req, res) => {

    try{
        const id = req.params.id;
        
        if(!id){
            return res.send({
                status:"400",
                message: 'Missing "id" parameter in the URL.',
                });
        }
        else if (!req.body?.title || !req.body?.user) {
            return res.send({
            status:"400",
            message: 'Bad Request: "title" and "user" are required fields.',
            });
        }

        readDataFromFile((dataFromFile) => {
            console.log(dataFromFile,"dataFromFile") // contains posts and counterIdPosts 
            /*
            edit just the data with 
            keeping counterIdPost to send to the file
            */
            const index = dataFromFile.posts.findIndex((item) => item.id == id);
        
            if (index == -1) {
            return res.send({ status:"404", message: "This post does not exists." });
            }
        
            dataFromFile.posts[index].title = req.body.title;
            dataFromFile.posts[index].description = req.body.description;
    
            writeDataToFile(dataFromFile, () => {
            res.send({ status:'200', message: "Data saved suucessfully." });
            
            });
        });
    }
    catch(e){
        res.send({ status: "500", message: 'Internal Server Error' , error:e.message });
    }
    
})

app.delete("/api/posts/:id", (req, res) => {

    try{
        const id = req.params.id;
        if(!id){
            return res.send({
                status:"400",
                message: 'Missing "id" parameter in the URL.',
                });
        }

        readDataFromFile((dataFromFile) => {

        const index = dataFromFile.posts.findIndex((item) => item.id == id);
      
        if (index == -1) {
            return res.send({ status:'404', message: "This post does not exists." });
        }
      
        dataFromFile.posts= dataFromFile.posts.filter((item) => item.id != id);
    
        writeDataToFile(dataFromFile, () => {
            res.send({ message: "Data deleted suucessfully." });
        });
        });
    }
    catch(e){
        res.send({ status: "500", message: 'Internal Server Error' , error:e.message });

    }
});



app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})