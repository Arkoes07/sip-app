const express = require('express'); 
const client = require('../../config/db');

const router = express.Router();
client.connect();

router.get('/', (req, res) => {
    client.query('SELECT * FROM realtime', (err, result) => {
        if(err){
            return res.status(400).json({ err: 'cannot proceed request, something bad happened' })
        }else{
            res.json(result.rows);
        }
    });
});

router.post('/', (req, res) => {
    const text = 'INSERT INTO realtime (title) values ($1) RETURNING *';
    const values = [req.body.title];
    client.query(text, values, (err, result) => {
        if(err){
            return res.status(400).json({ err: 'cannot proceed request, something bad happened' })
        }else{
            res.json(result.rows);
        }
    });
});

router.put('/:id', (req, res) => {
    const text = 'UPDATE realtime SET title = $1 WHERE id = $2 RETURNING *';
    const values = [req.body.title,req.params.id];
    client.query(text, values, (err, result) => {
        if(err){
            return res.status(400).json({ err: 'cannot proceed request, something bad happened' })
        }else{
            res.json(result.rows);
        }
    });
})

router.delete('/:id', (req, res) => {
    const text = 'DELETE FROM realtime WHERE id = $1';
    const values = [req.params.id];
    client.query(text, values, (err, result) => {
        if(err){
            return res.status(400).json({ err: 'cannot proceed request, something bad happened' })
        }else{
            res.json({ msg: 'deleted succesfully' })
        }
    });
});

module.exports = router;

