const express = require('express');

const actionDb = require('../data/helpers/actionModel.js');
const projectDb = require('../data/helpers/projectModel.js');
const router = express.Router();

router.get('/', (req, res) => {
    actionDb.get()
    .then(actions => {
        res.status(200).json(actions);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json("error: failed to get actions")
    })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    actionDb.get(id)
    .then(item => {
        console.log(item)
        if (!item) {
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
    const action = req.body;
    if (!req.body.project_id || !req.body.description || !req.body.notes) {
        res.status(500).json({error: "Please include a project_id, description, and notes."})
    } else {
        projectDb.get(action.project_id)
        .then(valid_project => {
            console.log(valid_project)
            actionDb.insert(action)
            .then(response => {
                console.log(response);
                res.status(200).json(response)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: "Problem encountered while adding to database!"})
            })
        })
        .catch(err => {
            res.status(500).json({error: "Hey, you need to specify an existing project id!"})
        })
    }
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    actionDb.remove(id)
    .then(item => {
        if (item === 0) {
            res.status(404).json({error: "No such action id."})
        } else{
            res.status(200).json({message: "Successfully deleted action."})
        }    
    })
    .catch(err => {
        console.log(err);
        res.status(500).json("error: The request failed.")
    })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const action = req.body;
    if (!req.body.project_id || !req.body.description || !req.body.notes) {
        res.status(500).json({error: "Please make sure description, project_id and notes are included."})
    } else {
        actionDb.update(id, action)
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


module.exports = router;