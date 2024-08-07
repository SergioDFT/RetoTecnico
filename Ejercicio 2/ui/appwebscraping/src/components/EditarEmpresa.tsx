import { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Container, Row, Col, FormFeedback } from 'reactstrap';
import Swal from 'sweetalert2';
import { appsetings } from "../settings/appsetings";
import { IEmpresa } from "../Interfaces/IEmpresa";

interface IEditarEmpresaProps {
    id: number;
}

const initialEmpresa: IEmpresa = {
    razonSocial: '',
    nombreComercial: '',
    identificacionTributaria: '',
    numeroTelefonico: '',
    correoElectronico: '',
    sitioWeb: '',
    direccionFisica: '',
    pais: '',
    facturacionAnual: '',
    fechaUltimaEdicion: new Date()
};

const EditarEmpresa: React.FC<IEditarEmpresaProps> = ({ id }) => {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const [empresa, setEmpresa] = useState<IEmpresa>(initialEmpresa);
    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        const fetchEmpresa = async () => {
            const response = await fetch(`${appsetings.apiUrl}Empresa/${id}`);
            const data = await response.json();
            setEmpresa(data);
        };

        if (id) {
            fetchEmpresa();
        }
    }, [id]);

    const inputChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        setEmpresa({ ...empresa, [inputName]: inputValue });

        // Validation
        let error = {};
        switch (inputName) {
            case "identificacionTributaria":
                if (!/^\d{11}$/.test(inputValue) && inputValue !== "") {
                    error = { identificacionTributaria: "Identificación tributaria debe ser numérica y de 11 dígitos" };
                }
                break;
            case "numeroTelefonico":
                if (!/^\d{9}$/.test(inputValue) && inputValue !== "") {
                    error = { numeroTelefonico: "Número telefónico debe ser numérico y de 9 dígitos" };
                }
                break;
            case "correoElectronico":
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(inputValue) && inputValue !== "") {
                    error = { correoElectronico: "Correo electrónico debe ser válido" };
                }
                break;
            case "sitioWeb":
                if (!/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(inputValue) && inputValue !== "") {
                    error = { sitioWeb: "Sitio web debe ser un enlace válido" };
                }
                break;
            case "facturacionAnual":
                if (!/^\d+(\.\d{1,2})?$/.test(inputValue) && inputValue !== "") {
                    error = { facturacionAnual: "Facturación anual debe ser un número válido" };
                }
                break;
            default:
                break;
        }

        if (Object.keys(error).length === 0) {
            // Remove error if input is valid or empty
            const { [inputName]: _, ...rest } = errors;
            setErrors(rest);
        } else {
            setErrors({ ...errors, ...error });
        }
    };

    const guardar = async () => {
        empresa.fechaUltimaEdicion = new Date();

        // Check for errors before submitting
        const hasErrors = Object.keys(errors).some((key) => errors[key]);

        if (hasErrors) {
            Swal.fire({
                title: "Error!",
                text: "Por favor corrige los errores en el formulario",
                icon: "error"
            });
            return;
        }

        const response = await fetch(`${appsetings.apiUrl}Empresa/EditarEmpresa`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empresa)
        });
        if (response.ok) {
            toggle();
            Swal.fire({
                position: "top",
                icon: "success",
                title: "Se ha actualizado correctamente el proveedor",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire({
                title: "Error!",
                text: "No se pudo actualizar el proveedor",
                icon: "warning"
            });
        }
    };

    return (
        <>
            <Button color="primary ms-4" onClick={toggle}>
                Editar
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    Editar Proveedor
                </ModalHeader>
                <ModalBody>
                    <Container>
                        <Row>
                            <Col>
                                <Form>
                                    <FormGroup className="position-relative">
                                        <Label>Razón Social</Label>
                                        <Input type="text" name="razonSocial" onChange={inputChangeValue} value={empresa.razonSocial} />
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <Label>Nombre Comercial</Label>
                                        <Input type="text" name="nombreComercial" onChange={inputChangeValue} value={empresa.nombreComercial} />
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <Label>Identificación Tributaria</Label>
                                        <Input
                                            type="text"
                                            name="identificacionTributaria"
                                            onChange={inputChangeValue}
                                            value={empresa.identificacionTributaria}
                                            invalid={!!errors.identificacionTributaria}
                                        />
                                        <FormFeedback tooltip>
                                            {errors.identificacionTributaria}
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <Label>Número Telefónico</Label>
                                        <Input
                                            type="text"
                                            name="numeroTelefonico"
                                            onChange={inputChangeValue}
                                            value={empresa.numeroTelefonico}
                                            invalid={!!errors.numeroTelefonico}
                                        />
                                        <FormFeedback tooltip>
                                            {errors.numeroTelefonico}
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <Label>Correo Electrónico</Label>
                                        <Input
                                            type="email"
                                            name="correoElectronico"
                                            onChange={inputChangeValue}
                                            value={empresa.correoElectronico}
                                            invalid={!!errors.correoElectronico}
                                        />
                                        <FormFeedback tooltip>
                                            {errors.correoElectronico}
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <Label>Sitio Web</Label>
                                        <Input
                                            type="url"
                                            name="sitioWeb"
                                            onChange={inputChangeValue}
                                            value={empresa.sitioWeb}
                                            invalid={!!errors.sitioWeb}
                                        />
                                        <FormFeedback tooltip>
                                            {errors.sitioWeb}
                                        </FormFeedback>
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <Label>Dirección Física</Label>
                                        <Input type="text" name="direccionFisica" onChange={inputChangeValue} value={empresa.direccionFisica} />
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <Label>País</Label>
                                        <Input type="text" name="pais" onChange={inputChangeValue} value={empresa.pais} />
                                    </FormGroup>
                                    <FormGroup className="position-relative">
                                        <Label>Facturación Anual</Label>
                                        <Input
                                            type="text"
                                            name="facturacionAnual"
                                            onChange={inputChangeValue}
                                            value={empresa.facturacionAnual}
                                            invalid={!!errors.facturacionAnual}
                                        />
                                        <FormFeedback tooltip>
                                            {errors.facturacionAnual}
                                        </FormFeedback>
                                    </FormGroup>
                                </Form>
                                <Button color="primary" className="me-4" onClick={guardar}>Guardar</Button>
                                <Button color="secondary" className="me-4" onClick={toggle}>Cancelar</Button>
                            </Col>
                        </Row>
                    </Container>
                </ModalBody>
            </Modal>
        </>
    );
};

export default EditarEmpresa;
