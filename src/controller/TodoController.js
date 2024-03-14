const TodoModel = require("../models/TodoModel");

// create todo start
exports.CreateTodo = async (req, res) => {
  try {
    const reqBody = req.body;
    reqBody.email = req.headers.email;
    const todo = await TodoModel.create(reqBody);
    res.status(200).json({
      status: "Success",
      data: todo,
    });
  } catch (err) {
    res.status(200).json({
      status: "Fail",
      data: err,
    });
  }
};
// create todo end

// update todo status start
exports.UpdateTodoStatus = async (req, res) => {
  try {
    const id = req.params.id;
    let status = req.params.status;
    let query = {
      _id: id,
    };
    let body = {
      status: status,
    };
    let todo = await TodoModel.updateOne(query, body);
    res.status(200).json({
      status: "Success",
      data: todo,
    });
  } catch (err) {
    res.status(200).json({
      status: "Fail",
      data: err,
    });
  }
};
// update todo status end

// delete todo start
exports.DeleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    let query = {
      _id: id,
    };
    let todo = await TodoModel.deleteOne(query);
    res.status(200).json({
      status: "Success",
      data: todo,
    });
  } catch (err) {
    res.status(200).json({
      status: "Fail",
      data: err,
    });
  }
};
// delete todo end

// todo list by status start
exports.TodoListByStatus = async (req, res) => {
  try {
    let status = req.params.status;
    let email = req.headers.email;

    const result = await TodoModel.aggregate([
      {
        $match: {
          status: status,
          email: email,
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          status: 1,
          createdDate: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$createdDate",
            },
          },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    res.status(200).json({
      status: "fail",
      data: err,
    });
  }
};
// todo list by status end

// todo count by status start
exports.TodoCountByStatus = async (req, res) => {
  try {
    let email = req.headers.email;

    const result = await TodoModel.aggregate([
      {
        $match: {
          email: email,
        },
      },
      {
        $group: {
          _id: "$status",
          count: {
            $count: {}
          },
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (err) {
    res.status(200).json({
      status: "fail",
      data: err,
    });
  }
};
// todo count by status end
