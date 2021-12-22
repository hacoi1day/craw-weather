import axios from "axios";
import moment from "moment"
import { ExportToCsv } from 'export-to-csv';
import fs from "fs"
import sleep from "sleep"

let start = moment("2019-01-01", "YYYY-MM-DD")
let end = moment("2021-12-01", "YYYY-MM-DD")

const getData = async (dateStr) => {
    const res = await axios.get(`https://d.meteostat.net/app/proxy/point/hourly?lat=15.89&lon=108.26&alt=15&tz=Asia/Ho_Chi_Minh&start=${dateStr}&end=${dateStr}`)
    if (res.data && res.data.data) {
        let data = res.data.data;
        let options = { 
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalSeparator: '.',
            showLabels: true, 
            useTextFile: false,
            useBom: true,
            useKeysAsHeaders: true,
        };
        let csvExporter = new ExportToCsv(options);
        let csv = csvExporter.generateCsv(data, true);
        await fs.writeFileSync(`data/${dateStr}.csv`, csv)
    }
}

(async () => {
    do {
        let dateStr = start.format("YYYY-MM-DD")
        console.log(dateStr)
        await getData(dateStr)
        await sleep.sleep(5)
        start.add(1, 'days')
    } while(start < end)
})()