const jsonwebtoken = require('jsonwebtoken');


const generateToken = ({ id, username, email, roles }) => {
    
    return new Promise((resolve, reject) => {
        jsonwebtoken.sign(
            { id, username, email, roles },
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            })
    });
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken.verify(
            token,
            process.env.JWT_SECRET,
            (err, token) => {
                if (err) {
                    reject(err);
                }
                resolve(token);
            })
    });
}

module.exports = {
    generateToken,
    verifyToken,
}

