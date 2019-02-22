const express = require('express')
const router = express.Router()

const actionDB = require('./data/helpers/actionModel.js')



router.get('/', (req, res) => {
    actionDB.get()
    .then(actions => {res.json(actions)})
    .catch( err => {
        res
        .status(500)
        .json({"message": "Could not retrieve projects"})
    }
    )

})

router.get('/finished', (req, res) => {
    actionDB.get()
    .then(actions => {res.json(actions.filter(action => {return action.completed === true}))})
    .catch( err => {
        res
        .status(500)
        .json({"message": "Could not retrieve projects"})
    }
    )

})

router.get('/unfinished', (req, res) => {
    actionDB.get()
    .then(actions => {res.json(actions.filter(action => {return action.completed === false}))})
    .catch( err => {
        res
        .status(500)
        .json({"message": "Could not retrieve projects"})
    }
    )

})


router.get('/:id', (req, res) => {
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

router.post('/', (req,res) => {
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


router.delete('/:id', (req,res) => {
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

router.put('/:id', (req,res) => {
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

module.exports = router;