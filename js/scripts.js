//VARIABLES GLOBALES
let tareas = [];
let grupoFamiliar;
let seccionTareas = document.getElementById("SeccionTareas");
let seccionLogin = document.getElementById("SeccionLogin");

//VERIFICA SI HAY UN USUARIO LOGUEADO
const chequearUserStorage = () => {
  let usuarioLogeado = JSON.parse(localStorage.getItem("user"));

  if (usuarioLogeado != null) {
    seccionTareas.style.display = "";
    seccionLogin.style.display = "none";

    usuarioLogeadoExitoso(usuarioLogeado);
  } else {
    seccionTareas.style.display = "none";
    seccionLogin.style.display = "";
  }
};

//UNA VEZ LOGUEADO OBTIENE EL GRUPO FAMLIAR AL QUE PERTENECE EL USUARIO
const obtenerGrupo = async (id) => {
  let grupos = await fetch("../data/GrupoFamiliar.json")
    .then((response) => response.json())
    .then((data) => {
      return data.grupos;
    });

  let retorno = await grupos.find((g) => g.id == id);
  return retorno;
};

//UNA VEZ LOGUEADO OBTIENE LAS TAREAS DEL USUARIO
const busacarTareas = async (id) => {
  let tareasBuscadas = await fetch("../data/Tareas.json")
    .then((response) => response.json())
    .then((data) => {
      return data.tareas;
    });

  let retorno = await tareasBuscadas.filter((t) => t.responsable == id);

  return retorno;
};

//CHEQUEA QUE EL USUARIO EXISTA
const buscarUsuario = async (email, pass) => {
  let usuarios = await fetch("../data/Usuarios.json")
    .then((response) => response.json())
    .then((data) => {
      return data.usuarios;
    });

  let retorno = await usuarios.find(
    (u) => u.email == email && u.contrasenia == pass
  );

  return retorno;
};

//CARGA LOS MIEMBROS FAMILIARES EN EL SELECT DE RESPONSABLE
const cargarMiembrosFamiliares = async () => {
  let select = document.getElementById("inputResponsable");
  await grupoFamiliar.usuarios.forEach((user) => {
    let option = document.createElement("option");
    option.innerHTML = user.nombre;
    option.setAttribute("value", user.id);
    select.appendChild(option);
  });
};

//OBTIENE LOS DATOS INGRESADOS DE LA NUEVA TAREA
const obtenerTareaNueva = () => {
  //OBTENGO DEL HTML LOS DATOS INGRESADOS DE LA NUEVA TAREA

  let iCategoria = document.getElementById("inputCategoria").value;
  let iResponsable = document.getElementById("inputResponsable").value;
  let iTarea = document.getElementById("inputTarea").value;
  let iDescripcion = document.getElementById("inputDescripcion").value;

  return new Tarea(
    0,
    iCategoria,
    iResponsable,
    iTarea,
    iDescripcion,
    Tareas.EnCola,
    new Date(Date.now())
  );
};

//GENERA EL HTML PARA LA NUEVA TAREA INGRESADA
const generarHtmlTarea = (tarea) => {
  let restaFecha = calcularFecha(new Date(Date.now()), tarea.fecha);
  let unidadFecha = "";
  let valorFecha = 0;

  if (restaFecha.dias == 0 && restaFecha.horas == 0) {
    //No alcanza a un dia
    unidadFecha = "Minutos";
    valorFecha = restaFecha.minutos;
  } else if (restaFecha.dias == 0 && restaFecha.horas > 0) {
    unidadFecha = "Horas";
    valorFecha = restaFecha.horas;
  } else {
    unidadFecha = "Dias";
    valorFecha = restaFecha.dias;
  }

  let nuevatarea = `
                        <div class="card-body">
                            <h5 class="card-title">${tarea.tarea}</h5>
                            <p class="card-text">${tarea.descripcion}</p>
                            <p class="card-text">Responsable: ${tarea.responsable}</p>
                            <a href="#" class="btn btn-primary">${tarea.tipoTarea}</a>
                        </div>
                        <div class="card-footer text-muted">
                        Creado hace ${valorFecha} ${unidadFecha}
                        </div>`;

  //ELEMENTO CONTENEDOR DE LA TAREA
  let retorno = document.createElement("div");
  retorno.setAttribute("class", "card text-center");
  retorno.setAttribute("id", `borrar-${tarea.id}`);

  //GENERO EL BOTON PARA BORRARLO
  let btn = document.createElement("button");
  btn.setAttribute("class", "btn-close");
  btn.setAttribute("id", `${tarea.id}`);

  //HEADER
  let header = document.createElement("div");
  header.setAttribute("class", "card-header");
  header.innerHTML = `<h3>${tarea.categoria}</h3>`;
  header.appendChild(btn);
  retorno.appendChild(header);

  retorno.innerHTML += nuevatarea;

  return retorno;
};

//CALCULA DIFERENCIA ENTRE FECHAS
const calcularFecha = (fecha1, fecha2) => {
  let resta = fecha1.getTime() - fecha2.getTime();

  let restaDias = Math.round(resta / (1000 * 60 * 60 * 24));

  let restaHoras = Math.round(resta / (1000 * 60 * 60));

  let restaMin = Math.round(resta / (1000 * 60));

  let retorno = {
    dias: restaDias,
    horas: restaHoras,
    minutos: restaMin,
  };

  return retorno;
};

