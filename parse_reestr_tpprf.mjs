// Оксана попросила найти парсер для reestr.tpprf.ru, и я решил просто быстро написать его на коленке =)

import axios from 'axios';
import { parse } from 'node-html-parser';
import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { mkConfig, generateCsv, asString } from 'export-to-csv';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const writeRes = (res) => {
  const csvConfig = mkConfig({ useKeysAsHeaders: true });
  const csvdata = generateCsv(csvConfig)(res);
  const csvBuffer = new Uint8Array(Buffer.from(asString(csvdata)));

  return writeFile(`${dirname}\\result.csv`, csvBuffer)
    .then(() => writeFile(`${dirname}\\result.json`, JSON.stringify(res)))
    .then(() => console.log('done'))
    .catch((error) => {
      console.log('cant write in file');
      console.error(error);
    });
};

const getData = (page) =>
  axios.get(`https://reestr.tpprf.ru/?PAGEN_1=${page}`).then((res) => {
    const root = parse(
      res.data.replaceAll(/\s\s/g, '').replaceAll(/\n/g, '').replaceAll(),
    );
    return [...root.querySelectorAll('.table_reestor tbody tr')].map(
      (row, index) => ({
        name: row.querySelector('td:nth-child(1)')?.textContent,
        link: `https://reestr.tpprf.ru${row
          .querySelector('td:nth-child(1) a')
          ?.getAttribute('href')}`,
        svidetelstvo: row.querySelector('td:nth-child(2)')?.textContent,
        dateOfIssue: row.querySelector('td:nth-child(3)')?.textContent,
        direction: row.querySelector('td:nth-child(4)')?.textContent,
        contacts: row
          .querySelector('td:nth-child(5)')
          ?.textContent.replaceAll(/\n/g, ';'),
      }),
    );
  });

let res = [];

for (let i = 0; i <= 34; i++) {
  console.log(`getting data for ${i}`);
  const data = await getData(i);
  res = [...res, ...data];
}

await writeRes(res);
