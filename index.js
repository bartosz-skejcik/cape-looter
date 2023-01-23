#!/usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";

import axios from "axios";
import fs from "fs";

// createSpinner('Checking...);
// sleep(500);
// if succes -> spinner.success({text: "Success!"});
// if error -> spinner.error({text: "Error!"});

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow("Welcome to Cape Stealer! \n");

    await sleep(500);
    rainbowTitle.stop();

    console.log(`${chalk.bold("🚨 Cape Stealer 🚨")}
${chalk.bold("🛠️ Version:")} 1.0.0
${chalk.bold("👤 Author:")} j5on#9600
${chalk.bold("Drop a ⭐:")} https://github.com/bartosz-skejcik/cape-stealer
`);
}

async function getCosmetic(cosmetic) {
    const answers = await inquirer.prompt({
        name: "name",
        type: "checkbox",
        message: `What cosmetic 📁 do you want to download for ${chalk.blue(
            cosmetic
        )}?`,
        choices: [
            {
                name: "texture",
                checked: false,
            },
            {
                name: "model",
                checked: false,
            },
        ],
    });

    let cosmeticFiles = answers.name;

    if (cosmeticFiles.length === 0) {
        console.log(chalk.red("You have to choose at least one file!"));
        process.exit(1);
    }

    return cosmeticFiles;
}

async function askForCosmetic() {
    const answers = await inquirer.prompt({
        name: "name",
        type: "input",
        message: "What's the name of the 🧛 that you want?",
        default() {
            return "creeper";
        },
    });

    return answers.name;
}

async function downloadModel(cosmetic) {
    const spinner = createSpinner("Downloading...");
    spinner.start();

    // download model
    axios({
        method: "GET",
        url: `http://161.35.130.99/items/${cosmetic}/model.cfg`,
        responseType: "stream",
    })
        .then((response) => {
            response.data.pipe(fs.createWriteStream(`${cosmetic}.cfg`));
            spinner.success({ text: `Saved to ${cosmetic}.cfg!` });
        })
        .catch((error) => {
            spinner.error({ text: "Error!" });
            console.log(error);
        });
}

async function downloadTexture(cosmetic) {
    const spinner = createSpinner("Downloading...");
    spinner.start();

    // download texture
    axios({
        method: "GET",
        url: `http://161.35.130.99/items/${cosmetic}/texture.png`,
        responseType: "stream",
    })
        .then((response) => {
            response.data.pipe(fs.createWriteStream(`${cosmetic}.png`));
            spinner.success({ text: `Saved to ${cosmetic}.png!` });
        })
        .catch((error) => {
            spinner.error({ text: "Error!" });
            console.log(error);
        });
}

async function downloadCosmetic(cosmetic, files) {
    for (let i = 0; i < files.length; i++) {
        // if the file is texture -> downloadTexture(cosmetic);
        if (files[i] === "texture") downloadTexture(cosmetic);
        await sleep(750);
        // if the file is model -> downloadModel(cosmetic);
        if (files[i] === "model") downloadModel(cosmetic);
    }
}

async function downloadCape() {
    const answers = await inquirer.prompt({
        name: "name",
        type: "input",
        message: "What's your ign?",
        default() {
            return "j5on";
        },
    });

    const capeName = answers.name;

    const spinner = createSpinner("Downloading...");
    spinner.start();

    // download cape
    axios({
        method: "GET",
        url: `http://161.35.130.99/capes/${capeName}.png`,
        responseType: "stream",
    })
        .then((response) => {
            response.data.pipe(fs.createWriteStream(`${capeName}.png`));
            spinner.success({ text: `Saved to ${capeName}.png!` });
            return true;
        })
        .catch((error) => {
            spinner.error({ text: "Error!" });
            console.log(error);
            return false;
        });
}

async function askWhatToDownload() {
    const answers = await inquirer.prompt({
        name: "name",
        type: "list",
        message: "What do you want to download?",
        choices: [
            {
                name: "🧛 Cosmetic",
                value: "cosmetic",
            },
            {
                name: "📕 Cape",
                value: "cape",
            },
            {
                name: "❌ Exit",
                value: "exit",
            },
        ],
    });

    switch (answers.name) {
        case "cosmetic":
            const cosmeticName = await askForCosmetic();
            const cosmeticFiles = await getCosmetic(cosmeticName);
            await downloadCosmetic(cosmeticName, cosmeticFiles);
            await sleep(500);
            await askWhatToDownload();
            break;
        case "cape":
            await downloadCape();
            await sleep(500);
            await askWhatToDownload();
            break;
        case "exit":
            console.log("Bye!");
            process.exit(0);
    }
}

await welcome();
await askWhatToDownload();
