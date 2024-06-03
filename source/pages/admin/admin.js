
const app = document.querySelector('.app');
const btnVerTrabajos = document.getElementById('btn-ver-trabajos');
const btnAgregarTrabajo = document.getElementById('agregar');


const btnFiltrar = document.getElementById('btn-filtrar');

btnFiltrar.addEventListener('click', buscarFiltros);

btnVerTrabajos.addEventListener('click', () => {
    if (app.style.display === 'none' || app.innerHTML === '') {
        app.style.display = 'block';
        imprimirTrabajos();
    } else {
        app.style.display = 'none';
    }
});

btnAgregarTrabajo.addEventListener('click', agregar)

async function imprimirTrabajos() {
    try {
        const respuesta = await fetch('http://localhost:3000/trabajos');
        const data = await respuesta.json();

        // Limpiar la interfaz antes de imprimir los resultados
        app.innerHTML = '';

        // Imprimir los trabajos obtenidos
        data.forEach(element => {
            const trabajoHTML = `
                <div data-id="${element.id}">
                    <div class = "jop-txt">
                        <h2>${element.titulo}</h2>
                        <p>${element.descripcion}</p>
                    </div>
                    <div class ="btns">
                        <button class="delete">Eliminar</button>
                        <button class="actualizar">Actualizar</button>
                    </div>
                </div>
            `;
            app.insertAdjacentHTML('beforeend', trabajoHTML);
        });

        const btnEliminar = document.querySelectorAll('.delete');
        const btnEditar = document.querySelectorAll('.actualizar');

        btnEliminar.forEach(btn => {
            
            btn.addEventListener('click', (event) => {
                const trabajoId = event.target.closest('[data-id]').getAttribute('data-id');
                eliminar(trabajoId)
            } );
        });

        btnEditar.forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault()
                const trabajoId = event.target.closest('[data-id]').getAttribute('data-id');
                editar(trabajoId)
            } );
        });

    } catch (error) {
        console.error('Error al obtener los trabajos:', error);
    }
}

async function eliminar(trabajoId) {
    const respuesta = await fetch(`http://localhost:3000/trabajos/${trabajoId}`, {
            method: 'DELETE'
        });
        if (respuesta.ok) {
            // Eliminar el trabajo de la interfaz de usuario
            const trabajo = document.querySelector(`[data-id="${id}"]`);
            trabajo.remove();
            console.log('Trabajo eliminado exitosamente');
        } else {
            console.error('Error al eliminar el trabajo');
        }
}

async function agregar() {
    const formContainer = document.createElement('section');
    const form = `
        <form class="form">
            <p class="title">Crear Trabajo</p>
            <label>
                <input class="input-titulo" type="text" placeholder="Título" required>
            </label> 
            <label>
                <textarea class="input-descripcion" placeholder="Descripción" required></textarea>
            </label>
            <label>
                <select class="input-modalidad" required>
                    <option value="" disabled selected>Selecciona modalidad</option>
                    <option value="Tiempo completo">Tiempo completo</option>
                    <option value="Medio tiempo">Medio tiempo</option>
                    <option value="Prácticas">Prácticas</option>
                </select>
                <span>Modalidad</span>
            </label>
            <button class="submit-new-jop">Crear</button>
            <p class="signin">Already have an account? <a href="#">Sign in</a></p>
        </form>
    `
    formContainer.innerHTML = form;
    app.appendChild(formContainer);

    const btnAgregarTrabajoNew = document.querySelector('.submit-new-jop');
    btnAgregarTrabajoNew.addEventListener('click', async (e) => {
        e.preventDefault();

        const titulo = document.querySelector('.input-titulo').value;
        const descripcion = document.querySelector('.input-descripcion').value;
        const modalidad = document.querySelector('.input-modalidad').value;

        const nuevoTrabajo = {
            titulo: titulo,
            descripcion: descripcion,
            modalidad: modalidad
        };

        console.log('Nuevo trabajo:', nuevoTrabajo);

        const respuesta = await fetch('http://localhost:3000/trabajos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoTrabajo)
        });

        if (respuesta.ok) {
            console.log('Trabajo agregado exitosamente');
            // Aquí podrías realizar alguna acción adicional después de agregar el trabajo
        } else {
            console.error('Error al agregar el trabajo:', respuesta.statusText);
        }
        
    });
}

async function buscarFiltros() {
    const busqueda = document.getElementById('busqueda').value;
    
    try {
        const response = await fetch('http://localhost:3000/trabajos');
        if (!response.ok) {
            throw new Error('Error al buscar trabajos');
        }
        const trabajos = await response.json();
        
        // Filtrar los trabajos en el cliente
        const trabajosFiltrados = trabajos.filter(trabajo => trabajo.titulo.includes(busqueda));
        
        // Limpiar la interfaz antes de imprimir los resultados
        app.innerHTML = '';
        
        // Imprimir los trabajos filtrados
        trabajosFiltrados.forEach(element => {
            const trabajoHTML = `
                <div data-id="${element.id}">
                    <div class="jop-txt">
                        <h2>${element.titulo}</h2>
                        <p>${element.descripcion}</p>
                    </div>
                    <div class="btns">
                        <button class="delete">Eliminar</button>
                        <button class="actualizar">Actualizar</button>
                    </div>
                </div>
            `;
            app.insertAdjacentHTML('beforeend', trabajoHTML);
        });
        
        // Agregar event listeners a los botones de eliminar
        const btnEliminar = document.querySelectorAll('.delete');
        btnEliminar.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const trabajoId = event.target.closest('[data-id]').getAttribute('data-id');
                eliminar(trabajoId);
            });
        });

    } catch (error) {
        console.error('Error al buscar trabajos:', error);
    }
}

async function editar(trabajoId) {
    try {
        // Obtener referencia al formulario de actualización
        const formEditar = document.querySelector('.form-actualizar'); // Corregir la clase del formulario
        formEditar.style.display = 'flex'; // Mostrar el formulario de actualización

        // Obtener referencia al botón de actualizar
        const btnActualizar = document.querySelector('#btn-actulaizar'); // Corregir la ID del botón

        // Event listener para el botón de actualizar
        btnActualizar.addEventListener('click', async (e) => {
            e.preventDefault(); // Prevenir el envío del formulario

            // Obtener valores del formulario
            const titulo = document.getElementById('titulo').value;
            const descripcion = document.getElementById('descripcion').value;

            try {
                // Obtener los datos del trabajo que se desea editar
                const response = await fetch(`http://localhost:3000/trabajos/${trabajoId}`);
                if (!response.ok) {
                    throw new Error('Error al obtener los datos del trabajo');
                }
                const trabajo = await response.json();

                // Actualizar los datos del trabajo con los valores de los campos del formulario
                trabajo.titulo = titulo;
                trabajo.descripcion = descripcion;

                // Enviar una solicitud PUT para actualizar los datos del trabajo en el servidor
                const actualizar = await fetch(`http://localhost:3000/trabajos/${trabajoId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trabajo)
                });

                if (!actualizar.ok) {
                    throw new Error('Error al actualizar el trabajo');
                }

                console.log('Trabajo actualizado con éxito');

                // Ocultar el formulario después de actualizar
                formEditar.style.display = 'none';
            } catch (error) {
                console.error('Error al actualizar el trabajo:', error);
            }
        });
    } catch (error) {
        console.error('Error al editar el trabajo:', error);
    }
}

