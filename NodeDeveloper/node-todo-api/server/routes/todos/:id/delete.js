var { mongoose } = require('../../../db/mongoose');
var { Todo } = require('../../../models/todo');
var { authenticate } = require('../../../middleware/authenticate');

module.exports = [
  authenticate,
  async (req, res) => {

    try {

      var id = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send();
      }

      const todo = await Todo.findOneAndRemove({
          _id: id,
          _creator: req.user._id
        });

      if (!todo) {
        return res.status(404).send();
      }

      res.status(200).send({ todo });

    } catch(e) {

      res.status(404).send();

    }

  }
];
