const express=require("express");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// const date=require(__dirname+"/date.js");
// var dateToday=date();

mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"toDoList",
}).then(()=> console.log("Database connected")).catch((e)=>console.log(e));
;

const itemschema= new mongoose.Schema({
    name:String
});
const Item=mongoose.model("item",itemschema);

const item1=new Item({
    name:"Welcome to todolist!"
});
const item2=new Item({
    name:"Hit the + button to add a new item"
});
const item3=new Item({
    name:"<-- Hit this to delete an item."
});

const defaultItems=[item1,item2,item3];

const listSchema={
    name:String,
    items:[itemschema]
}

const List=mongoose.model("List",listSchema)

app.get("/",function(req,res){

    Item.find(function(err,foundItems){
        if(foundItems.length===0){
           
        Item.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("successfully inserted!!")
            }
        })
        res.redirect("/");
        }
        else{
            res.render("list",{daytoday:"Today", newListItems:foundItems});
        }
        })

        app.get("/:customListName",function(req,res){
            const customListName=req.params.customListName;
            
            List.findOne({name:customListName},function(err,foundName){
                if(!err){
                  if(!foundName){
                    const list1=new List({
                        name:customListName,
                        items:defaultItems
                    })
                    list1.save(); 
                    res.redirect("/" + customListName);
                  }
                }else{
                    res.render("list",{daytoday:foundName.name, newListItems:foundName.items});
                }
            })
            
              
        })
       

//     var today=new Date();
 
   
//     var options={
//         weekday:"long",
//         day:"numeric",
//         month:"long"
//     };
//     var day=today.toLocaleDateString("en-US",options);
});

app.post("/",function(req,res){
        const itemName=req.body.newItem;
        const newItem=new Item({
            name:itemName,
        })
        newItem.save();
        res.redirect("/");
      
})

app.post("/delete",function(req,res){
    const checkedItemId=req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId,function(err){
        if(err){
            console.log(err)
        }else{
            console.log("successfully removed");
            res.redirect("/");
        }

    })
})


app.listen(3000,function(){
    console.log("server in running on port 3000");
});