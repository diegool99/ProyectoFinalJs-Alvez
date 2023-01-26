class Usuario {
  //CONSTRUCTOR
  constructor(id,nombre, email, contrasenia) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.contrasenia = contrasenia;
  }

  //GETTERS

  get getId() {
    return this.id;
  }

  get getNombre() {
    return this.nombre;
  }

  get getEmail() {
    return this.email;
  }

  get getContrasenia() {
    return this.contrasenia;
  }

  //SETTERS

  /**
     * @param {String} nombreNuevo
     */
  set setCategoria(nombreNuevo){
    return this.nombre = nombreNuevo;
}

  /**
     * @param {String} emailNuevo
     */
  set setEmail(emailNuevo){
    return this.email = emailNuevo;
}

  /**
     * @param {String} contraseniaNueva
     */
  set setEmail(contraseniaNueva){
    return this.contrasenia = contraseniaNueva;
}

}
