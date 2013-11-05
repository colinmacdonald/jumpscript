var goinstant = window.goinstant;
var UserList = goinstant.widgets.UserList;

var $ = window.$;

function connect(cb) {

  var url = "https://goinstant.net/cmac/app";
  var platform = new goinstant.Platform(url);

  platform.connect(function(err) {
    if (err) {
      throw err;
    }

    console.log('connected');

    var room = platform.room('retail');
    room.join(function(err) {
      if (err) {
        throw err;
      }

      var locationKey = null;

      room.user(function(err, userObj) {
        var id = userObj.id;
        locationKey = room.key('location/' + id);
        locationKey.set(window.location.href);
      });

      console.log('joined room');

      var userList = new UserList({ room: room });
      userList.initialize(function(err) {
        if (err) {
          throw err;
        }

        console.log('userlist initialized');
        cb(room);

      });
    });
  });
}

$(document).ready(function() {
  connect(function(room) {
    $('.gi-inner').on('click', function(event) {
      var target = $(event.target);
      var targetId = target.parent().attr('data-goinstant-id');
      var targetLocation = null;
      room.key('location/' + targetId).get(function(err, val, context) {
        if (err) {
          throw err;
        }

        targetLocation = val;

        if (window.location.href != targetLocation) {
          window.location = targetLocation;
        }
      });
    });
  });
});
