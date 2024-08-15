async function handleForgetForm(event) {
    event.preventDefault();
    console.log("eve: ",event, event.target.email.value);
    try{

        let result = await axios.post("http://localhost:3002/user/password/forgotpassword",{email:event.target.email.value})
        if(!result){
            console.log("82 failed",result)
            throw new Error("not found")
        }
        console.log("succ ",result)
        console.log(result)
        alert("check your email")
    }catch(err){
        console.log(err)
    }
  }