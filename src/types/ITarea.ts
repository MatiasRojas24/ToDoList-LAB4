type EstadoTarea = "pendiente" | "completado" | "en progreso"
export interface ITarea {
    _id?: string;
    titulo: string;
    descripcion: string;
    estado?: EstadoTarea;
    fechaLimite: string
}