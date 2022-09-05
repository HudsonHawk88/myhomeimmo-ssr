import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from "reactstrap";
import { DataTable } from "@inftechsol/react-data-table";

import { handleInputChange } from "../../../commons/InputHandlers";
import Services from "./Services";

const Jogosultsagok = (props) => {
  const defaultRole = {
    label: "",
    leiras: "",
    value: "",
  };

  const [rolesJson, setRolesJson] = useState([]);
  const [role, setRole] = useState(defaultRole);
  const [currentId, setCurrentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { addNotification } = props;

  const listRoles = () => {
    Services.listRoles().then((res) => {
      if (!res.err) {
        setRolesJson(res);
      } else {
        addNotification(res.err);
      }
    });
  };

  const init = () => {
    listRoles();
  };

  useEffect(() => {
    init();
  }, []);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const getRole = (id) => {
    Services.getRole(id).then((res) => {
      if (!res.err) {
        setRole(res);
      } else {
        addNotification(res.err);
      }
    });
  };

  const handleNewClick = () => {
    setCurrentId(null);
    setRole(defaultRole);
    toggleModal();
  };

  const handleEditClick = (id) => {
    setCurrentId(id);
    getRole(id);
    toggleModal();
  };

  const onSave = () => {
    if (!currentId) {
      Services.addRole(role).then((res) => {
        if (!res.err) {
          toggleModal();
          listRoles();
          addNotification("success", res.msg);
        } else {
          addNotification("error", res.err);
        }
      });
    } else {
      Services.editRole(role, currentId).then((res) => {
        if (!res.err) {
          toggleModal();
          listRoles();
          addNotification("success", res.msg);
        } else {
          addNotification("error", res.err);
        }
      });
    }
  };

  const renderModal = () => {
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        size="xl"
        backdrop="static"
      >
        <ModalHeader>
          {!currentId ? "Jogosultság hozzáadása" : "Jogosultság módosítása"}
        </ModalHeader>
        <ModalBody>
          <h4>Alapadatok:</h4>
          <br />
          <div className="row">
            <div className="col-md-4">
              <Label>Jogosultság neve: *</Label>
              <Input
                name="label"
                id="label"
                type="text"
                onChange={(e) => handleInputChange(e, role, setRole)}
                value={role.label}
              />
            </div>
            <div className="col-md-4">
              <Label>Leírás: </Label>
              <Input
                name="leiras"
                id="leiras"
                type="text"
                onChange={(e) => handleInputChange(e, role, setRole)}
                value={role.leiras}
              />
            </div>
            <div className="col-md-4">
              <Label>Jogosultság: *</Label>
              <Input
                name="value"
                id="value"
                type="text"
                onChange={(e) => handleInputChange(e, role, setRole)}
                value={role.value}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => onSave()}>
            Mentés
          </Button>
          <Button color="secondary" onClick={() => toggleModal()}>
            Mégsem
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const handleDeleteClick = (id) => {
    setCurrentId(id);
    toggleDeleteModal();
  };

  const onDelete = () => {
    Services.deleteRole(currentId).then((res) => {
      if (!res.err) {
        listRoles();
        toggleDeleteModal();
        addNotification("success", res.msg);
      } else {
        addNotification("error", res.err);
      }
    });
  };

  const renderDeleteModal = () => {
    return (
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader>Jogosultság törlése</ModalHeader>
        <ModalBody>
          <div className="col-md-12">
            {"Valóban törölni kívánja az adott tételt?"}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => onDelete()}>
            Igen
          </Button>
          <Button color="secondary" onClick={() => toggleDeleteModal()}>
            Mégsem
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const tableIconFormatter = (cell, row) => {
    return (
      <React.Fragment>
        <Button
          key={row.id}
          color="link"
          onClick={() => handleEditClick(row.id)}
          hidden={row.value === "SZUPER_ADMIN"}
        >
          <i className="fas fa-pencil-alt" />
        </Button>
        <Button
          key={row.id + 1}
          color="link"
          hidden={row.value === "SZUPER_ADMIN"}
          onClick={() => handleDeleteClick(row.id)}
        >
          <i key={row.id + 5} className="fas fa-trash" />
        </Button>
      </React.Fragment>
    );
  };

  const renderTable = () => {
    const filterOptions = [
      {
        id: 1,
        value: "Szuper admin",
        text: "Szuper admin",
      },
      {
        id: 2,
        value: "Kapcsolatok szerkesztés",
        text: "Kapcsolatok szerkesztés",
      },
      {
        id: 3,
        value: "Pénzügyi szolgáltatások",
        text: "Pénzügyi szolgáltatások",
      },
      {
        id: 4,
        value: "Ingatlan admin",
        text: "Ingatlan admin",
      },
    ];

    const columns = [
      {
        dataField: "label",
        text: "Jogosultság neve",
        filter: true,
        filterType: "textFilter",
        filterDefaultValue: "Keresés...",
      },
      {
        dataField: "leiras",
        text: "Leírás",
        filterType: "optionFilter",
        filterDefaultValue: "Kérem válasszon...",
        filterOptions: filterOptions,
      },
      {
        dataField: "value",
        text: "Jogosultság",
      },
      {
        dataField: "id",
        text: "Műveletek",
        formatter: tableIconFormatter,
      },
    ];

    const paginationOptions = {
      color: "primary",
      count: 5,
      nextText: ">",
      previousText: "<",
      firstPageText: "<<",
      lastPageText: ">>",
      rowPerPageOptions: [
        {
          value: 5,
          text: "5",
        },
        {
          value: 10,
          text: "10",
        },
        {
          value: 25,
          text: "25",
        },
      ],
    };

    return (
      <DataTable
        bordered
        datas={rolesJson}
        columns={columns}
        paginationOptions={paginationOptions}
      />
    );
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <Button type="button" color="success" onClick={() => handleNewClick()}>
          {" "}
          + Jogosultság hozzáadása{" "}
        </Button>
        <br />
        <br />
        {renderModal()}
        {renderDeleteModal()}
        {renderTable()}
      </div>
    </div>
  );
};

export default Jogosultsagok;
