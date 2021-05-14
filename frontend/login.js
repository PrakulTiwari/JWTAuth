const form = document.getElementById('log-form')

form.addEventListener('submit', loginUser)

async function loginUser(event){
    event.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    const result = await fetch('http://localhost:3000/api/login',{
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password
        })
    }).then((res) => res.json())
    if (result.status=='ok'){
        console.log('got the token:',result.data)
        localStorage.setItem('token',result.data)
        alert('success')
    }
    else{
        alert(result.err)
    }
}