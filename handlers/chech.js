import cherio from "cherio";
import chalk from "chalk";
import fs from "fs";
import { getPageContent } from "../helpers/puppeteer.js";

export default async function chesh_list_ATC_prep(site, data, id) {//Function for reading data in Czech
  try {
    const file = fs.createWriteStream("names_chesh_second.txt", { flags: "a" });//create a final file to store data: ATC code -- medecin name
    
    for (let i = id - 1; i < data.length; i = i + 5) {//loop through each ATC code and get relevant data
      const atcCode = data[i];
      const url = site + atcCode;
      console.log(chalk.green(`Getting data from: `) + chalk.green.bold(url), "DATA:", i);

      const detailContent = await getPageContent(url);//get wes site content
      const $ = cherio.load(detailContent);
      $('.sc-6dcab36a-2')//go to the selector we need
      .children('strong')
      .each((i, header) =>{
          let name = $(header).text() + '';
          file.write(atcCode + '; ' + name + '\n');//write the result to a file
      });
    }
  } catch (err) {
    throw err;
  }
}
