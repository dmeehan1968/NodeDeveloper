var square = (x) => x * x;

console.log(square(9));


var user = {
  name: 'Andrew',
  sayHi() {
    console.log(`Hi.  I'm ${this.name}`);
  }
};

user.sayHi();
