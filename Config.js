import fs from "fs";
import path from "path";

export default class Config {
    constructor() {
        this.configObject = {
            downloadPath: this.getOS().home + "/.capelooter/downloads",
            configPath: this.getOS().home + "/.capelooter/config.json",
        };
        this.file = this.initConfig();
        this.config = this.readConfig();
    }

    readConfig() {
        try {
            const config = fs.readFileSync(this.file, "utf8");
            return JSON.parse(config);
        } catch (error) {
            console.log(error);
        }
    }

    getOS() {
        const os = process.platform;
        switch (os) {
            case "win32":
                return {
                    os: "win32",
                    home: process.env.HOMEPATH,
                };
            case "darwin":
                return {
                    os: "darwin",
                    home: process.env.HOME,
                };
            case "linux":
                return {
                    os: "linux",
                    home: process.env.HOME,
                };
            default:
                return {
                    os: "unknown",
                    home: process.env.HOME,
                };
        }
    }

    initConfig() {
        // create a folder named .capelooter in the user's home directory
        // the home directory is based on the OS
        const home = process.env.HOME || process.env.HOMEPATH;
        const folder = path.join(home, ".capelooter");
        const file = path.join(folder, "config.json");

        try {
            // check if the folder exists
            if (!fs.existsSync(folder)) {
                // if not, create it
                fs.mkdirSync(folder);
            }
            // check if the file exists
            if (!fs.existsSync(file)) {
                const data = JSON.stringify(this.configObject);
                fs.writeFileSync(file, data);
            }
            // check if the downloads folder exists
            if (!fs.existsSync(this.configObject.downloadPath)) {
                // if not, create it
                fs.mkdirSync(this.configObject.downloadPath);
            }

            return file;
        } catch (error) {
            console.log(error);
        }
    }

    writeConfig() {
        try {
            // write the config to the file
            const config = JSON.stringify(this.configObject, null, 4);

            const file = fs.writeFileSync(this.file, config);
            return file;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @param {string} path
     */
    set downloadPath(path) {
        this.configObject.downloadPath = path;
        this.writeConfig();
    }

    get downloadPath() {
        return this.configObject.downloadPath;
    }

    isValidPath(path) {
        try {
            fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
            return true;
        } catch (error) {
            return false;
        }
    }
}
