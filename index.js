const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const server = express()

const projectDB = require('./data/helpers/projectModel.js')
const actionDB = require('./data/helpers/actionModel.js')

const NUM = 4444;

server.use(
    express.json(),
    helmet(),
    morgan('dev'),
)

// server.get('/api/projects', (req,res) => {
//     projectDB.get()
//     .then((projects) => {res.json(projects)})
//     .catch(err => {
//         res
//         .status(500)
//         .json({message: 'Unable to get projects'})})
// } )

server.get('/api/actions', (req, res) => {
        actionDB.get()
        .then(actions => {res.json(actions)})
        .catch( err => {
            res
            .status(500)
            .json({"message": "Could not retrieve projects"})
        }
        )

})

server.get('/api/projects/:id', (req, res) => {
    const {id} = req.params;

    projectDB.get(id)
    .then(project => {
        if (project) {res.json(project)}

        else {
            res
            .status(404)
            .json({"message": "Project with that id does not exist"})
        }
    }
    )
    .catch( err => {
        res
        .status(500)
        .json({"message": "Could not retrieve project."})
    }
    )

})

server.get('/api/projects/finished/:id', (req, res) => {
    const {id} = req.params;
    const check = req.body;

    projectDB.get(id)
    .then(check => {
        if (check.completed === true) {
            res.json({ success: "This project is completed" })
        }

        else {
            res
            .status(404)
            .json({"message": "Project with that id does not exist"})
        }
    }
    )
    .catch( err => {
        res
        .status(500)
        .json({"message": "This project is NOT completed"})
    }
    )
})

server.get('/api/actions/:id', (req, res) => {
    const {id} = req.params;
    actionDB.get(id)
    .then(action => {
        if (action) {res.json(action)}

        else {
            res
            .status(404)
            .json({"message": "Action with that id does not exist"})
        }
    }
    )
    .catch( err => {
        res
        .status(500)
        .json({"message": "Could not retrieve action."})
    }
    )

})

server.post('/api/projects', (req,res) => {
    const project = req.body;
    if (project.name && project.description){
        projectDB.insert(project)
    .then(info => {
        projectDB.get(info.id).then(response => {
            res
            .status(201)
            .json(response)})
        })
        
    .catch(err => {
        res
        .status(500)
        .json({message: "failed to add project"})
    })
    }

    else {
        res
        .status(400)
        .json({message: "missing name or description"})
    }
    
})

server.post('/api/actions', (req,res) => {
    const action = req.body;
    if (action.project_id && action.description && action.notes){
        actionDB.insert(action)
    .then(info => {
        actionDB.get(info.id).then(response => {
            res
            .status(201)
            .json(response)})
        })
        
    .catch(err => {
        res
        .status(500)
        .json({message: "failed to add action"})
    })
    }

    else {
        res
        .status(400)
        .json({message: "missing project_id, description or notes"})
    }
    
})

server.delete('/api/projects/:id', (req,res) => {
    const {id} = req.params;
    projectDB.remove(id)
    .then(count => {
        if (count) {
            res.json({message: "Project deleted"})}

        else {
            res
            .status(404)
            .json({message: "Project with this ID does not exist."})
        }

    })
    .catch(err => {
        res
        .status(500)
        .json({message: "Project could not be deleted"})
    })
})

server.delete('/api/actions/:id', (req,res) => {
    const {id} = req.params;
    actionDB.remove(id)
    .then(count => {
        if (count) {
            res.json({message: "Action deleted"})}

        else {
            res
            .status(404)
            .json({message: "Action with this ID does not exist."})
        }

    })
    .catch(err => {
        res
        .status(500)
        .json({message: "Action could not be deleted"})
    })
})

server.put('/api/projects/:id', (req,res) => {
    const project = req.body;
    const {id} = req.params;
    if (project.name && project.description) {
        projectDB.update(id, project)
        .then(count => {
            if (count) {
                projectDB.get(id).then( data => {
                    res.json(data)}
                )
            }

            else { res
                .status(404)
                .json({message:"The project with the specified ID does not exist."})}
        })
        .catch(
            err => {
                res
                .status(500)
                .json({error: "The project could not be updated"})
            }
        )

    }

    else {
        res
        .status(400)
        .json({message: "missing name or description"})
    }

})

server.put('/api/actions/:id', (req,res) => {
    const action = req.body;
    const {id} = req.params;
    if (action.project_id && action.description && action.notes) {
        actionDB.update(id, action)
        .then(count => {
            if (count) {
                actionDB.get(id).then( data => {
                    res.json(data)}
                )
            }

            else { res
                .status(404)
                .json({message:"The action with the specified ID does not exist."})}
        })
        .catch(
            err => {
                res
                .status(500)
                .json({error: "The action could not be updated"})
            }
        )

    }

    else {
        res
        .status(400)
        .json({message: "missing project_id, description, or notes"})
    }

})

server.listen(NUM, () => {
    console.log(`server listening on port ${NUM}`)
})