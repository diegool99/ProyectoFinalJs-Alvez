let punteroId = 1000;

const Tareas = {
    EnCola: "En Cola",
    EnProceso: "En Proceso",
    Finalizado: "Finalizado"
}

class Tarea {
    //CONSTRUCTOR
    constructor(id,categoria,responsable,tarea,descripcion,estado,fecha){
        if (id == 0) {
            this.id = punteroId++;
        }
        this.categoria = categoria;
        this.responsable = responsable;
        this.tarea = tarea;
        this.descripcion = descripcion;
        this.tipoTarea = estado;
        this.fecha = fecha;
        //this.tipoTarea = Tareas.EnCola;
        //this.fecha = new Date(Date.now());
    }

    //GETTERS

    get getId(){
        return this.id;
    }

    get getCategoria(){
        return this.categoria;
    }

    get getResponsable(){
        return this.responsable;
    }

    get getTarea(){
        return this.tarea;
    }

    get getDescripcion(){
        return this.descripcion;
    }

    get getTipoTarea(){
        return this.tipoTarea;
    }

    get getFecha(){
        return this.fecha;
    }

    //SETTERS

    /**
     * @param {String} categoriaNueva
     */
    set setCategoria(categoriaNueva){
        return this.categoria = categoriaNueva;
    }

    /**
     * @param {String} nuevoResponsable
     */
    set setResponsable(nuevoResponsable){
        return this.responsable = nuevoResponsable;
    }

    /**
     * @param {String} nuevoResponsable
     */
    set setTarea(tareaNueva){
        return this.tarea = tareaNueva;
    }

    /**
     * @param {String} nuevoResponsable
     */
    set setDescripcion(descNueva){
        return this.descripcion = descNueva;
    }

    /**
     * @param {String} nuevoResponsable
     */
    set setTipoTarea(nuevoTipo){
        return this.descripcion = nuevoTipo;
    }
}