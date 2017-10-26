const _ = require('lodash');
var { User } = require('../../models/user');

module.exports = [

  async (req, res) => {

    try {

      var body = _.pick(req.body, [ 'email', 'password' ]);
      var user = new User(body);

      await user.save();
      const token = await user.generateAuthToken();
      res.header('x-auth', token).send(user);

    } catch(e) {

      res.status(400).send(e);

    }

  }

];
