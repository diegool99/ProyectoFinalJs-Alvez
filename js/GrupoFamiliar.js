class GrupoFamiliar {
    //CONSTRUCTOR
    constructor(id,nombre,usuarios){
        this.id = id;
        this.nombre = nombre;
        this.usuarios = usuarios;
    }
    //GETTERS

    get getId(){
        return this.id;
    }

    get getNombre(){
        return this.nombre;
    }

    get getUsuarios(){
        return this.usuarios;
    }

}