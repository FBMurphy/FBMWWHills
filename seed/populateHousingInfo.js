
  const {MissionGroup} = require('../server/models/missiongroup.js');
  const {Volunteer} = require('../server/models/volunteer.js');
  MissionGroup.find({
    startDate: document.getElementById("startdate").value,
    endDate: document.getElementById("enddate").value
  }).then((groups) => {
    console.log(groups);
  });
