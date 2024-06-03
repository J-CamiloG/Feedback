const user = document.getElementById('username');
const pass = document.getElementById('password');
const submitLogin = document.getElementById('submit-login');
const formLogin = document.querySelector('.from-login');

submitLogin.addEventListener('click', (e) => {
    
    const username = user.value;
    const password = pass.value;

    e.preventDefault()

    formLogin.reset()
    validarCredenciales(username, password)
})


// funtion para comparar  el usuario del json con el ingresado por los inputs. 

async function validarCredenciales(username, password) {
    const pregunta = await fetch ('http://localhost:3000/users');
    const data = await pregunta.json();


    const user = data.find(user => user.username === username && user.password === password);


    if (user) {
        console.log('Credenciales válidas');
        // local
        localStorage.setItem('authenticated', 'true');
        // Redirigir a otra página
        window.location.href = './source/pages/admin/admin.html'; // Reemplaza con la ruta correcta
    } else {
        console.log('Credenciales inválidas');
        // Realizar acciones adicionales si las credenciales son inválidas
        alert('Credenciales inválidas. Por favor, intenta de nuevo.');
    }
    // data.forEach(element => {
    //     if (username === element.username && password === element.password) {
    //         alert('Iniciastes seccion');
    //     }else{
    //         console.log('error');
    //     }
    // });
}