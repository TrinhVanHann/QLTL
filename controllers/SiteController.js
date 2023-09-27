class SiteController{
    index(req, res, next){
        // if(req.session.firstVisit){
        //     res.render('home')
        // } else {
        //     res.render('login')
        // }
        res.render('home')
    }
}

module.exports = new SiteController