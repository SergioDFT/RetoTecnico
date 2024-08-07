import { useEffect, useState } from "react"
import { appsetings } from "../settings/appsetings"
import Swal from "sweetalert2"
import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Modal, ModalBody, ModalHeader, Table } from "reactstrap"
import { IEmpresa } from "../Interfaces/IEmpresa"
import NuevaEmpresa from "./NuevaEmpresa";
import EditarEmpresa from "./EditarEmpresa";
import Screening from "./Screening";

export function Lista() {
    const [empresas, setEmpresas] = useState<IEmpresa[]>([]);

    const obtenerEmpresas = async () => {
        const response = await fetch(`${appsetings.apiUrl}Empresa`, { method: "GET" })
        if (response.ok) {
            const data = await response.json();
            setEmpresas(data.data);
        }
    }

    useEffect(() => {
        obtenerEmpresas()
    }, [])

    const Eliminar = (id: number) => {
        Swal.fire({
            title: "Estas seguro?",
            text: "Eliminar proveedor",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar!",
            cancelButtonText:"Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await fetch(`${appsetings.apiUrl}Empresa/EliminarEmpleado/${id}`, { method: "DELETE" })
                if (response.ok) {
                    await obtenerEmpresas()
                    Swal.fire({
                        title: "Eliminado!",
                        text: "El proveedor ha sido correctamente eliminado.",
                        icon: "success",
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            }
        });
    }

    return (
        <div>
            <Container className="mt-5">
                <Row>
                    <Col sm={{ size: 8, offset: 2 }}>
                        <h4>Lista de Proveedores</h4>
                        <hr />
                        <NuevaEmpresa />

                        <Table hover responsive borderless striped className="table-light mt-5 text-center">
                            <thead>
                                <tr>
                                    <th>Razón social</th>
                                    <th>Identificación Tributaria</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {
                                    empresas.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.razonSocial}</td>
                                            <td>{item.identificacionTributaria}</td>
                                            <td>
                                                <Screening id={item.id!} />
                                                <EditarEmpresa id={item.id!} />
                                                <Button className="ms-4" color="danger" onClick={() => { Eliminar(item.id!) }}>Eliminar</Button>
                                                
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </Table>

                    </Col>
                </Row>

            </Container>

        </div>
    );
}