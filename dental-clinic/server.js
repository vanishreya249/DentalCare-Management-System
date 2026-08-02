const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const csvFilePath = path.join(__dirname, 'appointments.csv');

// Setup standard CSV writer logic
const getCsvWriter = () => {
    return createObjectCsvWriter({
        path: csvFilePath,
        header: [
            { id: 'name', title: 'Name' },
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Phone' },
            { id: 'service', title: 'Service' },
            { id: 'date', title: 'Date' },
            { id: 'submittedAt', title: 'Request Submitted At' }
        ],
        append: fs.existsSync(csvFilePath) // if it exists, append to it rather than recreating headers
    });
};

app.post('/api/appointments', async (req, res) => {
    try {
        const { name, email, phone, service, date } = req.body;

        const record = {
            name: name || '',
            email: email || '',
            phone: phone || '',
            service: service || '',
            date: date || '',
            submittedAt: new Date().toLocaleString()
        };

        const csvWriter = getCsvWriter();
        await csvWriter.writeRecords([record]);

        console.log(`\n✅ New appointment request received from ${name}! Saved to appointments.csv`);
        res.status(200).json({ message: 'Appointment successfully saved to Excel sheet' });
    } catch (error) {
        console.error('Error saving to CSV:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`\n🏥 Dental Clinic Backend running on http://localhost:${PORT}`);
    console.log(`📋 Client appointment data will safely save to the Excel-compatible file:`);
    console.log(`➡ ${csvFilePath}`);
});
