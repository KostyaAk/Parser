import cherio from 'cherio'

import { getPageContent } from '../helpers/puppeteer.js';

export default async function listATCcode(url_atc, ATC_CODE) {//function to get an array of ATC codes
  try {
    const pageContent = await getPageContent(url_atc)//get web site content
    const $ = cherio.load(pageContent)

    $('.t').each((i, header) => {//go to the selector we need
      const title = $(header).text() + '';
      const len = title.length;
      if (len == 7) ATC_CODE.push(title);//write the result to the final array
    })
  }
  catch(err){
    throw err
  }
}
