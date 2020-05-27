const fs = require("fs");

var data = "";
for (var i = 1; i <= 217; i++) {
  // console.log(i + " - ");
  data += "\n" + i + " - ";
}

// Write data in 'Output.txt' .
fs.writeFile("Output.txt", data, err => {
  // In case of a error throw err.
  if (err) throw err;
});
