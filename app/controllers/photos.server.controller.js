var mongoose = require('mongoose'),
	Todo = mongoose.model('Todo');

var multer = require('multer');

/**
 * Photo URL generator
 */
function photoUrl(id, mimeType, timestamp) {
  var ext = mimeType.split('/')[1].toLowerCase().replace('jpeg', 'jpg');
  var url = 'api/todos/' + id + '/photo.' + ext;
  if (timestamp) {
    url += '?' + String(Math.floor(Date.now() / 1000));
  }
  return url;
}

/**
* Upload photograph
*/
exports.save = function(req, res, next) {

    //Get club and file
    var todo = req.todo;
    var file = req.file;

    //Update
    todo.photograph = {
      url: photoUrl(todo._id, file.mimetype, true),
      data: file.buffer,
      mimeType: file.mimetype
    };

    //Save
    todo.save().then(function() {
      res.end();
    }).catch(next);
};

/**
* Stream photograph
*/
exports.stream = function(req, res, next) {
    var todo = req.todo;
    res.contentType(todo.photograph.mimeType);
    res.send(todo.photograph.data);
};

/**
* Upload middleware
*/
exports.upload = function(req, res, next) {

    //Create upload middleware
    var upload = multer({
        storage: multer.memoryStorage(),
        limits: {
            fileSize: 50000000
        }
    }).single('photograph');

    //Use middleware
    upload(req, res, next);
};
