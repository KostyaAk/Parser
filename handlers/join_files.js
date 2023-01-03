import fs from 'fs';

function syncReadFile (filename) {
    return fs.readFileSync(filename).toString('utf-8').split('\n');
}

export default async function twoFiles(file1, file2) {//function for combining files into one
  try {
    const file = fs.createWriteStream("result_chesh.txt", { flags: "a" });//create a final file
    let arr_names = syncReadFile(file1);//read the data from the file into an array for further work
    let arr_active = syncReadFile(file2);//read the data from the file into an array for further work

    let new_arr_names = arr_names.sort().map((el) => el.split("; "));//dividing the first array into subarrays of the form [atc code, name]
    let new_arr_active = arr_active.sort().map((el) => el.split("; "));//dividing the second array into subarrays of the form [atc code, active]

    //go through the array with names, looking for a match by the ATC code from the second array
    for (let i = 0; i < new_arr_names.length; i++) {
      let temp_i = new_arr_names[i];
      
      for (let j = 0; j < new_arr_active.length; j++) {
        let temp_j = new_arr_active[j];
        
        if (temp_i[0] == temp_j[0]) {
          file.write(temp_i[1] + "; " + temp_j[1] + '\n');//write the result to the final file
          continue;
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}
