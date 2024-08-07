import { ChangeEvent, useEffect, useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Container, Row, Col, Table } from 'reactstrap';
import Swal from 'sweetalert2';
import { appsetings } from "../settings/appsetings";
import { IEmpresa } from "../Interfaces/IEmpresa";
import { IWorldBankGroup } from "../Interfaces/IWorldBankGroup";
import { IOffshoreLeaks } from "../Interfaces/IOffshoreLeaks";
import { IOfacSdn } from "../Interfaces/IOfacSdn";

interface IScreeningProps {
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

const Screening: React.FC<IScreeningProps> = ({ id }) => {
    const [modal, setModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('OFAC SDN');
    const [searchOption, setSearchOption] = useState('OFAC SDN');
    const [empresa, setEmpresa] = useState<IEmpresa>(initialEmpresa);
    const [searchEmpresa, setSearchEmpresa] = useState<IEmpresa>(initialEmpresa);
    const [ofacSdns, setOfacSdns] = useState<IOfacSdn[]>([]);
    const [offshoreLeaks, setOffshoreLeaks] = useState<IOffshoreLeaks[]>([]);
    const [worldBankGroups, setWorldBankGroups] = useState<IWorldBankGroup[]>([]);
    const [dataToMap, setDataToMap] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);

    const toggle = () => setModal(!modal);

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
    };

    const handleSelectChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };

    const buscar = async () => {
        let response;
        if (selectedOption === 'OFAC SDN') {
            response = await fetch(`${appsetings.apiUrl}OfacSdn/${empresa.razonSocial}`, { method: "GET" });
            if (response.ok) {
                const data = await response.json();
                setOfacSdns(data.data);
                setDataToMap(data.data);
                setColumns(['Nombre', 'Tipo', 'Programa', 'Comentario']);
            } else {
                Swal.fire({ title: "Error!", text: "No se pudo encontrar la búsqueda", icon: "error" });
            }
        } else if (selectedOption === 'Offshore Leaks') {
            response = await fetch(`${appsetings.apiUrl}OffshoreLeak/${empresa.razonSocial}`, { method: "GET" });
            if (response.ok) {
                const data = await response.json();
                setOffshoreLeaks(data.data);
                setDataToMap(data.data);
                setColumns(['Nombre', 'País', 'Relacionado', 'Fuente']);
            } else {
                Swal.fire({ title: "Error!", text: "No se pudo realizar la búsqueda", icon: "error" });
            }
        } else if (selectedOption === 'World Bank Group') {
            response = await fetch(`${appsetings.apiUrl}WorldBankGroup/${empresa.razonSocial}`, { method: "GET" });
            if (response.ok) {
                const data = await response.json();
                setWorldBankGroups(data.data);
                setDataToMap(data.data);
                setColumns(['Nombre', 'País', 'Desde', 'Hasta', 'Motivo']);
            } else {
                Swal.fire({ title: "Error!", text: "No se pudo realizar la búsqueda", icon: "error" });
            }
        }

        setSearchOption(selectedOption);
        setSearchEmpresa({ ...empresa });
    };

    return (
        <>
            <Button color="secondary" onClick={toggle}>
                Screening
            </Button>
            <Modal size="xl" centered scrollable isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>
                    Screening
                </ModalHeader>
                <ModalBody>
                    <Container>
                        <Row>
                            <Col>
                                <Form>
                                    <FormGroup>
                                        <Label>Razón Social</Label>
                                        <Input type="text" name="razonSocial" onChange={inputChangeValue} value={empresa.razonSocial} />
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="select">Screening:</Label>
                                        <Input onChange={handleSelectChange} id="select" value={selectedOption} name="select" type="select">
                                            <option>OFAC SDN</option>
                                            <option>Offshore Leaks</option>
                                            <option>World Bank Group</option>
                                        </Input>
                                    </FormGroup>
                                    <Button color="primary" className="me-4" onClick={buscar}>Buscar</Button>
                                    <Button color="secondary" className="me-4" onClick={toggle}>Cancelar</Button>
                                </Form>
                                <Table hover responsive borderless striped className="table-light mt-5 text-center">
                                    <thead className="text-center">
                                        <tr>
                                            {columns.map((col, index) => (
                                                <th key={index}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="text-center">
                                        {dataToMap.map((item, index) => (
                                            <tr key={index}>
                                                {searchOption === 'OFAC SDN' && (
                                                    <>
                                                        <td>{item.nombre}</td>
                                                        <td>{item.tipo}</td>
                                                        <td>{item.programa}</td>
                                                        <td>{item.comentario}</td>
                                                    </>
                                                )}
                                                {searchOption === 'Offshore Leaks' && (
                                                    <>
                                                        <td>{item.nombre}</td>
                                                        <td>{item.pais}</td>
                                                        <td>{item.relacionado}</td>
                                                        <td>{item.fuente}</td>
                                                    </>
                                                )}
                                                {searchOption === 'World Bank Group' && (
                                                    <>
                                                        <td>{item.nombre}</td>
                                                        <td>{item.pais}</td>
                                                        <td>{item.desde}</td>
                                                        <td>{item.hasta}</td>
                                                        <td>{item.motivo}</td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Container>
                </ModalBody>
            </Modal>
        </>
    );
};

export default Screening;
