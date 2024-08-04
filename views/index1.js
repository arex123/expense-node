let list = document.querySelector('ul')
let form = document.querySelector('form')


form.addEventListener('submit',function(event){
    event.preventDefault()

    let innerLists = document.querySelectorAll('li')

    let detail = {
        id:innerLists.length+1,
        amount:event.target.amount.value,
        description:event.target.description.value,
        category:event.target.category.value
    }

    let allExpense = []
    allExpense.push(detail)
    let prevStorage = localStorage.getItem('expenseTracker')
    if(prevStorage!=undefined){
        let data = JSON.parse(prevStorage)
        allExpense = allExpense.concat(data)
    }
    localStorage.setItem('expenseTracker',JSON.stringify(allExpense))

    let newItem = document.createElement('li')
    newItem.id = detail.id
    newItem.className='list-group-item'

    let contents = document.createElement('span')
    contents.textContent=detail.amount+" - "+detail.description+" - "+detail.category
    newItem.appendChild(contents)
    
    let editbtn = document.createElement('button')
    editbtn.appendChild(document.createTextNode("Edit"))
    editbtn.className='edit-btn btn-success'

    newItem.appendChild(editbtn)
    let deletebtn = document.createElement('button')
    deletebtn.appendChild(document.createTextNode("Delete"))
    deletebtn.className='delete-btn btn-danger'
    newItem.appendChild(deletebtn)

    list.appendChild(newItem)

})

let items = localStorage.getItem('expenseTracker')
items = JSON.parse(items)
console.log(items)
if(items){

    for(let item of items){
        
        
        let newItem = document.createElement('li')
        newItem.className='list-group-item'

        newItem.id = item.id

        let contents = document.createElement('span')
        contents.textContent=item.amount+" - "+item.description+" - "+item.category
        newItem.appendChild(contents)
        // newItem.textContent=item.amount+" - "+item.description+" - "+item.category
        
        let editbtn = document.createElement('button')
        editbtn.appendChild(document.createTextNode("Edit"))
        editbtn.className='edit-btn btn-success'    
        newItem.appendChild(editbtn)
        
        let deletebtn = document.createElement('button')
        deletebtn.appendChild(document.createTextNode("Delete"))
        deletebtn.className='delete-btn btn-danger'
        newItem.appendChild(deletebtn)
        
        list.appendChild(newItem)
        
}
}

let lists = document.querySelector('ul')
lists.addEventListener('click',function(event){
    if(event.target.classList.contains('delete-btn')){
        let itemToDel = event.target.parentElement
        console.log("item to del ",itemToDel)
        lists.removeChild(itemToDel)

        let prevData = localStorage.getItem('expenseTracker')
        prevData = JSON.parse(prevData)
        let newArr = prevData.filter(prev=>prev.id!=itemToDel.id)
        localStorage.setItem('expenseTracker',JSON.stringify(newArr))
    }else if(event.target.classList.contains('edit-btn')){
        let itemToDel = event.target.parentElement
        console.log("span ",itemToDel.querySelector('span'))
        let spanEle = itemToDel.querySelector('span')
        spanEle.contentEditable = true
        event.target.textContent = "Save"
        event.target.className=''
        event.target.className='save-btn btn-primary'
        
    }else  if(event.target.classList.contains('save-btn')){
        let itemToup = event.target.parentElement
        let spanEle = itemToup.querySelector('span')
        spanEle.contentEditable = false
        
        let newDet = spanEle.innerHTML
        
        event.target.textContent = "Edit"
        event.target.className=''
        event.target.className='edit-btn btn-success'
       
        console.log("new text ",newDet.trim().split('-'))
        newDet = newDet.trim().split('-')

        let prevData = localStorage.getItem('expenseTracker')
        prevData = JSON.parse(prevData)
        for(let i=0;i<prevData.length;i++){
            if(prevData[i].id==itemToup.id){
                prevData[i].amount =newDet[0] 
                prevData[i].description =newDet[1] 
                prevData[i].category =newDet[2] 
            }
        }

        localStorage.setItem('expenseTracker',JSON.stringify(prevData))

        // itemToDel.contentEditable = true
        // event.target.textContent = "Save"
        // event.target.className=''
        // event.target.className='save-btn'
        // lists.removeChild(itemToDel)

        // let prevData = localStorage.getItem('expenseTracker')
        // prevData = JSON.parse(prevData)
        // let newArr = prevData.filter(prev=>prev.id!=itemToDel.id)
        // localStorage.setItem('expenseTracker',JSON.stringify(newArr))
    }
   
})