const Todo = require("../model/schema");
const HTTP = require("../../constant/response.constant");

var path = require("path");
var bcrypt = require("bcryptjs");
const fs = require("fs");

var session;

class class1 {
  static a = async (req, res) => {
    try {
      res.render("Signup");
    } catch (e) {
      console.log(err);
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: "Something went wrong!",
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };

  static b = async (req, res) => {
    var ChangefilenameArray = [];
    try {
      if (
        req.body.username &&
        req.body.password &&
        req.file &&
        req.body.PhoneNumber &&
        req.body.Email
      ) {
        let result = req.body.username.includes("@");
        if (result) {
          fs.unlinkSync(
            path.join(__dirname, `../../public/${req.file.filename}`)
          );
          res.send("username does not contain @");
        } else {
          function getFileExtension(filename) {
            const extension = filename.split(".").pop();
            return extension;
          }
          const Extension = await getFileExtension(req.file.originalname);
          var Changefilename = (await req.file.filename) + "." + Extension;
          ChangefilenameArray.push(Changefilename);
          fs.rename(
            path.join(__dirname, `../../public/${req.file.filename}`),
            path.join(__dirname, `../../public/${Changefilename}`),
            () => {}
          );
          var a = await Todo.find({ username: req.body.username });
          var b = await Todo.find({ PhoneNumber: req.body.PhoneNumber });
          if (a.length == 1) {
            fs.unlinkSync(
              path.join(__dirname, `../../public/${Changefilename}`)
            );
            res.send("username already exist");
          } else {
            if (b.length == 1) {
              fs.unlinkSync(
                path.join(__dirname, `../../public/${Changefilename}`)
              );
              res.send("PhoneNumber already exist");
            } else {
              let data = new Todo({
                username: req.body.username,
                password: await bcrypt.hash(req.body.password, 12),
                post: {
                  adultphoto: [],
                  adultvideo: [],
                  kidsphoto: [],
                  kidsvideo: [],
                },
                PhoneNumber: req.body.PhoneNumber,
                profilepic: Changefilename,
                Email: req.body.Email,
              });
              await data.save();
              // res.redirect("/Login");
              res.send("Account Create sucessfully");
            }
          }
        }
      } else {
        fs.unlinkSync(
          path.join(__dirname, `../../public/${req.file.filename}`)
        );
        return res.status(HTTP.SUCCESS).send({
          errors: [
            {
              message: "insufficient Registration data",
              code: HTTP.INTERNAL_SERVER_ERROR,
            },
          ],
        });
      }
    } catch (err) {
      fs.unlinkSync(
        path.join(__dirname, `../../public/${ChangefilenameArray[0]}`)
      );
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: "Invalid Email Address",
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };

  static c = async (req, res) => {
    try {
      res.render("login");
    } catch (e) {
      console.log(err);
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: "Something went wrong!",
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };

  static d = async (req, res) => {
    try {
      if (req.body.UsernameEmail && req.body.password) {
        let result = req.body.UsernameEmail.includes("@");
        if (result) {
          var a = await Todo.find({ Email: req.body.UsernameEmail });
        } else {
          var a = await Todo.find({ username: req.body.UsernameEmail });
        }
        if (a.length == 1) {
          var Passwordmatch = await bcrypt.compare(
            req.body.password,
            a[0].password
          );
          if (Passwordmatch) {
            var b = a[0].username;
            session = req.session;
            session.token = b;
            // res.redirect("/upload");
            res.send(a);
          } else {
            res.render("WrongPassword.ejs");
          }
        } else {
          res.render("UserNotFind.ejs");
        }
      } else {
        return res.status(HTTP.SUCCESS).send({
          errors: [
            {
              message: "insufficient Login data",
              code: HTTP.INTERNAL_SERVER_ERROR,
            },
          ],
        });
      }
    } catch (err) {
      // console.log(err);
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: err,
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };

  static e = async (req, res) => {
    try {
      if (req.session.token) {
        res.send("okay");
        // res.render("files");
      } else {
        // res.redirect("/login");
        res.send("please login");
      }
    } catch (err) {
      console.log(err);
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: "Something went wrong!",
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };

  static f = async (req, res) => {
    try {
      if (req.session.token) {
        function getFileExtension(filename) {
          const extension = filename.split(".").pop();
          return extension;
        }

        for (var i = 0; i < req.files.length; i++) {
          const Extension = await getFileExtension(req.files[i].originalname);
          var Changefilename = (await req.files[i].filename) + "." + Extension;

          fs.rename(
            path.join(__dirname, `../../public/${req.files[i].filename}`),
            path.join(__dirname, `../../public/${Changefilename}`),
            () => {}
          );

          if (Extension == "jpg" || Extension == "jpeg" || Extension == "png") {
            if (req.body.category == "kids") {
              await Todo.updateOne(
                { username: req.session.token },
                {
                  $push: {
                    "post.kidsphoto": Changefilename,
                  },
                }
              );
            } else {
              await Todo.updateOne(
                { username: req.session.token },
                {
                  $push: {
                    "post.adultphoto": Changefilename,
                  },
                }
              );
            }
          }

          if (Extension == "gif" || Extension == "mp4" || Extension == "MP4") {
            if (req.body.category == "kids") {
              await Todo.updateOne(
                { username: req.session.token },
                {
                  $push: {
                    "post.kidsvideo": Changefilename,
                  },
                }
              );
            } else {
              await Todo.updateOne(
                { username: req.session.token },
                {
                  $push: {
                    "post.adultvideo": Changefilename,
                  },
                }
              );
            }
          }
        }

        res.render("upload");
      } else {
        res.redirect("/login");
      }
    } catch (err) {
      console.log(err);
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: "Something went wrong!",
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };

  static g = async (req, res) => {
    try {
      if (req.session.token) {
        if (req.session.token == "admin") {
          var a = await Todo.find({});
          res.render("delete.ejs", { a });
        } else {
          res.render("404.ejs");
        }
      } else {
        res.render("404.ejs");
      }
    } catch (err) {
      console.log(err);
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: "Something went wrong!",
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };

  static h = async (req, res) => {
    try {
      var ipAddress = "52.194.157.127";

      if (req.params.id == "adultphotopost") {
        var a = await Todo.find({ username: req.session.token });

        var array = [];

        for (var i = 0; i < a[0].post.adultphoto.length; i++) {
          array.push(`${ipAddress}/${a[0].post.adultphoto[i]}`);
        }

        var data = {
          url: array,
        };

        res.send(data);
      } else if (req.params.id == "adultvideopost") {
        var a = await Todo.find({ username: req.session.token });

        var array = [];

        for (var i = 0; i < a[0].post.adultvideo.length; i++) {
          array.push(`${ipAddress}/${a[0].post.adultvideo[i]}`);
        }

        var data = {
          url: array,
        };

        res.send(data);
      } else if (req.params.id == "kidsphotopost") {
        var a = await Todo.find({ username: req.session.token });

        var array = [];

        for (var i = 0; i < a[0].post.kidsphoto.length; i++) {
          array.push(`${ipAddress}/${a[0].post.kidsphoto[i]}`);
        }

        var data = {
          url: array,
        };

        res.send(data);
      } else if (req.params.id == "kidsvideopost") {
        var a = await Todo.find({ username: req.session.token });

        var array = [];

        for (var i = 0; i < a[0].post.kidsvideo.length; i++) {
          array.push(`${ipAddress}/${a[0].post.kidsvideo[i]}`);
        }

        var data = {
          url: array,
        };

        res.send(data);
      } else if (req.params.id == "adultphoto") {
        var array = [];

        var a = await Todo.find({});

        for (var i = 0; i < a.length; i++) {
          for (var j = 0; j < a[i].post.adultphoto.length; j++) {
            array.push(`${ipAddress}/${a[i].post.adultphoto[i]}`);
          }
        }

        var data = {
          url: array,
        };

        res.send(data);
      } else if (req.params.id == "adultvideo") {
        var array = [];

        var a = await Todo.find({});

        for (var i = 0; i < a.length; i++) {
          for (var j = 0; j < a[i].post.adultvideo.length; j++) {
            array.push(`${ipAddress}/${a[i].post.adultvideo[i]}`);
          }
        }

        var data = {
          url: array,
        };

        res.send(data);
      } else if (req.params.id == "kidsphoto") {
        var array = [];

        var a = await Todo.find({});

        for (var i = 0; i < a.length; i++) {
          for (var j = 0; j < a[i].post.kidsphoto.length; j++) {
            array.push(`${ipAddress}/${a[i].post.kidsphoto[i]}`);
          }
        }

        var data = {
          url: array,
        };

        res.send(data);
      } else if (req.params.id == "kidsvideo") {
        var array = [];

        var a = await Todo.find({});

        for (var i = 0; i < a.length; i++) {
          for (var j = 0; j < a[i].post.kidsvideo.length; j++) {
            array.push(`${ipAddress}/${a[i].post.kidsvideo[i]}`);
          }
        }

        var data = {
          url: array,
        };

        res.send(data);
      } else {
        res.render("404");
      }

      // res.render("show" , { array , url  })
    } catch (e) {
      console.log(e);
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: "Something went wrong!",
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };

  static i = async (req, res) => {
    try {
      if (req.session.token) {
        if (req.session.token == "admin") {
          var a = await Todo.find({ username: req.params.id1 });

          if (req.params.id2 == "adultphoto") {
            for (var i = 0; i < a[0].post.adultphoto.length; i++) {
              fs.unlinkSync(
                path.join(__dirname, `../../public/${a[0].post.adultphoto[i]}`)
              );
            }

            a[0].post.adultphoto = [];
          } else if (req.params.id2 == "adultvideo") {
            for (var i = 0; i < a[0].post.adultvideo.length; i++) {
              fs.unlinkSync(
                path.join(__dirname, `../../public/${a[0].post.adultvideo[i]}`)
              );
            }

            a[0].post.adultvideo = [];
          } else if (req.params.id2 == "kidsphoto") {
            for (var i = 0; i < a[0].post.kidsphoto.length; i++) {
              fs.unlinkSync(
                path.join(__dirname, `../../public/${a[0].post.kidsphoto[i]}`)
              );
            }

            a[0].post.kidsphoto = [];
          } else {
            for (var i = 0; i < a[0].post.kidsvideo.length; i++) {
              fs.unlinkSync(
                path.join(__dirname, `../../public/${a[0].post.kidsvideo[i]}`)
              );
            }

            a[0].post.kidsvideo = [];
          }

          a[0].save();

          res.redirect("/delete");
        } else {
          res.render("404.ejs");
        }
      } else {
        res.render("404.ejs");
      }
    } catch (e) {
      console.log(e);
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: "Something went wrong!",
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };

  static j = async (req, res) => {
    try {
      if (req.session.token) {
        if (req.session.token == "admin") {
          fs.unlinkSync(path.join(__dirname, `../../public/${req.params.id3}`));

          var a = await Todo.find({ username: req.params.id1 });

          if (req.params.id2 == "adultphoto") {
            a[0].post.adultphoto.remove(req.params.id3);
          } else if (req.params.id2 == "adultvideo") {
            a[0].post.adultvideo.remove(req.params.id3);
          } else if (req.params.id2 == "kidsphoto") {
            a[0].post.kidsphoto.remove(req.params.id3);
          } else {
            a[0].post.kidsvideo.remove(req.params.id3);
          }

          a[0].save();

          res.redirect("/delete");
        } else {
          res.render("404.ejs");
        }
      } else {
        res.render("404.ejs");
      }
    } catch (e) {
      console.log(e);
      return res.status(HTTP.SUCCESS).send({
        errors: [
          {
            message: "Something went wrong!",
            code: HTTP.INTERNAL_SERVER_ERROR,
          },
        ],
      });
    }
  };
}

module.exports = { class1 };
