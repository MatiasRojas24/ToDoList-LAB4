import { create } from "zustand";
import { ITarea } from "../types/ITarea";

interface ITareaStore {
    tareas: ITarea[]
    tareaActiva: ITarea | null
    setTareaActiva: (tareaAciva: ITarea | null) => void
    setTareas: (arrayDeTareas: ITarea[]) => void
    agregarNuevaTarea: (nuevaTarea: ITarea) => void
    editarUnaTarea: (tareaActualizada: ITarea) => void
    eliminarUnaTarea: (idTarea: string) => void
}
export const tareaStore = create<ITareaStore>((set) => ({
    tareas: [],
    tareaActiva: null,
    setTareas: (arrayDeTareasIn) => set(() => ({ tareas: arrayDeTareasIn })),
    agregarNuevaTarea: (nuevaTareaIn) => set((state) => ({ tareas: [...state.tareas, nuevaTareaIn] })),
    editarUnaTarea: (tareaEditadaIn) => set((state) => {
        const arregloTarea = state.tareas.map((tarea) => tarea.id === tareaEditadaIn.id ? { ...tarea, ...tareaEditadaIn } : tarea)
        return { tareas: arregloTarea }
    }),
    eliminarUnaTarea: (idTareaIn) => set((state) => {
        const arregloTarea = state.tareas.filter((tarea) => tarea.id !== idTareaIn)
        return { tareas: arregloTarea }
    }),
    setTareaActiva: (tareaActivaIn) => set(() => ({ tareaActiva: tareaActivaIn })),
}))