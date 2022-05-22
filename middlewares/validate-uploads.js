//middleware  Validate Uploads

const validateUpload = (req, res, next) => {
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({
            ok: false,
            msg: 'No existe archivo en la solicitud. - afs'
        });
    }

    if (!req.files.file) {
        return res.status(400).send({
            ok: false,
            msg: 'No existe archivo en la solicitud. - sf'
        });
    }

    next();
}


module.exports = {
    validateUpload
}