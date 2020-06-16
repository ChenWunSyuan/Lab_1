var express = require('express')
var app = express()

app.get('/', function (req, res, next) {
    req.getConnection(function (error, conn) {
        conn.query('SELECT * FROM my_schedule ORDER BY id DESC', function (err, rows, fields) {
            if (err) {
                req.flash('error', err)
                res.render('user/list', {
                    title: 'Event List',
                    data: ''
                })
            } else {
                res.render('user/list', {
                    title: 'Event List',
                    data: rows
                })
            }
        })
    })
})

app.get('/add', function (req, res, next) {
    res.render('user/add', {
        title: 'Add New Event',
        start_date: '',
        end_date: '',
        event: ''
    })
})

app.post('/add', function (req, res, next) {
    req.assert('start_date', 'Start Time is required').notEmpty()
    req.assert('end_date', 'End Time is required').notEmpty()
    req.assert('event', 'Event Detail is required').notEmpty()
    var errors = req.validationErrors()
    if (!errors) {
        var user = {
            start_date: req.sanitize('start_date').escape().trim(),
            end_date: req.sanitize('end_date').escape().trim(),
            event: req.sanitize('event').escape().trim()
        }
        req.getConnection(function (error, conn) {
            conn.query('INSERT INTO my_schedule SET ?', user, function (err, result) {
                if (err) {
                    req.flash('error', err)
                    res.render('user/add', {
                        title: 'Add New Event',
                        start_date: user.start_date,
                        end_date: user.end_date,
                        event: user.event
                    })
                } else {
                    req.flash('success', 'Data added successfully!')
                    res.render('user/add', {
                        title: 'Add New Event',
                        start_date: '',
                        end_date: '',
                        event: ''
                    })
                }
            })
        })
    } else {
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '< br > '
        })
        req.flash('error', error_msg)
        res.render('user/add', {
            title: 'Add New Event',
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            event: req.body.event
        })
    }
})

app.get('/edit/(:id)', function (req, res, next) {
    req.getConnection(function (error, conn) {
        conn.query('SELECT * FROM my_schedule WHERE id = ' + req.params.id, function (err, rows, fields) {
            if (err) throw err
            if (rows.length <= 0) {
                req.flash('error', 'Event not found with id = ' + req.params.id)
                res.redirect('/user')
            } else {
                res.render('user/edit', {
                    title: 'Edit Event',
                    data: rows[0],
                    id: rows[0].id,
                    start_date: rows[0].start_date,
                    end_date: rows[0].end_date,
                    event: rows[0].event
                })
            }
        })
    })
})

app.put('/edit/(:id)', function (req, res, next) {
    req.assert('start_date', 'Start Time is required').notEmpty()
    req.assert('end_date', 'End Time is required').notEmpty()
    req.assert('event', 'Event Detail is required').notEmpty()
    var errors = req.validationErrors()
    if (!errors) {
        var user = {
            start_date: req.sanitize('start_date').escape().trim(),
            end_date: req.sanitize('end_date').escape().trim(),
            event: req.sanitize('event').escape().trim()
        }
        req.getConnection(function (error, conn) {
            conn.query('UPDATE my_schedule SET ? WHERE id = ' + req.params.id, user, function (err, result) {
                if (err) {
                    req.flash('error', err)
                    res.render('user/edit', {
                        title: 'Edit Event',
                        id: req.params.id,
                        start_date: req.body.start_date,
                        end_date: req.body.end_date,
                        event: req.body.event
                    })
                } else {
                    req.flash('success', 'Data updated successfully!')
                    res.render('user/edit', {
                        title: 'Edit Event',
                        id: req.params.id,
                        start_date: req.body.start_date,
                        end_date: req.body.end_date,
                        event: req.body.event
                    })
                }
            })
        })
    } else {
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        res.render('user/edit', {
            title: 'Edit Event',
            id: req.params.id,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            event: req.body.event
        })
    }
})

app.delete('/delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id }
    req.getConnection(function (error, conn) {
        conn.query('DELETE FROM my_schedule WHERE id = ' + req.params.id, user, function (err, result) {
            if (err) {
                req.flash('error', err)
                res.redirect('/user')
            } else {
                req.flash('success', 'User deleted successfully! id = ' + req.params.id)
                res.redirect('/user')
            }
        })
    })
})

module.exports = app