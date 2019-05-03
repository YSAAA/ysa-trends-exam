
require('handlebars');
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

//View Engine
app.use(express.static(path.join(__dirname, '/views')));
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

var posts = fetch('https://jsonplaceholder.typicode.com/posts')
            .then((res) => res.json())
            .then((data) => posts = data)

var users = fetch('https://jsonplaceholder.typicode.com/users')
            .then((res) => res.json())
            .then((data) => users = data)

var comments = fetch('https://jsonplaceholder.typicode.com/comments')
            .then((res) => res.json())
            .then((data) => comments = data)

var albums = fetch('https://jsonplaceholder.typicode.com/albums')
            .then((res) => res.json())
            .then((data) => albums = data)

var photos = fetch('https://jsonplaceholder.typicode.com/photos')
            .then((res) => res.json())
            .then((data) => photos = data)         

var todos = fetch('https://jsonplaceholder.typicode.com/todos')
            .then((res) => res.json())
            .then((data) => todos = data)

app.get('/', (req, res) => res.render('index', {
    title: 'My Website',
    posts
}));

app.get('/posts', (req, res) => {
    var uid = req.query.userId;
    if(uid == '' || !uid) {
        res.render('posts', {
            posts,
            users
        });
    } else {
        var post = posts.filter(p => p.userId === parseInt(uid));
        var owner = users.find(u => u.id === post[0].userId);
        res.render('user_posts', {
            post,
            users,
            owner
        });
    }
});

app.get('/posts/:id', (req, res) => {
    var post = posts.find(p => p.id === parseInt(req.params.id));
    if(!post) res.status(404).send('Post not found!');
    var post_owner = users.find(f => f.id === post.userId);
    res.render('post', {
        title: 'POST',
        post_owner,
        post
    });
});

app.get('/posts/:postId/comments', (req, res) => {
    var comm = comments.filter(p => p.postId === parseInt(req.params.postId));
    if(!comm) res.status(404).send('Error: Comments not available!');
    var single_post = posts.find(s => s.id === parseInt(req.params.postId));
    var owner = users.find(u => u.id === single_post.userId);

    res.render('comments', {
        title: 'Comments',
        single_post,
        owner,
        comm
    });
});

app.get('/comments', (req, res) => {
    var pid = req.query.postId;
    if(pid == '' || !pid) {
        res.status(404).send('Error 404: Post not found!', {
            posts
        });
    } else {
        var post_comments = comments.filter(p => p.postId === parseInt(pid));
        var posts_bod = posts.find(u => u.id === post_comments[0].postId);
        res.render('post_comments', {
            post_comments,
            posts_bod
        });
    }
});

app.get('/users', (req, res) => res.render('users', {
    title: 'USERS',
    users
}));

app.get('/users/:id', (req, res) => {
    var user_info = users.find(u => u.id === parseInt(req.params.id));
    if(!user_info) res.status(404).send('User not found!');
    res.render('user', {
        title: 'USER',
        user_info
    });
});


app.get('/albums/:albumId/photos', (req, res) => {
    var albumphotos = photos.filter(p => p.albumId === parseInt(req.params.albumId));
    if(!albumphotos) res.status(404).send('Error: Album not available!');
    var album_by = albums.find(ab => ab.id === albumphotos[0].albumId);
    var album_owner = users.find(a => a.id === album_by.userId);
    res.render('photos', {
        albumphotos,
        album_owner,
        album_by
    });
});

app.get('/albums', (req, res) => {
    var uid = req.query.userId;
    if(uid == '' || !uid) {
        res.render('albums', {
            albums
        });
    } else {
        var al = albums.filter(a => a.userId === parseInt(uid));
        if(!al) res.status(404).send('User not found!');
        
        var owner = users.find(u => u.id === al[0].userId);
        res.render('user_albums', {
            al,
            owner
        });
    }
});

app.get('/todos', (req, res) => {
    var q = req.query.userId;
    if(q == '' || !q) {
        res.render('todos', {
            todos
        });
    } else {
        var todo = todos.filter(t => t.userId === parseInt(q));
        if(!todo) {
            res.status(404).send('Error 404: page not found!');
        } else {
            var user = users.find(u => u.id === parseInt(q));
            res.render('user_todos', {
                todo,
                user
            });
        }
    }
});


//PORT
const port = process.env.PORT || 5000; 
app.listen(port, () => console.log(`Server running on port ${port}`));