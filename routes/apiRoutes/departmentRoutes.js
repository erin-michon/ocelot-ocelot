const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// get all dept
router.get('/department', (req, res) => {
    const sql = `SELECT * FROM department`;

    db.query(sql, (err, rows) => {
        if (err) {
        res.status(500).json({ error: err.message });
        return;
        }
        res.json({
        message: 'success',
        data: rows
        });
    });
});


// add dept
router.post('/department', ({ body }, res) => {
    const errors = inputCheck(
        body,
        'name'
    );
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }

    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = [
        body.name
    ];

    db.query(sql, params, (err, result) => {
        if (err) {
        res.status(400).json({ error: err.message });
        return;
        }
        res.json({
        message: 'success',
        data: body
        });
    });
});


// delete dept
router.delete('/department/:id', (req, res) => {
    const sql = `DELETE FROM department WHERE id = ?`;

    db.query(sql, req.params.id, (err, result) => {
        if (err) {
        res.status(400).json({ error: res.message });
        } else if (!result.affectedRows) {
        res.json({
            message: 'Department not found'
        });
        } else {
        res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id
        });
        }
    });
});


// view employees by dept


// view total salaries by dept

module.exports = router;