const { spawn } = require("child_process");

const child = spawn("cmd.exe", ["/c", "echo", "hello"], { shell: true });

child.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

child.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

child.on("error", (error) => {
  console.error(`error: ${error}`);
});
