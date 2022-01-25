const fs = require("fs");

class Contenedor{
    nombreArchivo;

    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo;
    };

    save(titulo, precio, urlImagen){
        let nombreArchivo = this.nombreArchivo;

        function leer(){
            try {
                let contenido = fs.readFileSync(`./${nombreArchivo}`, "utf-8");
                if(contenido === ""){
                    function guardar(){
                                try {
                                    let contador = 1;
                                    let producto = JSON.stringify([{"titulo": titulo,"precio": precio,"urlImagen": urlImagen,"id": contador}],null,2);
                                    fs.writeFileSync(`./${nombreArchivo}`, producto);
                                    console.log(`Se agrego a productos.txt un producto con id: ${contador}`);
                                } catch (error) {
                                    console.log(error, "Hubo un error");
                                };
                    };
                    guardar();
                }else if(contenido !== ""){
                    let array = JSON.parse(contenido);
                    let contador = array[array.length - 1].id;
                    function guardar(){
                        try {
                            contador += 1;
                            array.push({"titulo": titulo,"precio": precio,"urlImagen": urlImagen,"id": contador});
                            fs.writeFileSync(`./${nombreArchivo}`, JSON.stringify(array,null,2));
                            console.log(`Se agrego a productos.txt un producto con id: ${contador}`)
                        } catch (error) {
                            console.log(error, "Hubo un error");
                        };
                    };
                    guardar();
                };
            } catch (error) {
                console.log(error, "Hubo un error");
            };
        };
        leer();
    };

    async getById(id){
        try {
            let contenido = await fs.promises.readFile(`./${this.nombreArchivo}`, "utf-8");
            let array = JSON.parse(contenido);
            let objElegido = array.find(obj => obj.id === id);
            console.log(objElegido);
        } catch (error) {
            console.log(error, "Hubo un error");
        };
    };

    async getAll(){
        try {
            let contenido = await fs.promises.readFile(`./${this.nombreArchivo}`, "utf-8");
            return JSON.parse(contenido);
        } catch (error) {
            console.log(error, "Hubo un error");
        };
    };

    async deleteById(id){
        let nombreArchivo = this.nombreArchivo;
        try {
            let contenido = await fs.promises.readFile(`./${this.nombreArchivo}`, "utf-8");
            let array = JSON.parse(contenido);
            let nuevoArray = array.filter(obj => obj.id !== id);
            console.log(`Se elimino el objeto con id: ${id}`);
            async function escribirNuevoArray(nuevoArray){
                try {
                    await fs.promises.writeFile(`./${nombreArchivo}`, JSON.stringify(nuevoArray,null,2));
                } catch (error) {
                    console.log(error, "Hubo un error");
                };
            };
            escribirNuevoArray(nuevoArray);
        } catch (error) {
            console.log(error, "Hubo un error");
        };
    };

    
    async deleteAll(){
        try {
            await fs.promises.writeFile(`./${this.nombreArchivo}`, "");
            console.log("Se elimino todo el contenido de productos.txt");
        } catch (error) {
            console.log(error, "Hubo un error");
        };
    };
};

module.exports = Contenedor;