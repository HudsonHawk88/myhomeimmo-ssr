import React, { useState, useEffect } from "react";
import Services from "./Services";

const Rolunk = (props) => {
  const [rolunk, setRolunk] = useState([]);
  const [isHidden, setIsHidden] = useState([]);
  const [currentId, setCurrentId] = useState(1);

  const getDefaultIsHidden = (items) => {
    let newArray = [];
    items.forEach((item, index) => {
      newArray.push({
        isHidden: index === 0 ? true : false,
        item: item,
      });
    });
    setCurrentId(0);
    setIsHidden(newArray);
  };

  const getRolunk = () => {
    Services.listRolunk().then((res) => {
      if (!res.err) {
        setRolunk(res);
        getDefaultIsHidden(res);
      }
    });
  };

  const init = () => {
    getRolunk();
  };

  useEffect(() => {
    init();
  }, []);

  const toggleRolunk = (id) => {
    let items = isHidden;
    setCurrentId(id);
    items.forEach((el) => {
      if (el.item.id - 1 === id) {
        el.isHidden = !el.isHidden;
      } else {
        el.isHidden = false;
      }
    });
    setIsHidden(items);
  };

  const renderRolunk = () => {
    let aboutUs = JSON.parse(JSON.stringify(rolunk));
    return (
      aboutUs &&
      aboutUs.length !== 0 &&
      aboutUs.map((item, index) => {
        let kep = item.kep[0];
        return (
          <div
            className={`public_rolunk__item ${
              isHidden && isHidden.length !== 0 && isHidden[index].isHidden
                ? "active"
                : ""
            }`}
            key={index + "item"}
          >
            <div className="public_rolunk__kep">
              <div>
                <img src={kep.src} alt={item.nev} />
              </div>
            </div>
            <div className="public_rolunk__alapadatok">
              <div>
                <strong>{item.nev}</strong>
                <br />
                {item.beosztas}
                <br />
                <hr />
                {item.email}
                <br />
                {item.telefon}
                <br />
                <a
                  href="#"
                  hidden={
                    isHidden &&
                    isHidden.length !== 0 &&
                    isHidden[index].isHidden
                  }
                  onClick={() => toggleRolunk(index)}
                >
                  Több...
                </a>
              </div>
            </div>
          </div>
        );
      })
    );
  };

  const renderLeiras = () => {
    return (
      <React.Fragment>
        <div
          className="public_rolunk__leiras"
          id={currentId}
          hidden={
            isHidden && isHidden.length !== 0 && !isHidden[currentId].isHidden
          }
          dangerouslySetInnerHTML={{
            __html:
              isHidden &&
              isHidden.length !== 0 &&
              isHidden[currentId].item.leiras,
          }}
        />
        <a
          href="#"
          hidden={
            isHidden && isHidden.length !== 0 && !isHidden[currentId].isHidden
          }
          onClick={() => toggleRolunk(currentId)}
        >
          Kevesebb...
        </a>
      </React.Fragment>
    );
  };

  return (
    <div className="public_rolunk">
      {renderRolunk()}
      {renderLeiras()}
    </div>
  );
};

export default Rolunk;
