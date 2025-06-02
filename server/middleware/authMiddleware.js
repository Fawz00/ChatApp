const jwt = require('jsonwebtoken')

function authenticate(req, res, next) {

    const authHeader = req.headers['authorization']
    if (authHeader) {
        let token = authHeader.split(' ')[1]
        // verify the token 
        try {
            const decoded = jwt.verify(token, 'SECRETKEY')
            if (decoded) {
                const username = decoded.username
                const persistedUser = users.find((user) => user.username == username)
                if (persistedUser) {
                    next() // carry on with the original request 
                } else {
                    // user does not exist 
                    res.json({ success: false, message: 'User does not exist!' })
                }
            } else {
                // decoding fails 
                res.status(401).json({ success: false, message: 'No authorization headers found!' })
            }
        } catch (error) {
            res.status(401).json({ success: false, message: 'Token has been tampered!' })
        }
    } else {
        // no authentication headers 
        res.status(401).json({ success: false, message: 'No authorization headers found!' })
    }

}

module.exports = authenticate