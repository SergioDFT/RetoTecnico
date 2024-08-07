export interface IEmpresa{
    id?:number,
    razonSocial:string,
    nombreComercial : string,
    identificacionTributaria: string,
    numeroTelefonico: string,
    correoElectronico: string,
    sitioWeb: string,
    direccionFisica: string,
    pais: string,
    facturacionAnual: string,
    fechaUltimaEdicion: Date
}