var express = require('express');
var router = express.Router();

var Room = require("../models/Room");


function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}


router.get('/', needAuth, function(req, res, next) { // 처음 버튼 2개잇는곳
  res.render('todos');
});

router.get("/back", function (req, res, next) { // 방 보러 갓다 뒤로가기
  res.render("todos");
});


router.get('/show', needAuth, function(req, res, next) { // 방 보는대로 이동
  Room.find({}, function(err, rooms) {
    if (err) {
      return next(err);
    }
  res.render('posts/index' ,{rooms: rooms});
  });
});



router.get("/new", function (req, res, next) { //방만들기
  res.render("posts/edit",{post: {}});
});


router.get("/:id/edit", function (req, res, next) { //방만들기
    Room.findById(req.params.id, function(err, room) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: room});//post가 만들어졋고 이건 현재의 data 다 post를 보낸다
  });
});


router.get("/:id", function (req, res, next) {
  Room.findById(req.params.id, function(err, room) {
    if (err) {
      return next(err);
    }
    room.read++;// 조회수를 늘려주고
    room.save(function(err){//저장한다
      if(err){
        return next(err);
      }else{
        res.render('posts/show', {room: room});
      }
    });
  });
});


router.post('/search', function(req, res, next) {


   if(req.body.city === "전체"){
    Room.find({}, function(err, rooms) {
      if (err) {
        return next(err);
      }
    res.render('posts/index' ,{rooms: rooms});
    });
  }else{
    Room.find({city: req.body.city}, function(err, rooms){
        if (err) {
            return next(err);
        }
        res.render('posts/index', {rooms: rooms});
    });
  }


});


router.post("/", function (req, res, next) { // 방만들기

  var room = new Room({

      title: req.body.title,
      content: req.body.content ,
      city: req.body.city,
      address: req.body.address,
      facility: req.body.facility,
      price:req.body.price,
      rule: req.body.rule,

      name: req.user.name,
      email: req.user.email
    }) ;
    room.save(function(err){
      if(err){
        return next(err);
      }else{
        res.redirect('/todos');
      }
    });
});
router.put("/:id", function (req, res, next) { // 방만들기
  Room.findById({_id: req.params.id}, function(err, room) {
      if (err) {
        return next(err);
      }
      room.title= req.body.title;
      room.content= req.body.content;
      room.city=req.body.city;
      room.address=req.body.address;
      room.facility=req.body.facility;
      room.price=req.body.price;
      room.rule= req.body.rule;
      room.name=req.user.name;
      room.email=req.user.email;

      room.save(function(err){
      if(err){
        return next(err);
      }else{
        res.redirect('/todos');
      }
    });
  });
});
router.delete('/:id', function(req, res, next) { // 삭제
  Room.findOneAndRemove({_id: req.params.id}, function(err){
    if(err){
      return next(err);
    }
    res.redirect('/todos');
  });
});

module.exports = router;
