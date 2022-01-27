const fs = require("fs");
const logger = require("./logger");
const source = "./valcann/backupsFrom/";
const destiny = "./valcann/backupsTo/";

const minutes = (startDate, endDate) => {
  const ms = endDate.getTime() - startDate.getTime();
  const totalMinutes = Math.round(ms / 60000);

  return totalMinutes;
};

//list all files of a directory and write their info on a log file

const listFiles = (path) => {
  fs.readdir(path, (error, files) => {
    if (error) {
      console.log("Cannot scan directory: " + error);
      return;
    }

    files.forEach((file) => {
      let startDate, endDate, totalMinutes;

      fs.stat(path + file, (error, stats) => {
        if (error) {
          throw error;
        }

        let fileInfo = {
          name: file,
          size: stats.size,
          birth_date: stats.birthtime,
          last_modification_time: stats.mtime,
        };

        console.log(fileInfo);
        logger.info(fileInfo);

        startDate = new Date(stats.birthtime);
        endDate = new Date();
        totalMinutes = minutes(startDate, endDate);

        if (totalMinutes >= 4320) {
          fs.unlink(path + file, (error) => {
            if (error) {
              throw error;
            }
            //console.log("File " + file + " removed!");
          });
        } else {
          fs.copyFile(path + file, destiny + file, (error) => {
            if (error) {
              throw error;
            }

            //console.log("File " + file + " copied!");
            logger.silly(fileInfo);
          });
        }
      });
    });
  });
};

listFiles(source);
