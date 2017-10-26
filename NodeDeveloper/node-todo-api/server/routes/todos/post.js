var { Todo } = require('../../models/todo');
var { authenticate } = require('../../middleware/authenticate');

module.exports = [
  authenticate,
  async (req, res) => {

   try {

     var todo = new Todo({
       text: req.body.text,
       _creator: req.user._id
     });

     const doc = await todo.save();
     res.send(doc);

   } catch(e) {

     res.status(400).send(e);

   }

  }
];
