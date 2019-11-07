
const db = require('./data/db.js');
const express = require('express');

const server = express();

const port = process.env.PORT ? process.env.PORT : 4000;

server.listen(port, () => {
    console.log(`=== server listening on port ${port} ===`);
});

server.use(express.json());

server.get('/', (req, res) => {
    res.send("<h1>API Running</h1>");
})

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({ error: "The users information could not be retrieved." });
        });
});

server.post('/api/users', (req, res) => {
    const userInfo = req.body;

    if (!userInfo.name || !userInfo.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
        db.insert(userInfo)
            .then((user) => {
                res.status(201).json(user);
            })
            .catch((err) => {
                res.status(500).json({ error: "There was an error while saving the user to the database", err });
            });
    }

    
});

server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    db.remove(id)
        .then(deletedUser => {
            if (deletedUser) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user could not be removed", err });
        });
});

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const userInfo = req.body;

    if (!userInfo.name || !userInfo.bio) {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    } else {
        db.update(id, userInfo)
            .then(user => {
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." });
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The user information could not be modified.", err });
            });
    }
});
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    
    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(err => {
            res.status(500).json({ error: "The user information could not be retrieved." });
        });
});





