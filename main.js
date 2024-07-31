const fs = require('fs');
const fastCsv = require('fast-csv');

// Data yang akan ditulis ke file CSV sebagai objek
const message = "data";
const timestamp = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();
console.log(timestamp + ";" + message);

const dataIoT = { timestamp: timestamp, message: message };


async function appendDataToCsv(file, data) {
    try {
        const csvString = await fastCsv.writeToString([data], { headers: false });
        fs.appendFile(file, csvString + '\n', (err) => {
            if (err) {
                console.error('Terjadi kesalahan saat menyimpan data:', err);
            }
        });
    } catch (error) {
        console.error('Terjadi kesalahan saat mengkonversi data ke CSV:', error);
    }
}

// Menulis header ke file CSV jika file belum ada
async function writeHeaderIfNotExists(file) {
    if (!fs.existsSync(file)) {
        try {
            const headerString = await fastCsv.writeToString([{ timestamp: 'Timestamp', message: 'Message' }], { headers: true });
            fs.writeFileSync(file, headerString + '\n'); // Tambahkan newline setelah header
        } catch (error) {
            console.error('Terjadi kesalahan saat menulis header:', error);
        }
    }
}

const csvFile = 'data.csv';

// Tulis header jika file belum ada
writeHeaderIfNotExists(csvFile)
    .then(() => {
        // Tambahkan data baru ke file CSV
        appendDataToCsv(csvFile, dataIoT);
    });
