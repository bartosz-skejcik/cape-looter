#!/usr/bin/env node
import CapeLooter from "./CapeLooter.js";
import Config from "./Config.js";

// createSpinner('Checking...);
// sleep(500);
// if succes -> spinner.success({text: "Success!"});
// if error -> spinner.error({text: "Error!"});

let config = new Config();
let capeLooter = new CapeLooter(config);

await capeLooter.welcome();
await capeLooter.askWhatToDownload();
