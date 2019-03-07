const express = require('express');

const projectDb = require('../data/helpers/projectModel.js');

const router = express.Router();

router.get('/', (req, res) => {
    projectDb.get()
    .then(proj => {
        res.status(200).json(proj);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json("error: failed to get proj")
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    projectDb.get(id)
    .then(item => {
        console.log(item)
        if (item.length < 1) {
            res.status(404).json("error: there is no item with such an id") 
        } else {
            res.status(200).json(item)
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json("error: The item doesn't exist, or the request failed.")
    })
})

router.post('/', (req, res) => {
    const project = req.body;
    if (!req.body.description || !req.body.name) {
        res.status(500).json({error: "Please include a name and description."})
    } else {
        projectDb.insert(project)
            .then(response => {
                console.log(response);
                res.status(200).json(response)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: "Problem encountered while adding to database!"})
            })
    }
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    projectDb.remove(id)
    .then(item => {
        if (item === 0) {
            res.status(404).json({error: "No such project id."})
        } else{
            res.status(200).json({message: "Successfully deleted project."})
        }    
    })
    .catch(err => {
        console.log(err);
        res.status(500).json("error: The request failed.")
    })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const project = req.body;
    if (!req.body.description || !req.body.name) {
        res.status(500).json({error: "Please include a name and description."})
    } else {
        projectDb.update(id, project)
            .then(response => {
                console.log(response);
                res.status(200).json(response)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: "Problem encountered while edited database!"})
            })
    }
})

router.get('/actions/:id', (req, res) => {
    const id = req.params.id;
    projectDb.getProjectActions(id)
    .then(response => {
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: "Not able to get project's actions."})
    })
});

module.exports = router;