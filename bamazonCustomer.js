var mysql = require("mysql");
var inquirer = require ("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    readtable();
});

var tbl = "products";

function readtable() {
    connection.query("SELECT * FROM " + tbl, function(err, res) {
        if (err) throw err;

        console.log('=================================================');
        for (var i=0; i<res.length; i++){
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].price)
        }
        console.log('=================================================');
        placeOrder(0);
    });
};


function placeOrder(){
inquirer
    .prompt([
        {
            // The first should ask them the ID of the product they would like to buy.   
            name: "selectId", 
            type: "input",
            message: "Please provide the ID of the products you would like to buy."
      
        },
        {
            // The second message should ask how many units of the product they would like to buy.
            name: "selectQuantity",
            type: "input",
            message: "How many units would you like to order?"

        }
    ])
    .then(function(ans){
        var quantity = parseInt(ans.productQuantity);
        connection.query("SELECT * FROM " + tbl + " WHERE item_id = ?", [ans.selectId] ,function(err, res){
            if (ans.selectQuantity > res[0].stock_quantity){
                console.log("Insufficient Quantity");
                console.log("Order has been cancelled");
            }
            else {
                var invoice = ans.selectQuantity * res[0].price;
                console.log("Thank you for shopping with us");
                console.log("Total amount of your order is " + invoice)
                connection.query("UPDATE " + tbl + " SET ? WHERE ?", [
                    {
                        stock_quantity: res[0].stock_quantity - ans.selectQuantity
                    },{
                        item_id: ans.selectId
                    }],
                    function (err, res){
                        connection.end();
                    }) 
            }
        })
    }

    );
};