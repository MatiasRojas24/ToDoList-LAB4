import { ITarea } from './ITarea.ts'
export interface ISprint {
    id?: string;
    fechaInicio: string;
    fechaCierre: string;
    nombre: string;
    tareas: ITarea[]
}