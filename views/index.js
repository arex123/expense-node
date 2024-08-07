const serverURI = "http://localhost:3002/";
function handleExpenseSubmit(event) {
  let token = localStorage.getItem('token')
  event.preventDefault();
  const data = {
    amount: event.target.amount.value,
    description: event.target.description.value,
    category: event.target.category.value,
  };
  console.log("10")
  console.log("toekn ",token)
  axios
    .post(serverURI+'expense/submit-form', data,{
      headers: {
        "Authorization": token
      }
    })
    .then((response) => {
      displayUserOnScreen(response.data);
      // Clearing the input fields
      document.getElementById("amount").value = "";
      document.getElementById("description").value = "";
      document.getElementById("category").value = "";
    })
    .catch((error) => console.log("eeeee",error));
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

  const userList = document.querySelector("ul");
  userList.appendChild(userItem);

  deleteBtn.addEventListener("click", function (event) {

    console.log("idd dele: ",event.target.parentElement.id)

    let token = localStorage.getItem('token')

    axios.delete(serverURI+"expense/remove/"+event.target.parentElement.id,
      { headers: {
      "Authorization": token
    }})
    .then((d)=>{
      console.log("deleted ",d)
      userList.removeChild(event.target.parentElement);
    }).catch((e)=>console.log("error while deleting ",e))

  });

  editBtn.addEventListener("click", function (event) {
    axios.delete(serverURI+"expense/remove/"+event.target.parentElement.id,{
      headers: {
        "Authorization": token
      }
    })
    .then((d)=>{
      console.log("deleted ",d)

      userList.removeChild(event.target.parentElement);
      document.getElementById("amount").value = userDetails.amount;
      document.getElementById("description").value = userDetails.description;
      document.getElementById("category").value = userDetails.category;

    }).catch((e)=>console.log("error while deleting ",e))
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // let ullist = document.querySelector('ul')
  let token = localStorage.getItem('token')
  axios.get(serverURI+"expense/getAll",{
    headers: {
      "Authorization": token
    }
  })
  .then((d)=>{
    console.log("data ",d.data)
    let details = d.data
    for(let i=0;i<details.length;i++){
      displayUserOnScreen(details[i])
    }
  }).catch((e)=>{
    console.log("error ",e)
  })
});


// let buyPremiunBtn = document.querySelector('.buy-premium')
document.querySelector('.buy-premium').onclick = function(event){
 
 console.log("clicked")
 let token = localStorage.getItem('token')
 axios.get(serverURI+'/purchase/premium',{
  headers:{
    'Authorization':token
  }
 })

}


