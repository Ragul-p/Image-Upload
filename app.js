const express = require("express");
const multer = require("multer");
const ejs = require("ejs");
const path = require("path");
const port = 3000;


// Set Storage Engine 
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload 
const upload = multer(
    {
        storage: storage,
        limits: { fileSize: 100000000 },
        fileFilter: function (req, file, cb) {
            checkFileType(file, cb);
        }
    }
).array("myImage", 10);

// Check File Type 
function checkFileType(file, cb) {

    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;

    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase());

    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!')
    }

}

// Init app
const app = express();

// EJS
app.set("view engine", "ejs");

// Public Folder
app.use(express.static("./public"));







app.get("/", (req, res) => res.render("index"));


app.post("/upload", async (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render("index", { msg: err })
        } else {
            if (req.files.length == 0) {
                res.render("index", { msg: "Error: No file Selected!" })
            } else {
                console.log(req.files);
                const data = req.files.map((data) => { return `uploads/${data.filename}` });
                res.render("index", { msg: "File Uploaded!", file: data })
            }
        }
    });
});





app.listen(port, () => {
    console.log(`server is listening on port ${port} `);
});










//   https://materializecss.com/text-inputs.html

//  https://releases.jquery.com/