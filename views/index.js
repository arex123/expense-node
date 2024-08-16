const serverURI = "http://13.60.215.235/";
console.log("hi from aditya")
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
        RefreshExpenseList()

        // displayUserOnScreen(response.data);

        // Clearing the input fields
        document.getElementById("amount").value = "";
        document.getElementById("description").value = "";
        document.getElementById("category").value = "";
      })
      .catch((error) => console.log("eeeee", error));
  }

  function displayUserOnScreen(userDetails) {
    const userList = document.querySelector(".list-group");

    const userItem = document.createElement("li");
    userItem.id = userDetails.id;
    userItem.appendChild(
      document.createTextNode(
        `${userDetails.amount} - ${userDetails.description} - ${userDetails.category}`
      )
    );

    let divAroundBtns = document.createElement("div");
    divAroundBtns.id = userDetails.id;

    const deleteBtn = document.createElement("button");
    deleteBtn.appendChild(document.createTextNode("Delete"));
    // userItem.appendChild(deleteBtn);
    divAroundBtns.appendChild(deleteBtn);

    const editBtn = document.createElement("button");
    editBtn.appendChild(document.createTextNode("Edit"));
    // userItem.appendChild(editBtn);
    divAroundBtns.appendChild(editBtn);

    userItem.appendChild(divAroundBtns);

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
          // userList.removeChild(event.target.parentElement.parentElement);
          RefreshExpenseList()
        })
        .catch((e) => console.log("error while deleting ", e));
    });
    
    editBtn.addEventListener("click", function (event) {
      let token = localStorage.getItem("token");

      axios
        .delete(serverURI + "expense/remove/" + event.target.parentElement.id, {
          headers: {
            Authorization: token,
          },
        })
        .then((d) => {
          console.log("deleted ", d);

          // userList.removeChild(event.target.parentElement.parentElement);
          document.getElementById("amount").value = userDetails.amount;
          document.getElementById("description").value =
            userDetails.description;
          document.getElementById("category").value = userDetails.category;
          RefreshExpenseList()

        })
        .catch((e) => console.log("error while deleting ", e));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    // let ullist = document.querySelector('ul')
    RefreshExpenseList();
  });

  function RefreshExpenseList() {
    let token = localStorage.getItem("token");
    let page = 1;
    let pageItems = localStorage.getItem("pageItems");
    if (!pageItems) {
      pageItems = 5;
      localStorage.setItem("pageItems", 5);
    }

    console.log("pageItemspageItems ", pageItems);

    document.querySelector("#page-items").value = pageItems;

    axios
      .get(serverURI + `expense/products?page=${page}&pageItems=${pageItems}`, {
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

        document.querySelector(".list-group").innerHTML = "";

        let details = d.data.products;
        for (let i = 0; i < details.length; i++) {
          displayUserOnScreen(details[i]);
        }
        showPagination(d.data.pageData);
        if(details.length>0){

          document.getElementsByClassName("list-conf")[0].style.display = "flex";
          document.querySelector('.empty-list').style.display = 'none'
        }
      

      })
      .catch((e) => {
        console.log("error ", e);
        localStorage.removeItem("token");
        window.location.href = "/user/showLogin";
      });
  }

  let pagination = document.querySelector(".pagination");

  function showPagination({
    currentPage,
    nextPage,
    hasNextPage,
    prevPage,
    hasPrevPage,
    lastPage,
  }) {
    pagination.innerHTML = "";
    if (hasPrevPage) {
      const btn1 = document.createElement("a");
      btn1.innerHTML = prevPage;
      btn1.addEventListener("click", () => getProducts(prevPage));
      pagination.appendChild(btn1);
    }
    const btn = document.createElement("a");
    btn.className = "active-page";
    btn.innerHTML = currentPage;
    // btn.addEventListener('click',()=>getProducts(currentPage))
    pagination.appendChild(btn);

    if (hasNextPage) {
      const btn2 = document.createElement("a");
      btn2.innerHTML = nextPage;
      btn2.addEventListener("click", () => getProducts(nextPage));
      pagination.appendChild(btn2);
    }
  }

  function getProducts(page) {
    let pageItems = localStorage.getItem("pageItems");
    if (!pageItems) {
      localStorage.getItem("pageItems", 5);
      pageItems = 5;
    }

    let token = localStorage.getItem("token");
    axios
      .get(serverURI + `expense/products?page=${page}&pageItems=${pageItems}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((data) => {
        showPagination(data.data.pageData);

        document.querySelector(".list-group").innerHTML = "";
        let details = data.data.products;
        for (let i = 0; i < details.length; i++) {
          displayUserOnScreen(details[i]);
        }
      })
      .catch((err) => {
        console.log("erro while fetching ", err);
      });
  }

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
            console.log("update txn ", updateTxn);

            document.querySelector(".buy-premium").style.display = "none";
            document.querySelector(".prem-msg").style.display = "block";

            document.querySelector("#leaderboard").style.display = "block";

            localStorage.setItem("token", updateTxn.data.token);

            alert("you are a premium user");
          },
        };

        const rzp1 = new Razorpay(options);
        rzp1.open();

        rzp1.on("payment.failed", (response) => {
          console.log("payment failed response, ", response);
          alert("Payment failed");
        });
        rzp1.on('payment.error', function (response) {
          console.log('Payment error:', response);
        });
      });
  };

  document.getElementById("page-items").addEventListener("change", function () {
    localStorage.setItem("pageItems", this.value);
    getProducts(1);
  });

  // document.querySelector(".leaderboard-btn").onclick = function(){
  function showLeaderBoard() {
    let token = localStorage.getItem("token");
    axios
      .get(serverURI + "premium/showLeaderboard", {
        headers: {
          Authorization: token,
        },
      })
      .then((result) => {
        console.log(result);
        document.querySelector(".leaderboard-list").innerHTML = "";

        result.data.forEach((element) => {
          displayOnLeaderboard(element);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
  function displayOnLeaderboard(user) {
    let list = document.querySelector(".leaderboard-list");
    let item = document.createElement("li");
    user.totalExpense = user.totalExpense == null ? 0 : user.totalExpense;
    item.textContent = "Name: " + user.name + " expense: " + user.totalExpense;
    list.appendChild(item);
  }
}

document.querySelector(".leaderboard_page").addEventListener("click", () => {
  console.log("showing leaderboard");
  window.location.href = "/expense/leaderboard";
});

async function downloadExpense() {
  console.log("downloading");
  try {
    let token = localStorage.getItem("token");
    let data = await axios.get(serverURI + "expense/download", {
      headers: {
        Authorization: token,
      },
    });
    console.log("dfile", data);
    if (data.status == 200) {
      let a = document.createElement("a");
      a.href = data.data.fileUrl;
      a.download = "myexpense.csv";
      a.click();
    } else {
      throw new Error(data.data.message);
    }
  } catch (err) {
    console.log("ere ", err);
  }
}
