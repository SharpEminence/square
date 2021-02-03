

module.exports = (app)=>{
    require('./../components/admin/routes/router')(app);
    require('./../components/admin/routes/client_router')(app);
    require('./../components/admin/routes/question_router')(app);
    require('./../components/api/user/routes/router')(app); 
    require('./../components/admin/routes/event_router')(app);
    require('./../components/admin/routes/sponser_router')(app);
    require('./../components/admin/routes/speaker_router')(app);
    require('./../components/admin/routes/collaborater_router')(app);
    require('./../components/admin/routes/agenda_router')(app);
    require('./../components/admin/routes/summit_router')(app);
    require('./../components/admin/routes/poll_router')(app);
    require('./../components/admin/routes/survey_router')(app);
    require('./../components/admin/routes/faq_router')(app);
    require('./../components/admin/routes/help_router')(app);
    require('./../components/admin/routes/news_router')(app);
    require('./../components/admin/routes/category_router')(app);
    require('./../components/admin/routes/agenda_category_router')(app);
    require('./../components/admin/routes/membership_router')(app);
    require('./../components/admin/routes/user_designation_router')(app);
    require('./../components/admin/routes/demand_router')(app);
    require('./../components/admin/routes/president_router')(app);
    require('./../components/admin/routes/notification_router')(app);
    require('./../components/admin/routes/broadcast_router')(app);
    require('./../components/admin/routes/hour_router')(app);

    
}