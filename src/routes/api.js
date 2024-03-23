const express = require("express");
const router = express.Router();

const UsersController = require("../controller/UsersController");
const AuthVerificationMiddleware = require("../middleware/AuthVerificationMiddleware");
const TodoController = require("../controller/TodoController");

router.post('/registration', UsersController.Registration);
router.post('/login', UsersController.Login);
router.get('/recover-verify-email/:email', UsersController.RecoverVerifyEmail);
router.get('/otp-verify/:email/:otp', UsersController.OtpVerify);
router.post('/reset-password', UsersController.ResetPassword);
router.post('/profile-update', AuthVerificationMiddleware, UsersController.ProfileUpdate);
router.get('/profile-details', AuthVerificationMiddleware, UsersController.ProfileDetails);


// todo api start
router.post('/create-todo', AuthVerificationMiddleware, TodoController.CreateTodo);
router.get('/update-todo-status/:id/:status', AuthVerificationMiddleware, TodoController.UpdateTodoStatus);
router.get('/delete-todo/:id', AuthVerificationMiddleware, TodoController.DeleteTodo);
router.get('/todo-list-by-status/:status', AuthVerificationMiddleware, TodoController.TodoListByStatus);
router.get('/todo-count-by-status', AuthVerificationMiddleware, TodoController.TodoCountByStatus);




module.exports = router;