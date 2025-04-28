import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import styles from "./ModalCrearTarea.module.css";
import { ITarea } from "../../../types/ITarea";
import { tareaStore } from "../../../store/tareaStore";
import { useTareas } from "../../../hooks/useTareas";
import * as Yup from "yup";
import { crearTareaSchema } from "../../../schemas/modalCrearTareaSchema";
import mongoose from "mongoose";

type IModalCrearTarea = {
  handleCloseModal: VoidFunction;
};
const initialState: ITarea = {
  titulo: "",
  descripcion: "",
  fechaLimite: "",
};

export const ModalCrearTarea: FC<IModalCrearTarea> = ({ handleCloseModal }) => {
  const tareaActiva = tareaStore((state) => state.tareaActiva);
  const setTareaActiva = tareaStore((state) => state.setTareaActiva);
  const { crearTarea, putTareaEditar } = useTareas();
  const [formValues, setFormValues] = useState<ITarea>(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validar formulario completo
  useEffect(() => {
    if (tareaActiva) {
      setFormValues(tareaActiva);
      validateForm(tareaActiva);
    } else {
      setFormValues(initialState);
      validateForm(initialState);
    }
  }, [tareaActiva]);

  // Función para validar el formulario
  const validateForm = async (values: ITarea) => {
    try {
      await crearTareaSchema.validate(values, { abortEarly: false });
      setErrors({});
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessages: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) errorMessages[err.path] = err.message;
        });
        setErrors(errorMessages);
      }
    }
  };

  const handleChange = async (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedValues = { ...formValues, [name]: value };
    setFormValues(updatedValues);

    // Validación en tiempo real
    try {
      await crearTareaSchema.validateAt(name, updatedValues);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [name]: error.message }));
      }
    }

    await validateForm(updatedValues);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fechaAFormatear = formValues.fechaLimite
    formValues.fechaLimite = new Date(fechaAFormatear).toISOString().split("T")[0]
    try {
      await crearTareaSchema.validate(formValues, { abortEarly: false });
      setErrors({});

      if (tareaActiva) {
        putTareaEditar(formValues);
      } else {
        const formattedValues = {
          ...formValues,
          _id: new mongoose.Types.ObjectId().toString(),
          estado: formValues.estado ?? "pendiente",
          tareas: [],
        };
        crearTarea(formattedValues);
      }
      handleCloseModal();
      setTareaActiva(null);
      setFormValues(initialState);
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errorMessages: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) errorMessages[err.path] = err.message;
        });
        setErrors(errorMessages);
      }
    }
  };

  const handleCancelSubmit = () => {
    handleCloseModal();
    setTareaActiva(null);
    setFormValues(initialState);
  };

  // Determinar si el botón debe estar deshabilitado
  const isFormInvalid =
    Object.keys(errors).length > 0 ||
    !formValues.titulo ||
    !formValues.descripcion ||
    !formValues.fechaLimite;

  return (
    <div className={styles.containerPrincipalModal}>
      <div className={styles.contentPopUP}>
        <div>
          <h1>{tareaActiva ? "Editar Tarea" : "Crear Tarea"}</h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContent}>
          <div>
            Título
            <input
              value={formValues.titulo}
              onChange={handleChange}
              type="text"
              required
              autoComplete="off"
              name="titulo"
            />
            {errors.titulo && (
              <span className={styles.errors}>{errors.titulo}</span>
            )}
            Descripción
            <textarea
              value={formValues.descripcion}
              onChange={handleChange}
              required
              name="descripcion"
            />
            {errors.descripcion && (
              <span className={styles.errors}>{errors.descripcion}</span>
            )}
            Fecha Límite
            <input
              value={formValues.fechaLimite}
              onChange={handleChange}
              type="date"
              required
              autoComplete="off"
              name="fechaLimite"
            />
            {errors.fechaLimite && (
              <span className={styles.errors}>{errors.fechaLimite}</span>
            )}
          </div>
          <div className={styles.buttonCard}>
            <button
              className={styles.buttonCrearTarea}
              disabled={isFormInvalid}
            >
              {tareaActiva ? "Editar Tarea" : "Crear Tarea"}
            </button>
            <button
              className={styles.buttonCancel}
              onClick={handleCancelSubmit}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
