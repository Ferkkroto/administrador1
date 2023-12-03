function guardarAlmacenamientoLocal(llave, valor_a_guardar) {
    localStorage.setItem(llave, JSON.stringify(valor_a_guardar));
}

function obtenerAlmacenamientoLocal(llave) {
    const datos = JSON.parse(localStorage.getItem(llave));
    return datos;
}

let productos = obtenerAlmacenamientoLocal('productos') || [];
let mensaje = document.getElementById('mensaje');

// ...

// Añadir un producto
const añadirProducto = document.getElementById('productoAñadir');
const añadirValor = document.getElementById('valorAñadir');
const añadirExistencia = document.getElementById('existenciaAñadir');
const imagenInput = document.getElementById('imagenInput');
const imagenPreview = document.getElementById('imagenPreview');
const botonAñadir = document.getElementById('botonAñadir');

// Mostrar vista previa de la imagen al seleccionar un archivo
imagenInput.addEventListener('change', function (event) {
    const imagenSeleccionada = event.target.files[0];

    // Validar que se haya seleccionado un archivo y que sea una imagen
    if (imagenSeleccionada && /^image\//.test(imagenSeleccionada.type)) {
        const reader = new FileReader();

        reader.onload = function (e) {
            imagenPreview.src = e.target.result;
            imagenPreview.style.display = 'block';
        };

        reader.readAsDataURL(imagenSeleccionada);
    } else {
        // Limpiar la vista previa si no es una imagen válida
        imagenPreview.src = '#';
        imagenPreview.style.display = 'none';
    }
});

botonAñadir.addEventListener('click', function (event) {
    event.preventDefault();
    let productoAñadir = añadirProducto.value;
    let valorAñadir = añadirValor.value;
    let existenciaAñadir = añadirExistencia.value;

    // Validación: asegúrate de que se haya seleccionado una imagen
    if (!imagenInput.files || imagenInput.files.length === 0) {
        mensaje.classList.add('llenarCampos');
        setTimeout(() => {
            mensaje.classList.remove('llenarCampos');
        }, 2500);
        return;
    }

    // Obten la imagen seleccionada
    const imagenSeleccionada = imagenInput.files[0];

    // Validación: asegúrate de que la imagen sea un tipo de archivo de imagen válido
    if (!/^image\//.test(imagenSeleccionada.type)) {
        mensaje.classList.add('llenarCampos');
        setTimeout(() => {
            mensaje.classList.remove('llenarCampos');
        }, 2500);
        return;
    }

    // Crea un objeto FileReader para leer el contenido de la imagen
    const reader = new FileReader();

    // Define la lógica a ejecutar cuando la imagen se cargue
    reader.onload = function () {
        const urlImagen = reader.result; // La URL de la imagen cargada

        let van = true;

        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre === productoAñadir) {
                mensaje.classList.add('repetidoError');
                setTimeout(() => {
                    mensaje.classList.remove('repetidoError');
                }, 2500);
                van = false;
            }
        }

        if (van) {
            productos.push({
                nombre: productoAñadir,
                valor: valorAñadir,
                existencia: existenciaAñadir,
                urlImagen: urlImagen
            });

            mensaje.classList.add('realizado');
            setTimeout(() => {
                mensaje.classList.remove('realizado');
                actualizarVisualizacionProductos(); // Llama a la función de actualización
            }, 1500);
        }

        guardarAlmacenamientoLocal('productos', productos);
    };

    // Lee el contenido de la imagen como una URL
    reader.readAsDataURL(imagenSeleccionada);
});

// ...

// Resto del código...


// Editar
const productoEd = document.getElementById('productoEditar')
const atributoEd = document.getElementById('atributoEditar')
const nuevoAtributoEd = document.getElementById('nuevoAtributo')

document.getElementById("botonEditar").addEventListener("click", function (event) {
    event.preventDefault()
    let productoEditar = productoEd.value
    let atributoEditar = atributoEd.value
    let nuevoAtributo = nuevoAtributoEd.value
    let van = false
    if (productoEditar == '' || atributoEditar == '' || nuevoAtributo == '') {
        mensaje.classList.add('llenarCampos')
        setTimeout(() => { mensaje.classList.remove('llenarCampos') }, 2500)
    }
    else {
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].nombre == productoEditar) {
                productos[i][atributoEditar] = nuevoAtributo
                van = true
            }
        }
        if (van == true) {
            mensaje.classList.add('realizado')
            setTimeout(() => {
                mensaje.classList.remove('realizado')
                window.location.reload()
            }, 1500);
        }
        else {
            mensaje.classList.add('noExisteError')
            setTimeout(() => { mensaje.classList.remove('noExsiteError') }, 2500);
        }
        guardarAlmacenamientoLocal('productos', productos);
    }
})

// Eliminar
const productoE = document.getElementById('productoEliminar')

document.getElementById("botonEliminar").addEventListener("click", function (event) {
    event.preventDefault()
    let productoEliminar = productoE.value
    let van = false

    for (let i = 0; i < productos.length; i++) {
        if (productos[i].nombre == productoEliminar) {
            productos.splice(i, 1)
            van = true
        }
    }

    if (van == false) {
        mensaje.classList.add('noExsiteError')
        setTimeout(() => { mensaje.classList.remove('noExsiteError') }, 2500);
    }
    else {
        mensaje.classList.add('realizado')
        setTimeout(() => {
            mensaje.classList.remove('realizado')
            window.location.reload()
        }, 1500);
    }
    guardarAlmacenamientoLocal('productos', productos);
})

// mostrar productos
window.addEventListener("load", () => {
    const productoEd = document.getElementById('productoEditar')
    const productoEl = document.getElementById('productoEliminar')
    for (let i = 0; i < productos.length; i++) {
        productoEd.innerHTML += `<option>${productos[i].nombre}</option>`
        productoEl.innerHTML += `<option>${productos[i].nombre}</option>`
    }
    Object.keys(productos[0]).forEach(element => {
        atributoEd.innerHTML += `<option>${element}</option>`
    });

    let mostraProductos = document.getElementById('mostrarProductos')
    mostraProductos.innerHTML = ''
    for (let i = 0; i < productos.length; i++) {
        mostraProductos.innerHTML += `<div class="contenedorProductos"><img src="${productos[i].urlImagen}"><div class="informacion"><p>${productos[i].nombre}</p><p class="precio"><span>Precio: ${productos[i].valor}$</span></p> Existencia: ${productos[i].existencia}<p></p></div></div>`
    }
})

