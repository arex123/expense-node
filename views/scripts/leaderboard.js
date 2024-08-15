const serverURI = "http://13.61.32.225/";
document.addEventListener("DOMContentLoaded", () => {

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

})

function displayOnLeaderboard(user){
    let list = document.querySelector('.leaderboard-list')
    let item = document.createElement('li')
    item.className = "l_list_item"

    user.totalExpense = user.totalExpense==null?0:user.totalExpense

    //for name
    let namecontent = document.createElement('div')

    let nameTitle = document.createElement('span')
    nameTitle.innerHTML = "Name:"
    namecontent.appendChild(nameTitle)
    
    let nameValue = document.createElement('span')
    nameValue.innerHTML = user.name

    namecontent.appendChild(nameValue)

    //for amount
    let amountcontent = document.createElement('div')

    let amountTitle = document.createElement('span')
    amountTitle.innerHTML = "Total Expense:"
    amountcontent.appendChild(amountTitle)
    
    let amountValue = document.createElement('span')
    amountValue.innerHTML = user.totalExpense

    amountcontent.appendChild(amountValue)


    item.appendChild(namecontent)
    item.appendChild(amountcontent)
    

    list.appendChild(item)
    let linedown = document.createElement('hr')
    list.appendChild(linedown)
    



    // let amountcontent = document.createElement('span')

    // user.totalExpense = user.totalExpense==null?0:user.totalExpense
    // item.textContent = "Name: "+user.name+" expense: "+user.totalExpense
    // list.appendChild(item)
  }


  document.querySelector('.home_nav').addEventListener('click',()=>{
    window.location.href = "/expense"
  })