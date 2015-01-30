var async = require('async')
  , crypto = require('crypto');

var mongoose = require('lib/mongoose')
  , Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true
  },
  username: {type: String, lowercase: true},
  firstname: {type: String},
  lastname: {type: String},
  phone: {type: String},
  secret: {type: String},
  role: {type: String, default: 'shipper'},
  hashedPassword: {type: String, required: true},
  salt: {type: String, required: true},
  created: {type: Date},
  updated: {type: Date},
  status: {type: Boolean, default: true},
  ip: {type: String}
});


userSchema.pre('save', function (next) {
  var user = this;

  if (!user.created) {
    user.created = Date.now();
  }

  //Continue with the save operation
  next();
});

userSchema.methods.encryptPassword = function (password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

userSchema.virtual('password')
  .set(function (password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function () {
    return this._plainPassword;
  });

userSchema.methods.checkPassword = function (password) {
  return this.encryptPassword(password) == this.hashedPassword;
};

userSchema.statics.authorize = function (email, password, callback) {
  var User = this;

  async.waterfall([
    function (callback) {
      User.findOne({email: email}, callback)
    },
    function (user, callback) {
      if (user) {
        if (user.checkPassword(password)) {
          callback(null, user);
        } else {
          callback("Wrong Password");
        }
      } else {
        callback("Auth Error");
      }
    }
  ], callback);
};

module.exports = mongoose.model('User', userSchema);