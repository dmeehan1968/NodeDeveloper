const _ = require('lodash');

var { mongoose } = require('../../../db/mongoose');
var { Todo } = require('../../../models/todo');
var { authenticate } = require('../../../middleware/authenticate');

module.exports = [
  authenticate,
  async (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, [ 'text', 'completed' ]);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
      body.completedAt = new Date().getTime();
    } else {
      body.completed = false;
      body.completedAt = null;
    }

    try {

      const todo = await Todo.findOneAndUpdate({
          _id: id,
          _creator: req.user._id
        }, {
          $set: body
        },
        { new: true });

      if (!todo) {
        return res.status(404).send();
      }

      res.send({ todo });

    } catch (e) {

      res.status(404).send();

    }

  }
];
