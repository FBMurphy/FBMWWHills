require('./config/config.js');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const request = require('request');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {mongoose} = require('./db/mongoose.js');
const {ObjectID} = require('mongodb');
const {Volunteer} = require('./models/volunteer.js');
const {MissionGroup} = require('./models/missiongroup.js');
const {InfoReq} = require('./models/infoReq.js');
const {Project} = require('./models/project.js');
const {HousingUnit} = require('./models/housingUnit.js');
const{groups, vols, houses, projects, users} = require('../seed/seed.js');
const {User} = require('./models/user.js');

var app = express();
var port = process.env.PORT;
var async = require('async');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.listen(port, () => {
  console.log('Server Started on Port ' + port);
});

app.get('/', (req, res) => {
  res.render('../views/home.ejs', {title: 'HomePage'});
});

app.get('/volunteerRegistration', (req, res) => {
  res.render('../views/volunteerRegistration.ejs', {title: 'VolunteerRegistration'});
});

app.get('/groupRegistration', (req, res) => {
  res.render('../views/groupRegistration.ejs', {title: 'GroupRegistration'});
});

app.get('/addHousingUnit', (req, res) => {
  res.render('../views/addHousingUnit.ejs', {title: 'AddHousingUnit'});
});

app.get('/signup', (req, res) => {
  res.render('../views/signup.ejs', {title: 'Signup'});
});

app.get('/login', (req, res) => {
  res.render('../views/login.ejs', {title: 'Login'});
});

app.get('/emailSent', (req, res) => {
  res.render('../views/emailSent.ejs', {title: 'EmailSent'});
});

app.get('/resetPassword', (req, res) => {
  res.render('../views/resetPassword.ejs', {title: 'ResetPassword'});
});

app.get('/userNotFound', (req, res) => {
  res.render('../views/userNotFound.ejs', {title: 'UserNotFound'});
});

app.get('/forgotPassword', (req, res) => {
    res.render('../views/emailConfirmation.ejs');
});

app.get('/incorrectPIN', (req, res) => {
    res.render('../views/incorrectPIN.ejs');
});

app.get('/addStaff', (req, res) => {
    res.render('../views/addStaff.ejs');
});

app.get('/staffHome', (req, res) => {
    res.render('../views/staffHome.ejs');
});

app.get('/volHome', (req, res) => {
    res.render('../views/volHome.ejs');
});

app.get('/leaderHome', (req, res) => {
    res.render('../views/leaderHome.ejs');
});

app.get('/infoRequest', (req, res) => {
  console.log("env" + process.env);
  res.render('../views/infoRequest.ejs', {title: 'InfoRequest'});
});

