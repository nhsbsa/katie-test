// External dependencies
const express = require('express');
const router = express.Router();


// Add your routes here - above the module.exports line


// CLEAR DATA
router.post('/clear-data', function (req, res) {
    req.session.destroy()
    res.redirect('/')
})

// ****************************************
// Route File Versions
// ****************************************

router.use('/v1', require('./views/v1/_routes'));


module.exports = router;
