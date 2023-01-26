#!/usr/bin/env node
import CapeLooter from "./CapeLooter.js";

// createSpinner('Checking...);
// sleep(500);
// if succes -> spinner.success({text: "Success!"});
// if error -> spinner.error({text: "Error!"});

let capeLooter = new CapeLooter();

await capeLooter.welcome();
await capeLooter.askWhatToDownload();
