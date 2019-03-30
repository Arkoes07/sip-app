const express = require('express');

const app = express();

// initialize body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/pos', require('./routes/api/pos'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));