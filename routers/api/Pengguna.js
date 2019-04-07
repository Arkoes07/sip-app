const bcrypt = require('bcrypt')
const Router = require('../Router')

const jwt = require('jsonwebtoken')

class Pengguna extends Router {

    getServices() {
        return {
            'POST /login'    : 'userLogin',
            'POST /signup'   : 'userSignup'
        }
    }

    userLogin(req, res) {
        const { username, password } = req.body
        const text = "SELECT * FROM Pengguna WHERE username = $1"
        const value = [username]
        this.client.query(text, value, (err, result) => {
            if(err){
                return res.status(400).json({ err : err.detail })
            }else{
                if(!result.rows[0]){
                    return res.status(400).json({ err : "Pengguna tidak ditemukan" })
                }else{
                    bcrypt.compare(password, result.rows[0].password, (err, same) => {
                        if(err){
                            return res.status(400).json({ err: err.detail })
                        }else{
                            if(!same){
                                return res.status(400).json({ err : "Password Salah" })
                            }else{
                                const user = {
                                    username,
                                    jenisUser : result.rows[0].jenis_user
                                }
                                jwt.sign({ user }, 'secretkey', (err, token) => {
                                    if(err){
                                        return res.status(400).json({ err })
                                    }
                                    res.json({ token, jenisUser : user.jenisUser })
                                })
                                //  
                            }
                        }
                    })
                }
            }
        })
    }

    userSignup(req, res) {
        const { username, password, jenisUser } = req.body
        const  usernameRegex = /^[a-zA-Z][\w_.]+$/
        const result = username.match(usernameRegex)
        if(result == null){
            return res.status(400).json({ err : "username tidak sesuai aturan" })
        }
        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, (err, enc) => {
            if(err){
                return res.status(400).json({ err })
            }
            const text = 'INSERT INTO Pengguna values ($1,$2,$3) RETURNING *'
            const values = [username, enc, jenisUser]
            this.client.query(text, values, (err, result) => {
                if(err){
                    return res.status(400).json({ err })
                }else{
                    res.json(result.rows)
                }
            })
        })
    }
}

module.exports = Pengguna;