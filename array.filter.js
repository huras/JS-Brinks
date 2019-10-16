let array = [
  {
    name: "Huras",
    age: 26,
    born_in: 1992,
    subscribed: false
  },
  {
    name: "Paulo",
    age: 14,
    born_in: 1994,
    subscribed: true
  },
  {
    name: "Lucia",
    age: 27,
    born_in: 1991,
    subscribed: true
  },
  {
    name: "Flavia",
    age: 13,
    born_in: 1995,
    subscribed: undefined
  }
];

let colors = ["blue", "yellow", "red", "green", "orange", "dark blue"];

let underages = array.filter((element, index, array) => {
  return element.age < 18;
});

let search = (arr, query) => {
  return arr.filter(item => {
    return item.toLowerCase().indexOf(query.toLowerCase()) > -1;
  });
};

console.log(underages);
console.log(search(colors, "blue"));
