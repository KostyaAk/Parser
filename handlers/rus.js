import cherio from 'cherio'
import chalk from 'chalk'
import fs from "fs";
import { getPageContent } from '../helpers/puppeteer.js';

export default async function rus_list_ATC_prep(url, data, id) {//Function for reading data in Russian
  try {
    const file = fs.createWriteStream("drugs_new.txt", { flags: "a" });//create a final file to store data: ATC code -- medecin name

    for (let i = id - 1; i < data.length; i = i + 5) {//loop through each ATC code and get relevant data
      const initialData = data[i];
      const urlDrug = url + initialData;
      console.log(chalk.green(`Getting data from: `) + chalk.green.bold(urlDrug), "DATA:", i);//beutiful output in console to check the process

      const detailContent = await getPageContent(urlDrug);//get wes site content
      let bol = false;
      const $ = cherio.load(detailContent);

      $(".link").each((i, header) => {//go to the selector we need
        const title = $(header).text() + "";
        file.write(initialData + "; " + check(title) + "\n");
        bol = true;
      });

      if (bol == false) {//go to the selector we need
        let active_sub = $("div#ingredients")
          .children("ul")
          .children("li")
          .children("a")
          .text();

        if (active_sub != "") {
          file.write(initialData + "; " + check(active_sub) + "\n");//write the result to a file
          bol = false;
        }
      }
    }
  }
  catch(err){
    throw err;
  }
}

function check(str) {
  let newstr = str.replace(/[^а-яёА-ЯЁ ]/g,"");
  
  return newstr;
}
