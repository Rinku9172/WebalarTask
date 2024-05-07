const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Board = require("../models/Board");
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

//Route1:Get all the boards using:GET “/api/task/fetchAllBoard.login required
router.get('/fetchAllBoards', fetchuser, async (req, res) => {
    try {
        const board = await Board.find({ user: req.user.id });
        res.json(board);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//create board api
router.post('/createBoard', fetchuser, [
    body('boardName', "Enter a valid name").isLength({ min: 3 }),

], async (req, res) => {
    try {
        const { boardName } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await User.findById(req.user.id)
        const existingBoard = await Board.findOne({ boardName, user: req.user.id });
        if (existingBoard) {
            return res.status(400).json({ error: "Board with this name already exists" });
        }
        const board = new Board({
            boardName, user: user.id
        })
        const savedBoard = await board.save()
        res.json(savedBoard);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//Route3 :Update an existing board using:PUT “/api/task/updateBoard.login required
router.put('/updateBoard/:id', fetchuser, async (req, res) => {
    const { boardName } = req.body;
    try {
        const newBoard = {};
        if (boardName) { newBoard.boardName = boardName };
        //Find the board to be updated and update it
        let board = await Board.findById(req.params.id);
        if (!board) { return res.status(400).send("Not found") }
        if (board.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        board = await Board.findByIdAndUpdate(req.params.id, { $set: newBoard }, { new: true })
        res.json({ board });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


router.delete('/deleteBoard/:id', fetchuser, async (req, res) => {
    try {
        let board = await Board.findById(req.params.id);
        if (!board) { return res.status(400).send("Not found") }
        if (board.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        board = await Board.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Board has been deleted", board: board });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// create task api
router.post('/createTask/:boardid/task', fetchuser, [
    body('title', "Enter a valid name").isLength({ min: 3 }),

], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const board = await Board.findById(req.params.boardid);
        if (!board) {
            return res.status(404).send("Board not found");
        }

        const { title, due, priority } = req.body;
        const newTask = { title, due, priority }
        board.task.push(newTask);
        await board.save();
        res.json({ message: "Task added successfully" });
        console.log(title);
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.delete('/deleteTask/:boardid/:taskid/task', fetchuser, async (req, res) => {
    try {
        let board = await Board.findById(req.params.boardid);
        if (!board) { return res.status(400).send("Not found") }

        if (board.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        const taskIndex = board.task.findIndex(task => task._id.toString() === req.params.taskid);
        if (taskIndex === -1) {
            return res.status(404).send("Task not found");
        }
        board.task.splice(taskIndex, 1);
        await board.save();
        res.json({ "Success": "Task has been deleted", board: board });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

//update task
router.put('/updateTask/:boardid/:taskid/task', fetchuser, async (req, res) => {

    try {
        let board = await Board.findById(req.params.boardid);

        if (board.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        const { title, due, priority } = req.body;
        if (!board) { return res.status(400).send("Not found") }

        const taskIndex = board.task.findIndex(task => task._id.toString() === req.params.taskid);
        if (taskIndex === -1) {
            return res.status(404).send("Task not found");
        }
        board.task[taskIndex].title = title;
        board.task[taskIndex].due = due;
        board.task[taskIndex].priority = priority;
        await board.save();
        res.json({ "Success": "Task updated successfully", board: board });

    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;