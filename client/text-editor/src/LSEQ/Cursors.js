
const USER_COLORS = ['blue', 'green', 'red', 'orange','purple','amber','teal']; 
class Cursors {
  constructor(userID,index,length, userCount) {
    this.userID = userID;
    this.index = index;
    this.length = length;
    this.color = userCount <= 7 ? USER_COLORS[userCount] : USER_COLORS[0];
    this.name = userID;
  }

  updateRange(index, length) {
    this.index = index;
    this.length = length;
  }
}

export default Cursors;
