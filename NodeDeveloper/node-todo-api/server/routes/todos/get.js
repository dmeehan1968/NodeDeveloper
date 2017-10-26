var { Todo } = require('../../models/todo');
var { authenticate } = require('../../middleware/authenticate');

module.exports = [
  authenticate,
  async (req, res) => {

    try {

      const todos = await Todo.find({ _creator: req.user._id });
      res.send({ todos });

    } catch(e) {

      res.status(400).send(e);

    }

  }
];
