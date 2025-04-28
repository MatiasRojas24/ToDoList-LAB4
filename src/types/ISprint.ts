import { ITarea } from './ITarea.ts'
export interface ISprint {
    _id?: string;
    fechaInicio: string;
    fechaCierre: string;
    nombre: string;
    tareas: ITarea[]
}