const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note')
const { body, validationResult } = require('express-validator');

// ROUTE 1: Get All Note Using GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
        const notes = await Note.find({user: req.user.id});
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server Error Occured"); 
    }
})
// ROUTE 2: Add a new Note Using POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a Valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 Charactres').isLength({ min: 5 }),
], async (req, res)=>{
    try {

    const {title, description, tag, status} = req.body;

    // if there are errors, Returned bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Note ({
        title, description, tag, status, user: req.user.id
    })

    const savedNote = await note.save()

    res.json(savedNote)
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error Occured"); 
}
})

// ROUTE 3: Update the Existing Note Using PUT "/api/notes/updatenote". Login required
router.put('/updatenote/:id', fetchuser, async (req, res)=>{
    const {title, description, tag, status} = req.body;
    try {
   
    // Create a newNote Object
    const newNote = {};
    if(title){newNote.title = title}; 
    if(description){newNote.description = description}; 
    if(tag){newNote.tag = tag}; 
    if(status){newNote.status = status}; 

    // Find the note to updated and update it
    //taking Id
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    // Validate the user
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true})
    res.json({note});
         
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error Occured"); 
}
})

// ROUTE 4: Delete the Existing Note Using DELETE "/api/notes/deletenote". Login required
router.delete('/deletenote/:id', fetchuser, async (req, res)=>{
    try {

    // Find the note to deleted and delete it
    //taking Id
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")}

    // Allow deletion only if user own thin Note or Validate the user
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"Success": "Note has been deleted", note: note});
         
} catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server Error Occured"); 
}

})
module.exports = router
