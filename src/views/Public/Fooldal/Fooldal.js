import React from "react";
import { Helmet } from "react-helmet";

import FooldalContent from "./FooldalContent";

const Fooldal = (props) => {
  return (
    <div className="public-inner-content">
      <Helmet>
        <title>Myhome Ingatlanközvetítő Iroda</title>
      </Helmet>
      <FooldalContent {...props} />
    </div>
  );
};

export default Fooldal;
