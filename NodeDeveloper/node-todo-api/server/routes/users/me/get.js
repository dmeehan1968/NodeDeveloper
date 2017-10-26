const { authenticate } = require('../../../middleware/authenticate');

module.exports = [
  authenticate,
  (req, res) => {

      res.send(req.user);

  }
];