app.get('/projects', (req, res) => {
  Project.find({completed: false}).then((docs) => {
    var projects = docs;
    console.log("Inside /projects showing projects: ", projects)
    res.render('../views/projects.ejs', {projects});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/volunteerReport', (req, res) => {
  Volunteer.find({}).then((vols) => {
    var volunteers = vols;
    res.render('../views/volunteerReport.ejs', {volunteers});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/groupReport', (req, res) => {
  MissionGroup.find({}).then((missionGroups) => {
    var groups= missionGroups;
    res.render('../views/groupReport.ejs', {groups});
  }, (e) => {
    res.status(400).send(e);
  });
});


app.get('/addproject', (req, res) => {
  res.render('../views/addproject.ejs', {title: 'AddProjects'});
});

app.get('/housingAssignments', (req, res) => {
  var housingUnits = [];
  var dates = ['', ''];
  res.render('../views/housingAssignments.ejs', {housingUnits, dates});
});


app.post('/insertVolunteer', function(req, res, next){
  console.log(req.body.gender);
   var skills = " ";
  if(req.body.plumbing != undefined){
    skills += "Plumbing, ";
  }
  if(req.body.gardening != undefined){
    skills += "Gardening/Landscaping, ";
  }
  if(req.body.electrical != undefined){
    skills += "Electrical, ";
  }
  if(req.body.cooking != undefined){
    skills += "Cooking, ";
  }
  if(req.body.carpentry != undefined){
    skills += "Carpentry, ";
  }
  if(req.body.painting != undefined){
    skills += "Painting, ";
  }
  if(req.body.masonry != undefined){
    skills += "Masonry, ";
  }
  if(req.body.organizational != undefined){
    skills += "Organizational Skills, ";
  }
  if(req.body.administration != undefined){
    skills += "Office Administration, ";
  }
  if(req.body.otherskills != undefined){
    skills += req.body.otherskills;
  }
  var house = " ";
  if(req.body.gender === 'male'){
    house = 'Blessing';
  }
  else{
    house = 'Abundance';
  }
  console.log("Skills", skills);

  var volunteer = new Volunteer({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    gender: req.body.gender,
    age: req.body.age,
    email: req.body.email,
    phone: req.body.phone,
    skills: skills,
    medicalConditions: req.body.health,
    missionGroup: req.body.missiongroup,
    housingAssignment: house,
    startDate: req.body.startdate,
    endDate: req.body.enddate
  });
  console.log(volunteer.firstName);

  volunteer.save().then((doc) => {
    res.render('../views/addNextVolunteer.ejs');
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/insertGroup', function(req, res, next){
  var group = new MissionGroup({
    groupName: req.body.groupname,
    leaderFirst: req.body.firstname,
    leaderLast: req.body.lastname,
    leaderEmail: req.body.email,
    leaderPhone: req.body.phone,
    startDate: req.body.startdate,
    endDate: req.body.enddate,
    numMales: req.body.nummales,
    numFemales: req.body.numfemales
  });
var skills = " ";
 if(req.body.plumbing != undefined){
   skills += "Plumbing, ";
 }
 if(req.body.gardening != undefined){
   skills += "Gardening/Landscaping, ";
 }
 if(req.body.electrical != undefined){
   skills += "Electrical, ";
 }
 if(req.body.cooking != undefined){
   skills += "Cooking, ";
 }
 if(req.body.carpentry != undefined){
   skills += "Carpentry, ";
 }
 if(req.body.painting != undefined){
   skills += "Painting, ";
 }
 if(req.body.masonry != undefined){
   skills += "Masonry, ";
 }
 if(req.body.organizational != undefined){
   skills += "Organizational Skills, ";
 }
 if(req.body.administration != undefined){
   skills += "Office Administration, ";
 }
 if(req.body.otherskills != undefined){
   skills += req.body.otherskills;
 }
 var house = " ";
 if(req.body.gender === 'male'){
   house = 'Blessing';
 }
 else{
   house = 'Abundance';
 }
  var volunteer = new Volunteer({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone,
    gender: req.body.gender,
    age: 'adult',
    skills: skills,
    medicalConditions: req.body.health,
    missionGroup: req.body.groupName,
    housingAssignment: house,
    startDate: req.body.startdate,
    endDate: req.body.enddate
  });
  group.save().then((group) => {
    volunteer.save().then((vol) => {
      res.render('../views/leaderHome.ejs');
    }, (e) => {
      res.status(400).send(e);
    });
  }, (e) => {
    res.status(400).send(e);
  });

});

app.post('/insertInfo', function(req, res, next){
  var info = new InfoReq({
    groupName: req.body.groupname,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    email: req.body.email,
    phone: req.body.phone
  });
  info.save().then((doc) => {
    res.render('../views/home.ejs');
    console.log(doc);
  }, (e) => {
    res.status(400).send(e);
  });
  var transporter = nodemailer.createTransport(smtpTransport({
    service: 'Gmail',
    host: 'smpt.gmail.com',
    secure: false,
    port: 587,
    auth: {
      user: 'herokuranch@gmail.com',
      pass: 'JDMurphy2019'
    }
  }));
  transporter.sendMail({
    from: 'Heroku <herokuranch@gmail.com>',
    subject: 'Additional Info On Our Missions Program',
    text: 'Thank you for your interest in volunteering at the Wildwood Hills Ranch Missions Program!',
    attachments: [{'filename': 'WildwoodHillsInfo.pdf', 'path': 'C:/Users/Jack/WildwoodHillsRanch/WildwoodHillsInfo.pdf'}],
    to: req.body.email
  }, function(error, info){
    if(error){
      return console.log(error);
    }
    console.log("Message %s sent %s", info.messageId, info.response);
    console.log("Mail sent successfully");
  });
  res.render('../views/home.ejs');
});

app.post('/insertProject', function(req, res, next){
 var skills = " ";
 if(req.body.plumbing != undefined){
   skills += "Plumbing, ";
 }
 if(req.body.gardening != undefined){
   skills += "Gardening, ";
 }
 if(req.body.electrical != undefined){
   skills += "Electrical, ";
 }
 if(req.body.cooking != undefined){
   skills += "Cooking, ";
 }
 if(req.body.construction != undefined){
   skills += "Construction, ";
 }
 if(req.body.otherskills != undefined){
   skills += req.body.otherskills;
 }
  var project = new Project({
    name: req.body.proj,
    skillsRequired: skills,
    completed: false
  });
  project.save().then((doc) => {
    console.log(doc);
  }, (e) => {
    res.status(400).send(e);
  }).then((doc) => {
    Project.find({
      completed: false
    }).then((docs) => {
      var projects = docs;
      res.render('../views/projects.ejs', {projects});
    }, (e) => {
      res.status(400).send(e);
    });
  });

  //res.render('../views/projects.ejs', {projects});
});

// Commented below is the original clearProjects code

app.post('/clearProjects', function(req, res, next){
  console.log("Clear Projects req.body", req.body);
  for(var i = 0 ; i < req.body.length ; i++){
    var id = req.body[i];
    Project.findOneAndUpdate({_id : id}, {$set: {completed: true}}, {new: true}).then((doc) => {
      console.log("Projects doc: "+ doc + "/n");
    }, (e) => {
      res.status(400).send(e);
    });
  }
  Project.find({
    completed: false
  }).then((docs) => {
    console.log("After project find showing docs", docs)
    var projects = docs;
    res.render('../views/projects.ejs', {projects});
  }, (e) => {
    res.status(400).send(e);
  });
  //res.render('../views/projects.ejs');
});

//updated clearProjects using async function instead of for loop
/*
app.post('/clearProjects', function(req, res, next){
  console.log("Clear Projects req.body", req.body);
  async.eachSeries(req.body, function updateProject(obj, done){
    console.log("inside clearProjects async obj", obj);
    Project.findOneAndUpdate({_id : obj}, {$set: {completed: true}}, {new: true}, done);
  }, function allDone(err){
    if(err){
      res.status(400).send(err);
    }else{
      Project.find({completed: false}).then((docs) =>{
        var projects = docs;
        res.render('../views/projects.ejs', {projects});
      });
    };
  });
});
*/
// Original clearVols code with for loop

app.post('/clearVols', function(req, res, next){
  console.log(req.body);
  for(var i = 0 ; i < req.body.length ; i++){
    var id = req.body[i];
    Volunteer.findOneAndRemove({_id : id}).then((doc) => {
      console.log(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  };
  Volunteer.find({}).then((vols) => {
    var volunteers = vols;
    res.render('../views/volunteerReport.ejs', {volunteers: 'volunteers'});
  }, (e) => {
    res.status(400).send(e);
  });
  //res.render('../views/volunteerReport.ejs');
});

/*
// Updated clearVols with async instead of for loop

app.post('/clearVols', function(req, res, next){
  console.log("Clear Vols req.body", req.body);
  async.eachSeries(req.body, function updateVols(obj, done){
    console.log("inside clearVols async obj", obj);
    Volunteer.findOneAndRemove({_id : obj}, done);
  }, function allDone(err){
    if(err){
      res.status(400).send(err);
    }else{
      console.log("before find() dbase call");
      Volunteer.find({}).then((vols) =>{
        var volunteers = vols;
        console.log("Rendering volunteerReport now with volunteers equal to: ", volunteers);
        res.render('../views/volunteerReport.ejs', {volunteers: 'volunteers'});
        console.log("Finished Rendering volunteerReport");
      });
    };
  });
});
*/

app.post('/clearGroups', function(req, res, next){
  console.log(req.body);
  for(var i = 0 ; i < req.body.length ; i++){
    var id = req.body[i];
    MissionGroup.findOneAndRemove({_id : id}).then((doc) => {
      console.log(doc);
    }, (e) => {
      res.status(400).send(e);
    });
  }
  res.render('../views/groupReport.ejs');
});

app.get('/seedDB', function(req, res, next){
  MissionGroup.remove({}).then(() => {
     MissionGroup.insertMany(groups);
  }).then(() => {
    Volunteer.remove({}).then(() => {
      Volunteer.insertMany(vols);
    });
  }).then(() => {
    HousingUnit.remove({}).then(() => {
      HousingUnit.insertMany(houses);
    });
  }).then(() => {
      Project.remove({}).then((proj) => {
        Project.insertMany(projects);
      });
    }).then(() => {
      console.log("Users: ", users);
        User.remove({}).then((user) => {
          for (var i = 0; i<users.length; i++){
            user = new User(users[i]);
            user.save();
          }
        });
      }).then(() => {
        res.render('../views/home.ejs');
      }).catch((e) => console.log(e))
});


app.get('/assignHousing', function(req, res){
  var volunteers = [];
  res.render('../views/assignHousing.ejs', {volunteers});
});

app.post('/populateHousingInfo', function(req, res, next){
  var volunteers = [];
  var volunteerGroups = [];
  var housingUnits = [];
  var dates = [req.body.startdate, req.body.enddate];
  HousingUnit.find({}).then((houses) => {
    //console.log(houses);
    housingUnits = houses;
  });
  Volunteer.find({
    $or: [{
      $and: [{startDate: {$gte: req.body.startdate}}, {startDate: {$lte: req.body.enddate}}]},{
      $and: [{endDate: {$gte: req.body.startdate}}, {endDate: {$lte: req.body.enddate}}]},{
      $and: [{startDate: {$lte: req.body.startdate}}, {endDate: {$gte: req.body.enddate}}]}
    ]
  }).then((vols) => {
    //console.log(vols);
    volunteers = vols;
    res.render('../views/housingAssignments.ejs', {volunteers, housingUnits, dates});
  });
});

/*
app.post('/updateHousingInfo', function(req,res,next){
  var housing = req.body;
  var ids = Object.values(req.body);
  var assignments = Object.keys(req.body);
  var objIDs = [];
  var houseAssignment = [];
  for(var i = 0 ; i < ids.length ; i++){
    if(ObjectID.isValid(ids[i])){
      var id = new ObjectID(ids[i]);
      objIDs.push(id);
      houseAssignment.push(assignments[i]);
    }
  }
  Volunteer.updateMany({
    _id: {$in: objIDs}
  }, {
    isAssigned: true
  }, {
    new: true
  }).then((vols) => {
    console.log(vols);
  });
  for(var i = 0 ; i < objIDs.length ; i++){
    Volunteer.findOneAndUpdate({
      _id: objIDs[i]
    }, {
      housingAssignment: houseAssignment[i]
    }).then((vol) => {
      var volunteers = [];
      res.render('../views/assignHousing.ejs', {volunteers});
    });
  }
});
*/

app.post('/reassignHousing', (req, res) => {
  console.log("reassignHousing req.body", req.body);
  for(var i = 0 ; i < req.body.length ; i++){
    var name = req.body[i].name.split(" ");
    var first = name[0];
    var last = name[1];
    var arrival = req.body[i].startDate;
    var departure = req.body[i].endDate;
    var newAssignment = req.body[i].assignment;
    Volunteer.findOneAndUpdate({
        firstName: first,
        lastName: last,
        startDate: arrival,
        endDate: departure
    }, {
        housingAssignment: newAssignment
    }, {
        new: true
    }).then((vol) => {
      console.log(vol);
    }, (e) => {
      res.status(400).send(e);
    });
  }
  res.render('../views/housingAssignments.ejs');
});

  app.post('/insertHousingUnit', function(req, res, next){
    var unit = new HousingUnit({
      unitName: req.body.unitname,
      occupants: req.body.numoccupants,
      type: req.body.type
    });
    unit.save().then((doc) => {
      res.render('../views/staffHome.ejs');
    }, (e) => {
      res.status(400).send(e);
    });
  });

  app.post('/registeruser', (req, res) => {
    //var body = _.pick(req.body, ['email', 'password', 'title']);
    var user = new User({
      email: req.body.email,
      password: req.body.password,
      title: req.body.title
    });
    user.save().then((user) => {
      if(user.title === 'leader'){
        res.render('../views/groupRegistration.ejs');
      }
      else{
        res.render('../views/volunteerRegistration.ejs');
      }
    }).catch((e) => {
      res.status(400).send(e);
    });
  });

  app.post('/loginUser', (req, res) => {
    User.findOne({
      email: req.body.email
    }).then((user) => {
      if(!user){
        res.status(400).send('');
      }
      else{
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if(result){
            if(user.title === 'leader'){
              res.render('../views/leaderHome.ejs');
            }
            else if(user.title === 'staff'){
              res.render('../views/staffHome.ejs');
            }
            else{
              res.render('../views/volHome.ejs');
            }
          }
          else{
            res.status(400).send('');
          }
        });
      }
    });
  });

  app.post('/confirmEmail', (req, res) => {
    User.findOne({
      email: req.body.email
    }).then((user) => {
      if(!user){
        res.render('../views/userNotFound.ejs');
      }
      else{
        var pin = generatePIN(1000, 9999);
        console.log(pin);
        var transporter = nodemailer.createTransport(smtpTransport({
          service: 'Gmail',
          host: 'smpt.gmail.com',
          secure: false,
          port: 587,
          auth: {
            user: 'herokuranch@gmail.com',
            pass: 'JDMurphy2019'
          }
        }));
        transporter.sendMail({
          from: 'Heroku <herokuranch@gmail.com>',
          subject: 'Wildwood Hills Password Reset',
          text: 'Please click the following link and enter the PIN ' + pin +  ' to reset your password. Please let us know if you did not request this action! https://wildwoodhillsranch.herokuapp.com/resetPassword ',
          to: req.body.email
        }, function(error, info){
          if(error){
            return console.log(error);
          }
          console.log("Message %s sent %s", info.messageId, info.response);
          console.log("Mail sent successfully");
        });
        User.findOneAndUpdate({
          email: req.body.email
        }, {
          pin: pin
        }).then((user) => {
          res.render('../views/emailSent.ejs');
        });
      }
    }).catch((e) => {
      res.status(400).send(e);
    });
  });

  app.post('/updatePassword', (req, res, next) => {
    console.log(req.body.password);
    var hashed = req.body.password;
    var updatePass = new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          hashed = hash;
          resolve(hashed);
        });
      });
    });
    updatePass.then((hashed) => {
      User.findOneAndUpdate({
          pin: req.body.pin
        }, {
          password: hashed,
          pin: 0
        }, {
          new: true
        }).then((user) => {
          if(!user){
            res.render('../views/incorrectPIN.ejs');
          }
          else{
            res.render('../views/passwordUpdated.ejs');
          }
        }).catch((e) => {
          res.status(400).send(e);
        });
    });
  });

  app.post('/createStaff', (req, res) => {
    var pin = generatePIN(1000,9999);
    console.log(pin);
    var user = new User({
      email: req.body.email,
      password: 'staffpassword',
      pin: pin,
      title: 'staff'
    });
    user.save().then((user) => {
      var transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        host: 'smpt.gmail.com',
        secure: false,
        port: 587,
        auth: {
          user: 'herokuranch@gmail.com',
          pass: 'JDMurphy2019'
        }
      }));
      transporter.sendMail({
        from: 'Heroku <herokuranch@gmail.com>',
        subject: 'Wildwood Hills Staff Registration',
        text: 'Please click the following link and enter the PIN ' + pin +  ' to create your password.  https://wildwoodhillsranch.herokuapp.com/resetPassword ',
        to: req.body.email
      }, function(error, info){
        if(error){
          return console.log(error);
        }
        console.log("Message %s sent %s", info.messageId, info.response);
        console.log("Mail sent successfully");
      });
      res.render('../views/emailSent.ejs');
    }, (e) => {
      res.status(400).send(e);
    });
  });

function generatePIN(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
