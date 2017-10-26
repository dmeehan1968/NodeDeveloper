const _ = require('lodash');
var { User } = require('../../../models/user');

module.exports = [
  async (req, res) => {

    try {

      var body = _.pick(req.body, [ 'email', 'password' ]);
      var user = await User.findByCredentials(body.email, body.password);
      var token = await user.generateAuthToken();

      res.set('x-auth', token).send(user);

    } catch(e) {

      res.status(400).send();

    }

  }
];
