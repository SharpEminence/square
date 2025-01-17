const userController = require("./../controller/userController");
const questionController = require("./../controller/questionController");
const dashboardController = require("./../controller/dashboardController");
const expoController = require("./../controller/expoController");
const commonController = require("./../controller/commonController");
const agendaController = require("./../controller/agendaController");
const faqController = require("./../controller/faqController");
const demandController = require("./../controller/demandController");
const presidentController = require("./../controller/presidentController");
const suggestMeController = require("./../controller/suggestedMeController");
const rewardsController = require("./../controller/rewardsController");
const { check } = require("express-validator");
const token = require("./../../../../utilities/verify_token");
const multer = require("multer");

const DIR = "./public/uploads";
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

let upload = multer({ storage: storage });

module.exports = (router) => {
  //Admin  Routes
  //router.get('/login',loginController.login);

  router.post(
    "/api/login",
    [
      check("email").not().isEmpty().withMessage("Email field is required"),
      check("eventId")
        .not()
        .isEmpty()
        .withMessage("Something went wrong. Please try again later."),
      check("password")
        .not()
        .isEmpty()
        .withMessage("Password field is required"),
    ],
    userController.login
  );
  router.post("/api/user/create", userController.createUser);
  router.post("/api/auth-jitsi", userController.JitsiAuth);

  router.post("/api/forget-password", userController.forgetpassword);
  router.post("/api/reset-password", userController.resetpassword);
  router.get("/api/event-theme/:event", userController.EventTheme);

  router.get("/api/questions/:id", questionController.getQuestion);
  router.post(
    "/api/user/step-one",
    token.verifyToken,
    userController.updateStep_one
  );
  router.post(
    "/api/add-friends",
    token.verifyToken,
    userController.addToFriendList
  );
  router.post(
    "/api/user/step-two",
    token.verifyToken,
    userController.updateStep_two
  );
  router.post(
    "/api/user/step-three",
    token.verifyToken,
    userController.updateStep_three
  );

  router.post(
    "/api/user/update-profile",
    token.verifyToken,
    userController.updateProfile
  );

  router.post("/api/base-image", userController.saveBase64Image);

  router.post(
    "/api/upload",
    upload.single("image"),
    userController.imageUpload
  );

  router.post(
    "/api/upload-csv/:id",
    upload.single("image"),
    userController.csvUpload
  );

  router.post("/api/export-csv/:id", userController.csvExport);
  router.post("/api/add-time", userController.addtime);

  router.get("/api/timezones", commonController.getAllTimezones);
  router.post("/api/agendas/dates", agendaController.getAgendaDates);
  router.post("/api/agendas/databy-date", agendaController.getAgendasByDate);
  router.post(
    "/api/agendas/fav/databy-date",
    agendaController.getFavAgendasByDate
  );
  router.post("/api/agendas/live-now", agendaController.getLiveAgendas);
  router.post("/api/agendas/databy-id", agendaController.getAgendasById);
  router.post(
    "/api/agendas/add-as-favourite",
    token.verifyToken,
    agendaController.addAgendaAsFavourite
  );
  router.get("/api/designation", commonController.getAllDesignation);
  router.post(
    "/api/agendas/participant_count",
    token.verifyToken,
    agendaController.countAgendaParticipants
  );
  router.post(
    "/api/agendas/sponsor-particisignpant-count",
    token.verifyToken,
    agendaController.countSponsorParticipants
  );

  router.post(
    "/api/agendas/participants_count",
    token.verifyToken,
    agendaController.getAgendaParticipantsCount
  );

  router.post(
    "/api/agendas/participants-count-sponsor",
    token.verifyToken,
    agendaController.getSponsorParticipantsCount
  );

  router.get("/api/faq/:id", token.verifyToken, faqController.getFaqs);
  router.get("/api/demand/:id", token.verifyToken, demandController.getDemand);
  router.get(
    "/api/president/:id",
    token.verifyToken,
    presidentController.getPresident
  );

  router.post("/api/expo/:id", token.verifyToken, expoController.getAgenda);
  router.post("/api/booths/:id", token.verifyToken, expoController.getBooths);
  router.post(
    "/api/apointment/create",
    token.verifyToken,
    expoController.createAppointment
  );
  router.get(
    "/api/apointments/:id",
    token.verifyToken,
    expoController.getAppointments
  );

  router.post(
    "/api/hour/create",
    token.verifyToken,
    expoController.createSponsorHour
  );
  router.get(
    "/api/hour/delete/:hourId",
    token.verifyToken,
    expoController.deleteSponsorHour
  );
  router.get(
    "/api/sponsor-hour/:id",
    token.verifyToken,
    expoController.getSponsorhour
  );
  router.get(
    "/api/sponsor-hour-front/:id",
    token.verifyToken,
    expoController.getSponsorhourFront
  );
  router.get(
    "/api/edit/hour/:id",
    token.verifyToken,
    expoController.editSponsorhour
  );
  router.post(
    "/api/update/hour/:id",
    token.verifyToken,
    expoController.updateHour
  );

  router.post(
    "/api/video/:id",
    token.verifyToken,
    expoController.getSponsorVideo
  );
  router.get(
    "/api/dashboard/:id",
    token.verifyToken,
    dashboardController.getDashboard
  );
  router.post(
    "/api/agendajoin",
    token.verifyToken,
    agendaController.createAgendaJoin
  );
  router.get(
    "/api/agendajoin/:id",
    token.verifyToken,
    agendaController.getAgendaJoin
  );
  router.post("/api/add-review", token.verifyToken, agendaController.addReview);
  router.get(
    "/api/review/:userId/:agendaId/:joinedAgendaId",
    agendaController.getReview
  );

  router.post("/api/add-note/:id", token.verifyToken, agendaController.addNote);

  router.get(
    "/api/fetch-tags/:eventId",
    // token.verifyToken,
    agendaController.fetchTags
  );

  router.post(
    "/api/user/updateProfileVisibility",
    token.verifyToken,
    userController.updateProfileVisibility
  );

  router.post(
    "/api/suggested-me/agendas",
    token.verifyToken,
    suggestMeController.fetchSuggestedAgenda
  );

  router.get(
    "/api/quest/fetchRewardsCategory/:id",
    // token.verifyToken,
    rewardsController.getRewardsCategory
  );

  router.post(
    "/api/quest/addRewardsPoints",
    // token.verifyToken,
    rewardsController.AddRewardsPoint
  );

  router.get(
    "/api/quest/fetchPoints/:userId",
    // token.verifyToken,
    rewardsController.fetchPoints
  );

  router.get(
    "/api/quest/fetchLeaderboard/:userId",
    token.verifyToken,
    rewardsController.fetchLeaderBoard
  );

  router.post(
    "/api/fetchUserHaveSameInterest",
    token.verifyToken,
    userController.fetchUserHaveSameInterest
  );
  router.get("/api/vox-auth", agendaController.voxAuth);
  router.get("/api/vox-conference-data", agendaController.voxConferenceData);
  router.post(
    "/api/tag-agenda",
    token.verifyToken,
    agendaController.GetTagAgenda
  );

  router.get(
    "/api/fetch/adminData",
    token.verifyToken,
    userController.fetchAdminData
  );

  router.get(
    "/api/fetch/speaker/:eventId",
    token.verifyToken,
    userController.fetchSpeakerData
  );

  router.post(
    "/api/fetch/on-demand",
    token.verifyToken,
    expoController.fetchOnDemand
  );

  router.get(
    "/api/fetch/notification/:eventId",
    token.verifyToken,
    userController.fetchNotification
  );

  router.get(
    "/api/fetch/boothDetail/:boothId",
    token.verifyToken,
    expoController.boothDetail
  );

  router.post("/api/logout", token.verifyToken, userController.logout);

  router.post(
    "/api/saveHotspot",
    token.verifyToken,
    userController.saveHotspot
  );

  router.post(
    "/api/read-notification",
    token.verifyToken,
    userController.readNotification
  );

  router.post(
    "/api/check-notification",
    token.verifyToken,
    userController.CheckNotification
  );

  router.post("/api/check-user", userController.UserCheck);
};
