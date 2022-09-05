import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
} from "reactstrap";
import { DataTable } from "@inftechsol/react-data-table";
import Wysiwyg from "../../../commons/Wysiwyg";
import { serializeValue } from "../../../commons/Serializer";
import { handleInputChange } from "../../../commons/InputHandlers";
import Services from "./Services";

/* const { serializer } = typeof window !== 'undefined' && import('@organw/wysiwyg-editor'); */

const Gdpr = (props) => {
  const { addNotification } = props;

  const defaultGdprObj = {
    azonosito: "",
    tipus: "",
    leiras: "",
    /*   leiras: serializer.deserialize('<p align="left" style="font-size:17px"></p>') */
  };

  const [gdprJson, setGdprJson] = useState([]);
  const [gdprObj, setGdprObj] = useState(defaultGdprObj);
  const [currentId, setCurrentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const listGdpr = () => {
    Services.listGdpr().then((res) => {
      if (!res.err) {
        setGdprJson(res);
      } else {
        addNotification("error", res.err);
      }
    });
  };

  useEffect(() => {
    listGdpr();
    serializeValue("def", defaultGdprObj, setGdprObj, "leiras");
  }, []);

  const getGdpr = (id) => {
    Services.getGdpr(id).then((res) => {
      if (!res.err) {
        serializeValue(
          "de",
          {
            azonosito: res.azonosito,
            tipus: res.tipus,
            leiras: res.leiras,
          },
          setGdprObj,
          "leiras"
        );
      } else {
        addNotification("error", res.err);
      }
    });
  };

  const onChangeEditor = ({ value }) => {
    setGdprObj({
      ...gdprObj,
      leiras: value,
    });
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleNewClick = () => {
    setCurrentId(null);
    serializeValue("def", defaultGdprObj, setGdprObj, "leiras");
    toggleModal();
  };

  const handleEditClick = (id) => {
    setCurrentId(id);
    getGdpr(id);
    toggleModal();
  };

  const handleDeleteClick = (id) => {
    setCurrentId(id);
    toggleDeleteModal();
  };

  const tableIconFormatter = (cell, row) => {
    return (
      <React.Fragment>
        {/* <Button
              key={rowIndex}
              color="link"
              onClick={() => handleViewClick(cell)}
            >
              <i key={rowIndex + 1} className="fas fa-eye" />
            </Button> */}
        <Button
          key={row.id + 1}
          color="link"
          onClick={() => handleEditClick(row.id)}
        >
          <i className="fas fa-pencil-alt" />
        </Button>
        <Button
          key={row.id + 2}
          color="link"
          onClick={() => handleDeleteClick(row.id)}
        >
          <i className="fas fa-trash" />
        </Button>
      </React.Fragment>
    );
  };

  const renderTable = () => {
    const columns = [
      {
        dataField: "azonosito",
        text: "Azonosító",
      },
      {
        dataField: "tipus",
        text: "Típus",
      },
      {
        dataField: "id",
        formatter: tableIconFormatter,
        text: "Műveletek",
      },
    ];

    const paginationOptions = {
      count: 5,
      color: "primary",
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
        {
          value: 50,
          text: "50",
        },
      ],
    };

    return (
      <DataTable
        bordered
        columns={columns}
        datas={gdprJson}
        paginationOptions={paginationOptions}
      />
    );
  };

  const onSave = (kuldObj) => {
    if (!currentId) {
      Services.addGdpr(kuldObj).then((res) => {
        if (!res.err) {
          listGdpr();
          toggleModal();
          addNotification("success", res.msg);
        } else {
          addNotification("error", res.err);
        }
      });
    } else {
      Services.editGdpr(kuldObj, currentId).then((res) => {
        if (!res.err) {
          listGdpr();
          toggleModal();
          addNotification("success", res.msg);
        } else {
          addNotification("error", res.err);
        }
      });
    }
  };

  const onDelete = () => {
    Services.deleteIGdpr(currentId).then((res) => {
      if (!res.err) {
        listGdpr();
        toggleDeleteModal();
        addNotification("success", res.msg);
      } else {
        addNotification("error", res.err);
      }
    });
  };

  const renderModal = () => {
    return (
      <Modal
        isOpen={modalOpen}
        toggle={toggleModal}
        size="lg"
        backdrop="static"
      >
        <ModalHeader>
          {!currentId ? "GDPR hozzáadása" : "GDPR módosítása"}
        </ModalHeader>
        <ModalBody>
          <div className="col-md-12">
            <Label>Azonosító:</Label>
            <Input
              type="text"
              name="azonosito"
              id="azonosito"
              value={gdprObj.azonosito}
              onChange={(e) => handleInputChange(e, gdprObj, setGdprObj)}
            />
          </div>
          <br />
          <div className="col-md-12">
            <Label>Típus:</Label>
            <Input
              type="select"
              name="tipus"
              id="tipus"
              value={gdprObj.tipus}
              onChange={(e) => handleInputChange(e, gdprObj, setGdprObj)}
            >
              <option key="" value="">
                Kérjük válasszon GDPR típust...
              </option>
              <option
                key="adatkezelesi_nyilatkozat"
                value="Adatkezelési nyilatkozat"
              >
                Adatkezelési nyilatkozat
              </option>
            </Input>
          </div>
          <br />
          <div className="col-md-12">
            <Label>Leíras:</Label>
            <Wysiwyg
              fontId="gdpr"
              onChange={onChangeEditor}
              value={gdprObj.leiras}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() =>
              serializeValue("se", gdprObj, () => {}, "leiras", onSave)
            }
          >
            Mentés
          </Button>
          <Button color="secondary" onClick={() => toggleModal()}>
            Mégsem
          </Button>
        </ModalFooter>
      </Modal>
    );
  };

  const renderDeleteModal = () => {
    return (
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader>GDPR törlése</ModalHeader>
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

  return (
    <div className="row">
      <div className="col-md-12">
        <Button color="success" onClick={() => handleNewClick()}>
          + GDPR hozzáadása
        </Button>
        <br />
        <br />
        {renderTable()}
        {renderModal()}
        {renderDeleteModal()}
      </div>
    </div>
  );
};

export default Gdpr;
