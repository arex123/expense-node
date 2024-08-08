const serverURI = "http://localhost:3002/";
if (!localStorage.getItem("token")) {
  window.location.href = "/user/showLogin";
} else {
  document.querySelector(".logout").onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "/user/showLogin";
  };

  function handleExpenseSubmit(event) {
    let token = localStorage.getItem("token");
    event.preventDefault();
    const data = {
      amount: event.target.amount.value,
      description: event.target.description.value,
      category: event.target.category.value,
    };
    console.log("10");
    console.log("toekn ", token);
    axios
      .post(serverURI + "expense/submit-form", data, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        displayUserOnScreen(response.data);
        // Clearing the input fields
        document.getElementById("amount").value = "";
        document.getElementById("description").value = "";
        document.getElementById("category").value = "";
      })
      .catch((error) => console.log("eeeee", error));
  }

  function displayUserOnScreen(userDetails) {
    const userItem = document.createElement("li");
    userItem.id = userDetails.id;
    userItem.appendChild(
      document.createTextNode(
        `${userDetails.amount} - ${userDetails.description} - ${userDetails.category}`
      )
    );

    const deleteBtn = document.createElement("button");
    deleteBtn.appendChild(document.createTextNode("Delete"));
    userItem.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.appendChild(document.createTextNode("Edit"));
    userItem.appendChild(editBtn);

    const userList = document.querySelector(".list-group");
    userList.appendChild(userItem);

    deleteBtn.addEventListener("click", function (event) {
      console.log("idd dele: ", event.target.parentElement.id);

      let token = localStorage.getItem("token");

      axios
        .delete(serverURI + "expense/remove/" + event.target.parentElement.id, {
          headers: {
            Authorization: token,
          },
        })
        .then((d) => {
          console.log("deleted ", d);
          userList.removeChild(event.target.parentElement);
        })
        .catch((e) => console.log("error while deleting ", e));
    });

    editBtn.addEventListener("click", function (event) {
      axios
        .delete(serverURI + "expense/remove/" + event.target.parentElement.id, {
          headers: {
            Authorization: token,
          },
        })
        .then((d) => {
          console.log("deleted ", d);

          userList.removeChild(event.target.parentElement);
          document.getElementById("amount").value = userDetails.amount;
          document.getElementById("description").value =
            userDetails.description;
          document.getElementById("category").value = userDetails.category;
        })
        .catch((e) => console.log("error while deleting ", e));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // let ullist = document.querySelector('ul')
    let token = localStorage.getItem("token");
    axios
      .get(serverURI + "expense/getAll", {
        headers: {
          Authorization: token,
        },
      })
      .then((d) => {
        console.log("data ", d);
        if (d.data.isPremiumUser) {
          document.querySelector(".buy-premium").style.display = "none";
          document.querySelector(".prem-msg").style.display = "block";
          
          document.querySelector("#leaderboard").style.display = "block";


        }
        let details = d.data.data;
        for (let i = 0; i < details.length; i++) {
          displayUserOnScreen(details[i]);
        }
      })
      .catch((e) => {
        console.log("error ", e);
        localStorage.removeItem("token");
        window.location.href = "/user/showLogin";
      });
  });

  // let buyPremiunBtn = document.querySelector('.buy-premium')
  document.querySelector(".buy-premium").onclick = function (event) {
    console.log("clicked");
    let token = localStorage.getItem("token");
    axios
      .get(serverURI + "purchase/premium", {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        console.log("response ", response);

        var options = {
          key: response.data.key_id,
          order_id: response.data.result.id,
          handler: async function (response) {
            let updateTxn = await axios.post(
              serverURI + "purchase/updateTransaction",
              {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id,
              },
              { headers: { Authorization: token } }
            );
            console.log("update txn ",updateTxn)


            document.querySelector('.buy-premium').style.display='none'
            document.querySelector(".prem-msg").style.display = "block";

           document.querySelector("#leaderboard").style.display = "block";

           localStorage.setItem('token',updateTxn.data.token)


            alert("you are a premium user");
          },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on("payment.failed", (response) => {
          console.log("payment failed response, ", response);
          alert("Payment failed");
        });
      });
  };



  document.querySelector(".leaderboard-btn").onclick = function(){
    let token = localStorage.getItem('token')
    axios.get(serverURI+"premium/showLeaderboard", {
      headers: {
      Authorization: token,
    }})
    .then(result=>{
      console.log(result)
       document.querySelector('.leaderboard-list').innerHTML=''       

      result.data.forEach(element => {
          displayOnLeaderboard(element)
      });


    })
    .catch(err=>{
      console.log(err)
    })
  }
  function displayOnLeaderboard(user){
    let list = document.querySelector('.leaderboard-list')
    let item = document.createElement('li')
    user.totalAmount = user.totalAmount==null?0:user.totalAmount
    item.textContent = "Name: "+user.name+" expense: "+user.totalAmount
    list.appendChild(item)
  }

}
