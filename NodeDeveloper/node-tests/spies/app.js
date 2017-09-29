let db = require('./db');

module.exports.handleSignup = (email, password) => {

    // check if the email already exists

    // save the user to the database
    db.saveUser({ email, password });

    // send welcome email

};
