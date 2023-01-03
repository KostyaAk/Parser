import events from 'events'
import listActiveSubstance from './handlers/listActiveSubstance.js'; 
import listATCcode from './handlers/listATCcode.js'; 
import rus_list_ATC_prep from './handlers/rus.js'; 
import chesh_list_ATC_prep from './handlers/chesh.js';
import twoFiles from './handlers/join_files.js';
import cluster from 'cluster';

const SITE_ATX = 'https://www.vidal.ru/drugs/atc';
const SITE = 'https://www.whocc.no/atc_ddd_index/?code=';
const SITE_RU = 'https://medum.ru/atc-';
const SITE_CH = 'https://mediately.co/cz/atcs/';

events.EventEmitter.prototype._maxListeners = 10;
const cpus = 5;

if (cluster.isPrimary) {
    console.log(`Number of CPUs is ${cpus}`);
    console.log(`Master ${process.pid} is running`);
   
    // Fork workers.
    for (let i = 0; i < cpus; i++) {
      cluster.fork();
    }
   
    cluster.on("exit", (worker) => {//Output to the console if the child process dies
      console.log(`worker ${worker.process.pid} died`);
    });
  } else {
    (async function main() {
      const url_atc = `${SITE_ATX}`;
      let ATC_CODE = [];

      await listATCcode(url_atc, ATC_CODE);//Function for filling the array with all possible АТС codes
      await listActiveSubstance(SITE, ATC_CODE, cluster.worker.id);//Function for filling the file with active substances according to their АТС code

      await rus_list_ATC_prep(SITE_RU, ATC_CODE, cluster.worker.id);//Function for filling the file with drug names according to the codes АТС
      await chesh_list_ATC_prep(SITE_CH, ATC_CODE, cluster.worker.id);//Function for filling the file with drug names according to the codes АТС

    })();
}

twoFiles('names_chesh.txt', 'active_substance1.txt');//Function for the final combination of two files containing pairs: АТС code - the name
twoFiles('names_preparaty.txt', 'active_substance1.txt');//of the drug and АТС code - the active substance, according to the common АТС code
