const users = [{
  id: 1,
  name: 'Andrew',
  schoolId: 101
},
{
  id: 2,
  name: 'Dave',
  schoolId: 999
}];

const grades = [{
  id: 1,
  schoolId: 101,
  grade: 86
},
{
  id: 2,
  schoolId: 999,
  grade: 100
},
{
  id: 3,
  schoolId: 101,
  grade: 80
}];

const getUser = async (id) => {

  const user = users.find((user) => user.id === id);
  if (user) {
    return user;
  }

  throw new Error(`Unable to find user with id ${id}`);

};

const getGrades = async (schoolId) => {

  return grades.filter((grade) => grade.schoolId === schoolId);

};

const getStatus = async (userId) => {

  const user = await getUser(userId);
  const grades = await getGrades(user.schoolId);

  let average = 0;

  if (grades.length > 0) {
    average = (grades
      .map((grade) => grade.grade)
      .reduce((a, b) => a + b))
      / grades.length;
  }

  return `${user.name} has an average of ${average}`;

};

getStatus(1).then((status) => {
  console.log(status);
}).catch((e) => {
  console.log(e.message);
});


// getStatus(1).then((status) => {
//   console.log(status);
// }).catch((e) => {
//   console.log(e);
// });
