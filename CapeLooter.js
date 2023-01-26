import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";

import axios from "axios";
import fs from "fs";

export default class CapeLooter {
    constructior() {
        this.files = [];
        this.cosmeticName = "";
    }

    async askWhatToDownload() {
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
                    name: "👤 Player config",
                    value: "config",
                },
                {
                    name: "❌ Exit",
                    value: "exit",
                },
            ],
        });

        switch (answers.name) {
            case "cosmetic":
                await this.askForCosmetic();
                await this.getCosmetic(this.cosmeticName);
                await this.downloadCosmetic(this.cosmeticName, this.files);
                await this.sleep(750);
                await this.askWhatToDownload();
                break;
            case "cape":
                await this.downloadCape();
                await this.sleep(750);
                await this.askWhatToDownload();
                break;
            case "config":
                await this.downloadConfig();
                await this.sleep(750);
                await this.askWhatToDownload();
                break;
            case "exit":
                console.log("Bye!");
                process.exit(0);
        }
    }

    async downloadCosmetic(cosmetic, files) {
        for (let i = 0; i < files.length; i++) {
            // if the file is texture -> downloadTexture(cosmetic);
            if (files[i] === "texture") this.downloadTexture(cosmetic);
            await this.sleep(750);
            // if the file is model -> downloadModel(cosmetic);
            if (files[i] === "model") this.downloadModel(cosmetic);
        }
    }

    async downloadTexture(cosmetic) {
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
                spinner.error({
                    text: chalk.red("Error ") + "while downloading files!",
                });
                console.log(error);
            });
    }

    async downloadModel(cosmetic) {
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
                spinner.error({
                    text: chalk.red("Error ") + "while downloading files!",
                });
                console.log(error);
            });
    }

    async downloadCape() {
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
                spinner.error({
                    text: chalk.red("Error ") + "while downloading files!",
                });
                console.log(error);
                return false;
            });
    }

    async downloadConfig() {
        const answers = await inquirer.prompt({
            name: "name",
            type: "input",
            message: "What's the player ign?",
            default() {
                return "j5on";
            },
        });

        const configName = answers.name;

        const spinner = createSpinner("Downloading...");
        spinner.start();

        // download config
        axios({
            method: "GET",
            url: `http://161.35.130.99/users/${configName}.cfg`,
            responseType: "stream",
        })
            .then((response) => {
                response.data.pipe(fs.createWriteStream(`${configName}.cfg`));
                spinner.success({ text: `Saved to ${configName}.cfg!` });
                return true;
            })
            .catch((error) => {
                spinner.error({
                    text: chalk.red("Error ") + "while downloading files!",
                });
                console.log(error);
                return false;
            });
    }

    async askForCosmetic() {
        const answers = await inquirer.prompt({
            name: "name",
            type: "input",
            message: "What's the name of the 🧛 that you want?",
            default() {
                return "creeper";
            },
        });

        this.cosmeticName = answers.name;
    }

    async getCosmetic(cosmetic) {
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

        this.files = cosmeticFiles;
    }

    async welcome() {
        const rainbowTitle = chalkAnimation.rainbow(
            "Welcome to Cape Looter! \n"
        );

        await this.sleep(500);
        rainbowTitle.stop();

        console.log(`${chalk.bold("🚨 Cape Looter 🚨")}
    ${chalk.bold("🛠️ Version:")} 1.1.0
    ${chalk.bold("👤 Author:")} j5on#9600
    ${chalk.bold("📣 Cloaks+ discord:")} https://discord.gg/cloaks
    ${chalk.bold("Drop a ⭐:")} https://github.com/bartosz-skejcik/cape-looter
    `);
    }

    sleep(ms = 2000) {
        return new Promise((r) => setTimeout(r, ms));
    }
}