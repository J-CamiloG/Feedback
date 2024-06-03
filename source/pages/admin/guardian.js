function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('authenticated');

    if (isAuthenticated !== 'true') {
        // Redirigir a la página de inicio de sesión si no está autenticado
        window.location.href = '../../../index.html'; // Asegúrate de ajustar la ruta según la ubicación del archivo
    }
}

// Llamar a la función para verificar la autenticación al cargar la página
document.addEventListener('DOMContentLoaded', checkAuthentication);
