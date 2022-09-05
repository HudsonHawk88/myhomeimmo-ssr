import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
} from "reactstrap";
import { DataTable } from "@inftechsol/react-data-table";
import Wysiwyg from "../../../commons/Wysiwyg";
import { serializeValue } from "../../../commons/Serializer";
import { useDropzone } from "react-dropzone";
/* import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; */

import { handleInputChange } from "../../../commons/InputHandlers";
import Services from "./Services";

const MyArtGaleriak = (props) => {
  const defaultMyArtGaleriakObj = {
    azonosito: "",
    nev: "",
    muveszNev: "",
    muveszTelefon: "",
    muveszEmail: "",
    muveszUrl: "",
    kepek: [],
    leiras: "",
    isActive: false,
  };

  const [myArtGaleriakJson, setMyArtGaleriakJson] = useState([]);
  const [myArtGaleriakObj, setMyArtGaleriakObj] = useState(
    defaultMyArtGaleriakObj
  );
  const [currentId, setCurrentId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const { addNotification } = props;

  const listGaleriak = () => {
    Services.listGaleriak().then((res) => {
      if (!res.err) {
        setMyArtGaleriakJson(res);
      } else {
        addNotification("error", res.err);
      }
    });
  };

  useEffect(() => {
    listGaleriak();
    serializeValue(
      "def",
      defaultMyArtGaleriakObj,
      setMyArtGaleriakObj,
      "leiras"
    );
  }, []);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const grid = 2;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    // padding: grid * 2,
    // margin: `0 ${grid}px 0 0`,

    // change background colour if dragging
    // background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    display: "flex",
    overflow: "auto",
    flexWrap: "wrap",
  });

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      myArtGaleriakObj.kepek,
      result.source.index,
      result.destination.index
    );

    setMyArtGaleriakObj({
      ...myArtGaleriakObj,
      kepek: items,
    });
  };

  const deleteImage = (filename) => {
    let kepek = myArtGaleriakObj.kepek;
    let filtered = kepek.filter((kep) => kep.filename !== filename);
    setMyArtGaleriakObj({
      ...myArtGaleriakObj,
      kepek: filtered,
    });
  };

  const MyDropzone = () => {
    const imageStyle = {
      // maxHeight: '100%',
      maxWidth: "50%",
    };
    let kep = {};
    const onDrop = useCallback((acceptedFiles) => {
      acceptedFiles.forEach((file) => {
        let base64 = "";
        const reader = new FileReader();

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = (event) => {
          // Do whatever you want with the file contents
          base64 = event.target.result;
          kep = {
            preview: base64,
            src: base64,
            file: file,
            filename: file.name,
            title: file.name,
            isCover: false,
          };

          setMyArtGaleriakObj({
            ...myArtGaleriakObj,
            kepek: [...myArtGaleriakObj.kepek, kep],
          });
        };
        reader.readAsDataURL(file);
      });
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    return (
      <React.Fragment>
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Kattintson vagy húzza id a feltöltendő képeket...</p>
        </div>
        <div className="row">
          {/*       <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        {...provided.droppableProps}
                        
                        >
                        {myArtGaleriakObj.kepek.map((item, index) => (
                            <Draggable key={item.title} draggableId={index.toString()} index={index} isDragDisabled={item.isCover}>
                            {(provided, snapshot) => (
                                <div
                                className='col-md-3'
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                    snapshot.isDragging,
                                    provided.draggableProps.style
                                )}
                                >
                                <Card key={index.toString()}>
                                    <CardTitle>{item.nev}</CardTitle>
                                    <CardBody>
                                        <img style={imageStyle} src={item.src || item.preview} alt={item.nev} />
                                    </CardBody>
                                    <CardFooter>
                                        <Button onClick={() => deleteImage(item.filename)}>Törlés</Button>
                                    </CardFooter>
                                </Card>
                                </div>
                            )}
                            </Draggable>
                            
                        ))}
                        {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
                </DragDropContext> */}
        </div>
      </React.Fragment>
    );
  };

  const getGaleria = (id) => {
    Services.getGaleria(id).then((res) => {
      if (!res.err) {
        serializeValue(
          "de",
          {
            azonosito: res.azonosito,
            nev: res.nev,
            muveszNev: res.muveszNev,
            muveszTelefon: res.muveszTelefon,
            muveszEmail: res.muveszEmail,
            muveszUrl: res.muveszUrl,
            kepek: res.kepek,
            leiras: res.leiras,
            isActive: res.isActive,
          },
          setMyArtGaleriakObj,
          "leiras"
        );
      } else {
        addNotification("error", res.err);
      }
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
    serializeValue(
      "def",
      defaultMyArtGaleriakObj,
      setMyArtGaleriakObj,
      "leiras"
    );
    toggleModal();
  };

  const handleEditClick = (id) => {
    setCurrentId(id);
    getGaleria(id);
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
        dataField: "nev",
        text: "Név",
      },
      {
        dataField: "muveszNev",
        text: "Művész neve",
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
        datas={myArtGaleriakJson}
        paginationOptions={paginationOptions}
      />
    );
  };

  const onSave = (kuldObj) => {
    if (!currentId) {
      Services.addGaleria(kuldObj).then((res) => {
        if (!res.err) {
          listGaleriak();
          toggleModal();
          addNotification("success", res.msg);
        } else {
          addNotification("error", res.err);
        }
      });
    } else {
      Services.editGaleria(kuldObj, currentId).then((res) => {
        if (!res.err) {
          listGaleriak();
          toggleModal();
          addNotification("success", res.msg);
        } else {
          addNotification("error", res.err);
        }
      });
    }
  };

  const onDelete = () => {
    Services.deleteGaleria(currentId).then((res) => {
      if (!res.err) {
        listGaleriak();
        toggleDeleteModal();
        addNotification("success", res.msg);
      } else {
        addNotification("error", res.err);
      }
    });
  };

  const onChangeEditor = ({ value }) => {
    setMyArtGaleriakObj({
      ...myArtGaleriakObj,
      leiras: value,
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
          {!currentId ? "MyArt galéria hozzáadása" : "MyArt galéria módosítása"}
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-4">
              <Label>Azonosító:</Label>
              <Input
                type="text"
                name="azonosito"
                id="azonosito"
                value={myArtGaleriakObj.azonosito}
                onChange={(e) =>
                  handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)
                }
              />
            </div>
            <div className="col-md-4">
              <Label>Név:</Label>
              <Input
                type="text"
                name="nev"
                id="nev"
                value={myArtGaleriakObj.nev}
                onChange={(e) =>
                  handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)
                }
              />
            </div>
            <div className="col-md-4">
              <Label>Művész neve:</Label>
              <Input
                type="text"
                name="muveszNev"
                id="muveszNev"
                value={myArtGaleriakObj.muveszNev}
                onChange={(e) =>
                  handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)
                }
              />
            </div>
            <div className="col-md-12" />
            <br />
            <div className="col-md-4">
              <Label>Művész telefonszáma:</Label>
              <Input
                type="text"
                name="muveszTelefon"
                id="muveszTelefon"
                value={myArtGaleriakObj.muveszTelefon}
                onChange={(e) =>
                  handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)
                }
              />
            </div>
            <div className="col-md-4">
              <Label>Művész e-mail címe:</Label>
              <Input
                type="email"
                name="muveszEmail"
                id="muveszEmail"
                value={myArtGaleriakObj.muveszEmail}
                onChange={(e) =>
                  handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)
                }
              />
            </div>
            <div className="col-md-4">
              <Label>Művész weblapja:</Label>
              <Input
                type="text"
                name="muveszUrl"
                id="muveszUrl"
                value={myArtGaleriakObj.muveszUrl}
                onChange={(e) =>
                  handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)
                }
              />
            </div>
            <div className="col-md-12" />
            <br />
            <div className="col-md-12">
              <Label>Képek: *</Label>
              <MyDropzone multiple />
            </div>
            <div className="col-md-12" />
            <br />
            <div className="col-md-4">
              <Label>Publikus:</Label>
              <Input
                type="checkbox"
                name="isActive"
                id="isActive"
                checked={myArtGaleriakObj.isActive}
                onChange={(e) =>
                  handleInputChange(e, myArtGaleriakObj, setMyArtGaleriakObj)
                }
              />
            </div>
            <div className="col-md-12" />
            <br />
            <div className="col-md-12">
              <Label>Leiras:</Label>
              <Wysiwyg
                fontId="myArtGaleria"
                onChange={onChangeEditor}
                value={myArtGaleriakObj.leiras}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() =>
              serializeValue("se", myArtGaleriakObj, () => {}, "leiras", onSave)
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
        <ModalHeader>MyArt általános bejegyzés törlése</ModalHeader>
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
          + MyArt galéria hozzáadása
        </Button>
        <br />
        <br />
        {myArtGaleriakJson && myArtGaleriakJson.length !== 0 && renderTable()}
        {renderModal()}
        {renderDeleteModal()}
      </div>
    </div>
  );
};

export default MyArtGaleriak;
