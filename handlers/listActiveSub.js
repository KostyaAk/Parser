import cherio from "cherio";
import chalk from "chalk";
import fs from "fs";
import { getPageContent } from "../helpers/puppeteer.js";

export default async function listActiveSubstance(site, data, id) {//Function for reading data in Czech
  try {
    const file = fs.createWriteStream("active_substance1.txt", { flags: "a" });//create a final file to store data: ATC code -- active

    for (let i = id - 1; i < data.length; i = i + 5) {//loop through each ATC code and get relevant data
      const initialData = data[i];
      const url = site + initialData;
      console.log(chalk.green(`Getting data from: `) + chalk.green.bold(url), "DATA:", i);

      const detailContent = await getPageContent(url);//get wes site content

      const $ = cherio.load(detailContent);
      const active_substance = $("div#content")//go to the selector we need
        .children("ul")
        .children("table")
        .children("tbody")
        .children("tr")
        .children("td")
        .children("a")
        .text();
    
      file.write(initialData + " : " + active_substance + "\n");//write the result to a file
    }
  } catch (err) {
    throw err;
  }
}
