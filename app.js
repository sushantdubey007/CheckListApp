const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const date = require(__dirname + "/date.js");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");

/* var items = [];
var workItems=[]; */
/*
mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
*/

mongoose.connect("mongodb+srv://admin-sushant:test123@cluster0.lqaus.mongodb.net/todolistDB?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});



const itemsSchema = {
  name: String
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Welcome to your to do list",
});
const item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const item3 = new Item({
  name: "click check box to delete item",
});
const defaultItems = [item1, item2, item3];

/*
Item.insertMany(defaultItems,function(err){
  if(err){
    console.log(err);
  }else {
    console.log("suceess saved our default items");
  }
})*/

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {

  let day = date.getDate();

  Item.find({}, function(err, foundItem) {
    if (foundItem.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("suceess saved our default items");
        }
        res.redirect("/");
      });
    } else {
      res.render("list", { toDoList: "Today", newListItem: foundItem});
    }
    //console.log(foundItme);
  //res.render("list",{toDoList:day, newListItem:items});
  //res.render("list",{toDoList: "Today", newListItem:items});
});
});
/*
app.get("/work", function(req, res) {
  res.render("list", {
    toDoList: "work",
    newListItem: workItems
  })
})
*/
app.get("/:customListName", function(req,res){
  //console.log(req.params.customListName);
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName},function(err,foundList){
    if(!err){
      if(!foundList){
        console.log("Does not exist");
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/"+customListName);
      }
      else{
        res.render("List",  { toDoList: foundList.name, newListItem: foundList.items});
      }
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about");
})

app.post("/", function(req, res) {
/*
  item = req.body.inputItem;
  if (req.body.listButton === "work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
  */
  const itemName = req.body.inputItem;
  const listName = req.body.listButton;

  const item4 = new Item({
    name: itemName
  });
  if(listName === "Today"){
    item4.save();
    res.redirect("/");
  } else{
    List.findOne({name: listName}, function(err,foundList){
      foundList.items.push(item4);
      foundList.save();
      res.redirect("/"+listName);
    })
  }
});


app.post("/delete",function(req,res){
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
  if(listName === "Today"){
    Item.findByIdAndRemove (checkedItemID, function(err){
      if(!err){
        console.log("delete success");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({name: listName},{$pull: {items: {_id:checkedItemID}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listName);
      }
    })

  }

});

app.listen(process.env.PORT||3000, function() {
  console.log("server started on port 3000");
});
