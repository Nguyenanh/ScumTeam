function UserStory() {

}
UserStory.prototype.Create_chart = function (user_story, socket) {
  socket.emit('add_user_story', user_story);
}