//DISPARADOR DEL AGREGAR TAREA
const encolarTarea = (event) => {
  //GENERO LA TAREA NUEVA
  let nueva = obtenerTareaNueva();

  let usuarioLogeado = JSON.parse(localStorage.getItem("user"));

  if (nueva.responsable == usuarioLogeado.id) {
    //PUSHEO AL ARRAY DE TAREAS
    tareas.push(nueva);

    //GENERO MI TAREA PARA AGREGAR AL HTML
    let htmlTarea = generarHtmlTarea(nueva);

    //OBTENGO LA LISTA DE TAREAS EN COLA Y AGREGO LA NUEVA TAREA
    let htmlTareasEnCola = document.getElementById("tareasEnCola");

    htmlTareasEnCola.appendChild(htmlTarea);

    let btn = document.getElementById(`${nueva.id}`);
    btn.addEventListener("click", borrarTarea);
  }
};

//PARA MOSTRAR TODO TIPO DE TAREAS
const mostrarTarea = (tarea) => {
  //GENERO MI TAREA PARA AGREGAR AL HTML
  let htmlTarea = generarHtmlTarea(tarea);

  //OBTENGO LA LISTA DE TAREAS EN COLA Y AGREGO LA NUEVA TAREA
  let htmlTareasEnCola = document.getElementById("tareasEnCola");
  let htmlTareasEnProceso = document.getElementById("tareasEnProceso");
  let htmlTareasEnFinalizada = document.getElementById("tareasFinalizadas");

  switch (tarea.tipoTarea) {
    case "En Cola":
      htmlTareasEnCola.appendChild(htmlTarea);
      break;

    case "En Proceso":
      htmlTareasEnProceso.appendChild(htmlTarea);
      break;

    case "Finalizado":
      htmlTareasEnFinalizada.appendChild(htmlTarea);
      break;
  }

  let btn = document.getElementById(`${tarea.id}`);
  btn.addEventListener("click", borrarTarea);
};

//DISPARADOR DE BORRAR UNA TAREA
const borrarTarea = (event) => {
  //BORRO DE LA LISTA
  let tareaBorrar = event.currentTarget.id;
  let tareaborrada = tareas.find((tarea) => tarea.id == tareaBorrar);

  tareas = tareas.filter((tarea) => tarea.id != tareaBorrar);

  //BORRO DEL HTML
  let elementoBorrar = document.getElementById(`borrar-${tareaBorrar}`);

  let htmlTareasEnCola = document.getElementById("tareasEnCola");
  let htmlTareasEnProceso = document.getElementById("tareasEnProceso");
  let htmlTareasEnFinalizada = document.getElementById("tareasFinalizadas");

  switch (tareaborrada.tipoTarea) {
    case "En Cola":
      htmlTareasEnCola.removeChild(elementoBorrar);
      break;

    case "En Proceso":
      htmlTareasEnProceso.removeChild(elementoBorrar);
      break;

    case "Finalizado":
      htmlTareasEnFinalizada.removeChild(elementoBorrar);
      break;
  }
};

//DISPARADOR DEL LOGIN
const login = (event) => {
  let email = document.getElementById("InputEmail1").value;
  let pass = document.getElementById("InputPassword1").value;

  let toastLogin = document.getElementById("toastLogin");
  let textoToast = document.getElementById("avisoLogin");

  buscarUsuario(email, pass)
    .then((data) => {
      if (data != null) {
        //USUARIO LOGEADO CON EXITO
        textoToast.innerHTML = "Inicio de sesion exitoso";
        usuarioLogeadoExitoso(data);
      }
    })
    .catch((data) => {
      //USUARIO Y CONTRASENIA EQUIVOCADAS
      textoToast.innerHTML = "El usuario o la contraseña estan mal";
    })
    .finally((data) => {
      let toast = new bootstrap.Toast(toastLogin);
      toast.show();
    });
};

const usuarioLogeadoExitoso = async (usuario) => {
  seccionTareas.style.display = "";
  seccionLogin.style.display = "none";
  localStorage.setItem("user", JSON.stringify(usuario));

  await obtenerGrupo(usuario.grupoFamiliar).then((grupo) => {
    grupoFamiliar = grupo;
    cargarMiembrosFamiliares();
  });
  await busacarTareas(usuario.id).then((tareasUser) => {
    tareasUser.forEach((t) => {
      let nueva = new Tarea(
        t.id,
        t.categoria,
        t.responsable,
        t.tarea,
        t.descripcion,
        t.tipoTarea,
        new Date(t.fecha)
      );
      tareas.push(nueva);
      mostrarTarea(nueva);
    });
  });
};

const cargaDeEventos = () => {
  //EVENTO PARAR AGREGAR UNA NUEVA TAREA
  let btnAgregarTarea = document.getElementById("iCrearTarea");
  btnAgregarTarea.addEventListener("click", encolarTarea);

  //EVENTO PARA HACER EL LOGIN
  let btnIniciarSesion = document.getElementById("btnLogin");
  btnIniciarSesion.addEventListener("click", login);
};

//FUNCIONES INCIALES
chequearUserStorage();
cargaDeEventos();
