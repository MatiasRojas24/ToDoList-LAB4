import { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import styles from "./ModalCrearSprint.module.css";
import { ISprint } from "../../../types/ISprint";
import { sprintStore } from "../../../store/sprintStore";
import { useSprints } from "../../../hooks/useSprints";
import { crearSprintSchema } from "../../../schemas/modalCrearSprintSchema";
import * as Yup from "yup";

type IModalCrearSprint = {
  handleCloseModal: VoidFunction;
};

const initialState: ISprint = {
  nombre: "",
  fechaInicio: "",
  fechaCierre: "",
  tareas: [],
};

export const ModalCrearSprint: FC<IModalCrearSprint> = ({
  handleCloseModal,
}) => {
  const sprintActiva = sprintStore((state) => state.sprintActiva);
  const setSprintActiva = sprintStore((state) => state.setSprintActiva);
  const { crearSprint, putSprintEditar } = useSprints();
  const [formValues, setFormValues] = useState<ISprint>(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validar formulario completo
  useEffect(() => {
    if (sprintActiva) {
      setFormValues(sprintActiva);
      validateForm(sprintActiva);
    } else {
      setFormValues(initialState);
      validateForm(initialState);
    }
  }, [sprintActiva]);

  // Función para validar el formulario
  const validateForm = async (values: ISprint) => {
    try {
      await crearSprintSchema.validate(values, { abortEarly: false });
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
      await crearSprintSchema.validateAt(name, updatedValues); // Usa updatedValues
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

    try {
      await crearSprintSchema.validate(formValues, { abortEarly: false });
      setErrors({});

      if (sprintActiva) {
        putSprintEditar(formValues);
      } else {
        const formattedValues = {
          ...formValues,
          _id: crypto.randomUUID(),
          tareas: [],
        };
        crearSprint(formattedValues);
      }
      handleCloseModal();
      setSprintActiva(null);
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
    setSprintActiva(null);
    setFormValues(initialState);
  };

  // Determinar si el botón debe estar deshabilitado
  const isFormInvalid =
    Object.keys(errors).length > 0 ||
    !formValues.nombre ||
    !formValues.fechaInicio ||
    !formValues.fechaCierre;

  return (
    <div className={styles.containerPrincipalModal}>
      <div className={styles.contentPopUP}>
        <div>
          <h1>{sprintActiva ? "Editar Sprint" : "Crear Sprint"}</h1>
        </div>
        <form onSubmit={handleSubmit} className={styles.formContent}>
          <div>
            <label>Nombre</label>
            <input
              value={formValues.nombre}
              onChange={handleChange}
              type="text"
              autoComplete="off"
              name="nombre"
            />
            {errors.nombre && (
              <span className={styles.errors}>{errors.nombre}</span>
            )}

            <label>Fecha de inicio</label>
            <input
              value={formValues.fechaInicio}
              onChange={handleChange}
              type="date"
              min={sprintActiva ? new Date(sprintActiva.fechaInicio).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}
              name="fechaInicio"
            />
            {errors.fechaInicio && (
              <span className={styles.errors}>{errors.fechaInicio}</span>
            )}

            <label>Fecha de cierre</label>
            <input
              value={formValues.fechaCierre}
              onChange={handleChange}
              type="date"
              min={
                formValues.fechaInicio || new Date().toISOString().split("T")[0]
              }
              name="fechaCierre"
            />
            {errors.fechaCierre && (
              <span className={styles.errors}>{errors.fechaCierre}</span>
            )}
          </div>
          <div className={styles.buttonCard}>
            <button
              type="submit"
              className={styles.buttonCrearTarea}
              disabled={isFormInvalid}
            >
              {sprintActiva ? "Editar Sprint" : "Crear Sprint"}
            </button>
            <button
              type="button"
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
